import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import RegionColors from "../../Components/RegionColors";
import { Combobox } from "@headlessui/react";

const LocationBar = ({ onSearch, searchQuery }) => {
    const { t } = useTranslation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [isDistanceDropdownOpen, setIsDistanceDropdownOpen] = useState(false);
    const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
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

    useEffect(() => {
        if (query.length < 3) {
            setSuggestions([]);
            setIsLocationDropdownOpen(false);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`);
                const data = await response.json();

                if (data.length > 0) {
                    setSuggestions(data);
                    setIsLocationDropdownOpen(true);
                } else {
                    setSuggestions([]);
                    setIsLocationDropdownOpen(false);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [query]);

    const toggleDropdown = () => {
        setIsDistanceDropdownOpen(!isDistanceDropdownOpen);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDistanceDropdownOpen(false);
                setIsLocationDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const selectOption = (option) => {
        setSelectedDistance(option);
        setIsDistanceDropdownOpen(false);
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
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className={`${RegionColors.lightBgColorV2} hidden md:flex px-5 md:px-10 lg:px-[10rem] 2xl:px-[20rem] py-4 justify-center`}>
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
                    <div className="flex items-center flex-1 p-2 relative" ref={dropdownRef}>
                        <svg className="w-5 h-5 text-gray-700 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
                            <path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
                        </svg>
                        <Combobox value={query} onChange={setQuery}>
                            <Combobox.Input
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder={t("chooseLocation")}
                                className="flex-grow outline-none text-gray-700"
                            />
                        </Combobox>
                        {isLocationDropdownOpen && (
                            <div className="absolute top-full left-0 mt-4 w-full bg-white shadow-md rounded-lg z-10">
                                {suggestions.map((place) => (
                                    <div
                                        key={place.place_id}
                                        onClick={() => {
                                            setQuery(place.display_name);
                                            setIsLocationDropdownOpen(false);
                                        }}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {place.display_name}
                                    </div>
                                ))}
                            </div>
                        )}
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
                        {isDistanceDropdownOpen && (
                            <div className="absolute top-full left-0 mt-4 w-32 bg-white shadow-md rounded-lg z-10">
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
                    <button className={`${RegionColors.darkBgColorV2} font-bold font-sans text-white rounded-full px-4 py-2 ml-4`}
                        style={{
                            fontFamily: "Poppins, sans-serif",
                        }}
                        onClick={handleSubmit}
                    >
                        {t("find")}
                    </button>
                </div>
            </div>

            <div className={`${RegionColors.darkBgColorV2} flex md:hidden justify-center px-5 md:px-10 lg:px-[10rem] 2xl:px-[20rem] py-4 justify-center`}>
                <div className="bg-white rounded-full flex items-center shadow-md px-4 py-2 w-full">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center flex-1 p-2"
                    >
                        <span className="text-gray-700 truncate">{t("whereAndWhat")}</span>
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
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-white bg-opacity-100 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-2/3">
                        {/* Close Button */}
                        <button className="absolute top-3 right-3 text-gray-900 text-lg" onClick={() => setIsModalOpen(false)}>
                            ✕
                        </button>

                        {/* Search Input */}
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={t("whatAreYouLookingFor")}
                            className="w-full border border-gray-300 rounded-md p-3 mb-4"
                        />

                        {/* Location Search */}
                        <div ref={dropdownRef}>
                            <Combobox value={query} onChange={(value) => {
                                setQuery(value);
                                setIsLocationDropdownOpen(false);
                            }}>
                                <Combobox.Input
                                    onChange={(event) => setQuery(event.target.value)}
                                    placeholder={t("chooseLocation")}
                                    className="w-full border border-gray-300 rounded-md p-3 mb-4"
                                />
                            </Combobox>
                            {isLocationDropdownOpen && (
                                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 mb-4">
                                    {suggestions.map((place) => (
                                        <div
                                            key={place.place_id}
                                            onClick={() => {
                                                setQuery(place.display_name);
                                                setIsLocationDropdownOpen(false);
                                            }}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {place.display_name}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Distance Dropdown */}
                        <div ref={dropdownRef}>
                            <button
                                onClick={() => setIsDistanceDropdownOpen(!isDistanceDropdownOpen)}
                                className="w-full border border-gray-300 rounded-md p-3 mb-4"
                            >
                                {selectedDistance}
                            </button>
                            {isDistanceDropdownOpen && (
                                <div className="max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2 mb-4">
                                    {options.map((option, index) => (
                                        <div
                                            key={index}
                                            onClick={() => {
                                                setSelectedDistance(option);
                                                setIsDistanceDropdownOpen(false);
                                            }}
                                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Find Button */}
                        <button onClick={handleSubmit} className="bg-gray-800 text-white rounded-md px-4 py-2 w-full">
                            {t("find")}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

LocationBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    searchQuery: PropTypes.string,
};

export default LocationBar;