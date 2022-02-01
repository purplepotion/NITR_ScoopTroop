import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { consentRequest } from '../actions/user.actions';

const Popup = ({ show, handleClose, notificationId }) => {
  const [securityCode, setSecurityCode] = useState('');
  const dispatch = useDispatch();

  const userConsent = useSelector((state) => state.userConsent);
  const { loading: loadingConsent } = userConsent;

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(consentRequest(notificationId, true, securityCode));
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={submitHandler}>
        <Modal.Header closeButton>
          <Modal.Title>Approve Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId='patientId'>
            <Form.Label>Please enter your security code.</Form.Label>
            <Form.Control
              type='text'
              placeholder='Security Code'
              value={securityCode}
              onChange={(e) => setSecurityCode(e.target.value)}
            ></Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            Close
          </Button>
          <Button
            type='submit'
            variant='primary'
            onClick={handleClose}
            loading={loadingConsent}
          >
            {loadingConsent ? (
              <Spinner animation='border' size='sm' />
            ) : (
              'Submit'
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default Popup;
