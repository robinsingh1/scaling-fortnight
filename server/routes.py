import os
from flask import Flask, send_from_directory, render_template
#from flask.ext.login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required
from redis import Redis
from rq_scheduler import Scheduler
from datetime import datetime

app = Flask(__name__, static_url_path="", static_folder="client")
#login_manager = LoginManager()

#TODO 
# - login
# - logout
# - make it work in dokku
# - deploy from brunch to flask app

@app.route("/login")
def login():
  return render_template('login.html')
  #return "Hello from python"

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
    ''' Start Databases '''
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
