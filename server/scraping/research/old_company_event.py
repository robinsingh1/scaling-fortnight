from parse import Prospecter as Parse
import time
import pandas as pd
import json
from companies import Companies
import math
import arrow
import requests
from queue import RQueue 

from rq import Queue
from worker import conn
q = Queue(connection=conn)

class OldCompanyEventCron:
    def remove_non_ascii(self, text):
        return ''.join(i for i in text if ord(i)<128)

    def _create_feed_from_list(self, list_type, _list):
        prospects = Parse().get("Prospect", {"where":json.dumps({"lists":Parse()._pointer(list_type, _list)}),
                                "include":"company"}).json()["results"]
        print len(prospects)
        prospects = self._add_lists(prospects, "all_prospect")
        prospects = pd.DataFrame(prospects)
        self._make_requests(prospects)

    def _create_feed_for_all_lists(self):
        qry = {"limit":1000}
        prospect_lists = Parse().get("ProspectList", qry).json()["results"]
        for i in prospect_lists:
           q.enqueue(CompanyEventCron()._create_feed_from_list,   
                     "ProspectList", i["objectId"], timeout=60000) 

        prospect_lists = Parse().get("CompanyProspectList", qry).json()["results"]
        for i in prospect_lists:
           q.enqueue(CompanyEventCron()._create_feed_from_list,   
                     "CompanyProspectList", i["objectId"], timeout=60000) 

    def _add_lists(self, prospects, db_type):
        cl = pd.DataFrame(Parse().get("ContactList").json()["results"])
        cl["user_id"] = [i["objectId"] for i in cl.user]
        for count, i in enumerate(prospects):
            user_id = i["user"]["objectId"]
            _cl = cl[(cl.user_id == user_id) & (cl.db_type == db_type)]
            if "company" in i.keys():
                if "domain" in i["company"].keys():
                    prospects[count]["domain"] = i["company"]["domain"]
            list_id = _cl.to_dict("r")[0]["objectId"]
            if "lists" in i.keys():
                prospects[count]["lists"].append({"objectId":list_id})
            else:
                prospects[count]["lists"] = [{"objectId":list_id}]
        return prospects

    def _make_requests(self, tmp):
        i = 0
        for i, row in tmp.iterrows():
            row.loc[i, "researched"] = "researched" in row.company.keys()

        if tmp.empty: return
        print tmp.shape
        for a, b in tmp.groupby("domain"):
            if a == ".": continue
            i = i + 1
            
            if b.lists.dropna().sum():
                lists = [ii["objectId"] for ii in b.lists.dropna().sum() if "objectId" in ii.keys()]
                lists = pd.Series(lists).unique().tolist()
                company_name, domain = b.company_name.tolist()[0], a
                print lists, company_name, domain
                # todo if company has been general_researched only do daily research
                
                if b.researched:
                    ''' '''
                else:
                    ''' '''
                r = requests.post("https://clear-spark.herokuapp.com/v1/clearspark/daily_news",
                #r = requests.post("http://localhost:4000/v1/clearspark/daily_news",
                      headers={'Content-type': 'application/json'},
                      data=json.dumps({"company_name":company_name,"domain":domain,
                            "lists":lists,"source":"blog"}))
                
                print r.text

    def _old_start(self):
        print "started"
        cp = Parse()._bulk_get("CompanyProspect")
        p  = Parse()._bulk_get("Prospect")
        uc = Parse()._bulk_get("UserContact")

        cl = Parse().get("ContactList",{"limit":1000}).json()["results"]
        print cl
        cl = pd.DataFrame(cl)
        print cl.head()
        cl["user_id"] = [i["objectId"] for i in cl.user]

        for count, i in enumerate(cp):
            if "company" in i.keys():
                if "domain" in i["company"].keys():
                    cp[count]["domain"] = i["company"]["domain"]
                    
        for count, i in enumerate(p):
            if "company" in i.keys():
                if "domain" in i["company"].keys():
                    p[count]["domain"] = i["company"]["domain"]
                    
        for count, i in enumerate(uc):
            if "company" in i.keys():
                if "name" in i["company"].keys():
                    uc[count]["company_name"] = i["company"]["name"] 
                else:
                    uc[count]["company_name"] = ""
            else:
                uc[count]["company_name"] = ""

        # Adding Lists To Contacts / Prospects
        for count, i in enumerate(cp):
            if "user" not in i.keys(): continue
            user_id = i["user"]["objectId"]
            _cl = cl[(cl.user_id == user_id) & (cl.db_type =="all_company_prospect")]
            al = cl[(cl.user_id == user_id) & (cl.db_type =="all_feed_prospect")]
            _cl, al = _cl.to_dict('r'), al.to_dict('r')
            all_feed_id = al[0]["objectId"] if al else ""
            list_id = _cl[0]["objectId"] if _cl else ""
            if "lists" in i.keys():
                cp[count]["lists"] = cp[count]["lists"]+[{"objectId":list_id},{"objectId":all_feed_id}]
            else:
                cp[count]["lists"] = [{"objectId":list_id},{"objectId":all_feed_id}]
                
        for count, i in enumerate(p):
            if "user" not in i.keys(): continue
            user_id = i["user"]["objectId"]
            _cl = cl[(cl.user_id == user_id) & (cl.db_type =="all_prospect")]
            al = cl[(cl.user_id == user_id) & (cl.db_type =="all_feed_prospect")]
            _cl, al = _cl.to_dict('r'), al.to_dict('r')
            all_feed_id = al[0]["objectId"] if al else ""
            list_id = _cl[0]["objectId"] if _cl else ""
            if "lists" in i.keys():
                p[count]["lists"] = p[count]["lists"]+[{"objectId":list_id},{"objectId":all_feed_id}]
            else:
                p[count]["lists"] = [{"objectId":list_id},{"objectId":all_feed_id}]
                    
        for count, i in enumerate(uc):
            if "user" not in i.keys(): continue
            db_type, user_id = i["db_type"], i["user"]["objectId"]
            _cl = cl[(cl.user_id == user_id) & (cl.db_type == db_type)]
            al = cl[(cl.user_id == user_id) & (cl.db_type =="all_feed_prospect")]
            _cl, al = _cl.to_dict('r'), al.to_dict('r')
            all_feed_id = al[0]["objectId"] if al else ""
            list_id = _cl[0]["objectId"] if _cl else ""
            if "lists" in i.keys():
                uc[count]["lists"] = uc[count]["lists"]+[{"objectId":list_id},{"objectId":all_feed_id}]
            else:
                uc[count]["lists"] = [{"objectId":list_id},{"objectId":all_feed_id}]

        _p, _cp, _uc = pd.DataFrame(p), pd.DataFrame(cp), pd.DataFrame(uc)
        #print _p[_p.domain.isnull()].shape, _p.shape
        #print _cp[_cp.domain.isnull()].shape, _cp.shape
        # for user pointer add user_contact_list pointer
        print _p.shape, _cp.shape, _uc.shape

        i, j, tmp = 0, 0, pd.concat([_cp, _p, _uc]).reset_index()

        print tmp.domain.drop_duplicates().shape
        #return
        for a, b in tmp[["domain","lists","company_name","user"]].groupby("domain"):
            if a == ".": continue
            i = i + 1
            
            if b.lists.dropna().sum():
                j = j + 1
                lists = [ii["objectId"] for ii in b.lists.dropna().sum() if "objectId" in ii.keys()]
                lists = pd.Series(lists).unique().tolist()
                company_name, domain = b.company_name.tolist()[0], a
                #print lists, a, b.company_name.tolist()[0]
                
                '''
                r = requests.post("https://clear-spark.herokuapp.com/v1/clearspark/daily_news",
                #r = requests.post("http://localhost:4000/v1/clearspark/daily_news",
                      headers={'Content-type': 'application/json'},
                      data=json.dumps({"company_name":company_name,"domain":domain,
                            "lists":lists,"source":"blog"}))
                
                print r.text

                '''
                api_key = "9a31a1defcdc87a618e12970435fd44741d7b88794f7396cbec486b8"
                #if i > 2: break
                x = 600000
                #job = q.enqueue(Companies()._news, domain, api_key, company_name, timeout=x)
                company_name = self.remove_non_ascii(company_name)
                domain = self.remove_non_ascii(domain)

                print j, company_name, domain#, lists, tmp.shape
                job = q.enqueue(Companies()._daily_secondary_research, 
                                company_name, domain, api_key, lists, timeout=60000)
                '''
                job = q.enqueue(Companies()._recent_webpages_published, 
                                 domain, api_key, company_name, timeout=60000)
                #time.sleep(0.5)
                #print lists

                job.meta["lists"] = lists
                job.meta["_lists"] = lists
                job.save()
                #RQueue()._meta(job, "lists", lists)
                '''
                '''
                '''

    def _start(self):
        #conn = r.connect(db="clearspark")
        conn = r.connect(**rethink_conn.conn())
        contacts = list(r.table("user_contacts").run(conn))
        contacts = pd.DataFrame(contacts).drop_duplicates("domain")
        for i, c in contacts.iterrows():
            """
            job = q.enqueue(Companies()._daily_secondary_research, 
                            company_name, domain, api_key, lists, timeout=60000)
            """
            q.enqueue(Companies()._daily_secondary_research, 
                      c.company_name, c.domain, timeout=60000)

