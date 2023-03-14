import React, { useState, useRef, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import JoditEditor from "jodit-react";
import "./bodyContainer.css";
import { useTranslation } from "react-i18next";
import L from "leaflet"
import axios from "axios";

function ListingsPageConstructionTraffic() {
  //window.scrollTo(0, 0);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.title = "Construction sites / traffic";
  }, []);

  const editor = useRef(null);
  const [content, setContent] = useState("");

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState({});
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  //Drag and Drop starts
  const [image, setImage] = useState(null);
  const [dragging, setDragging] = useState(false);

  function handleDragEnter(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  }

  function handleDragLeave(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  }

  function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files[0];
    setImage(file);
    setInput(prevInput => ({...prevInput, media: URL.createObjectURL(file)})); //send as url image
    setDragging(false);
  }

  function handleInputChange(e) {
    const file = e.target.files[0];
    setImage(file);
    setInput(prevInput => ({...prevInput, media: URL.createObjectURL(file)})); //send as url image
  }

  function handleRemoveImage() {
    setImage(null);
    setInput(prevInput => ({...prevInput, media: ''}));
  }
  //Drag and Drop ends

  //Sending data to backend starts
  const [input, setInput] = useState({
    title:'',
    place:'',
    phone: '',
    email:'',
    description: '',
    media: null
  });

  const [error, setError] = useState({
    title:'',
    place:'',
    phone: '',
    email:'',
    description: '',
    media: ''
  })

  const onInputChange = e => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  };
  
  const [description, setDescription] = useState('');
  
  const onDescriptionChange = newContent => {
    setInput(prev => ({
      ...prev,
      description: newContent.replace(/(<br>|<\/?p>)/gi, '')
    }));
    setDescription(newContent);
  };

  const handleSubmit = async(event) =>{
    event.preventDefault();
  }
  console.log(input)

  const validateInput = e => {
    let { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "title":
          if (!value) {
            stateObj[name] = t("pleaseEnterTitle");
          }
          break;
          case "place":
            if(!value){
              stateObj[name] = t("pleaseEnterPlace");
            }
            break;
        case "address":
          if(!value){
            stateObj[name] = t("pleaseEnterAddress");
          }
          break;
          case "phone":
            if(!value){
              stateObj[name] = t("pleaseEnterPhone");
            }
            break;

            case "description":
              if(!value){
                stateObj[name] = t("pleaseEnterDescription");
              }
              break;

              case "media":
              if(!value){
                stateObj[name] = t("pleaseEnterMedia");
              }
              break;

        default:
          break;
      }

      return stateObj;
    });
  }
  //Sending data to backend ends

  //Map integration Sending data to backend starts
  input["address"] = selectedResult.display_name
  input["latitude"] = selectedResult.lat
  input["longitude"] = selectedResult.lon
  const handleSearch = async (event) => {
    event.preventDefault();
    setQuery(event.target.value)
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${query}&format=json`
    );
    const data = await response.json();
    setResults(data);
  };

  const handleResultSelect = (result) => {
    setQuery(result.display_name);
    setSelectedResult(result);
    if (marker) {
      marker.setLatLng([result.lat, result.lon]);
    } else {
      const newMarker = L.marker([result.lat, result.lon]).addTo(map);
      setMarker(newMarker);
    }
    map.setView([result.lat, result.lon], 13);
    setResults([]);
  };

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
  //Map integration Sending data to backend ends

  return (
    <section class="bg-slate-600 body-font relative">
      <SideBar />

      <form onSubmit={handleSubmit} action="#" method="POST">
        <div class="container w-auto px-5 py-2 bg-slate-600">
          <div class="bg-white mt-4 p-6 space-y-10">
            <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
              Information
              <div className="my-4 bg-gray-600 h-[1px]"></div>
            </h2>
            <div class="relative mb-4">
              <label for="title" class="block text-sm font-medium text-gray-600">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={input.title}
                onChange={onInputChange}
                onBlur={validateInput}
                required
                class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                placeholder="enter your title"
              />
            </div>

            <div class="relative mb-4">
              <label for="email" class="block text-sm font-medium text-gray-600">
                Place
              </label>
              <input
                type="text"
                id="place"
                name="place"
                value={input.place}
                onChange={onInputChange}
                onBlur={validateInput}
                class="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                placeholder="Enter your place here"
              />
            </div>

            <div class="col-span-6">
              <label
                for="address"
                class="block text-sm font-medium text-gray-600"
              >
                Street address
              </label>

              {/* <Maps/> */}
              <div>
                <input
                  type="text"
                  id="address"
                  name="address"
                  required
                  placeholder="Search for a location"
                  value={query}
                  onChange={handleSearch}
                  onBlur={validateInput}
                  className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
                  <ul class="cursor-pointer mt-4 space-y-2">
                  {results.map((result) => (
                    <li key={result.place_id} onClick={() => handleResultSelect(result)}>
                      {result.display_name}
                    </li>
                  ))}
                </ul>
                  <button onClick={handleSearch} class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded" type="submit">
                    Search
                  </button>
                {selectedResult.lat && <div id="map" className="mt-6 h-64 w-full">
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
                  integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
                  crossorigin=""/>

                  </div>}
              </div>

            </div>

            <div class="relative mb-4">
              <label for="telephone" class="block text-sm font-medium text-gray-600">
                Telephone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={input.phone}
                onChange={onInputChange}
                onBlur={validateInput}
                class="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                placeholder="enter your telephone number"
              />
            </div>

            <div class="relative mb-4">
              <label for="email" class="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={input.email}
                onChange={onInputChange}
                onBlur={validateInput}
                class="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                placeholder="youremail@gmail.com"
              />
            </div>

            <div class="relative mb-4" >
              <label for="description" class="block text-sm font-medium text-gray-600">
                Description
              </label>
              {/* <JoditEditor
                ref={editor}
                value={input.description}
                onChange={(newContent) => {
                  const cleanedContent = newContent.replace(/<\/?p>/g, '');
                  onInputChange({ target: { name: 'description', value: cleanedContent } });
                }}
              /> */}
              <JoditEditor
                type="text"
                id="description"
                name="description"
                ref={editor}
                value={description}
                // config={{
                //   maxLength: 1000 // Set maximum length to 1000 characters
                // }}
                onChange={newContent => onDescriptionChange(newContent)}
              />

            </div>
          </div>
        </div>

        <div class="container w-auto px-5 py-2 bg-slate-600">
          <div class="bg-white mt-4 p-6 space-y-10">
            <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
              Media
              <div className="my-4 bg-gray-600 h-[1px]"></div>
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload here</label>
              <div className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 bg-slate-200`} onDrop={handleDrop} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
                {image ? (
                  <div className="flex flex-col items-center">
                    <img className="object-contain h-64 w-full mb-4" src={URL.createObjectURL(image)} alt="uploaded" />
                    <button className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded" onClick={handleRemoveImage}>Remove Image</button>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7.414l-2-2V4a1 1 0 00-1-1H6zm6 5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">
                      Drag and drop your image here, or{' '}
                      <label htmlFor="image-upload" className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                        Upload
                      </label>{' '}
                      to choose a file.
                    </p>
                    <input id="image-upload" type="file" className="sr-only" onChange={handleInputChange} />
                  </div>
                )}
              </div>
            </div>
            {/* <div class="relative mb-4 mt-8 border-white">
              <button class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
                Save Changes
              </button>
            </div> */}
          </div>
        </div>

        <div class="container w-auto px-5 py-2 bg-slate-600">
          <div class="bg-white mt-4 p-6 space-y-10">
            <div class="relative mb-4 mt-8 border-white">
              <button type="submit" class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ListingsPageConstructionTraffic;
