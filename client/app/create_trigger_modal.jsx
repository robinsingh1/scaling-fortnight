var TabbedArea = ReactBootstrap.TabbedArea
var TabPane = ReactBootstrap.TabPane
var SplitButton = ReactBootstrap.SplitButton
var MenuItem= ReactBootstrap.SplitButton
var Modal= ReactBootstrap.Modal
var Button = ReactBootstrap.Button
var Thumbnail= ReactBootstrap.Thumbnail

var TwitterKeywords = require("search_bar")

var CreateTwitterTrigger = React.createClass({
  render: function() {
    return (
      <div>
        <br/>
        Keywords:
        <TwitterKeywords />
        Hashtags:
        <TwitterKeywords />
      </div>
    )
  }
})

var CreateHiringTrigger = React.createClass({
  render: function() {
    return (
      <div>
        <br/>
        Title Keywords:
        <TwitterKeywords />
        Job Keyword Can Contain:
        <TwitterKeywords />
      </div>
    )
  }
})

var CreatePressTrigger = React.createClass({
  render: function() {
    return (
      <div>
        <br/>
        Title Keywords:
        <TwitterKeywords />
        Job Keyword Can Contain:
        <TwitterKeywords />
      </div>
    )
  }
})

var CreateIndustryTrigger = React.createClass({
  render: function() {
    return (
      <div>
        <br/>
        Title Keywords:
        <TwitterKeywords />
        Job Keyword Can Contain:
        <TwitterKeywords />
      </div>
    )
  }
})

var CreateTriggerModal = React.createClass({
  render: function() {
    return (
      <Modal show={this.props.showModal} onHide={this.props.closeModal} bsSize='medium' aria-labelledby='contained-modal-title-lg'>
        <Modal.Header closeButton>
          <Modal.Title id='contained-modal-title-lg'>Create Trigger</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TabbedArea defaultActiveKey={1}>
            <TabPane eventKey={1} tab='Twitter'><CreateTwitterTrigger /></TabPane>
            <TabPane eventKey={2} tab='Hiring'><CreateHiringTrigger /></TabPane>
            <TabPane eventKey={3} tab='Press'><CreatePressTrigger /></TabPane>
            <TabPane eventKey={4} tab='Industry'><CreateIndustryTrigger /></TabPane>
          </TabbedArea>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.onHide}>Create Trigger</Button>
        </Modal.Footer>
      </Modal>
    )
  }
})

module.exports = CreateTriggerModal
