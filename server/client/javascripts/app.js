(function() {
  'use strict';

  var globals = typeof window === 'undefined' ? global : window;
  if (typeof globals.require === 'function') return;

  var modules = {};
  var cache = {};
  var has = ({}).hasOwnProperty;

  var aliases = {};

  var endsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  };

  var unalias = function(alias, loaderPath) {
    var start = 0;
    if (loaderPath) {
      if (loaderPath.indexOf('components/' === 0)) {
        start = 'components/'.length;
      }
      if (loaderPath.indexOf('/', start) > 0) {
        loaderPath = loaderPath.substring(start, loaderPath.indexOf('/', start));
      }
    }
    var result = aliases[alias + '/index.js'] || aliases[loaderPath + '/deps/' + alias + '/index.js'];
    if (result) {
      return 'components/' + result.substring(0, result.length - '.js'.length);
    }
    return alias;
  };

  var expand = (function() {
    var reg = /^\.\.?(\/|$)/;
    return function(root, name) {
      var results = [], parts, part;
      parts = (reg.test(name) ? root + '/' + name : name).split('/');
      for (var i = 0, length = parts.length; i < length; i++) {
        part = parts[i];
        if (part === '..') {
          results.pop();
        } else if (part !== '.' && part !== '') {
          results.push(part);
        }
      }
      return results.join('/');
    };
  })();
  var dirname = function(path) {
    return path.split('/').slice(0, -1).join('/');
  };

  var localRequire = function(path) {
    return function(name) {
      var absolute = expand(dirname(path), name);
      return globals.require(absolute, path);
    };
  };

  var initModule = function(name, definition) {
    var module = {id: name, exports: {}};
    cache[name] = module;
    definition(module.exports, localRequire(name), module);
    return module.exports;
  };

  var require = function(name, loaderPath) {
    var path = expand(name, '.');
    if (loaderPath == null) loaderPath = '/';
    path = unalias(name, loaderPath);

    if (has.call(cache, path)) return cache[path].exports;
    if (has.call(modules, path)) return initModule(path, modules[path]);

    var dirIndex = expand(path, './index');
    if (has.call(cache, dirIndex)) return cache[dirIndex].exports;
    if (has.call(modules, dirIndex)) return initModule(dirIndex, modules[dirIndex]);

    throw new Error('Cannot find module "' + name + '" from '+ '"' + loaderPath + '"');
  };

  require.alias = function(from, to) {
    aliases[to] = from;
  };

  require.register = require.define = function(bundle, fn) {
    if (typeof bundle === 'object') {
      for (var key in bundle) {
        if (has.call(bundle, key)) {
          modules[key] = bundle[key];
        }
      }
    } else {
      modules[bundle] = fn;
    }
  };

  require.list = function() {
    var result = [];
    for (var item in modules) {
      if (has.call(modules, item)) {
        result.push(item);
      }
    }
    return result;
  };

  require.brunch = true;
  globals.require = require;
})();
require.register("checkbox_group", function(exports, require, module) {

var CheckboxGroup = React.createClass({displayName: 'CheckboxGroup',
  render: function() {
    return (
      React.createElement("div", null, 
        "The Checkbox Group", 
        React.createElement("div", {className: "checkbox"}, 
          React.createElement("input", {type: "checkbox", id: "checkbox1"}), React.createElement("label", {htmlFor: "checkbox1"}, " Check me out "), 
          React.createElement("input", {type: "checkbox", id: "checkbox2"}), React.createElement("label", {htmlFor: "checkbox2"}, " Check me out "), 
          React.createElement("input", {type: "checkbox", id: "checkbox3"}), React.createElement("label", {htmlFor: "checkbox3"}, " Check me out "), 
          React.createElement("input", {type: "checkbox", id: "checkbox4"}), React.createElement("label", {htmlFor: "checkbox4"}, " Check me out ")
        )
      )
    )
  }
})

module.exports = CheckboxGroup

});

;require.register("company_card", function(exports, require, module) {
var CompanyCard = React.createClass({displayName: 'CompanyCard',
  toggleCompanyDetailOverlay: function() {
    console.log("toggle")
    this.props.toggleCompanyDetailOverlay(this.props)
  },

  render: function() {
    console.log(this.props)
    return (
      React.createElement("div", {className: "", 
            onClick: this.toggleCompanyDetailOverlay}, 
              React.createElement("table", null, 
                React.createElement("tbody", null, 
                  React.createElement("tr", null, 
                    React.createElement("td", null, 
                     React.createElement("a", {href: "javascript:", className: "thumbnail", 
                        style: {height:55,width:55,marginRight:15,float:"left",marginBottom:0}}, 
                        React.createElement("img", {src: this.props.trigger.company_info.logo, alt: "..."})
                      )
                    ), 
                    React.createElement("td", {style: {padding:5,width:"35%"}}, 
                      React.createElement("a", {href: "javascript:", style: {color:"black"}}, 
                      React.createElement("h5", {style: {fontSize:18}}, 
                        this.props.trigger.company_name)
                      ), 
                      React.createElement("div", {className: "ellipsis", style: {width:300,fontSize:10}}, 
                        this.props.trigger.company_info.description
                      )
                    ), 

                    React.createElement(HiringSignalInfo, null), 
                    React.createElement(EmployeeInfo, {employees: this.props.employees}), 


                    React.createElement("td", {style: {padding:5}}, 
                      React.createElement("a", {href: "javascript:", className: "btn btn-primary btn-sm"}, React.createElement("i", {className: "fa fa-download"}))
                    )
                  )
                )
              )
            )
    )
  }
})

var DetailLabel = React.createClass({displayName: 'DetailLabel',
  render: function() {
    return (
      React.createElement("label", {style: {border:"3px solid #eee",fontWeight:800,float:"left",color:"#ddd",marginRight:5, borderRadius:5,paddingLeft:5,paddingRight:5,display:"block",fontSize:11}}, " ", this.props.text, " ")
    )
  } 
})

var HiringSignalInfo = React.createClass({displayName: 'HiringSignalInfo',
  render: function() {
    return (
      React.createElement("td", {style: {padding:5,width:"35%"}}, 
        React.createElement("h5", null), 
        React.createElement("h5", null, React.createElement("small", null, "Tweeted out this workd blah blah")), 
        React.createElement(DetailLabel, {text: "INDEED"}), 
        React.createElement(DetailLabel, {text: "HIRING SIGNAL"})
      )
    )
  }
})

var UserPic = React.createClass({displayName: 'UserPic',
  render: function() {
    return (
      React.createElement("div", {style: {height:30,width:30,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,display:"inline-block",marginLeft:-13}}, " ")
    )

  }
})

var EmployeeInfo = React.createClass({displayName: 'EmployeeInfo',
  render: function() {
    length = (this.props.employees.length > 3) ? 3 : this.props.employees.length
    users = []
    for(i=0;i< length; i++)
      users.push(React.createElement(UserPic, null))

    return (
        React.createElement("td", {style: {padding:5,width:"35%"}}, 
          React.createElement("h5", null), 
          (this.props.employees.length) ? React.createElement("div", null, users, 
          React.createElement("div", {style: {color: "#aaa",marginTop: -30, marginLeft: 65,fontSize:13}}, 
            this.props.employees.length + " employees"
          )
          ) : ""
        )
    )
  }
})
/*
                      <div style={{height:25,width:25,border:"2px solid white",boxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,display:"inline-block",marginLeft:-10}}> </div>
                      */
                    

module.exports = CompanyCard

});

;require.register("company_detail", function(exports, require, module) {
var CompanyDetail = React.createClass({displayName: 'CompanyDetail',
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
      React.createElement("div", {style: {color:"white"}}, 
        React.createElement("br", null), 
        React.createElement("img", {src: "images/user.png", 
             style: {height:100,width:100,borderRadius:5,marginRight:15,border:"2px solid white",float:"left"}}), 
          React.createElement("h3", null, "Robin Singh"), 
          React.createElement("h5", null, "Founder, Customero"), 
        React.createElement("hr", {style: {marginTop:50}}), 
        React.createElement("div", {className: "col-md-4", style: {borderRight:"1px solid white"}}, 
          React.createElement("i", {className: "fa fa-twitter"}), "   Twitter", 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-facebook"}), "   Facebook", 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-linkedin"}), "   Linkedin", 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-square-o"}), "   Glassdoor"
        ), 
        React.createElement("div", {className: "col-md-4", style: {borderRight:"1px solid white"}}, 
          React.createElement("i", {className: "fa fa-newspaper-o"}), "   News Mentions (", this.state.newsEvent.length, ")", 
          React.createElement("div", {style: {height:200,overflow:"auto",marginTop:10}}, 
          _.map(this.state.newsEvent, function(event) {
              return React.createElement(CompanyNewsEventContent, {event: event})
           })
          
          ), 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-rss"}), "   Blog Posts (", this.state.blogEvent.length, ")", 
          React.createElement("div", {style: {height:200,overflow:"auto",marginTop:10}}, 
          _.map(this.state.blogEvent, function(event) {
              return React.createElement(CompanyBlogEventContent, {event: event})
           })
          
          ), 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-bullhorn"}), "   Press Releases", 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-suitcase"}), "   Jobs (", this.state.hiringEvent.length, ")", 
          React.createElement("div", {style: {height:200,overflow:"auto",marginTop:10}}, 
          _.map(this.state.hiringEvent, function(event) {
              return React.createElement(CompanyHiringEventContent, {event: event})
           })
          
          ), 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-wrench"}), "   Technology"
        ), 
        React.createElement("div", {className: "col-md-4"}, 
          React.createElement("div", {style: {textAlign:"center"}}, 
          React.createElement("h5", {style: {fontWeight:"bold"}}, 
            React.createElement("i", {className: "fa fa-clock-o"}), "  " + ' ' +
            "TIMELINE ")
          ), 
          React.createElement("hr", null)

        )
      )
    )
  }
})

module.exports = CompanyDetail

var CompanyBlogEventContent = React.createClass({displayName: 'CompanyBlogEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h5", {style: {fontWeight:"bold"}}, this.props.event.link_text), 
          React.createElement("h6", null, this.props.event.link_span)
      )
    )
  }
})

var CompanyNewsEventContent = React.createClass({displayName: 'CompanyNewsEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("h5", {style: {fontWeight:"bold"}}, this.props.event.title), 
        React.createElement("h6", null, this.props.event.source)
      )
    )
  }
})

var CompanyPressEventContent = React.createClass({displayName: 'CompanyPressEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h5", {style: {fontWeight:"bold"}}, this.props.event.title), 
          React.createElement("h5", null, this.props.event.description)
      )
    )
  }
})

