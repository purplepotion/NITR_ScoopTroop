import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Form, Button, Row, Col, Spinner } from 'react-bootstrap';

import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

import { register } from '../actions/user.actions';
import { USER_REGISTER_RESET } from '../constants/user.constants';

const RegisterScreen = ({ history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [userType, setUserType] = useState('');
  const [message, setMessage] = useState(null);
  const [affiliation, setAffiliation] = useState('');
  const [specialization, setSpecialization] = useState('');

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userRegister = useSelector((state) => state.userRegister);
  const { loading: loadingRegister, error: errorRegister } = userRegister;

  const redirect = '/profile';

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    } else {
      dispatch({ type: USER_REGISTER_RESET });
    }
  }, [history, dispatch, userInfo, redirect]);

  const submitHandler = (event) => {
    event.preventDefault();

    console.log('SIGNUP');

    if (name && email && password && confirmPassword) {
      if (password !== confirmPassword) {
        setMessage('Passwords do not match!');
      } else {
        dispatch(register(name, email, password, affiliation, specialization));
      }
    } else {
      setMessage('Please fill all the details!');
    }
  };

  /**
   * TODO: Age, Gender, Medical History
   */

  return (
    <>
      <FormContainer>
        <h1>Sign Up</h1>
        {message && <Message variant='danger'>{message}</Message>}
        {errorRegister && <Message variant='danger'>{errorRegister}</Message>}
        <Form onSubmit={submitHandler}>
          <Form.Group controlId='name'>
            {/* <Form.Label>Name</Form.Label> */}
            <Form.Control
              type='name'
              placeholder='Enter Name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='email' required>
            {/* <Form.Label>Email Address</Form.Label> */}
            <Form.Control
              type='email'
              placeholder='Enter Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='password'>
            {/* <Form.Label>Password</Form.Label> */}
            <Form.Control
              type='password'
              placeholder='Enter Password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='confirmPassword'>
            {/* <Form.Label>Confirm Password</Form.Label> */}
            <Form.Control
              type='password'
              placeholder='Confirm Password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='affiliation'>
            <Form.Control
              placeholder='Please enter your affiliation'
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
            ></Form.Control>
          </Form.Group>
          <Form.Group controlId='specialization'>
            <Form.Control
              type='specialization'
              placeholder='Please enter your specialization'
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary'>
            {loadingRegister ? (
              <Spinner animation='border' size='sm' />
            ) : (
              'Register'
            )}
          </Button>
        </Form>

        <Row className='py-3'>
          <Col>
            Have an Account?{' '}
            <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
              Login
            </Link>
          </Col>
        </Row>
      </FormContainer>
    </>
  );
};

export default RegisterScreen;
