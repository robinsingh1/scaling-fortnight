var _SockJS = {
  start: function() {
    console.log("start")
  }
}

    var sockJS = new SockJS("http://127.0.0.1:8988/sockjs"),
                        userId = 0,
                        users = {};

var WebsocketListener = React.createClass({
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
      <div className="alert alert-info" 
           style={{textAlign:"center",marginTop:10,cursor:"pointer"}}>
        <a href="javascript:" className="btn btn-default btn-xs" style={{float:"right",marginTop:-45}}>List View</a>
        <strong>36 new prospects found</strong>  &nbsp;
            Click this here to load!
      </div>
    )
  }
})

module.exports = WebsocketListener