var CompanyHiringEventContent = React.createClass({displayName: 'CompanyHiringEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h5", {style: {fontWeight:"bold"}}, this.props.event.job_title), 
          React.createElement("h5", null, this.props.event.summary)
      )
    )
  }
})

var FacebookEventContent = React.createClass({displayName: 'FacebookEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h5", {style: {fontWeight:"bold"}}, this.props.event.link_title), 
          React.createElement("h5", null, this.props.event.link_summary)
      )
    )
  }
})

var TwitterEventContent = React.createClass({displayName: 'TwitterEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h4", null, this.props.event.text)
      )
    )
  }
})

var LinkedinEventContent = React.createClass({displayName: 'LinkedinEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h4", null, this.props.event.post)
      )
    )
  }
})

});

;require.register("company_detail_overlay", function(exports, require, module) {
var CompanyDetailOverlay = React.createClass({displayName: 'CompanyDetailOverlay',
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
        return React.createElement("div", {style: {paddingLeft:5}}, 
          React.createElement(UserPic, null), 
          React.createElement("h5", {style: {marginBottom:0}}, React.createElement("span", {style: {fontWeight:"bold"}}, emp.name), " - ", React.createElement("small", null, emp.title)), 
          React.createElement("h6", {style: {marginTop:4}}, emp.locale), 
          React.createElement("a", {href: "javascript:", className: "btn btn-success btn-xs", 
              style: {float:"right",marginTop:-35,marginRight:30}}, 
            React.createElement("i", {className: "fa fa-plus"})
          )
        )
    })
    return (
      React.createElement("div", null, 
        React.createElement("div", {style: {height:"100%",width:"100%",position:"absolute",top:0,left:0,backgroundColor:"rgba(255,255,255,0.7)",zIndex:1}, 
            onClick: this.toggleCompanyDetailOverlay}, 
        React.createElement("a", {href: "javascript:", className: "btn btn-lg"}, 
          React.createElement("i", {className: "fa fa-times"})
        )
      ), 
      React.createElement("div", {style: {width:"60%",float:"right",borderLeft:"1px solid #ccc",zIndex:2,position:"absolute",top:0,right:0,height:"100%",backgroundColor:"white"}}, 
        React.createElement("h1", null, company.company_name), 
        React.createElement("hr", null), 
        React.createElement("div", {style: {height:"83%",overflow:"auto"}}, 
          employees
        )
      )
    )
    )
  }
})

var UserPic = React.createClass({displayName: 'UserPic',
  render: function() {
    return (
      React.createElement("div", {style: {height:35,width:35,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,float:"left",marginRight:10}}, " ")
    )

  }
})


module.exports = CompanyDetailOverlay

});

;require.register("contact_detail", function(exports, require, module) {
var ContactDetail = React.createClass({displayName: 'ContactDetail',
  render: function() {
    return (
      React.createElement("div", {style: {color:"white"}}, 
        React.createElement("br", null), 
        React.createElement("img", {src: "images/user.png", 
             style: {height:100,width:100,borderRadius:5,marginRight:15,border:"2px solid white",float:"left"}}), 
          React.createElement("h3", null, "Robin Singh"), 
          React.createElement("h5", null, "Founder, Customero"), 
        React.createElement("hr", {style: {marginTop:50}}), 
        React.createElement("div", {className: "col-md-4", style: {borderRight:"1px solid white"}}, 
          React.createElement("i", {className: "fa fa-twitter"}), "   Twitter", 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-facebook"}), "   Facebook", 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-linkedin"}), "   Linkedin", 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-square-o"}), "   Glassdoor"
        ), 
        React.createElement("div", {className: "col-md-4", style: {borderRight:"1px solid white"}}, 
          React.createElement("i", {className: "fa fa-newspaper-o"}), "   News Mentions", 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-rss"}), "   Blog Posts", 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-bullhorn"}), "   Press Releases", 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-suitcase"}), "   Jobs", 
          React.createElement("hr", null), 
          React.createElement("i", {className: "fa fa-wrench"}), "   Technology"
        ), 
        React.createElement("div", {className: "col-md-4"}, 
          React.createElement("div", {style: {textAlign:"center"}}, 
          React.createElement("h5", {style: {fontWeight:"bold"}}, 
            React.createElement("i", {className: "fa fa-clock-o"}), "  " + ' ' +
            "TIMELINE ")
          ), 
          React.createElement("hr", null)

        )
      )
    )
  }
})

module.exports = ContactDetail

});

;require.register("create_trigger_modal", function(exports, require, module) {
var TabbedArea = ReactBootstrap.TabbedArea
var TabPane = ReactBootstrap.TabPane
var SplitButton = ReactBootstrap.SplitButton
var MenuItem= ReactBootstrap.SplitButton
var Modal= ReactBootstrap.Modal
var Button = ReactBootstrap.Button
var Thumbnail= ReactBootstrap.Thumbnail

var TwitterKeywords = require("search_bar")

var CreateTwitterTrigger = React.createClass({displayName: 'CreateTwitterTrigger',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("br", null), 
        "Keywords:", 
        React.createElement(TwitterKeywords, null), 
        "Hashtags:", 
        React.createElement(TwitterKeywords, null)
      )
    )
  }
})

var CreateHiringTrigger = React.createClass({displayName: 'CreateHiringTrigger',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("br", null), 
        "Title Keywords:", 
        React.createElement(TwitterKeywords, null), 
        "Job Keyword Can Contain:", 
        React.createElement(TwitterKeywords, null)
      )
    )
  }
})

var CreatePressTrigger = React.createClass({displayName: 'CreatePressTrigger',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("br", null), 
        "Title Keywords:", 
        React.createElement(TwitterKeywords, null), 
        "Job Keyword Can Contain:", 
        React.createElement(TwitterKeywords, null)
      )
    )
  }
})

var CreateIndustryTrigger = React.createClass({displayName: 'CreateIndustryTrigger',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("br", null), 
        "Title Keywords:", 
        React.createElement(TwitterKeywords, null), 
        "Job Keyword Can Contain:", 
        React.createElement(TwitterKeywords, null)
      )
    )
  }
})

var CreateTriggerModal = React.createClass({displayName: 'CreateTriggerModal',
  render: function() {
    return (
      React.createElement(Modal, {show: this.props.showModal, onHide: this.props.closeModal, bsSize: "medium", 'aria-labelledby': "contained-modal-title-lg"}, 
        React.createElement(Modal.Header, {closeButton: true}, 
          React.createElement(Modal.Title, {id: "contained-modal-title-lg"}, "Create Trigger")
        ), 
        React.createElement(Modal.Body, null, 
          React.createElement(TabbedArea, {defaultActiveKey: 1}, 
            React.createElement(TabPane, {eventKey: 1, tab: "Twitter"}, React.createElement(CreateTwitterTrigger, null)), 
            React.createElement(TabPane, {eventKey: 2, tab: "Hiring"}, React.createElement(CreateHiringTrigger, null)), 
            React.createElement(TabPane, {eventKey: 3, tab: "Press"}, React.createElement(CreatePressTrigger, null)), 
            React.createElement(TabPane, {eventKey: 4, tab: "Industry"}, React.createElement(CreateIndustryTrigger, null))
          )
        ), 
        React.createElement(Modal.Footer, null, 
          React.createElement(Button, {onClick: this.props.onHide}, "Create Trigger")
        )
      )
    )
  }
})

module.exports = CreateTriggerModal

});

;require.register("date_pair", function(exports, require, module) {


var DatePair = React.createClass({displayName: 'DatePair',
  componentDidMount: function() {
    $('.date').datepicker()

  },
  render: function() {
    input = {width:75, display:"inline-block",fontSize:10}
    return (
      React.createElement("div", null, 
        React.createElement("h6", {style: {fontWeight:"800"}}, "COLUMN NAME  ", 
            React.createElement("small", null, "datetime")), 
        React.createElement("p", {id: "basicExample"}, 
            React.createElement("input", {type: "text", className: "date start form-control input-sm", style: input}), 
            " ", 
            React.createElement("span", {style: {fontSize:8,fontWeight:600}}, "TO"), 
            " ", 
            React.createElement("input", {type: "text", className: "date end form-control input-sm", style: input})
        )

      )
    )
  }
})

module.exports = DatePair

});

