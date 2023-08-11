import React from "react";
import logo from "../assets/HEIDI_Logo_Landscape.png";
import { useNavigate } from "react-router-dom";

const Error = () => {
    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

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
                <h5 className="text-2xl pt-4 md:text-2xl hover:underline cursor-pointer"
                    onClick={() => navigateTo("/")}>Go to homepage</h5>
            </div>
        </div>
    );
};

export default Error;
