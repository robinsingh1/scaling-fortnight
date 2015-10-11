var ProfileSidebar = React.createClass({

  toggleCreateTriggerModal: function() {
    console.log(this.props)
    this.props.toggleCreateTriggerModal()
  },

  render: function() {
    //console.log(this.props)
    return (
          <div className="col-md-2">
            <span style={{fontWeight:"800"}}>TRIGGERS 
              <span style={{color:"#bbb",marginLeft:10,fontWeight:200}}>(18) </span>
            </span>

            <a href="javascript:" 
               className="btn btn-success btn-xs" 
               onClick={this.toggleCreateTriggerModal}
               style={{float:"right"}}>
              <i className="fa fa-plus"/></a>
          </div>
      
    )
  }
})

var HiringProfileCard = React.createClass({
  render: function() {
    return (
      <div style={{cursor:"pointer"}}>
        <h5> <i className="fa fa-suitcase" />&nbsp;
          Hiring Trigger Name</h5>
        <h5><small>Company Info blah blah</small></h5>
        <hr/>
      </div>
    )
  }
})

var PressProfileCard = React.createClass({
  render: function() {
    return (
      <div style={{cursor:"pointer"}}>
        <h5> <i className="fa fa-bullhorn" />&nbsp;
          Press Trigger Name</h5>
        <h5><small>Company Info blah blah</small></h5>
      <hr/>
      </div>
    )
  }
})

var TwitterProfileCard = React.createClass({
  render: function() {
    return (
      <div style={{cursor:"pointer"}}>
        <div>
          <h5><i className="fa fa-twitter" /> &nbsp;
            Twitter Trigger Name</h5>
          <h5><small>
              <span style={{fontWeight:"bold"}}>Keywords: </span>
                blah blah</small></h5>
        </div>
      </div>
    )
  }
})

module.exports = ProfileSidebar