;require.register("event_cards", function(exports, require, module) {
var OverlayTrigger = ReactBootstrap.OverlayTrigger
var Popover = ReactBootstrap.Popover
var Button = ReactBootstrap.Button

var UserPic = React.createClass({displayName: 'UserPic',
  render: function() {
    img = (this.props.img) ? this.props.img : "images/user.png"
    return (
      React.createElement("div", {className: this.props._class, style: {height:35,width:35,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('"+img+"')",backgroundSize:"cover",borderRadius:25,display:"inline-block",marginLeft:-13,cursor:"pointer"}}, " ")
    )

  }
})

var CompanyDetailPopup = React.createClass({displayName: 'CompanyDetailPopup',
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
      return ( React.createElement("div", {style: {display:"inline-block",width:30,fontFamily:"proxima-nova",textAlign:"center"}}, 
        React.createElement("div", {style: {height:25,width:25,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('"+avatar+"')",backgroundSize:"cover",borderRadius:25,display:"inline-block",cursor:"pointer"}}, " "), 
        React.createElement("div", {style: {display:"block",textAlign:"center",display:"none"}}, 
          contact.name.givenName
        ))
      )
    })
    event_icons = ["fa fa-rss", "fa fa-newspaper-o","fa fa-bullhorn", 
                   "fa fa-twitter", "fa fa-linkedin","fa-facebook","fa fa-suitcase"]
    return (
      React.createElement("div", {className: "panel panel-default", style: {width:400,height:"auto"}}, 
        React.createElement("div", {className: "panel-body", style: {textAlign:"center"}}, 
              React.createElement("div", {src: bgImage, className: "lur-1", style: {position:"absolute",top:0,left:0,zIndex:0,width:"100%",backgroundImage:'url("'+bgImage+'")',height:70, borderTopLeftRadius:3,borderTopRightRadius:3,backgroundColor:"#eee",borderBottom:"1px solid #ccc"}}), 
              React.createElement("div", {style: {marginTop:20,height:55,width:55,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('"+img+"')",backgroundSize:"cover",borderRadius:45,display:"inline-block",marginLeft:-13,cursor:"pointer",position:"relative",zIndex:1,boxShadow:"rgba(0, 0, 0, 0.0980392) 0px 1px 2px 1px"}}), 

              React.createElement("h4", null, c.name), 
              React.createElement("h5", null, c.category.industry), 

              contacts, " ", React.createElement("br", null), 
              React.createElement("a", {href: "javascript:", className: "btn btn-primary", 
                  style: {backgroundColor:"#ccc !important",borderColor:"#ccc !important"}}, "Unsubscribe"), 
              React.createElement("hr", null), 
              React.createElement("span", {className: "label label-default", 
                style: {backgroundColor:"#ccc",float:"left"}}, "COMPANY"), 
              React.createElement("div", {style: {float:"right"}}, 
              _.map(_.values(data), function(v, i) { 
                  if(v.length) {
                     return (React.createElement("span", {style: {marginRight:15,color:"#aaa",
                                cursor:"pointer"}}, 
                      React.createElement("i", {className: event_icons[i]}), " ", v.length
                      ) 
                      )
                  }
               })
              )
          
        )
      )
    )
  }
})

var ContactDetailPopup = React.createClass({displayName: 'ContactDetailPopup',
  render: function() {
    c = this.props.contact

    bgImage = "https://unsplash.it/400/200?blur&random="+Math.random().toString(36).substring(7);
    img = (c.avatar) ? c.avatar : "images/user.png"
    return (
      React.createElement("div", {className: "panel panel-default", style: {width:400,height:"auto"}}, 
        React.createElement("div", {className: "panel-body", style: {textAlign:"center"}}, 
              React.createElement("div", {src: bgImage, className: "lur-1", style: {position:"absolute",top:0,left:0,zIndex:0,width:"100%",backgroundImage:'url("'+bgImage+'")',height:70, borderTopLeftRadius:3,borderTopRightRadius:3,backgroundColor:"#eee",borderBottom:"1px solid #ccc"}}), 
              React.createElement("div", {style: {marginTop:20,height:55,width:55,border:"2px solid white",oldBoxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('"+img+"')",backgroundSize:"cover",borderRadius:45,display:"inline-block",marginLeft:-13,cursor:"pointer",position:"relative",zIndex:1,boxShadow:"rgba(0, 0, 0, 0.0980392) 0px 1px 2px 1px"}}), 

              React.createElement("h4", null, c.name.fullName), 
              React.createElement("h5", null, c.employment.title), 

              React.createElement("a", {href: "javascript:", className: "btn btn-primary"}, "Email"), "  ", 
              React.createElement("a", {href: "javascript:", className: "btn btn-primary"}, "Unsubscribe"), 

              React.createElement("hr", null), 
              React.createElement("h5", null, "20 ")
          
        )
      )
    )
  }
})


var CompanyBlogEventContent = React.createClass({displayName: 'CompanyBlogEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h5", {style: {fontWeight:"bold"}}, this.props.event.link_text), 
          React.createElement("h5", null, this.props.event.link_span)
      )
    )
  }
})

var CompanyNewsEventContent = React.createClass({displayName: 'CompanyNewsEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("h4", null, this.props.event.title), 
        React.createElement("h6", null, this.props.event.source)
      )
    )
  }
})

var CompanyPressEventContent = React.createClass({displayName: 'CompanyPressEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h5", {style: {fontWeight:"bold"}}, this.props.event.title), 
          React.createElement("h5", null, this.props.event.description)
      )
    )
  }
})

var CompanyHiringEventContent = React.createClass({displayName: 'CompanyHiringEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h5", {style: {fontWeight:"bold"}}, this.props.event.job_title), 
          React.createElement("h5", null, this.props.event.summary)
      )
    )
  }
})

var FacebookEventContent = React.createClass({displayName: 'FacebookEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h5", {style: {fontWeight:"bold"}}, this.props.event.link_title), 
          React.createElement("h5", null, this.props.event.link_summary)
      )
    )
  }
})

var TwitterEventContent = React.createClass({displayName: 'TwitterEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h4", null, this.props.event.text)
      )
    )
  }
})

var LinkedinEventContent = React.createClass({displayName: 'LinkedinEventContent',
  render: function() {
    return (
      React.createElement("div", null, 
          React.createElement("h4", null, this.props.event.post)
      )
    )
  }
})

var CompanyEventCard = React.createClass({displayName: 'CompanyEventCard',
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
          content: React.renderToStaticMarkup(React.createElement(CompanyDetailPopup, {company: company, contacts: _this.state.contacts, events: _this.state.events})),
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
            content: React.renderToStaticMarkup(React.createElement(ContactDetailPopup, {contact: contact})),
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
        return React.createElement(UserPic, {_class: "tether-test tether-test-"+contact.id, img: contact.avatar})
      })
      names = _.map(this.state.contacts, function(contact, i) {
        return React.createElement("h5", {style: {fontWeight:400,display:"inline",cursor:"pointer"}}, contact.name.givenName+", ")
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
      React.createElement("div", {style: {backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:30}, id: "mark_organ_3"}, 
      React.createElement("div", {className: "panel panel-default", style: {boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:"auto",backgroundColor:"rgba(255,255,255,1.0)",border:"none",borderBottomRightRadius:0,borderBottomLeftRadius:0}, id: "mark_organ_2"}, 
        React.createElement("div", {className: "panel-body", id: "mark_organ"}, 
           React.createElement("a", {href: "javascript:", className: "thumbnail company-card-"+ci_domain.replace(".",""), 
              style: {height:55,width:55,marginRight:15,float:"left",marginBottom:0}}, 
              React.createElement("img", {src: (ci.logo) ? ci.logo : "images/empty_company.png", alt: ""})
            ), 

            React.createElement("h4", {style: {height:15,marginBottom:0}}, 
              React.createElement("a", {href: "javascript:", className: "company-card-"+ci_domain.replace(".","")}, 
                ci.name
              )
            ), 
            React.createElement("h4", {style: {height:15,marginTop:3}}, React.createElement("small", null, (ci.category) ? ci.category.industry : "", " - ", moment.unix(this.props.event.timestamp).fromNow())), 
            React.createElement("i", {className: this.props.logo, style: {color:"#aaa",float:"right",marginTop:-40,fontSize:25}}), 

            React.createElement("hr", {style: {marginRight:0}}), 
            this.props.content, 
            React.createElement("br", null), 
            React.createElement("span", {style: {marginLeft:10}}, contacts), 
            names
        )
      ), 

        React.createElement("a", {href: "javascript:", className: "response-icon"}, React.createElement("i", {className: "fa fa-comment"})), 
        React.createElement("a", {href: "javascript:", className: "response-icon"}, React.createElement("i", {className: "fa fa-envelope"})), 
        React.createElement("a", {href: "javascript:", className: "response-icon"}, React.createElement("i", {className: "fa fa-star"})), 
        React.createElement("a", {href: "javascript:", className: "response-icon"}, React.createElement("i", {className: "fa fa-external-link"})), 
        React.createElement("br", null)
      )
    )
  }
})

