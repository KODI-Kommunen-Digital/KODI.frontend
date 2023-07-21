import React from "react";
import logo from "../assets/HEIDI_Logo_Landscape.png";

const Error = () => {
    return (
        <div>
            <div className="errorPage">
                <img
                    className="h-40 mx-auto"
                    src={logo}
                    alt="HEDI- Heimat Digital"
                />
                <h1 className="text-6xl pt-10 md:text-8xl">404</h1>
                <p className="text-2xl pt-10 md:text-6xl">Page not found!</p>
            </div>
        </div>
    );
};

export default Error;
