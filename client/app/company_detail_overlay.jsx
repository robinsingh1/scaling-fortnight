var CompanyDetailOverlay = React.createClass({
  toggleCompanyDetailOverlay: function() {
    console.log("toggle")
    this.props.toggleCompanyDetailOverlay()
  },

  componentWillReceiveProps: function(a, b) {
    console.log(a)
    console.log(b)
  },

  componentDidMount: function() {
    var _this = this;
    $.ajax({
      url:location.origin+"/events/",
      dataType:"json",
      success: function(res) {
        console.log(res)
        _this.setState({contacts: res})
      },
      error: function(err) {
        console.log(err)
      }
    })
  },

  render: function() {
    console.log(this.props)
    company = (this.props.company.trigger) ? this.props.company.trigger : {}
    employees = (this.props.company.employees) ? this.props.company.employees : []
    employees = _.map(employees, function(emp) {
        return <div style={{paddingLeft:5}}>
          <UserPic/>
          <h5 style={{marginBottom:0}}><span style={{fontWeight:"bold"}}>{emp.name}</span> - <small>{emp.title}</small></h5>
          <h6 style={{marginTop:4}}>{emp.locale}</h6>
          <a href="javascript:" className="btn btn-success btn-xs" 
              style={{float:"right",marginTop:-35,marginRight:30}}>
            <i className="fa fa-plus"/>
          </a>
        </div>
    })
    return (
      <div>
        <div style={{height:"100%",width:"100%",position:"absolute",top:0,left:0,backgroundColor:"rgba(255,255,255,0.7)",zIndex:1}} 
            onClick={this.toggleCompanyDetailOverlay}>
        <a href="javascript:" className="btn btn-lg">
          <i className="fa fa-times" />
        </a>
      </div>
      <div style={{width:"60%",float:"right",borderLeft:"1px solid #ccc",zIndex:2,position:"absolute",top:0,right:0,height:"100%",backgroundColor:"white"}}>
        <h1>{company.company_name}</h1>
        <hr/>
        <div style={{height:"83%",overflow:"auto"}}>
          {employees}
        </div>
      </div>
    </div>
    )
  }
})

var UserPic = React.createClass({
  render: function() {
    return (
      <div style={{height:35,width:35,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,float:"left",marginRight:10}}> </div>
    )

  }
})


module.exports = CompanyDetailOverlay
