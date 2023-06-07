// import React, { useState, useEffect } from "react";
// import HomePageNavBar from "../../Components/HomePageNavBar";
// import { getDashboarddata } from "../../Services/dashboarddata";
// import { useNavigate } from "react-router-dom";
// import HOMEPAGEIMG from "../../assets/homeimage.jpg";
// import { useTranslation } from "react-i18next";
// import { getCategoriesdata } from "../../Services/CategoriesData";
// import { getListings, getListingsByCity } from "../../Services/listingsApi";
// import { getCities } from "../../Services/cities";
// import { getVillages } from "../../Services/villages";
// import Footer from "../../Components/Footer";
// import {
// 	sortByTitleAZ,
// 	sortByTitleZA,
// 	sortRecent,
// 	sortOldest,
// } from "../../Services/helper";

// const Places = () => {
// 	window.scrollTo(0, 0);

// 	const [input, setInput] = useState({
// 		//"villageId": 1,
// 		categoryId: 0,
// 		subcategoryId: 0,
// 		sourceId: 1,
// 		userId: 2,
// 	});

// 	const [dashboarddata, setDashboarddata] = useState({ listings: [] });
// 	useEffect(() => {
// 		getDashboarddata().then((response) => {
// 			setDashboarddata(response);
// 		});
// 		document.title = selectedItemLocation;
// 	}, []);

// 	let navigate = useNavigate();
// 	const navigateTo = (path) => {
// 		if (path) {
// 			navigate(path);
// 		}
// 	};

// 	const [listings, setListings] = useState([]);

// 	const [selectedCategory, setSelectedCategory] = useState("");

// 	//populate the events titles starts
// 	const [categoriesdata, setCategoriesdata] = useState({
// 		categoriesListings: [],
// 	});
// 	useEffect(() => {
// 		getCategoriesdata().then((response) => {
// 			setCategoriesdata(response);
// 		});
// 		document.title = selectedItemLocation;
// 	}, []);

// 	//populate the events titles Ends
// 	// Selected Items Deletion Starts
// 	const selectedItemLocation = localStorage.getItem("selectedItemLocation");
// 	// Selected Items Deletion Ends

// 	function handleDashboardChange(event) {
// 		setDashboarddata({
// 			...dashboarddata,
// 			[event.target.name]: event.target.value,
// 		});
// 	}
// 	// Selected Items Deletion Starts
// 	const selectedItem = localStorage.getItem("selectedItem");
// 	// Selected Items Deletion Ends

// 	const [selectedSortOption, setSelectedSortOption] = useState("");
// 	function handleSortOptionChange(event) {
// 		setSelectedSortOption(event.target.value);
// 	}

// 	useEffect(() => {
// 		switch (selectedSortOption) {
// 			case "titleAZ":
// 				setListings([...sortByTitleAZ(listings)]);
// 				break;
// 			case "titleZA":
// 				setListings([...sortByTitleZA(listings)]);
// 				break;
// 			case "recent":
// 				setListings([...sortRecent(listings)]);
// 				break;
// 			case "oldest":
// 				setListings([...sortOldest(listings)]);
// 				break;
// 			default:
// 				break;
// 		}
// 	}, [selectedSortOption, listings]);

// 	const [content, setContent] = useState("A");
// 	const handleButtonClick = (value) => {
// 		setContent(value);
// 	};

// 	const [customerServiceDataload, setcustomerServiceDataload] = useState(false);

// 	const customerServiceData = () => {
// 		setcustomerServiceDataload(true);
// 		setSelectedLink("customerService");
// 	};
// 	const onCancel = () => {
// 		setcustomerServiceDataload(false);
// 		setSelectedLink("current");
// 	};

// 	const [selectedLink, setSelectedLink] = useState("current");

// 	const { t, i18n } = useTranslation();

