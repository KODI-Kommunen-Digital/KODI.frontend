import React, { useState , useEffect } from "react";
import L from "leaflet";

const SearchLocation = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState({});
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (event) => {
    event.preventDefault();
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
    );
    const data = await response.json();
    setResults(data);
  };

  const handleResultSelect = (result) => {
    setQuery (result.display_name)
    setSelectedResult(result);
    if (marker) {
      marker.setLatLng([result.lat, result.lon]);
    } else {
      const newMarker = L.marker([result.lat, result.lon]).addTo(map);
      setMarker(newMarker);
    }
    setSelectedLocation(result.display_name);
    console.log(result)
    map.setView([result.lat, result.lon], 13);
    setResults([]);
  };

  // const initializeMap = () => {
  //   if (!map) {
  //     const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
  //     const osmAttrib =
  //       'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
  //     const osm = L.tileLayer(osmUrl, { attribution: osmAttrib });

  //     const selectLocation = (lat, lng) => {
  //       map.setView([lat, lng], 13);
  //     };

  //     setMap(map);
  //   }
  // };

  useEffect(() => {

    if (!map && selectedResult.lat) {
        const newMap = L.map("map").setView(
        [selectedResult.lat, selectedResult.lon],
        13
        );
        setMap(newMap);
        L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
        }
        ).addTo(newMap);
        document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';
    }
  }, [map, selectedResult]);

  return (
    <div>
      <form onSubmit={handleSearch}>
      <input
        type="text"
        id="address"
        name="address"
        required
        placeholder="Search for a location"
        value={query}
        className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
        onChange={(event) => {
          const regex = /^[a-zA-Z0-9, ]*$/; // allow only letters, numbers, commas and spaces
          if (regex.test(event.target.value)) {
            setQuery(event.target.value);
          }
        }}
      />

        <ul class="cursor-pointer mt-4 space-y-2">
        {results.map((result) => (
          <li key={result.place_id} onClick={() => handleResultSelect(result)}>
            {result.display_name}
          </li>
        ))}
      </ul>
        <button class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded" type="submit">
          Search
        </button>
      </form>
      {/* <div className="h-64 w-full">
        <div id="map" className="h-full rounded-lg shadow-lg bg-gray-200 py-2 px-4 mt-8" onLoad={initializeMap}></div>
      </div> */}
      {selectedResult.lat && <div id="map" className="mt-6 h-64 w-full">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossorigin=""/>

        </div>}
    </div>
  );
};

export default SearchLocation;