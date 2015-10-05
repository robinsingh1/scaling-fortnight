from google import Google
import random
from time import mktime
import feedparser
import pandas as pd
import calendar
from splinter import Browser
#from parse import Parse
import random
import pandas as pd
import json
import time
from bs4 import BeautifulSoup
import requests
import arrow
from google import Crawlera
#from people_signal import PeopleSignal
#from clearspark import ClearSpark

'''
from rq import Queue
from worker import conn
q = Queue(connection=conn)
'''

#browser = Browser("phantomjs")

class Helper:
    def _timestamp(self):
        d1 = arrow.now().replace(days=-1)
        d2 = arrow.now()
        d1 = arrow.get(d1.year, d1.month, d1.day).timestamp
        d2 = arrow.get(d2.year, d2.month, d2.day).timestamp
        return d1, d2
    
    def _date_to_timestamp(self, date, source=""):
        #date = "Mar 13, 2015\n 10:38 ET"
        if date.strip() == "": return ""
        try:
          month = list(calendar.month_abbr).index(date.split()[0])
        except:
          try:
            month = list(calendar.month_name).index(date.split()[0])
          except:
            return ""

        month = "0"+str(month) if month < 10 else str(month)
        _date = month+" "+" ".join(date.split()[1:])
        _date = _date.replace(" AM","").replace(" PM","")
        _date = arrow.get(_date, "MM D, YYYY H:mm").timestamp
        return _date

    def _persist(self, df, source):
        #print df
        print "start persist"
        if df.empty:
          print "EMPTY"
          print df
          return 

        df["time_phrase"] = [arrow.get(i).humanize() for i in df.timestamp]
        df = df[df.time_phrase.str.contains("hour|minute")]
        del df["published_parsed"]

        df["source"] = source.replace("_industry","")
        d1, d2 = Helper()._timestamp()
        print df.shape
        if df.empty: return
        '''
        print df[["timestamp", "time_phrase"]]
        print df.timestamp, d1, d2
        df = df[(df.timestamp > d1) & (df.timestamp < d2)]
        '''
        print df.shape
        if "industry" in source:
          res = Parse()._batch_df_create("IndustryPress", df)
        else:
          res = Parse()._batch_df_create("Press", df)
        df["res"] = res
        for i, row in df.iterrows():
            if "success" in row.res.keys():
                objectId = row.res["success"]["objectId"]
                if "newswire.ca" in df.link:
                    q.enqueue(NewsWire()._parse_article_html, objectId, row.url)
                elif "prnewswire" in df.link:
                    q.enqueue(PRNewsWire()._parse_article_html, objectId, row.url)
                elif "businesswire" in df.link:
                    q.enqueue(BusinessWire()._parse_article_html, objectId, row.url)
                elif "marketwire" in df.link:
                    q.enqueue(MarketWired()._parse_article_html, objectId, row.url)
                #TODO add prweb
        return df

