import nylas
import pandas as pd
import time
from nylas import APIClient
#from nylas.util import generate_id

APP_ID = 'dwgife1rhiw22t8a8gzdmir9b'
APP_SECRET = '6nuzrvbyrbsuwxuzw8nrgtci7'
ACCESS_TOKEN = "aRAdr9eBwOHrlIgbtIuBHocH54zuze"
client = APIClient(APP_ID, APP_SECRET, ACCESS_TOKEN)

ns = client.namespaces[0]

messages = ns.messages.where(**{'from': 'robin@robinsingh.co'})
msg = messages.all()
sent = pd.DataFrame(pd.DataFrame([dict(i) for i in msg]).to.sum()).email.drop_duplicates().tolist()

ms = ns.messages.all()

ct = ns.contacts.all()
cl = ns.calendars.all()
ev = ns.events.all()

ct = pd.DataFrame([dict(i) for i in ct])
cl = pd.DataFrame([dict(i) for i in cl])
ev = pd.DataFrame([dict(i) for i in ev])

# get contacts
# get number of messages with each contact
# get number of threads with each contact
# get number of events / meetings with each contact

thread_ids = pd.Series([i["thread_id"] for i in msg]).unique()
threads = [ns.threads.find(i) for i in thread_ids]

contact_meetings = pd.DataFrame(ev.participants.dropna().sum()).email.value_counts()
threads = [dict(i) for i in threads]

contact_msgs = pd.DataFrame(pd.DataFrame(threads).participants.dropna().sum()).email.value_counts()

class EmailIntegration:
    def get_messages(self):
        """ """

    def get_messsages(self):
        """ """

# Email Sent But Got No Response - (1)
# Emails Awaiting Response From You - Small Threads (2)
# Emails Awaiting Response From You - Long Threads (>2)

# Threads that might need a followup (you sent but never got back) - Small Threads (>3)
# Which threads to ignore?

from textblob import TextBlob
import pattern
import sklearn
import ramp
from sklearn import datasets

# Dataset
# number of people on thread
# number of messages in thread
# email in thread
# importance of email in thread
# last email message
