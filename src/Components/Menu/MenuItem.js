import React from 'react';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import MenuItemModal from './MenuItemModal'

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.items && this.props.items.length) {
      return this.props.items.filter((item) => item.price!=="0.00").sort((a,b) => a.sort > b.sort ? 1 : -1).map((entry, i) => {
        return (
          <div key={"itemCards"+i} className="col-sm-4">
          <Card>
            <Card.Img variant="top" src={entry.image} />
              <Card.Body>
                <Card.Title as="h3">{entry.name}</Card.Title>
                <Card.Subtitle>{entry.price}</Card.Subtitle>
                <div className="card-text">
                  {entry.description}
                </div>
              </Card.Body>
              <Card.Footer style={{backgroundColor:"#FFFFFF", textAlign:"center"}}>
                {
                  (entry.modGroups.length>0) ?
                  (<MenuItemModal key={"modal_"+i} itemName={entry.name} price={entry.price} modGroups={entry.modGroups}/>) : (<Button className="btn-brand" >Add to order</Button>)
                }
              </Card.Footer>
            </Card>
          </div>
        )
      });
    } else {
      return <></>;
    }
  }
}
export default MenuItem;