class NewsWire():
    def _rss_signal(self, url, _signal):
        feed = feedparser.parse(url)
        df = pd.DataFrame(feed["entries"])
        df["signal"] = [_signal for i in df.index]
        if df.empty: 
            print "EMPTY"
            print df
            return
        df["timestamp"]= [mktime(i) for i in df.published_parsed]
        Helper()._persist(df, "newswire_industry")

    def _parse_article_html(self, objectId, url, industry_press=None):
        print "NEWSWIRE PARSE ARTICLE"
        html = BeautifulSoup(requests.get(url).text)
        company_name = html.find("div",{"class":"company_info"})
        ps = [p.text.split("SOURCE ")[-1] 
              for p in html.find_all("p") if "SOURCE " in p.text]
        website = company_name.find("a",{"class":"external_link"})
        company_name = ps[-1].strip()
        #q.enqueue(ClearSpark()._bulk_company_info, company_name)
        website = website["href"] if website else ""
        #print website, company_name, url
        article = html.find("div",{"id":"ReleaseContent"}).text
        data = {"website":website, "company_name":company_name,
                "article":article}
        print data
        if industry_press:
          r = Parse().update("IndustryPress", objectId, data)
        else:
          r = Parse().update("Press", objectId, data)
        #TODO - queue company research
        print r.json()

    def paginate(self, url):
        pages = []
        for i in range(10):
            _url = url+str(i*12)
            print _url
            pages.append(requests.get(_url).text)
        return pages
            
    def _parse_url(self, url):
        args = dict([url.split("=") for url in url.split("?")[-1].split("&")])
        print args
        url = "http://www.newswire.ca/en/search?N=11+{0}+33&Ntt=&remOrg=1&Ns=Epoch&Nso=1&Nf=&No="
        url = url.format(args["N"])
        return url
        #html = requests.get(url).text

    def _date_to_timestamp(self, date):
        #date = "March 31, 2015 8:00 AM"
        month = list(calendar.month_name).index(date.split()[0])
        month = "0"+str(month) if month < 10 else str(month)
        _date = month+" "+" ".join(date.split()[1:])
        return arrow.get(_date, "MM DD, YYYY H:mm").timestamp

    def _parse_search_html(self, html):
        bs, li = BeautifulSoup(html), []
        for news in bs.find_all("div",{"class":"release"}):
            headline = news.find("h2").text
            company_name = news.find("ul",{"class":"meta_info"}).find("li").text
            date = news.find("p",{"class":"time_stamp"}).text
            timestamp = Helper()._date_to_timestamp(date, "newswire")
            url = news.find("h2").find("a")["href"]
            cols = ["headline","company_name","date","url", "timestamp"]
            vals = [headline,company_name,date, "http://newswire.ca"+url, timestamp]
            li.append(dict(zip(cols, vals)))

        li = pd.DataFrame(li)
        return li

    def signal(self, url, _signal):
        url = self._parse_url(url)
        htmls, dfs = self.paginate(url), []
        for html in htmls:
            dfs.append(self._parse_search_html(html))
        
        df = pd.concat(dfs)
        df = df.reset_index().drop("index",1)
        df["signal"] = [_signal for i in df.index]
        df["source"] = "newswire"
        d1, d2 = Helper()._timestamp()
        if df.empty: return
        df = df[(df.timestamp > d1) & (df.timestamp < d2)]
        #TODO filter timestamp yesterday 24 hours
        res = Parse()._batch_df_create("Press", df)
        df["res"] = res
        for i, row in df.iterrows():
            if "success" in row.res.keys():
                objectId = row.res["success"]["objectId"]
                q.enqueue(NewsWire()._parse_article_html, objectId, row.url)
        return df

class DuplicateCheck:
    def _check(self, signal, df):
        qry = {"where":json.dumps({"signal":signal}), "limit":1000}
        qry["order"] = "-createdAt"
        res = Parse().get("Press", qry).json()["results"]
        #TODO remove duplicates
        #TODO get article, company_name
        # UGNDEb6Sy7
        return df

