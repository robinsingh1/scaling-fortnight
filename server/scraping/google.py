import requests
import arrow
from bs4 import BeautifulSoup
import pandas as pd
from splinter import Browser
import urllib
from requests.auth import HTTPProxyAuth
import grequests

auth = requests.auth.HTTPProxyAuth('robinsingh', '951562nileppez')
proxies = {'http': 'us-il.proxymesh.com:31280'}
un, pw = "customero", "iUyET3ErxR"
CRAWLERA_URL = "http://{0}:{1}@paygo.crawlera.com/fetch?".format(un, pw)
SPLASH_URL = "http://localhost:8950/render.html?"

class Crawlera:
    def get(self, url):
        #cloak = "https://crawlera.p.mashape.com/fetch"
        un, pw = "customero", "iUyET3ErxR"
        cloak = "http://{0}:{1}@paygo.crawlera.com/fetch".format(un, pw)
        #headers = {"X-Mashape-Key": "pdL7tBtCRXmshjM0GeRxnbyhpWzNp13kguyjsnxPTjSv8foPKA"}
        r = requests.get(cloak, params={'url':url})
        return r

    def _multi_get(self, queries):
        urls, page = [], 0
        for _qry in queries:
            args=urllib.urlencode({'q':_qry, 'start':page*100,'num':10})
            url = 'https://www.google.com/search?'+ args
            url = CRAWLERA_URL + urllib.urlencode({'url':url})
            #url = SPLASH_URL + urllib.urlencode({'url':urllib.unquote_plus(url)})
            urls.append(url)
        res = grequests.map((grequests.get(u) for u in urls))
        return res

    def _get(self, url):
        #url = "https://google.com"
        auth = HTTPProxyAuth("customero", "iUyET3ErxR")
        proxies = {"http": "paygo.crawlera.com:8010"}
        r = requests.get(url,
                         #headers=headers,
                         proxies=proxies,
                         #timeout=timeout,
                         auth=auth)
        return r

