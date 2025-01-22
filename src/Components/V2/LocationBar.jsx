import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const LocationBar = ({ onSearch, searchQuery }) => {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState(searchQuery);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDistance, setSelectedDistance] = useState("+ 5 km");
    const dropdownRef = useRef(null);
    const options = [
        "Whole town",
        "+ 5 km",
        "+ 10 km",
        "+ 20 km",
        "+ 30 km",
        "+ 50 km",
        "+ 100 km",
        "+ 150 km",
        "+ 200 km",
    ];

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const selectOption = (option) => {
        setSelectedDistance(option);
        setIsOpen(false);
    };

    useEffect(() => {
        setSearchTerm(searchQuery);
    }, [searchQuery]);

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <div className={`bg-gray-900 px-5 md:px-10 lg:px-[10rem] 2xl:px-[20rem] py-4 flex justify-center`}>
            <div className="bg-white rounded-full flex items-center shadow-md px-4 py-2 w-full">
                {/* Search Icon and Input */}
                <form
                    onSubmit={handleSubmit}
                    className="flex items-center flex-1 p-2" >
                    <svg
                        className="w-5 h-5 text-gray-500 mr-2"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
                        />
                    </svg>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder={t("whatAreYouLookingFor")}
                        className="flex-grow outline-none text-gray-700"
                    />
                </form>

                {/* Divider */}
                <div className="border-l border-gray-300 h-8 mx-3"></div>

                {/* Location Input */}
                <div className="flex items-center flex-1 p-2">
                    <svg className="w-5 h-5 text-gray-700 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                        <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                    </svg>
                    <input
                        type="text"
                        placeholder={t("chooseLocation")}
                        className="flex-grow outline-none text-gray-700"
                    />
                </div>

                <div className="border-l border-gray-300 h-8 mx-3"></div>

                {/* Distance Dropdown */}
                <div className="relative flex items-center flex-1 p-2 hover:bg-gray-100 cursor-pointer rounded-full" ref={dropdownRef}>
                    <button
                        className="text-gray-700 flex items-center w-full"
                        onClick={toggleDropdown}
                    >
                        <span className="mr-2">{selectedDistance}</span>
                        <svg
                            className="w-4 h-4 text-gray-500"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>

                    {/* Dropdown menu */}
                    {isOpen && (
                        <div className="absolute top-full left-0 mt-1 w-32 bg-white shadow-md rounded-lg z-10">
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    onClick={() => selectOption(option)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                >
                                    {option}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Find Button */}
                <button className={`bg-gray-900 font-bold font-sans text-white rounded-full px-4 py-2 ml-4`}
                    style={{
                        fontFamily: "Poppins, sans-serif",
                    }}
                >
                    Find
                </button>
            </div>
        </div>
    );
};

LocationBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    searchQuery: PropTypes.string.isRequired,
};

export default LocationBar;