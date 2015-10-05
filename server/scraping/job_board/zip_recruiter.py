from splinter import Browser
#from hiring_signal import HiringSignal
import rethinkdb as r
import time
import pandas as pd
from bs4 import BeautifulSoup
import requests
import arrow
#from parse import Parse
from google import Crawlera
import urllib

class ZipRecruiter:
    def _html(self, qry, page=1, location="", country=None):
        #qry, page = "inside sales", 1
        if country:
          location = location + " " + country
        qry = {'search':'{0}'.format(qry), 'page':page,'location': location,'days':1}
        _url = "https://jobs.ziprecruiter.com/candidate/search?{0}"
        _url = _url.format(urllib.urlencode(qry))
        print _url
        return BeautifulSoup(Crawlera().get(_url).text)

    def _listings(self, html):
        listings = []
        all_listings = html.find('section',{'id':'job_results'})
        if not all_listings: return pd.DataFrame()
        all_listings = all_listings.find_all('article',{'class':'job_result'})
        for listing in all_listings:
            title = listing.find("span",{"itemprop":"title"})
            title = title.text.replace("NEW!","") if title else ""
            company = listing.find('span',{"itemprop":"name"})
            company = company.text if company else ""
            location = listing.find('span',{'itemprop':'address'})
            location = location.text.replace("\n","").replace("  "," ") if location else ""
            location = " ".join(location.split()) if location else ""
            desc = listing.find('p',{'itemprop':'description'})
            desc = desc.text.strip() if desc else ""
            time = listing.find('time',{'itemprop':'datePosted'})
            time = time["datetime"] if time else ""
            link = listing.find("a")
            link = link["href"] if link else ""
            cols = ["job_title","company_name","location","summary","date",'timestamp',"link"]
            vals = [title, company, location, desc, time, arrow.get(time).timestamp, link]
            listings.append(dict(zip(cols, vals)))
        return pd.DataFrame(listings)
    
    def _signal(self, qry, locale, profile, report, country=None):
        html = self._html(qry, 1, locale, country)
        listings = self._listings(html)
        last_page = html.find('ul',{'class':'paginationNumbers'})
        last_page = last_page.find_all('li') if last_page else None
        last_page = int(last_page[-1].text.strip()) if last_page else 1
        for page in range(last_page):
            html = self._html(qry, page, locale, country)
            listings = listings.append(self._listings(html))
        listings['source'] = 'Zip Recruiter'
        listings["keyword"] = qry
        listings["profile"] = profile
        print listings
        companies = listings
        keys = [row.company_name.lower().replace(" ","")+"_"+profile for i, row in companies.iterrows()]
        companies["company_key"] = keys

        conn = r.connect(host="localhost", port=28015, db="triggeriq")
        r.table("hiring_signals").insert(companies.to_dict('r')).run(conn)
        #HiringSignal()._persist(listings, profile, report)

