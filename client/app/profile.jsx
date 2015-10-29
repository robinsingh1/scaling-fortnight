
var Profile = React.createClass({
  render: function() {
    return (
      <div style={{color:"white"}}>
        <h2>
          &nbsp;
          <i className="fa fa-user" style={{marginRight:10}}/> 
          Account</h2>
        <hr/>
        <br/>
        <div className="row" 
        style={{paddingLeft:40,paddingRight:40}}>
          <div className="col-md-6">
            <div className="panel panel-default" style={{backgroundColor:"rgba(0,0,0,0)"}}>
              <div className="panel-body">
                <h3>Current Plan</h3>
                <hr/>
                <h4>1. Payment Information</h4>
                <input className="form-control input-lg" placeholder="Credit Card Number" style={{marginBottom:10}}/>
                <input className="form-control input-lg" placeholder="MM" style={{marginBottom:5,width:"20%",display:"inline-block",marginRight:15}}/>
                <h4 style={{display:"inline"}}>&nbsp;/&nbsp;&nbsp;&nbsp;&nbsp;</h4>
                <input className="form-control input-lg" placeholder="YY" style={{marginBottom:5,width:"20%",display:"inline-block"}}/>
                <input className="form-control input-lg" placeholder="CVC" style={{marginBottom:5,width:"20%",display:"inline-block",float:"right"}}/>
                <hr/>
                <h4>2.  Select Your Plan</h4>
        <div className="radio">
        <form role="form">
          <div className="radio">
              <br/>
              <input type="radio" name="radio2" id="radio3" value="option1" 
                  style={{paddingTop:15}}/>
              <label for="radio3"> 
              </label>
              <div style={{marginTop:-40,marginLeft:20}}>
                <h4 style={{fontWeight:800,marginBottom:0}}>Free Trial</h4>
                <h5 style={{fontWeight:600,color:"#aaa",marginTop:4}}>Free Trial</h5>
              </div>
              <h4 style={{float:"right",marginTop:-40,marginRight:40}}>$0</h4>
          </div>
          <div className="radio">
              <br/>
              <input type="radio" name="radio2" id="radio3" value="option1" 
                  style={{paddingTop:15}}/>
              <label for="radio3"> 
              </label>
              <div style={{marginTop:-40,marginLeft:20}}>
                <h4 style={{fontWeight:800,marginBottom:0}}>Starter</h4>
                <h5 style={{fontWeight:600,color:"#aaa",marginTop:4}}>Free Trial</h5>
              </div>
              <h4 style={{float:"right",marginTop:-40,marginRight:40}}>$99</h4>
          </div>
          <div className="radio">
              <br/>
              <input type="radio" name="radio2" id="radio3" value="option1" 
                  style={{paddingTop:15}}/>
              <label for="radio3"> 
              </label>
              <div style={{marginTop:-40,marginLeft:20}}>
                <h4 style={{fontWeight:800,marginBottom:0}}>Professional</h4>
                <h5 style={{fontWeight:600,color:"#aaa",marginTop:4}}>Free Trial</h5>
              </div>
              <h4 style={{float:"right",marginTop:-40,marginRight:40}}>$499</h4>
          </div>
          <div className="radio">
              <br/>
              <input type="radio" name="radio2" id="radio3" value="option1" 
                  style={{paddingTop:15}}/>
              <label for="radio3"> 
              </label>
              <div style={{marginTop:-40,marginLeft:20}}>
                <h4 style={{fontWeight:800,marginBottom:0}}>Enterprise</h4>
                <h5 style={{fontWeight:600,color:"#aaa",marginTop:4}}>Free Trial</h5>
              </div>
              <h4 style={{float:"right",marginTop:-40,marginRight:40}}>$999</h4>
          </div>
        </form>

                <hr/>
          <h4>3. Select Billing Cycle</h4>
              <br/>
              <form role="form">
                <div className="radio" style={{display:"inline"}}>
                    <input type="radio" name="radio2" id="radio3" value="option1" />
                    <label for="radio3"><h5 style={{marginTop:0}}>Monthly </h5></label>
                </div>
                &nbsp;
                &nbsp;
                <div className="radio" style={{display:"inline"}}>
                    <input type="radio" name="radio2" id="radio4" value="option2" />
                    <label for="radio4"><h5 style={{marginTop:0}}>Yearly &nbsp;<span style={{fontWeight:"bold",color:"#15cd72"}}>-20 %</span></h5></label>
                </div>
              </form>
  
              <br/>
              <br/>
          <a href="javascript:" style={{display:"block",textAlign:"center",fontSize:16}}
              className="btn btn-lg btn-primary">
              Complete and Upgrade
          </a>

        </div>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-default" style={{backgroundColor:"rgba(0,0,0,0)"}}>
              <div className="panel-body">
                <h3>Billing Information</h3>
                <hr/>
                <input className="form-control input-lg" placeholder="First Name" style={{marginBottom:10,width:"48.5%",display:"inline-block",marginRight:15}}/>
                <input className="form-control input-lg" placeholder="Last Name" style={{marginBottom:10,width:"48.5%",display:"inline-block"}}/>
                <input className="form-control input-lg" placeholder="Company" style={{marginBottom:10}}/>
                <input className="form-control input-lg" placeholder="Address" style={{marginBottom:5}}/>
                <input className="form-control input-lg" placeholder="Postal Code" style={{marginBottom:10,width:"48%",display:"inline-block",marginRight:15}}/>
                <input className="form-control input-lg" placeholder="City" style={{marginBottom:10,width:"48%",display:"inline-block"}}/>
          <br/>
          <a href="javascript:" style={{display:"block",textAlign:"center",fontSize:16}}
              className="btn btn-lg btn-primary">
              Update Billing Information
          </a>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-default" style={{backgroundColor:"rgba(0,0,0,0)"}}>
              <div className="panel-body">
                <h3>Invoices</h3>
                <hr/>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="panel panel-default" style={{backgroundColor:"rgba(0,0,0,0)"}}>
              <div className="panel-body">
                <h3>My Account</h3>
                <hr/>
                <input className="form-control input-lg" placeholder="Email" style={{marginBottom:10}}/>
                <input className="form-control input-lg" placeholder="New Password" type="password" style={{marginBottom:10}}/>
                <input className="form-control input-lg" placeholder="Confirm Password" type="password" style={{marginBottom:10}}/>
                <a href="javascript:" className="btn btn-primary" style={{display:"block",fontSize:16}}>Update Account</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

module.exports = Profile
