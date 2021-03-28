import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import MenuItemModal from './MenuItemModal';
import PropTypes from 'prop-types';
import { CartCss } from '../Common/utils';
import Modal from 'react-bootstrap/Modal';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger'
import Tooltip from 'react-bootstrap/Tooltip'

class MenuItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.renderTooltip = this.renderTooltip.bind(this);

    this.state = {
      showNutrition: false,
      nutritional: {},
    };
  }

  handleClose() {
    this.setState({
      showNutrition: false,
      nutritional: {},
    });
  }

  renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      View full nutritional information
    </Tooltip>
  );

  handleShow(nutritional) {
    this.setState({
      showNutrition: true,
      nutritional,
    });
  }

  render() {
    if (!!this.props.items && this.props.items.length) {
      return (<>
        <CartCss />
        <Modal show={this.state.showNutrition} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title as="h2">{this.state.nutritional.name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <div><span className="nutrition-item-label">Protein</span> <span className="nutrition-item">{this.state.nutritional.PR}</span></div>
              <div><span className="nutrition-item-label">Calories</span> <span className="nutrition-item">{this.state.nutritional.Cal}</span></div>
              <div><span className="nutrition-item-label">Total Fat</span> <span className="nutrition-item">{this.state.nutritional.TF}</span></div>
              <div className="indent-value"><span className="nutrition-item-label">Saturated Fat</span> <span className="nutrition-item">{this.state.nutritional.SF}</span></div>
              <div className="indent-value"><span className="nutrition-item-label">Trans Fat</span> <span className="nutrition-item">{this.state.nutritional.TRF}</span></div>
              <div><span className="nutrition-item-label">Cholesterol</span> <span className="nutrition-item">{this.state.nutritional.CHO}</span></div>
              <div><span className="nutrition-item-label">Sodium</span> <span className="nutrition-item">{this.state.nutritional.SOD}</span></div>
              <div><span className="nutrition-item-label">Net Carbs</span> <span className="nutrition-item">{this.state.nutritional.NC}</span></div>
              <div><span className="nutrition-item-label">Total Carbs</span> <span className="nutrition-item">{this.state.nutritional.TC}</span></div>
              <div className="indent-value"><span className="nutrition-item-label">Dietary Fiber</span> <span className="nutrition-item">{this.state.nutritional.DF}</span></div>
              <div className="indent-value"><span className="nutrition-item-label">Sugars</span> <span className="nutrition-item">{this.state.nutritional.SG}</span></div>
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
            let itemImage;

            if (entry.image) {
              itemImage = entry.image;
            } else {
              itemImage = '/assets/images/default.png';
            }
            return (

              <>
                <div key={'itemCards' + i} className="col-sm-4">
                  <Card key={'itemCard' + i}>
                    <Card.Img variant="top" src={itemImage} key={'itemCardImage' + i} />
                    <Card.Body>
                      <Card.Title><h3>{entry.name}</h3></Card.Title>
                      <Card.Subtitle>{entry.price}</Card.Subtitle>
                      {entry.description ? (
                        <div className="card-text" style={{ height: '150px', fontFamily: 'Lora' }}>
                          {entry.description}
                          <br />
                          {
                            entry.nutritional ? (

                              <div style={{ textAlign: 'right', bottom: '55px', right: '10px', position: 'absolute' }}>
                                <OverlayTrigger
                                  placement="bottom"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={this.renderTooltip} >
                                  <Button
                                    variant="link" title="" onClick={() => {
                                      const n = JSON.parse(entry.nutritional);

                                      n.name = entry.name;
                                      this.handleShow(n);
                                    }}>{entry.nutritionalShort}</Button>
                                </OverlayTrigger>
                              </div>
                            ) : (<></>)}
                        </div>
                      ) : (<></>)}
                    </Card.Body>
                    <Card.Footer style={{ backgroundColor: '#FFFFFF', textAlign: 'center' }}>
                      <MenuItemModal key={'modal_' + i} itemName={entry.name} price={entry.price} modGroups={entry.modGroups} guid={this.props.menuGUID + '/' + entry.guid} />
                    </Card.Footer>
                  </Card>
                </div>
              </>
            );
          }
          )}
      </>);
    }
    return <></>;
  }
}

MenuItem.propTypes = {
  items: PropTypes.array.isRequired,
  menuGUID: PropTypes.string.isRequired,
};

export default MenuItem;
