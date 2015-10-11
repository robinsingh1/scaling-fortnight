from splinter import Browser
import requests
from bs4 import BeautifulSoup
import pandas as pd
import urllib
import time
from google import Google
import rq
#from queue import RQueue
from rq import Queue
from worker import conn
#from crawl import *
from fuzzywuzzy import fuzz
import rethinkdb as r
#from jigsaw import *

q = Queue(connection=conn)

class LinkedinTitleDir:
  def test(self, company_name):
      job = rq.get_current_job()
      print job.meta.keys()
      if "queue_name" in job.meta.keys():
        print RQueue()._has_completed(job.meta["queue_name"])
        print RQueue()._has_completed("queue_name")
        if RQueue()._has_completed(job.meta["queue_name"]):
          q.enqueue(Jigsaw()._upload_csv, job.meta["company_name"])

  def _search(self, company_name, api_key=""):
    qry = 'site:linkedin.com inurl:"at-{0}" inurl:title -inurl:job'
    #TODO - remove, all [".","'",","]
    name = company_name.strip().lower().replace(" ","-")
    dirs = Google().search(qry.format(name), 1)
    for url in dirs.url:
      q.enqueue(LinkedinTitleDir().parse, url, company_name)

  def parse(self, url, company_name):
    cache = Google().cache(url)
    soup = BeautifulSoup(cache)
    p = []

    for i in soup.find_all("div",{"class":"entityblock"}):
        try:
          img = i.find("img")["data-delayed-url"]
        except:
          img = i.find("img")["src"]
        profile = i.find("a")["href"]
        name = i.find("h3",{"class":"name"})
        name = name.text if name else ""
        title = i.find("p",{"class":"headline"})
        title = title.text if title else ""
        company = title.split("at ")[-1]
        title = title.split(" at ")[0]
        city = i.find("dd")
        city = city.text if city else ""
        cols = ["img","profile","name","title","city", "company"]
        vals = [img, profile, name, title, city, company]
        print vals
        p.append(dict(zip(cols, vals)))
    print p
    results = pd.DataFrame(p)
    if " " in company_name:
        results['company_score'] = [fuzz.partial_ratio(company_name, company)
                                    for company in results.company]
    else:
        results['company_score'] = [fuzz.ratio(company_name, company)
                                    for company in results.company]
    results = results[(results.company_score > 64)]
    data = {'data': results.to_dict("r"), 'company_name':company_name}
    CompanyExtraInfoCrawl()._persist(data, "employees", "")

    job = rq.get_current_job()
    print job.meta.keys()
    if "queue_name" in job.meta.keys():
      if RQueue()._has_completed(job.meta["queue_name"]):
        q.enqueue(Jigsaw()._upload_csv, job.meta["company_name"])

    return p

class GoogleEmployeeSearch:
    def test(self, company_name):
        job = rq.get_current_job()
        print job.meta.keys()
        if "queue_name" in job.meta.keys():
          print RQueue()._has_completed(job.meta["queue_name"])
          print RQueue()._has_completed("queue_name")
          if RQueue()._has_completed(job.meta["queue_name"]):
            q.enqueue(Jigsaw()._upload_csv, job.meta["company_name"])

    def _employees(self, company_name="", keyword="", api_key=""):
        ''' Linkedin Scrape '''
        # TODO - add linkedin directory search
        ''' Linkedin Scrape'''
        args = '-inurl:"/dir/" -inurl:"/find/" -inurl:"/updates" -inurl:"/title/" -inurl:"/pulse/"'
        args = args+' -inurl:"job" -inurl:"jobs2" -inurl:"company"'
        qry = '"at {0}" {1} {2} site:linkedin.com'
        qry = qry.format(company_name, args, keyword)
        #results = Google().search(qry, 10)
        results = Google().search(qry, 1)
        results = results.dropna()
        results = Google()._google_df_to_linkedin_df(results)
        _name = '(?i){0}'.format(company_name)
        print results.columns
        if results.empty: 
            print "No employees found for", company_name, keyword, api_key
            return results

        if " " in company_name:
            results['company_score'] = [fuzz.partial_ratio(_name, company) 
                                        for company in results.company_name]
        else:
            results['company_score'] = [fuzz.ratio(_name, company) 
                                        for company in results.company_name]
        if keyword != "":
            results['score'] = [fuzz.ratio(keyword, title) 
                                for title in results.title]
            results = results[results.score > 75]

        results = results[results.company_score > 64]
        results = results.drop_duplicates()
        results["company_id"] = api_key
        """"
        data = {'data': results.to_dict('r'), 'company_name':company_name}
        CompanyExtraInfoCrawl()._persist(data, "employees", "")

        job = rq.get_current_job()
        print job.meta.keys()
        if "queue_name" in job.meta.keys():
          if RQueue()._has_completed(job.meta["queue_name"]):
            q.enqueue(Jigsaw()._upload_csv, job.meta["company_name"])
        """
        return results

    def _update_record(self, company_name, keyword, _id):
        res = self._employees(company_name, keyword, _id)
        print "EMPLOYEES FOUND", company_name, res.shape
        conn = r.connect(host="localhost", port=28015, db="triggeriq")
        r.table('company_employees').insert(res.to_dict("r")).run(conn)