var CompanyNewsEventCard = React.createClass({displayName: 'CompanyNewsEventCard',
  render: function() {
    return (
      React.createElement("div", {style: {backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}, 
      React.createElement("div", {className: "panel panel-default", style: {boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}, 
        React.createElement("div", {className: "panel-body"}, 
          "Facebook Event Card", 
              React.createElement("img", {src: "images/user.png", 
                   style: {height:30,width:30,borderRadius:20,float:"left",marginRight:15}})
        )
      ), 
        "card", 
        React.createElement("br", null)
      )
    )
  }
})
var CompanyPressEventCard = React.createClass({displayName: 'CompanyPressEventCard',
  render: function() {
    return (
      React.createElement("div", {style: {backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}, 
      React.createElement("div", {className: "panel panel-default", style: {boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}, 
        React.createElement("div", {className: "panel-body"}, 
          "Facebook Event Card", 
              React.createElement("img", {src: "images/user.png", 
                   style: {height:30,width:30,borderRadius:20,float:"left",marginRight:15}})
        )
      ), 
        "card", 
        React.createElement("br", null)
      )
    )
  }
})


var CompanyHiringEventCard = React.createClass({displayName: 'CompanyHiringEventCard',
  render: function() {
    return (
      React.createElement("div", {style: {backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}, 
      React.createElement("div", {className: "panel panel-default", style: {boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}, 
        React.createElement("div", {className: "panel-body"}, 
          "Facebook Event Card", 
              React.createElement("img", {src: "images/user.png", 
                   style: {height:30,width:30,borderRadius:20,float:"left",marginRight:15}})
        )
      ), 
        "card", 
        React.createElement("br", null)
      )
    )
  }
})

var Test = React.createClass({displayName: 'Test',
  render: function() {
    return (
      React.createElement("div", null, 
        "Test"
      )
    )
  }
})

var FacebookEventCard = React.createClass({displayName: 'FacebookEventCard',
  componentDidMount: function() {
    var drop;
    drop = new Drop({
      target: document.querySelector('#tether-test'),
      content: React.renderToStaticMarkup(React.createElement(ContactDetailPopup, null)),
      position: 'top left',
      openOn: 'hover'
    });
  },
  render: function() {
    return (
      React.createElement("div", {style: {backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}, 
      React.createElement("div", {className: "panel panel-default", style: {boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}, 
        React.createElement("div", {className: "panel-body", id: "mark_organ_4"}, 
            React.createElement("a", {href: "javascript:", id: "tether-test"}, "Mark Organ"), 


              React.createElement("img", {src: "images/user.png", 
                   style: {height:30,width:30,borderRadius:20,float:"left",marginRight:15}})
        )
      ), 
        "card", 
        React.createElement("br", null)
      )
    )
  }
})

var TwitterEventCard = React.createClass({displayName: 'TwitterEventCard',
  render: function() {
    return (
      React.createElement("div", {style: {backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}, 
      React.createElement("div", {className: "panel panel-default", style: {boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}, 
        React.createElement("div", {className: "panel-body"}, 
          "Twitter Event Card", 
              React.createElement("img", {src: "images/user.png", 
                   style: {height:30,width:30,borderRadius:20,float:"left",marginRight:15}})
        )
      ), 
        "card", 
        React.createElement("br", null)
      )
    )
  }
})

var LinkedinEventCard = React.createClass({displayName: 'LinkedinEventCard',
  render: function() {
    return (
      React.createElement("div", {style: {backgroundColor:"rgba(255,255,255,0.4)",borderRadius:4,border:"1px solid rgba(255,255,255,0.4)",marginBottom:20}}, 
      React.createElement("div", {className: "panel panel-default", style: {boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 5px 2px 1px",height:150,backgroundColor:"rgba(255,255,255,0.9)",border:"none"}}, 
        React.createElement("div", {className: "panel-body"}, 
          "Facebook Event Card", 
              React.createElement("img", {src: "images/user.png", 
                   style: {height:30,width:30,borderRadius:20,float:"left",marginRight:15}})
        )
      ), 
        "card", 
        React.createElement("br", null)
      )
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

});

;require.register("initialize", function(exports, require, module) {
//var UserDatasetTable = require("table");
var routes = require('routes');



document.addEventListener('DOMContentLoaded', function() {
  console.log("lol")
  ReactRouter.run(routes, ReactRouter.HashLocation, function(Root) {
    React.render(React.createElement(Root, null), document.body);
  });
}, false);

});

require.register("landing_page", function(exports, require, module) {
var LandingPage = React.createClass({displayName: 'LandingPage',
  home: function() {
    location.href="/#landing"
  },

  render: function() {
    return (
      React.createElement("div", {style: {paddingTop:50}}, 

        React.createElement("h4", {style: {fontWeight:800,fontSize:22,cursor:"pointer"}, 
          onClick: this.home}, "ClearSpark"), 

        React.createElement("a", {href: "#pricing", className: "", style: {float:"right",marginTop:-32,marginRight:300,fontWeight:600,fontSize:12,color:"#0072f0"}}, "PRICING"), 

        React.createElement("a", {href: "#login", className: "btn btn-primary", style: {float:"right",marginTop:-40}}, "LOG IN"), 
        React.createElement("div", {className: "row", style: {marginTop:40}}, 
        React.createElement("div", {className: "col-md-6"}, 
          React.createElement("h1", null, "Keep up to date with your business contacts"), 
          React.createElement("br", null), 
          React.createElement("hr", null), 
          React.createElement("h4", {style: {marginTop:10}}, "STOP HOURS RESEARCHING COMPANIES"), 
          React.createElement("h4", {style: {marginTop:20,fontStyle:"italic"}}, "START REACHING OUT TO PROSPECTS WITH RELEVANT INFORMATION"), 
          React.createElement("input", {className: "form-control input-lg", style: {marginTop:30,width:300,borderRadius:2,fontSize:16}, placeholder: "EMAIL"}), 
          React.createElement("input", {className: "form-control input-lg", style: {marginTop:10,width:300,borderRadius:2,fontSize:16}, placeholder: "PASSWORD", type: "password"}), 
          React.createElement("a", {className: "btn btn-lg btn-success", style: {marginTop:10,width:150,fontSize:16}}, "SIGN UP")
        ), 

        React.createElement("div", {className: "col-md-6"}, 
          React.createElement("img", {src: "images/timeline.png", style: {height:170,marginTop:100,marginLeft:100}})
        )
        )
      )
    )
  }
})


module.exports = LandingPage

});

;require.register("login", function(exports, require, module) {
var Login = React.createClass({displayName: 'Login',
  render: function() {
    return (
      React.createElement("div", {style: {textAlign:"center",paddingTop:120}}, 

          React.createElement("img", {src: "images/radar_2.png", style: {height:100}}), 
          React.createElement("br", null), 
        React.createElement("input", {className: "form-control input-lg", style: {fontSize:16, marginRight:"auto",marginLeft:"auto",marginTop:30,width:300,borderRadius:2}, placeholder: "EMAIL"}), 
        React.createElement("input", {className: "form-control input-lg", style: {fontSize:16, marginTop:10,marginLeft:"auto",marginRight:"auto",width:300,borderRadius:2}, placeholder: "PASSWORD", type: "password"}), 
        React.createElement("br", null), 
        React.createElement("a", {className: "btn btn-lg btn-primary", style: {marginTop:10,width:300, fontSize:16}}, "LOG IN")

      )
    )
  }
})

module.exports = Login

});

;require.register("old_routes", function(exports, require, module) {
var DataExplorer = require("table")
var CompanyCard = require("company_card")
var CompanyDetailOverlay = require("company_detail_overlay")
var UserDatasetTable = require("user_dataset_table")
var ProfileSidebar = require("profile_sidebar")
var TriggerList = require("trigger_list")
var CreateTriggerModal = require("create_trigger_modal")
var WebsocketListener = require("websocket_listener")

var TabbedArea = ReactBootstrap.TabbedArea
var TabPane = ReactBootstrap.TabPane
var SplitButton = ReactBootstrap.SplitButton
var MenuItem= ReactBootstrap.SplitButton
var Modal= ReactBootstrap.Modal
var Button = ReactBootstrap.Button
var Thumbnail= ReactBootstrap.Thumbnail
var Alert = ReactBootstrap.Alert

var Route = ReactRouter.Route;
var RouteHandler = ReactRouter.RouteHandler;

var About = React.createClass({displayName: 'About',
  render: function () {
    return React.createElement("h2", null, "About");
  }
});

var Inbox = React.createClass({displayName: 'Inbox',
  render: function () {
    return React.createElement("h2", null, "Inbox");
  }
});

var Navbar = React.createClass({displayName: 'Navbar',
  render: function() {
    return (
      React.createElement("header", {className: "header", style: {paddingTop:20,paddingBottom:40}}, 
        React.createElement("ul", {className: "text-muted"}, 
          React.createElement("li", {className: "app-logo"}, 
            React.createElement("div", null, 
            React.createElement("img", {src: "images/blaze-logo.png", style: {marginTop:4,height:18,marginLeft:-15,display:"none"}}), 
            React.createElement("div", {style: {}, style: {color:"#000",marginLeft:-20}}, " TriggerIQ")
            )
          ), 
          React.createElement("div", {style: {display:"none"}}, 
            React.createElement("li", {style: {fontWeight:"bold",color:"#0079ff",color:"#000"}}, "DATASETS"), 
            React.createElement("li", null, "USERS"), 
            React.createElement("li", null, "EXPLORE"), 
            React.createElement("li", null, "COMPUTE"), 
            React.createElement("li", {style: {float:"right",marginRight:50}}, "LOGOUT")
          )
        )
      )
    )
  }
})

var NewDatasetPanel = React.createClass({displayName: 'NewDatasetPanel',
  render: function() {
    return (
      React.createElement("div", {className: "col-md-offset-2 col-md-8"}, 

        React.createElement("div", {className: "panel panel-default", style: {marginTop:20}}, 
            React.createElement("div", {className: "panel-body", 
                 style: {paddingLeft:50,paddingRight:50}}, 
              React.createElement("h2", {style: {fontWeight:800}}, "Step 1: Add Dataset"), 
              React.createElement("span", {style: {fontWeight:400}, className: "text-muted"}, 
                "Add dataset url with format hdfs://"
              ), 
              React.createElement("br", null), 
              React.createElement("div", null, 
              React.createElement("hr", null), 
              React.createElement("label", {htmlFor: "inputEmail3", className: "col-sm-2 control-label", 
                style: {textAlign:"left",paddingTop:3,fontSize:18,fontWeight:800,paddingLeft:0,width:40}}, 
                "URL"), 
              React.createElement("br", null), 
              React.createElement("br", null), 
              React.createElement("div", {className: "col-sm-10", style: {paddingLeft:0}}, 
                React.createElement("input", {type: "email", className: "form-control", id: "inputEmail3", placeholder: "hdfs:// or postgres:// or mongo:// or s3:// or http://", style: {width: "124%"}})
              ), 
              React.createElement("br", null), 
              React.createElement("br", null), 
              React.createElement("hr", null), 
              React.createElement("label", {htmlFor: "inputEmail3", className: "col-sm-2 control-label", 
                style: {textAlign:"left",paddingTop:3,fontSize:18,fontWeight:800,paddingLeft:0,width:40}}, 
                "DESCRIPTION"), 
              React.createElement("br", null), 
              React.createElement("br", null), 
              React.createElement("div", {className: ""}, 
                React.createElement("input", {type: "email", className: "form-control", id: "inputEmail3", placeholder: "hdfs:// or postgres:// or mongo:// or s3:// or http://", style: {width: "100%"}})
              ), 
              React.createElement("br", null), 
              React.createElement("hr", null), 

                React.createElement("div", {className: "radio"}, 
                    React.createElement("input", {type: "radio", name: "radio2", id: "radio3", value: "option1"}), 
                    React.createElement("label", {htmlFor: "radio3"}, 
                      React.createElement("i", {className: "fa fa-database"}), "  " + ' ' +
                      "Public ")
                ), 
                React.createElement("div", {className: "radio"}, 
                    React.createElement("input", {type: "radio", name: "radio2", id: "radio4", value: "option2"}), 
                    React.createElement("label", {htmlFor: "radio4"}, 
                      React.createElement("i", {className: "fa fa-lock"}), "  " + ' ' +
                      "Private ")
                )
              ), 
              React.createElement("br", null), 
              React.createElement("a", {href: "#", className: "btn btn-lg btn-primary center-item", 
                style: {width:200}}, 
                "CONTINUE"), 
              React.createElement("br", null)
            )
        )
      )
    )
  }
})

// TODO: update to react 0.13.
var App = React.createClass({displayName: 'App',
  render: function() {
    return (
      React.createElement("div", {className: "app"}, 
        React.createElement("div", {className: "home-page"}, 
          React.createElement(Navbar, null)
        ), 
        React.createElement("div", {className: "container"}, 
        React.createElement(RouteHandler, null)
        )
      )
    )
  }
});

var DatasetDetail = React.createClass({displayName: 'DatasetDetail',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("br", null), 
        React.createElement("div", {className: "section-title"}, "Test Dataset"), 
        React.createElement("ul", {className: "dataset-detail"}, 
          React.createElement("li", null, "Type"), 
          React.createElement("li", null, "Name"), 
          React.createElement("li", null, "Shape"), 
          React.createElement("li", null, "URL"), 
          React.createElement("li", null, "Date Added")
        ), 
        React.createElement("div", {style: {float:"right",marginTop:-55,fontWeight:800}}, 
          
          React.createElement("div", {style: {display:"inline-block",width:130}}, 
          React.createElement("a", {href: "javascript:", className: "btn btn-xs btn-default action-btn", 
              style: {borderRight:0,borderRadius: "3px 0px 0px 3px !important"}}, 
            React.createElement("i", {className: "fa fa-star"}), " STAR"  
          ), 
            React.createElement("span", {className: "action-badge", 
                  style: {}}, " 3.2M ")
          ), 
          React.createElement("div", {style: {display:"inline-block",width:130}}, 
            React.createElement("a", {href: "javascript:", className: "btn btn-xs btn-default action-btn", 
                style: {borderRight:0,borderRadius: "3px 0px 0px 3px !important"}}, 
            React.createElement("i", {className: "fa fa-code-fork"}), "  ANALYZE"
          ), 
          React.createElement("span", {className: "action-badge", 
            style: {}}, 
            "3.2M" 
          )
          )
        ), 
        React.createElement("hr", null), 
        React.createElement("span", null, 
          "Zillow is in the process of diversifying our data sources and integrating dozens of new data feeds." + ' ' + 
          "Ultimately, this wider diversity of data sources will lead to published data that is both more comprehensive and timely. But as this new data is incorporated, the publication of select metrics may be delayed or temporarily suspended as we work to ensure this new data meets our strict quality standards and fits into our existing datasets and databases. We look forward to resuming our usual publication schedule for all of our established datasets soon, and we apologize for any inconvenience. Thank you for your patience and understanding.", 
        React.createElement("br", null), 
        React.createElement("br", null)



        ), 

        React.createElement(TabbedArea, {defaultActiveKey: 1}, 
          React.createElement(TabPane, {eventKey: 1, tab: "EXPLORE"}, React.createElement(DataExplorer, null)), 
          React.createElement(TabPane, {eventKey: 2, tab: "DISCUSSION"}, "TabPane 2 content"), 
          React.createElement(TabPane, {eventKey: 3, tab: "ANALYSIS"}, "TabPane 3 content"), 
          React.createElement(TabPane, {eventKey: 4, tab: "COLLABORATORS"}, "TabPane 3 content"), 
          React.createElement(TabPane, {eventKey: 5, tab: "VISUALIZATIONS"}, "TabPane 3 content")
        )
      )
    )
  }
})

var DatasetDiscussion = React.createClass({displayName: 'DatasetDiscussion',
  render: function() {
    return (
      React.createElement("div", null, 
        "Discussion"
      )
    )
  }
})

var DatasetAnalysis = React.createClass({displayName: 'DatasetAnalysis',
  render: function() {
    return (
      React.createElement("div", null, 
        "Analysis"
      )
    )
  }
})

var DatasetCollaborators = React.createClass({displayName: 'DatasetCollaborators',
  render: function() {
    return (
      React.createElement("div", null, 
        "Collaborators"
      )
    )
  }
})

var DatasetVisualizations = React.createClass({displayName: 'DatasetVisualizations',
  render: function() {
    return (
      React.createElement("div", null, 
        "Visualizations"
      )
    )
  }
})

var Main = React.createClass({displayName: 'Main',
  getInitialState: function() {
    return {
      showCreateTriggerModal: false,
      profiles:[],
      triggers:[],
      triggerEmployees: {},
      detailMode: true,
      currentCompany: {}
    }
  },

  toggleCreateTriggerModal: function() {
    console.log("toggle")
    this.setState({ showCreateTriggerModal: !this.state.showCreateTriggerModal });
  },

  toggleCompanyDetailOverlay: function(company) {
    this.setState({currentCompany: company })
    this.setState({detailMode: !this.state.detailMode})
  },

  componentWillMount: function() {
    var _this = this;
    $.ajax({
      url: location.origin+"/profiles",
      dataType:"json",
      success: function(res) {
        console.log(res)
        _this.setState({profiles: res})
      },
      error: function(err) {
        console.log(err)
      }
    })

    $.ajax({
      url: location.origin+"/triggers",
      dataType:"json",
      success: function(res) {
        console.log(res)
        _this.setState({triggers: res})

        _.map(_this.state.triggers, function(trig) {
          $.ajax({
            url: location.origin+"/company/"+trig.company_key+"/employees",
            triggerId: trig.company_key,
            dataType:"json",
            success: function(res) {
              triggerId = this.triggerId+"_employees"
              //console.log(triggerId)
              //console.log(res)
              //_this.setState({triggerId: res})
              localStorage[triggerId] = JSON.stringify(res)
            },
            error: function(err) {
              console.log(err)
            }
          })
        })
      },
      error: function(err) {
        console.log(err)
      }
    })
  },

  componentDidMount: function() {
  },

  render: function() {
    var _this = this;
    console.log(this.state)
    CompanyCards = _.map(this.state.triggers, function(trig) {
      employeeId = trig.company_key+"_employees"
      console.log(localStorage.employeeId)
      if(localStorage[employeeId])
        emps = (localStorage[employeeId] != "") ? JSON.parse(localStorage[employeeId]) : []
      else
        emps = []

        return React.createElement(CompanyCard, {trigger: trig, 
                      toggleCompanyDetailOverlay: _this.toggleCompanyDetailOverlay, 
                          employees: emps})
    })
    return (
      React.createElement("div", {className: "container"}, " ", React.createElement("br", null), 
        React.createElement("div", {className: "row"}, 
          React.createElement(ProfileSidebar, {
              profiles: this.state.profiles, 
              lol: "yoyo", 
              toggleCreateTrigerModal: this.toggleCreateTriggerModal}), 
          React.createElement("div", {className: "col-md-10", style: {paddingLeft:30}}, 
            React.createElement("div", {style: {display:"block",marginLeft:"auto",marginRight:100,
                         textAlign:"center",marginTop:8}}, 
              React.createElement("span", {style: {fontWeight:"800"}}, "TODAY "), 
              React.createElement("span", {style: {color:"#bbb"}}, moment().format("MMMM Do"))
            ), 

            React.createElement(WebsocketListener, null), 
            React.createElement("a", {href: "javascript:", className: "btn btn-success", style: {float:"right",marginTop:-90,display:"none"}}, "Create Trigger"), 
            React.createElement("br", null), 
            CompanyCards
          )
        ), 
        React.createElement(CreateTriggerModal, {
            showModal: this.state.showCreateTriggerModal, 
            closeModal: this.toggleCreateTriggerModal}), 
        (this.state.detailMode) ?
          React.createElement(CompanyDetailOverlay, {
              toggleCompanyDetailOverlay: this.toggleCompanyDetailOverlay, 
              company: this.state.currentCompany}) : ""
        
      )
    )
  }
})




// declare our routes and their hierarchy
var routes = (
  React.createElement(Route, {handler: App}, 
    React.createElement(Route, {path: "", handler: Main}), 
    React.createElement(Route, {path: "about", handler: About}), 
    React.createElement(Route, {path: "inbox", handler: Inbox}), 
    React.createElement(Route, {path: "new_dataset", handler: NewDatasetPanel}), 
    React.createElement(Route, {path: "datasets", handler: UserDatasetTable}), 
    React.createElement(Route, {path: "/dataset/:id", handler: DatasetDetail}), 
    React.createElement(Route, {path: "/dataset/:id/discussion", handler: DatasetDiscussion}), 
    React.createElement(Route, {path: "/dataset/:id/analysis", handler: DatasetAnalysis}), 
    React.createElement(Route, {path: "/dataset/:id/collaborators", handler: DatasetCollaborators}), 
    React.createElement(Route, {path: "/dataset/:id/visualizations", handler: DatasetVisualizations})
  )
);

module.exports = routes;

});

require.register("pricing", function(exports, require, module) {
var LandingPage = React.createClass({displayName: 'LandingPage',
  home: function() {
    location.href="/#landing"
  },

  render: function() {
    return (
      React.createElement("div", {style: {paddingTop:50}}, 

        React.createElement("h4", {style: {fontWeight:800,fontSize:22,cursor:"pointer"}, 
          onClick: this.home}, "ClearSpark"), 

        React.createElement("a", {href: "#pricing", className: "", style: {float:"right",marginTop:-32,marginRight:300,fontWeight:600,fontSize:12,color:"#0072f0"}}, "PRICING"), 


        React.createElement("a", {href: "#signup", className: "btn btn-success", style: {float:"right",marginTop:-40,marginRight:80}}, "SIGN UP"), 
        React.createElement("a", {href: "#login", className: "btn btn-primary", style: {float:"right",marginTop:-40}}, "LOG IN"), 
        React.createElement("div", {className: "row", style: {marginTop:40}}, 
          React.createElement("div", {className: "col-md-4 col-sm-4 col-xs-4"}, 
            React.createElement("div", {className: "pricing-col"}, 
            React.createElement("br", null), 
            "Starter", 
            React.createElement("hr", null), 
            React.createElement("br", null), 
            React.createElement("h1", null, "$99 ", React.createElement("small", null, "/ month")), 
            React.createElement("br", null), 
            React.createElement("hr", null), 
              "Unlimited Prospect Profiles", 
            React.createElement("hr", null), 
              "Unlimited Company Profiles", 
            React.createElement("hr", null), 
            React.createElement("br", null), 
            React.createElement("br", null), 
            React.createElement("br", null), 
            React.createElement("br", null), 
            React.createElement("br", null)
            )
          ), 
          React.createElement("div", {className: "col-md-4 col-sm-4 col-xs-4"}, 
            React.createElement("div", {className: "pricing-col"}, 
            React.createElement("br", null), 
            "Professional", 
            React.createElement("hr", null), 
            React.createElement("br", null), 
            React.createElement("h1", null, "$499 ", React.createElement("small", null, "/ month")), 
            React.createElement("br", null), 
            React.createElement("hr", null), 
              "Unlimited Prospect Profiles", 
            React.createElement("hr", null), 
              "Unlimited Company Profiles", 
            React.createElement("hr", null), 
              "CRM Integration", 
            React.createElement("hr", null), 
              "Employee Search", 
            React.createElement("br", null), 
            React.createElement("br", null)
            )
          ), 
          React.createElement("div", {className: "col-md-4 col-sm-4 col-xs-4"}, 
            React.createElement("div", {className: "pricing-col"}, 
            React.createElement("br", null), 
            "Enterprise", 
            React.createElement("hr", null), 
            React.createElement("br", null), 
            React.createElement("h1", null, "$999 ", React.createElement("small", null, "/ month")), 
            React.createElement("br", null), 
            React.createElement("hr", null), 
              "Unlimited Prospect + Company Profiles", 
            React.createElement("hr", null), 
              "CRM Integration", 
            React.createElement("hr", null), 
              "Employee Search", 
            React.createElement("hr", null), 
              "Employee Contact Information", 
            React.createElement("br", null), 
            React.createElement("br", null)
          )
          )
        )
      )
    )
  }
})


module.exports = LandingPage

});

;require.register("profile", function(exports, require, module) {

var Profile = React.createClass({displayName: 'Profile',
  render: function() {
    return (
      React.createElement("div", {style: {color:"white"}}, 
        React.createElement("h2", null, 
          " ", 
          React.createElement("i", {className: "fa fa-user", style: {marginRight:10}}), 
          "Account"), 
        React.createElement("hr", null), 
        React.createElement("br", null), 
        React.createElement("div", {className: "row", 
        style: {paddingLeft:40,paddingRight:40}}, 
          React.createElement("div", {className: "col-md-6"}, 
            React.createElement("div", {className: "panel panel-default", style: {backgroundColor:"rgba(0,0,0,0)"}}, 
              React.createElement("div", {className: "panel-body"}, 
                React.createElement("h3", null, "Current Plan"), 
                React.createElement("hr", null), 
                React.createElement("h4", null, "1. Payment Information"), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "Credit Card Number", style: {marginBottom:10}}), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "MM", style: {marginBottom:5,width:"20%",display:"inline-block",marginRight:15}}), 
                React.createElement("h4", {style: {display:"inline"}}, " /    "), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "YY", style: {marginBottom:5,width:"20%",display:"inline-block"}}), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "CVC", style: {marginBottom:5,width:"20%",display:"inline-block",float:"right"}}), 
                React.createElement("hr", null), 
                React.createElement("h4", null, "2.  Select Your Plan"), 
        React.createElement("div", {className: "radio"}, 
        React.createElement("form", {role: "form"}, 
          React.createElement("div", {className: "radio"}, 
              React.createElement("br", null), 
              React.createElement("input", {type: "radio", name: "radio2", id: "radio3", value: "option1", 
                  style: {paddingTop:15}}), 
              React.createElement("label", {for: "radio3"}
              ), 
              React.createElement("div", {style: {marginTop:-40,marginLeft:20}}, 
                React.createElement("h4", {style: {fontWeight:800,marginBottom:0}}, "Free Trial"), 
                React.createElement("h5", {style: {fontWeight:600,color:"#aaa",marginTop:4}}, "Free Trial")
              ), 
              React.createElement("h4", {style: {float:"right",marginTop:-40,marginRight:40}}, "$0")
          ), 
          React.createElement("div", {className: "radio"}, 
              React.createElement("br", null), 
              React.createElement("input", {type: "radio", name: "radio2", id: "radio3", value: "option1", 
                  style: {paddingTop:15}}), 
              React.createElement("label", {for: "radio3"}
              ), 
              React.createElement("div", {style: {marginTop:-40,marginLeft:20}}, 
                React.createElement("h4", {style: {fontWeight:800,marginBottom:0}}, "Starter"), 
                React.createElement("h5", {style: {fontWeight:600,color:"#aaa",marginTop:4}}, "Free Trial")
              ), 
              React.createElement("h4", {style: {float:"right",marginTop:-40,marginRight:40}}, "$99")
          ), 
          React.createElement("div", {className: "radio"}, 
              React.createElement("br", null), 
              React.createElement("input", {type: "radio", name: "radio2", id: "radio3", value: "option1", 
                  style: {paddingTop:15}}), 
              React.createElement("label", {for: "radio3"}
              ), 
              React.createElement("div", {style: {marginTop:-40,marginLeft:20}}, 
                React.createElement("h4", {style: {fontWeight:800,marginBottom:0}}, "Professional"), 
                React.createElement("h5", {style: {fontWeight:600,color:"#aaa",marginTop:4}}, "Free Trial")
              ), 
              React.createElement("h4", {style: {float:"right",marginTop:-40,marginRight:40}}, "$499")
          ), 
          React.createElement("div", {className: "radio"}, 
              React.createElement("br", null), 
              React.createElement("input", {type: "radio", name: "radio2", id: "radio3", value: "option1", 
                  style: {paddingTop:15}}), 
              React.createElement("label", {for: "radio3"}
              ), 
              React.createElement("div", {style: {marginTop:-40,marginLeft:20}}, 
                React.createElement("h4", {style: {fontWeight:800,marginBottom:0}}, "Enterprise"), 
                React.createElement("h5", {style: {fontWeight:600,color:"#aaa",marginTop:4}}, "Free Trial")
              ), 
              React.createElement("h4", {style: {float:"right",marginTop:-40,marginRight:40}}, "$999")
          )
        ), 

                React.createElement("hr", null), 
          React.createElement("h4", null, "3. Select Billing Cycle"), 
              React.createElement("br", null), 
              React.createElement("form", {role: "form"}, 
                React.createElement("div", {className: "radio", style: {display:"inline"}}, 
                    React.createElement("input", {type: "radio", name: "radio2", id: "radio3", value: "option1"}), 
                    React.createElement("label", {for: "radio3"}, React.createElement("h5", {style: {marginTop:0}}, "Monthly "))
                ), 
                " " + ' ' +
                " ", 
                React.createElement("div", {className: "radio", style: {display:"inline"}}, 
                    React.createElement("input", {type: "radio", name: "radio2", id: "radio4", value: "option2"}), 
                    React.createElement("label", {for: "radio4"}, React.createElement("h5", {style: {marginTop:0}}, "Yearly  ", React.createElement("span", {style: {fontWeight:"bold",color:"#15cd72"}}, "-20 %")))
                )
              ), 
  
              React.createElement("br", null), 
              React.createElement("br", null), 
          React.createElement("a", {href: "javascript:", style: {display:"block",textAlign:"center",fontSize:16}, 
              className: "btn btn-lg btn-primary"}, 
              "Complete and Upgrade"
          )

        )
              )
            )
          ), 
          React.createElement("div", {className: "col-md-6"}, 
            React.createElement("div", {className: "panel panel-default", style: {backgroundColor:"rgba(0,0,0,0)"}}, 
              React.createElement("div", {className: "panel-body"}, 
                React.createElement("h3", null, "Billing Information"), 
                React.createElement("hr", null), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "First Name", style: {marginBottom:10,width:"48.5%",display:"inline-block",marginRight:15}}), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "Last Name", style: {marginBottom:10,width:"48.5%",display:"inline-block"}}), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "Company", style: {marginBottom:10}}), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "Address", style: {marginBottom:5}}), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "Postal Code", style: {marginBottom:10,width:"48%",display:"inline-block",marginRight:15}}), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "City", style: {marginBottom:10,width:"48%",display:"inline-block"}}), 
          React.createElement("br", null), 
          React.createElement("a", {href: "javascript:", style: {display:"block",textAlign:"center",fontSize:16}, 
              className: "btn btn-lg btn-primary"}, 
              "Update Billing Information"
          )
              )
            )
          ), 
          React.createElement("div", {className: "col-md-6"}, 
            React.createElement("div", {className: "panel panel-default", style: {backgroundColor:"rgba(0,0,0,0)"}}, 
              React.createElement("div", {className: "panel-body"}, 
                React.createElement("h3", null, "Invoices"), 
                React.createElement("hr", null)
              )
            )
          ), 
          React.createElement("div", {className: "col-md-6"}, 
            React.createElement("div", {className: "panel panel-default", style: {backgroundColor:"rgba(0,0,0,0)"}}, 
              React.createElement("div", {className: "panel-body"}, 
                React.createElement("h3", null, "My Account"), 
                React.createElement("hr", null), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "Email", style: {marginBottom:10}}), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "New Password", type: "password", style: {marginBottom:10}}), 
                React.createElement("input", {className: "form-control input-lg", placeholder: "Confirm Password", type: "password", style: {marginBottom:10}}), 
                React.createElement("a", {href: "javascript:", className: "btn btn-primary", style: {display:"block",fontSize:16}}, "Update Account")
              )
            )
          )
        )
      )
    )
  }
})

