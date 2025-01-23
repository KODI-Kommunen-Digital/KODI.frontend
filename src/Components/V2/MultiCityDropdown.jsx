import React, { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { AiOutlineDown } from "react-icons/ai";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const MultiCityDropdown = ({ cities, setListings }) => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCities, setSelectedCities] = useState([]);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsOpen((prev) => !prev);
    };

    const handleSelectCity = (city) => {
        if (!selectedCities.some((selectedCity) => selectedCity.id === city.id)) {
            const updatedCities = [...selectedCities, city];
            setSelectedCities(updatedCities);

            setListings({
                cityId: updatedCities.map((city) => city.id).join(","),
            });
        } else {
            alert(t("cityAlreadySelected"));
        }
    };

    const handleRemoveCity = (cityId) => {
        const updatedCities = selectedCities.filter((city) => city.id !== cityId);
        setSelectedCities(updatedCities);

        setListings({
            cityId: updatedCities.map((city) => city.id).join(","),
        });
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="relative mb-6" ref={dropdownRef}>
            <label
                htmlFor="citySelector"
                className="block text-lg font-bold text-white mb-2"
            >
                {process.env.REACT_APP_REGION_NAME === "HIVADA" ? t("cluster") : t("selectCity")}
            </label>

            <div
                className="shadow-lg w-full bg-white flex items-center flex-1 p-2 rounded-r-full cursor-pointer"
                onClick={toggleDropdown}
            >
                <div className="bg-white rounded-r-full flex items-center px-4 py-2 gap-2 hover:bg-gray-100 w-full">
                    {selectedCities.map((city) => (
                        <div
                            key={city.id}
                            className="flex items-center bg-gray-200 text-gray-900 p-2 rounded-full"
                        >
                            <span>{city.name}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveCity(city.id)}
                                className="ml-2 text-red-600 hover:text-red-800"
                            >
                                <FaTimes />
                            </button>
                        </div>
                    ))}
                    <input
                        type="text"
                        placeholder={selectedCities.length === 0 ? t("select") : ""}
                        className="bg-transparent outline-none flex-1 cursor-pointer"
                        readOnly
                    />
                    <AiOutlineDown className="text-gray-500 ml-2" />
                </div>

            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl z-10 max-h-40 overflow-y-auto border border-gray-300">
                    {cities.map((city) => (
                        <div
                            key={city.id}
                            onClick={() => handleSelectCity(city)}
                            className={`cursor-pointer px-4 py-2 hover:bg-blue-100 ${selectedCities.some((selectedCity) => selectedCity.id === city.id)
                                ? "text-blue-800"
                                : "text-gray-800"
                                }`}
                        >
                            {city.name}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

MultiCityDropdown.propTypes = {
    cities: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
            name: PropTypes.string.isRequired,
        })
    ).isRequired,
    t: PropTypes.func.isRequired,
    setListings: PropTypes.func.isRequired,
};

export default MultiCityDropdown;