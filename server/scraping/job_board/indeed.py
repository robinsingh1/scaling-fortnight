import urllib 
import requests
from google import Crawlera
import pandas as pd
from bs4 import BeautifulSoup
import arrow
import rethinkdb as r

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

        print urls
        #pages = [Crawlera().get(url).text for url in urls]
        pages = [requests.get(url).text for url in urls]
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

              tmp = tmp.append(dict(zip(cols,[job_title,company.strip(),location,
                                              date,summary,link])), ignore_index=True)
          jobs = jobs.append(tmp)
        return jobs

    def _date_phrase_to_timestamp(self, indeed_df):
        timestamps = []
        for count, date in enumerate(indeed_df.date):
          now = arrow.now('US/Eastern')
          
          try:
              length = int(date.split(' ')[0].replace('+',''))*-1
          except: 
              timestamps.append(now.timestamp)
              continue
                
          if "minute" in date:
              timestamp = now.replace(minutes=length)
          elif "hour" in date:
              timestamp = now.replace(hours=length)
          elif ("day" or "days") in date:
              timestamp = now.replace(days=length, hour=0, minute=0,
                                      second=0, microsecond=0)
              timestamp = arrow.get(timestamp)
          elif ("Just") in date:  
              timestamp = now.timestamp
                
          timestamps.append(timestamp.timestamp)

        indeed_df['timestamp'] = timestamps
        return indeed_df
    
    def _cron(self, role, locale, profile, country=None):
        ''' Get Todays Jobs For Job Posting '''
        page = 0
        #companies = self._indeed_page(role, locale, page, country)
        indeed_results = self._search(role, page, locale, country)
        companies = self._search_results_html_to_df(indeed_results)
        print companies
        companies = companies[companies.date.str.contains("hour|minute|Just")]
        companies = self._date_phrase_to_timestamp(companies)
        companies = companies.drop_duplicates('company_name')
        companies["source"] = "Indeed"
        companies["keyword"] = role
        companies["profile"] = profile

        keys = [row.company_name.lower().replace(" ","")+"_"+profile for i, row in companies.iterrows()]
        companies["company_key"] = keys

        conn = r.connect(host="localhost", port=28015, db="triggeriq")
        r.table("hiring_signals").insert(companies.to_dict('r')).run(conn)

        # company_name+profile_id || company_name+user_id || company_name+co_id
        # || company_name+job_name+profile_id
        # persist

#cos = Indeed()._cron("Inside Sales","", {})