class MarketWired:
    def paginate(self, url):
        #browser = Browser("chrome")
        browser = Browser("phantomjs")
        browser.visit(url)
        pages = [browser.html]
        for i in range(10):
            try:
                browser.find_by_css(".PagerLinks > a")[-2].click()
                pages.append(browser.html)
            except:
                break
        return pages

    def _rss_signal(self, url, _signal):
        feed = feedparser.parse(url)
        df = pd.DataFrame(feed["entries"])
        df["signal"] = [_signal for i in df.index]
        if df.empty: 
            print "EMPTY"
            print url
            return
        df["timestamp"]= [mktime(i) for i in df.published_parsed]
        # TODO - parse signal
        Helper()._persist(df, "marketwired_industry")

    def _parse_article_html(self, objectId, title, industry_press=None):
        df = Google().search("{0} site:marketwired.com".format(title))
        html = Google().cache(df.link.tolist()[0])
        article = BeautifulSoup(html).find("div",{"class":"mw_release"})
        article = article.text if article else None
        #company_name = BeautifulSoup(html).find("span",{"itemprop":"name"})
        company_name = BeautifulSoup(html).find("strong")
        company_name = company_name.split("SOURCE:")[-1] if company_name else None
        #q.enqueue(ClearSpark()._bulk_company_info, company_name)
        links, website = [], None
        for a in BeautifulSoup(html).find_all("a"):
            if "href" not in a.attrs: continue
            href = a["href"].lower()
            if "http" not in href: continue
            elif "marketwire" in href: continue
            elif "javascript" in href: continue
            elif "linkedin" in href: continue
            elif "twitter" in href: continue
            elif "youtube" in href: continue
            elif "flickr" in href: continue
            elif "facebook" in href: continue
            elif "google" in href: continue
            elif "addthis" in href: continue
            elif "sysomos" in href: continue

            if "target" in a.attrs:
                website = a["href"]
            links.append(href.strip())

        info = {"article": article, "company_name": company_name, 
                "website":website, "links":links}
        if industry_press:
            print Parse().create("IndustryPress", info).json()
        else:
            print Parse().create("Press", info).json()
        print info
        return info
            
    def _parse_search_html(self, html):
        bs, li = BeautifulSoup(html), []
        for news in bs.find_all("div",{"class":"news-item-news-room"}):
            logo = news.find("img")["src"] if news.find("img") else ""
            headline = news.find("div",{"class":"news-story-news-room"}).find("a").text
            url = news.find("div",{"class":"news-story-news-room"}).find("a")["href"]
            company_name = news.find("div",{"class":"news-story-news-room"}).find_all("a")[-1].text
            date = news.find("div",{"class":"news-story-news-room"}).find_all("p")[-1].text.split("\n")[-1]
            cols = ["logo","headline","url","company_name","date"]
            vals = [logo, headline, url, company_name, date]
            li.append(dict(zip(cols, vals)))
        li = pd.DataFrame(li)
        return li

    def signal(self, url, _signal):
        htmls, dfs = self.paginate(url), []
        for html in htmls:
            dfs.append(self._parse_search_html(html))
        
        df = pd.concat(dfs)
        df = df.reset_index().drop("index",1)
        df["signal"] = [_signal for i in df.index]
        df["source"] = ["marketwired"]
        print Parse()._batch_df_create("Press", df)
        return df
        
