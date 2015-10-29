var ContactDetail = React.createClass({
  render: function() {
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
          <i className="fa fa-newspaper-o" /> &nbsp; News Mentions
          <hr/>
          <i className="fa fa-rss" /> &nbsp; Blog Posts
          <hr/>
          <i className="fa fa-bullhorn" /> &nbsp; Press Releases
          <hr/>
          <i className="fa fa-suitcase" /> &nbsp; Jobs
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

module.exports = ContactDetail
