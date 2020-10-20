import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import PropTypes from 'prop-types';
import * as utils from './Common/utils';

class Home extends React.Component {
  constructor(props) {
    super(props);
    const Config = require('../config.json');

    this.state = {
      Config,
      API: Config.apiAddress,
      show: false,
      order: {checks:[]},
    };
  }
  componentDidMount() {
    if (this.props.match.params.guid) {
      const confirm = { f: 'receipt',
        guid: this.props.match.params.guid,
      };
      console.log(confirm)
      utils.ApiPostRequest(this.state.API + 'checkout', confirm).then((data) => {
        if (data) {
          console.log(data)
          this.setState({
            order: data,
          });
        } else {
          this.setState({
            error: 'Sorry, an unexpected error occurred',
            variantClass: 'danger',
          });
        }
      });
    }
  }

  componentDidUpdate(prevProps) {
  }

  handleClose() {
    this.setState({ show: false });
  }

  handleShow() {
    this.setState({ show: true });
  }

  render() {
    return (
      <Container style={{ textAlign: 'center' }} >
        {this.state.order.minibar !== "" ? (
            <>
            <Row>
             <Col>
                <h2>Protein Bar & Kitchen</h2>
                  {this.state.order.minibar &&
                  <>{ 'Delivery on ' + this.state.order.delivery + ' to ' + this.state.order.minibar}</>}
               <hr />
             </Col>
           </Row>
              {this.state.order.checks.length && this.state.order.checks.map((check, i) => {
                return(
                    <>
                      <Row>
                        <Col>
                          {check.tab}
                        </Col>
                      </Row>
                      <Row>
                        <Col>
                          <div>
                            {check.items.length && check.items.map((item, ia) => {
                              return (
                              <>
                              <Row key={"cartItem_"+ia}>
                                <Col className="col-sm-9" key={ia}>
                                  <div>{item.quantity} {item.name}</div>
                                  <ul style={{ listStyleType: 'none' }}>
                                    {item.mods && item.mods.map((mod) => {
                                          return <li>{mod.modifier}</li>;
                                        })
                                    }
                                  </ul>
                                </Col>
                              </Row>
                              </>)
                              })
                            }
                          </div>
                        </Col>
                      </Row>

                    </>
                )
              })
              }
          </>
          ):(
              <><Alert variant={"warning"}>Your receipt was not found.</Alert></>
          )
        }
      </Container>
    );
  }
}

Home.propTypes = {
  locations: PropTypes.array.isRequired,
  API: PropTypes.string.isRequired,
};

export default Home;