module.exports = Profile

});

;require.register("profile_sidebar", function(exports, require, module) {
var ProfileSidebar = React.createClass({displayName: 'ProfileSidebar',

  toggleCreateTriggerModal: function() {
    console.log(this.props)
    this.props.toggleCreateTriggerModal()
  },

  render: function() {
    //console.log(this.props)
    return (
          React.createElement("div", {className: "col-md-2"}, 
            React.createElement("span", {style: {fontWeight:"800"}}, "TRIGGERS",  
              React.createElement("span", {style: {color:"#bbb",marginLeft:10,fontWeight:200}}, "(18) ")
            ), 

            React.createElement("a", {href: "javascript:", 
               className: "btn btn-success btn-xs", 
               onClick: this.toggleCreateTriggerModal, 
               style: {float:"right"}}, 
              React.createElement("i", {className: "fa fa-plus"}))
          )
      
    )
  }
})

var HiringProfileCard = React.createClass({displayName: 'HiringProfileCard',
  render: function() {
    return (
      React.createElement("div", {style: {cursor:"pointer"}}, 
        React.createElement("h5", null, " ", React.createElement("i", {className: "fa fa-suitcase"}), " " + ' ' +
          "Hiring Trigger Name"), 
        React.createElement("h5", null, React.createElement("small", null, "Company Info blah blah")), 
        React.createElement("hr", null)
      )
    )
  }
})

var PressProfileCard = React.createClass({displayName: 'PressProfileCard',
  render: function() {
    return (
      React.createElement("div", {style: {cursor:"pointer"}}, 
        React.createElement("h5", null, " ", React.createElement("i", {className: "fa fa-bullhorn"}), " " + ' ' +
          "Press Trigger Name"), 
        React.createElement("h5", null, React.createElement("small", null, "Company Info blah blah")), 
      React.createElement("hr", null)
      )
    )
  }
})

var TwitterProfileCard = React.createClass({displayName: 'TwitterProfileCard',
  render: function() {
    return (
      React.createElement("div", {style: {cursor:"pointer"}}, 
        React.createElement("div", null, 
          React.createElement("h5", null, React.createElement("i", {className: "fa fa-twitter"}), "  " + ' ' +
            "Twitter Trigger Name"), 
          React.createElement("h5", null, React.createElement("small", null, 
              React.createElement("span", {style: {fontWeight:"bold"}}, "Keywords: "), 
                "blah blah"))
        )
      )
    )
  }
})

module.exports = ProfileSidebar

});

