import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./bodyContainer.css";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import L from "leaflet";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
	getListingsById,
	postListingsData,
	updateListingsData,
	uploadPDF,
	uploadListingImage,
	deleteListingImage,
} from "../Services/listingsApi";
import { getProfile } from "../Services/usersApi";
import { getCities } from "../Services/cities";
import { getVillages } from "../Services/villages";
import FormData from "form-data";
import Alert from "../Components/Alert";
import { categoryByName, categoryById } from "../Constants/categories";
import { subcategoryById } from "../Constants/subcategories";

function UploadListings() {
	const { t } = useTranslation();
	const editor = useRef(null);
	const [listingId, setListingId] = useState(0);
	const [newListing, setNewListing] = useState(true);
	const [updating, setUpdating] = useState(false);

	const [query, setQuery] = useState("");
	const [results, setResults] = useState([]);
	const [selectedResult, setSelectedResult] = useState({});
	const [map, setMap] = useState(null);
	const [marker, setMarker] = useState(null);

	//Drag and Drop starts
	const [image1, setImage1] = useState(null);
	const [dragging, setDragging] = useState(false);

	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [categories, setCategories] = useState(categoryById);
	const [subCategories, setSubCategories] = useState(subcategoryById);
	const navigate = useNavigate();

	const [initialLoad, setInitialLoad] = useState(true);
	const [pdf, setPdf] = useState(null);

	useEffect(() => {
		if (initialLoad) {
			window.scrollTo(0, 0);
			setInitialLoad(false);
		} else {
			const updateInputState = async () => {
				if (pdf !== null) {
					const form = new FormData();
					form.append("pdf", pdf);
					try {
						const filePath = await uploadPDF(form);
						console.log(filePath.data);
						if (filePath?.data?.status === "success") {
							setInput((prevInput) => ({
								...prevInput,
								pdf: filePath?.data?.path || null,
							}));
						} else {
							console.error("PDF upload failed:", filePath?.data?.message);
						}
					} catch (error) {
						console.error("PDF upload error:", error);
					}
				}
			};

			updateInputState();
		}
	}, [initialLoad, pdf]);

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
		if (file && file.type.startsWith("image/")) {
			setImage1(file);
		}
		setDragging(false);
	}

	function handleDropPDF(event) {
		event.preventDefault();
		const file = event.dataTransfer.files[0];
		setPdf(file);
		setDragging(false);
	}

	function handleInputChange(e) {
		e.preventDefault();
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			setImage1(file);
		}
	}

	function handleRemoveImage1() {
		setImage1(null);
		setInput((prevInput) => ({
			...prevInput,
			logo: null,
			removeImage: true,
		}));
	}

	function handlePDFInputChange(e) {
		e.preventDefault();
		const file = e.target.files[0];
		setPdf(file);
	}

	function handleRemovePDF() {
		setPdf(null);
	}
	//Drag and Drop ends

	//Sending data to backend starts
	const [val, setVal] = useState([{ socialMedia: "", selected: "" }]);
	const [input, setInput] = useState({
		categoryId: 0,
		subcategoryId: 0,
		cityId: 0,
		statusId: 1,
		title: "",
		place: "",
		phone: "",
		email: "",
		description: "",
		logo: null,
		pdf: null,
		startDate: "",
		endDate: "",
		originalPrice: "",
		villagedropdown: "",
		zipCode: "",
		discountedPrice: "",
		removeImage: false,
	});

	const [error, setError] = useState({
		categoryId: "",
		subcategoryId: "",
		title: "",
		description: "",
		cityId: "",
		startDate: "",
		endDate: "",
	});

	const handleSubmit = async (event) => {
		let valid = true;
		for (let key in error) {
			var errorMessage = getErrorMessage(key, input[key]);
			var newError = error;
			newError[key] = errorMessage;
			setError(newError);
			if (errorMessage) {
				valid = false;
			}
		}
		if (valid) {
			setUpdating(true);
			event.preventDefault();
			try {
				var response = newListing
					? await postListingsData(cityId, input)
					: await updateListingsData(cityId, input, listingId);
				if (newListing) {
					if (image1) {
						const form = new FormData();
						form.append("image", image1);
						await uploadListingImage(form, cityId, response.data.id);
					}
				} else if (image1) {
					const form = new FormData();
					form.append("image", image1);
					await uploadListingImage(form, cityId, input.id);
				} else if (input.removeImage) {
					await deleteListingImage(cityId, input.id);
				}
				var userProfile = await getProfile();
				var isAdmin = userProfile.data.data.roleId === 1;
				isAdmin
					? setSuccessMessage(t("listingUpdatedAdmin"))
					: setSuccessMessage(t("listingUpdated"));
				setErrorMessage(false);
				setTimeout(() => {
					setSuccessMessage(false);
					navigate("/Dashboard");
				}, 5000);
			} catch (error) {
				setErrorMessage(t("changesNotSaved"));
				setSuccessMessage(false);
				setTimeout(() => setErrorMessage(false), 5000);
			}
			setUpdating(false);
		} else {
			setErrorMessage(t("invalidData"));
			setSuccessMessage(false);
			setTimeout(() => setErrorMessage(false), 5000);
		}
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const accessToken =
			window.localStorage.getItem("accessToken") ||
			window.sessionStorage.getItem("accessToken");
		const refreshToken =
			window.localStorage.getItem("refreshToken") ||
			window.sessionStorage.getItem("refreshToken");
		if (!accessToken && !refreshToken) {
			navigateTo("/login");
		}
		var cityId = searchParams.get("cityId");
		setCityId(cityId);
		var listingId = searchParams.get("listingId");
		setListingId(listingId);
		if (listingId && cityId) {
			setNewListing(false);
			getVillages(cityId).then((response) => setVillages(response.data.data));
			getListingsById(cityId, listingId).then((listingsResponse) => {
				let listingData = listingsResponse.data.data;
				if (listingData.startDate)
					listingData.startDate = listingData.startDate.slice(0, 10);
				if (listingData.endDate)
					listingData.endDate = listingData.endDate.slice(0, 10);
				listingData.cityId = cityId;
				setInput(listingData);
				setDescription(listingData.description);
				setCategoryId(listingData.categoryId);
			});
		}
	}, []);

	useEffect(() => {
		let valid = true;
		for (let property in error) {
			if (error[property]) {
				valid = false;
			}
		}
	}, [error]);

	const onInputChange = (e) => {
		const { name, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
		validateInput(e);
	};

	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	const [description, setDescription] = useState("");

	// const onDescriptionChange = (newContent) => {
	// 	setInput((prev) => ({
	// 		...prev,
	// 		description: newContent.replace(/(<br>|<\/?p>)/gi, ""),
	// 	}));
	// 	console.log(input)
	// 	setDescription(newContent);
	// };

	const onDescriptionChange = (newContent) => {
		const hasNumberedList = newContent.includes("<ol>");
		const hasBulletList = newContent.includes("<ul>");
		let descriptions = [];
		let listType = "";
		if (hasNumberedList) {
			const regex = /<li>(.*?)(?=<\/li>|$)/gi;
			const matches = newContent.match(regex);
			descriptions = matches.map((match) => match.replace(/<\/?li>/gi, ""));
			descriptions = descriptions.map(
				(description, index) => `${index + 1}. ${description}`
			);
			listType = "ol";
		} else if (hasBulletList) {
			const regex = /<li>(.*?)(?=<\/li>|$)/gi;
			const matches = newContent.match(regex);
			descriptions = matches.map((match) => match.replace(/<\/?li>/gi, ""));
			descriptions = descriptions.map((description) => `- ${description}`);
			listType = "ul";
		} else {
			// No list tags found, treat the input as plain text
			setInput((prev) => ({
				...prev,
				description: newContent.replace(/(<br>|<\/?p>)/gi, ""), // Remove <br> and <p> tags
			}));
			console.log(input);
			setDescription(newContent);
			return;
		}
		const listHTML = `<${listType}>${descriptions
			.map((description) => `<li>${description}</li>`)
			.join("")}</${listType}>`;
		// Update text color to white
		const whiteTextListHTML = `<div style="color: white">${listHTML}</div>`;
		setInput((prev) => ({
			...prev,
			description: whiteTextListHTML,
		}));
		setDescription(newContent);
	};

	const getErrorMessage = (name, value) => {
		switch (name) {
			case "title":
				if (!value) {
					return t("pleaseEnterTitle");
				} else {
					return "";
				}

			case "cityId":
				if (!parseInt(value)) {
					return t("pleaseSelectCity");
				} else {
					return "";
				}

			case "categoryId":
				if (!parseInt(value)) {
					return t("pleaseSelectCategory");
				} else {
					return "";
				}

			case "subCategoryId":
				if (!value && parseInt(input.categoryId) == categoryByName.news) {
					return t("pleaseSelectSubcategory");
				} else {
					return "";
				}

			case "description":
				if (!value) {
					return t("pleaseEnterDescription");
				} else {
					return "";
				}

			case "startDate":
				if (!value && parseInt(input.categoryId) == categoryByName.events) {
					return t("pleaseEnterStartDate");
				} else {
					return "";
				}

			case "endDate":
				if (parseInt(input.categoryId) == categoryByName.events) {
					if (!value) {
						return t("pleaseEnterEndDate");
					} else {
						if (new Date(input.startDate) > new Date(value)) {
							return t("endDateBeforeStartDate");
						} else {
							return "";
						}
					}
				} else {
					return "";
				}

			default:
				return "";
		}
	};

	const validateInput = (e) => {
		let { name, value } = e.target;
		var errorMessage = getErrorMessage(name, value);
		setError((prevState) => {
			return { ...prevState, [name]: errorMessage };
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
		setResults([]);

		if (map) {
			// Check if the map object is available
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
			cityId: cityId,
			villageId: 0,
		}));
		if (parseInt(cityId))
			getVillages(cityId).then((response) => setVillages(response.data.data));
		validateInput(e);
	}
	const [categoryId, setCategoryId] = useState(0);
	const [subcategoryId, setSubcategoryId] = useState(0);

	const handleCategoryChange = (event) => {
		let categoryId = event.target.value;
		setCategoryId(categoryId);
		setInput((prevInput) => ({ ...prevInput, categoryId }));
		setSubcategoryId(null);
		validateInput(event);

		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("categoryId", categoryId);
		urlParams.delete("subcategoryId");
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.replaceState({}, "", newUrl);
	};

	const handleSubcategoryChange = (event) => {
		let subcategoryId = event.target.value;
		setInput((prevInput) => ({ ...prevInput, subcategoryId }));
		setSubcategoryId(subcategoryId);
		validateInput(event);
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("subcategoryId", subcategoryId);
		if (subcategoryId === 0) {
			urlParams.delete("subCategoryId");
		}
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.replaceState({}, "", newUrl);
	};

	function formatDateTime(dateTimeString) {
		return dateTimeString.replace("T", " ");
	}

	return (
		<section className="bg-slate-600 body-font relative">
			<SideBar />

			<div className="container w-auto px-5 py-2 bg-slate-600">
				<div className="bg-white mt-4 p-6 space-y-10">
					<h2
						style={{
							fontFamily: "Poppins, sans-serif",
						}}
						className="text-gray-900 text-lg mb-4 font-medium title-font"
					>
						{t("uploadPost")}
						<div className="my-4 bg-gray-600 h-[1px]"></div>
					</h2>
					<div className="relative mb-4">
						<label
							for="title"
							className="block text-sm font-medium text-gray-600"
						>
							{t("title")} *
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={input.title}
							onChange={onInputChange}
							onBlur={validateInput}
							required
							className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
							placeholder={t("enterTitle")}
						/>
						<div
							className="h-[24px] text-red-600"
							style={{
								visibility: error.title ? "visible" : "hidden",
							}}
						>
							{error.title}
						</div>
					</div>

					<div className="relative mb-4">
						<label
							for="title"
							className="block text-sm font-medium text-gray-600"
						>
							{t("city")} *
						</label>
						<select
							type="text"
							id="cityId"
							name="cityId"
							value={cityId}
							onChange={onCityChange}
							autocomplete="country-name"
							disabled={!newListing}
							className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
						>
							<option value={0}>{t("select")}</option>
							{cities.map((city) => (
								<option value={Number(city.id)}>{city.name}</option>
							))}
						</select>
						<div
							className="h-[24px] text-red-600"
							style={{
								visibility: error.cityId ? "visible" : "hidden",
							}}
						>
							{error.cityId}
						</div>
					</div>

					{villages.length > 0 && parseInt(cityId) ? (
						<div className="relative mb-4">
							<label
								for="title"
								className="block text-sm font-medium text-gray-600"
							>
								{t("village")}
							</label>
							<select
								type="villageId"
								id="villageId"
								name="villageId"
								value={input.villageId}
								onChange={onInputChange}
								onBlur={validateInput}
								autocomplete="country-name"
								className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
							>
								<option value={0}>{t("select")}</option>
								{villages.map((village) => (
									<option value={Number(village.id)}>{village.name}</option>
								))}
							</select>
						</div>
					) : (
						<span />
					)}

					<div className="relative mb-4">
						<label
							for="dropdown"
							className="block text-sm font-medium text-gray-600"
						>
							{t("category")} *
						</label>
						<select
							type="categoryId"
							id="categoryId"
							name="categoryId"
							value={categoryId}
							onChange={handleCategoryChange}
							required
							disabled={!newListing}
							className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
						>
							<option className="font-sans" value={0} key={0}>
								{t("chooseOneCategory")}
							</option>
							{Object.keys(categories).map((key) => {
								return (
									<option className="font-sans" value={key} key={key}>
										{t(categories[key])}
									</option>
								);
							})}
						</select>
						<div
							className="h-[24px] text-red-600"
							style={{
								visibility: error.categoryId ? "visible" : "hidden",
							}}
						>
							{error.categoryId}
						</div>
					</div>

					{categoryId == categoryByName.news && (
						<div className="relative mb-4">
							<label
								for="subcategoryId"
								className="block text-sm font-medium text-gray-600"
							>
								{t("subCategory")} *
							</label>
							<select
								type="subcategoryId"
								id="subcategoryId"
								name="subcategoryId"
								value={subcategoryId}
								onChange={handleSubcategoryChange}
								onBlur={validateInput}
								required
								className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
							>
								<option className="font-sans" value={0} key={0}>
									{t("chooseOneCategory")}
								</option>
								{Object.keys(subCategories).map((key) => {
									return (
										<option className="font-sans" value={key} key={key}>
											{t(subCategories[key])}
										</option>
									);
								})}
							</select>
							<div
								className="h-[24px] text-red-600"
								style={{
									visibility: error.subcategoryId ? "visible" : "hidden",
								}}
							>
								{error.selectedSubCategory}
							</div>
						</div>
					)}

					<div className="relative mb-4 grid grid-cols-2 gap-4">
						<div className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
							<label
								for="place"
								className="block text-sm font-medium text-gray-600"
							>
								{t("place")}
							</label>
							<input
								type="text"
								id="place"
								name="place"
								value={input.place}
								onChange={onInputChange}
								onBlur={validateInput}
								className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
								placeholder={t("enterPlace")}
							/>
						</div>
						<div className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
							<label
								for="zipCode"
								className="block text-sm font-medium text-gray-600"
							>
								{t("zipCode")}
							</label>
							<input
								type="text"
								id="zipCode"
								name="zipCode"
								value={input.zipCode}
								onChange={onInputChange}
								onBlur={validateInput}
								className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
								placeholder={t("enterPostal")}
							/>
						</div>
					</div>

					<div className="col-span-6">
						<label
							for="address"
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
								onBlur={validateInput}
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
										crossorigin=""
									/>
								</div>
							)}
						</div>
					</div>

					{categoryId == categoryByName.events && (
						<div className="relative mb-4">
							<div className="items-stretch py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
								<div className="relative">
									<div className="flex absolute inset-y-0 items-center pl-3 pointer-events-none">
										<svg
											aria-hidden="true"
											className="w-5 h-5 text-gray-600 dark:text-gray-400"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										></svg>
									</div>
									<label
										for="startDate"
										className="block text-sm font-medium text-gray-600"
									>
										{t("eventStartDate")} *
									</label>
									<input
										type="datetime-local"
										id="startDate"
										name="startDate"
										value={input.startDate}
										onChange={onInputChange}
										onBlur={validateInput}
										className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
										placeholder="Start Date"
									/>
									<div
										className="h-[24px] text-red-600"
										style={{
											visibility: error.startDate ? "visible" : "hidden",
										}}
									>
										{error.startDate}
									</div>
								</div>

								<div className="relative">
									<div className="flex absolute inset-y-0 items-center pl-3 pointer-events-none">
										<svg
											aria-hidden="true"
											className="w-5 h-5 text-gray-600 dark:text-gray-400"
											fill="currentColor"
											viewBox="0 0 20 20"
											xmlns="http://www.w3.org/2000/svg"
										></svg>
									</div>
									<label
										for="endDate"
										className="block text-sm font-medium text-gray-600"
									>
										{t("eventEndDate")} *
									</label>
									<input
										type="datetime-local"
										id="endDate"
										name="endDate"
										value={input.endDate.replace("T", " ")}
										onChange={onInputChange}
										onBlur={validateInput}
										className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
										placeholder="End Date"
									/>
									<div
										className="h-[24px] text-red-600"
										style={{
											visibility: error.endDate ? "visible" : "hidden",
										}}
									>
										{error.endDate}
									</div>
								</div>
							</div>
						</div>
					)}

					{(categoryId == categoryByName.offers ||
						categoryId == categoryByName.regionalProducts) && (
						<div className="relative mb-4 grid grid-cols-2 gap-4">
							<div className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
								<label
									for="place"
									className="block text-sm font-medium text-gray-600"
								>
									{t("originalPrice")}
								</label>
								<input
									type="text"
									id="originalPrice"
									name="originalPrice"
									value={input.originalPrice}
									onChange={onInputChange}
									onBlur={validateInput}
									required
									className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
									placeholder="Enter the price of the product"
								/>
							</div>
							<div className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
								<label
									for="place"
									className="block text-sm font-medium text-gray-600"
								>
									{t("discountedPrice")}
								</label>
								<input
									type="text"
									id="discountedPrice"
									name="discountedPrice"
									value={input.discountedPrice}
									onChange={onInputChange}
									onBlur={validateInput}
									required
									className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
									placeholder="Enter the price of the product"
								/>
							</div>
						</div>
					)}

					<div className="relative mb-4">
						<label
							for="place"
							className="block text-sm font-medium text-gray-600"
						>
							{t("telephone")}
						</label>
						<input
							type="text"
							id="phone"
							name="phone"
							value={input.phone}
							onChange={onInputChange}
							onBlur={validateInput}
							className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
							placeholder={t("pleaseEnterPhone")}
						/>
					</div>

					<div className="relative mb-4">
						<label
							for="place"
							className="block text-sm font-medium text-gray-600"
						>
							{t("email")}
						</label>
						<input
							type="email"
							id="email"
							name="email"
							value={input.email}
							onChange={onInputChange}
							onBlur={validateInput}
							required
							className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
							placeholder={t("emailExample")}
						/>
					</div>

					<div className="relative mb-4">
						<label
							for="description"
							className="block text-sm font-medium text-gray-600"
						>
							{t("description")} *
						</label>
						<ReactQuill
							type="text"
							id="description"
							name="description"
							ref={editor}
							value={description}
							onChange={(newContent) => onDescriptionChange(newContent)}
							onBlur={(range, source, editor) => {
								validateInput({
									target: {
										name: "description",
										value: editor.getHTML().replace(/(<br>|<\/?p>)/gi, ""),
									},
								});
							}}
							placeholder={t("writeSomethingHere")}
							className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-0 px-0 leading-8 transition-colors duration-200 ease-in-out shadow-md"
						/>
						<div
							className="h-[24px] text-red-600"
							style={{
								visibility: error.description ? "visible" : "hidden",
							}}
						>
							{error.description}
						</div>
					</div>
				</div>
			</div>

			{categoryId != categoryByName.roadTraffic && (
				<div className="container w-auto px-5 py-2 bg-slate-600">
					<div className="bg-white mt-4 p-6 space-y-10">
						<h2 className="text-gray-900 text-lg mb-4 font-medium title-font">
							{t("uploadLogo")}
							<div className="my-4 bg-gray-600 h-[1px]"></div>
						</h2>

						<div>
							<label className="block text-sm font-medium text-gray-700">
								{t("addLogoHere")}
							</label>
							<div
								className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-black px-6 pt-5 pb-6 bg-slate-200`}
								onDrop={handleDrop1}
								onDragOver={handleDragOver}
								onDragEnter={handleDragEnter}
								onDragLeave={handleDragLeave}
							>
								{image1 || input.logo ? (
									<div className="flex flex-col items-center">
										<img
											className="object-contain h-64 w-full mb-4"
											src={
												image1
													? URL.createObjectURL(image1)
													: process.env.REACT_APP_BUCKET_HOST + input.logo
											}
											alt="uploaded"
										/>
										<button
											className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
											onClick={handleRemoveImage1}
										>
											{t("remove")}
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
											{t("dragAndDropImage")}
										</p>
										<div className="relative mb-4 mt-8">
											<label className="file-upload-btn w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60">
												<span className="button-label">{t("upload")}</span>
												<input
													id="image1-upload"
													type="file"
													className="sr-only"
													onChange={handleInputChange}
												/>
											</label>
										</div>
									</div>
								)}
							</div>
						</div>

						{/* {(categoryId == categoryByName.officialnotification ||
							categoryId == categoryByName.regionalProducts ||
							categoryId == categoryByName.news ||
							categoryId == categoryByName.offerSearch) && (
							<div>
								<label className="block text-sm font-medium text-gray-700">
									{t("addPDFHere")}
								</label>
								<div
									className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-black px-6 pt-5 pb-6 bg-slate-200`}
									onDrop={handleDropPDF}
									onDragOver={handleDragOver}
									onDragEnter={handleDragEnter}
									onDragLeave={handleDragLeave}
								>
									{pdf || input.pdf ? (
										<div className="flex flex-col items-center">
											<p>{pdf ? pdf.name : input.pdf}</p>
											<button
												className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
												onClick={handleRemovePDF}
											>
												{t("remove")}
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
												{t("dragAndDropPDF")}
											</p>
											<div className="relative mb-4 mt-8">
												<label className="file-upload-btn w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60">
													<span className="button-label">{t("upload")}</span>
													<input
														id="pdf-upload"
														type="file"
														accept="application/pdf"
														className="sr-only"
														onChange={handlePDFInputChange}
													/>
												</label>
											</div>
										</div>
									)}
								</div>
							</div>
						)} */}
					</div>
				</div>
			)}

			<div className="container w-auto px-5 py-2 bg-slate-600">
				<div className="bg-white mt-4 p-6">
					<div className="py-2 mt-1 px-2">
						<button
							type="button"
							onClick={handleSubmit}
							disabled={updating}
							className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
						>
							{t("saveChanges")}
							{updating && (
								<svg
									aria-hidden="true"
									className="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
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
							<Alert type={"success"} message={successMessage} />
						)}
						{errorMessage && <Alert type={"danger"} message={errorMessage} />}
					</div>
				</div>
			</div>
		</section>
	);
}

export default UploadListings;
