var Sidebar = React.createClass({
  render: function() {
    return (
          <div className="col-xs-5 col-sm-3 col-md-3" style={{borderRight:"1px solid #eee",boxShadow: "rgba(0, 0, 0, 0.1980392) 0px -6px 10px 1px",position:"relative",marginRight:20,zIndex:100}}>
              <br/>
              <div style={{fontWeight:800, fontSize:24,color:"#FFBB01",marginLeft:20}}> 
                <div style={{backgroundColor:"#FFBB01", display:"inline",width:20,height:20,borderRadius:20,display:"none"}}>
                <i className="fa fa-bolt" style={{color:"white",fontSize:12}}/>
                </div>
                ClearSpark</div>

              <hr/>
            <ul style={{paddingLeft:0}}>
              <li>
                <h4>INBOX
                <a href="javascript:" className="btn btn-success btn-xs" style={{float:"right"}}> <i className="fa fa-plus"/></a>
</h4></li> <hr/>
              <li><h4>CALENDAR
                <a href="javascript:" className="btn btn-success btn-xs" style={{float:"right"}}> <i className="fa fa-plus"/></a>
</h4></li> <hr/>
              <li><h4>CRM
                <a href="javascript:" className="btn btn-success btn-xs" style={{float:"right"}}> <i className="fa fa-plus"/></a>
</h4></li> <hr/>
              <li>CONTACTS &nbsp;
                <a href="javascript:" className="btn btn-success btn-xs" style={{float:"right"}}> <i className="fa fa-plus"/></a>
              </li>
              <hr/>

              <li>LISTS &nbsp; </li>
              <br/>
            
                <h5><i className="fa fa-list" style={{fontSize:10}}/>&nbsp; List One</h5>
                <h5><i className="fa fa-list" style={{fontSize:10}}/>&nbsp; List One</h5>
              <li><a href="javascript:" className="btn btn-success btn-xs"><i className="fa fa-plus"/> &nbsp; ADD LIST</a></li>
              <hr/>

              <div style={{display:"none"}}>
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
              </div>
            </ul>
          </div>
    )
  }
})

module.exports = Sidebar
