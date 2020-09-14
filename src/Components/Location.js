import React from 'react';
//import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';

class Location extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <div className="locationListItem">
        <h3>{this.props.location.name}</h3>
        <div>{this.props.location.address} {this.props.location.suite}<br/>{this.props.location.city}, {this.props.location.state} {this.props.location.zip}</div>
        <div>
          <Dropdown>
            <Dropdown.Toggle className="btn btn-brand" id="dropdown-basic">
              Order Here
            </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu">
            {this.props.location.services.map((entry, i) => {
              return  <Dropdown.Item href={"order/"+this.props.location.link + "/" + entry.name} key={"dropdown_"+i} className="dropdown-item">{entry.name}<br/></Dropdown.Item>
              })
            }
            </Dropdown.Menu>
          </Dropdown>
        </div>
        <hr className="locationListItem-break"/>
      </div>
    );
  }
}

export default Location;
