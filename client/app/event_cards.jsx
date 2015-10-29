var OverlayTrigger = ReactBootstrap.OverlayTrigger
var Popover = ReactBootstrap.Popover
var Button = ReactBootstrap.Button

var UserPic = React.createClass({
  render: function() {
    img = (this.props.img) ? this.props.img : "images/user.png"
    return (
      <div className={this.props._class} style={{height:35,width:35,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('"+img+"')",backgroundSize:"cover",borderRadius:25,display:"inline-block",marginLeft:-13,cursor:"pointer"}}> </div>
    )

  }
})

var CompanyDetailPopup = React.createClass({
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

  render: function() {
    c = this.props.company

    bgImage = "https://unsplash.it/400/200?blur&random="+Math.random().toString(36).substring(7);
      img = (c.logo) ? c.logo : "images/empty_company.png"
    contacts = _.map(this.props.contacts, function(contact, i) {
      //console.log(contact.avatar)
      avatar = (contact.avatar) ? contact.avatar : "images/user.png"
      return ( <div style={{display:"inline-block",width:30,fontFamily:"proxima-nova",textAlign:"center"}}>
        <div style={{height:25,width:25,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('"+avatar+"')",backgroundSize:"cover",borderRadius:25,display:"inline-block",cursor:"pointer"}}> </div>
        <div style={{display:"block",textAlign:"center",display:"none"}}>
          {contact.name.givenName}
        </div></div>
      )
    })
    event_icons = ["fa fa-rss", "fa fa-newspaper-o","fa fa-bullhorn", 
                   "fa fa-twitter", "fa fa-linkedin","fa-facebook","fa fa-suitcase"]
    return (
      <div className="panel panel-default" style={{width:400,height:"auto"}}>
        <div className="panel-body" style={{textAlign:"center"}}>
              <div src={bgImage} className="lur-1" style={{position:"absolute",top:0,left:0,zIndex:0,width:"100%",backgroundImage:'url("'+bgImage+'")',height:70, borderTopLeftRadius:3,borderTopRightRadius:3,backgroundColor:"#eee",borderBottom:"1px solid #ccc"}}/>
              <div style={{marginTop:20,height:55,width:55,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('"+img+"')",backgroundSize:"cover",borderRadius:45,display:"inline-block",marginLeft:-13,cursor:"pointer",position:"relative",zIndex:1,boxShadow:"rgba(0, 0, 0, 0.0980392) 0px 1px 2px 1px"}} />

              <h4>{c.name}</h4>
              <h5>{c.category.industry}</h5>

              {contacts} <br/>
              <a href="javascript:" className="btn btn-primary"
                  style={{backgroundColor:"#ccc !important",borderColor:"#ccc !important"}}>Unsubscribe</a>
              <hr/>
              <span className="label label-default"
                style={{backgroundColor:"#ccc",float:"left"}}>COMPANY</span>
              <div style={{float:"right"}}>
              {_.map(_.values(data), function(v, i) { 
                  if(v.length) {
                     return (<span style={{marginRight:15,color:"#aaa",
                                cursor:"pointer"}}>
                      <i className={event_icons[i]} />&nbsp;{v.length}
                      </span> 
                      )
                  }
               })}
              </div>
          
        </div>
      </div>
    )
  }
})

var ContactDetailPopup = React.createClass({
  render: function() {
    c = this.props.contact

    bgImage = "https://unsplash.it/400/200?blur&random="+Math.random().toString(36).substring(7);
    img = (c.avatar) ? c.avatar : "images/user.png"
    return (
      <div className="panel panel-default" style={{width:400,height:"auto"}}>
        <div className="panel-body" style={{textAlign:"center"}}>
              <div src={bgImage} className="lur-1" style={{position:"absolute",top:0,left:0,zIndex:0,width:"100%",backgroundImage:'url("'+bgImage+'")',height:70, borderTopLeftRadius:3,borderTopRightRadius:3,backgroundColor:"#eee",borderBottom:"1px solid #ccc"}}/>
              <div style={{marginTop:20,height:55,width:55,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('"+img+"')",backgroundSize:"cover",borderRadius:45,display:"inline-block",marginLeft:-13,cursor:"pointer",position:"relative",zIndex:1,boxShadow:"rgba(0, 0, 0, 0.0980392) 0px 1px 2px 1px"}}/>

              <h4>{c.name.fullName}</h4>
              <h5>{c.employment.title}</h5>

              <a href="javascript:" className="btn btn-primary">Email</a> &nbsp;
              <a href="javascript:" className="btn btn-primary">Unsubscribe</a>

              <hr/>
              <h5>20 </h5>
          
        </div>
      </div>
    )
  }
})


var CompanyBlogEventContent = React.createClass({
  render: function() {
    return (
      <div>
          <h5 style={{fontWeight:"bold"}}>{this.props.event.link_text}</h5>
          <h5>{this.props.event.link_span}</h5>
      </div>
    )
  }
})

var CompanyNewsEventContent = React.createClass({
  render: function() {
    return (
      <div>
        <h4>{this.props.event.title}</h4>
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

var CompanyEventCard = React.createClass({
  getInitialState: function() {
    return {
      contacts: [],
      ci: {},
      blogEvent: [],
      newsEvent: [],
      pressEvent: [],
      tweetEvent: [],
      linkedinEvent: [],
      facebookEvent: [],
      hiringEvent: [],
      events: { }
    }
  },

  componentDidUpdate: function() {
    company = this.state.ci
    
    var _this = this;
    if(!_.isEqual(this.state.ci, {})) {
      if(document.querySelector('.company-card-'+ci.domain.replace(".",""))) {
        console.log("company popup")
        var drop;
        drop = new Drop({
          target: document.querySelector('.company-card-'+ci.domain.replace(".","")),
          content: React.renderToStaticMarkup(<CompanyDetailPopup company={company} contacts={_this.state.contacts} events={_this.state.events}/>),
          position: 'top left',
          openOn: 'hover'
        });
      }
    }

    _.map(this.state.contacts, function(contact, i) {
        if(document.querySelector('.tether-test-'+contact.id)) {
          var drop;
          drop = new Drop({
            target: document.querySelector('.tether-test-'+contact.id),
            content: React.renderToStaticMarkup(<ContactDetailPopup contact={contact}/>),
            position: 'top left',
            openOn: 'hover'
          });
        }
    })
  },

  componentDidMount: function() {
    var _this = this;
    $.ajax({
      url:location.origin+"/contacts/"+this.props.event.domain,
      dataType:"json",
      success: function(res) {
        //console.log("COMPANYEVENTCARD")
        //console.log(res)
        _this.setState({contacts: res})
      },
      error: function(err) {
        console.log(err)
      }
    })

    $.ajax({
      url:location.origin+"/company/"+this.props.event.domain,
      dataType:"json",
      success: function(res) {
        //console.log(res)
        _this.setState({ci: res})
      },
      error: function(err) {
        console.log(err)
      }
    })

    var _this = this;
    $.ajax({
      url:location.origin+"/events/"+this.props.event.domain,
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
        data = {
          blogEvent: _.where(res, {event_type: "CompanyBlogEvent"}),
          newsEvent: _.where(res, {event_type: "CompanyNewsEvent"}),
          pressEvent: _.where(res, {event_type: "CompanyPressEvent"}),
          tweetEvent: _.where(res, {event_type: "TweetEvent"}),
          linkedinEvent: _.where(res, {event_type: "LinkedinEvent"}),
          facebookEvent: _.where(res, {event_type: "FacebookEvent"}),
          hiringEvent: _.where(res, {event_type: "HiringEvent"}) 
        }
        _this.setState({events: data})
        console.log(_.map(_.values(data), function(v) { return v.length }))
        console.log(_.keys(data))
      },

      error: function(err) {
        console.log(err)
      },
    })
  },

  render: function() {
    //console.log("CONTACTS")
    //console.log(this.state.contacts)
    if(this.state.contacts.length) {
      contacts = _.map(this.state.contacts, function(contact, i) {
        //console.log(contact.avatar)
        avatar = (contact.avatar) ? contact.avatar : "images/user.png"
        return <UserPic _class={"tether-test tether-test-"+contact.id} img={contact.avatar}/>
      })
      names = _.map(this.state.contacts, function(contact, i) {
        return <h5  style={{fontWeight:400,display:"inline",cursor:"pointer"}}>{contact.name.givenName+", "}</h5>
      })
      names = ""
    } else {
      contacts = ""
      names = ""
    }
    
    //console.log(this.state.ci)
    ci = this.state.ci
    ci_domain = (ci.domain) ? ci.domain : ""
    
    return (
      <div style={{backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:30}} id="mark_organ_3">
      <div className="panel panel-default" style={{boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:"auto",backgroundColor:"rgba(255,255,255,1.0)",border:"none",borderBottomRightRadius:0,borderBottomLeftRadius:0}} id="mark_organ_2">
        <div className="panel-body" id="mark_organ">
           <a href="javascript:" className={"thumbnail company-card-"+ci_domain.replace(".","")}
              style={{height:55,width:55,marginRight:15,float:"left",marginBottom:0}}>
              <img src={(ci.logo) ? ci.logo : "images/empty_company.png"} alt=""/>
            </a>

            <h4 style={{height:15,marginBottom:0}}>
              <a href="javascript:" className={"company-card-"+ci_domain.replace(".","")}>
                {ci.name}
              </a>
            </h4>
            <h4 style={{height:15,marginTop:3}}><small>{(ci.category) ? ci.category.industry : ""} - {moment.unix(this.props.event.timestamp).fromNow()}</small></h4>
            <i className={this.props.logo} style={{color:"#aaa",float:"right",marginTop:-40,fontSize:25}}/>

            <hr style={{marginRight:0}}/>
            {this.props.content}
            <br/>
            <span style={{marginLeft:10}}>{contacts}</span>
            {names}
        </div>
      </div>

        <a href="javascript:" className="response-icon"><i className="fa fa-comment" /></a>
        <a href="javascript:" className="response-icon"><i className="fa fa-envelope" /></a>
        <a href="javascript:" className="response-icon"><i className="fa fa-star" /></a>
        <a href="javascript:" className="response-icon"><i className="fa fa-external-link" /></a>
        <br/>
      </div>
    )
  }
})

var CompanyNewsEventCard = React.createClass({
  render: function() {
    return (
      <div style={{backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}>
      <div className="panel panel-default" style={{boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}>
        <div className="panel-body">
          Facebook Event Card
              <img src="images/user.png"  
                   style={{height:30,width:30,borderRadius:20,float:"left",marginRight:15}}/>
        </div>
      </div>
        card
        <br/>
      </div>
    )
  }
})
var CompanyPressEventCard = React.createClass({
  render: function() {
    return (
      <div style={{backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}>
      <div className="panel panel-default" style={{boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}>
        <div className="panel-body">
          Facebook Event Card
              <img src="images/user.png"  
                   style={{height:30,width:30,borderRadius:20,float:"left",marginRight:15}}/>
        </div>
      </div>
        card
        <br/>
      </div>
    )
  }
})


var CompanyHiringEventCard = React.createClass({
  render: function() {
    return (
      <div style={{backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}>
      <div className="panel panel-default" style={{boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}>
        <div className="panel-body">
          Facebook Event Card
              <img src="images/user.png"  
                   style={{height:30,width:30,borderRadius:20,float:"left",marginRight:15}}/>
        </div>
      </div>
        card
        <br/>
      </div>
    )
  }
})

var Test = React.createClass({
  render: function() {
    return (
      <div>
        Test
      </div>
    )
  }
})

var FacebookEventCard = React.createClass({
  componentDidMount: function() {
    var drop;
    drop = new Drop({
      target: document.querySelector('#tether-test'),
      content: React.renderToStaticMarkup(<ContactDetailPopup />),
      position: 'top left',
      openOn: 'hover'
    });
  },
  render: function() {
    return (
      <div style={{backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}>
      <div className="panel panel-default" style={{boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}>
        <div className="panel-body" id="mark_organ_4">
            <a href="javascript:" id="tether-test">Mark Organ</a>


              <img src="images/user.png"  
                   style={{height:30,width:30,borderRadius:20,float:"left",marginRight:15}}/>
        </div>
      </div>
        card
        <br/>
      </div>
    )
  }
})

var TwitterEventCard = React.createClass({
  render: function() {
    return (
      <div style={{backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}>
      <div className="panel panel-default" style={{boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}>
        <div className="panel-body">
          Twitter Event Card
              <img src="images/user.png"  
                   style={{height:30,width:30,borderRadius:20,float:"left",marginRight:15}}/>
        </div>
      </div>
        card
        <br/>
      </div>
    )
  }
})

var LinkedinEventCard = React.createClass({
  render: function() {
    return (
      <div style={{backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}>
      <div className="panel panel-default" style={{boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}>
        <div className="panel-body">
          Facebook Event Card
              <img src="images/user.png"  
                   style={{height:30,width:30,borderRadius:20,float:"left",marginRight:15}}/>
        </div>
      </div>
        card
        <br/>
      </div>
    )
  }
})

module.exports = {
  CompanyEventCard: CompanyEventCard,
  /*
  CompanyBlogEventCard: CompanyBlogEventCard,
  CompanyNewsEventCard: CompanyNewsEventCard,
  CompanyPressEventCard: CompanyPressEventCard,
  CompanyHiringEventCard: CompanyHiringEventCard,
  TwitterEventCard: TwitterEventCard,
  FacebookEventCard: FacebookEventCard,
  LinkedinEventCard: LinkedinEventCard,
  */

  CompanyBlogEventContent: CompanyBlogEventContent,
  CompanyNewsEventContent: CompanyNewsEventContent,
  CompanyPressEventContent: CompanyPressEventContent,
  CompanyHiringEventContent: CompanyHiringEventContent,
  TwitterEventContent: TwitterEventContent,
  FacebookEventContent: FacebookEventContent,
  LinkedinEventContent: LinkedinEventContent
}
