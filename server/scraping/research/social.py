from splinter import Browser
import pandas as pd
#from parse import Parse
from google import *
import json
import urllib
import requests
from bs4 import BeautifulSoup
from crawl import CompanyInfoCrawl, CompanyExtraInfoCrawl
import tldextract
import rethinkdb as r
import rethink_conn

#conn = r.connect(db="clearspark")
conn = r.connect(**rethink_conn.conn())

#return google_results
auth = requests.auth.HTTPProxyAuth('robinsingh', '951562nileppez')
proxies = {'http': 'us-il.proxymesh.com:31280'}
un, pw = "customero", "iUyET3ErxR"
CRAWLERA_URL = "http://{0}:{1}@paygo.crawlera.com/fetch?".format(un, pw)
SPLASH_URL = "http://localhost:8950/render.html?"

class Twitter:
    def _signal(self, link, api_key=""):
        html = Google().cache(link)
        info = self._html_to_dict(html)
        tweets = self._tweets(html)
        CompanyInfoCrawl()._persist(info, "twitter", api_key)
        for tweet in tweets:
          CompanyExtraInfoCrawl()._persist(tweet, "tweets", api_key)

    def _url_to_dict(self, name, url, api_key=""):
        html = Google().cache(url)
        val = self._html_to_dict(html)
        print val
        val["company_name"] = name
        CompanyInfoCrawl()._persist(val, "facebook", api_key)

    def _recent(self):
        df = Google().search("site:twitter.com", period="h")
        for link in df.link:
            q.enqueue(Twitter()._signal, link)

    def _remove_non_ascii(self, text):
        try:
            return ''.join(i for i in text if ord(i)<128)
        except:
            return text

    def _events(self, handle, domain=None):
        html = Crawlera().get(handle).text
        data = self._tweets(html)
        data["event_type"] = "TweetEvent"
        data["link"] = handle
        data["domain"] = domain
        data = data.applymap(lambda x: self._remove_non_ascii(x))
        data["event_key"] = ["".join(map(str, _data.values()))[:124]
                             for _data in data.to_dict("r")]
        data = [row.dropna().to_dict() for i, row in data.iterrows()]
        r.table("events").insert(data).run(conn)
        return data

    def _tweets(self, html, api_key=""):
        #html = Google().cache("https://twitter.com/guidespark")
        tw = BeautifulSoup(html)
        tweets = []
        for tweet in tw.find_all("li",{"class":"js-stream-item"}):
            timestamp = tweet.find("span", {"class":"js-short-timestamp"})
            timestamp = timestamp["data-time"] if timestamp else None
            text = tweet.find("p",{"class":"tweet-text"})
            text = text.text if text else None
            _hashtags = tweet.find_all("a",{"class":"twitter-hashtag"})
            hashtags = [hashtag.text if hashtag else "" for hashtag in _hashtags]
            _mentions = tweet.find_all("a",{"class":"twitter-atreply"})
            mentions = [reply.text if reply else "" for reply in _mentions]
            _links = tweet.find_all("a",{"class":"twitter-timeline-link"})
            links = [link.text for link in _links]
            _imgs = tweet.find_all("img",{"class":"TwitterPhoto-mediaSource"})
            photos = [img["src"] if img else "" for img in _imgs]
            
            tweet = {"text":text,"hashtags":hashtags,"mentions":mentions,
                     "links":links, "photos":photos, "timestamp":timestamp}
            tweets.append(tweet)
        tweets = pd.DataFrame(tweets)
        return tweets
      
    def _domain_search(self, domain, api_key="", name=""):
        df = Google().search('site:twitter.com {0}'.format(domain))
        for url in df.link:
            r = requests.get(url).text
            link = BeautifulSoup(r).find('span',{'class':'ProfileHeaderCard-urlText'})
            link = link.text.strip() if link else ""
            if domain not in link: continue
            val = self._html_to_dict(r)
            break
        val["company_name"] = name
        val["domain"] = domain
        CompanyInfoCrawl()._persist(val, "twitter", api_key)

    def _company_profile(self, name, api_key=""):
        df = Google().search('site:twitter.com {0}'.format(name))
        if df.empty: return df
        url = df.link.tolist()[0]
        html = requests.get(url).text
        val = self._html_to_dict(html)
        val["company_name"] = name
        CompanyInfoCrawl()._persist(val, "twitter", api_key)

    def _html_to_dict(self, html):
        html = BeautifulSoup(html)
        logo = html.find('img',{'class':'ProfileAvatar-image'})
        logo = logo['src'] if logo else ""
        link = html.find('h2',{'class':'ProfileHeaderCard-screenname'})
        link = link.text.strip().lower() if link else ""
        print link
        name = html.find('h1',{'class':'ProfileHeaderCard-name'})
        name = name.text.strip().lower() if name else ""
        # add company_name
        return {'logo':logo, 'handle':link, 'name':name}

