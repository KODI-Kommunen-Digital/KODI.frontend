import React, { Component } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Error from './Path/Error';
import ProfilePage from './Path/ProfilePage';
import LoginPage from './Path/LoginPage';
import Navigation from './Path/Navigation';
import Dashboard from './Path/Dashboard';
import Register from './Path/Register';

class App extends Component{
  render(){
  return (
    <BrowserRouter>
      <div>
        <Navigation />
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} exact/>
            <Route path="/ProfilePage" element={<ProfilePage />}/>
            <Route path="/" element={<LoginPage />}/>
            <Route path="/Register" element={<Register />}/>
             <Route path='*' element={<Error />}/>
          </Routes>
      </div>
    </BrowserRouter>
  );
}
}

export default App;