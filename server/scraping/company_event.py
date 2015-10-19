import time
import pandas as pd
import rethinkdb as r
import json
from research.companies import Companies
import math
import arrow
import requests
from queue import RQueue 

from rq import Queue
from worker import conn
q = Queue(connection=conn)

class CompanyEventCron:
    def _start(self):
        conn = r.connect(db="clearspark")
        contacts = list(r.table("user_contacts").run(conn))
        print pd.DataFrame(contacts)
        if pd.DataFrame(contacts).empty:
            print "NO USER CONTACTS"
            return 
        contacts = pd.DataFrame(contacts).drop_duplicates("domain")
        for i, c in contacts.iterrows():
            """
            job = q.enqueue(Companies()._daily_secondary_research, 
                            company_name, domain, api_key, lists, timeout=60000)
            """
            q.enqueue(Companies()._daily_secondary_research, 
                      c.company_name, c.domain, timeout=60000)

