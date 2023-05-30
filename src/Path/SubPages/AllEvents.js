import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useNavigate } from "react-router-dom";
import {
	sortByTitleAZ,
	sortByTitleZA,
	sortLatestFirst,
	sortOldestFirst,
} from "../../Services/helper";
import { useLocation } from 'react-router-dom';
import LISTINGSIMAGE from "../../assets/ListingsImage.jpeg";
import { useTranslation } from "react-i18next";

import { getListings } from "../../Services/listingsApi";

import { getCities } from "../../Services/cities";
import { categoryByName, categoryById } from "../../Constants/categories";
import Footer from "../../Components/Footer";

const Events = () => {
	window.scrollTo(0, 0);
	const { t, i18n } = useTranslation();
	const [cityId, setCityId] = useState(null);
	const [cities, setCities] = useState([]);
	const [categoryId, setCategoryId] = useState(0);
	const [categories, setCategories] = useState(categoryById);
	const [selectedCategory, setCategoryName] = useState("");
	const [selectedCity, setCityName] = useState("");
	const [selectedSortOption, setSelectedSortOption] = useState("");
	const [listings, setListings] = useState([]);
	const [pageNo, setPageNo] = useState(1);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const accessToken =
			window.localStorage.getItem("accessToken") ||
			window.sessionStorage.getItem("accessToken");
		const refreshToken =
			window.localStorage.getItem("refreshToken") ||
			window.sessionStorage.getItem("refreshToken");
		if (accessToken || refreshToken) {
			setIsLoggedIn(true);
		}
		getCities().then((citiesResponse) => {
			setCities(citiesResponse.data.data);
			var cityIdParam = urlParams.get("cityId");
			if (cityIdParam) setCityId(cityIdParam);
			var categoryIdParam = urlParams.get("categoryId");
			if (categoryIdParam) setCategoryId(categoryIdParam);
		});
	}, []);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		var params = { pageNo, pageSize: 9, statusId:1 };
		if (parseInt(cityId)) {
			setCityName(cities.find((c) => cityId == c.id)?.name);
			urlParams.set("cityId", cityId);
			params.cityId = cityId;
		} else {
			setCityName(t("allCities"));
			urlParams.delete("cityId"); // Remove cityId parameter from URL
		}
		if (parseInt(categoryId)) {
			setCategoryName(t(categoryById[categoryId]));
			params.categoryId = categoryId;
			urlParams.set("categoryId", categoryId);
		} else {
			setCategoryName(t("allCategories"));
			urlParams.delete("categoryId"); // Remove categoryId parameter from URL
		}
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.replaceState({}, "", newUrl);
		getListings(params).then((response) => {
			var data = response.data.data
				setListings(data);
		});
	}, [categoryId, cities, cityId, pageNo, window.location.href]);

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
				setListings([...sortLatestFirst(listings)]);
				break;
			case "oldest":
				setListings([...sortOldestFirst(listings)]);
				break;
			default:
				break;
		}
	}, [selectedSortOption]);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const terminalViewParam = searchParams.get('terminalView');
	const mtClass = terminalViewParam === 'true' ? 'mt-0' : 'mt-20';
	const pyClass = terminalViewParam === 'true' ? 'py-0' : 'py-1';
	const [showNavBar, setShowNavBar] = useState(true);
	useEffect(() => {
		if (terminalViewParam === 'true') {
			setShowNavBar(false);
		} else {
			setShowNavBar(true);
		}
	}, [terminalViewParam]);

	return (
		<section class="text-gray-600 body-font relative">
			{/* <HomePageNavBar /> */}
			{showNavBar && <HomePageNavBar />}
			<div className={`container-fluid py-0 mr-0 ml-0 w-full flex flex-col ${mtClass}`}>
				<div class="w-full mr-0 ml-0">
					<div class={`lg:h-64 md:h-64 h-72 overflow-hidden ${pyClass}`}>
						<div class="relative lg:h-64 md:h-64 h-72">
							<img
								alt="ecommerce"
								class="object-cover object-center h-full w-full"
								src={process.env.REACT_APP_BUCKET_HOST + "admin/Homepage.jpg"}
							/>
							<div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
								<h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
									{selectedCity} : {selectedCategory}
								</h1>
								<div>
									<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-4 md:gap-4 gap-2 relative justify-center place-items-center lg:px-10 md:px-5 sm:px-0 px-2 py-0 mt-0 mb-0">
										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-0 w-full">
											<select
												id="city"
												name="city"
												autocomplete="city-name"
												onChange={(e) => setCityId(e.target.value)}
												value={cityId}
												class="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
											>
												<option class="font-sans" value={0} key={0}>
													{t("allCities")}
												</option>
												{cities.map((city) => (
													<option
														class="font-sans"
														value={city.id}
														key={city.id}
													>
														{city.name}
													</option>
												))}
											</select>
										</div>
										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-0 w-full">
											<select
												id="category"
												name="category"
												autocomplete="category-name"
												onChange={(e) => setCategoryId(e.target.value)}
												value={categoryId}
												class="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
											>
												<option class="font-sans" value={0} key={0}>
													{t("allCategories")}
												</option>
												{Object.keys(categories).map((key) => {
													return (
														<option class="font-sans" value={key} key={key}>
															{t(categories[key])}
														</option>
													);
												})}
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

			<div className="mt-5 mb-20 p-6">
				<div>
					{listings && listings.length > 0 ? (
						<div class="bg-white flex flex-wrap gap-10 justify-center">
							<div class="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8 min-w-[272px]">
								{listings &&
									listings.map((listing) => (
										<div
											onClick={() => {
												let url = `/HomePage/EventDetails?listingId=${listing.id}&cityId=${listing.cityId}`;
												if (terminalViewParam === 'true') {
												url += '&terminalView=true';
												}
												navigateTo(url);
											}}
											className="lg:w-96 md:w-64 h-96 pb-20 w-full shadow-xl rounded-lg cursor-pointer"
										>
											<a className="block relative h-64 rounded overflow-hidden">
												<img
													alt="ecommerce"
													className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
													src={
														listing.logo
															? process.env.REACT_APP_BUCKET_HOST + listing.logo
															: LISTINGSIMAGE
													}
												/>
											</a>
											<div class="mt-5 px-2">
												<h2 class="text-gray-900 title-font text-lg font-bold text-center font-sans truncate">
													{listing.title}
												</h2>
											</div>
											<div className="my-4 bg-gray-200 h-[1px]"></div>
											{listing.id && listing.categoryId == 3 ? (
											<p class="text-gray-600 title-font text-sm font-semibold text-center font-sans">
												{new Date(listing.startDate.slice(0, 10)).toLocaleDateString('de-DE') +
												" To " +
												new Date(listing.endDate.slice(0, 10)).toLocaleDateString('de-DE')}
											</p>
											):(
												<p class="text-gray-600 p-2 h-[1.8rem] title-font text-sm font-semibold text-center font-sans truncate"
												dangerouslySetInnerHTML={{ __html: listing.description }} />
											)}
										</div>
									))}
							</div>
						</div>
					) : (
						<div>
							<div class="flex items-center justify-center">
								<h1 class=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
									{t("currently_no_listings")}
								</h1>
							</div>
							<div class="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
								<span class="font-sans text-black">
									{t("to_upload_new_listing")}
								</span>
								<a
									class="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-black"
									onClick={() => {
										localStorage.setItem("selectedItem", "Choose one category");
										isLoggedIn
											? navigateTo("/UploadListings")
											: navigateTo("/login");
									}}
								>
									{t("click_here")}
								</a>
							</div>
						</div>
					)}
				</div>
				<div className="mt-20 mb-20 w-fit mx-auto text-center text-white whitespace-nowrap rounded-md border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer">
					{pageNo !== 1 ? (
						<span
							className="text-lg px-3 hover:bg-blue-400 cursor-pointer rounded-lg"
							onClick={() => setPageNo(pageNo - 1)}
						>
							{"<"}{" "}
						</span>
					) : (
						<span />
					)}
					<span className="text-lg px-3">
						{t("page")} {pageNo}
					</span>
					{listings.length >= 9 &&  (
						<span
							className="text-lg px-3 hover:bg-blue-400 cursor-pointer rounded-lg"
							onClick={() => setPageNo(pageNo + 1)}
						>
							{">"}
						</span>
					)}
				</div>
			</div>
			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default Events;
