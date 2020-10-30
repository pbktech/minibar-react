import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Check, Pencil, Trash, X } from 'react-bootstrap-icons';
import Input from 'react-phone-number-input/input';
import { formatPhoneNumber } from 'react-phone-number-input';
import Modal from 'react-bootstrap/Modal';
import { AddressLayout } from '../Common/AddressLayout';
import React from 'react';

<Container>
    <Row>0
        <h3>Personal Information</h3>
    </Row>
    <Row>
        <Col>
            <Row>
                <div style={{fontWeight:"bold"}}>
                    {this.state.guestNameShow  ?
                        (<>
                            <Form.Group style={{ width: '100%' }}  as={Row}>
                                <Form.Label style={{fontWeight:"bold"}}>Your name</Form.Label>
                                <input type={"text"} name={"guestName"} onChange={this.handleChange} value={this.state.guestName} className={"form-control"} />
                                <Button variant={'link'} style={{color:"#28a745"}} onClick={this.updateGuest("guestName")}><Check size={18} data-name={"guestName"} /></Button>
                                <Button variant={'link'} style={{color:"#dc3545"}} onClick={this.handleClose}  data-name={"guestNameShow"}><X size={18}  data-name={"guestNameShow"}/></Button>
                            </Form.Group>
                        </>):
                        (<>{ this.props.loggedIn.guestName } <Button variant={'link'} style={{color:"#000000"}} onClick={this.handleShow}  data-name={"guestNameShow"}><Pencil size={18}  data-name={"guestNameShow"} /></Button></>)
                    }
                </div>
            </Row>
            <Row>
                <div style={{fontWeight:"bold"}}>
                    {this.state.phoneShow  ?
                        (<>
                            <Form.Group style={{ width: '100%' }}  as={Row}>
                                <Form.Label style={{fontWeight:"bold"}}>Phone Number</Form.Label>
                                <Input
                                    className="form-control"
                                    country="US"
                                    value={this.state.phoneNumber}
                                    onChange={this.handlePhone} />
                                <Button variant={'link'} style={{color:"#28a745"}}><Check size={18} data-name={"phone"} /></Button>
                                <Button variant={'link'} style={{color:"#dc3545"}} onClick={this.handleClose}  data-name={"phoneShow"}><X size={18} data-name={"phoneShow"}/></Button>
                            </Form.Group>
                        </>):
                        (<>{formatPhoneNumber('+1' + this.props.loggedIn.phone)}  <Button variant={'link'} style={{color:"#000000"}} onClick={this.handleShow} data-name={"phoneShow"}><Pencil size={18}  data-name={"phoneShow"} /></Button></>)
                    }
                </div>
            </Row>
            <Row>
                <div style={{fontWeight:"bold"}}>
                    {this.state.emailShow  ?
                        (<>
                            <Form.Group style={{ width: '100%' }}  as={Row}>
                                <Form.Label style={{fontWeight:"bold"}}>Email Address</Form.Label>
                                <input type={"text"} name={"email"} onChange={this.handleChange} value={this.state.email} className={"form-control"} />
                                <Button variant={'link'} style={{color:"#28a745"}}><Check size={18} data-name={"email"} /></Button>
                                <Button variant={'link'} style={{color:"#dc3545"}} onClick={this.handleClose} data-name={"emailShow"}><X size={18} data-name={"emailShow"}/></Button>
                            </Form.Group>
                        </>):
                        (<>{this.props.loggedIn.email}  <Button variant={'link'} style={{color:"#000000"}} onClick={this.handleShow} data-name={"emailShow"}><Pencil size={18}  data-name={"emailShow"} /></Button></>)
                    }
                </div>
            </Row>
            <Row>
                <Button variant={"link"} data-name="passwordShow" onClick={this.handleShow}>
                    Change Password
                </Button>
                <Modal data-name="passwordShow"  show={this.state.passwordShow} onHide={this.handleClose} >
                    <Modal.Header ><Modal.Title as="h2">Change Password</Modal.Title></Modal.Header>
                    <Modal.Body>
                        {this.newPasswordForm()}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={"secondary"} data-name="passwordShow"  onClick={this.handleClose}>Cancel</Button>
                        <Button variant={"brand"} onClick={this.addAddress}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </Row>
        </div>
    </Col>

    <Col>
        <h3>Address Manager</h3>
        <div style={{height:"400px"}}>
            <Row>
                <Button variant={"link"} data-name="addressShow" onClick={this.handleShow}>
                    Add an address
                </Button>
                <Modal show={this.state.addressShow} onHide={this.handleClose} >
                    <Modal.Header ><Modal.Title as="h2">Add an address</Modal.Title></Modal.Header>
                    <Modal.Body>
                        <AddressLayout setAddress={this.setAddress} state={"Illinois"} address={this.state.address}/>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant={"secondary"} data-name="addressShow"  onClick={this.handleClose}>Cancel</Button>
                        <Button variant={"brand"} onClick={this.addAddress}>Save</Button>
                    </Modal.Footer>
                </Modal>
            </Row>
            <Row>
                <div style={{maxHeight:"400px", overflowY:"auto", width:"50%"}}>
                    {this.props.loggedIn.addresses.length && this.props.loggedIn.addresses.map((entry, i) => {
                        return (
                            <div key={'option' + i} className="mb-3">
                                <Col className="col-sm-9" key={i}>
                                    {entry.street}<br/>{entry.city}, {entry.state}
                                </Col>
                                <Col className="col-sm-3">
                                    <Button variant={"link"}>
                                        <Trash data-index={i} />
                                    </Button>
                                </Col>
                            </div>
                        );
                    })

                    }
                </div>
            </Row>
        </div>
    </Col>
</Row>
</Container>
</Row>
</Container>
