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
      activeTab: undefined,
      show: true,
      activeCategory: null,
    };
  }
  handleSwitch(tab){
    this.setState({
      activeTab: tab,
      activeCategory:true,
     });
  }
  render() {
    let tabsVariant = 'tabs';
    return (
      <>
      <CartCss />
      <Container id="top">
        <nav className="site-nav" style={{textAlign:"left", paddingTop:"1em"}}>
           <ul className="site-nav-menu">
            {this.props.menuGroups.length && this.props.menuGroups
              .sort((a, b) => (a.sort > b.sort ? 1 : -1))
              .map((entry, i) => {
                let style = {};
                if(this.state.activeTab===i){
                  tabsVariant +=" active";
                  style = { color: '#F36C21' };
                }
                console.log(tabsVariant)
                return (
                  <li key={'groupli' + i} style={{display: "inline-block"}}>
                    <a className={'site-nav-link'} style={style} onClick={() => this.handleSwitch(i)} href={"#"}>{entry.name}</a>
                  </li>
                );
              })}
              {this.state.activeTab !== undefined && <li key='showAll' style={{display: "inline-block"}}><a onClick={() => {this.setState({activeTab: undefined})}} href={"#"}>Show All</a></li>}
          </ul>
        </nav>
        {this.props.menuGroups.length && this.props.menuGroups.map((entry, i) => {
          return (this.state.activeTab === undefined || this.state.activeTab === i) &&
            <Fade in={this.state.show}>
            <div key={'item' + i} className="container-fluid" style={{ paddingTop: '1em', paddingBottom: '1em' }}>
              <h2 id={entry.name.replaceAll(' ', '')}>{entry.name}</h2>
              <div className="row">
                <MenuItem key={'menuitems_' + i} items={entry.menuItems} menuGUID={entry.guid}/>
              </div>
            </div>
            </Fade>
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
