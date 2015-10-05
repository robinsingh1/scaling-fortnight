import unittest
import nose
from nose.plugins.multiprocess import MultiProcess
from nose.tools import with_setup
import rethinkdb as r
import faker

#_multiprocess_can_split_ = True


#If doesn't exist create database test
conn = r.connect(host='localhost', port=28015)
 
try:
  r.db_create('test').run(conn)
except:
  """ """
try:
  r.db('test').table_create('prospect_profile').run(conn)
except:
  """ """

def setup_func():
    # use faker to setup fake profiles
    # they should then create a redis set for all tests
    # 
    "set up test fixtures"

def teardown_func():
    # delete fake profiles from table
    # delete redis set
    # 
    "tear down test fixtures"

@with_setup(setup_func, teardown_func)
def test_on_profile_add_urls_to_redis_sets():
    """

    """
    assert "1" == "1"

@with_setup(setup_func, teardown_func)
def test_profile_create():
    """
     There should be no duplicates on redis sets
    """
    assert "test ..."
    
@with_setup(setup_func, teardown_func)
def test_url_crawl_if_error_insert_into_error_db():
    """ 
      Crawl All URls and all http requests should be 200
      Graceful fail
    """
    assert 1 == 1

# Make sure that rqscheduler works properly
@with_setup(setup_func, teardown_func)
def test_rq_scheduler_url():
    assert 1 == 1

# Graceful failing on html parse error and log into RethinkDB
@with_setup(setup_func, teardown_func)
def test_graceful_failing_on_html_parse_error():
    assert 1 == 1

@with_setup(setup_func, teardown_func)
def test_profile_create():
    """ 
    HTML Results for All results should be parsed correctly and put into RethinkDB
    """
    assert 1 == 1

@with_setup(setup_func, teardown_func)
def test_profile_create():
    """ 
    Graceful failing on html parse error and log into RethinkDB
    """
    assert 1 == 1

@with_setup(setup_func, teardown_func)
def test_profile_create():
    """ 
    Categorize Each Event with appropriate TriggerIQ / Clearspark Feeds from redis
    """
    assert 1 == 1

@with_setup(setup_func, teardown_func)
def test_profile_create():
    """ 
    Fanout to correct feeds
    """
    assert 1 == 1

@with_setup(setup_func, teardown_func)
def test_profile_create():
    """ 
    SockJS Integration
    """
    assert 1 == 1

#:on_profile_add_urls_to_redis_sets()

#nose.run()
