import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./bodyContainer.css";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
	getListingsById,
	postListingsData,
	updateListingsData,
	uploadListingPDF,
	uploadListingImage,
	deleteListingImage,
} from "../Services/listingsApi";
import { getProfile } from "../Services/usersApi";
import { getCities } from "../Services/cities";
import { getVillages } from "../Services/villages";
import FormData from "form-data";
import Alert from "../Components/Alert";
import { getCategory, getNewsSubCategory } from "../Services/CategoryApi";
import { useAuth } from '../AuthContext';

function UploadListings() {
	const { t } = useTranslation();
	const editor = useRef(null);
	const [listingId, setListingId] = useState(0);
	const [newListing, setNewListing] = useState(true);
	const [updating, setUpdating] = useState(false);

	//Drag and Drop starts
	const [image, setImage] = useState(null);
	const [pdf, setPdf] = useState(null);
	const [localImageOrPdf, setLocalImageOrPdf] = useState(false);
	const [dragging, setDragging] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);

	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [categories, setCategories] = useState([]);
	const [subCategories, setSubCategories] = useState([]);
	const [startDate, setStartDate] = useState([]);
	const [endDate, setEndDate] = useState([]);
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();

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
		if (file) {
			if (file.type.startsWith("image/")) {
				setImage(file);
			} else if (file.type === "application/pdf") {
				setPdf(file);
			}
		}
		setDragging(false);
	}

	function handleInputChange(e) {
		e.preventDefault();
		const file = e.target.files[0];
		if (file) {
			if (file.type.startsWith("image/")) {
				setLocalImageOrPdf(true);
				setImage(file);
			} else if (file.type === "application/pdf") {
				setLocalImageOrPdf(true);
				setPdf(file);
			}
		}
	}

	function handleRemoveImage() {
		if (listingId) {
			setInput((prev) => ({
				...prev,
				removeImage: true,
				logo: null
			}));
		}
		setImage(null);
	}

	function handleRemovePDF() {
		if (listingId) {
			setInput((prev) => ({
				...prev,
				removePdf: true,
				pdf: null
			}));
		}
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
		address: "",
		phone: "",
		email: "",
		description: "",
		logo: null,
		pdf: null,
		startDate: "",
		endDate: "",
		originalPrice: "",
		zipCode: "",
		discountedPrice: "",
		removeImage: false,
		removePdf: false,
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
				let response = await (newListing
					? postListingsData(cityId, input)
					: updateListingsData(cityId, input, listingId));
				if (newListing) {
					setListingId(response.data.id);
				}

				if (input.removeImage || input.removePdf) {
					await deleteListingImage(cityId, listingId);
				}

				if (localImageOrPdf) {
					if (image) {
						// Upload image if it exists
						const imageForm = new FormData();
						imageForm.append("image", image);
						await uploadListingImage(imageForm, cityId, response.data.id || listingId);
					} else if (pdf) {
						// Upload PDF if it exists
						const pdfForm = new FormData();
						pdfForm.append("pdf", pdf);
						await uploadListingPDF(pdfForm, cityId, response.data.id || listingId);
					}
				}

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
		if (!isAuthenticated()) {
			window.location.href = "/login";
		}
		var cityId = searchParams.get("cityId");
		getCategory().then((response) => {
			const catList = {};
			response?.data.data.forEach((cat) => {
				catList[cat.id] = cat.name;
			});
			setCategories(catList);
		});
		getNewsSubCategory().then((response) => {
			const subcatList = {};
			response?.data.data.forEach((subCat) => {
				subcatList[subCat.id] = subCat.name;
			});
			setSubCategories(subcatList);
			console.log(response.data.data)
		});
		setInput((prevInput) => ({ ...prevInput, categoryId }));
		setSubcategoryId(null);
		setCityId(cityId);
		var listingId = searchParams.get("listingId");
		getProfile().then(response => {
			setIsAdmin(response.data.data.roleId === 1);
		});
		if (listingId && cityId) {
			setListingId(parseInt(listingId));
			setNewListing(false);
			getVillages(cityId).then((response) => setVillages(response.data.data));
			getListingsById(cityId, listingId).then((listingsResponse) => {
				let listingData = listingsResponse.data.data;
				// if (listingData.startDate)
				// 	listingData.startDate = listingData.startDate.slice(0, 10);
				// if (listingData.endDate)
				// 	listingData.endDate = listingData.endDate.slice(0, 10);
				listingData.cityId = cityId;
				setInput(listingData);
				setStartDate(listingData.startDate);
				setEndDate(listingData.endDate);
				setDescription(listingData.description);
				setCategoryId(listingData.categoryId);
				setSubcategoryId(listingData.subcategoryId);
				if (listingData.logo) {
					setImage(process.env.REACT_APP_BUCKET_HOST + listingData.logo)
				} else if (listingData.pdf) {
					setPdf({
						link: process.env.REACT_APP_BUCKET_HOST + listingData.pdf,
						name: listingData.pdf.split('/')[1]
					})
				}
			});
		}
	}, [isAuthenticated]);

	function categoryDescription(category) {
		if (category === "4") {
			return "clubsDescription";
		} else if (category === "10") {
			return "companyPortraitsDescription";
		} else {
			return "";
		}
	}


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

	const onDescriptionChange = (newContent) => {
		let descriptionHTML = newContent;

		// If there are <ol> or <ul> tags, replace them with plain text representation
		const hasNumberedList = /<ol>(.*?)<\/ol>/gis.test(newContent);
		const hasBulletList = /<ul>(.*?)<\/ul>/gis.test(newContent);

		if (hasNumberedList || hasBulletList) {
			const regex = /<ol>(.*?)<\/ol>|<ul>(.*?)<\/ul>/gis;
			descriptionHTML = newContent.replace(regex, (match) => {
				// Replace <li> tags with the appropriate marker (either numbers or bullets)
				const isNumberedList = /<ol>(.*?)<\/ol>/gis.test(match);
				const listItems = match.match(/<li>(.*?)(?=<\/li>|$)/gi);
				const plainTextListItems = listItems.map((item, index) => {
					const listItemContent = item.replace(/<\/?li>/gi, "");
					return isNumberedList
						? `${index + 1}. ${listItemContent}`
						: `- ${listItemContent}`;
				});
				return plainTextListItems.join("\n");
			});
		}
		setInput((prev) => ({
			...prev,
			description: descriptionHTML,
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
				if (!value && parseInt(input.categoryId) == 1) {
					return t("pleaseSelectSubcategory");
				} else {
					return "";
				}

			case "description":
				if (!value) {
					return t("pleaseEnterDescription");
				} else if (value.length > 65535) {
					return t("characterLimitReacehd");
				}
				else {
					return "";
				}

			case "startDate":
				if (!value && parseInt(input.categoryId) == 3) {
					return t("pleaseEnterStartDate");
				} else {
					return "";
				}

			// case "endDate":
			// 	if (parseInt(input.categoryId) === 3) {
			// 		if (value && new Date(input.startDate) > new Date(value)) {
			// 			return t("endDateBeforeStartDate");
			// 		} else {
			// 			return "";
			// 		}
			// 	} else {
			// 		return "";
			// 	}

			case "endDate":
				if (parseInt(input.categoryId) === 3) {
					if (!value) {
						return t("pleaseEnterEndDate");
					} else {
						if (new Date(input.startDate) > new Date(value)) {
							return t("endDateBeforeStartDate");
						} else {
							return "";
						}
						return "";
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

	// const [date, setDate] = useState();
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

	const handleCategoryChange = async (event) => {
		let categoryId = event.target.value;
		setCategoryId(categoryId);
		if (categoryId == 1) {
			const subCats = await getNewsSubCategory();
			const subcatList = {};
			subCats?.data.data.forEach((subCat) => {
				subcatList[subCat.id] = subCat.name;
			});
			setSubCategories(subcatList);
		}
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
		setSubcategoryId(subcategoryId);
		setInput((prevInput) => ({ ...prevInput, subcategoryId }));
		validateInput(event);
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("subcategoryId", subcategoryId);
		if (subcategoryId === 0) {
			urlParams.delete("subCategoryId");
		}
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.replaceState({}, "", newUrl);
	};

	function formatDateTime(dateTime) {
		const date = new Date(dateTime);
		const year = date.getFullYear();
		const month = String(date.getMonth() + 1).padStart(2, "0");
		const day = String(date.getDate()).padStart(2, "0");
		const hours = String(date.getHours()).padStart(2, "0");
		const minutes = String(date.getMinutes()).padStart(2, "0");
		const seconds = String(date.getSeconds()).padStart(2, "0");
		const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
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
							htmlFor="title"
							className="block text-sm font-medium text-gray-600"
						></label>
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
							htmlFor="title"
							className="block text-sm font-medium text-gray-600"
						>
							{t("city")} *
						</label>
						<select
							type="text"
							id="cityId"
							name="cityId"
							value={cityId || 0}
							onChange={onCityChange}
							autoComplete="country-name"
							disabled={!newListing}
							className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
						>
							<option value={0}>{t("select")}</option>
							{cities.map((city) => (
								<option key={Number(city.id)} value={Number(city.id)}>{city.name}</option>
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
								htmlFor="title"
								className="block text-sm font-medium text-gray-600"
							>
								{t("village")}
							</label>
							<select
								type="villageId"
								id="villageId"
								name="villageId"
								value={input.villageId || 0}
								onChange={onInputChange}
								onBlur={validateInput}
								autoComplete="country-name"
								className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
							>
								<option value={0}>{t("select")}</option>
								{villages.map((village) => (
									<option key={Number(village.id)} value={Number(village.id)}>{village.name}</option>
								))}
							</select>
						</div>
					) : (
						<span />
					)}

					<div className="relative mb-4">
						<label
							htmlFor="dropdown"
							className="block text-sm font-medium text-gray-600"
						>
							{t("category")} *
						</label>
						<select
							type="categoryId"
							id="categoryId"
							name="categoryId"
							value={categoryId || 0}
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
										{t(categories[key])} {t(categoryDescription(key))}
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

					{categoryId == 1 && (
						<div className="relative mb-4">
							<label
								htmlFor="subcategoryId"
								className="block text-sm font-medium text-gray-600"
							>
								{t("subCategory")} *
							</label>
							<select
								type="subcategoryId"
								id="subcategoryId"
								name="subcategoryId"
								value={subcategoryId || 0}
								onChange={handleSubcategoryChange}
								onBlur={validateInput}
								required
								disabled={!newListing}
								className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
							>
								<option className="font-sans" value={0} key={0}>
									{t("chooseOneSubCategory")}
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
								htmlFor="place"
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
								htmlFor="zipCode"
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
								value={input.address}
								onChange={onInputChange}
								onBlur={validateInput}
								className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
								placeholder={t("enterAddress")}
							/>
						</div>
					</div>

					{categoryId == 3 && (
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
										htmlFor="startDate"
										className="block text-sm font-medium text-gray-600"
									>
										{t("eventStartDate")} *
									</label>
									<input
										type="datetime-local"
										id="startDate"
										name="startDate"
										value={formatDateTime(input.startDate)}
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
										htmlFor="endDate"
										className="block text-sm font-medium text-gray-600"
									>
										{t("eventEndDate")} *
									</label>
									<input
										type="datetime-local"
										id="endDate"
										name="endDate"
										value={formatDateTime(input.endDate)}
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

					{(categoryId == 12 || categoryId == 5) && (
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
							htmlFor="place"
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
							htmlFor="place"
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
							htmlFor="description"
							className="block text-sm font-medium text-gray-600"
						>
							{t("description")} *
						</label>
						<ReactQuill
							type="text"
							id="description"
							name="description"
							ref={editor}
							value={input.description}
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

			<div className="container w-auto px-5 py-2 bg-slate-600">
				<div className="bg-white mt-4 p-6 space-y-10">
					<h2 className="text-gray-900 text-lg mb-4 font-medium title-font">
						{t("uploadLogo")}
						<div className="my-4 bg-gray-600 h-[1px]"></div>
					</h2>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							{t("addFileHere")}
						</label>
						<div
							className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-black px-6 pt-5 pb-6 bg-slate-200`}
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onDragEnter={handleDragEnter}
							onDragLeave={handleDragLeave}
						>
							{image ? (
								<div className="flex flex-col items-center">
									<img
										className="object-contain h-64 w-full mb-4"
										src={localImageOrPdf ? URL.createObjectURL(image) : image}
										alt="uploaded"
									/>
									<button
										className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
										onClick={handleRemoveImage}
									>
										{t("remove")}
									</button>
								</div>
							) : pdf ? (
								<div className="flex flex-col items-center">
									<p><a target="_blank" href={localImageOrPdf ? URL.createObjectURL(pdf) : pdf.link}>{pdf.name}</a></p>
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
										{t("dragAndDropImageOrPDF")}
									</p>
									<div className="relative mb-4 mt-8">
										<label
											className={`file-upload-btn w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded`}
										>
											<span className="button-label">{t("upload")}</span>
											<input
												id="file-upload"
												type="file"
												accept="image/*,.pdf"
												className="sr-only"
												onChange={handleInputChange}
											/>
										</label>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

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
