import clearbit
from email_guess_helper import EmailGuessHelper
import pandas as pd
#from parse import Parse
#from crawl import CompanyEmailPatternCrawl
from fullcontact import FullContact
from fuzzywuzzy import process
from google import Google
import tldextract
import rethinkdb as r
#from crawl import CompanyInfoCrawl

clearbit.key = 'dc80f4192b73cca928f4e7c284b46573'
from rq import Queue
from worker import conn as _conn
q = Queue(connection=_conn)

class ClearbitSearch:
  def _company_profile(self, company_name, api_key=""):
      g = Google().search(company_name)
      g = g[~g.link_text.str.contains("Map for")]
      #print g
      #print g.link.tolist()[0]
      domain = g.link.tolist()[0]
      domain = "{}.{}".format(tldextract.extract(domain).domain,
                              tldextract.extract(domain).tld)
      print domain
      company = clearbit.Company.find(domain=domain, stream=True)
      company = company if company else {}
      company["company_name"] = company_name
      del company["founders"]
      #TODO - perist
      #CompanyInfoCrawl()._persist(company, "clearbit", api_key)

  def _update_company_record(self, domain, _id):
      print "UPDATE COMPANY RECORD"
      conn = r.connect(host="localhost", port=28015, db="triggeriq")
      company = [i for i in r.table('companies').filter({"domain":domain}).run(conn)]
      print "COMPANY FOUND"
      print company
      if not company:
          company = clearbit.Company.find(domain=domain, stream=True)
          company = company if company else {}
          r.table('companies').insert(company).run(conn)

      #print r.table('triggers').filter({"company_key":_id}).update({"company_info":company}, return_changes=True).run(conn)

  def _update_person_record(self, email, _id):
      data = {"social_info": None, "email":email}
      person = clearbit.Person.find(email=email, stream=True)
      if person:
         data["social_info"] = person

      conn = r.connect(host="localhost", port=28015, db="triggeriq")
      r.table('company_employees').get(_id).update(data).run(conn)

  def _bulk_update_employee_record(self, _id, pattern, domain):
      conn = r.connect(host="localhost", port=28015, db="triggeriq")
      #print _id
      _id = "eab41007-6b8c-11e5-b7e1-7831c1d137aa"
      employees = r.table("company_employees").filter({"company_id":_id}).run(conn)
      print employees
      for person in employees:
          #pattern = change["new_val"]["email_pattern"]
          
          _data = {"first":person["name"].split(" ")[0].lower(), 
                   "last":person["name"].split(" ")[-1].lower()}
          email = pattern.format(**_data)+"@"+domain
          print email, person["id"]
          q.enqueue(ClearbitSearch()._update_person_record, email, person["id"])

  def _company_search(self, domain):
    company = clearbit.Company.find(domain=domain, stream=True)
    return company

  def _email_search(self, email, api_key=""):
      try:
          person = clearbit.Person.find(email=email, stream=True)
      except:
          person = None
      data = {"pattern":None, "name":None, "email":email,
              "domain":email.split("@")[-1], "crawl_source":"email_hunter"}
      if person:
          pattern = EmailGuessHelper()._find_email_pattern(person["name"]["fullName"], email)
          if pattern: 
              data = {"pattern":pattern, "name":person["name"]["fullName"], "email":email,
                      "domain":email.split("@")[-1], "crawl_source":"email_hunter"}
      elif not person or not pattern:
          person = FullContact()._person_from_email(email)
          print person
          try:
              person = person["contactInfo"]["fullName"]
              fullcontact_person = True
          except:
              fullcontact_person = False

          if fullcontact_person:
              person = person["contactInfo"]["fullName"]
              pattern = EmailGuessHelper()._find_email_pattern(person, email)
              data = {"pattern":pattern, "name":person, "email":email,
                      "domain":email.split("@")[-1], "crawl_source":"email_hunter"}
              print pattern
          else:
              _email = email.replace(".", " ").replace("-", " ").replace("_"," ")
              _email = _email.replace("@", " ")
              g = Google().search("{0} site:linkedin.com/pub".format(_email))
              g1 = Google().search("{0} site:linkedin.com/pub".format(_email.split(" "[0])))
              g2 = Google().search("{0} site:linkedin.com/pub".format(_email).split(" ")[-1])
              g = pd.concat([g, g1, g2])
              choices = [i.split(" |")[0] for i in g.link_text]
              person = process.extract(_email, choices, limit=1)
              try:
                person = person[0][0]
              except:
                ''' '''
              pattern = EmailGuessHelper()._find_email_pattern(person, email)
              print "google search pattern", pattern
              if pattern:
                  data = {"pattern":pattern, "name":person, "email":email,
                          "domain":email.split("@")[-1], "crawl_source":"email_hunter"}
              else:
                  data = {"pattern":None, "name":None, "email":email,
                          "domain":email.split("@")[-1], "crawl_source":"email_hunter"}
      #data = pd.DataFrame([data])
      conn = r.connect(host="localhost", port=28015, db="triggeriq")
      r.table('email_pattern_crawls').insert(data).run(conn)
      #CompanyEmailPatternCrawl()._persist(data, "emailhunter", api_key)
      # persist to rethinkdb
      print "person", person

