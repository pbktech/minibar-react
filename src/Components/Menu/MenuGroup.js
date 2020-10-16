import React from 'react';
import MenuItem from './MenuItem';
import Container from 'react-bootstrap/Container';
import PropTypes from 'prop-types';
import { CartCss } from '../../utils';
import Fade from 'react-bootstrap/Fade'
import Button from 'react-bootstrap/Button';

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
    return (
      <>
      <CartCss />
      <Container id="top">
        <nav className="site-nav" style={{textAlign:"left", paddingTop:"1em"}}>
           <ul className="site-nav-menu">
            {this.props.menuGroups.length && this.props.menuGroups
              .sort((a, b) => (a.sort > b.sort ? 1 : -1))
              .map((entry, i) => {
                let style = {color: '#000000'};
                if(this.state.activeTab===i){
                  style = { color: '#F36C21' };
                }
                return (
                  <li key={'groupli' + i} style={{display: "inline-block"}}>
                    <Button variant="link" className={'site-nav-link'} style={style} onClick={() => this.handleSwitch(i)} >{entry.name}</Button>
                  </li>
                );
              })}
              {this.state.activeTab !== undefined && <li key='showAll' style={{display: "inline-block"}}><Button variant="link" className={'site-nav-link'} style={{color: '#000000'}} onClick={() => {this.setState({activeTab: undefined})}} href={"#"}>Show All</Button></li>}
          </ul>
        </nav>
        {this.props.menuGroups.length && this.props.menuGroups.map((entry, i) => {
          return (this.state.activeTab === undefined || this.state.activeTab === i) &&
            <Fade key={'itemfade_' + i} in={this.state.show}>
            <div key={'item_' + i} className="container-fluid" style={{ paddingTop: '1em', paddingBottom: '1em' }}>
              <h2 id={entry.name.replaceAll(' ', '')}>{entry.name}</h2>
              <div className="row">
                <MenuItem key={'menuitems_' + i} items={entry.menuItems} menuGUID={entry.guid} />
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
