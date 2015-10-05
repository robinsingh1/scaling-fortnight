

var DatePair = React.createClass({
  componentDidMount: function() {
    $('.date').datepicker()

  },
  render: function() {
    input = {width:75, display:"inline-block",fontSize:10}
    return (
      <div>
        <h6 style={{fontWeight:"800"}}>COLUMN NAME &nbsp;
            <small>datetime</small></h6>
        <p id="basicExample">
            <input type="text" className="date start form-control input-sm" style={input}/>
            &nbsp;
            <span style={{fontSize:8,fontWeight:600}}>TO</span>
            &nbsp;
            <input type="text" className="date end form-control input-sm" style={input}/>
        </p>

      </div>
    )
  }
})

module.exports = DatePair
