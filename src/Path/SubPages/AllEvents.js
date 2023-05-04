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
import LISTINGSIMAGE from "../../assets/ListingsImage.png";
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
									.map((listing) => (
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
													src={listing.logo ? process.env.REACT_APP_BUCKET_HOST + listing.logo : LISTINGSIMAGE}
												/>
											</a>
											<div className="mt-10">
												<h2 className="text-gray-900 title-font text-lg font-bold text-center font-sans">
													{listing.title}
												</h2>
											</div>
											<div className="my-4 bg-gray-200 h-[1px]"></div>
										</div>
									))}
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
							To upload a new listing,{" "}
						</span>
						<a
							class="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-black"
							onClick={() => {
							localStorage.setItem("selectedItem", "Choose one category");
							navigateTo("/UploadListings");
							}}
						>
							Click here
						</a>
						</div>
					</div>
				)}
			</div>
			<div className="bottom-0 w-full">
				<Footer/>
			</div>
		</section>
	);
};

export default Events;
