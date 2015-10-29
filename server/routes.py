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
sentry = Sentry(app, dsn='https://6ede62e4646546e38a4d79ac88812ca5:29843b37aec14df6ba5d0597a66e3e48@app.getsentry.com/55648')
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
    conn = r.connect(**rethink_conn.conn())
    data = list(r.table("user_social_profiles").run(conn))
    return make_response(json.dumps(data))

@app.route("/events")
def company_events():
    conn = r.connect(**rethink_conn.conn())
    ev = pd.DataFrame(list(r.table("events").limit(30).run(conn)))
    ev = ev.sort("timestamp", ascending=False)
    #ev = ev.drop_duplicates("event_type")
    data = [row.dropna().to_dict() for i, row in ev.iterrows()]
    return make_response(json.dumps(data))

@app.route("/events/<domain>")
def get_domain_events(domain):
    conn = r.connect(**rethink_conn.conn())
    data = list(r.table("events").filter({"domain":domain}).run(conn))
    return make_response(json.dumps(data))

@app.route("/contacts/<domain>")
def get_contact(domain):
    conn = r.connect(**rethink_conn.conn())
    data = list(r.table("user_social_profiles").filter({"company_domain":domain}).run(conn))
    return make_response(json.dumps(data))

@app.route("/company/<domain>")
def get_company(domain):
    conn = r.connect(**rethink_conn.conn())
    data = list(r.table("companies").filter({"domain":domain}).run(conn))
    data = data[0] if data else {}
    return make_response(json.dumps(data))

@app.route("/feed/<user_id>")
def user_feed(user_id):
    # TODO paginate
    key = "user:#{0}".format(user_id)
    feed = redis.zquery(key, 0, 20)
    conn = r.connect(**rethink_conn.conn())
    events = r.table("company_events").get_all(r.args(feed)).run(conn)
    return make_response(json.dumps(events))

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    app.run(host='0.0.0.0', port=8000)
