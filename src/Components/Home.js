
import React from 'react';
// eslint-disable-next-line
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import BeatLoader from 'react-spinners/ClipLoader';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import Location from './Location';
import { Marker } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '600px'
};
const center = {
  lat: 41.881832,
  lng: -87.623177
};

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      API: props.API,
      error: "",
      locations_loaded: false,
      locations: {}
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.locations.length !== this.props.locations.length) {
      this.setState({
        locations: this.props.locations
      });
    }
  }

  setError = (e) => {
    this.setState({
      error: e
    });
  }

  NoMatch = ({ location }) => (
    <div className="error">Could not find <code>{location.pathname.substring(1)}</code></div>
  )

  render = () => {
    if (this.state.error) {
      return <div className="error">{this.state.error}</div>;
    }
    if (this.state.locations.length && this.props.Config) {
      return (
        <div className="main-content" style={{paddingTop: '1em'}}>
          <div className="row" className="mapContainer">
            <div className="col-sm-2" style={{ height: '600px'}}>
              <h2 style={{height: '50px'}}>Locations</h2>
              <div className="locationList" style={{ height: '500px',overflowY : 'auto'}}>
              {this.state.locations.map((entry, i) => <Location key={"location_"+i} location={entry}/>)}
              </div>
            </div>
            <div className="col-sm-10" style={{ height: '600px'}}>
            <LoadScript googleMapsApiKey={this.props.Config['mapAPI']}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
        >
          {this.state.locations.map((entry, i) => {
            return <Marker key={"marker_"+i}
            position={  {
              lat: parseFloat(entry.lat),
              lng: parseFloat(entry.long)
            }}
            icon="/assets/images/38638pbkmrk.png"
            />
          }
          )}
        </GoogleMap>
      </LoadScript>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className='sweet-loading'>
          <BeatLoader sizeUnit={"px"} size={150} color={'#123abc'} loading={!this.state.locations.length} />
        </div>
      );
    }
  }
}

export default Home;
