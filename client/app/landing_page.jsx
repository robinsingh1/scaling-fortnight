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

        <a href="#login" className="btn btn-primary" style={{float:"right",marginTop:-40}}>LOG IN</a>
        <div className="row" style={{marginTop:40}}>
        <div className="col-md-6" >
          <h1>Keep up to date with your business contacts</h1>
          <br/>
          <hr/>
          <h4 style={{marginTop:10}}>STOP HOURS RESEARCHING COMPANIES</h4>
          <h4 style={{marginTop:20,fontStyle:"italic"}}>START REACHING OUT TO PROSPECTS WITH RELEVANT INFORMATION</h4>
          <input className="form-control input-lg" style={{marginTop:30,width:300,borderRadius:2,fontSize:16}} placeholder="EMAIL"/>
          <input className="form-control input-lg" style={{marginTop:10,width:300,borderRadius:2,fontSize:16}} placeholder="PASSWORD" type="password"/>
          <a className="btn btn-lg btn-success" style={{marginTop:10,width:150,fontSize:16}}>SIGN UP</a>
        </div>

        <div className="col-md-6" >
          <img src="images/timeline.png" style={{height:170,marginTop:100,marginLeft:100}}/>
        </div>
        </div>
      </div>
    )
  }
})


module.exports = LandingPage
