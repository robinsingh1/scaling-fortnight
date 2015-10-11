from splinter import Browser
#from hiring_signal import HiringSignal
import time
import rethinkdb as r
import pandas as pd
from bs4 import BeautifulSoup
import requests
import arrow
#from parse import Parse

class SimplyHired:
    def _html(self, qry, page=1, locale="", country=None):
        qry = {'q':qry,'fln':'any','sb':'dd', 'pn':page, "l":locale}
        if country == "Canada":
          r = requests.get('http://www.simplyhired.ca/search', params=qry)
        else:
          r = requests.get('http://www.simplyhired.com/search', params=qry)
        return BeautifulSoup(r.text)
        
    def _listings(self, html):
        listings = []
        for job in html.find_all('div',{'class':'job'}):
            title = job.find('h2')
            company = job.find('a',{"itemprop":"name"})
            #print company
            location = job.find('span',{'class':'location'})
            desc = job.find('p',{'class':'description'})
            posted = job.find('span',{'class':'ago'})
            link = job.find("a", {"class":"title"})
            link = link["href"] if link else ""
            
            cols = ['job_title','company_name','location','summary','date']
            vals = [title, company, location, desc, posted]
            vals = [i.text.strip() if i else "" for i in vals]
            vals = dict(zip(cols, vals))
            vals["link"] = "http://simplyhired.com"+link
            vals['timestamp'] = arrow.now().timestamp
            listings.append(vals)
        return pd.DataFrame(listings)
        
    def _signal(self, qry, locale, profile, country=None):
        page = 1
        print "Simply Hired"
        html = self._html(qry, page, locale, country)
        listings = self._listings(html)
        #print listings
        if listings.empty: return "none found"
        while 'day' not in listings.date.tolist()[-1]:
            page = page + 1
            html = self._html(qry, page, locale, country)
            listings = listings.append(self._listings(html))
            print page
        listings = listings[~listings.date.str.contains('day')]
        listings["keyword"] = qry
        listings = listings.drop_duplicates('company_name')
        listings['source'] = 'Simply Hired'
        listings["profile"] = profile
        #print listings
        companies = listings

        keys = [row.company_name.lower().replace(" ","")+"_"+profile for i, row in companies.iterrows()]
        companies["company_key"] = keys

        conn = r.connect(host="localhost", port=28015, db="triggeriq")
        r.table("hiring_signals").insert(companies.to_dict('r')).run(conn)
        r.table("triggers").insert(companies.to_dict('r')).run(conn)