// 	const [categoryId, setCategoryId] = useState();
// 	const [cityId, setCityId] = useState(0);
// 	const [cities, setCities] = useState([]);
// 	const [villages, setVillages] = useState([]);
// 	async function onCityChange(e) {
// 		const cityId = e.target.value;
// 		setCityId(cityId);
// 		setInput((prev) => ({
// 			...prev,
// 			villageId: 0,
// 		}));
// 		getVillages(cityId).then((response) => setVillages(response.data.data));
// 	}
// 	useEffect(() => {
// 		getCities().then((citiesResponse) => {
// 			setCities(citiesResponse.data.data);
// 		});
// 	}, []);
// 	const handleCategoryChange = (event) => {
// 		let categoryId;
// 		switch (event.target.value) {
// 			case "News":
// 				categoryId = 1;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;
// 			case "Road Works / Traffic":
// 				categoryId = 2;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;
// 			case "Events":
// 				categoryId = 3;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;
// 			case "Clubs":
// 				categoryId = 4;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;
// 			case "Regional Products":
// 				categoryId = 5;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;
// 			case "Offer / Search":
// 				categoryId = 6;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;
// 			case "New Citizen Info":
// 				categoryId = 7;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;
// 			case "Defect Report":
// 				categoryId = 8;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;
// 			case "Lost And Found":
// 				categoryId = 9;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;
// 			case "Company Portraits":
// 				categoryId = 10;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;
// 			case "Carpooling And Public Transport":
// 				categoryId = 11;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;
// 			case "Offers":
// 				categoryId = 12;
// 				setInput({ ...input, categoryId });
// 				setSelectedCategory(event.target.value);
// 				break;

// 			default:
// 				categoryId = 0;
// 				break;
// 		}
// 		setCategoryId(categoryId);
// 		const urlParams = new URLSearchParams(window.location.search);
// 		urlParams.set("categoryId", categoryId);
// 		const cityIdParam = urlParams.get("cityId");
// 		if (cityIdParam) {
// 			urlParams.set("cityId", cityIdParam);
// 		}

// 		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
// 		window.history.pushState({}, "", newUrl);
// 	};

// 	const handleLocationChange = (event) => {
// 		const cityId = event.target.value;
// 		setCityId(cityId);
// 		const urlParams = new URLSearchParams(window.location.search);
// 		urlParams.set("cityId", cityId);
// 		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
// 		window.history.pushState({}, "", newUrl);
// 	};

// 	useEffect(() => {
// 		const urlParams = new URLSearchParams(window.location.search);
// 		const categoryIdParam = urlParams.get("categoryId");
// 		const cityIdParam = urlParams.get("cityId");

// 		if (categoryIdParam) {
// 			setCategoryId(categoryIdParam);
// 		}

// 		if (cityIdParam) {
// 			setCityId(cityIdParam);
// 		}
// 	}, []);

// 	useEffect(() => {
// 		if (cityId) {
// 			if (categoryId) {
// 				getListings({ categoryId: categoryId }).then((response) => {
// 					const sortedListings = sortRecent(response.data.data);
// 					setListings(sortedListings);
// 				});
// 			} else {
// 				getListingsByCity(cityId, { categoryId: categoryId }).then(
// 					(response) => {
// 						const sortedListings = sortRecent(response.data.data);
// 						setListings(sortedListings);
// 					}
// 				);
// 			}
// 		}
// 	}, [cityId, categoryId]);
// 	function handleSortOptionChange(event) {
// 		setSelectedSortOption(event.target.value);
// 	}

// 	return (
// 		<section class="text-gray-600 body-font relative">
// 			<HomePageNavBar />
// 			<div class="container-fluid py-0 mr-0 ml-0 mt-20 w-full flex flex-col">
// 				<div class="w-full mr-0 ml-0">
// 					<div class="h-64 overflow-hidden px-1 py-1">
// 						<div class="relative h-64">
// 							<img
// 								alt="ecommerce"
// 								class="object-cover object-center h-full w-full"
// 								src={HOMEPAGEIMG}
// 							/>
// 							<div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
// 								<h1 class="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4">
// 									{selectedItemLocation}
// 								</h1>
// 								<div>
// 									<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 relative justify-center place-items-center lg:px-10 md:px-5 sm:px-0 px-2 py-0 mt-0 mb-0">
// 										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2 w-full">
// 											{cities.map((city) => (
// 												<select
// 													id="button-filter"
// 													name="country"
// 													autocomplete="country-name"
// 													onChange={handleLocationChange}
// 													class="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
// 												>
// 													<option class="font-sans" value="Default">
// 														{selectedItemLocation}
// 													</option>
// 													{cities.map(
// 														(city) =>
// 															selectedItemLocation !== city.name && (
// 																<option class="font-sans" value={city.id}>
// 																	{city.name}
// 																</option>
// 															)
// 													)}
// 												</select>
// 											))}
// 										</div>

