from splinter import Browser
from hiring_signal import HiringSignal
import arrow
import time
import pandas as pd
from bs4 import BeautifulSoup
import requests
#from parse import Parse
# HiringSignal className - location, date, job_title, summary, company, timestamp
# Remove Duplicates

class Monster:
    def _browser(self, qry, locale=None, country=None):
        # location
        browser = Browser('phantomjs')
        if country == "Canada":
          browser.visit('http://jobsearch.monster.ca/')
        else:
          browser.visit('http://jobsearch.monster.com/')
        time.sleep(1)
        #qry = "inside sales"
        #browser.find_by_css('.b1 > input').first.fill('"{0}"'.format(qry))
        if qry[0] == '"' and qry[-1] == '"':
          browser.find_by_css('.b1 > input').first.fill('{0}'.format(qry))
        elif qry[0] == "'" and qry[-1] == "'":
          browser.find_by_css('.b1 > input').first.fill('{0}'.format(qry))
        else:
          browser.find_by_css('.b1 > input').first.fill('"{0}"'.format(qry))

        browser.find_by_css('.b1 > input').first.fill('{0}'.format(locale))
        browser.find_by_css('.searchButton').first.click()
        time.sleep(1)
        browser.find_by_css('#sort-by').first.click()
        browser.find_by_id('sort-by-dt.rv.di').first.click()
        return browser
    
    def _listings(self, browser):
        monster = BeautifulSoup(browser.html)
        table = monster.find('table',{'class':'listingsTable'})
        if not table: return 
        listings = []
        for row in table.find_all('tr'):
            if 'class' not in row.attrs: continue
            if row['class'][0] == "add": break
            if row['class'][0] not in ['even','odd']: continue
            job = row.find('div', {'class':'jobTitleContainer'})
            job = job.text if job else ""
            company = row.find('div',{'class':'companyContainer'})
            company = company.find_all('a')[-1] if company else None
            company = company.text if company else ""
            posted = row.find('div',{'class':'fnt20'})
            posted = posted.text.split('Posted:')[-1] if posted else ""
            location = row.find('div',{'class':'jobLocationSingleLine'})
            location = location.find('a') if location else None
            location = location.text if location else ""
            
            job = job.strip()
            company = company.split('Company:\n')[-1].strip()
            posted = posted.strip()
            location = location.strip()
            listings.append({'job_title':job, 'company_name':company, 
                             'date':posted, 'location':location,
                             'timestamp':arrow.now().timestamp})
        return pd.DataFrame(listings)

    def _signal(self, qry, locale, profile, report, country=None):
        browser = self._browser(qry, locale, country)
        listings = self._listings(browser)
        while "Today" == listings.date.tolist()[-1]:
            browser.find_by_css('.nextLink').first.click()
            listings = listings.append(self._listings(browser))   
        listings = listings[listings.date == "Today"]
        listings = listings.drop_duplicates('company_name')
        listings['source'] = 'Monster'
        listings['keyword'] = qry
        qry = {"include":"profiles"}
        _profile = profile["objectId"]
        profile = Parse().get("ProspectProfile/"+_profile, qry).json()
        while "objectId" not in profile.keys():
            time.sleep(3)
            profile = Parse().get("ProspectProfile/"+_profile, qry).json()

        HiringSignal()._persist(listings, profile, report)
            
# Paginate For Today
# Persist
# Add Hiring Signal
