from splinter import Browser
from bs4 import BeautifulSoup
import pandas as pd
import requests
import urllib

class DuckDuckGo:
    def search(self, company_name):
        qry = urllib.urlencode({"q":company_name})
        url = "https://duckduckgo.com/?{0}".format(qry)
        _p = {"url":url, "timeout": 10, "wait": 0.5}
        html = requests.get("http://localhost:8950/render.html",params=_p).text

        """
        browser = Browser("chrome")
        #browser.visit("https://duckduckgo.com/?q=Sunstate+Equipment+Company")
        browser.visit("https://duckduckgo.com/?{0}".format(qry))
        html = browser.html
        """

        bs = BeautifulSoup(html)
        dd = []
        for row in bs.find_all("div",{"class":"result"})[1:]:
            link_text = row.find("a",{"class":"result__a"})
            link_span = row.find("div",{"class":"result__snippet"})
            link = row.find("a",{"class":"result__check"})
            
            link_text = link_text.text if link_text else None
            link_span = link_span.text if link_span else None
            link = link["href"] if link else None
            
            dd.append({"link_text":link_text,"link_span":link_span,"link":link})
        dd = pd.DataFrame(dd)
        return dd
    
class Bing:
    def search(self, company_name):
        #html = requests.get("http://www.bing.com/search?q=Sunstate+Equipment+Company").text
        qry = urllib.urlencode({"q":company_name})
        html = requests.get("http://www.bing.com/search?{0}".format(qry)).text
        bs = BeautifulSoup(html)
        bg = []
        for row in bs.find_all("li",{"class":"b_algo"}):
            link_text = row.find("h2")
            link_span = row.find("div",{"class":"b_caption"})
            link = row.find("a")
            
            link_text = link_text.text if link_text else None
            link_span = link_span.text if link_span else None
            link = link["href"] if link else None
            
            bg.append({"link_text":link_text,"link_span":link_span,"link":link})
        bg = pd.DataFrame(bg)
        return bg
    
class Yandex:
    def search(self, company_name):
        qry = urllib.urlencode({"text":company_name})
        url ="https://www.yandex.com/search/?{0}".format(qry)

        
        #browser = Browser("phantomjs")
        #browser.visit("https://www.yandex.com/search/?lr=87&text=Sunstate%20Equipment%20Company")
        """
        browser.visit("https://www.yandex.com/search/?{0}".format(qry))
        html = browser.html
        browser.quit()
        """
        _p = {"url":url, "timeout": 10, "wait": 0.5}
        html = requests.get("http://localhost:8950/render.html",params=_p).text
        bs = BeautifulSoup(html)

        yd = []
        for row in bs.find_all("div",{"class":"serp-item"}):
            link_text = row.find("h2")
            link_span = row.find("div",{"class":"serp-item__text"})
            link = row.find("a")
            
            link_text = link_text.text if link_text else None
            link_span = link_span.text if link_span else None
            link = link["href"] if link else None
            
            yd.append({"link_text":link_text,"link_span":link_span,"link":link})
        yd = pd.DataFrame(yd)
        return yd
    
