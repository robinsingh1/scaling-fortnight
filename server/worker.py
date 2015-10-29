import os
import redis
from rq import Worker, Queue, Connection
import urlparse
import getopt
import sys
from multiprocessing import Process
import bugsnag
from splinter import Browser

# Preload heavy libraries
from bs4 import BeautifulSoup
import pandas as pd
import requests
import bugsnag
from bugsnag.flask import handle_exceptions

from raven import Client
from raven.transport.http import HTTPTransport
from rq.contrib.sentry import register_sentry

client = Client('https://6ede62e4646546e38a4d79ac88812ca5:29843b37aec14df6ba5d0597a66e3e48@app.getsentry.com/55648', transport=HTTPTransport)

#browser = Browser("phantomjs")

concurrency = 1
bugsnag.configure(
  api_key = "ac1c48963961d9ae5cc87e4747f8629e",
)

try:
  opts, args = getopt.getopt(sys.argv[1:],"c:",[])
except getopt.GetoptError as e:
  print e
  print 'worker.py -c <concurrency>'
  sys.exit(2)
for opt, arg in opts:
  if opt == '-c':
    concurrency = int(arg)

listen = ['high', 'default', 'low']

redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
conn = redis.from_url(redis_url)

# TODO add rethinkdb connection

def work():
  with Connection(conn):
    worker = Worker(map(Queue, listen), exc_handler=my_handler)
    register_sentry(client, worker)
    worker.work()

def my_handler(job, exc_type, exc_value, traceback):
    bugsnag.notify(Exception("Test Error"))
    bugsnag.notify(traceback, meta_data={"type":exc_type,
                                         "value":exc_value,
                                         "source": "Clearspark"})

if __name__ == '__main__':
  processes = [Process(target=work) for x in range(concurrency)]
  for process in processes:
    process.start()
  for process in processes:
    process.join()
