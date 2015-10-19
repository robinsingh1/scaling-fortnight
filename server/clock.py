import requests
import schedule
from scraping.company_event import CompanyEventCron
from apscheduler.schedulers.blocking import BlockingScheduler
import logging
logging.basicConfig()

# daily press email
# daily twitter email
# daily job email

print "starting clock"

sched = BlockingScheduler()

@sched.scheduled_job('interval', seconds=10)
def timed_job():
    print('This job is run every three minutes.')
    CompanyEventCron()._start()

@sched.scheduled_job('cron', day_of_week='mon-fri', hour=17)
def scheduled_job():
    print('This job is run every weekday at 5pm.')

sched.start()
