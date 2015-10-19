from splinter import Browser
from rq import get_current_job
from google import Google
import json
import requests
from bs4 import BeautifulSoup
import tldextract
import pandas as pd
from pymongo import MongoClient
import os
from score import Score
from company_score import CompanyScore
import rq

from rq import Queue
from worker import conn
q = Queue(connection=conn)

class CompanyInfoCrawl:
    def _persist(self, data, source="", api_key=""):
        data['source'] = source
        data['api_key'] = api_key
        print source
        crawl = Parse().create('CompanyInfoCrawl', data).json()
        # if error
        print crawl
        queue_name = "{0}_{1}".format(data["company_name"], api_key)
        print queue_name
        if RQueue()._has_completed(queue_name):
            q.enqueue(CompanyScore()._company_info, data["company_name"], api_key)
        return crawl

    def _score(self, crawl_id):
        crawl = Parse()._pointer('CompanyInfoCrawl', crawl['objectId'])
        company = Parse().get('Company', {'where':json.dumps({'domain':data['domain']})}).json()
        data['crawl_source'] = [source for i in range(data.shape[0])]
        print company
        if company['results']:
            company = 'Company/'+company['results'][0]['objectId'], 
            data = {'__op':'AddUnique', "objects":[crawl]}
            print "update", Parse().update(company, {'crawls': data}).json()
        else:
            print Parse().create(company, {'crawls':[crawl],'domain':data['domain']}).json()

class CompanyEmailPatternCrawl:
    def _bulk_persist(self, data):
        ''' '''

    def _persist(self, data, source="", api_key=""):
        print source, data, "PERSISTING YOYO"
        data['crawl_source'] = source
        data['api_key'] = api_key
        for index, row in data.iterrows():
            print row.to_dict()
            r  = Parse().create('CompanyEmailPatternCrawl', row.to_dict()).json()
            print r
        if not data.to_dict("r"): return

        queue_name = "{0}_{1}".format(data.to_dict("r")[0]["domain"], api_key)

        if RQueue()._has_completed(queue_name):
            q.enqueue(Score()._email_pattern, data.to_dict('r')[0]["domain"], api_key)

class CompanyExtraInfoCrawl:
    def _persist(self, data, source, api_key=""):
        #TODO add source score
        if source == "blog_data": _source, score = "CompanyBlogPost", 0
        elif source == "builtwith": _source, score = "CompanyTechnology", 0
        elif source ==  "press": _source, score = "CompanyPressRelease", 0
        elif source ==  "glassdoor_reviews": _source, score = "CompanyGlassdoorReview", 0
        elif source ==  "employees": _source, score = "CompanyEmployee", 0
        elif source ==  "similar": _source, score = "CompanySimilar", 0
        elif source ==  "hiring": _source, score = "CompanyHiring", 0
        elif source ==  "general_news": _source, score = "CompanyNews", 0
        elif source ==  "linkedin_posts": _source, score = "CompanyLinkedinPost", 0
        elif source ==  "facebook_posts": _source, score = "CompanyFacebookPost", 0
        elif source ==  "tweets": _source, score = "CompanyTweet", 0
        else: _source, score = source, 0

        print _source
        #TODO - persist general researched flag timestamp
        #TODO - prevent duplicates
        _data = pd.DataFrame(data['data'])
        if _data.empty: return 
        if "company_name" in data.keys():
          _data["company_name"] = data["company_name"]
        _data["api_key"] = api_key
        if "domain" in data.keys(): _data["domain"] = data["domain"]
        #res1=Prospecter()._batch_df_create(_source, _data)
        #res2=Parse()._batch_df_create(_source, _data)
        #print res1, res2
        #print _data
        
        data["source"],data["_source"]=source, _source
        _data["source"],_data["_source"]=source, _source
        _data["source_score"] = score
        job = get_current_job()
        print job.meta
        _data["lists"] = [job.meta["lists"] if "lists" in job.meta.keys() else [] 
                          for i in _data.index]

        for i in _data.to_dict("r"):
            print "inserted", i 
            db["CompanyEvent"].insert(i)
        #print Prospecter()._batch_df_create("CompanyEvent", _data)
        #print Parse()._batch_df_create("CompanyEvent", _data)
