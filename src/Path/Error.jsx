import React from 'react';
import logo from "../Resource/HEIDI_Logo_Landscape.png";
 
const Error = () => {
    return (
       <div className='errorPage'>
         <img
            className="h-20 mx-auto"
            src={logo}
            alt="HEDI- Heimat Digital"
         />
         <h1 className="text-8xl pt-10">404</h1>
          <p>Page not found!</p>
       </div>
    );
}
 
export default Error;