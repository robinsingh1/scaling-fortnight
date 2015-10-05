import requests
from bs4 import BeautifulSoup
import pandas as pd
from splinter import Browser
import urllib
from requests.auth import HTTPProxyAuth


class Crawlera:
    def get(self, url):
        #cloak = "https://crawlera.p.mashape.com/fetch"
        un, pw = "customero", "iUyET3ErxR"
        cloak = "http://{0}:{1}@paygo.crawlera.com/fetch".format(un, pw)
        #headers = {"X-Mashape-Key": "pdL7tBtCRXmshjM0GeRxnbyhpWzNp13kguyjsnxPTjSv8foPKA"}
        r = requests.get(cloak, params={'url':url})
        return r

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

    def news_search(self, qry, pages=1):
        res = pd.DataFrame()
        for page in range(pages):
            print page
            args = urllib.urlencode({'q':qry,'start':page*100,'num':100})
            url = 'https://news.google.com/'+ args
            cloak = "https://crawlera.p.mashape.com/fetch"
            headers = {"X-Mashape-Key": 
                       "pdL7tBtCRXmshjM0GeRxnbyhpWzNp13kguyjsnxPTjSv8foPKA"}
            r = requests.get(cloak, params={'url':url}, headers=headers)
            res = res.append(self._results_html_to_df(r.text))
        return res

    def cache(self, url):
        url = url.replace('&', '%26')
        url = url.strip()
        url = 'http://webcache.googleusercontent.com/search?q=cache:'+url
        r = Crawlera().get(url)
        return r.text

    def _results_to_linkedin_df(self, html):
        ''' '''
    
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

    def _results_html_to_df(self, search_result_html):
        leads = pd.DataFrame()
        listings = BeautifulSoup(search_result_html).findAll('li',{'class':'g'})
        for lead in listings:
            link_text = lead.find('h3').text
            links = [i for i in lead.find_all('a') if "/url?" in i["href"]]
            link = links[0]['href'].split('=')[1].split('&')[0]
            #link = lead.find('a')['href'].split('=')[1].split('&')[0]
            url = lead.find('cite').text if lead.find('cite') else ""
            link_span = lead.find('span',{'class':'st'})
            link_span = link_span.text if link_span else ""
            try:
                title = lead.find('div',{'class':'slp'}).text
            except:
                title = ""

            columns = ['link_text','url','title','link_span','link']
            values = [link_text, url,title,link_span, link]
            leads = leads.append(dict(zip(columns, values)), ignore_index=True)
        return leads