;require.register("range_slider", function(exports, require, module) {
//var Slider = require("bootstrap-slider");

var RangeSlider = React.createClass({displayName: 'RangeSlider',
  componentDidMount: function() {
    //$(".selector").slider({ from: 5, to: 50})
   $( "#slider-range" ).slider({
      range: true,
      min: 0,
      max: 500,
      values: [ 75, 300 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
      }
    });
  },
  render: function() {
    return (
      React.createElement("div", null, 
        "The range slider", 
        React.createElement("input", {type: "text", id: "amount"}), 

        React.createElement("div", {id: "slider-range"})
 
      )
    )
  }
})

module.exports = RangeSlider

});

;require.register("routes", function(exports, require, module) {
var TabbedArea = ReactBootstrap.TabbedArea
var TabPane = ReactBootstrap.TabPane
var SplitButton = ReactBootstrap.SplitButton
var MenuItem= ReactBootstrap.SplitButton
var Modal= ReactBootstrap.Modal
var Button = ReactBootstrap.Button
var Thumbnail= ReactBootstrap.Thumbnail
var Alert = ReactBootstrap.Alert
var LandingPage = require("landing_page")
var Pricing = require("pricing")
var Login = require("login")
var Signup = require("signup")
var Sidebar = require("sidebar")
var Profile = require("profile")
var ContactDetail = require("contact_detail")
var CompanyDetail = require("company_detail")

var CompanyEventCard = require("event_cards").CompanyEventCard
/*
var CompanyBlogEventCard = require("event_cards").CompanyBlogEventCard
var CompanyNewsEventCard = require("event_cards").CompanyNewsEventCard
var CompanyPressEventCard = require("event_cards").CompanyPressEventCard
var CompanyHiringEventCard = require("event_cards").CompanyHiringEventCard
var FacebookEventCard = require("event_cards").FacebookEventCard
var TwitterEventCard = require("event_cards").TwitterEventCard
var LinkedinEventCard = require("event_cards").LinkedinEventCard
*/

var CompanyBlogEventContent = require("event_cards").CompanyBlogEventContent
var CompanyNewsEventContent = require("event_cards").CompanyNewsEventContent
var CompanyPressEventContent = require("event_cards").CompanyPressEventContent
var CompanyHiringEventContent = require("event_cards").CompanyHiringEventContent
var FacebookEventContent = require("event_cards").FacebookEventContent
var TwitterEventContent = require("event_cards").TwitterEventContent
var LinkedinEventContent = require("event_cards").LinkedinEventContent

var Route = ReactRouter.Route;
var RouteHandler = ReactRouter.RouteHandler;

var Navbar = React.createClass({displayName: 'Navbar',
  gotoHome: function() {
    location.href= "#"
  },

  render: function() {
    return (
      React.createElement("header", {className: "header", style: {paddingTop:20,paddingBottom:40}}, 
        React.createElement("ul", {className: "text-muted"}, 
          React.createElement("li", {className: "app-logo"}, 
            React.createElement("div", null, 
            React.createElement("img", {src: "images/blaze-logo.png", style: {marginTop:4,height:18,marginLeft:-15,display:"none"}}), 
            React.createElement("div", {style: {}, onClick: this.gotoHome, style: {color:"#FFBB01",marginLeft:-20}}, " ", React.createElement("i", {className: "fa fa-bolt"}), 
              "ClearSpark")
            )
          ), 
          React.createElement("div", {style: {display:"none"}}, 
            React.createElement("li", {style: {fontWeight:"bold",color:"#0079ff",color:"#000"}}, "DATASETS"), 
            React.createElement("li", null, "USERS"), 
            React.createElement("li", null, "EXPLORE"), 
            React.createElement("li", null, "COMPUTE"), 
            React.createElement("li", {style: {float:"right",marginRight:50}}, "LOGOUT")
          )
        )
      )
    )
  }
})


var Main = React.createClass({displayName: 'Main',
  render: function() {
    return (
      React.createElement("div", {style: {height:"100%"}}
      )
    )
  }
})

var Dashboard = React.createClass({displayName: 'Dashboard',
  render: function() {
    return (
      React.createElement("div", null
      )
    )
  }
})

var App = React.createClass({displayName: 'App',
  render: function() {
    return (
      React.createElement("div", {className: "container app"}, 
          React.createElement(RouteHandler, null)
      )
    )
  }
})

var AuthenticatedApp = React.createClass({displayName: 'AuthenticatedApp',
  render: function() {
    return (
      React.createElement("div", {className: "app"}, 
          React.createElement(Sidebar, null), 
          React.createElement("div", {className: "col-xs-7 col-sm-9 col-md-9 main-bg", style: {overflow:"auto"}}, 
            React.createElement(RouteHandler, null)
          )
      )
    )
  }
});

var Lookup = React.createClass({displayName: 'Lookup',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", null, 
          React.createElement("br", null), 
          React.createElement("input", {className: "form-control lookup-input", placeholder: "Enter search term"})
          
        )

      )
    )
  }
})

