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

#browser = Browser("phantomjs")

concurrency = 1
bugsnag.configure(
  api_key = "2556d33391f9accc8ea79325cd78ab62"
)

redis_url = os.getenv('REDIS_URL', 'redis://localhost:6379')
conn = redis.from_url(redis_url)

"""
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


def work():
  with Connection(conn):
    Worker(map(Queue, listen), exc_handler=my_handler).work()

def my_handler(job, exc_type, exc_value, traceback):
  bugsnag.notify(traceback, meta_data={"type":exc_type,
                                       "value":exc_value,
                                       "source": "prospecter-api"})

if __name__ == '__main__':
  processes = [Process(target=work) for x in range(concurrency)]
  for process in processes:
    process.start()
  for process in processes:
    process.join()
"""

