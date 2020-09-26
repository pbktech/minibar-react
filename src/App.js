import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import * as utils from './utils.js';
import './bootstrap.css';
import ReactGA from 'react-ga';
import LocationFinder from './Components/LocationFinder.js';
import Home from './Components/Home.js';
import Order from './Components/Order.js';
import Menu from './Components/Menu/Menu.js';
import Checkout from './Components/Checkout.js';
import { Provider } from 'react-redux';
import store from './redux/store/store';
import './App.css';
import './pbk.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    const Config = require('./config.json');

    this.homeRef = {};
    this.state = {
      Config: Config,
      API: Config['apiAddress'],
      error: {},
      locations: {}
    }
  }

  componentDidMount() {
    utils.ApiRequest(this.state.API)
      .then(data => {
        if (data.locations) {
          this.setState({
            'locations': data.locations
            });
        }   else {
          this.setState({
              message: `<div className="error">Sorry, an unexpected error occurred</div>`
            });
        }
      })
      /*.catch((e) => {
        console.log(e);
        this.setState({
          error: e
        });
      }*/
  }

  render() {
    ReactGA.initialize(this.state.Config['ga-tag']);
    ReactGA.pageview(window.location.pathname + window.location.search);
    return (
      <Provider store={store}>
        <Router>
          <Switch>
            <Route exact strict path={`/`} render={({ match }) => <LocationFinder Config={this.state.Config} locations={this.state.locations} error={this.state.error} ref={(ref) => this.homeRef = ref} API={this.state.API} />} />
            <Route path={'/order/:miniBar/:service'} render={({ match }) => <Menu Config={this.state.Config} locations={this.state.locations} match={match} error={this.state.error} />} />
            <Route path={'/order/:miniBar'} render={({ match }) => <Order Config={this.state.Config} locations={this.state.locations} match={match} error={this.state.error} />} />
            <Route path={'/order/'} render={({ match }) => <LocationFinder Config={this.state.Config} locations={this.state.locations} error={this.state.error} ref={(ref) => this.homeRef = ref} API={this.state.API} />} />
            <Route path={'/checkout'} render={({ match }) => <Checkout Config={this.state.Config} locations={this.state.locations} match={match} error={this.state.error} />} />
            <Route path={'/findoutmore'} render={({ match }) => <Home Config={this.state.Config} locations={this.state.locations} error={this.state.error} ref={(ref) => this.homeRef = ref} API={this.state.API} />} />
          </Switch>
        </Router>
      </Provider>
    )
  }
}

export default App;
