import React, { useState, useRef, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import JoditEditor from "jodit-react";
import "./bodyContainer.css";
import { useTranslation } from "react-i18next";
import L from "leaflet";

function ListingsPageDefectReporter() {
  //window.scrollTo(0, 0);

  const { t, i18n } = useTranslation();

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
    media: null,
    originalPrice:'',
    discountedPrice:'',
    socialMedia: ''
  });

  const [error, setError] = useState({
    title:'',
    place:'',
    phone: '',
    email:'',
    description: '',
    media: null,
    originalPrice:'',
    discountedPrice:'',
    socialMedia: ''
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

  const [data, setData] = useState({
    socialMedia: ""
  });
  //Map integration Sending data to backend ends

  useEffect(() => {
    document.title = "Defect Report";
  }, []);

  const [val, setVal] = useState([]);
  const handleAdd = () => {
    const abc = [...val, []];
    setVal(abc);
  };
  const handleChange = (onChangeValue, i) => {
    const inputdata = [...val];
    inputdata[i] = onChangeValue.target.value;
    setVal(inputdata);
  };
  const handleDelete = (i) => {
    const deletVal = [...val];
    deletVal.splice(i, 1);
    setVal(deletVal);
  };

  const editor = useRef(null);
  const [content, setContent] = useState("");

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
              <label for="place" class="block text-sm font-medium text-gray-600">
                Telephone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={input.phone}
                onChange={onInputChange}
                onBlur={validateInput}
                class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                placeholder="enter your telephone number"
              />
            </div>

            <div class="relative mb-4">
              <label for="place" class="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={input.email}
                onChange={onInputChange}
                onBlur={validateInput}
                required
                class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                placeholder="youremail@gmail.com"
              />
            </div>

            <div class="relative mb-4" >
              <label for="description" class="block text-sm font-medium text-gray-600">
                Description
              </label>
              <JoditEditor
                type="text"
                id="description"
                name="description"
                ref={editor}
                value={description}
                onChange={newContent => onDescriptionChange(newContent)}
              />

            </div>
        </div>
      </div>

      <div class="container w-auto px-5 py-2 bg-slate-600">
        <div class="bg-white mt-4 p-6 space-y-10">
          <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
            Social Media
            <div className="my-4 bg-gray-600 h-[1px]"></div>
          </h2>

          <div class="relative mb-4">
            <label
              for="category"
              class="block text-sm font-medium text-gray-600"
            >
              Link your social media accounts here
            </label>
            <div class="relative mb-4">
              <div class="relative mb-4 mt-2 border-white">
                {val.map((data, i) => {
                  return (
                    <div class="items-stretch py-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                        <label
                          for="country"
                          class="block text-md font-medium text-gray-600"
                        >
                          Select
                        </label>
                        <select
                          id="country"
                          name="country"
                          autocomplete="country-name"
                          class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                        >
                          <option>Select</option>
                          <option>Facebook</option>
                          <option>Instagram</option>
                          <option>Linkdin</option>
                          <option>Youtube</option>
                          <option>Twitter</option>
                        </select>
                      </div>
                      <div class="mt-2 px-0 ml-2">
                        <label
                          htmlFor="lastName"
                          class="block text-md font-medium text-gray-600"
                        >
                          Website
                        </label>
                        <input
                          type="text"
                          id="socialMedia"
                          name="socialMedia"
                          value={data.socialMedia}
                          onBlur={validateInput}
                          onChange={(e) => {
                            const value = e.target.value;
                            setInput({ ...input, socialMedia: e.target.value })
                            setData((prevData) => ({ ...prevData, socialMedia: value }));
                            handleChange(e, i);
                          }}
                          className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                          placeholder="ainfo@heidi-app.de"
                        />

                      </div>
                      <div class="flex ml-2 mt-8">
                        <button onClick={() => handleDelete(i)}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="w-5 h-5"
                            viewBox="0 0 512 512"
                          >
                            <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  );
                })}
                <button
                  class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded"
                  onClick={() => handleAdd('')}
                >
                  + Add your social media
                </button>
              </div>
              <div class="flex justify-center space-x-6 mt-7">
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="arrow-alt-circle-up"
                  class="w-5 h-5"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                  />
                </svg>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="arrow-alt-circle-right"
                  class="w-5 h-5"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                  />
                </svg>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="arrow-alt-circle-down"
                  class="w-5 h-5"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                  />
                </svg>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="arrow-alt-circle-down"
                  class="w-5 h-5"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                  />
                </svg>
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="far"
                  data-icon="arrow-alt-circle-down"
                  class="w-5 h-5"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                  />
                </svg>
              </div>
            </div>
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

export default ListingsPageDefectReporter;
