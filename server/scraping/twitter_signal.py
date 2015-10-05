from google import Crawlera
from google import Google
from bs4 import BeautifulSoup
from splinter import Browser
from parse import Parse
from google import Google
import json
import requests
from bs4 import BeautifulSoup
#from crawl import CompanyInfoCrawl
import tldextract
import pandas as pd

class Twitter:
    def _signal(self, link, api_key=""):
        html = Google().cache(link)
        info = self._html_to_dict(html)
        tweets = self._tweets(html)
        CompanyInfoCrawl()._persist(info, "twitter", api_key)
        for tweet in tweets:
          CompanyExtraInfoCrawl()._persist(tweet, "tweets", api_key)

    def _recent(self):
        df = Google().search("site:twitter.com", period="h")
        for link in df.link:
            q.enqueue(Twitter()._signal, link)

    def tweets(self, html, api_key):
        #html = Google().cache("https://twitter.com/guidespark")
        tw = BeautifulSoup(html)
        tweets = []
        for tweet in tw.find_all("div",{"class":"ProfileTweet"}):
            text = tweet.find("p",{"class":"ProfileTweet-text"}).text
            hashtags = [hashtag["href"] for hashtag in tweet.find_all("a",{"class":"twitter-hashtag"})]
            mentions = ["twitter.com"+reply["href"]
                        for reply in tweet.find_all("a",{"class":"twitter-atreply"})]
            links = [link["href"]
                    for link in tweet.find_all("a",{"class":"twitter-timeline-link"})]
            photos = [img["src"]
                      for img in tweet.find_all("img",{"class":"TwitterPhoto-mediaSource"})]
            tweet = {"text":text,"hashtags":hashtags,"mentions":mentions,
                     "links":links, "photos":photos}
            print tweet
            tweets.append(tweet)
            #CompanyExtraInfoCrawl()._persist(tweet, "tweets")
        tweets = pd.DataFrame(tweets)
        return tweets
    
    def _search(self, qry):
        #html = Google().cache("https://twitter.com/guidespark")
        qry = qry.replace(" ","%20")
        url = "https://twitter.com/search?f=realtime&q={0}&src=typd"
        html = Crawlera()._get(url.format(qry)).text
        tw = BeautifulSoup(html)
        tweets = []
        for tweet in tw.find_all("div",{"class":"tweet"}):
            text = tweet.find("p",{"class":"tweet-text"})
            if text:
                text = text.text
            else:
                continue
            hashtags = [hashtag["href"] for hashtag in tweet.find_all("a",{"class":"twitter-hashtag"})]
            mentions = ["twitter.com"+reply["href"]
                        for reply in tweet.find_all("a",{"class":"twitter-atreply"})]
            links = [link["href"]
                    for link in tweet.find_all("a",{"class":"twitter-timeline-link"})]
            photos = [img["src"]
                      for img in tweet.find_all("img",{"class":"TwitterPhoto-mediaSource"})]
            tweet = {"text":text,"hashtags":hashtags,"mentions":mentions,
                     "links":links, "photos":photos, 
                     "name":tweet.find("strong",{"class":"fullname"}).text,
                     "handle":tweet.find("span",{"class":"username"}).text,
                     "profile_pic":tweet.find("img",{"class":"avatar"})["src"],
                     "timestamp":tweet.find("span",{"class":"_timestamp"})["data-time"],
                     "time_ago":tweet.find("span",{"class":"_timestamp"}).text}
            tweets.append(tweet)
            #CompanyExtraInfoCrawl()._persist(tweet, "tweets")
        tweets = pd.DataFrame(tweets)
        Parse()._batch_df_create("Tweet", tweets)
        # TODO - find company_name + title from twitter
        return tweets

    def _daily_collect(self, profile_id):
        profile = Parse().get("ProspectProfile/"+profile_id, {"include":"profiles"})
        _signal = [i["press_id"] for i in profile.json()["profiles"]
                   if i["className"] == "TwitterProfile"]
        d1, d2 = Helper()._timestamp()
        qry = {"signal":_signal[0],"timestamp":{"$gte": d1,"$lte": d2}}
        press = Parse().get("Tweet",{"limit":1000, "skip":0, "count":True,
                                     "where": json.dumps(qry),
                                     "order":"-timestamp"}).json()["results"]

        profile  = profile.json()
        report = {"user": profile["user"], "user_company": profile["user_company"]}
        report["profile"] = Parse()._pointer("ProspectProfile", profile["objectId"])
        _report = Parse().create("SignalReport", report).json()["objectId"]
        _report = Parse()._pointer("SignalReport", _report)

        cos = pd.DataFrame(press)
        if cos.empty: return
        cos = cos[cos.company_name.notnull()].drop_duplicates("company_name")
        cos["report"]  = [_report] * len(cos.index)
        Parse()._batch_df_create("PeopleSignal", cos)
        # TODO - Queue ProspectTitle Search if present
        q.enqueue(PeopleSignal()._check_for_people_signal, cos,  profile, _report)

