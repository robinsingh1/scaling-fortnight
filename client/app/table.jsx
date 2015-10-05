var Table = FixedDataTable.Table;
var Column = FixedDataTable.Column;
var DatePair = require("date_pair")
var SearchBar = require("search_bar")
var RangeSlider = require("range_slider")
var CheckboxGroup = require("checkbox_group")
//var TagsInput = require("react-tagsinput")

var BlazeColumn = React.createClass({
  render: function() {
    return (
      <div>
        <br/>
        Columns
        <br/>
        <h6>Date Pair</h6>
          <DatePair />
        <h6>Search (tags)</h6>
          <SearchBar />
        <h6>Range Slider</h6>
          <RangeSlider />
        <h6>Checkbox Group</h6>
          <CheckboxGroup />
      </div>
    )
  }
})

var BlazeTable = React.createClass({
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
      <div style={{marginLeft:30}}>
        <br/>
        <Table
          rowHeight={50}
          rowGetter={rowGetter}
          rowsCount={this.state.rows.length}
          width={500}
          height={200}
          headerHeight={50}>
          <Column
            label="Col 1"
            width={300}
            dataKey={0}
          />
          <Column
            label="Col 2"
            width={200}
            dataKey={1}
          />
        </Table>
      </div>
    )
  }
})

var DataExplorer = React.createClass({
  render: function() {
    return (
      <div className="row">
        <div className="col-md-2" style={{paddingRight:0}}><BlazeColumn /> </div>
        <div className="col-md-10"><BlazeTable /> </div>
      </div>
    )
  }
})

module.exports = DataExplorer