class BusinessWire():
    def _rss_signal(self, url, _signal):
        feed = feedparser.parse(url)
        df = pd.DataFrame(feed["entries"])
        df["signal"] = [_signal for i in df.index]
        if df.empty: 
            print "EMPTY"
            print url
            return
        df["timestamp"]= [mktime(i) for i in df.published_parsed]
        Helper()._persist(df, "businesswire_industry")

    def paginate(self, url):
        browser = Browser("phantomjs")
        browser.visit(url)
        pages, page = [browser.html], 0
        while browser.find_by_css(".pagingNext"):
            if page > 10: break
            page = page + 1
            try:
                browser.find_by_css(".pagingNext").first.click()
                pages.append(browser.html)
            except:
                break
        return pages

    def remove_non_ascii(self, text):
        return ''.join(i for i in text if ord(i)<128)
                
    def _parse_article_html(self, objectId, url, industry_press=None):
        #browser.visit("http://www.businesswire.com/news/home/20150409005073/en")
        browser = Browser("phantomjs")
        browser.visit(url)
        time.sleep(2)
        html = browser.html

        #html = requests.get(url).text
        html = BeautifulSoup(html)
        article = html.find("div", {"class":"bw-release-story"})
        company_name = html.find("h3", {"itemprop":"sourceOrganization"})
        company_name = company_name.find("span", {"itemprop":"name"})
        vals = [article, company_name]
        cols = ["article", "company_name"]
        #TODO - itemprop="name" company_name
        #TODO - persist in parse
        vals = [self.remove_non_ascii(i.text) if i else "" for i in vals]
        data = dict(zip(cols, vals))
        #print data["company_name"]
        print data
        #q.enqueue(ClearSpark()._bulk_company_info, data["company_name"])
        if industry_press:
          r = Parse().update("IndustryPress", objectId, data)
        else:
          r = Parse().update("Press", objectId, data)
        print r.json()
        browser.quit()
            
    def _parse_search_html(self, html):
        bs, li = BeautifulSoup(html), []
        for news in bs.find("ul",{"class":"bwNewsList"}).find_all("li"):
            url = news.find("meta",{"itemprop":"url"})["content"]
            logo = news.find("img")["src"] if news.find("img") else ""
            headline = news.find("span",{"itemprop":"headline"}).text
            date = news.find("time")["datetime"]
            timestamp = arrow.get(date).timestamp
            cols = ["url","logo","headline","date","timestamp"]
            vals = [url, logo, headline, date, timestamp]
            li.append(dict(zip(cols, vals)))
        li = pd.DataFrame(li)
        return li
        
    def signal(self, url, _signal):
        htmls, dfs = self.paginate(url), []
        for html in htmls:
            dfs.append(self._parse_search_html(html))
        
        df = pd.concat(dfs)
        df = df.reset_index().drop("index",1)
        df["signal"] = [_signal for i in df.index]
        df["source"] = "businesswire"
        d1, d2 = Helper()._timestamp()
        if df.empty: return
        df = df[(df.timestamp > d1) & (df.timestamp < d2)]
        res = Parse()._batch_df_create("Press", df)
        df["res"] = res
        for i, row in df.iterrows():
            if "success" in row.res.keys():
                objectId = row.res["success"]["objectId"]
                q.enqueue(BusinessWire()._parse_article_html, objectId, row.url)
        return df
                 
class PRNewsWire():
    def paginate(self, url):
        pages = []
        for i in range(10):
            #url = "http://www.prnewswire.com/news-releases/general-business-latest-news/agency-roster-list/?c=n&pagesize=200&page="
            _url = url + "/?c=n&pagesize=200&page=" + str(i)
            #url = url + str(i)
            print _url
            html = requests.get(_url).text
            pages.append(html)
        return pages
            
    def _parse_article_html(self, objectId, url, industry_press=None):
        #html = requests.get(url).text
        html = Crawlera().get(url).text
        article = BeautifulSoup(html).find("div",{"id":"ReleaseContent"}).text
        #
        ps = [p.text.split("SOURCE ")[-1] 
              for p in BeautifulSoup(r.text).find_all("p") if "SOURCE " in p.text]
        company_name = ps[0]
        #q.enqueue(ClearSpark()._bulk_company_info, company_name)
        data = {"article":article, "company_name":company_name}
        if industry_press:
          r = Parse().update("IndustryPress", objectId, data)
        else:
          r = Parse().update("Press", objectId, data)
        print r.json()

    def _parse_search_html(self, html):
        bs, li = BeautifulSoup(html), []
        for news in bs.find_all("div",{"class":"row"}):
            date = news.find("div",{"class":"col-sm-3"})
            date = date.text if date else ""
            timestamp = Helper()._date_to_timestamp(date, "prnewswire")
            headline = news.find("a",{"class":"news-release"})
            headline = headline.text if headline else ""
            url = news.find("a",{"class":"news-release"})
            url = url["href"] if url else ""
            logo = news.find("img")
            logo = logo["src"] if logo else ""
            cols = ["date","headline","url","logo", "timestamp"]
            vals = [date.strip(), headline.strip(), url.strip(), logo.strip(), timestamp]
            li.append(dict(zip(cols, vals)))
        
        li = pd.DataFrame(li)
        li = li[li.headline != ""]
        return li
        
    def signal(self, url, _signal):
        htmls, dfs = self.paginate(url), []
        for html in htmls:
            dfs.append(self._parse_search_html(html))
        
        df = pd.concat(dfs)
        df = df.reset_index().drop("index",1)
        df["signal"] = [_signal for i in df.index]
        df["source"] = "prnewswire"
        d1, d2 = Helper()._timestamp()
        if df.empty: return
        df = df[(df.timestamp > d1) & (df.timestamp < d2)]
        res = Parse()._batch_df_create("Press", df)
        df["res"] = res

        for i, row in df.iterrows():
            if "success" in row.res.keys():
                objectId = row.res["success"]["objectId"]
                q.enqueue(PRNewsWire()._parse_article_html, objectId, row.url)
        return df

    def _rss_signal(self, url, _signal):
        feed = feedparser.parse(url)
        df = pd.DataFrame(feed["entries"])
        df["signal"] = [_signal for i in df.index]
        if df.empty: 
            print "EMPTY"
            print df
            return
        df["timestamp"]= [mktime(i) for i in df.published_parsed]
        Helper()._persist(df, "prnewswire_industry")

