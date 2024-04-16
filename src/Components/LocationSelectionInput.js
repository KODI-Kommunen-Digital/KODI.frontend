import React, { useState } from 'react';

function LocationSelectionInput() {
    const [location, setLocation] = useState('');
    const [address, setAddress] = useState('');

    function handleLocationChange(event) {
        setLocation(event.target.value);
    }

    function handleLocationSubmit(event) {
        event.preventDefault();
        // Do something with the location data, like pass it to a parent component
    }

    function getCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                setLocation(`${latitude}, ${longitude}`);
                getAddressFromCoords(latitude, longitude);
            }, error => {
                console.error(error);
            });
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }

    function getAddressFromCoords(latitude, longitude) {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_API_KEY`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                const formattedAddress = data.results[0].formatted_address;
                setAddress(formattedAddress);
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <form onSubmit={handleLocationSubmit} className="flex flex-col">
            <div className="flex">
                <input
                    id="location"
                    type="text"
                    placeholder="-- Click Select --"
                    value={location}
                    onChange={handleLocationChange}
                    className="bg-gray-50 border border-gray-300 text-slate-800 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
                <button
                    type="button"
                    onClick={getCurrentLocation}
                    className={`ml-2 py-2 px-4 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent ${process.env.REACT_APP_NAME === 'Salzkotten APP' ? 'bg-yellow-600' : 'bg-blue-800'} text-base font-semibold text-white shadow-sm hover:bg-cyan-500`}
                >
                    Select
                </button>
            </div>
            {address && (
                <p className="text-sm text-gray-500 mt-2">
                    Address: {address}
                </p>
            )}
        </form>
    );
}

export default LocationSelectionInput;
