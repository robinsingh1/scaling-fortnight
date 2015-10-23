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

var Route = ReactRouter.Route;
var RouteHandler = ReactRouter.RouteHandler;

var Navbar = React.createClass({
  render: function() {
    return (
      <header className="header" style={{paddingTop:20,paddingBottom:40}}>
        <ul className="text-muted">
          <li className="app-logo">
            <div>
            <img src="images/blaze-logo.png" style={{marginTop:4,height:18,marginLeft:-15,display:"none"}}/>
            <div style={{}} style={{color:"#FFBB01",marginLeft:-20}}> <i className="fa fa-bolt" />
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
          <div className="col-xs-7 col-sm-9 col-md-9 main-bg">
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
  render: function() {
    return (
        <div className="col-md-offset-2 col-md-8">
        </div>
    )
  }
})

var Feed = React.createClass({
  render: function() {
    return (
        <div className="col-md-offset-2 col-md-7">
          <br/>
          <CompanyEventCard />
          <br/>
          <div className="panel panel-default" style={{boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 1px 2px 1px",height:150}}>
            <div className="panel-body">
              lol
            </div>
          </div>
          <br/>
          <div className="panel panel-default" style={{boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 1px 2px 1px",height:150}}>
            <div className="panel-body">
              lol
            </div>
          </div>
        </div>
    )
  }
})

var ContactCard = React.createClass({
    render: function() {
        return (
              <div>
              <img src="images/user.png"  
                   style={{height:30,width:30,borderRadius:20,float:"left",marginLeft:20,marginRight:15}}/>
                <h5 style={{fontWeight:600,marginBottom:5}}>Robin Singh</h5>
                <h6 style={{marginTop:5}}>Founder at Customero</h6>
    
              <hr style={{marginLeft:20,marginRight:20,color:"black",backgroundColor:"rgba(255,255,255,0.1)",opacity:"0.3",marginTop:10,marginBottom:10}}/>
              </div>
      )
    }
})

var CompanyEventCard = React.createClass({
  render: function() {
    return (
      <div style={{backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)"}}>
      <div className="panel panel-default" style={{boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}>
        <div className="panel-body">
          Example Event
              <img src="images/user.png"  
                   style={{height:30,width:30,borderRadius:20,float:"left",marginRight:15}}/>
        </div>
      </div>
        card
        <br/>
      </div>

    )
  }
})

var ContactDetail = React.createClass({
  render: function() {
    return (
      <div style={{color:"white"}}>
        <br/>
        <img src="images/user.png"  
             style={{height:100,width:100,borderRadius:5,marginRight:15,border:"2px solid white",float:"left"}}/>
          <h3>Robin Singh</h3>
          <h5>Founder, Customero</h5>
        <hr style={{marginTop:50}}/>
        <div className="col-md-4" style={{borderRight:"1px solid white"}}>
          <i className="fa fa-twitter" /> &nbsp; Twitter
          <hr/>
          <i className="fa fa-facebook" /> &nbsp; Facebook
          <hr/>
          <i className="fa fa-linkedin" /> &nbsp; Linkedin
          <hr/>
          <i className="fa fa-square-o" /> &nbsp; Glassdoor
        </div>
        <div className="col-md-4" style={{borderRight:"1px solid white"}}>
          <i className="fa fa-newspaper-o" /> &nbsp; News Mentions
          <hr/>
          <i className="fa fa-rss" /> &nbsp; Blog Posts
          <hr/>
          <i className="fa fa-bullhorn" /> &nbsp; Press Releases
          <hr/>
          <i className="fa fa-suitcase" /> &nbsp; Jobs
          <hr/>
          <i className="fa fa-wrench" /> &nbsp; Technology
        </div>
        <div className="col-md-4" >
          <div style={{textAlign:"center"}}>
          <h5 style={{fontWeight:"bold"}}> 
            <i className="fa fa-clock-o" /> &nbsp;
            TIMELINE </h5>
          </div>
          <hr/>

        </div>
      </div>
    )
  }
})

var CompanyDetail = React.createClass({
  render: function() {
    return (
      <div>
        Company Detail
      </div>
    )
  }
})

var Contacts = React.createClass({
  render: function() {
    return (
      <div>
        <div className="row">
          <div className="">
            <div style={{width:250,height:"100%",backgroundColor:"rgba(255,255,255,0.3)",position:"absolute",left:0, boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 1px 2px 1px",fontWeight:800,color:"white"}}>
              <br/>
              <div style={{textAlign:"center"}}> CONTACTS </div>
              <hr style={{marginLeft:20,marginRight:20}}/>
              <ContactCard />
              <ContactCard />
              <ContactCard />

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
      <Route path="/detail/:email" handler={ContactDetail} />
      <Route path="/detail/:domain" handler={CompanyDetail} />
    </Route>
  </Route>
);

module.exports = routes;
