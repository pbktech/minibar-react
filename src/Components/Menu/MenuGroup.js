import React from 'react';
import Button from 'react-bootstrap/Button';
import MenuItem from './MenuItem';
import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';
import { CartCss } from '../../utils';
import Fade from 'react-bootstrap/Fade'

class MenuGroup extends React.Component {
  constructor(props) {
    super(props);
    this.handleSwitch = this.handleSwitch.bind(this);
    this.state = {
      activeTab:0,
      show:true,
    };
  }
  handleSwitch(tab){
    this.setState({
      activeTab: tab,
     });
  }
  render() {
    let tabsVariant = 'tabs';
    return (
      <>
      <CartCss />
      <Container id="top">
        <div className="tabs" style={{ paddingTop: '1em' }}>
          <ul className="tabs-nav">
            {this.props.menuGroups.length && this.props.menuGroups
              .sort((a, b) => (a.sort > b.sort ? 1 : -1))
              .map((entry, i) => {
                if(this.state.activeTab===i){ tabsVariant +=" active"}
                console.log(tabsVariant)
                return (
                  <li key={'groupli' + i}>
                    <Button key={'group' + i} variant={"tabs"} onClick={() => this.handleSwitch(i)} >
                      {entry.name}
                    </Button>
                  </li>
                );
              })}
          </ul>
        </div>
        {this.props.menuGroups.length && this.props.menuGroups.map((entry, i) => {
          if(this.state.activeTab===i){
          return (
            <Fade in={this.state.show}>
            <div key={'item' + i} className="container-fluid" style={{ paddingTop: '1em', paddingBottom: '1em' }}>
              <h2 id={entry.name.replaceAll(' ', '')}>{entry.name}</h2>
              <div className="row">
                <MenuItem key={'menuitems_' + i} items={entry.menuItems} menuGUID={entry.guid}/>
              </div>
            </div>
            </Fade>
          );}
        })}
      </Container>
      </>
    );
  }
}

MenuGroup.propTypes = {
  menuGroups: PropTypes.array.isRequired,
};

export default MenuGroup;
