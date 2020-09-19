import React from 'react';
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import "react-web-tabs/dist/react-web-tabs.css";

class MenuItemModal extends React.Component {
  constructor(props) {
    super(props);
    this.handleShow = this.handleShow.bind(this);
  	this.handleClose = this.handleClose.bind(this);
		this.state = {
			show: false,
		};
  }
  handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}
  render() {
    console.log(this.props.modGroups)
    return (
      <>
      <Button className="btn btn-brand" onClick={this.handleShow} >Add to order</Button>
        <Modal show={this.state.show} onHide={this.handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title as="h2">{this.props.itemName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <Tabs defaultTab="mod-tab-0" vertical className="vertical-tabs">
            <TabList >
            {this.props.modGroups.length && this.props.modGroups.filter((itemMod) => itemMod.sort!==null).sort((a,b) => a.sort > b.sort).map((entry, i) => {
            return (
              <Tab tabFor={"mod-tab-"+i} style={{textAlign:"left"}}>
                <div className="modTabHeader">{entry.modGroup}</div>
                {
                  (entry.minSelections>0) ?(<div className="card__subheading">Required</div>) : (<></>)
                }
              </Tab>
            );
          })
        }
            </TabList>
            {this.props.modGroups.length && this.props.modGroups.filter((itemMod) => itemMod.sort!==null).sort((a,b) => a.sort > b.sort).map((entry, i) => {
            return (
              <TabPanel tabId={"mod-tab-"+i}>
              {entry.mods.length && entry.mods.map((choice, ia) => {
                  return (
                    <div>{choice.modifier}</div>
                    (choice.price!=="0.00") ?(<div className="card__subheading">{"+"+choice.price}</div>) : (<></>)
                  );
                })
              }
              </TabPanel>
            );
          })
        }
          </Tabs>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}
export default MenuItemModal;
