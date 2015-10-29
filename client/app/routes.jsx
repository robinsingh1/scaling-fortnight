var TabbedArea = ReactBootstrap.TabbedArea
var TabPane = ReactBootstrap.TabPane
var SplitButton = ReactBootstrap.SplitButton
var MenuItem= ReactBootstrap.SplitButton
var Modal= ReactBootstrap.Modal
var Button = ReactBootstrap.Button
var Thumbnail= ReactBootstrap.Thumbnail
var Alert = ReactBootstrap.Alert
var LandingPage = require("landing_page")
var Pricing = require("pricing")
var Login = require("login")
var Signup = require("signup")
var Sidebar = require("sidebar")
var Profile = require("profile")
var ContactDetail = require("contact_detail")
var CompanyDetail = require("company_detail")

var CompanyEventCard = require("event_cards").CompanyEventCard
/*
var CompanyBlogEventCard = require("event_cards").CompanyBlogEventCard
var CompanyNewsEventCard = require("event_cards").CompanyNewsEventCard
var CompanyPressEventCard = require("event_cards").CompanyPressEventCard
var CompanyHiringEventCard = require("event_cards").CompanyHiringEventCard
var FacebookEventCard = require("event_cards").FacebookEventCard
var TwitterEventCard = require("event_cards").TwitterEventCard
var LinkedinEventCard = require("event_cards").LinkedinEventCard
*/

var CompanyBlogEventContent = require("event_cards").CompanyBlogEventContent
var CompanyNewsEventContent = require("event_cards").CompanyNewsEventContent
var CompanyPressEventContent = require("event_cards").CompanyPressEventContent
var CompanyHiringEventContent = require("event_cards").CompanyHiringEventContent
var FacebookEventContent = require("event_cards").FacebookEventContent
var TwitterEventContent = require("event_cards").TwitterEventContent
var LinkedinEventContent = require("event_cards").LinkedinEventContent

var Route = ReactRouter.Route;
var RouteHandler = ReactRouter.RouteHandler;

var Navbar = React.createClass({
  gotoHome: function() {
    location.href= "#"
  },

  render: function() {
    return (
      <header className="header" style={{paddingTop:20,paddingBottom:40}}>
        <ul className="text-muted">
          <li className="app-logo">
            <div>
            <img src="images/blaze-logo.png" style={{marginTop:4,height:18,marginLeft:-15,display:"none"}}/>
            <div style={{}} onClick={this.gotoHome} style={{color:"#FFBB01",marginLeft:-20}}> <i className="fa fa-bolt" />
              ClearSpark</div>
            </div>
          </li>
          <div style={{display:"none"}}>
            <li style={{fontWeight:"bold",color:"#0079ff",color:"#000"}}>DATASETS</li>
            <li>USERS</li>
            <li>EXPLORE</li>
            <li>COMPUTE</li>
            <li style={{float:"right",marginRight:50}}>LOGOUT</li>
          </div>
        </ul>
      </header>
    )
  }
})


var Main = React.createClass({
  render: function() {
    return (
      <div style={{height:"100%"}}>
      </div>
    )
  }
})

var Dashboard = React.createClass({
  render: function() {
    return (
      <div>
      </div>
    )
  }
})

var App = React.createClass({
  render: function() {
    return (
      <div className="container app"> 
          <RouteHandler/>
      </div>
    )
  }
})

var AuthenticatedApp = React.createClass({
  render: function() {
    return (
      <div className="app" >
          <Sidebar />
          <div className="col-xs-7 col-sm-9 col-md-9 main-bg" style={{overflow:"auto"}}>
            <RouteHandler/>
          </div>
      </div>
    )
  }
});

var Lookup = React.createClass({
  render: function() {
    return (
      <div>
        <div>
          <br/>
          <input className="form-control lookup-input" placeholder="Enter search term"/>
          
        </div>

      </div>
    )
  }
})

