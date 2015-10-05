
var CheckboxGroup = React.createClass({
  render: function() {
    return (
      <div>
        The Checkbox Group
        <div className="checkbox">
          <input type="checkbox" id="checkbox1" /><label htmlFor="checkbox1"> Check me out </label>
          <input type="checkbox" id="checkbox2" /><label htmlFor="checkbox2"> Check me out </label>
          <input type="checkbox" id="checkbox3" /><label htmlFor="checkbox3"> Check me out </label>
          <input type="checkbox" id="checkbox4" /><label htmlFor="checkbox4"> Check me out </label>
        </div>
      </div>
    )
  }
})

module.exports = CheckboxGroup
