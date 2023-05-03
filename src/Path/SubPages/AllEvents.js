import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useNavigate } from "react-router-dom";
import {
	sortByTitleAZ,
	sortByTitleZA,
	sortRecent,
	sortOldest,
} from "../../Services/helper";
import HOMEPAGEIMG from "../../assets/homeimage.jpg";
import { useTranslation } from "react-i18next";

import {
	getListings,
	getListingsByCity,
	getAllListings,
} from "../../Services/listingsApi";

import { getCities } from "../../Services/cities";
import { getVillages } from "../../Services/villages";
import Footer from "../../Components/Footer";

const Events = () => {
	window.scrollTo(0, 0);
	const { t, i18n } = useTranslation();
	const [cityId, setCityId] = useState(0);
	const [villages, setVillages] = useState([]);
	const [cities, setCities] = useState([]);
	const [listingId, setListingId] = useState(0);
	const [listings, setListings] = useState([]);
	const [categoryId, setCategoryId] = useState();
	const [newListing, setNewListing] = useState(true);
	const [description, setDescription] = useState("");
	const [title, setTitle] = useState("");

	const [categories, setCategories] = useState([]);
	async function onCityChange(e) {
		const cityId = e.target.value;
		setCityId(cityId);
		setInput((prev) => ({
			...prev,
			villageId: 0,
		}));
		getVillages(cityId).then((response) => setVillages(response.data.data));
	}
	useEffect(() => {
		getCities().then((citiesResponse) => {
			setCities(citiesResponse.data.data);
		});
	}, []);

	// Selected Items Deletion Starts
	const selectedItem = localStorage.getItem("selectedItem");
	const selectedItemLocation = localStorage.getItem("selectedItemLocation");
	// Selected Items Deletion Ends

	const [input, setInput] = useState({
		//"villageId": 1,
		categoryId: 0,
		subcategoryId: 0,
	});

	const [selectedCategory, setSelectedCategory] = useState("");

	const handleCategoryChange = (event) => {
		let categoryId;
		console.log(event.target.value);
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
		setCategoryId(categoryId);

		const urlParams = new URLSearchParams(window.location.search);
		if (categoryId) {
			urlParams.set("categoryId", categoryId);
		}
		const cityIdParam = urlParams.get("cityId");
		if (cityIdParam) {
			urlParams.set("cityId", cityIdParam);
		}
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.pushState({}, "", newUrl);
	};

	// const handleLocationChange = (event) => {
	// 	console.log('Selected city value:', event.target.value);
	// 	const cityId = event.target.value;
	// 	if (cityId === "Default") {
	// 	setCityId(null);
	// 	const urlParams = new URLSearchParams(window.location.search);
	// 	urlParams.delete("cityId"); // Remove cityId parameter from URL
	// 	const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
	// 	window.history.pushState({}, "", newUrl);
	// 	return;
	// 	} else {
	// 	setCityId(cityId);
	// 	}
	// 	const urlParams = new URLSearchParams(window.location.search);
	// 	urlParams.set("cityId", cityId);
	// 	const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
	// 	window.history.pushState({}, "", newUrl);
	// };
	const [selectedCity, setSelectedCity] = useState("Default");

	const handleLocationChange = (event) => {
		console.log("Selected city value:", event.target.value);
		const cityId = event.target.value;
		if (cityId === "Default") {
			setSelectedCity("Default");
			setCityId(null);
			const urlParams = new URLSearchParams(window.location.search);
			urlParams.delete("cityId"); // Remove cityId parameter from URL
			const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
			window.history.pushState({}, "", newUrl);
			return;
		} else {
			setSelectedCity(cityId);
			setCityId(cityId);
		}
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("cityId", cityId);
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.pushState({}, "", newUrl);
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const categoryIdParam = urlParams.get("categoryId");
		const cityIdParam = urlParams.get("cityId");
		if (categoryIdParam) {
			setCategoryId(categoryIdParam);
			switch (parseInt(categoryIdParam)) {
				case 1:
					setSelectedCategory("News");
					break;
				case 2:
					setSelectedCategory("Road Works / Traffic");
					break;
				case 3:
					setSelectedCategory("Events");
					break;
				case 4:
					setSelectedCategory("Clubs");
					break;
				case 5:
					setSelectedCategory("Regional Products");
					break;
				case 6:
					setSelectedCategory("Offer / Search");
					break;
				case 7:
					setSelectedCategory("New Citizen Info");
					break;
				case 8:
					setSelectedCategory("Defect Report");
					break;
				case 9:
					setSelectedCategory("Lost And Found");
					break;
				case 10:
					setSelectedCategory("Company Portraits");
					break;
				case 11:
					setSelectedCategory("Carpooling And Public Transport");
					break;
				case 12:
					setSelectedCategory("Offers");
					break;
				default:
					setSelectedCategory("");
					break;
			}
		}
		if (cityIdParam) {
			setSelectedCity(cityIdParam);
			setCityId(cityIdParam);
		} else {
			setSelectedCity("Default");
		}
	}, []);

	useEffect(() => {
		if (categoryId) {
			if (cityId) {
				getListingsByCity(cityId, { categoryId: categoryId }).then(
					(response) => {
						const sortedListings = sortRecent(response.data.data);
						setListings(sortedListings);
					}
				);
			} else {
				getListings({ categoryId: categoryId }).then((response) => {
					const sortedListings = sortRecent(response.data.data);
					setListings(sortedListings);
				});
			}
		} else if (cityId) {
			if (categoryId) {
				getListings({ categoryId: categoryId }).then((response) => {
					const sortedListings = sortRecent(response.data.data);
					setListings(sortedListings);
				});
			} else {
				getListingsByCity(cityId, { categoryId: categoryId }).then(
					(response) => {
						console.log(response.data.data);
						const sortedListings = sortRecent(response.data.data);
						setListings(sortedListings);
					}
				);
			}
		} else {
			getAllListings().then((response) => {
				const sortedListings = sortRecent(response.data.data);
				const slicedListing = sortedListings;
				setListings([...slicedListing]);
			});
		}
	}, [categoryId, cityId]);

	const [selectedSortOption, setSelectedSortOption] = useState("");
	function handleSortOptionChange(event) {
		setSelectedSortOption(event.target.value);
	}

	let navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	useEffect(() => {
		switch (selectedSortOption) {
			case "titleAZ":
				setListings([...sortByTitleAZ(listings)]);
				break;
			case "titleZA":
				setListings([...sortByTitleZA(listings)]);
				break;
			case "recent":
				setListings([...sortRecent(listings)]);
				break;
			case "oldest":
				setListings([...sortOldest(listings)]);
				break;
			default:
				break;
		}
	}, [selectedSortOption]);

	const [content, setContent] = useState("A");
	const handleButtonClick = (value) => {
		setContent(value);
	};

	const [customerServiceDataload, setcustomerServiceDataload] = useState(false);

	const customerServiceData = () => {
		setcustomerServiceDataload(true);
		setSelectedLink("customerService");
	};
	const onCancel = () => {
		setcustomerServiceDataload(false);
		setSelectedLink("current");
	};

	const [selectedLink, setSelectedLink] = useState("current");

	const [location, setLocation] = useState("");

	// Pre-select the corresponding filter option starts
	const urlParams = new URLSearchParams(window.location.search);
	const filterName = urlParams.get("filterName");

	if (filterName) {
		const buttonFilter = document.getElementById("button-filter");
		buttonFilter.value = filterName;
	}

	function handleLocationSubmit(event) {
		event.preventDefault();
		// Do something with the location data, like pass it to a parent component
	}

	return (
		<section class="text-gray-600 body-font relative">
			<HomePageNavBar />
			<div class="container-fluid py-0 mr-0 ml-0 mt-20 w-full flex flex-col">
				<div class="w-full mr-0 ml-0">
					<div class="lg:h-64 md:h-64 h-72 overflow-hidden px-0 py-1">
						<div class="relative lg:h-64 md:h-64 h-72">
							<img
								alt="ecommerce"
								class="object-cover object-center h-full w-full"
								src={HOMEPAGEIMG}
							/>
							<div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
								{cityId && categoryId ? (
									<h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
										{selectedCategory} {selectedItemLocation}
									</h1>
								) : cityId ? (
									<h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
										{selectedItemLocation}
									</h1>
								) : categoryId ? (
									<h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
										{selectedCategory}
									</h1>
								) : (
									<h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
										{t("allListings")}
									</h1>
								)}

								<div>
									<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-4 md:gap-4 gap-2 relative justify-center place-items-center lg:px-10 md:px-5 sm:px-0 px-2 py-0 mt-0 mb-0">
										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-0 w-full">
											{cities.map((city) => (
												<select
													id="button-filter"
													name="country"
													autocomplete="country-name"
													onChange={handleLocationChange}
													value={selectedCity}
													class="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
												>
													<option class="font-sans" value="Default">
														{t("chooseOneLocation")}
													</option>
													<option class="font-sans" value={city.id}>
														{city.name}
													</option>
												</select>
											))}
										</div>

										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-0 w-full">
											<select
												id="button-filter"
												name="country"
												autocomplete="country-name"
												onChange={handleCategoryChange}
												value={selectedCategory}
												class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
											>
												<option class="font-sans">{selectedItem}</option>
												{selectedItem !== "News" ? (
													<option value="News">{t("news")}</option>
												) : null}
												{selectedItem !== "Road Works / Traffic" ? (
													<option
														class="font-sans"
														value="Road Works / Traffic"
													>
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

										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-0 w-full">
											<select
												id="country"
												name="country"
												value={selectedSortOption}
												onChange={handleSortOptionChange}
												autocomplete="country-name"
												class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
											>
												<option value="">{t("sort")}</option>
												<option value="titleAZ">{t("atoztitle")}</option>
												<option value="titleZA">{t("ztoatitle")}</option>
												<option value="recent">{t("recent")}</option>
												<option value="oldest">{t("oldest")}</option>
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div>
				{listings && listings.length > 0 ? (
					<div class="bg-white p-6 mt-20 mb-20 flex flex-wrap gap-10 justify-center">
						<div class="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
							{/* {listingsData && listingsData.slice(0, 9).map((listing) => ( */}
							{listings &&
								listings
									.filter((listing) => listing.statusId === 1)
									.map(
										(listing) => (
											console.log("Listing city ID:", listing.cityId),
											(
												<div
													onClick={() => {
														if (cityId) {
															localStorage.setItem(
																"selectedCategoryId",
																listing.categoryId
															);
															navigateTo(
																`/HomePage/EventDetails?listingId=${listing.id}&cityId=${cityId}`
															);
														} else {
															localStorage.setItem(
																"selectedCategoryId",
																listing.categoryId
															);
															navigateTo(
																`/HomePage/EventDetails?listingId=${listing.id}&cityId=${listing.cityId}`
															);
														}
													}}
													className="lg:w-96 md:w-64 h-96 pb-20 w-full shadow-xl rounded-lg cursor-pointer"
												>
													<a className="block relative h-64 rounded overflow-hidden">
														<img
															alt="ecommerce"
															className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
															src={
																process.env.REACT_APP_BUCKET_HOST + listing.logo
															}
														/>
													</a>
													<div className="mt-10">
														<h2 className="text-gray-900 title-font text-lg font-bold text-center font-sans">
															{listing.title}
														</h2>
													</div>
													<div className="my-4 bg-gray-200 h-[1px]"></div>
												</div>
											)
										)
									)}
						</div>
					</div>
				) : (
					<div>
						<div class="flex items-center justify-center">
							<h1 class=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
								Currently there is no listings to display !
							</h1>
						</div>

						<div class="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
							<span class="font-sans text-black">
								To see all of our listings,{" "}
							</span>
							<a
								class="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-black"
								onClick={() => {
									localStorage.setItem("selectedItem", "Choose one category");
									navigateTo("/ViewMoreListings");
								}}
							>
								Click here
							</a>
						</div>
					</div>
				)}
			</div>

			<footer class="text-center lg:text-left bg-black text-white">
				<div class="mx-6 py-10 text-center md:text-left">
					<div class="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
						<div class="">
							<h6
								class="
						uppercase
						font-semibold
						mb-4
						flex
						items-center
						justify-center
						md:justify-start font-sans
						"
							>
								<svg
									aria-hidden="true"
									focusable="false"
									data-prefix="fas"
									data-icon="cubes"
									class="w-4 mr-3"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path
										fill="currentColor"
										d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z"
									></path>
								</svg>
								Smart Regions
							</h6>
							<div class="uppercase font-semibold mb-4 flex justify-center md:justify-start gap-4">
								<a
									href="https://www.facebook.com/people/HEIDI-Heimat-Digital/100063686672976/"
									class=" text-white rounded-full bg-gray-500 p-2"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
									</svg>
								</a>
								<a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
									</svg>
								</a>
								<a
									href="https://www.instagram.com/heidi.app/?hl=de"
									class=" text-white rounded-full bg-gray-500 p-2"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
									</svg>
								</a>
								<a
									href="https://www.linkedin.com/company/heidi-heimat-digital/mycompany/"
									class=" text-white rounded-full bg-gray-500 p-2"
								>
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="currentColor"
										viewBox="0 0 24 24"
									>
										<path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
									</svg>
								</a>
							</div>
						</div>
						<div class="">
							<h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
								Learn More
							</h6>
							<p class="mb-4">
								<a href="https://heidi-app.de/" class="text-gray-600 font-sans">
									developer community
								</a>
							</p>
							<p class="mb-4">
								<a href="https://heidi-app.de/" class="text-gray-600 font-sans">
									Contact us
								</a>
							</p>
							<p class="mb-4">
								<a href="/login" class="text-gray-600 font-sans">
									Log in
								</a>
							</p>
						</div>
						<div class="">
							<h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
								Leagal
							</h6>
							<p class="mb-4">
								<a href="/ImprintPage" class="text-gray-600 font-sans">
									imprint
								</a>
							</p>
							<p class="mb-4">
								<a href="/PrivacyPolicy" class="text-gray-600 font-sans">
									terms and conditions
								</a>
							</p>
							<p class="mb-4">
								<a href="#!" class="text-gray-600 font-sans">
									Data protection
								</a>
							</p>
							<p>
								<a href="#!" class="text-gray-600 font-sans">
									Right of withdrawal
								</a>
							</p>
						</div>
						<div class="">
							<h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
								Secure the APP now!
							</h6>
						</div>
					</div>
				</div>
				<div class="text-center p-6 bg-black">
					<div className="my-4 text-gray-600 h-[1px]"></div>
					<span class="font-sans">
						© HeidiTheme 2023. All rights reserved. Created by{" "}
					</span>
					<a
						class="text-white font-semibold underline font-sans"
						href="https://heidi-app.de/"
					>
						HeimatDigital
					</a>
				</div>
			</footer>
		</section>
	);
};

export default Events;
