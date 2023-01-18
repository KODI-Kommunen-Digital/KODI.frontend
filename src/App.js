import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Error from './Path/Error';
import ProfilePage from './Path/ProfilePage';
import LoginPage from './Path/LoginPage';
import Navigation from './Path/Navigation';
import Dashboard from './Path/Dashboard';
import Register from './Path/Register';
import ListingsPage from './Path/ListingsPage';
import ContactInfo from './Path/ContactInfo';
import PasswordForgot from './Path/PasswordForgot';
import PasswordUpdate from './Path/PasswordUpdate';
import HEIDI_Logo from "./Resource/HEIDI_Logo.png";

const App =()=>{
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = HEIDI_Logo;
      document.getElementsByTagName('head')[0].appendChild(link);
  }, []);
  return (
    <BrowserRouter>
      <div>
        <Navigation />
          <Routes>
            <Route path="/Dashboard" element={<Dashboard />} exact/>
            <Route path="/ProfilePage" element={<ProfilePage />}/>
            <Route path="/PasswordForgot" element={<PasswordForgot />}/>
            <Route path="/PasswordUpdate" element={<PasswordUpdate />}/>
            <Route path="/" element={<LoginPage />}/>
            <Route path="/Register" element={<Register />}/>
            <Route path="/ListingsPage" element={<ListingsPage />}/>
            <Route path="/ContactInfo" element={<ContactInfo />}/>
            <Route path="/Dashboard" element={<Dashboard />}/>
            <Route path='*' element={<Error />}/>
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;