class Google:
    def _multi_get(self, queries):
        res = Crawlera()._multi_get(queries)
        res = pd.concat([self._results_html_to_df(u.text) for u in res])
        return res

    def linkedin_search(self, qry, pages=1):
        qry = qry + ' site:linkedin.com/in/ OR site:linkedin.com/pub/'
        qry = qry + '-site:linkedin.com/pub/dir/'
        res = pd.DataFrame()
        for page in range(pages):
            print page
            args = urllib.urlencode({'q':qry,'start':page*100,'num':100})
            url = 'https://www.google.com/search?'+ args
            cloak = "https://crawlera.p.mashape.com/fetch"
            headers = {"X-Mashape-Key":
                "pdL7tBtCRXmshjM0GeRxnbyhpWzNp13kguyjsnxPTjSv8foPKA"}
            r = requests.get(cloak, params={'url':url}, headers=headers)
            res = res.append(self._results_to_html_df(r.text))
            # filter only linkedin_url
        return res

    def _google_df_to_linkedin_df(self, results):
        if results.empty: return results
        final = pd.DataFrame()
        results =  results.reset_index().drop('index', 1)
        final['name'] = [name.split('|')[0].strip().split(',')[0]
                         for name in results.link_text]
        final['locale']  = [name.split('-')[0].strip()
                            for name in results.title]
        final['company_name']  = [name.split(' at ')[-1].strip()
                              if " at " in name else ""
                             for name in results.title]
        final['title']  = [name.split(' at ')[0].split('-')[-1].strip()
                             for name in results.title]
        final['linkedin_url'] = results.link.tolist()
        return final

    def news_search(self, qry):
        args = urllib.urlencode({'q':qry,'num':100})
        url = "https://www.google.com/search?tbm=nws&"+args
        r = Crawlera().get(url)
        res = self._news_html_to_df(r.text)
        res = res[res.link_span.str.contains("(?i){0}".format(qry))]

        del res["link_span"]
        del res["url"]
        del res["detail"]
        return res

    def cache(self, url):
        url = url.replace('&', '%26')
        url = url.strip()
        url = 'http://webcache.googleusercontent.com/search?q=cache:'+url
        r = Crawlera().get(url)
        return r.text

    def _results_to_linkedin_df(self, html):
        ''' '''
    
    """
    def search(self, qry, pages=1):
        res = pd.DataFrame()
        for page in range(pages):
            print page
            args = urllib.urlencode({'q':qry,'start':page*100,'num':100})
            url = 'https://www.google.com/search?'+ args

            r = Crawlera().get(url)
            #r = requests.get(url)
            res = res.append(self._results_html_to_df(r.text))
            #res = self._google_df_to_linkedin_df(res)
        return res
    """
    def search(self, qry, pages=1, period=""):
        cols=['link_text','url','title','link_span','link',
              'date','source','timestamp']
        res = pd.DataFrame(columns=cols)
        for page in range(pages):
            qry = self._remove_non_ascii(qry)
            args = {'q':qry,'start':page*100,'num':100,"filter":0}
            if period != "":
              args["tbs"] = "qdr:{0},sbd:1".format(period)
            args = urllib.urlencode(args)
            url = 'https://www.google.com/search?'+ args
            r = Crawlera().get(url)
            res = res.append(self._results_html_to_df(r.text))
        return res

    def _remove_non_ascii(self, text):
        return ''.join(i for i in text if ord(i)<128)

    def _results_html_to_df(self, search_result_html):
        leads = pd.DataFrame()
        listings = BeautifulSoup(search_result_html).findAll('li',{'class':'g'})
        # TODO - add timestamp
        #timestamp
        for lead in listings:
            link_text = lead.find('h3').text
            links = [i for i in lead.find_all('a') if "/url?" in i["href"]]
            link = links[0]['href'].split('=')[1].split('&')[0]
            #link = lead.find('a')['href'].split('=')[1].split('&')[0]
            url = lead.find('cite').text if lead.find('cite') else ""
            link_span = lead.find('span',{'class':'st'})
            link_span = link_span.text if link_span else ""
            date = lead.find(attrs={"class":"f"})
            date = date.text.split("-") if date else None
            try:
                title = lead.find('div',{'class':'slp'}).text
            except:
                title = ""

            columns = ['link_text','url','title','link_span','link', "date"]
            values = [link_text, url,title,link_span, link, date]
            leads = leads.append(dict(zip(columns, values)), ignore_index=True)
        return leads

    def _news_html_to_df(self, search_result_html):
        #search_result_html = u.text
        leads = pd.DataFrame()
        listings = BeautifulSoup(search_result_html).findAll('li',{'class':'g'})
        #TODO - add timestamp
        #timestamp
        for lead in listings:
            link_text = lead.find('h3').text
            links = [i for i in lead.find_all('a') if "/url?" in i["href"]]
            link = links[0]['href'].split('=')[1].split('&')[0]
            #link = lead.find('a')['href'].split('=')[1].split('&')[0]
            url = lead.find('cite').text if lead.find('cite') else ""
            link_span = lead.find('div',{'class':'st'})
            link_span = link_span.text if link_span else ""

            try:
                title = lead.find('div',{'class':'slp'}).text
                source = title.split("-")[0]
                date = title.split("-")[-1]
            except:
                title = ""
            columns = ['title','url','detail','link_span','link',"source","date"]
            values = [link_text, url,title,link_span, link, source, date]
            leads = leads.append(dict(zip(columns, values)), ignore_index=True)

        leads = self._date_phrase_to_timestamp(leads)
        return leads

    def _date_phrase_to_timestamp(self, df, date_arg="date"):
        dates = []
        for date in df[date_arg]:
            date = date.strip()
            now = arrow.now('US/Eastern')
            first = date.split(' ')[0]
            if first.isdigit():
                length = int(first.replace('+',''))*-1
                if "minute" in date:
                    timestamp = now.replace(minutes=length)
                elif "hour" in date:
                    timestamp = now.replace(hours=length)
                elif ("day" or "days") in date:
                    timestamp = now.replace(days=length, hour=0, minute=0,
                                            second=0, microsecond=0)
                    timestamp = arrow.get(timestamp)
                elif ("Just") in date:
                      timestamp = now
                else:
                    try:
                      print date.strip(), "DATE NOT FOUND"
                    except:
                      """ """

                    dates.append(None)
                    continue   
            else:
                try:
                    timestamp = arrow.get(date.strip(),"MMM D, YYYY")
                except:
                    timestamp = None
                if timestamp:
                    try:
                        timestamp = arrow.get(date.strip(),"D MMM YYYY")
                    except:
                        timestamp = None
                    
                print date.strip(), "DATE NOT FOUND"
                dates.append(None)
                continue   
            dates.append(timestamp.timestamp)
        df["timestamp"] = dates
        return df
