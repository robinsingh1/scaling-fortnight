var CompanyCard = React.createClass({
  toggleCompanyDetailOverlay: function() {
    console.log("toggle")
    this.props.toggleCompanyDetailOverlay(this.props)
  },

  render: function() {
    console.log(this.props)
    return (
      <div className="" 
            onClick={this.toggleCompanyDetailOverlay}>
              <table>
                <tbody>
                  <tr>
                    <td>
                     <a href="javascript:" className="thumbnail" 
                        style={{height:55,width:55,marginRight:15,float:"left",marginBottom:0}}>
                        <img src={this.props.trigger.company_info.logo} alt="..."/>
                      </a>
                    </td>
                    <td style={{padding:5,width:"35%"}}>
                      <a href="javascript:" style={{color:"black"}}>
                      <h5 style={{fontSize:18}}>
                        {this.props.trigger.company_name}</h5>
                      </a>
                      <div className="ellipsis" style={{width:300,fontSize:10}}>
                        {this.props.trigger.company_info.description}
                      </div>
                    </td>

                    <HiringSignalInfo />
                    <EmployeeInfo employees={this.props.employees}/>


                    <td style={{padding:5}}>
                      <a href="javascript:" className="btn btn-primary btn-sm"><i className="fa fa-download"/></a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
    )
  }
})

var DetailLabel = React.createClass({
  render: function() {
    return (
      <label style={{border:"3px solid #eee",fontWeight:800,float:"left",color:"#ddd",marginRight:5, borderRadius:5,paddingLeft:5,paddingRight:5,display:"block",fontSize:11}}> {this.props.text} </label>
    )
  } 
})

var HiringSignalInfo = React.createClass({
  render: function() {
    return (
      <td style={{padding:5,width:"35%"}}>
        <h5></h5>
        <h5><small>Tweeted out this workd blah blah</small></h5>
        <DetailLabel text={"INDEED"} />
        <DetailLabel text={"HIRING SIGNAL"} />
      </td>
    )
  }
})

var UserPic = React.createClass({
  render: function() {
    return (
      <div style={{height:30,width:30,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,display:"inline-block",marginLeft:-13}}> </div>
    )

  }
})

var EmployeeInfo = React.createClass({
  render: function() {
    length = (this.props.employees.length > 3) ? 3 : this.props.employees.length
    users = []
    for(i=0;i< length; i++)
      users.push(<UserPic />)

    return (
        <td style={{padding:5,width:"35%"}}>
          <h5></h5>
          {(this.props.employees.length) ? <div>{users}
          <div style={{color: "#aaa",marginTop: -30, marginLeft: 65,fontSize:13}}>
            {this.props.employees.length + " employees"}
          </div>
          </div> : "" }
        </td>
    )
  }
})
/*
                      <div style={{height:25,width:25,border:"2px solid white",boxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,display:"inline-block",marginLeft:-10}}> </div>
                      */
                    

module.exports = CompanyCard
