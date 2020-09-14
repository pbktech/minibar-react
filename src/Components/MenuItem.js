import React from 'react';
import Card from 'react-bootstrap/Card'
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render = () => {
console.log(this.props.items);
      if (this.props.items && this.props.items.length) {
        return this.props.items.map((entry, i) => {
          if(entry.price===0){return <></>;}
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
                <Button className="btn btn-brand">Add to order</Button>
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
