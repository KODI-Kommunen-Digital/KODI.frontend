import React from 'react'
import PropTypes from "prop-types";

const CityDropDown = ({
    cities,
    selectedCityForDropdown,
    handleCitySelect,
    isCityDropdownOpen,
    setIsCityDropdownOpen,
    cityDropdownRef,
    cityDropdownInput,
    setCityDropdownInput,
    t,
    filteredCities,
    isModal = false
}) => {
    return (
        <div>
            <label className={`block ${!isModal ? "text-sm" : ""} font-medium text-gray-700`}>
                {t("selectCity")}
            </label>
            <div className="relative" ref={cityDropdownRef}>
                <div
                    onClick={() => {
                        setIsCityDropdownOpen(true);
                        setCityDropdownInput(""); // Clear search when opening
                    }}
                    className={[
                        "mt-1 border p-3 bg-white text-gray-800 border-gray-300 duration-300",
                        "w-full cursor-pointer min-h-[48px] flex flex-wrap items-center gap-2",
                        !isModal ? "shadow-md rounded-lg" : "rounded"
                    ].join(" ")}
                >
                    {selectedCityForDropdown.length > 0 ? (
                        selectedCityForDropdown.map((city) => (
                            <div
                                key={city.id}
                                className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-300"
                            >
                                <span>{city.name}</span>
                                {cities?.length > 1 && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleCitySelect(city);
                                        }}
                                        className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
                                    >
                                        ×
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <span className="text-gray-500 text-base">
                            {t("search_Cities")}
                        </span>
                    )}
                </div>

                {isCityDropdownOpen && cities?.length > 1 && (
                    <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg z-10 border border-gray-700">
                        {/* Search field inside dropdown */}
                        {cities?.length > 1 &&
                            <div className="p-2 border-b border-gray-200">
                                <input
                                    type="text"
                                    value={cityDropdownInput}
                                    onChange={(e) => {
                                        setCityDropdownInput(e.target.value);
                                    }}
                                    placeholder={t("search_Cities")}
                                    className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoFocus
                                />
                            </div>
                        }
                        {/* Scrollable options */}

                        <div
                            className={`${isModal ? "max-h-28" : "max-h-40"} overflow-y-auto`}>
                            {filteredCities?.length === 0 ? (
                                <div className="px-3 py-2 text-gray-500 italic">
                                    {t("noCitiesFound")}
                                </div>
                            ) : (
                                filteredCities?.map((cityItem) => {
                                    const isSelected = selectedCityForDropdown?.find(city => city.id === cityItem.id);
                                    return (
                                        <div
                                            key={cityItem.id}
                                            onClick={() => {
                                                handleCitySelect(cityItem);
                                            }}
                                            className={`cursor-pointer px-3 py-2  border-b border-gray-200 last:border-b-0 flex items-center ${isSelected ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                                        >
                                            <div>
                                                <div className="font-medium">{cityItem.name}</div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

        </div >
    )
}
CityDropDown.propTypes = {
    cities: PropTypes.array.isRequired,
    selectedCityForDropdown: PropTypes.array.isRequired,
    handleCitySelect: PropTypes.func.isRequired,
    isCityDropdownOpen: PropTypes.bool.isRequired,
    setIsCityDropdownOpen: PropTypes.func.isRequired,
    cityDropdownRef: PropTypes.object.isRequired,
    cityDropdownInput: PropTypes.string.isRequired,
    setCityDropdownInput: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    filteredCities: PropTypes.array.isRequired,
    isModal: PropTypes.bool.isRequired,
};

export default CityDropDown