import React from 'react';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import MenuItemModal from './MenuItemModal';
import PropTypes from 'prop-types';
import { CartCss } from '../../utils';

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.items && this.props.items.length) {
      return this.props.items
        .filter((item) => item.price !== '0.00')
        .sort((a, b) => (a.sort > b.sort ? 1 : -1))
        .map((entry, i) => {
          return (
            <>
            <CartCss />
            <div key={'itemCards' + i} className="col-sm-4">
              <Card key={'itemCard' + i}>
                <Card.Img variant="top" src={entry.image} key={'itemCardImage' + i} />
                <Card.Body>
                  <Card.Title><h3>{entry.name}</h3></Card.Title>
                  <Card.Subtitle>{entry.price}</Card.Subtitle>
                  <div className="card-text" style={{ height: '150px' }}>
                    {entry.description}
                  </div>
                </Card.Body>
                <Card.Footer style={{ backgroundColor: '#FFFFFF', textAlign: 'center' }}>
                    <MenuItemModal key={'modal_' + i} itemName={entry.name} price={entry.price} modGroups={entry.modGroups} itemGUID={this.props.menuGUID + "/" + entry.guid}/>
                </Card.Footer>
              </Card>
            </div>
            </>
          );
        });
    }
    return <></>;
  }
}

MenuItem.propTypes = {
  items: PropTypes.array.isRequired
};

export default MenuItem;
