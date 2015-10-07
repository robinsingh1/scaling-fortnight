from splinter import Browser
import urllib2
import requests
from bs4 import BeautifulSoup
import json
import pandas as pd
from clearbit_search import ClearbitSearch
import rethinkdb as r
#from queue import RQueue

from rq import Queue
from worker import conn
q = Queue(connection=conn)

class EmailHunter:
    def old_get(self, domain, api_key=""):
        url = "http://api.emailhunter.co/v1/search?domain={0}&api_key=0191b3bdcf20b25b778da18bca995911cec0f630"
        url = url.format(domain)
        # if emails found return
        html = requests.get(url).text
        print "EMAIL HUNTER"
        print html
        e = json.loads(html)
        e = pd.DataFrame(e["emails"])
        if e.empty: return 0
        e = e[e.type == "personal"]
        e = e[~e.value.str.contains("\+")]
        for i, row in e.iterrows():
            job = q.enqueue(ClearbitSearch()._email_search, row.value, api_key, timeout=6000)
            print "EMAILHUNTER", domain, api_key
            #RQueue()._meta(job, "{0}_{1}".format(domain, api_key))
            if i > 10: break
        return e.shape[0]

    def _update_record(self, domain, _id):
        url = "http://api.emailhunter.co/v1/search?domain={0}&api_key=0191b3bdcf20b25b778da18bca995911cec0f630"
        url = url.format(domain)
        # if emails found return
        html = requests.get(url).text
        res = json.loads(html)
        if "pattern" in res.keys():
          del res["emails"]
          conn = r.connect(host="localhost", port=28015, db="triggeriq")
          #r.table('hiring_signals').get(_id).update({"email_pattern":res}).run(conn)
          r.table('triggers').get(_id).update({"email_pattern":res}).run(conn)
