import { formatPhoneNumber } from 'react-phone-number-input';
import Input from 'react-phone-number-input/input';
import Row from 'react-bootstrap/Row';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Check, Pencil, At, PersonCircle, Telephone, Trash, X } from 'react-bootstrap-icons';
import React from 'react';
import { removeAddress, setLoginObject } from '../../redux/actions/actions';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import InputGroup from 'react-bootstrap/InputGroup';
import ButtonToolbar from 'react-bootstrap/ButtonToolbar';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import * as utils from '../Common/utils';

class Personal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
    this.handlePhone = this.handlePhone.bind(this);
    this.switchIcon = this.switchIcon.bind(this);
    this.switchField = this.switchField.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.updatePersonal = this.updatePersonal.bind(this);
    this.handleShow = this.handleShow.bind(this);
    this.handleHide = this.handleHide.bind(this);
    this.switchFormat = this.switchFormat.bind(this);

    const Config = require('../../config.json');

    this.state = {
      Config,
      API: Config.apiAddress,
      show: false,
      name: '',
    };
  }

  handleShow() {
    this.setState({
      show: true,
    });
  }

  handleHide() {
    this.setState({
      show: false,
      name: '',
    });
  }

  handleChange(e) {
    const name = e.target.name;
    const value = (e.target.type === 'checkbox') ? e.target.checked : e.target.value;

    const newState = {};

    newState[name] = value;
    this.setState(newState);
  }

  handlePhone(newValue) {
    this.setState({
      name: newValue,
    });
  }

  switchIcon(name) {
    switch (name) {
      case 'real_name1':
        return <PersonCircle size={18} />;
        break;
      case 'email_address':
        return <At size={18} />;
        break;
      case 'phone_number':
        return <Telephone size={18} />;
        break;
    }
  }

  switchField(name) {
    switch (name) {
      case 'real_name1':
        return <input type={'text'} name={'name'} onChange={this.handleChange} value={this.state.name} className={'form-control'} />;
        break;
      case 'email_address':
        return <input type={'text'} name={'name'} onChange={this.handleChange} value={this.state.name} className={'form-control'} />;
        break;
      case 'phone_number':
        return <Input className="form-control" country="US" value={this.state.name} onChange={this.handlePhone} />;
        break;
    }
  }

  switchFormat(name) {
    switch (name) {
      case 'phone_number':
        return formatPhoneNumber(this.props.name);
        break;
      default:
        return this.props.name;
    }
  }

  updatePersonal(e) {
    const error = [];
    const confirm = {
      f: 'updatePersonal',
      field: this.props.target,
      session: this.props.loggedIn.sessionID,
      newValue: this.state.name,
    };

    utils.ApiPostRequest(this.state.API + 'auth', confirm).then((data) => {
      if (data) {
        if (data.status && data.status === 200) {
          const loggedIn = { ...this.props.loggedIn };

          loggedIn[this.props.fieldName] = this.state.name;

          this.props.setLoginObject(loggedIn);
          this.handleHide();
        } else {
          error.push({ msg: data.msg, variant: 'danger' });
        }
      } else {
        error.push({ msg: 'An unexpected error occurred.', variant: 'danger' });
      }

      this.setState({
        error,
      });
    });
  }

  render() {
    return (
      <div style={{ fontWeight: 'bold' }}>
        {this.state.show
          ? (<>
            <Form.Group style={{ width: '100%' }} as={Row}>
              <Form.Label style={{ fontWeight: 'bold' }}>{this.props.label}</Form.Label>
              <InputGroup>
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroupPrepend">
                    {this.switchIcon(this.props.target)}
                  </InputGroup.Text>
                </InputGroup.Prepend>
                {this.switchField(this.props.target)}
                <ButtonToolbar aria-label="Toolbar with button groups">
                  <ButtonGroup aria-label="Basic example">
                    <Button variant={'link'} style={{ color: '#28a745' }} onClick={this.updatePersonal}><Check size={18} /></Button>
                    <Button variant={'link'} style={{ color: '#dc3545' }} onClick={this.handleHide}><X size={18} /></Button>
                  </ButtonGroup>
                </ButtonToolbar>
              </InputGroup>
            </Form.Group>
          </>)
          : (<>{this.switchFormat(this.props.target)} <Button variant={'link'} style={{ color: '#000000' }} onClick={this.handleShow}><Pencil size={18} /></Button></>)
        }
      </div>

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
    },
    removeAddress: (item) => {
      dispatch(removeAddress(item));
    },
  };
};

Personal.propTypes = {
  loggedIn: PropTypes.object,
  setLoginObject: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Personal);
