import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import {
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Toast,
  Container,
} from 'react-bootstrap';

import Message from '../components/Message';
import FormContainer from '../components/FormContainer';

import { register } from '../actions/user.actions';
import { USER_REGISTER_RESET } from '../constants/user.constants';

const RegisterScreen = ({ history }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [registered, setRegistered] = useState(false);
  // const [userType, setUserType] = useState('');
  const [message, setMessage] = useState(null);
  const [age, setAge] = useState();
  const [gender, setGender] = useState();
  const [medicalHistory, setMedicalHistory] = useState('');

  const [showA, setShowA] = useState(true);
  const toggleShowA = () => {
    setShowA(!showA);
    history.push(redirect);
  };

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userRegister = useSelector((state) => state.userRegister);
  const { loading: loadingRegister, error: errorRegister } = userRegister;

  const redirect = '/profile';

  useEffect(() => {
    if (userInfo) {
      setRegistered(true);
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
      } else if (age > 150 || age < 18) {
        setMessage('Please choose a reasonable age!');
      } else if (!gender) {
        setMessage('Please select a gender!');
      } else {
        dispatch(register(name, email, password, age, gender, medicalHistory));
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
      {registered ? (
        <Row className='justify-content-center'>
          <Toast
            show={showA}
            onClose={toggleShowA}
            className='d-flex flex-column justify-content-center align-items-center pb-2'
          >
            {/* <Toast.Header className='d-flex justify-content-end align-items-end'>
              <img
                src='holder.js/20x20?text=%20'
                className='rounded me-2'
                alt=''
              />
              <strong className='me-auto'>Bootstrap</strong>
              <small>11 mins ago</small>
            </Toast.Header> */}
            <Toast.Body className='d-flex flex-column justify-content-center align-items-center'>
              <p className='fs-5 text-center' style={{ fontSize: '1.5rem' }}>
                Please save your secret code given below for future reference.
              </p>
              <div
                className='bd-highlight text-dark p-2'
                style={{ fontSize: '2rem', backgroundColor: '#ededed' }}
              >
                {userInfo.secret}
              </div>
            </Toast.Body>
            <Button
              onClick={toggleShowA}
              className='mb-2 danger align-self-center'
              variant='primary'
            >
              Close
            </Button>
          </Toast>
        </Row>
      ) : (
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

            <Row className='justify-content-between'>
              <Col className='sm-6 mr-2 p-0'>
                <Form.Group controlId='gender'>
                  <Form.Control
                    as='select'
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option>Select Gender</option>
                    <option value='Male'>Male</option>
                    <option value='Female'>Female</option>
                    <option value='Non-Binary'>Non-Binary</option>
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col className='sm-6 p-0 ml-2'>
                <Form.Group controlId='age'>
                  <Form.Control
                    type='number'
                    placeholder='Enter Age'
                    min='18'
                    max='150'
                    onChange={(e) => setAge(e.target.value)}
                  ></Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId='medicalHistory'>
              <Form.Control
                as='select'
                onChange={(e) => setMedicalHistory(e.target.value)}
              >
                <option>Any existing medical conditions?</option>
                <option value='Allergies'>Allergies</option>
                <option value='Chronic Diseases'>Chronic Diseases</option>
                {/* <option value='3'>Other</option> */}
              </Form.Control>
            </Form.Group>

            {/* <Form.Group
          controlId='userType'
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          required
        >
          <div className='userType__input'>
            <Form.Label>User Type:</Form.Label>
            <Form.Check
              type='radio'
              label='Patient'
              name='userTypeRadios'
              id='patientRadio'
              value='patient'
            />
            <Form.Check
              type='radio'
              label='Health Official'
              name='userTypeRadios'
              id='healthOfficialRadio'
              value='healthOfficial'
              className='ml-2'
            />
          </div>
        </Form.Group> */}

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
      )}
    </>
  );
};

export default RegisterScreen;
