import React from 'react';
import { setLoginObject } from '../../redux/actions/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Container from 'react-bootstrap/Container';

class HouseAccount extends React.Component {
  constructor(props, context) {
    super(props, context);
    const Config = require('../../config.json');

    this.state = {
      Config,
      API: Config.apiAddress

    };
  }

  render() {
    return (
      <Container fluid style={{ padding: '1em' }}>
        <h2>Coming Soon</h2>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return { loggedIn: state.loggedIn };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLoginObject: (loggedIn) => {
      dispatch(setLoginObject(loggedIn));
    }
  };
};

HouseAccount.propTypes = {
  loggedIn: PropTypes.object,
  setLoginObject: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(HouseAccount);
