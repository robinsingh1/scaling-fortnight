import tornado.ioloop
import logging
import json
import tornado.web
import rethinkdb as r
from tornado import ioloop, gen
from schedule import * 
from routes import app
from tornadotools.route import Route
from websocket import *
import redis
import rethink_conn

''' RethinkDB Changefeeds Callbacks '''
r.set_loop_type("tornado")

from rq import Queue
from worker import conn as _conn
q = Queue("low", connection=_conn)
default_q = Queue("default", connection=_conn)
high_q = Queue("high", connection=_conn)

@gen.coroutine
def company_event_changes():
    rethink_conn = yield r.connect(**rethink_conn.conn())
    feed = yield r.table('events').changes().run(rethink_conn)

@gen.coroutine
def company_event_changes():
    rethink_conn = yield r.connect(**rethink_conn.conn())
    feed = yield r.table('company_events').changes().run(rethink_conn)
    while (yield feed.fetch_next()):
        change = yield feed.next()
        # get domain of company 

        qry = {"domain":change["new_val"]["domain"]}
        users = r.table("user_contacts").filter(qry).run(conn)
        max_number_of_elements = 100
        val = change["new_val"]
        for user in users:
            key = "user:#{id}".format(user)
            #redis.zadd(key, score, new_content.id)
            redis.zadd(key, val["timestamp"], val["id"])
            redis.zremrangebyrank(key, max_number_of_elements, -1)
        
app = tornado.web.Application(Route.routes() + [
 (r'/send_message', SendMessageHandler)
] + sockjs.tornado.SockJSRouter(MessageHandler, '/sockjs').urls)

if __name__ == "__main__":
    app.listen(8988)
    tornado.ioloop.IOLoop.current().add_callback(company_event_changes)
    tornado.ioloop.IOLoop.current().start()
