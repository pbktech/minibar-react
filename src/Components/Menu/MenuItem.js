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
        return this.props.items.filter((item) => item.price!=="0.00").map((entry, i) => {
        return (
          <div className="col-sm-4">
          <Card>
          <Card.Img variant="top" src={entry.image} />
            <Card.Body>
              <Card.Title as="h3">{entry.name}</Card.Title>
              <Card.Subtitle>{entry.price}</Card.Subtitle>
              <Card.Text>
                {entry.description}
              </Card.Text>
               <Card.Footer style={{backgroundColor:"#FFFFFF", textAlign:"center"}}>
                <MenuItemModal />
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
