import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./bodyContainer.css";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
	getListingsByCity,
	getListingsById,
	postListingsData,
	updateListingsData,
	uploadImage,
} from "../Services/listingsApi";

import { getCities } from "../Services/cities";
import { getVillages } from "../Services/villages";
import FormData from "form-data";

function UploadListings() {

	const { t, i18n } = useTranslation();
	const editor = useRef(null);
	const [content, setContent] = useState("");
	const [listingId, setListingId] = useState(0);
	const [newListing, setNewListing] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [alertInfo, setAlertInfo] = useState({
		show: false,
		message: null,
		type: null,
	});

	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [selectedResult, setSelectedResult] = useState({});
	const [map, setMap] = useState(null);
	const [marker, setMarker] = useState(null);

	//Drag and Drop starts
	const [image1, setImage1] = useState(null);
	const [image2, setImage2] = useState(null);
	const [dragging, setDragging] = useState(false);

	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
    window.scrollTo(0, 0);
		const _ = async () => {
			if (image1 !== null) {
				const form = new FormData();
				form.append("image", image1);
				const filePath = await uploadImage(form);
				setInput((prevInput) => ({
					...prevInput,
					logo: filePath.data.path,
				}));
			}
		};

		_();
	}, [image1]);

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

	function handleDrop1(e) {
		e.preventDefault();
		e.stopPropagation();
		const file = e.dataTransfer.files[0];
		setImage1(file);
		setDragging(false);
	}

	function handleInputChange1(e) {
		const file = e.target.files[0];
		setImage1(file);
	}

	function handleRemoveImage1() {
		setImage1(null);
		setInput((prevInput) => ({ ...prevInput, logo: null }));
	}
	function handleDrop2(e) {
		e.preventDefault();
		e.stopPropagation();
		const file = e.dataTransfer.files[0];
		setImage2(file);
		setInput((prevInput) => ({
			...prevInput,
			media: URL.createObjectURL(file),
		})); //send as url image
		setDragging(false);
	}

	function handleInputChange2(e) {
		const file = e.target.files[0];
		setImage2(file);
		setInput((prevInput) => ({
			...prevInput,
			media: URL.createObjectURL(file),
		})); //send as url image
	}

	function handleRemoveImage2() {
		setImage2(null);
		setInput((prevInput) => ({ ...prevInput, media: "" }));
	}
	//Drag and Drop ends

	//Sending data to backend starts
	const [val, setVal] = useState([{ socialMedia: "", selected: "" }]);
	const [input, setInput] = useState({
		//"villageId": 1,
		categoryId: 0,
		subcategoryId: 0,
		statusId: 3,
		sourceId: 1,
		userId: 2,
		title: "",
		place: "",
		phone: "",
		email: "",
		description: "",
		logo: null,
		//media: null,
		startDate: "",
		endDate: "",
		originalPrice: "",
		villagedropdown: "",
		zipCode: "",
		discountedPrice: "",
	});

	const [error, setError] = useState({
		//"villageId": 1,
		categoryId: 0,
		subcategoryId: 0,
		statusId: "pending",
		sourceId: 1,
		userId: 2,
		title: "",
		place: "",
		phone: "",
		email: "",
		description: "",
		logo: null,
		//media: null,
		startDate: "",
		endDate: "",
		originalPrice: "",
		villagedropdown: "",
		zipCode: "",
		discountedPrice: "",
	});

	const handleSubmit = async (event) => {
		setUpdating(true);
    event.preventDefault();
    const currentDate = new Date().toISOString().slice(0, 10);
    const time = new Date().toLocaleTimeString();
    const createdAt = `${currentDate}`;
    setInput({ ...input, createdAt })
		try {
			var response = newListing
				? await postListingsData(cityId, input)
				: await updateListingsData(cityId, input, listingId);
			setSuccessMessage(t("listingUpdated"));
			setErrorMessage(false);
			setTimeout(() => setSuccessMessage(false), 5000);
			navigate("/Dashboard");
		} catch (error) {
			setErrorMessage(t("listingNotUpdated"));
			setSuccessMessage(false);
			setTimeout(() => setErrorMessage(false), 5000);
		}
		setUpdating(false);
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		var cityId = searchParams.get("cityId");
		setCityId(cityId);
		var listingId = searchParams.get("listingId");
		setListingId(listingId);
		if (listingId && cityId) {
			setNewListing(false);
			getVillages(cityId).then((response) => setVillages(response.data.data));
			getListingsById(cityId, listingId).then((listingsResponse) => {
				setInput(listingsResponse.data.data);
				setDescription(listingsResponse.data.data.description);
			});
		}
	}, []);

	const onInputChange = (e) => {
		const { name, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
		validateInput(e);
	};

	const [description, setDescription] = useState("");

	const onDescriptionChange = (newContent) => {
		setInput((prev) => ({
			...prev,
			description: newContent.replace(/(<br>|<\/?p>)/gi, ""),
		}));
		setDescription(newContent);
	};

	const validateInput = (e) => {
		let { name, value } = e.target;
		setError((prev) => {
			const stateObj = { ...prev, [name]: "" };

			switch (name) {
				case "title":
					if (!value) {
						stateObj[name] = t("pleaseEnterTitle");
					}
					break;
				case "place":
					if (!value) {
						stateObj[name] = t("pleaseEnterPlace");
					}
					break;
				case "address":
					if (!value) {
						stateObj[name] = t("pleaseEnterAddress");
					}
					break;
				case "phone":
					if (!value) {
						stateObj[name] = t("pleaseEnterPhone");
					}
					break;

				case "description":
					if (!value) {
						stateObj[name] = t("pleaseEnterDescription");
					}
					break;

				case "logo":
					if (!value) {
						stateObj[name] = t("pleaseEnterLogo");
					}
					break;

				case "media":
					if (!value) {
						stateObj[name] = t("pleaseEnterMedia");
					}
					break;

				case "selected":
					if (!value) {
						stateObj[name] = t("pleaseEnterSelected");
					}
					break;
				case "endDate":
					if (!value) {
						stateObj[name] = t("pleaseEnterStartDate");
					}
					break;
				case "startDate":
					if (!value) {
						stateObj[name] = t("pleaseEnterEndDate");
					}
					break;
				case "villagedropdown":
					if (!value) {
						stateObj[name] = t("pleaseEnterVillage");
					}
					break;
				case "zipCode":
					if (!value) {
						stateObj[name] = t("pleaseEnterZipCode");
					}
					break;

				default:
					break;
			}

			return stateObj;
		});
	};
	//Sending data to backend ends

	//Map integration Sending data to backend starts
	input["address"] = selectedResult.display_name;
	input["latitude"] = selectedResult.lat;
	input["longitude"] = selectedResult.lon;
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
			L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
				attribution:
					'&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
			}).addTo(newMap);
			document.getElementsByClassName(
				"leaflet-control-attribution"
			)[0].style.display = "none";
		}
	}, [map, selectedResult]);
	const handleSelection = (index, value) => {
		const updatedVal = [...val];
		updatedVal[index].selected = value;
		setVal(updatedVal);
	};

	useEffect(() => {
		getCities().then((citiesResponse) => {
			setCities(citiesResponse.data.data);
		});
	}, []);

	useEffect(() => {
		setInput((prevState) => ({
			...prevState,
			selected: val.map((item) => item.selected),
		}));
	}, [val]);

	const handleDelete = (index) => {
		const list = [...val];
		list.splice(index, 1);
		setVal(list);
	};

	async function onCityChange(e) {
		const cityId = e.target.value;
		setCityId(cityId);
		setInput((prev) => ({
			...prev,
			villageId: 0,
		}));
		getVillages(cityId).then((response) => setVillages(response.data.data));
	}
	//Social Media ends

	const [date, setDate] = useState();
	const [cityId, setCityId] = useState(0);
	const [villages, setVillages] = useState([]);
	const [cities, setCities] = useState([]);
	async function onCityChange(e) {
		const cityId = e.target.value;
		setCityId(cityId);
		setInput((prev) => ({
			...prev,
			villageId: 0,
		}));
		getVillages(cityId).then((response) => setVillages(response.data.data));
	}

	const [listings, setListings] = useState([]);
	const [categoryId, setCategoryId] = useState();
	const [selectedCategory, setSelectedCategory] = useState("");
	const [subcategoryId, setSubcategoryId] = useState();
	//const selectedItem = localStorage.getItem('selectedItem');
	const [selectedItem, setSelectedItem] = useState(
		localStorage.getItem("selectedItem")
	);

	function handleSelectedItemChange(newValue) {
		setSelectedItem(newValue);
		localStorage.setItem("selectedItem", newValue);
	}

	useEffect(() => {
		let categoryId = 0;
		switch (selectedItem) {
			case "News":
				categoryId = 1;
				break;
			case "Road Works / Traffic":
				categoryId = 2;
				break;
			case "Events":
				categoryId = 3;
				break;
			case "Clubs":
				categoryId = 4;
				break;
			case "Regional Products":
				categoryId = 5;
				break;
			case "Offer / Search":
				categoryId = 6;
				break;
			case "New Citizen Info":
				categoryId = 7;
				break;
			case "Defect Report":
				categoryId = 8;
				break;
			case "Lost And Found":
				categoryId = 9;
				break;
			case "Company Portraits":
				categoryId = 10;
				break;
			case "Carpooling And Public Transport":
				categoryId = 11;
				break;
			case "Offers":
				categoryId = 12;
				break;
			default:
				categoryId = 0;
				break;
		}
		setInput((prevInput) => ({ ...prevInput, categoryId }));
		setCategoryId(categoryId);
	}, [selectedItem]);

	const handleCategoryChange = (event) => {
		let categoryId;
		switch (event.target.value) {
			case "News":
				categoryId = 1;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;
			case "Road Works / Traffic":
				categoryId = 2;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;
			case "Events":
				categoryId = 3;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;
			case "Clubs":
				categoryId = 4;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;
			case "Regional Products":
				categoryId = 5;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;
			case "Offer / Search":
				categoryId = 6;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;
			case "New Citizen Info":
				categoryId = 7;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;
			case "Defect Report":
				categoryId = 8;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;
			case "Lost And Found":
				categoryId = 9;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;
			case "Company Portraits":
				categoryId = 10;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;
			case "Carpooling And Public Transport":
				categoryId = 11;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;
			case "Offers":
				categoryId = 12;
				setInput({ ...input, categoryId });
				setSelectedCategory(event.target.value);
				break;

			default:
				categoryId = 0;
				break;
		}
		setInput((prevInput) => ({ ...prevInput, categoryId }));
		setSubcategoryId(null);
		handleSelectedItemChange(event.target.value);

		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("categoryId", categoryId);
		urlParams.delete("subcategoryId");
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.pushState({}, "", newUrl);
	};

	const [selectedSubCategory, setSelectedSubCategory] = useState("");
	const handleSubcategoryChange = (event) => {
		let subcategoryId;
		switch (event.target.value) {
			case "newsflash":
				subcategoryId = 1;
				setInput({ ...input, subcategoryId });
				setSelectedSubCategory(event.target.value);
				break;
			case "alerts":
				subcategoryId = 2;
				setInput({ ...input, subcategoryId });
				setSelectedSubCategory(event.target.value);
				break;
			case "politics":
				subcategoryId = 3;
				setInput({ ...input, subcategoryId });
				setSelectedSubCategory(event.target.value);
				break;
			case "ecocomy":
				subcategoryId = 4;
				setInput({ ...input, subcategoryId });
				setSelectedSubCategory(event.target.value);
				break;
			case "sports":
				subcategoryId = 5;
				setInput({ ...input, subcategoryId });
				setSelectedSubCategory(event.target.value);
				break;
			case "tod":
				subcategoryId = 6;
				setInput({ ...input, subcategoryId });
				setSelectedSubCategory(event.target.value);
				break;
			case "local":
				subcategoryId = 7;
				setInput({ ...input, subcategoryId });
				setSelectedSubCategory(event.target.value);
				break;
			case "clubnews":
				subcategoryId = 8;
				setInput({ ...input, subcategoryId });
				setSelectedSubCategory(event.target.value);
				break;
			default:
				subcategoryId = 0;
				break;
		}
		setInput((prevInput) => ({ ...prevInput, subcategoryId }));
		setSubcategoryId(subcategoryId);
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("subcategoryId", subcategoryId);
		if (subcategoryId === 0) {
			urlParams.delete("subCategoryId");
		}
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.pushState({}, "", newUrl);
	};

	return (
		<section class="bg-slate-600 body-font relative">
			<SideBar />

			<div class="container w-auto px-5 py-2 bg-slate-600">
				<div class="bg-white mt-4 p-6 space-y-10">
					<h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
						Upload Post
						<div className="my-4 bg-gray-600 h-[1px]"></div>
					</h2>
					<div class="relative mb-4">
						<label for="title" class="block text-sm font-medium text-gray-600">
							Title *
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={input.title}
							onChange={onInputChange}
							onBlur={validateInput}
							required
							class="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
							placeholder="enter your title"
						/>
					</div>

					<div class="relative mb-4">
						<label for="title" class="block text-sm font-medium text-gray-600">
							City *
						</label>
						<select
							type="text"
							id="selected"
							name="selected"
							value={cityId}
							onChange={onCityChange}
							onBlur={validateInput}
							autocomplete="country-name"
							class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						>
							<option value={0}>Select</option>
							{cities.map((city) => (
								<option value={Number(city.id)}>{city.name}</option>
							))}
						</select>
					</div>

					<div class="relative mb-4">
						<label for="title" class="block text-sm font-medium text-gray-600">
							Village 
						</label>
						<select
							type="text"
							id="villageId"
							name="villageId"
							value={input.villageId}
							onChange={onInputChange}
							onBlur={validateInput}
							autocomplete="country-name"
							class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
						>
							<option value={0}>Select</option>
							{villages.map((village) => (
								<option value={Number(village.id)}>{village.name}</option>
							))}
						</select>
					</div>

					<div class="relative mb-4">
						<label
							for="dropdown"
							class="block text-sm font-medium text-gray-600"
						>
							Category *
						</label>
						<select
							type="dropdown"
							id="dropdown"
							name="dropdown"
							value={selectedCategory}
							onChange={handleCategoryChange}
							onBlur={validateInput}
							required
							class="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
						>
							<option class="font-sans" value="Default">
								{selectedItem}
							</option>
							{selectedItem !== "News" ? (
								<option value="News">{t("news")}</option>
							) : null}
							{selectedItem !== "Road Works / Traffic" ? (
								<option class="font-sans" value="Road Works / Traffic">
									{t("roadTraffic")}
								</option>
							) : null}
							{selectedItem !== "Events" ? (
								<option class="font-sans" value="Events">
									{t("events")}
								</option>
							) : null}
							{selectedItem !== "Clubs" ? (
								<option class="font-sans" value="Clubs">
									{t("clubs")}
								</option>
							) : null}
							{selectedItem !== "Regional Products" ? (
								<option class="font-sans" value="Regional Products">
									{t("regionalProducts")}
								</option>
							) : null}
							{selectedItem !== "Offer / Search" ? (
								<option class="font-sans" value="Offer / Search">
									{t("offerSearch")}
								</option>
							) : null}
							{selectedItem !== "New Citizen Info" ? (
								<option class="font-sans" value="New Citizen Info">
									{t("newCitizenInfo")}
								</option>
							) : null}
							{selectedItem !== "Defect Report" ? (
								<option class="font-sans" value="Defect Report">
									{t("defectReport")}
								</option>
							) : null}
							{selectedItem !== "Lost And Found" ? (
								<option class="font-sans" value="Lost And Found">
									{t("lostAndFound")}
								</option>
							) : null}
							{selectedItem !== "Company Portraits" ? (
								<option class="font-sans" value="Company Portraits">
									{t("companyPortaits")}
								</option>
							) : null}
							{selectedItem !== "Carpooling And Public Transport" ? (
								<option
									class="font-sans"
									value="Carpooling And Public Transport"
								>
									{t("carpoolingPublicTransport")}
								</option>
							) : null}
							{selectedItem !== "Offers" ? (
								<option class="font-sans" value="Offers">
									{t("offers")}
								</option>
							) : null}
						</select>
					</div>

					{selectedItem === "News" && (
						<div class="relative mb-4">
							<label
								for="newsdropdown"
								class="block text-sm font-medium text-gray-600"
							>
								Sub-Category *
							</label>
							<select
								type="newsdropdown"
								id="newsdropdown"
								name="newsdropdown"
								value={selectedSubCategory}
								onChange={handleSubcategoryChange}
								onBlur={validateInput}
								required
								class="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
							>
								<option class="font-sans" value="Default">
									{t("chooseOneSubCategory")}
								</option>
								<option class="font-sans" value="newsflash">
									{t("newsflash")}
								</option>
								<option class="font-sans" value="alerts">
									{t("alerts")}
								</option>
								<option class="font-sans" value="politics">
									{t("politics")}
								</option>
								<option class="font-sans" value="ecocomy">
									{t("ecocomy")}
								</option>
								<option class="font-sans" value="sports">
									{t("sports")}
								</option>
								<option class="font-sans" value="tod">
									{t("tod")}
								</option>
								<option class="font-sans" value="local">
									{t("local")}
								</option>
								<option class="font-sans" value="clubnews">
									{t("clubnews")}
								</option>
							</select>
						</div>
					)}

					<div class="relative mb-4 grid grid-cols-2 gap-4">
						<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
							<label
								for="place"
								class="block text-sm font-medium text-gray-600"
							>
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
						<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
							<label
								for="zipCode"
								class="block text-sm font-medium text-gray-600"
							>
								Zip Code
							</label>
							<input
								type="text"
								id="zipCode"
								name="zipCode"
								value={input.zipCode}
								onChange={onInputChange}
								onBlur={validateInput}
								class="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
								placeholder="Enter your Zip code here"
							/>
						</div>
					</div>

					<div class="col-span-6">
						<label
							for="address"
							class="block text-sm font-medium text-gray-600"
						>
							Street address *
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
								class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded"
								type="submit"
							>
								Search
							</button>
							{selectedResult.lat && (
								<div id="map" className="mt-6 h-64 w-full">
									<link
										rel="stylesheet"
										href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
										integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
										crossorigin=""
									/>
								</div>
							)}
						</div>
					</div>

					{selectedCategory === "Events" && (
						<div class="relative mb-4">
							<div class="items-stretch py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
								<div class="relative">
									<div class="flex absolute inset-y-0 items-center pl-3 pointer-events-none">
										<svg
											aria-hidden="true"
											class="w-5 h-5 text-gray-600 dark:text-gray-400"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										></svg>
									</div>
									<label
										for="city"
										class="block text-sm font-medium text-gray-600"
									>
										Event Start Date
									</label>
									<input
										type="date"
										id="startDate"
										name="startDate"
										value={input.startDate}
										onChange={onInputChange}
										onBlur={validateInput}
										class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
										placeholder="Start Date"
									/>
								</div>

								<div class="relative">
									<div class="flex absolute inset-y-0 items-center pl-3 pointer-events-none">
										<svg
											aria-hidden="true"
											class="w-5 h-5 text-gray-600 dark:text-gray-400"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										></svg>
									</div>
									<label
										for="city"
										class="block text-sm font-medium text-gray-600"
									>
										Event End Date
									</label>
									<input
										type="date"
										id="endDate"
										name="endDate"
										value={input.endDate}
										onChange={onInputChange}
										onBlur={validateInput}
										class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
										placeholder="End Date"
									/>
								</div>
							</div>
						</div>
					)}

					{(selectedCategory === "Offers" ||
						selectedCategory === "Regional Products") && (
						<div class="relative mb-4 grid grid-cols-2 gap-4">
							<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
								<label
									for="place"
									class="block text-sm font-medium text-gray-600"
								>
									Original Price *
								</label>
								<input
									type="text"
									id="originalPrice"
									name="originalPrice"
									value={input.originalPrice}
									onChange={onInputChange}
									onBlur={validateInput}
									required
									class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
									placeholder="Enter the price of the product"
								/>
							</div>
							<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
								<label
									for="place"
									class="block text-sm font-medium text-gray-600"
								>
									Discounted Price *
								</label>
								<input
									type="text"
									id="discountedPrice"
									name="discountedPrice"
									value={input.discountedPrice}
									onChange={onInputChange}
									onBlur={validateInput}
									required
									class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
									placeholder="Enter the price of the product"
								/>
							</div>
						</div>
					)}

					<div class="relative mb-4">
						<label for="place" class="block text-sm font-medium text-gray-600">
							Telephone *
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
							Email *
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

					<div class="relative mb-4">
						<label
							for="description"
							class="block text-sm font-medium text-gray-600"
						>
							Description
						</label>
						<ReactQuill
							type="text"
							id="description"
							name="description"
							ref={editor}
							value={description}
							onChange={(newContent) => onDescriptionChange(newContent)}
							placeholder="Write something here..."
							className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-0 px-0 leading-8 transition-colors duration-200 ease-in-out shadow-md"
						/>
					</div>
				</div>
			</div>

			{selectedCategory !== "Road Works / Traffic" &&
				selectedCategory !== "Regional Products" &&
				selectedCategory !== "Offer / Search" &&
				selectedCategory !== "Offers" &&
				selectedCategory !== "New Citizen Info" &&
				selectedCategory !== "Defect Report" &&
				selectedCategory !== "Events" &&
				selectedCategory !== "Lost And Found" && (
					<div class="container w-auto px-5 py-2 bg-slate-600">
						<div class="bg-white mt-4 p-6 space-y-10">
							<h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
								Upload Logo
								<div className="my-4 bg-gray-600 h-[1px]"></div>
							</h2>

							<div>
								<label className="block text-sm font-medium text-gray-700">
									Add your Logo here
								</label>
								<div
									className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 bg-slate-200`}
									onDrop={handleDrop1}
									onDragOver={handleDragOver}
									onDragEnter={handleDragEnter}
									onDragLeave={handleDragLeave}
								>
									{image1 ? (
										<div className="flex flex-col items-center">
											<img
												className="object-contain h-64 w-full mb-4"
												src={URL.createObjectURL(image1)}
												alt="uploaded"
											/>
											<button
												className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
												onClick={handleRemoveImage1}
											>
												Remove Image
											</button>
										</div>
									) : (
										<div className="text-center">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="mx-auto h-12 w-12"
												viewBox="0 0 20 20"
												fill="currentColor"
											>
												<path
													fillRule="evenodd"
													d="M6 2a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7.414l-2-2V4a1 1 0 00-1-1H6zm6 5a1 1 0 100-2 1 1 0 000 2z"
													clipRule="evenodd"
												/>
											</svg>
											<p className="mt-1 text-sm text-gray-600">
												Drag and drop your image here, or{" "}
												<label
													htmlFor="image1-upload"
													className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer"
												>
													Upload
												</label>{" "}
												to choose a file.
											</p>
											<input
												id="image1-upload"
												type="file"
												className="sr-only"
												onChange={handleInputChange1}
											/>
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				)}

			{/* {selectedCategory !== "roadTraffic" && (
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
                                type="text"
                                id="selected"
                                name="selected"
                                value={data.selected}
                                onBlur={validateInput}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setInput({ ...input, socialMedia: e.target.value })
                                  setData((prevData) => ({ ...prevData, socialMedia: value }));
                                  handleSocialMediaChanges(e, i);
                                }}
                                autocomplete="country-name"
                                class="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              >
                                <option>Select</option>
                                {
                                  socialMedia.map(option => (
                                    <option value={ option }>
                                      { option }
                                    </option>
                                ))}
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
                                // onChange={(e) => {
                                //   const value = e.target.value;
                                //   setInput({ ...input, socialMedia: e.target.value })
                                //   setData((prevData) => ({ ...prevData, socialMedia: value }));
                                //   handleSocialMediaChanges(e, i);
                                // }}
                                onChange={(e) => handleSocialMediaChanges(e, i)}
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
        )} */}

			{/* <div class="container w-auto px-5 py-2 bg-slate-600">
          <div class="bg-white mt-4 p-6 space-y-10">
            <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
              Media
              <div className="my-4 bg-gray-600 h-[1px]"></div>
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload here</label>
              <div className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6 bg-slate-200`} onDrop={handleDrop2} onDragOver={handleDragOver} onDragEnter={handleDragEnter} onDragLeave={handleDragLeave}>
                {image2 ? (
                  <div className="flex flex-col items-center">
                    <img className="object-contain h-64 w-full mb-4" src={URL.createObjectURL(image2)} alt="uploaded" />
                    <button className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded" onClick={handleRemoveImage2}>Remove Image</button>
                  </div>
                ) : (
                  <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7.414l-2-2V4a1 1 0 00-1-1H6zm6 5a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                    <p className="mt-1 text-sm text-gray-600">
                      Drag and drop your image here, or{' '}
                      <label htmlFor="image2-upload" className="font-medium text-indigo-600 hover:text-indigo-500 cursor-pointer">
                        Upload
                      </label>{' '}
                      to choose a file.
                    </p>
                    <input id="image2-upload" type="file" className="sr-only" onChange={handleInputChange2} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div> */}

			<div class="container w-auto px-5 py-2 bg-slate-600">
				<div class="bg-white mt-4 p-6 space-y-10">
					<div class="relative mb-4 mt-8 border-white">
						<button
							type="button"
							onClick={handleSubmit}
							disabled={updating}
							class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
						>
							Save Changes
							{updating && (
								<svg
									aria-hidden="true"
									class="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
							)}
						</button>
					</div>
					<div>
						{successMessage && (
							<div className="mt-1 w-full bg-green-200 text-green-700 font-bold py-2 px-4 rounded text-center">
								{successMessage}
							</div>
						)}
						{errorMessage && (
							<div className="mt-1 w-full bg-red-200 text-red-700 font-bold py-2 px-4 rounded text-center">
								{errorMessage}
							</div>
						)}
					</div>
				</div>
			</div>
		</section>
	);
}

export default UploadListings;
