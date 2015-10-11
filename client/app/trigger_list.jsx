var CompanyCard = require("company_card")

var TriggerList = React.createClass({
  render: function() {
    return (

          <div className="col-md-10" style={{paddingLeft:30}}>
            <div style={{display:"block",marginLeft:"auto",marginRight:100,textAlign:"center",marginTop:8}}>
              <span style={{fontWeight:"800"}}>TODAY </span>
              <span style={{color:"#bbb"}}>August 28th</span>
            </div>
            <a href="javascript:" className="btn btn-success" style={{float:"right",marginTop:-90,display:"none"}}>Create Trigger</a>
            <a href="javascript:" className="btn btn-default btn-xs" style={{float:"right",marginTop:-25}}>List View</a>
            <br/>
            <CompanyCard />
            <CompanyCard />
            <CompanyCard />
          </div>

    )
  }
})

module.exports = TriggerList
