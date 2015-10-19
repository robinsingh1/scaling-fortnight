var TabbedArea = ReactBootstrap.TabbedArea
var TabPane = ReactBootstrap.TabPane
var SplitButton = ReactBootstrap.SplitButton
var MenuItem= ReactBootstrap.SplitButton
var Modal= ReactBootstrap.Modal
var Button = ReactBootstrap.Button
var Thumbnail= ReactBootstrap.Thumbnail
var Alert = ReactBootstrap.Alert

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
            <div style={{}} style={{color:"#FFBB01",marginLeft:-20}}> 
              <i className="fa fa-bolt" />
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
      <div className="app" >
        <div className="home-page">
        </div>
        <div className="">
          <div className="col-xs-5 col-sm-3 col-md-3" style={{borderRight:"1px solid #eee"}}>
              <br/>
              <div style={{fontWeight:800, fontSize:24,color:"#FFBB01",marginLeft:20}}> 
                <div style={{backgroundColor:"#FFBB01", display:"inline",width:20,height:20,borderRadius:20}}>
                <i className="fa fa-bolt" style={{color:"white",fontSize:12}}/>
                </div>
                ClearSpark</div>

              <hr/>
              <br/>
            <ul style={{}}>
              <li><h4>INBOX</h4></li>
              <hr/>
              <li>LOOKUP</li>
              <hr/>
              <li>BILLING</li>
              <hr/>
              <li>ACCOUNT</li>
              <hr/>
              <li>API KEYS</li>
              <hr/>
              <li>LOGS</li>
              <hr/>
              <br/>
              <li>Get Started</li>
              <li>Api Docs</li>
              <li>Support</li>
              <li>Logout</li>
            </ul>
          </div>
          <div className="col-xs-7 col-sm-9 col-md-9 main-bg">
            <RouteHandler/>
          </div>
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

var Contacts = React.createClass({
  render: function() {
    return (
      <div>
        <div className="row">
          <div className="">
            <div style={{width:250,height:"100%",backgroundColor:"rgba(255,255,255,0.3)",position:"absolute",left:0, boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 1px 2px 1px"}}>
              lol
            </div>
          </div>
          <div className="" style={{marginLeft:350,marginRight:100}}>
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
            <br/>
            <div className="panel panel-default" style={{boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 1px 2px 1px",height:150}}>
              <div className="panel-body">
                lol
              </div>
            </div>
          </div>
          
        </div>

      </div>
    )
  }
})

// declare our routes and their hierarchy
var routes = (
  <Route handler={App}>
    <Route path="" handler={Main}/>
    <Route path="lookup" handler={Lookup}/>
    <Route path="contacts" handler={Contacts}/>
  </Route>
);

module.exports = routes;
