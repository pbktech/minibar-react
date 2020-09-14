import React from 'react';
import Button from 'react-bootstrap/Button'
import MenuItem from './MenuItem';
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import Container from 'react-bootstrap/Container'

class MenuGroup extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
    return (
      <Container fluid>
        {this.props.menuGroups.length && this.props.menuGroups.map((entry, i) => {
        return (
          <div className="container-fluid" style={{paddingTop:"1em",paddingBottom:"1em"}}>
          <h2>{entry.name}</h2>
          <div className="row">
            <MenuItem key={"menuitems_"+i} items={entry.menuItems}/>
          </div>
          </div>
        );
      })
    }
    </Container>
    );
  }
}

export default MenuGroup;
