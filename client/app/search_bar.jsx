//var TagsInput = require('react-tagsinput');
//var TagsInput = require('react-tageditor');
          //<TagsInput ref='tags' />

var SearchBar = React.createClass({
  render: function() {
    return (
      <div>
        <div>
          <TagEditor tags={[]} delimiters={[",",13]} placeholder="Enter search..." />
        </div>
      </div>
    )
  }
})

module.exports = SearchBar
