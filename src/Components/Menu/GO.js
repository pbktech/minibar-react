import React from 'react';
import { Redirect } from 'react-router-dom';

// eslint-disable-next-line react/prefer-stateless-function
class GO extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    return <Redirect from={'/'} to={'/order/go/' + this.props.match.params.service} />;
  }
}

export default GO;
