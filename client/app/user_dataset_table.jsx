var UserDatasetTable = React.createClass({
  render: function() {
    return (
      <div>
        <br/>
        <br/>
        <div className="section-title" >Datasets</div>
        <br/>
        <a href="#/new_dataset" className="btn btn-success btn-lg"
          style={{float:"right",marginTop:-65}}>
          Add Dataset
        </a>
        <table className="table table-hover dataset-table">
          <thead>
            <tr className="header-row">
              <th></th>
              <th>Type </th>
              <th>Name </th>
              <th>Shape </th>
              <th>URL </th>
              <th>Date Added </th>
              <th>Collaborators </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{textAlign:"center"}}>
                  <div style={{display:"inline-block",
                               backgroundColor:"#15CD72",
                              height:10,width:10,borderRadius:5}}></div></td>
              <td>Type </td>
              <td>Name </td>
              <td>Shape </td>
              <td>URL </td>
              <td>Date Added </td>
              <td>Collaborators </td>
            </tr>
            <tr>
              <td style={{textAlign:"center"}}>
                  <div style={{display:"inline-block",
                               backgroundColor:"#15CD72",
                              height:10,width:10,borderRadius:5}}></div></td>
              <td>Type </td>
              <td>Name </td>
              <td>Shape </td>
              <td>URL </td>
              <td>Date Added </td>
              <td>Collaborators </td>
            </tr>
          </tbody>
          
        </table>
      </div>
    )
  }
});

module.exports = UserDatasetTable;