class Facebook:
    def _signal(self, link, api_key=""):
        html = Google().cache(link)
        info = self._html_to_dict(html)
        posts = self._posts(html)
        CompanyInfoCrawl()._persist(info, "facebook", api_key)
        for post in posts:
          CompanyExtraInfoCrawl()._persist(post, "facebook_posts", api_key)

    def _recent(self):
        df = Google().search("site:facebook.com", period="h")
        for link in df.link:
            q.enqueue(Facebook()._signal, link)

    def _posts(self, html, api_key=""):
        # &tbs=qdr:h,sbd:1 # &tbs=qdr:d,sbd:1 # &tbs=qdr:w,sbd:1
        # &tbs=qdr:m,sbd:1 # &tbs=qdr:y,sbd:1
        #html = Google().cache("https://www.facebook.com/Socceroos")
        fb = BeautifulSoup(html)

        posts = []
        for post in fb.find_all("div",{"class":"userContentWrapper"}):
            #utime = post.find("abbr",{"class":"livetimestamp"})
            utime = post.find("abbr")
            utime = utime["data-utime"] if utime else ""
            post_text = post.find("div",{"class":"userContent"}).text
            _post = {"timestamp":utime, "post_text":post_text}
            if post.find('div',{'class':'_3ekx'}):
              link_url = post.find('div',{'class':'_3ekx'}).find('a')
              if link_url:
                  link_url = link_url["href"]
                  link_url = urllib.unquote(link_url.split("l.php?u=")[-1])
              link_img = post.find('img',{"class":"scaledImageFitWidth"})
              link_img = link_img["src"] if link_img else ""
              link_title = post.find('div',{'class':'mbs'})
              link_title = link_title.text if link_title else ""
              link_summary = post.find('div',{'class':'_6m7'})
              link_summary = link_summary.text if link_summary else ""
              _post["link_url"], _post["link_img"] = link_url, link_img, 
              _post["link_title"] = link_title
              _post["link_summary"] = link_summary
            posts.append(_post)
        return pd.DataFrame(posts)

    def _events(self, url, domain=None):
        #url = "https://facebook.com/guidespark"
        url = 'http://webcache.googleusercontent.com/search?q=cache:'+url
        url = CRAWLERA_URL + urllib.urlencode({'url':url})
        url = urllib.unquote_plus(url)
        url = SPLASH_URL + urllib.urlencode({'url': url})
        html = requests.get(url).text
        data = self._posts(html)
        data["url"] = url
        data["domain"] = domain
        data["event_type"] = "FacebookEvent"
        data = data.applymap(lambda x: self._remove_non_ascii(x))
        data["event_key"] = ["".join(map(str, _data.values()))[:124]
                             for _data in data.to_dict("r")]
        data = [row.dropna().to_dict() for i, row in data.iterrows()]
        r.table("events").insert(data).run(conn)
        return data

    def _domain_search(self, domain, api_key="", name=""):
        df = Google().search('site:facebook.com {0}'.format(domain))
        for url in df.link:
            #browser = Browser('phantomjs')
            #browser.visit(url)
            # html = browser.html
            html = Google().cache(url)
            if domain not in BeautifulSoup(html).text: continue
            val = self._html_to_dict(html)
            val["company_name"] = name
            val["domain"] = domain
            CompanyInfoCrawl()._persist(val, "facebook", api_key)
            break

    def _company_profile(self, name, api_key=""):
        df = Google().search('site:facebook.com {0}'.format(name))
        if df.empty: return df
        url = df.link.tolist()[0]
        html = Google().cache(url)
        #browser = Browser('phantomjs')
        #browser.visit(url)
        val = self._html_to_dict(html)
        print val
        val["company_name"] = name
        CompanyInfoCrawl()._persist(val, "facebook", api_key)

    def _url_to_dict(self, name, url, api_key=""):
        html = Google().cache(url)
        val = self._html_to_dict(html)
        print val
        val["company_name"] = name
        CompanyInfoCrawl()._persist(val, "facebook", api_key)
        
    def _scrape_posts(self, html):
        ''' '''

    def _html_to_dict(self, html):
        html = BeautifulSoup(html)
        logo = html.find('img',{'class':'profilePic'})
        link = html.find('a',{'class':'profileLink'})
        link = link["href"] if link else ""
        logo = logo["src"] if logo else ""
        name = html.find('span',{'itemprop':'name'})
        name = name.text if name else ""
        likes = html.find('span',{'id':'PagesLikesCountDOMID'})
        data = {'logo':logo, 'handle':link, 'name':name}
        if likes:
          data["likes"] = likes.text.split(' likes')[0].replace(',', "")
          data["likes"] = int(data["likes"])
        return data

    def _remove_non_ascii(self, text):
        try:
            return ''.join(i for i in text if ord(i)<128)
        except:
            return text
        
