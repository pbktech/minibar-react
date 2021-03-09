import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import * as utils from './Components/Common/utils.js';
import './bootstrap.css';
import ReactGA from 'react-ga';
import LocationFinder from './Components/LocationFinder.js';
import Home from './Components/Home.js';
import Order from './Components/Order.js';
import Menu from './Components/Menu/Menu.js';
import GO from './Components/Menu/GO.js';
import Checkout from './Components/Checkout.js';
import Account from './Components/Account.js';
import Payment from './Components/Payment.js';
import Group from './Components/Group.js';
import './App.css';
import './pbk.css';
import Header from './Components/Common/Header.js';
import HeadSpacer from './Components/Common/HeadSpacer.js';
import { setLocations, setConfig } from './redux/actions/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Subscribe from './Components/Subscribe.js';

class App extends React.Component {
  constructor(props) {
    super(props);
    const Config = require('./config.json');

    this.props.setConfig(Config);
    this.state = {
      apiRequested: false,
    };
  }

  componentDidUpdate() {
    if (this.props.config && this.props.config.apiAddress && !this.state.apiRequested) {
      this.setState({
        apiRequested: true,
      }, () => {
        utils.ApiRequest(this.props.config.apiAddress).then((data) => {
          if (data.locations) {
            this.setState({
              locations: data.locations,
            });
            this.props.setLocations(data.locations);
          } else {
            this.setState({
              message: <div className="error">Sorry, an unexpected error occurred</div>,
            });
          }
        })
          .catch(() => {
            this.setState({
              message: <div className="error">Sorry, an unexpected error occurred</div>,
            });
          });
      });
    }
  }

  NoMatch(match) {
    return (
      <div className="error">
        Could not find <code>{match.location.pathname.substring(1)}</code>
      </div>
    );
  }

  render() {
    let hideHeader = '';
    const params = new URLSearchParams(window.location.search);
    const domain = window.location.hostname;

    if (params.has('print') || params.has('nohead')) {
      if (params.has('print')) {
        hideHeader = <>{window.print()} {window.close()}</>;
      } else {
        hideHeader = <></>;
      }
    }
    ReactGA.initialize(this.props.config['ga-tag']);

    ReactGA.pageview(window.location.pathname + window.location.search);
    if (domain === 'pbkgrouporder.com' || domain === 'www.pbkgrouporder.com') {
      return (
        <Router>
          {hideHeader ? (hideHeader) : (<><Header /><HeadSpacer /></>)}
          <Switch>
            <Route
              exact strict path={'/'} render={({ match }) => (
                <Group match={match} />
              )} />
            <Route
              path={'/order/:miniBar/:service'} render={({ match }) => (
                <Menu match={match} />
              )} />
            <Route
              path={'/go/:service'} render={({ match }) => (
              // eslint-disable-next-line react/jsx-pascal-case
                <GO match={match} />
              )} />
            <Route
              path={'/order/:miniBar'} render={({ match }) => (
                <Order match={match} />
              )} />
            <Route
              path={'/order/'} render={() => (
                <LocationFinder />
              )} />
            <Route
              path={'/forgotpass/:linkHEX'} render={({ match }) => (
                <Account match={match} />
              )} />
            <Route
              path={'/account/'} render={({ match }) => (
                <Account match={match} />
              )} />
            <Route
              path={'/checkout'} render={({ match }) => (
                <Checkout match={match} />
              )} />
            <Route
              path={'/group'} render={({ match }) => (
                <Group match={match} />
              )} />
            <Route
              path={'/receipt/:guid'} render={({ match }) => (
                <Home match={match} />
              )} />
            <Route
              path={'/receipt/:guid'} render={({ match }) => (
                <Home Config={this.state.Config} match={match} API={this.state.API} />
              )} />
            <Route
              path={'/payment/:guid'} render={({ match }) => (
                <Payment Config={this.state.Config} match={match} API={this.state.API} />
              )} />
            <Route
              path={'/receipt/'} render={({ match }) => (
                <Home Config={this.state.Config} match={match} API={this.state.API} />
              )} />
            <Route render={(match) => this.NoMatch(match)} />
          </Switch>
        </Router>
      );
    }
    return (
      <Router>
        {hideHeader ? (hideHeader) : (<><Header /><HeadSpacer /></>)}
        <Switch>
          <Route
            exact strict path={'/'} render={({ match }) => (
              <LocationFinder match={match} />
            )} />
          <Route
            exact strict path={'/subscribe'} render={({ match }) => (
              <Subscribe match={match} />
            )} />
          <Route
            path={'/confirm/:linkHEX'} render={({ match }) => (
              <LocationFinder match={match} />
            )} />
          <Route
            path={'/order/:miniBar/:service'} render={({ match }) => (
              <Menu match={match} />
            )} />
          <Route
            path={'/go/:service'} render={({ match }) => (
              // eslint-disable-next-line react/jsx-pascal-case
              <GO match={match} />
            )} />
          <Route
            path={'/order/:miniBar'} render={({ match }) => (
              <Order match={match} />
            )} />
          <Route
            path={'/order/'} render={() => (
              <LocationFinder />
            )} />
          <Route
            path={'/forgotpass/:linkHEX'} render={({ match }) => (
              <Account match={match} />
            )} />
          <Route
            path={'/account/'} render={({ match }) => (
              <Account match={match} />
            )} />
          <Route
            path={'/checkout'} render={({ match }) => (
              <Checkout match={match} />
            )} />
          <Route
            path={'/group'} render={({ match }) => (
              <Group match={match} />
            )} />
          <Route
            path={'/receipt/:guid'} render={({ match }) => (
              <Home match={match} />
            )} />
          <Route
            path={'/receipt/:guid'} render={({ match }) => (
              <Home Config={this.state.Config} match={match} API={this.state.API} />
            )} />
          <Route
            path={'/payment/:guid'} render={({ match }) => (
              <Payment Config={this.state.Config} match={match} API={this.state.API} />
            )} />
          <Route
            path={'/receipt/'} render={({ match }) => (
              <Home Config={this.state.Config} match={match} API={this.state.API} />
            )} />
          <Route render={(match) => this.NoMatch(match)} />
        </Switch>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    locations: state.locations,
    config: state.config,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setLocations: (loggedIn) => {
      dispatch(setLocations(loggedIn));
    },
    setConfig: (config) => {
      dispatch(setConfig(config));
    },
  };
};

App.propTypes = {
  locations: PropTypes.array.isRequired,
  setLocations: PropTypes.func.isRequired,
  config: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