var Feed = React.createClass({displayName: 'Feed',
  getInitialState: function() {
    return {
      events : []
    }
  },

  componentDidMount: function() {
    var _this = this;
    $.ajax({
      url:location.origin+"/events",
      dataType:"json",
      success: function(res) {
        console.log(res)
        _this.setState({events: res})
      },
      error: function(err) {
        console.log(err)
      }
    })
  },

  render: function() {
    var events = _.map(this.state.events, function(event) {
      if(event.event_type == "CompanyBlogEvent")
        return React.createElement(CompanyEventCard, {
                logo: "fa fa-rss", event: event, 
                content: React.createElement(CompanyBlogEventContent, {event: event})})
      else if(event.event_type == "CompanyNewsEvent")
        return React.createElement(CompanyEventCard, {
                logo: "fa fa-newspaper-o", event: event, 
                content: React.createElement(CompanyNewsEventContent, {event: event})})
      else if(event.event_type == "CompanyPressEvent")
        return React.createElement(CompanyEventCard, {
                logo: "fa fa-bullhorn", event: event, 
                content: React.createElement(CompanyPressEventContent, {event: event})})
      else if(event.event_type == "CompanyHiringEvent")
        return React.createElement(CompanyEventCard, {
                logo: "fa fa-suitcase", event: event, 
                content: React.createElement(CompanyHiringEventContent, {event: event})})
      else if(event.event_type == "FacebookEvent")
        return React.createElement(CompanyEventCard, {
                logo: "fa fa-facebook", event: event, 
                content: React.createElement(FacebookEventContent, {event: event})})
      else if(event.event_type == "TweetEvent")
        return React.createElement(CompanyEventCard, {
                logo: "fa fa-twitter", event: event, 
                content: React.createElement(TwitterEventContent, {event: event})})
      else if(event.event_type == "LinkedinEvent")
        return React.createElement(CompanyEventCard, {
                logo: "fa fa-linkedin", event: event, 
                content: React.createElement(LinkedinEventContent, {event: event})})
    })
    return (
        React.createElement("div", {className: "col-md-offset-2 col-md-9", style: {paddingTop:50}}, 
          events
        )
    )
  }
})

var ContactCard = React.createClass({displayName: 'ContactCard',
    gotoContactDetail: function() {
      location.href = "#/contact/"+this.props.contact.email
    },

    gotoCompanyDetail: function(e) {
      location.href = "#/company/"+this.props.contact.employment.domain
      e.stopPropagation()
    },

    render: function() {
        contact = this.props.contact
        //console.log(contact)
        return (
              React.createElement("div", {onClick: this.gotoContactDetail, style: {cursor:"pointer"}}, 
              React.createElement("img", {src: (contact.avatar) ? contact.avatar : "images/user.png", 
                   style: {height:30,width:30,borderRadius:20,float:"left",marginLeft:20,marginRight:15}}), 
                React.createElement("h5", {style: {fontWeight:600,marginBottom:5}}, (contact.name) ? contact.name.fullName : ""), 
                React.createElement("h6", {style: {marginTop:5}}, 
                  (contact.employment) ? React.createElement("span", null, contact.employment.title + ", ", React.createElement("a", {href: "javascript:", onClick: this.gotoCompanyDetail, style: {color:"white",fontWeight:"bold"}}, contact.employment.name)) : ""
                ), 
    
              React.createElement("hr", {style: {marginLeft:20,marginRight:20,color:"black",backgroundColor:"rgba(255,255,255,0.1)",opacity:"0.3",marginTop:10,marginBottom:10}})
              )
      )
    }
})




var Contacts = React.createClass({displayName: 'Contacts',
  getInitialState: function() {
    return {
      contacts: []
    }
  },
  
  componentDidMount: function() {
    var _this = this;
    $.ajax({
      url:location.origin+"/contacts",
      dataType:"json",
      success: function(res) {
        //console.log(res)
        _this.setState({contacts: res})
      },
      error: function(err) {
        console.log(err)
      }
    })

  },

  render: function() {
    contacts = _.map(this.state.contacts.concat(this.state.contacts), 
        function(contact) {
        if(contact.name)
          return React.createElement(ContactCard, {contact: contact})
    })

    return (
      React.createElement("div", null, 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: ""}, 
            React.createElement("div", {style: {width:250,height:"100%",backgroundColor:"rgba(255,255,255,0.3)",position:"absolute",top:0, boxShadow: "rgba(0, 0, 0, 0.0980392) 0px 1px 2px 1px",fontWeight:800,color:"white",position:"fixed",overflow:"auto"}}, 
              React.createElement("br", null), 
              React.createElement("div", {style: {textAlign:"center"}}, "CONTACTS ("+contacts.length+")"), 
              React.createElement("hr", {style: {marginLeft:20,marginRight:20}}), 
              contacts

            )
          ), 
          React.createElement("div", {style: {marginLeft:200}}, 
            React.createElement(Feed, null)
          )
        )
      )
    )
  }
})

// declare our routes and their hierarchy
var routes = (
  React.createElement(Route, null, 
    React.createElement(Route, {path: "/", handler: App}, 
      React.createElement(Route, {path: "", handler: LandingPage}), 
      React.createElement(Route, {path: "login", handler: Login}), 
      React.createElement(Route, {path: "signup", handler: Signup}), 
      React.createElement(Route, {path: "pricing", handler: Pricing})
    ), 
    React.createElement(Route, {path: "app", handler: AuthenticatedApp}, 
      React.createElement(Route, {path: "", handler: Feed}), 
      React.createElement(Route, {path: "contacts", handler: Contacts}), 
      React.createElement(Route, {path: "profile", handler: Profile}), 
      React.createElement(Route, {path: "/contact/:email", handler: ContactDetail}), 
      React.createElement(Route, {path: "/company/:domain", handler: CompanyDetail})
    )
  )
);

module.exports = routes;

});

require.register("search_bar", function(exports, require, module) {
//var TagsInput = require('react-tagsinput');
//var TagsInput = require('react-tageditor');
          //<TagsInput ref='tags' />

var SearchBar = React.createClass({displayName: 'SearchBar',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("div", null, 
          React.createElement(TagEditor, {tags: [], delimiters: [",",13], placeholder: "Enter search..."})
        )
      )
    )
  }
})

module.exports = SearchBar

});

