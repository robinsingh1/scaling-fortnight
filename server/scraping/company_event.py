import time
import numpy as np
import pandas as pd
import rethinkdb as r
import json
#from research.companies import Companies
from companies import Companies
import math
import arrow
import requests
from queue import RQueue 

from research.company_db import *
from research.social import *
from research.li import *
from research.zoominfo import *
import requests
import grequests
from google import Google
from newspaper import Article

from rq import Queue
from worker import conn as _conn
q = Queue(connection=_conn)

class CompanyEventCron:
    def _parse_article(self, key, url):
        a = Article('')
        html = Google().cache(url)
        a.set_html(html)
        a.parse()
        a.nlp()
        article = {"summary":a.summary,
                  "publish_date":a.publish_date,
                  "images":a.images,
                  "top_image":a.top_image,
                  "title":a.title,
                  "authors":a.authors,
                  "keywords":a.keywords,
                  "text":a.text}
        # update
        conn = r.connect(db="clearspark")
        #

    def _start(self):
        rethink_conn = r.connect(db="clearspark")
        #contacts = list(r.table("user_contacts").run(conn))
        #if pd.DataFrame(contacts).empty:
        #    print "NO USER CONTACTS"
        #    return 

        #contacts = pd.DataFrame(contacts).drop_duplicates("domain")
        cos = r.table("companies").run(rethink_conn)
        cos = pd.DataFrame(list(cos))
        peeps = r.table("user_social_profiles").run(rethink_conn)
        peeps = pd.DataFrame(list(peeps))
        handles = cos.handles.dropna().sum() + peeps.handles.dropna().sum()
        print len(handles)
        
        for i, c in cos.iterrows():
            name, domain = c["name"], c["domain"]
            #q.enqueue(Companies()._company_blog, domain)
            #q.enqueue(Companies()._press_releases, name, domain)
            #q.enqueue(Companies()._news, name, domain)
            #q.enqueue(Companies()._hiring, name, domain)
            #q.enqueue(Companies()._recent_webpages_published, domain, 1)
            q.enqueue(GlassDoor()._events, domain, name)

            if type(c.handles) is float: break

            for handle in c.handles:
                if "twitter" in handle:
                    q.enqueue(Twitter()._events, handle)
                elif "facebook" in handle:
                    q.enqueue(Facebook()._events, handle)
                elif "linkedin" in handle:
                    q.enqueue(Linkedin()._events, handle)

        for i, p in peeps.iterrows():
            if type(p.handles) is float: break
            for handle in p.handles:
                if "twitter" in handle:
                    q.enqueue(Twitter()._events, handle)
                elif "facebook" in handle:
                    q.enqueue(Facebook()._events, handle)
                elif "linkedin" in handle:
                    q.enqueue(Linkedin()._events, handle)