class PRWeb:
    def _parse_article_html(self, objectId, url):
        ''' '''

class Press:
    def _all_press(self):
        '''  TODO - get all press 
             - for all links add industry, signal (accoriding to press site)
             - add signal + industry according customero
             - persist article link, queue => article
             - scrape every article get all nlp and stuff
        '''
        # TODO
        # All RSS
        # PRNewsWire().signals()

    def _press_article_page_scrape(self):
        r = Parse().get("Press",{"limit":1000,"order":"-createdAt",
                                 "include":"signal", "where":json.dumps(qry)})

    def _test_company_name(self):
        qry = {"$or":[{"company_name":{"$in":[False, None]}, 
                       "article":{"$in":[False, None]}}]}
        r = Parse().get("Press",{"limit":1000,"order":"-createdAt",
                                 "include":"signal", "where":json.dumps(qry)})
        p = pd.DataFrame(r.json()["results"])[["url","source","objectId"]]

        for i, row in p.iterrows():
            if row.source == "prnewswire":
                q.enqueue(PRNewsWire()._parse_article_html, row.objectId, row.url)
            elif row.source == "businesswire":
                q.enqueue(BusinessWire()._parse_article_html, row.objectId, row.url)

    def _daily_collect(self, profile_id):
        profile = Parse().get("ProspectProfile/"+profile_id, {"include":"profiles"})
        _signal = [i["press_id"] for i in profile.json()["profiles"]
                   if i["className"] == "PressProfile"]
        d1, d2 = Helper()._timestamp()
        qry = {"signal":_signal[0],"timestamp":{"$gte": d1,"$lte": d2}}
        press = Parse().get("Press",{"limit":1000, "skip":0, "count":True,
                                     "where": json.dumps(qry),
                                     "order":"-timestamp"}).json()["results"]

        profile  = profile.json()
        report = {"user": profile["user"], "user_company": profile["user_company"]}
        report["profile"] = Parse()._pointer("ProspectProfile", profile["objectId"])
        _report = Parse().create("SignalReport", report).json()["objectId"]
        _report = Parse()._pointer("SignalReport", _report)

        cos = pd.DataFrame(press)
        if "done" not in profile.keys() or not profile["done"]:
            data = {"done": arrow.utcnow().timestamp}
            print Parse().update("ProspectProfile", profile_id, data).json()

        if cos.empty: return
        cos = cos[cos.company_name.notnull()].drop_duplicates("company_name")
        cos["report"]  = [_report] * len(cos.index)
        Parse()._batch_df_create("CompanySignal", cos)
        # TODO - Queue ProspectTitle Search if present
        q.enqueue(PeopleSignal()._check_for_people_signal, cos,  profile, _report)

    def _press_in_depth_scrape(self):
        #TODO - for all links without company_name, article
        ''' TODO - '''

    def _daily_industry_collect(self, profile_id):
        profile = Parse().get("ProspectProfile/"+profile_id, {"include":"profiles"})
        industries = [i["industry_ids"] for i in profile.json()["profiles"]
                     if i["className"] == "IndustryProfile"][0]
        d1, d2 = Helper()._timestamp()
        for industry in industries:
            qry = {"signal":industry,"timestamp":{"$gte": d1,"$lte": d2}}
            press = Parse().get("IndustryPress",{"limit":1000, "skip":0, 
                                "count":True, "where": json.dumps(qry),
                                "order":"-timestamp"}).json()["results"]
            profile  = profile.json()
            user, user_company = profile["user"], profile["user_company"]
            #if press:
            report = {"user": user, "user_company": user_company}
            report["profile"] = Parse()._pointer("ProspectProfile", profile["objectId"])
            _report = Parse().create("SignalReport", report).json()["objectId"]
            _report = Parse()._pointer("SignalReport", _report)

            cos = pd.DataFrame(press)
            if "done" not in profile.keys() or not profile["done"]:
                data = {"done": arrow.utcnow().timestamp}
                print Parse().update("ProspectProfile", profile_id, data).json()

            if cos.empty: return
            cos = cos[cos.company_name.notnull()].drop_duplicates("company_name")
            cos["report"]  = [_report] * len(cos.index)
            Parse()._batch_df_create("CompanySignal", cos)
            # TODO - Queue ProspectTitle Search if present
            q.enqueue(PeopleSignal()._check_for_people_signal, cos,  profile, _report)

    def _industry_scrape(self):
        for signal in Parse().get("IndustrySignal").json()["results"]:
            _signal = Parse()._pointer("IndustrySignal", signal["objectId"])
            for link in signal["links"]:
                link = link.replace("http://","").replace("https://", "")
                link = "http://"+link
                if "marketwired" in link:
                    q.enqueue(MarketWired()._rss_signal,link,_signal, timeout=6000) 
                elif "businesswire" in link:
                    q.enqueue(BusinessWire()._rss_signal,link,_signal, timeout=6000)
                elif "prnewswire" in link:
                    q.enqueue(PRNewsWire()._rss_signal, link, _signal, timeout=6000)
                elif "newswire.ca" in link:
                    q.enqueue(NewsWire()._rss_signal, link, _signal, timeout=6000)

    def _sources_scrape(self):
        # subject scrape
        found = 0
        for signal in Parse().get("TheSignals").json()["results"]:
            _signal = Parse()._pointer("TheSignals", signal["objectId"])
            for link in signal["links"]:
                link = link.replace("http://","").replace("https://", "")
                link = "http://"+link
                print link
                if "marketwired" in link:
                    ''' 
                    q.enqueue(MarketWired().signal, link, _signal, timeout=6000) 
                    '''
                elif "businesswire" in link:
                    q.enqueue(BusinessWire().signal, link, _signal, timeout=6000)
                elif "prnewswire" in link:
                    q.enqueue(PRNewsWire().signal, link, _signal, timeout=6000)
                elif "newswire.ca" in link:
                    q.enqueue(NewsWire().signal, link, _signal, timeout=6000)
        '''
                if "businesswire" in link:
                    found = found + 1
                    break
            if found == 2:
                break
        '''
    
'''
_signal = Parse()._pointer("TheSignals","3B2SVuuhoi")
#url = "http://www.prnewswire.com/news-releases/general-business-latest-news/agency-roster-list/?c=n&pagesize=200&page="
#df = PRNewsWire().signal(url, _signal)
#url = "http://www.marketwired.com/refine-by?topic=MAC"
#df = MarketWired().signal(url, _signal)
#url = "http://www.businesswire.com/portal/site/home/news/subject/?vnsId=31407"
#df = BusinessWire().signal(url, _signal)
url = "http://www.newswire.ca/en/search?N=11+51+33&Ntt=&remOrg=1&Nf="
df = NewsWire().signal(url, _signal)
'''
