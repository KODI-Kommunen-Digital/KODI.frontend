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
	getListings
} from "../../Services/listingsApi";

	import { getCities } from "../../Services/cities";
	import { categoryByName, categoryById } from "../../Constants/categories";
	import Footer from "../../Components/Footer";

const Events = () => {
	window.scrollTo(0, 0);
	const { t, i18n } = useTranslation();
	const [cityId, setCityId] = useState(0);
	const [cities, setCities] = useState([]);
	const [categoryId, setCategoryId] = useState(0);
	const [categories, setCategories] = useState(categoryById);
	const [selectedCategory, setSelectedCategory] = useState("");
	const [selectedCity, setSelectedCity] = useState("");
	const [selectedSortOption, setSelectedSortOption] = useState("");
	const [listings, setListings] = useState([]);
	const [pageNo, setPageNo] = useState(1);

	useEffect(() => {
		getCities().then((citiesResponse) => {
			setCities(citiesResponse.data.data);
		});
	}, []);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		setCityId(urlParams.get("categoryId") || null)
		setCategoryId(urlParams.get("cityId") || null);
	}, []);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		var params = { pageNo }
		if (parseInt(cityId)) {
			setSelectedCity(cities.find(c => cityId == c.id).name);
			urlParams.set("cityId", cityId);
			params.cityId = cityId
		}
		else {
			setSelectedCity("All Cities");
			urlParams.delete("cityId"); // Remove cityId parameter from URL
		}
		if (parseInt(categoryId)) {
			setSelectedCategory(t(categoryById[categoryId]))
			params.categoryId = categoryId	
			urlParams.set("categoryId", categoryId);
		}
		else {
			setSelectedCategory("All Categories");
			urlParams.delete("categoryId"); // Remove categoryId parameter from URL
		}
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.pushState({}, "", newUrl);
		getListings(params).then((response) => {
			setListings(response.data.data);
		});
	}, [categoryId, cityId, pageNo]);

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
											onChange={e => setCityId(e.target.value)}
											value={cityId}
											class="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
											>
												<option class="font-sans" value={0} key={0}>
													{t("chooseOneLocation")}
												</option>
												{cities.map((city) => (
													<option class="font-sans" value={city.id} key={city.id}>
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
											onChange={e => setCategoryId(e.target.value)}
											value={categoryId}
											class="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
											>
												<option class="font-sans" value={0} key={0}>
													{t("chooseOneCategory")}
												</option>
												{
													Object.keys(categories).map((key) => {
														return (<option class="font-sans" value={key} key={key}>
															{t(categories[key])}
														</option>)
													})
												}
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
				<div className="mb-10 px-1 py-2 w-fit mx-auto text-xs font-medium text-center text-white bg-blue-800 rounded-lg focus:ring-4 focus:outline-none focus:ring-gray-300 cursor-pointer">
					{pageNo != 1 ? (
						<span
							className="text-lg px-3 hover:bg-blue-400 cursor-pointer rounded-lg"
							onClick={() => setPageNo(pageNo - 1)}
						>
							{"<"}{" "}
						</span>
					) : (
						<span />
					)}
					<span className="text-lg px-3">{t("page")} {pageNo}</span>
					<span
						className="text-lg px-3 hover:bg-blue-400 cursor-pointer rounded-lg"
						onClick={() => setPageNo(pageNo + 1)}
					>
						{">"}
					</span>
				</div>
				<div>
					{listings && listings.length > 0 ? (
						<div class="bg-white flex flex-wrap gap-10 justify-center">
							<div class="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
							{listings &&
								listings
								.map((listing) => (
										<div
										onClick={() => {
											navigateTo(`/HomePage/EventDetails?listingId=${listing.id}&cityId=${listing.cityId}`);
											}
										}
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
			</div>
			<div className="bottom-0 w-full">
				<Footer/>
			</div>
		</section>
	);
};

export default Events;
