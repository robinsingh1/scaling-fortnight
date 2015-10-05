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
class ProspectProfile(Model):
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

# Triggers / Events 
class CompanyBlogPost(Model):
    pass

class CompanyEvent(Model):
    pass

class CompanyFacebookPost(Model):
    pass

class CompanyGlassdoorReview(Model):
    pass

class CompanyInfoCrawl(Model):
    pass

class CompanyLinkedinPost(Model):
    pass

class CompanyNews(Model):
    pass

class CompanyPressRelease(Model):
    pass

class CompanyTechnology(Model):
    pass

class CompanyTweet(Model):
    pass

class CompanyEmailPattern(Model):
    pass

class CompanyHiring(Model):
    pass

# Other 
class CompanySimilar(Model):
    pass

class UserContact(Model):
    pass

class CompanyEmailPattern(Model):
    pass

class CompanyEmployee(Model):
    pass


create_tables()
create_indexes()
