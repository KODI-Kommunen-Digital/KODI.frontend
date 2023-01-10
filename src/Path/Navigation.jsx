import React from 'react';
 
import { NavLink } from 'react-router-dom';
 
const Navigation = () => {
    return (
       <div>
          <NavLink to="/Dashboard"></NavLink>
          <NavLink to="/"></NavLink>
          <NavLink to="/ProfilePage"></NavLink>
          <NavLink to="/Register"></NavLink>
       </div>
    );
}
 
export default Navigation;
