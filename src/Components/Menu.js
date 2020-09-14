import React from 'react';
//import DropdownButton from 'react-bootstrap/DropdownButton';
//import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
//import Col from 'react-bootstrap/Col'
//import Row from 'react-bootstrap/Row'
import Alert from 'react-bootstrap/Alert'
import MenuGroup from './MenuGroup';
import Card from 'react-bootstrap/Card'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
//import 'bootstrap/dist/css/bootstrap.min.css';

class Menu extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        error: false,
        location: {services:[]},
        menus:{}
      };
      this.componentDidUpdate({locations: {}, location: {services:[]}});
    }
    componentDidUpdate(prevProps) {
      if (prevProps.locations.length !== this.props.locations.length) {
        this.props.locations.map((entry, i) => {
            if (entry.link === this.props.match.params.miniBar) {
              this.setState({
                location: entry
              });
              entry.services.map((service,i) => {
                if(service.name === this.props.match.params.service){
                  this.setState({
                    menus: service.menus
                  });
                }
              })
            }
          });

          if (!this.state.location){
            this.setState({
              error: "Location Not Found"
            });
          }
      }
    }
  render() {
      return (
      <Container fluid>
        <Tabs defaultActiveKey="tab0" style={{paddingTop:"1em"}}>
        {this.state.menus.length && this.state.menus.map((entry, i) => {
          return (
            <Tab key={"tab_"+i} eventKey={"tab"+i} title={entry.menuName} className="">
              <MenuGroup key={"menuGroup_"+i} menuGroups={entry.menuGroups}/>
            </Tab>
          )
        })
      }
        </Tabs>
      </Container>
    );
  }

}
export default Menu;
