from research.company_db import *
from research.social import *
from research.li import *
from research.zoominfo import *
import requests
import grequests
from google import Google
import rethinkdb as r

conn = r.connect(db="clearspark")

class Companies:
    def _hiring(self, company_name, company_domain=None, daily=False):
        # paginate
        jobs = "http://www.indeed.com/jobs?q={0}&sort=date".format(company_name)
        pages = requests.get(jobs).text
        data = Indeed()._search_results_html_to_df([pages])
        print data
        #TODO - add timestamp
        data = data.dropna()
        data["name_score"]=[fuzz.ratio(company_name, i) for i in data.company_name]
        data = data[data.name_score > 70]
        print data
        #date, timestamps = arrow.utcnow(), []
        if data.empty: return "NO HIRING"
        data["domain"] = company_domain
        data["event_type"] = "HiringEvent"
        data = data.applymap(lambda x: self._remove_non_ascii(x))
        data["event_key"] = ["".join(map(str, _data.to_dict().values()))[:124]
                             for i, _data in data.iterrows()]
        data = [row.dropna().to_dict() for i, row in data.iterrows()]
        r.table("events").insert(data).run(conn)
        #return data

    def _recent_webpages_published(self, domain, period=None):
        if period:
          df = Google().search("site:{0}".format(domain), 1, "d")
          #df2 = Google().search("{0}".format(name), 1, "d")
        else:
          df = Google().search("site:{0}".format(domain))
          #df2 = Google().search("{0}".format(name))

        # TODO - add timestamps 
        # TODO - queue scrapes
        #df = pd.concat([df, df2])
        data = df
        if data.empty: return "NO RECENT WEBPAGES"
        data["domain"] = domain
        data["event_type"] = "RecentWebpageEvent"
        print data
        data = data.applymap(lambda x: self._remove_non_ascii(x))
        print data
        data["event_key"] = ["".join(map(str, _data.to_dict().values()))[:124]
                             for i, _data in data.iterrows()]
        data = [row.dropna().to_dict() for i, row in data.iterrows()]
        r.table("events").insert(data).run(conn)
        #return data

    #def _company_blog(self, domain, api_key="", name="", period=None):
    def _company_blog(self, domain, period=None):
        #TODO get blog url
        if period:
          df = Google().search('inurl:blog site:{0}'.format(domain), 1, "d")
        else:
          df = Google().search('inurl:blog site:{0}'.format(domain), 1)

        if df.empty: return
        df["count"] = [len(url) for url in df.link]
        df = df.reset_index().drop('index',1)
        df = df.drop('title', 1)
        url = df.sort('count').url.ix[0]
        df["timestamp"] = [i.split("...")[0].strip() for i in df.link_span]
        months = list(calendar.month_abbr)
        timestamps = []
        for _date in df.timestamp:
            try:
                num = months.index(_date.split(" ")[0])
            except:
                timestamps.append(0)
                continue
            _date = str(num)+" "+" ".join(_date.split(" ")[1:])
            try:
              timestamps.append(arrow.get(_date, "M D, YYYY").timestamp)
            except:
                if "day" in i:
                  num = int(i.split())
                  timestamps.append(arrow.utcnow().replace(days=num*-1).timestamp)
                else:
                  timestamps.append(0)
        df["timestamp"] = timestamps
        data = df
        print data
        data["domain"] = domain
        data["event_type"] = "CompanyBlogEvent"
        data = data.applymap(lambda x: self._remove_non_ascii(x))
        data["event_key"] = ["".join(map(str, _data.values()))[:124]
                             for _data in data.to_dict("r")]
        data = [row.dropna().to_dict() for i, row in data.iterrows()]
        r.table("events").insert(data).run(conn)
        return data

    def _news(self, qry, company_domain=None, period=None):
        #name = domain.split(".")[0] if company_name == "" else company_name
        if period:
            df = Google().news_search(qry, 1, period)
        else:
            df = Google().news_search(qry)
        #press = self._press_releases(qry)
        #df = df.append(press)
        
        data = df
        data["domain"] = company_domain
        data["event_type"] = "CompanyNewsEvent"
        data = data.applymap(lambda x: self._remove_non_ascii(x))
        data["event_key"] = ["".join(map(str, _data.values()))[:124]
                             for _data in data.to_dict("r")]
        data = [row.dropna().to_dict() for i, row in data.iterrows()]
        r.table("events").insert(data).run(conn)
        #return data

    def _press_releases(self, qry, company_domain=None, period=None):
        queries = ['"{0}" site:prnewswire.com'.format(qry),
                   '"{0}" site:businesswire.com'.format(qry),
                   '"{0}" site:marketwired.com'.format(qry),
                   '"{0}" site:newswire.ca'.format(qry),
                   '"{0}" site:reuters.com'.format(qry)]

        p = Google()._multi_get(queries)
        try:
          p = p.drop_duplicates()
        except:
          """ """
        #p['date'] = [span.split('Business Wire')[-1].split('...')[0].strip() for span in p.link_span]
        p['description'] = ["".join(span.split('...')[1:]).strip() for span in p.link_span]
        p["domain"] = company_domain
        p['date'] = [span.split('...')[0].strip() for span in p.link_span]
        p["timestamp"] = [Helper()._str_to_timestamp(i) for i in p.date]
        p['title'] = p['link_text']

        p = p.drop('link_text',1)
        p = p.drop('url',1)
        p = p.drop('link_span',1)
        #for i in p.timestamp: print i
        data = p
        data["domain"] = company_domain
        data["domain"] = company_domain
        data["event_type"] = "CompanyPressEvent"
        data = data.applymap(lambda x: self._remove_non_ascii(x))
        data["event_key"] = ["".join(map(str, _data.values()))[:124]
                             for _data in data.to_dict("r")]
        _df = data.to_dict("r")
        for i in _df:
            for key in i.keys():
                if i[key] == None: del i[key]
        data = [row.dropna().to_dict() for i, row in data.iterrows()]
        r.table("events").insert(data).run(conn)
        return data

    #def _secondary_research(self, name, domain, api_key=""):
    def _all_events(self, name, domain, api_key=""):
        # Secondary Research - sometimes require location or domain
        if name == "": name = domain
        x = 6000
        j0 = q.enqueue(Companies()._company_blog, domain, api_key, name, timeout=x)
        j2 = q.enqueue(GlassDoor()._reviews, domain, api_key, name, timeout=x)
        j3 = q.enqueue(Companies()._press_releases,domain, api_key, name, timeout=x)
        j4 = q.enqueue(Companies()._news, domain, api_key, name, timeout=x)
        j5 = q.enqueue(Companies()._hiring, domain, api_key, name, timeout=x)
        j6 = q.enqueue(Twitter()._daily_news, domain, api_key, name, timeout=x)
        j7 = q.enqueue(Facebook()._daily_news, domain, api_key, name, timeout=x)
        j8 = q.enqueue(Linkedin()._daily_news, domain, api_key, name, timeout=x)

    def _cron_events(self, name, domain, api_key="", lists=[]):
        # Secondary Research - sometimes require location or domain
        if name == "": name = domain
        x = 600000
        j0 = q.enqueue(Companies()._company_blog, domain, api_key, name, 1,timeout=x)
        j1 = q.enqueue(Companies()._recent_webpages_published, domain, api_key, name, 1, timeout=x)
        j3 = q.enqueue(Companies()._press_releases,domain, api_key, name, 1, timeout=x)
        j4 = q.enqueue(Companies()._news, domain, api_key, name, "d", timeout=x)
        j5 = q.enqueue(Companies()._hiring, domain, api_key, name, 1, timeout=x)
        j2 = q.enqueue(GlassDoor()._reviews, domain, api_key, name, timeout=x)
        j6 = q.enqueue(Twitter()._daily_news, domain, api_key, name, timeout=x)
        j7 = q.enqueue(Facebook()._daily_news, domain, api_key, name, timeout=x)
        j8 = q.enqueue(Linkedin()._daily_news, domain, api_key, name, timeout=x)

    def _remove_non_ascii(self, text):
        try:
            return ''.join(i for i in text if ord(i)<128)
        except:
            return text

    def _test(self, name, domain, api_key=""):
        Companies()._company_blog(domain, api_key, name, timeout=x)
        #GlassDoor()._reviews(domain, api_key, name, timeout=x)
        #Companies()._press_releases(domain, api_key, name, timeout=x)
        #Companies()._news( domain, api_key, name, timeout=x)
        #Companies()._hiring( domain, api_key, name, timeout=x)
        #Twitter()._daily_news( domain, api_key, name, timeout=x)
        #Facebook()._daily_news( domain, api_key, name, timeout=x)
        #Linkedin()._daily_news( domain, api_key, name, timeout=x)
        #Companies()._company_blog( domain, api_key, name, 1,timeout=x)
        #Companies()._recent_webpages_published( domain, api_key, name, 1, timeout=x)
        #Companies()._press_releases,domain( api_key, name, 1, timeout=x)
        #Companies()._news( domain, api_key, name, "d", timeout=x)
        #Companies()._hiring( domain, api_key, name, 1, timeout=x)
        #GlassDoor()._reviews( domain, api_key, name, timeout=x)
