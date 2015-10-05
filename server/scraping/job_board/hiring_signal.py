#from parse import Parse
#from clearspark import ClearSpark
import json
#from queue import RQueue
import re
#from people_signal import PeopleSignal
import arrow
import pandas as pd
import time
import bugsnag

'''
from rq import Queue
from worker import conn
q = Queue(connection=conn)
'''

class HiringSignal:
  def _clean(self, company_name):
      return re.sub(r'([^\s\w]|_)+', '', company_name.strip().title())

  def _find_company(self, company_name):
      company_name = self._clean(company_name)
      r = Parse().get('Company', {'where':json.dumps({'company_name':company_name})})
      while "error" in r.json().keys():
          r = Parse().get('Company', {'where':json.dumps({'company_name':company_name})})
          time.sleep(0.5)

      if r.json()['results']:
          return Parse()._pointer('Company',r.json()['results'][0]['objectId'])
      else:
          r = Parse().create('Company', {'company_name':company_name}).json()
          while "objectId" not in r.keys():
              time.sleep(3)
              r = Parse().create('Company', {'company_name':company_name}).json()

          clearspark = ClearSpark()._bulk_company_info(company_name)
          print "ClearSpark request ---> ", clearspark
          return Parse()._pointer('Company', r['objectId'])

  def _test_people_signal(self, report="KORZRzIgFk"):
      qry = json.dumps({"report":Parse()._pointer("SignalReport", report)})
      companies = Parse().get("CompanySignal", {"where":qry, "limit":1000})
      companies = pd.DataFrame(companies.json()["results"])
      _report = Parse().get("SignalReport/{0}".format(report), {"include":"profile,profile.profiles"}).json()
      report = Parse()._pointer("SignalReport", report)
      self._check_for_people_signal(companies, _report["profile"], report)

  def _check_for_people_signal(self, companies, profile, report):
      print "CHECK FOR PEOPLE SIGNALS"
      print "PROFILES"
      profiles, _title = profile['profiles'], 'ProspectTitleProfile'
      titles = [_profile for _profile in profiles if _title in _profile.values()]

      print "FINDING PEOPLE SIGNALS"
      print profiles
      for index, company in companies.iterrows():
          for title in titles:
              for keyword in title['title_keywords']:
                  print Parse().update('SignalReport', report['objectId'], {'loading':True})
                  print keyword
                  _profile = Parse()._pointer('ProspectProfile', profile['objectId'])
                  args =[company, keyword, _profile, report, profile['autoProspect']]
                  if 'prospect_list' in profile.keys(): 
                    args.append(profile['prospect_list'])
                  print "PEOPLE SIGNALS"
                  job=q.enqueue(PeopleSignal()._search, *args, timeout=6000)
                  RQueue()._meta(job, _profile["objectId"])
              #break
          #break
      
      if RQueue()._has_completed(profile['objectId']):
          done = {'done':arrow.now('US/Eastern').timestamp}
          print Parse().update('SignalReport', report['objectId'], done).json()
          print Parse().update('ProspectProfile', _profile['objectId'], done).json()

  def _add_vars(self, co, profile, report):
      co['user']         = [profile['user'] for i in co.index]
      co['user_company'] = [profile['user_company'] for i in co.index]
      co['report']       = [Parse()._pointer("SignalReport", report["objectId"])
                            for i in co.index]
      co['profile']      = [Parse()._pointer("ProspectProfile", profile["objectId"])
                            for i in co.index]
      co['company_name'] = [self._clean(name) for name in co.company_name]
      co['company']      = [self._find_company(name) for name in co.company_name]
      return co

  def _persist(self, companies, profile, report, mining_job=False):
      """ Main Function called by job data sources """
      if companies.empty: 
          if RQueue()._has_completed(profile['objectId']):
              done = {'done':arrow.now('US/Eastern').timestamp}
              print Parse().update('SignalReport', report['objectId'], done).json()
              print Parse().update('ProspectProfile', profile['objectId'], done).json()
          return

      qry, _profile, _report = {'include': 'profiles'}, profile['objectId'], report["objectId"]
      profile = Parse().get('ProspectProfile/'+_profile, qry).json()
      report =  Parse().get('SignalReport/'+_report).json()

      while "error" in profile.keys() or "error" in report.keys():
          time.sleep(1)
          profile = Parse().get('ProspectProfile/'+_profile, qry).json()
          report =  Parse().get('SignalReport/'+_report).json()
          
      companies = companies[~companies.company_name.str.contains('State Farm Agent')]
      companies = companies.drop_duplicates("company_name")
      co = self._add_vars(companies, profile, report)

      res = Parse()._batch_df_create('HiringSignal', companies)
      res = [_res['success']['objectId'] if 'success' in _res.keys() else None for _res in res ] 
      try:
        co['signal'] = [[Parse()._pointer('HiringSignal', _res)] if _res else None for _res in res]
      except:
        bugsnag.notify(traceback, meta_data={"type": "error",
                                             "value": sys.exc_info()[0],
                                             "source": "prospecter-api",
                                             "data": res })
        co['signal'] = [[Parse()._pointer('HiringSignal', _res)] if _res else None for _res in res]
      co = co[['company','signal','report', 'profile','company_name']]
      res = Parse()._batch_df_create('CompanySignal', co)

      results     = [_res['success']['objectId'] for _res in res if 'success' in _res.keys()] 
      success_res = [_res['success']['objectId'] for _res in res if 'success' in _res.keys()] 
      error_res   = [_res['error'] for _res in res if 'error' in _res.keys()] 
      error_res   = [res["objectId"] for res in error_res if "objectId" in res.keys()]

      if len(error_res) == 0:
        try:
          co["objectId"] = success_res
        except:
          #TODO - add BUGSNAG ERROR
          print "ERRORS WTF JUST HAPPENED", co.shape, len(success_res)
      #TODO - add signals to co

      r = Parse()._incr('SignalReport', report['objectId'],'company_count',len(res))
      print Parse().update('SignalReport', report['objectId'], {'loading':False})

      profiles, _title = profile['profiles'], 'ProspectTitleProfile'
      titles = [p for p in profiles if _title in p.values()]
      if titles: 
        self._check_for_people_signal(co, profile, report)
      else:
        print "yoyo"
        if RQueue()._has_completed(profile['objectId']):
            done = {'done':arrow.now('US/Eastern').timestamp}
            print Parse().update('SignalReport', report['objectId'], done).json()
            print Parse().update('ProspectProfile', profile['objectId'], done).json()
        # TODO - send mailgun report summary email


  def _generate_report(self, prospect_profile, mining_job, timestamp=1):
      profile = Parse().get('ProspectProfile/'+prospect_profile, {}).json()
      while "error" in profile.keys():
          time.sleep(2)
          profile = Parse().get('ProspectProfile/'+prospect_profile, {}).json()
          
      signal_data = {'company_count': 0, 'people_count': 0, 'mining_job':mining_job,
                     'profile': Parse()._pointer('ProspectProfile',prospect_profile)}
      signal_data['user'] = profile['user']
      signal_data['user_company'] = profile['user_company']
      if mining_job: signal_data['list_type'] = 'mining_job'
      report_id = Parse().create('SignalReport', signal_data).json()['objectId']
      _report = Parse()._pointer('SignalReport', report_id)
      report = {'reports':{'__op':'AddUnique', 'objects':[_report]}}
      if mining_job: 
          report['mining_days'] = {'__op': 'AddUnique', 'objects':[int(timestamp)]}
          report['day'] = int(timestamp)
      self._persist_report(prospect_profile, report)
      return _report

  def _persist_report(self, prospect_profile, report):
      r = Parse().update('ProspectProfile', prospect_profile, report)
      if 'error' in r.json().keys():
          report = report['reports']['objects']
          r = Parse().update('ProspectProfile', prospect_profile, {'reports': report})

