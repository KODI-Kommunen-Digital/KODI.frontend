import React, { useState, useEffect } from "react";
import L from "leaflet";
import { useTranslation } from "react-i18next";

function OpenStreetMap() {
    const { t } = useTranslation();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [selectedResult, setSelectedResult] = useState({});
    const [map, setMap] = useState(null);
    const [marker, setMarker] = useState(null);

    // const [input, setInput] = useState({
    //     address: "",
    //     latitude: "",
    //     longitude: "",
    // });

    const handleSearch = async (event) => {
        event.preventDefault();
        setQuery(event.target.value);
        const response = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
        );
        const data = await response.json();
        setResults(data);
    };

    const handleResultSelect = (result) => {
        setQuery(result.display_name);
        setSelectedResult(result);
        setResults([]);

        if (map) {
            if (marker) {
                marker.setLatLng([result.lat, result.lon]);
            } else {
                const newMarker = L.marker([result.lat, result.lon]).addTo(map);
                setMarker(newMarker);
            }

            map.setView([result.lat, result.lon], 13);
        }
    };

    useEffect(() => {
        if (!map && selectedResult.lat) {
            const newMap = L.map("map").setView(
                [selectedResult.lat, selectedResult.lon],
                13
            );
            setMap(newMap);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution:
                    '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(newMap);
            document.getElementsByClassName(
                "leaflet-control-attribution"
            )[0].style.display = "none";
        }
    }, [map, selectedResult]);

    return (
        <div className="col-span-6">
            <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-600"
            >
                {t("streetAddress")}
            </label>
            <div>
                <input
                    type="text"
                    id="address"
                    name="address"
                    required
                    placeholder={t("searchLocation")}
                    value={query}
                    onChange={handleSearch}
                    className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
                <ul className="cursor-pointer mt-4 space-y-2">
                    {results.map((result) => (
                        <li
                            key={result.place_id}
                            onClick={() => handleResultSelect(result)}
                        >
                            {result.display_name}
                        </li>
                    ))}
                </ul>
                <button
                    onClick={handleSearch}
                    className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded"
                    type="submit"
                >
                    {t("search")}
                </button>

                {selectedResult.lat && (
                    <div id="map" className="mt-6 h-64 w-full">
                        <link
                            rel="stylesheet"
                            href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                            integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                            crossOrigin=""
                        />
                    </div>
                )}
            </div>
        </div>
    );
}

export default OpenStreetMap;
