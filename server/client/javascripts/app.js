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

require.register("range_slider", function(exports, require, module) {
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
var DataExplorer = require("table")
var UserDatasetTable = require("user_dataset_table")
var CreateTriggerModal = require("create_trigger_modal")

var TabbedArea = ReactBootstrap.TabbedArea
var TabPane = ReactBootstrap.TabPane
var SplitButton = ReactBootstrap.SplitButton
var MenuItem= ReactBootstrap.SplitButton
var Modal= ReactBootstrap.Modal
var Button = ReactBootstrap.Button
var Thumbnail= ReactBootstrap.Thumbnail

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
      showCreateTriggerModal: false
    }
  },

  toggleCreateTriggerModal: function() {
    console.log("toggle")
    this.setState({ showCreateTriggerModal: !this.state.showCreateTriggerModal });
  },

  render: function() {
    return (
      React.createElement("div", {className: "container"}, 
        React.createElement("br", null), 
        React.createElement("div", {className: "row"}, 
          React.createElement("div", {className: "col-md-2"}, 
            React.createElement("span", {style: {fontWeight:"800"}}, "TRIGGERS",  
              React.createElement("span", {style: {color:"#bbb",marginLeft:10,fontWeight:200}}, "(18) ")
            ), 

            React.createElement("a", {href: "javascript:", 
               className: "btn btn-success btn-xs", 
               onClick: this.toggleCreateTriggerModal, 
               style: {float:"right"}}, 
              React.createElement("i", {className: "fa fa-plus"})), 

            React.createElement("hr", null), 
            React.createElement("div", {style: {cursor:"pointer"}}, 
              React.createElement("div", null, 
                React.createElement("h5", null, React.createElement("i", {className: "fa fa-twitter"}), "  " + ' ' +
                  "Twitter Trigger Name"), 
                
                React.createElement("h5", null, React.createElement("small", null, 
                    React.createElement("span", {style: {fontWeight:"bold"}}, "Keywords: "), 
                      "blah blah"))
              )
            ), 
            React.createElement("hr", null), 
            React.createElement("div", {style: {cursor:"pointer"}}, 
              React.createElement("h5", null, " ", React.createElement("i", {className: "fa fa-suitcase"}), " " + ' ' +
                "Hiring Trigger Name"), 
              React.createElement("h5", null, React.createElement("small", null, "Company Info blah blah"))
            ), 
            React.createElement("hr", null), 
            React.createElement("div", {style: {cursor:"pointer"}}, 
              React.createElement("h5", null, " ", React.createElement("i", {className: "fa fa-bullhorn"}), " " + ' ' +
                "Press Trigger Name"), 
              React.createElement("h5", null, React.createElement("small", null, "Company Info blah blah"))
            ), 
            React.createElement("hr", null)

          ), 
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
        ), 
        React.createElement(CreateTriggerModal, {
            showModal: this.state.showCreateTriggerModal, 
            closeModal: this.toggleCreateTriggerModal})
      )
    )
  }
})


var CompanyDetailOverlay = React.createClass({displayName: 'CompanyDetailOverlay',
  render: function() {
    return (
      React.createElement("div", null
      )
    )
  }
})

var CompanyCard = React.createClass({displayName: 'CompanyCard',
  render: function() {
    return (
          React.createElement("div", {className: ""}, 
              React.createElement("table", null, 
                React.createElement("tbody", null, 
                  React.createElement("tr", null, 
                    React.createElement("td", null, 
                     React.createElement("a", {href: "#", className: "thumbnail", 
                        style: {height:60,width:60,marginRight:15,float:"left",marginBottom:0}}, 
                        React.createElement("img", {src: "images/radar_1.png", alt: "..."})
                      )
                    ), 
                    React.createElement("td", {style: {padding:5,width:"35%"}}, 
                      React.createElement("h5", null, "Company Card"), 
                      React.createElement("h5", null, React.createElement("small", null, "Company Info blah blah"))
                    ), 
                    React.createElement("td", {style: {padding:5,width:"35%"}}, 
                      React.createElement("h5", null), 
                      React.createElement("h5", null, React.createElement("small", null, "Tweeted out this workd blah blah"))
                    ), 
                    React.createElement("td", {style: {padding:5,width:"35%"}}, 
                      React.createElement("h5", null), 
                      React.createElement("div", {style: {height:25,width:25,border:"2px solid white",boxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,display:"inline-block"}}, " "), 
                      React.createElement("div", {style: {height:25,width:25,border:"2px solid white",boxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,display:"inline-block"}}, " "), 
                      React.createElement("div", {style: {height:25,width:25,border:"2px solid white",boxShadow:"0px 2px 4px 0px rgba(0,0,0,0.30)",backgroundImage:"url('images/user.png')",backgroundSize:"cover",borderRadius:25,display:"inline-block"}}, " ")

                    ), 
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


//# sourceMappingURL=app.js.map