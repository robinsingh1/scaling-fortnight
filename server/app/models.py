from remodel.models import Model
from remodel.helpers import create_tables, create_indexes

class User(Model):
    has_one=("UserCompany",)
    has_many=("ProspectProfile",)
    pass

class UserCompany(Model):
    belongs_to("User",)
    pass

# ProspectProfile
class PressProfile(Model):
    belongs_to("ProspectProfile",)
    pass

class HiringProfile(Model):
    belongs_to("ProspectProfile",)
    pass

class TwitterProfile(Model):
    belongs_to("ProspectProfile",)
    pass

class ProspectProfile(Model):
    belongs_to("User",)
    has_many=("TwitterProfile","PressProfile","HiringProfile")
    # User
    # Trigger / Event
    # => trigger_type
    # => keywords
    # Company Attributes
    # Industry
    # City
    # Company Size
    pass

# Clearbit / Clearspark API
class Company(Model):
    pass

class CompanyEmailPattern(Model):
    pass

class CompanyEmployee(Model):
    pass

class CompanyPressRelease(Model):
    pass

class CompanyHiring(Model):
    pass

class CompanyTweet(Model):
    pass

create_tables()
create_indexes()
