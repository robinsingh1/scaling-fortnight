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

conn = r.connect(host="localhost", port=28015, db="clearspark")
app = Flask(__name__, static_url_path="", static_folder="client")
app.debug = True

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
