var CompanyDetail = React.createClass({
  getInitialState: function() {
    return {
      blogEvent: [],
      newsEvent: [],
      pressEvent: [],
      tweetEvent: [],
      linkedinEvent: [],
      facebookEvent: [],
      hiringEvent: [],
    }
  },

  componentDidMount: function() {
    $.ajax({
      url:location.origin+"/company/"+this.props.params.domain,
      dataType:"json",
      success: function(res) {
        console.log(res)
      },
      error: function(err) {
        console.log(err)
      },
    })

    var _this = this;
    $.ajax({
      url:location.origin+"/events/"+this.props.params.domain,
      dataType:"json",
      success: function(res) {
        console.log(res)
        _this.setState({blogEvent: _.where(res, {event_type: "CompanyBlogEvent"})})
        _this.setState({newsEvent: _.where(res, {event_type: "CompanyNewsEvent"})})
        _this.setState({pressEvent: _.where(res, {event_type: "CompanyPressEvent"})})
        _this.setState({tweetEvent: _.where(res, {event_type: "TweetEvent"})})
        _this.setState({linkedinEvent: _.where(res, {event_type: "LinkedinEvent"})})
        _this.setState({facebookEvent: _.where(res, {event_type: "FacebookEvent"})})
        _this.setState({hiringEvent: _.where(res, {event_type: "HiringEvent"})})
      },
      error: function(err) {
        console.log(err)
      },
    })
  },

  render: function() {
    console.log(this.state)
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
          <i className="fa fa-newspaper-o" /> &nbsp; News Mentions ({this.state.newsEvent.length})
          <div style={{height:200,overflow:"auto",marginTop:10}}>
          {_.map(this.state.newsEvent, function(event) {
              return <CompanyNewsEventContent event={event}/>
           })
          }
          </div>
          <hr/>
          <i className="fa fa-rss" /> &nbsp; Blog Posts ({this.state.blogEvent.length})
          <div style={{height:200,overflow:"auto",marginTop:10}}>
          {_.map(this.state.blogEvent, function(event) {
              return <CompanyBlogEventContent event={event}/>
           })
          }
          </div>
          <hr/>
          <i className="fa fa-bullhorn" /> &nbsp; Press Releases
          <hr/>
          <i className="fa fa-suitcase" /> &nbsp; Jobs ({this.state.hiringEvent.length})
          <div style={{height:200,overflow:"auto",marginTop:10}}>
          {_.map(this.state.hiringEvent, function(event) {
              return <CompanyHiringEventContent event={event}/>
           })
          }
          </div>
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

module.exports = CompanyDetail

var CompanyBlogEventContent = React.createClass({
  render: function() {
    return (
      <div>
          <h5 style={{fontWeight:"bold"}}>{this.props.event.link_text}</h5>
          <h6>{this.props.event.link_span}</h6>
      </div>
    )
  }
})

var CompanyNewsEventContent = React.createClass({
  render: function() {
    return (
      <div>
        <h5 style={{fontWeight:"bold"}}>{this.props.event.title}</h5>
        <h6>{this.props.event.source}</h6>
      </div>
    )
  }
})

var CompanyPressEventContent = React.createClass({
  render: function() {
    return (
      <div>
          <h5 style={{fontWeight:"bold"}}>{this.props.event.title}</h5>
          <h5>{this.props.event.description}</h5>
      </div>
    )
  }
})

var CompanyHiringEventContent = React.createClass({
  render: function() {
    return (
      <div>
          <h5 style={{fontWeight:"bold"}}>{this.props.event.job_title}</h5>
          <h5>{this.props.event.summary}</h5>
      </div>
    )
  }
})

var FacebookEventContent = React.createClass({
  render: function() {
    return (
      <div>
          <h5 style={{fontWeight:"bold"}}>{this.props.event.link_title}</h5>
          <h5>{this.props.event.link_summary}</h5>
      </div>
    )
  }
})

var TwitterEventContent = React.createClass({
  render: function() {
    return (
      <div>
          <h4>{this.props.event.text}</h4>
      </div>
    )
  }
})

var LinkedinEventContent = React.createClass({
  render: function() {
    return (
      <div>
          <h4>{this.props.event.post}</h4>
      </div>
    )
  }
})