var Feed = React.createClass({
  getInitialState: function() {
    return {
      events : []
    }
  },

  componentDidMount: function() {
    var _this = this;
    $.ajax({
      url:location.origin+"/events",
      dataType:"json",
      success: function(res) {
        console.log(res)
        _this.setState({events: res})
      },
      error: function(err) {
        console.log(err)
      }
    })
  },

  render: function() {
    var events = _.map(this.state.events, function(event) {
      if(event.event_type == "CompanyBlogEvent")
        return <CompanyEventCard 
                logo={"fa fa-rss"} event={event} 
                content={<CompanyBlogEventContent event={event}/>}/>
      else if(event.event_type == "CompanyNewsEvent")
        return <CompanyEventCard 
                logo={"fa fa-newspaper-o"} event={event} 
                content={<CompanyNewsEventContent event={event}/>}/>
      else if(event.event_type == "CompanyPressEvent")
        return <CompanyEventCard 
                logo={"fa fa-bullhorn"} event={event} 
                content={<CompanyPressEventContent event={event}/>}/>
      else if(event.event_type == "CompanyHiringEvent")
        return <CompanyEventCard 
                logo={"fa fa-suitcase"} event={event} 
                content={<CompanyHiringEventContent event={event}/>}/>
      else if(event.event_type == "FacebookEvent")
        return <CompanyEventCard 
                logo={"fa fa-facebook"} event={event} 
                content={<FacebookEventContent event={event}/>}/>
      else if(event.event_type == "TweetEvent")
        return <CompanyEventCard 
                logo={"fa fa-twitter"} event={event} 
                content={<TwitterEventContent event={event}/>}/>
      else if(event.event_type == "LinkedinEvent")
        return <CompanyEventCard 
                logo={"fa fa-linkedin"} event={event} 
                content={<LinkedinEventContent event={event}/>}/>
    })
    return (
        <div className="col-md-offset-2 col-md-9" style={{paddingTop:50}}>
          {events}
        </div>
    )
  }
})

var ContactCard = React.createClass({
    gotoContactDetail: function() {
      location.href = "#/contact/"+this.props.contact.email
    },

    gotoCompanyDetail: function(e) {
      location.href = "#/company/"+this.props.contact.employment.domain
      e.stopPropagation()
    },

    render: function() {
        contact = this.props.contact
        //console.log(contact)
        return (
              <div onClick={this.gotoContactDetail} style={{cursor:"pointer"}}>
              <img src={(contact.avatar) ? contact.avatar : "images/user.png"}
                   style={{height:30,width:30,borderRadius:20,float:"left",marginLeft:20,marginRight:15}}/>
                <h5 style={{fontWeight:600,marginBottom:5}}>{(contact.name) ? contact.name.fullName : ""}</h5>
                <h6 style={{marginTop:5}}>
                  {(contact.employment) ? <span>{contact.employment.title + ", "}<a href="javascript:" onClick={this.gotoCompanyDetail} style={{color:"white",fontWeight:"bold"}}>{contact.employment.name}</a></span> : ""}
                </h6>
    
              <hr style={{marginLeft:20,marginRight:20,color:"black",backgroundColor:"rgba(255,255,255,0.1)",opacity:"0.3",marginTop:10,marginBottom:10}}/>
              </div>
      )
    }
})




var Contacts = React.createClass({
  getInitialState: function() {
    return {
      contacts: []
    }
  },
  
  componentDidMount: function() {
    var _this = this;
    $.ajax({
      url:location.origin+"/contacts",
      dataType:"json",
      success: function(res) {
        //console.log(res)
        _this.setState({contacts: res})
      },
      error: function(err) {
        console.log(err)
      }
    })

  },

  render: function() {
    contacts = _.map(this.state.contacts.concat(this.state.contacts), 
        function(contact) {
        if(contact.name)
          return <ContactCard contact={contact}/>
    })

    return (
      <div>
        <div className="row">
          <div className="">
            <div style={{width:250,height:"100%",backgroundColor:"rgba(255,255,255,0.3)",position:"absolute",top:0, boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 1px 2px 1px",fontWeight:800,color:"white",position:"fixed",overflow:"auto"}}>
              <br/>
              <div style={{textAlign:"center"}}>{"CONTACTS ("+contacts.length+")"}</div>
              <hr style={{marginLeft:20,marginRight:20}}/>
              {contacts}

            </div>
          </div>
          <div style={{marginLeft:200}}>
            <Feed />
          </div>
        </div>
      </div>
    )
  }
})

// declare our routes and their hierarchy
var routes = (
  <Route>
    <Route path="/" handler={App}>
      <Route path="" handler={LandingPage}/>
      <Route path="login" handler={Login}/>
      <Route path="signup" handler={Signup}/>
      <Route path="pricing" handler={Pricing}/>
    </Route>
    <Route path="app" handler={AuthenticatedApp}>
      <Route path="" handler={Feed}/>
      <Route path="contacts" handler={Contacts}/>
      <Route path="profile" handler={Profile}/>
      <Route path="/contact/:email" handler={ContactDetail} />
      <Route path="/company/:domain" handler={CompanyDetail} />
    </Route>
  </Route>
);

module.exports = routes;
