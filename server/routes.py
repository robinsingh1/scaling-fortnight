import os
from flask import Flask, send_from_directory, render_template, make_response
#from flask.ext.login import LoginManager, UserMixin, current_user, login_user, logout_user, login_required
import pandas as pd
import bugsnag
from bugsnag.flask import handle_exceptions
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
from scraping.companies import Companies

from raven.contrib.flask import Sentry

#login_manager = LoginManager()

from rq import Queue
from worker import conn as _conn
q = Queue("low", connection=_conn)
default_q = Queue("default", connection=_conn)
high_q = Queue("high", connection=_conn)

app = Flask(__name__, static_url_path="", static_folder="client")
app.debug = True
sentry = Sentry(app, dsn='https://9ec1f6b3912344ebbab7a7b831048c73:a8582bbaec804a118772dc892885fef2@app.getsentry.com/55642')
handle_exceptions(app)

bugsnag.notify(Exception("Test Error"))

@app.route("/")
#TODO requires authentication
def app_hello():
  return send_from_directory("client", "index.html")

@app.route("/test/event")
#TODO requires authentication
def test_cron():
    CompanyEventCron()._start()
    #Companies()._test("guidespark","guidespark.com")

@app.route("/contacts")
#TODO requires authentication
def user_contacts():
    conn = r.connect(db="clearspark")
    l = list(r.table("user_social_profiles").run(conn))
    data = [i["person"] for i in l if "person" in i.keys()]
    return make_response(json.dumps(data))

@app.route("/events")
def company_events():
    conn = r.connect(db="clearspark")
    ev = pd.DataFrame(list(r.table("events").run(conn)))
    ev = ev.drop_duplicates("event_type")
    data = [row.dropna().to_dict() for i, row in ev.iterrows()]
    return make_response(json.dumps(data))

@app.route("/feed/<user_id>")
def user_feed(user_id):
    # TODO paginate
    key = "user:#{0}".format(user_id)
    feed = redis.zquery(key, 0, 20)
    conn = r.connect(db="clearspark")
    events = r.table("company_events").get_all(r.args(feed)).run(conn)
    return make_response(json.dumps(events))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=8000)
