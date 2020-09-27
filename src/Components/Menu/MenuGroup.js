import React from 'react';
import Button from 'react-bootstrap/Button';
import MenuItem from './MenuItem';
import Container from 'react-bootstrap/Container';

class MenuGroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Container id="top">
        <div className="tabs" style={{ paddingTop: '1em' }}>
          <ul className="tabs-nav">
            {this.props.menuGroups.length &&
              this.props.menuGroups
                .sort((a, b) => (a.sort > b.sort ? 1 : -1))
                .map((entry, i) => {
                  return (
                    <li key={'groupli' + i}>
                      <Button
                        key={'group' + i}
                        className="btn btn-brand"
                        href={'#' + entry.name.replaceAll(' ', '')}
                      >
                        {entry.name}
                      </Button>
                    </li>
                  );
                })}
          </ul>
        </div>
        {this.props.menuGroups.length &&
          this.props.menuGroups.map((entry, i) => {
            return (
              <div key={'item' + i} className="container-fluid" style={{ paddingTop: '1em', paddingBottom: '1em' }}>
                <h2 id={entry.name.replaceAll(' ', '')}>{entry.name}</h2>
                <div className="row">
                  <MenuItem key={'menuitems_' + i} items={entry.menuItems} />
                </div>
              </div>
            );
          })}
      </Container>
    );
  }
}

export default MenuGroup;
