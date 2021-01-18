import React from 'react';
import PropTypes from 'prop-types';
import Modal from 'react-bootstrap/Modal';
import Home from '../Home';
import Button from 'react-bootstrap/Button';

// eslint-disable-next-line react/prefer-stateless-function
class ReceiptModal extends React.Component {
  render() {
    return (
      <Modal show={this.props.receiptShow} size="lg">
        <Modal.Body>
          <Home guid={this.props.receiptGUID} />
        </Modal.Body>
        <Modal.Footer>
          <Button variant={'secondary'} data-name="receiptShow" onClick={this.props.closeReceipt}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}


ReceiptModal.propTypes = {
  receiptGUID: PropTypes.string,
  receiptShow: PropTypes.string,
  closeReceipt: PropTypes.func,
};

export default ReceiptModal;
