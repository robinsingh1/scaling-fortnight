import os
from flask import Flask, send_from_directory, render_template, make_response
#from flask.ext.login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required
import pandas as pd
from redis import Redis
from rq_scheduler import Scheduler
from datetime import datetime
from crossdomain import crossdomain
import rethinkdb as r
import json
from flask.ext.responses import json_response, xml_response, auto_response
from scraping.company_api.company_name_to_domain import CompanyNameToDomain
from scraping.email_pattern.email_hunter import EmailHunter
from scraping.email_pattern.clearbit_search import ClearbitSearch
from scraping.employee_search.employee_search import GoogleEmployeeSearch

#login_manager = LoginManager()

from rq import Queue
from worker import conn as _conn
q = Queue("low", connection=_conn)
default_q = Queue("default", connection=_conn)
high_q = Queue("high", connection=_conn)

conn = r.connect(host="localhost", port=28015, db="triggeriq")
app = Flask(__name__, static_url_path="", static_folder="client")
#app.debug = True

#TODO 
# - login
# - logout
# - make it work in dokku
# - deploy from brunch to flask app

@app.route("/test_1")
def test_1():
    return "test_3"

@app.route("/company_research")
def company_research():
  triggers = r.table("triggers").coerce_to("array").run(conn)

  for val in triggers:
      if "domain" not in val.keys(): continue
      print val["domain"]
      q.enqueue(ClearbitSearch()._update_company_record, 
                val["domain"], val["company_key"])
  return make_response(json.dumps({"started":True}))

@app.route("/trigger_research")
def trigger_research():
  triggers = r.table("triggers").coerce_to("array").run(conn)

  for val in triggers:
      q.enqueue(CompanyNameToDomain()._update_record, 
                val["company_name"], val["company_key"])
      """
      q.enqueue(GoogleEmployeeSearch()._update_record, 
                val["company_name"], "", val["company_key"])
      """
  return make_response(json.dumps({"started":True}))
  #return "Hello from python"

@app.route("/login")
def login():
  return render_template('signup.html')

@app.route("/signup")
def signup():
  return render_template('signup.html')

@app.route("/logout")
def logout():
    logout_user()
    return redirect(somewhere)

@app.route("/app")
#TODO requires authentication
def app_hello():
  return send_from_directory("client", "index.html")

@app.route("/test")
#TODO requires authentication
def test():
  #return app.send_static_file('static/landing/landing_page.html')
  return render_template('landing_page.html')

@app.route("/")
#TODO requires authentication
def hello():
  #return app.send_static_file('static/landing/landing_page.html')
  return render_template('landing_page.html')

# application routes
@app.route("/profiles")
@crossdomain(origin='*')
def profiles():
  profiles = r.table("prospect_profiles").coerce_to("array").run(conn)
  #return flask.jsonify(**{"lol":"lmao"})
  return make_response(json.dumps(profiles))

# application routes
@app.route("/profile/<_id>/companies")
@crossdomain(origin='*')
def profile_companies():
    profiles = r.table("prospect_profiles").coerce_to("array").run(conn)
    #return flask.jsonify(**{"lol":"lmao"})
    return make_response(json.dumps(profiles))

@app.route("/triggers")
@crossdomain(origin='*')
def triggers():
    # include profile
    #data = r.table("triggers").limit(50).coerce_to("array").run(conn)
    data = r.table("triggers").eq_join("profile", 
           r.table("prospect_profiles")).coerce_to("array").zip().run(conn)
    data = pd.DataFrame(data)
    data = data[data.company_info.notnull()].to_dict("r")[:5]
    return make_response(json.dumps(data))

@app.route("/profiles/<_id>")
@crossdomain(origin='*')
def profile_id(_id):
    data = r.table("prospect_profiles").get(_id).coerce_to("array").run(conn)
    return make_response(json.dumps(data))

@app.route("/company/<_id>")
@crossdomain(origin='*')
def company_id(_id):
    data = r.table("triggers").get(_id).coerce_to("array").run(conn)
    #return render_template('landing_page.html')
    return make_response(json.dumps(data))

@app.route("/company/<_id>/employees")
@crossdomain(origin='*')
def company_employees(_id):
    print _id
    data = r.table("company_employees").filter({"company_id":_id}).coerce_to("array").run(conn)
    #return render_template('landing_page.html')
    #data = [1,2,3]
    return make_response(json.dumps(data))

# Redis Datastructures
# URL Set to Crawl for each source
# User Profiles Stored in hash
# => Twitter Profiles
# => Job Profiles
# => Press Profiles
# => Industry Profiles
# User Company Domains stored in hash

# Features / Reqs
# Real-time String filtering
# Real-time Property Filtering
# Real-time feed/ml scoring
# Add Activity Feeds
# Fan Out Adding To Feeds

# Clearspark 
# => Subscribing to a list of domains
# => User specific feeds

# TriggerIQ 
# [press, industry] 
# => Subscribing to an event

# [twitter, jobs] 
# => Subscribing to an event 
# => do a string match 
# => and then add to feed 

# TODO
# Generate Fake Test Data For Schema


#login_manager.init_app(app)
if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=5000)