// 										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2 w-full">
// 											<select
// 												id="button-filter"
// 												name="country"
// 												autocomplete="country-name"
// 												onChange={handleCategoryChange}
// 												class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
// 											>
// 												<option>{t("chooseOneCategory")}</option>
// 												<option value="News">News</option>
// 												<option value="Road Works / Traffic">
// 													Road Works / Traffic
// 												</option>
// 												<option value="Events">Events</option>
// 												<option value="Clubs">Clubs</option>
// 												<option value="Regional Products">
// 													Regional Products
// 												</option>
// 												<option value="Offer / Search">Offer / Search</option>
// 												<option value="New Citizen Info">
// 													New Citizen Info
// 												</option>
// 												<option value="Direct Report">Direct Report</option>
// 												<option value="Lost And Found">Lost And Found</option>
// 												<option value="Company Portraits">
// 													Company Portraits
// 												</option>
// 												<option value="Carpooling And Public Transport">
// 													Carpooling And Public Transport
// 												</option>
// 												<option value="Offers">Offers</option>
// 											</select>
// 										</div>

// 										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2 w-full">
// 											<select
// 												id="country"
// 												name="country"
// 												value={selectedSortOption}
// 												onChange={handleSortOptionChange}
// 												autocomplete="country-name"
// 												class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
// 											>
// 												<option value="">{t("sort")}</option>
// 												<option value="titleAZ">{t("atoztitle")}</option>
// 												<option value="titleZA">{t("ztoatitle")}</option>
// 												<option value="recent">{t("recent")}</option>
// 												<option value="oldest">{t("oldest")}</option>
// 											</select>
// 										</div>
// 									</div>
// 								</div>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>

// 			{listings && listings.length > 0 ? (
// 				<div class="bg-white p-6 mt-20 mb-20 flex flex-wrap gap-10 justify-center">
// 					<div class="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
// 						{listings &&
// 							listings.map((listing) => (
// 								<div
// 									onClick={() => {
// 										localStorage.setItem(
// 											"selectedCategoryId",
// 											listing.categoryId
// 										);
// 										navigateTo(
// 											`/HomePage/EventDetails?listingId=${listing.id}&cityId=${listing.cityId}`
// 										);
// 									}}
// 									className="lg:w-96 md:w-64 h-96 pb-20 w-full shadow-xl rounded-lg cursor-pointer"
// 								>
// 									<a className="block relative h-64 rounded overflow-hidden">
// 										<img
// 											alt="ecommerce"
// 											className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
// 											src={process.env.REACT_APP_BUCKET_HOST + listing.logo}
// 										/>
// 									</a>
// 									<div className="mt-10">
// 										<h2 className="text-gray-900 title-font text-lg font-bold text-center font-sans">
// 											{listing.title}
// 										</h2>
// 									</div>
// 									<div className="my-4 bg-gray-200 h-[1px]"></div>
// 								</div>
// 							))}
// 					</div>
// 				</div>
// 			) : (
// 				<div>
// 					<div class="flex items-center justify-center">
// 						<h1 class=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
// 							Currently there is no listings to display !
// 						</h1>
// 					</div>

// 					<div class="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
// 						<span class="font-sans text-black">
// 							To see all of our listings,{" "}
// 						</span>
// 						<a
// 							class="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-black"
// 							onClick={() => {
// 								localStorage.setItem("selectedItem", "Choose one category");
// 								navigateTo("/ViewMoreListings");
// 							}}
// 						>
// 							Click here
// 						</a>
// 					</div>
// 				</div>
// 			)}

// <div className="bottom-0 w-full">
// 				<Footer/>
// 			</div>
// 		</section>
// 	);
// };

// export default Places;
