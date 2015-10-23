var LandingPage = React.createClass({
  home: function() {
    location.href="/#landing"
  },

  render: function() {
    return (
      <div style={{paddingTop:50}}>

        <h4 style={{fontWeight:800,fontSize:22,cursor:"pointer"}}
          onClick={this.home}>ClearSpark</h4>

        <a href="#pricing" className="" style={{float:"right",marginTop:-32,marginRight:300,fontWeight:600,fontSize:12,color:"#0072f0"}}>PRICING</a>


        <a href="#signup" className="btn btn-success" style={{float:"right",marginTop:-40,marginRight:80}}>SIGN UP</a>
        <a href="#login" className="btn btn-primary" style={{float:"right",marginTop:-40}}>LOG IN</a>
        <div className="row" style={{marginTop:40}}>
          <div className="col-md-4 col-sm-4 col-xs-4" >
            <div className="pricing-col">
            <br/>
            Starter
            <hr/>
            <br/>
            <h1>$99 <small>/ month</small></h1>
            <br/>
            <hr/>
              Unlimited Prospect Profiles
            <hr/>
              Unlimited Company Profiles
            <hr/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>
            </div>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4" >
            <div className="pricing-col">
            <br/>
            Professional
            <hr/>
            <br/>
            <h1>$499 <small>/ month</small></h1>
            <br/>
            <hr/>
              Unlimited Prospect Profiles
            <hr/>
              Unlimited Company Profiles
            <hr/>
              CRM Integration
            <hr/>
              Employee Search
            <br/>
            <br/>
            </div>
          </div>
          <div className="col-md-4 col-sm-4 col-xs-4" >
            <div className="pricing-col">
            <br/>
            Enterprise
            <hr/>
            <br/>
            <h1>$999 <small>/ month</small></h1>
            <br/>
            <hr/>
              Unlimited Prospect + Company Profiles
            <hr/>
              CRM Integration
            <hr/>
              Employee Search
            <hr/>
              Employee Contact Information
            <br/>
            <br/>
          </div>
          </div>
        </div>
      </div>
    )
  }
})


module.exports = LandingPage
