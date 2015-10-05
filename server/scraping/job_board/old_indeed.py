from bs4 import BeautifulSoup
import pandas as pd
import codecs
from splinter import Browser
#import pusher
import requests
import re
from random import randint
import time
from urlparse import urlparse
import tldextract
from fake_useragent import UserAgent
import random, string
import uuid
import json
import urllib
import calendar
import datetime
import math
import difflib
from fuzzywuzzy import fuzz
from fuzzywuzzy import process
import arrow
from rq import Queue
#from clearspark import ClearSpark
#from queue import RQueue
from hiring_signal import HiringSignal
from google import Crawlera

#q = Queue(connection=conn)

class Indeed:
  def _search(self, qry, page, location='', country=None):
      ''' 
          Input  : Number of pages, job title qry
          Output : Array with raw html from all indeed pages 
      '''
      #print page, qry, location
      qry = {'q':'{0}'.format(qry),'sort': 'date', 'start': page*50,
             'limit': 50, 'l':location}

      print "INDEED LOCALE", location, country
      if country == "Canada":
        urls = ["http://ca.indeed.com/jobs?"+urllib.urlencode(qry)]
      elif country == "USA":
        urls = ["http://www.indeed.com/jobs?"+urllib.urlencode(qry)]
      else:
        canadian_url = ["http://ca.indeed.com/jobs?"+urllib.urlencode(qry)]
        american_url = ["http://www.indeed.com/jobs?"+urllib.urlencode(qry)]
        urls = canadian_url+american_url

      pages = [Crawlera().get(url).text for url in urls]
      return pages

  def _search_results_html_to_df(self, html_arr):
      '''
          Input  : Indeed.com raw_html
          Output : DF with relevant listing info
      '''
      jobs = pd.DataFrame(columns=['job_title','company_name','location','date','summary'])
      for count, page in enumerate(html_arr):
          soup = BeautifulSoup(page)
          tmp = pd.DataFrame()
          
          for row in soup.findAll('div',{'class':'row'}):
              job_title = row.find(attrs={'class':'jobtitle'}).text.strip() if row.find(attrs={'class':'jobtitle'}) else ""
              company = row.find('span',{'class':'company'}).text if row.find('span',{'class':'company'}) else ""
              location = row.find('span',{'class':'location'}).text if row.findAll('span',{'class':'location'}) else ""
              date = row.find('span',{'class':'date'}).text if row.findAll('span',{'class':'date'}) else ""
              summary = row.find('span',{'class':'summary'}).text.strip() if row.findAll('span',{'class':'summary'}) else ""
              link = "http://indeed.com"+row.find('a')["href"].strip() if row.findAll('a') else ""

              cols = ['job_title','company_name','location','date','summary',"link"]
              
              tmp = tmp.append(dict(zip(cols,[job_title,company,location,date,summary,link])), ignore_index=True)
          jobs = jobs.append(tmp)
      return jobs

  def _date_phrase_to_timestamp(self, indeed_df):
      timestamps = []
      for count, date in enumerate(indeed_df.date):
          now = arrow.now('US/Eastern')
          #print "length", date
          print date
          length = int(date.split(' ')[0].replace('+',''))*-1
          if "minute" in date:
              timestamp = now.replace(minutes=length)
          elif "hour" in date:
              timestamp = now.replace(hours=length)
          elif ("day" or "days") in date:
              timestamp = now.replace(days=length, hour=0, minute=0,
                                      second=0, microsecond=0)
              timestamp = arrow.get(timestamp)
          timestamps.append(timestamp.timestamp)

      indeed_df['timestamp'] = timestamps
      return indeed_df

  def update_parse_with_company_signal(self, companies):
      ''' - '''
      parse = Parse()
      companies  = companies[companies.linkedin_info != "not found"]
      companies = companies[['date','job_title','location','summary']]

      for index, row in companies.iterrows():
          signal = requests.post(parse._url.format('HiringSignal'),
                                 data= row.to_json(),
                                 headers= parse._headers).json()['objectId']
          companies.loc[index, 'hiring_signal'] = signal
          
          row['linkedin_info']['signals'] = [parse._pointer('HiringSignal', signal)]
          r = requests.post(parse._url.format('CompanySignal'),
                            data=json.dumps(dict(row['linkedin_info'])),
                            headers=parse._headers)

  def _parse_company_profile_into_query(self, profile_id):
      ''' Parse Profile '''
      parse = Parse()
      profiles = requests.get(parse._url.format('ProspectProfile/'+profile_id),
                              params={'include':'profiles'},
                              headers=parse._headers).json()['profiles']

      locales, roles = [], []
      for profile in profiles:
          if profile['className'] == "HiringProfile":
              roles = profile['roles']    
          elif profile['className'] == "LocationProfile":
              locales = profile['locale']
      locales = ["no location"] if locales == [] else locales

      return {'locales': locales, 'roles': roles}


  def _indeed_page(self, qry, location, page=0, country=None):
      indeed_results = self._search(qry, page, location, country)
      companies = self._search_results_html_to_df(indeed_results)
      companies = companies[companies.date.str.contains("hour|minute")]
      companies = self._date_phrase_to_timestamp(companies)
      companies = companies.drop_duplicates('company_name')
      return companies

  def _filter_results_based_on_company_profile(self):
      ''' Given DF With Company Info and Profile objectId filter '''

  def _download(self, args):
      #http://127.0.0.1:5000/hiring?type=bulk&qry=inside%20sales&location=toronto&prospect_list_name=hiring%20yo&user_id=D8U6u1OiM6&company_id=fqHWp5NsFx
      user = Parse()._pointer('_User', args['user_id'])
      _company = Parse()._pointer('Company', args['company_id'])
      data = {'name':args['prospect_list_name'], 'user':user, 'company':_company}
      r = Parse().create("CompanyProspectList", data)
      print r.json()
      _list = Parse()._pointer('CompanyProspectList', r.json()['objectId'])
      companies = self._indeed_page(args['qry'], args['location'], 1)
      for index, company in companies.iterrows():
          data = {'name':company['company'], 'hiring_signal':{}, 'lists':[_list]}
          data['user'] = user
          data['company'] = _company
          r = Parse().create('CompanyProspect', data)
          print r.json()
          url = 'https://murmuring-castle-6213.herokuapp.com/v1/companies/webhook'
          bjectId = r.json()['objectId']
          params = {'company_name':company['company'],'objectId': objectId}
          requests.get(url, params=params)

  def signal(self, profile_id):
      ''' Given HiringProfile objectId launch hiring job that were posted today '''
      parse = Parse()
      qry = self._parse_company_profile_into_query(profile_id)

      results = []
      print qry
      for role in qry['roles']:
          for locale in qry['locales']:
              page = 1
              companies = self._indeed_page(role, locale, page)
              while ("hour" or "minute") in str(companies.date.values[-1]): 
                  companies = companies.append(self._indeed_page(role, locale, page))
                  page = page + 1
      
              companies = companies[companies.date.str.contains('hour|minute')]
              print companies
              results.append(companies)
      self._persist(pd.concat(results), profile_id)
      return "lol"

  def mining_job(self, profile_id, timestamp):
      ''' Given a time period launch hiring job '''
      parse = Parse()
      qry = self._parse_company_profile_into_query(profile_id)
      timestamp = int(timestamp)

      results = []
      for role in qry['roles']:
          for locale in qry['locales']:
              page = 1
              companies = self._indeed_page(role, locale, page)
              day = arrow.get(timestamp).span('day')
              start, end = day[0].timestamp, day[-1].timestamp
              while int(companies.timestamp.values[-1]) <= end:
                  companies = companies.append(self._indeed_page(role, locale, page))
                  page = page + 1

              companies.timestamp = [int(t) for t in companies.timestamp]
              companies = companies[(start < companies.timestamp)]
              #companies = companies[(companies.timestamp < end)]
              print companies
              results.append(companies)
      self._persist(pd.concat(results), profile_id, True, timestamp)

  def _signal(self, role, locale, profile, report, country=None):
      ''' Get Todays Jobs For Job Posting '''
      print "Indeed"
      page = 0
      #companies = self._indeed_page(role, locale, page, country)
      indeed_results = self._search(role, page, locale, country)
      companies = self._search_results_html_to_df(indeed_results)
      print companies
      companies = companies[companies.date.str.contains("hour|minute")]
      companies = self._date_phrase_to_timestamp(companies)
      companies = companies.drop_duplicates('company_name')

      print companies.columns
      print companies
      if not companies.date.tolist(): return
      prev_len, new_len = len(companies.index), 0
      #while ("hour" or "minute") in str(companies.date.tolist()[-1]): 
      #while not companies[companies.date.str.contains("hour|minute")].empty: 
      #while not new_len == prev_len:
      for i in range(10):
          prev_len  = len(companies.index)
          companies = companies.append(self._indeed_page(role, locale, page, country))
          new_len = len(companies.index)
          page = page + 1
          print companies[companies.date.str.contains("hour|minute")].empty
          print companies[companies.date.str.contains("hour|minute")].shape
          print page
      companies = companies[companies.date.str.contains('hour|minute')]
      companies['source'] = "Indeed"
      companies['keyword'] = role
      HiringSignal()._persist(companies, profile, report)

