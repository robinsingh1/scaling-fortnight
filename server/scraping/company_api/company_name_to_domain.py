from google import Google
from search_engine import *
import pandas as pd
import rethinkdb as r
import urlparse

class CompanyNameToDomain:
    def get(self, company_name):
        #dd = DuckDuckGo().search(company_name)
        g  = Google().search(company_name)
        yd = Yandex().search(company_name)
        bg = Bing().search(company_name)

        #print dd.shape
        #print g.shape
        #print yd.shape
        #print bg.shape

        #m = pd.concat([dd.ix[:10],g.ix[:10],yd.ix[:10],bg.ix[:10]])
        g["domain"] = [".".join(urlparse.urlparse(i).netloc.split(".")[-2:]) for i in g.link]
        yd["domain"] = [".".join(urlparse.urlparse(i).netloc.split(".")[-2:]) for i in yd.link]
        bg["domain"] = [".".join(urlparse.urlparse(i).netloc.split(".")[-2:]) for i in bg.link]
        m = pd.concat([g.ix[:10].drop_duplicates("domain"),
                       yd.ix[:10].drop_duplicates("domain"),
                       bg.ix[:10].drop_duplicates("domain")])
        m = m.reset_index()
        m["domain"] = [".".join(urlparse.urlparse(i).netloc.split(".")[-2:]) for i in m.link]
        m = m[m.domain != ""]
        #print m[["link","domain"]]

        # Scoring based on frequency and rank of domain in all search engines
        a, b = m.domain.value_counts().ix[:10], m.groupby("domain").sum().sort("index").ix[:10]
        a, b = a.iloc[::-1], b.iloc[::-1]
        a,b = a.reset_index(), b.reset_index()
        a,b = a.reset_index(), b.reset_index()
        a.columns, b.columns = ["new_score","domain","old_score"], ["new_score","domain","old_score"]

        f = pd.concat([a,b]).groupby("domain").sum()
        f = f.sort("new_score", ascending=False)
        f["confidence"] = f.new_score / 8.0 *100
        domains = f[:3].reset_index().to_dict("r")
        try:
          print domains[0]["domain"]
          return domains[0]["domain"]
        except:
          return None
        #print domains
        # TODO persist

    def _update_record(self, company_name, _id):
        domain = self.get(company_name)
        conn = r.connect(host="localhost", port=28015, db="triggeriq")
        r.table('hiring_signals').get(_id).update({"domain":domain}).run(conn)

#CompanyName().get("facebook inc")
