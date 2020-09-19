import React from 'react';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import MenuItemModal from './MenuItemModal'

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
      if (this.props.items && this.props.items.length) {
        return this.props.items.filter((item) => item.price!=="0.00").sort((a,b) => a.sort > b.sort).map((entry, i) => {
        return (
          <div className="col-sm-4">
          <Card>
          <Card.Img variant="top" src={entry.image} />
            <Card.Body>
              <Card.Title as="h3">{entry.name}</Card.Title>
              <Card.Subtitle>{entry.price}</Card.Subtitle>
              <div className="card-text" style={{height:"150px"}}>
                {entry.description}
              </div>
               <Card.Footer style={{backgroundColor:"#FFFFFF", textAlign:"center"}}>
                {
                  (entry.modGroups.length>0) ?
                  (<MenuItemModal key={"modal_"+i} itemName={entry.name} modGroups={entry.modGroups}/>) : (<Button className="btn btn-brand" >Add to order</Button>)
                }

               </Card.Footer>
            </Card.Body>
            </Card>
            </div>
        )
        });
      }else {
        return <></>;
      }
      }
}
export default MenuItem;
