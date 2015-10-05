import tornado.ioloop
import logging
import tornado.web
from tornadotools.route import Route
import rethinkdb as r
from tornado import ioloop, gen
from schedule import * 
from routes import app
from scraping.company_api.company_name_to_domain import CompanyNameToDomain
from scraping.email_pattern.email_hunter import EmailHunter
from scraping.email_pattern.clearbit_search import ClearbitSearch
from scraping.employee_search.employee_search import GoogleSearch

import rethinkdb as r
import json

''' RethinkDB Changefeeds Callbacks '''
r.set_loop_type("tornado")

from rq import Queue
from worker import conn
q = Queue(connection=conn)


@gen.coroutine
def print_changes():
    rethink_conn = yield r.connect(host="localhost", port=28015)
    feed = yield r.db('change_example').table('mytable').changes().run(rethink_conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        print change

@gen.coroutine
def email_pattern():
    rethink_conn = yield r.connect(host="localhost", port=28015, db="triggeriq")
    feed = yield r.table('email_pattern_crawls').changes().run(rethink_conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        print "EMAIL PATTERN CHANGE FEED"
        print change
        # score email_pattern_crawl

@gen.coroutine
def hiring_signals():
    rethink_conn = yield r.connect(host="localhost", port=28015, db="triggeriq")
    feed = yield r.table('hiring_signals').changes().run(rethink_conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        print change
        if change["old_val"] == None:
            val = change["new_val"]
            q.enqueue(CompanyNameToDomain()._update_record, val["company_name"], val["company_key"])
            q.enqueue(GoogleSearch()._update_record, val["company_name"], "", val["company_key"])

        if "domain" in change["new_val"]:
            if change["old_val"] == None or "domain" not in change["old_val"]:
                val = change["new_val"]
                q.enqueue(ClearbitSearch()._update_company_record, val["domain"], val["company_key"])
                q.enqueue(EmailHunter()._update_record, val["domain"], val["company_key"])

        if "email_pattern" in change["new_val"]: 
            if change["old_val"] == None or "email_pattern" not in change["old_val"]:
                print "email_pattern"
                pattern = change["new_val"]["email_pattern"]
                q.enqueue(ClearbitSearch()._bulk_update_employee_record, 
                          change["new_val"]["company_key"],
                          change["new_val"]["email_pattern"]["pattern"],
                          change["new_val"]["domain"])

''' Application Routes '''
@Route(r"/")
class SimpleHandler(tornado.web.RequestHandler):
    def get(self):
        #self.write("Hello, world")
        self.write( {"lol":"lmao"} )

@Route(r"/test_with_name", name="test")
class SimpleHandler2(tornado.web.RequestHandler):
    def get(self):
        #self.write("Hello, world")
        self.write( {"lol":"lmao"} )

@Route(r"/test_with_init", initialize={'init': 'dictionary'})
class SimpleHandler3(tornado.web.RequestHandler):
    pass

@Route(r"/profiles")
class SimpleHandler4(tornado.web.RequestHandler):
    def get(self):
        # TODO - get all routes which belong to
        self.write( {"lol":"lmao"} )

@Route(r"/signals")
class SimpleHandler4(tornado.web.RequestHandler):
    def get(self):
        # TODO - get all routes which belong to
        # TODO - include employees
        self.write( {"lol":"lmao"} )

@Route(r"/signals")
class SimpleHandler4(tornado.web.RequestHandler):
    def get(self):
        # TODO - get all routes which belong to
        self.write( {"lol":"lmao"} )

app = tornado.web.Application(Route.routes())

if __name__ == "__main__":
    app.listen(8988)
    #app.listen(5000)
    tornado.ioloop.IOLoop.current().add_callback(print_changes)
    tornado.ioloop.IOLoop.current().add_callback(hiring_signals)
    tornado.ioloop.IOLoop.current().start()