;require.register("sidebar", function(exports, require, module) {
var Sidebar = React.createClass({displayName: 'Sidebar',
  gotoContacts: function() {
    location.href= "#/app/contacts"
  },
  
  gotoHome: function() {
    location.href= "#/app"
  },

  render: function() {
    return (
          React.createElement("div", {className: "col-xs-5 col-sm-3 col-md-3", style: {borderRight:"1px solid #eee",boxShadow: "rgba(0, 0, 0, 0.1980392) 0px -6px 10px 1px",position:"relative",marginRight:20,zIndex:100}}, 
              React.createElement("br", null), 
              React.createElement("div", {style: {fontWeight:800, fontSize:24,color:"#FFBB01",marginLeft:20,cursor:"pointer"}, onClick: this.gotoHome}, 
                React.createElement("div", {style: {backgroundColor:"#FFBB01", display:"inline",width:20,height:20,borderRadius:20,display:"none",cursor:"pointer"}, onClick: this.gotoHome}, 
                React.createElement("i", {className: "fa fa-bolt", style: {color:"white",fontSize:12}})
                ), 
                "ClearSpark"
              ), 

              React.createElement("hr", null), 
            React.createElement("ul", {style: {paddingLeft:0}}, 
              React.createElement("li", {style: {cursor:"pointer"}, onClick: this.gotoHome}, 
                React.createElement("h4", null, "INBOX", 
                React.createElement("a", {href: "javascript:", className: "btn btn-success btn-xs", style: {float:"right",display:"none"}}, " ", React.createElement("i", {className: "fa fa-plus"}))
)), " ", React.createElement("hr", null), 
              React.createElement("li", {style: {display:"none"}}, React.createElement("h4", null, "CALENDAR", 
                React.createElement("a", {href: "javascript:", className: "btn btn-success btn-xs", style: {float:"right",display:"none"}}, " ", React.createElement("i", {className: "fa fa-plus"}))
), React.createElement("hr", null)), 
              React.createElement("li", {style: {display:"none"}}, React.createElement("h4", null, "CRM", 
                React.createElement("a", {href: "javascript:", className: "btn btn-success btn-xs", style: {float:"right"}}, " ", React.createElement("i", {className: "fa fa-plus"}))
), React.createElement("hr", null)), 
              React.createElement("li", {style: {cursor:"pointer"}, 
                onClick: this.gotoContacts}, 
                "CONTACTS  ", 
                React.createElement("a", {href: "javascript:", className: "btn btn-success btn-xs", style: {float:"right",display:"none"}}, " ", React.createElement("i", {className: "fa fa-plus"}))
              ), 
              React.createElement("hr", null), 

              React.createElement("span", {style: {display:"none"}}, 
              React.createElement("li", null, "LISTS   "), 
              React.createElement("br", null), 
            
                React.createElement("h5", null, React.createElement("i", {className: "fa fa-list", style: {fontSize:10}}), "  List One"), 
                React.createElement("h5", null, React.createElement("i", {className: "fa fa-list", style: {fontSize:10}}), "  List One"), 
              React.createElement("li", null, React.createElement("a", {href: "javascript:", className: "btn btn-success btn-xs"}, React.createElement("i", {className: "fa fa-plus"}), "   ADD LIST")), 
              React.createElement("hr", null)
              ), 

              React.createElement("div", {style: {display:"none"}}, 
              React.createElement("li", null, "ACCOUNT"), 
              React.createElement("hr", null), 
              React.createElement("li", null, "API KEYS"), 
              React.createElement("hr", null), 
              React.createElement("li", null, "LOGS"), 
              React.createElement("hr", null), 
              React.createElement("br", null), 
              React.createElement("li", null, "Get Started"), 
              React.createElement("li", null, "Api Docs"), 
              React.createElement("li", null, "Support"), 
              React.createElement("li", null, "Logout")
              )
            ), 
            React.createElement("div", null, " SETTINGS",  
              React.createElement("a", {href: "#/app/profile", className: "btn btn-default btn-sm", 
                    style: {float:"right"}}, 
                React.createElement("i", {className: "fa fa-cog"})
            ))
          )
    )
  }
})

module.exports = Sidebar

});

;require.register("signup", function(exports, require, module) {
var Signup = React.createClass({displayName: 'Signup',
  render: function() {
    return (
      React.createElement("div", {style: {textAlign:"center",paddingTop:120}}, 

          React.createElement("img", {src: "images/radar_2.png", style: {height:100}}), 
          React.createElement("br", null), 
        React.createElement("input", {className: "form-control input-lg", style: {fontSize:16, marginRight:"auto",marginLeft:"auto",marginTop:30,width:300,borderRadius:2}, placeholder: "EMAIL"}), 
        React.createElement("input", {className: "form-control input-lg", style: {fontSize:16, marginTop:10,marginLeft:"auto",marginRight:"auto",width:300,borderRadius:2}, placeholder: "PASSWORD", type: "password"}), 
        React.createElement("input", {className: "form-control input-lg", style: {fontSize:16, marginTop:10,marginLeft:"auto",marginRight:"auto",width:300,borderRadius:2}, placeholder: "CONFIRM PASSWORD", type: "password"}), 
        React.createElement("br", null), 
        React.createElement("a", {className: "btn btn-lg btn-success", style: {marginTop:10,width:300, fontSize:16}}, "SIGN UP")

      )
    )
  }
})

module.exports = Signup

});

;require.register("table", function(exports, require, module) {
var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var DatePair = require("date_pair")
var SearchBar = require("search_bar")
var RangeSlider = require("range_slider")
var CheckboxGroup = require("checkbox_group")
//var TagsInput = require("react-tagsinput")

var BlazeColumn = React.createClass({displayName: 'BlazeColumn',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("br", null), 
        "Columns", 
        React.createElement("br", null), 
        React.createElement("h6", null, "Date Pair"), 
          React.createElement(DatePair, null), 
        React.createElement("h6", null, "Search (tags)"), 
          React.createElement(SearchBar, null), 
        React.createElement("h6", null, "Range Slider"), 
          React.createElement(RangeSlider, null), 
        React.createElement("h6", null, "Checkbox Group"), 
          React.createElement(CheckboxGroup, null)
      )
    )
  }
})

var BlazeTable = React.createClass({displayName: 'BlazeTable',
  getInitialState: function() {
    return {
      rows: [
        ['a1', 'b1', 'c1'],
        ['a2', 'b3', 'c2'],
        ['a3', 'b3', 'c3'],
      ]
    }
  },
  rowGetter: function (rowIndex) {
    return this.state.rows[rowIndex];
  },
  render: function() {
    var rowGetter = this.rowGetter
    // TODO 
    // get column names
    // get default data
    return( 
      React.createElement("div", {style: {marginLeft:30}}, 
        React.createElement("br", null), 
        React.createElement(Table, {
          rowHeight: 50, 
          rowGetter: rowGetter, 
          rowsCount: this.state.rows.length, 
          width: 500, 
          height: 200, 
          headerHeight: 50}, 
          React.createElement(Column, {
            label: "Col 1", 
            width: 300, 
            dataKey: 0}
          ), 
          React.createElement(Column, {
            label: "Col 2", 
            width: 200, 
            dataKey: 1}
          )
        )
      )
    )
  }
})

var DataExplorer = React.createClass({displayName: 'DataExplorer',
  render: function() {
    return (
      React.createElement("div", {className: "row"}, 
        React.createElement("div", {className: "col-md-2", style: {paddingRight:0}}, React.createElement(BlazeColumn, null), " "), 
        React.createElement("div", {className: "col-md-10"}, React.createElement(BlazeTable, null), " ")
      )
    )
  }
})

module.exports = DataExplorer

});

;require.register("trigger_list", function(exports, require, module) {
var CompanyCard = require("company_card")

var TriggerList = React.createClass({displayName: 'TriggerList',
  render: function() {
    return (

          React.createElement("div", {className: "col-md-10", style: {paddingLeft:30}}, 
            React.createElement("div", {style: {display:"block",marginLeft:"auto",marginRight:100,textAlign:"center",marginTop:8}}, 
              React.createElement("span", {style: {fontWeight:"800"}}, "TODAY "), 
              React.createElement("span", {style: {color:"#bbb"}}, "August 28th")
            ), 
            React.createElement("a", {href: "javascript:", className: "btn btn-success", style: {float:"right",marginTop:-90,display:"none"}}, "Create Trigger"), 
            React.createElement("a", {href: "javascript:", className: "btn btn-default btn-xs", style: {float:"right",marginTop:-25}}, "List View"), 
            React.createElement("br", null), 
            React.createElement(CompanyCard, null), 
            React.createElement(CompanyCard, null), 
            React.createElement(CompanyCard, null)
          )

    )
  }
})

module.exports = TriggerList

});

;require.register("user_dataset_table", function(exports, require, module) {
var UserDatasetTable = React.createClass({displayName: 'UserDatasetTable',
  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement("br", null), 
        React.createElement("br", null), 
        React.createElement("div", {className: "section-title"}, "Datasets"), 
        React.createElement("br", null), 
        React.createElement("a", {href: "#/new_dataset", className: "btn btn-success btn-lg", 
          style: {float:"right",marginTop:-65}}, 
          "Add Dataset"
        ), 
        React.createElement("table", {className: "table table-hover dataset-table"}, 
          React.createElement("thead", null, 
            React.createElement("tr", {className: "header-row"}, 
              React.createElement("th", null), 
              React.createElement("th", null, "Type "), 
              React.createElement("th", null, "Name "), 
              React.createElement("th", null, "Shape "), 
              React.createElement("th", null, "URL "), 
              React.createElement("th", null, "Date Added "), 
              React.createElement("th", null, "Collaborators ")
            )
          ), 
          React.createElement("tbody", null, 
            React.createElement("tr", null, 
              React.createElement("td", {style: {textAlign:"center"}}, 
                  React.createElement("div", {style: {display:"inline-block",
                               backgroundColor:"#15CD72",
                              height:10,width:10,borderRadius:5}})), 
              React.createElement("td", null, "Type "), 
              React.createElement("td", null, "Name "), 
              React.createElement("td", null, "Shape "), 
              React.createElement("td", null, "URL "), 
              React.createElement("td", null, "Date Added "), 
              React.createElement("td", null, "Collaborators ")
            ), 
            React.createElement("tr", null, 
              React.createElement("td", {style: {textAlign:"center"}}, 
                  React.createElement("div", {style: {display:"inline-block",
                               backgroundColor:"#15CD72",
                              height:10,width:10,borderRadius:5}})), 
              React.createElement("td", null, "Type "), 
              React.createElement("td", null, "Name "), 
              React.createElement("td", null, "Shape "), 
              React.createElement("td", null, "URL "), 
              React.createElement("td", null, "Date Added "), 
              React.createElement("td", null, "Collaborators ")
            )
          )
          
        )
      )
    )
  }
});

module.exports = UserDatasetTable;

});

require.register("websocket_listener", function(exports, require, module) {
var _SockJS = {
  start: function() {
    console.log("start")
  }
}

    var sockJS = new SockJS("http://127.0.0.1:8988/sockjs"),
                        userId = 0,
                        users = {};

var WebsocketListener = React.createClass({displayName: 'WebsocketListener',
  componentDidMount: function() {
    //SockJS.start()
    var sockJS = new SockJS("http://127.0.0.1:8988/sockjs"),
                        userId = 0,
                        users = {};

    sockJS.onopen = function() {
        console.log("connected")
    }

    sockJS.onmessage = function(event) {
      event.data = JSON.parse(event.data);
      console.log(event)
      var msg = event.data.msg,
          user = event.data.user,
          el;
    }

    sockJS.onclose = function() {
      console.log("on close")
    };
  },

  render: function() {
    return (
      React.createElement("div", {className: "alert alert-info", 
           style: {textAlign:"center",marginTop:10,cursor:"pointer"}}, 
        React.createElement("a", {href: "javascript:", className: "btn btn-default btn-xs", style: {float:"right",marginTop:-45}}, "List View"), 
        React.createElement("strong", null, "36 new prospects found"), "   " + ' ' +
            "Click this here to load!"
      )
    )
  }
})

module.exports = WebsocketListener

});

;
//# sourceMappingURL=app.js.map