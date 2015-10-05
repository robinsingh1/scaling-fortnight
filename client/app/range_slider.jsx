//var Slider = require("bootstrap-slider");

var RangeSlider = React.createClass({
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
      <div>
        The range slider
        <input type="text" id="amount" />

        <div id="slider-range"></div>
 
      </div>
    )
  }
})

module.exports = RangeSlider
