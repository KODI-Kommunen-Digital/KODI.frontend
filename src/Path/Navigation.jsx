import React from 'react';
 
import { NavLink } from 'react-router-dom';
 
const Navigation = () => {
    return (
       <div>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/LoginPage">LoginPage</NavLink>
          <NavLink to="/ProfilePage">ProfilePage</NavLink>
          <NavLink to="/Register">Register</NavLink>
       </div>
    );
}
 
export default Navigation;
