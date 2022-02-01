import React from 'react';
import { Container } from 'react-bootstrap';
import { HashRouter as Router, Route } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import AddRecordScreen from './screens/AddRecordScreen';
import AddPatientScreen from './screens/AddPatientScreen';
import PatientDetailsScreen from './screens/PatientDetailsScreen';
import ProfileScreen from './screens/ProfileScreen';
import RecordDetailsScreen from './screens/RecordDetailsScreen';

const App = () => {
  return (
    <Router>
      <Header />
      <main className='py-3'>
        <Container>
          <Route path='/login' exact component={LoginScreen} />
          <Route path='/register' exact component={RegisterScreen} />
          <Route path='/profile' exact component={ProfileScreen} />
          <Route path='/add/patient' exact component={AddPatientScreen} />
          <Route path='/patient/:id' exact component={PatientDetailsScreen} />
          <Route path='/patient/:pid/add' exact component={AddRecordScreen} />
          <Route
            path='/patient/:pid/record/:id'
            exact
            component={RecordDetailsScreen}
          />
          <Route path='/' exact component={HomeScreen} />
        </Container>
      </main>
      <Footer />
    </Router>
  );
};

export default App;
