import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import MenuItemModal from './MenuItemModal';
import PropTypes from 'prop-types';
import { CartCss } from '../../utils';
import Modal from 'react-bootstrap/Modal';
import { CardList } from 'react-bootstrap-icons';

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      showNutrition: false,
      nutritional: {},
    };
  }

  handleClose() {
    this.setState({
      showNutrition: false,
      nutritional:{},
    });
  }

  handleShow(nutritional) {
    this.setState({
      showNutrition: true,
      nutritional: nutritional,
    });
  }

  render() {
    if (this.props.items && this.props.items.length) {
      return (<>
        <CartCss />
        <Modal show={this.state.showNutrition} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title as="h2">{this.state.nutritional.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <div>
              <div><span class="nutrition-item-label">Protein</span> <span class="nutrition-item">{this.state.nutritional.PR}</span></div>
              <div><span class="nutrition-item-label">Calories</span> <span class="nutrition-item">{this.state.nutritional.Cal}</span></div>
              <div><span class="nutrition-item-label">Total Fat</span> <span class="nutrition-item">{this.state.nutritional.TF}</span></div>
              <div class="indent-value"><span class="nutrition-item-label">Saturated Fat</span> <span class="nutrition-item">{this.state.nutritional.SF}</span></div>
              <div class="indent-value"><span class="nutrition-item-label">Trans Fat</span> <span class="nutrition-item">{this.state.nutritional.TRF}</span></div>
              <div><span class="nutrition-item-label">Cholesterol</span> <span class="nutrition-item">{this.state.nutritional.CHO}</span></div>
              <div><span class="nutrition-item-label">Sodium</span> <span class="nutrition-item">{this.state.nutritional.SOD}</span></div>
              <div><span class="nutrition-item-label">Net Carbs</span> <span class="nutrition-item">{this.state.nutritional.NC}</span></div>
              <div><span class="nutrition-item-label">Total Carbs</span> <span class="nutrition-item">{this.state.nutritional.TC}</span></div>
              <div class="indent-value"><span class="nutrition-item-label">Dietary Fiber</span> <span class="nutrition-item">{this.state.nutritional.DF}</span></div>
              <div class="indent-value"><span class="nutrition-item-label">Sugars</span> <span class="nutrition-item">{this.state.nutritional.SG}</span></div>
          </div>
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClose}>
            Close
          </Button>
          </Modal.Footer>
        </Modal>
        {this.props.items
          .filter((item) => item.price !== '0.00')
          .sort((a, b) => (a.sort > b.sort ? 1 : -1))
          .map((entry, i) => {
            return (
              <>
              <div key={'itemCards' + i} className="col-sm-4">
                <Card key={'itemCard' + i}>
                  <Card.Img variant="top" src={entry.image} key={'itemCardImage' + i} />
                  <Card.Body>
                    <Card.Title><h3>{entry.name}</h3></Card.Title>
                    <Card.Subtitle>{entry.price}</Card.Subtitle>
                    {entry.description ? (
                    <div className="card-text" style={{ height: '150px' }}>
                    {entry.description}
                    <br/>
                    {entry.nutritional ? (
                      <div style={{textAlign:"right"}}>
                        <a href="#" style = {{ color: '#F36C21' }} title="View full nutritional information" onClick={() => {let n = JSON.parse(entry.nutritional); n.name = entry.name; this.handleShow(n);}} ><CardList /></a>
                      </div>
                    ):(<></>)}
                    </div>
                ):(<></>)}
                </Card.Body>
                  <Card.Footer style={{ backgroundColor: '#FFFFFF', textAlign: 'center' }}>
                      <MenuItemModal key={'modal_' + i} itemName={entry.name} price={entry.price} modGroups={entry.modGroups} guid={this.props.menuGUID + "/" + entry.guid}/>
                  </Card.Footer>
                </Card>
              </div>
              </>
            );
          }
        )}
      </>)} else {
        return <></>;
    }
  }
}

MenuItem.propTypes = {
  items: PropTypes.array.isRequired
};

export default MenuItem;
