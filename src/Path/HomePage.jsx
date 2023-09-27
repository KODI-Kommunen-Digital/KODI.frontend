import React, { useEffect, useState } from "react";
import HomePageNavBar from "../Components/HomePageNavBar";
import STYLEIMAGE from "../assets/styleimage.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getListings, getListingsCount } from "../Services/listingsApi";
import { getCities } from "../Services/cities";
import Footer from "../Components/Footer";
import PrivacyPolicyPopup from "./PrivacyPolicyPopup";
import ListingsCard from "../Components/ListingsCard";

import CITYIMAGE from "../assets/City.png";
import ONEIMAGE from "../assets/01.png";
import TWOIMAGE from "../assets/02.png";
import THREEIMAGE from "../assets/03.png";

const HomePage = () => {
	const { t } = useTranslation();
	const [cityId, setCityId] = useState();
	const [cities, setCities] = useState([]);
	const [listings, setListings] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [listingsCount, setListingsCount] = useState([]);

	useEffect(() => {
		const hasAcceptedPrivacyPolicy = localStorage.getItem(
			"privacyPolicyAccepted"
		);

		if (!hasAcceptedPrivacyPolicy) {
			setShowPopup(true);
		}
		const urlParams = new URLSearchParams(window.location.search);
		getCities().then((citiesResponse) => {
			setCities(citiesResponse.data.data);
		});
		const cityId = parseInt(urlParams.get("cityId"));
		if (cityId) {
			setCityId(cityId);
		}
		getListingsCount().then((response) => {
			const data = response.data.data;
			const sortedData = data.sort(
				(a, b) => parseInt(b.totalCount) - parseInt(a.totalCount)
			);

			setListingsCount(sortedData);
		});

		document.title = process.env.REACT_APP_REGION_NAME + "   Home";
	}, []);

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
		const params = { pageSize: 12, statusId: 1, pageNo: 1 };
		if (parseInt(cityId)) {
			urlParams.set("cityId", cityId);
			params.cityId = cityId;
		} else {
			urlParams.delete("cityId");
		}
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.replaceState({}, "", newUrl);
		getListings(params).then((response) => {
			const data = response.data.data;
			setListings(data);
		});
	}, [cities, cityId]);

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};
	const onCityChange = (e) => {
		const selectedCityId = e.target.value;
		const urlParams = new URLSearchParams(window.location.search);
		const selectedCity = cities.find(
			(city) => city.id.toString() === selectedCityId
		);
		if (selectedCity) {
			localStorage.setItem("selectedCity", selectedCity.name);
			window.location.href = `?cityId=${selectedCityId}`;
		} else {
			localStorage.setItem("selectedCity", t("allCities"));
			urlParams.delete("cityId");
			setCityId(0);
		}
	};

	function goToAllListingsPage(category) {
		let navUrl = `/AllEvents?categoryId=${category}`;
		if (cityId)
			navUrl = `/AllEvents?categoryId=${category}` + `&cityId=${cityId}`;
		navigateTo(navUrl);
	}

	function goToCitizensPage() {
		let navUrl = `/CitizenService`;
		if (cityId) navUrl = `/CitizenService?cityId=${cityId}`;
		navigateTo(navUrl);
	}

	const [showPopup, setShowPopup] = useState(false);

	useEffect(() => {
		const hasAcceptedPrivacyPolicy = localStorage.getItem(
			"privacyPolicyAccepted"
		);

		if (!hasAcceptedPrivacyPolicy) {
			setShowPopup(true);
		}
	}, []);

	const handlePrivacyPolicyAccept = () => {
		localStorage.setItem("privacyPolicyAccepted", "true");
		setShowPopup(false);
	};

	return (
		<section className="text-gray-600 body-font relative">
			<HomePageNavBar />
			{showPopup && <PrivacyPolicyPopup onClose={handlePrivacyPolicyAccept} />}
			<div className="container-fluid py-0 mr-0 ml-0 mt-20 w-full flex flex-col">
				<div className="w-full mr-0 ml-0">
					<div className="h-[35rem] lg:h-full overflow-hidden px-0 py-1">
						<div className="relative h-[35rem]">
							<img
								alt="ecommerce"
								className="object-cover object-center h-full w-full"
								src={process.env.REACT_APP_BUCKET_HOST + "admin/Homepage.jpg"}
							/>
							<div className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
								<h1
									className="font-sans mb-8 lg:mb-12 text-4xl md:text-6xl lg:text-7xl text-center font-bold tracking-wide"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									{t("homePageHeading")}
								</h1>
								<div className="relative w-full px-4 mb-4 md:w-80">
									<select
										id="city"
										name="city"
										autoComplete="city-name"
										onChange={onCityChange}
										value={cityId || 0}
										className="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
										style={{
											fontFamily: "Poppins, sans-serif",
										}}
									>
										<option className="font-sans" value={0} key={0}>
											{t("allCities", {
												regionName: process.env.REACT_APP_REGION_NAME,
											})}
										</option>
										{cities.map((city) => (
											<option
												className="font-sans"
												value={city.id}
												key={city.id}
											>
												{city.name}
											</option>
										))}
									</select>
								</div>
								<div className="flex flex-col mt-4 md:gap-0 gap-2 cursor-pointer">
									<button
										type="button"
										className="flex items-center justify-center w-48 mt-3 text-white bg-black h-14 rounded-xl transition duration-300 transform hover:scale-105"
										onClick={() => {
											if (process.env.REACT_APP_REGION_NAME === "WALDI") {
												window.location.href =
													process.env.REACT_APP_APPLESTORE_WALDI;
											} else {
												window.location.href =
													process.env.REACT_APP_APPLESTORE_AUF;
											}
										}}
									>
										<div className="mr-3">
											<svg viewBox="0 0 384 512" width="30">
												<path
													fill="currentColor"
													d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
												></path>
											</svg>
										</div>
										<div>
											<div className="text-xs">{t("downloadOnThe")}</div>
											<div className="-mt-1 font-sans text-xl font-semibold">
												{t("appStore")}
											</div>
										</div>
									</button>

									<button
										type="button"
										className="flex items-center justify-center w-48 mt-3 text-white bg-black rounded-lg h-14 transition duration-300 transform hover:scale-105"
										onClick={() => {
											if (process.env.REACT_APP_REGION_NAME === "WALDI") {
												window.location.href =
													process.env.REACT_APP_GOOGLEPLAYSTORE_WALDI;
											} else {
												window.location.href =
													process.env.REACT_APP_GOOGLEPLAYSTORE_AUF;
											}
										}}
									>
										<div className="mr-3">
											<svg viewBox="30 336.7 120.9 129.2" width="30">
												<path
													fill="#FFD400"
													d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"
												></path>
												<path
													fill="#FF3333"
													d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"
												></path>
												<path
													fill="#48FF48"
													d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"
												></path>
												<path
													fill="#3BCCFF"
													d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"
												></path>
											</svg>
										</div>
										<div>
											<div className="text-xs">{t("getItOn")}</div>
											<div className="-mt-1 font-sans text-xl font-semibold">
												{t("googlePlay")}
											</div>
										</div>
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<h2
				className="font-sans font-bold text-gray-900 mb-20 text-3xl md:text-4xl mt-20 lg:text-5xl title-font text-center"
				style={{ fontFamily: "Poppins, sans-serif" }}
			>
				{t("mostPopulatCategories")}
			</h2>

			<div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 flex flex-col">
				<div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4 relative mb-4 justify-center place-items-center">
					<style>
						{`
							@media (max-width: 280px) {
							.grid-cols-2 {
								grid-template-columns: repeat(1, minmax(0, 1fr));
							}
							}
						`}
					</style>

					{listingsCount.map((listing) => {
						let categoryName;
						let categoryIcon;
						switch (listing.categoryId) {
							case 1:
								categoryName = t("news");
								categoryIcon = (
									<div className="h-20 w-20 bg-cyan-400 flex items-center justify-center rounded-full m-auto shadow-2xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
											className="h-8 w-40 mr-2"
										>
											<path d="M456 32h-304C121.1 32 96 57.13 96 88v320c0 13.22-10.77 24-24 24S48 421.2 48 408V112c0-13.25-10.75-24-24-24S0 98.75 0 112v296C0 447.7 32.3 480 72 480h352c48.53 0 88-39.47 88-88v-304C512 57.13 486.9 32 456 32zM464 392c0 22.06-17.94 40-40 40H139.9C142.5 424.5 144 416.4 144 408v-320c0-4.406 3.594-8 8-8h304c4.406 0 8 3.594 8 8V392zM264 272h-64C186.8 272 176 282.8 176 296S186.8 320 200 320h64C277.3 320 288 309.3 288 296S277.3 272 264 272zM408 272h-64C330.8 272 320 282.8 320 296S330.8 320 344 320h64c13.25 0 24-10.75 24-24S421.3 272 408 272zM264 352h-64c-13.25 0-24 10.75-24 24s10.75 24 24 24h64c13.25 0 24-10.75 24-24S277.3 352 264 352zM408 352h-64C330.8 352 320 362.8 320 376s10.75 24 24 24h64c13.25 0 24-10.75 24-24S421.3 352 408 352zM400 112h-192c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32v-64C432 126.3 417.7 112 400 112z" />
										</svg>
									</div>
								);
								break;
							case 3:
								categoryName = t("events");
								categoryIcon = (
									<div className="h-20 w-20 bg-yellow-400 flex items-center justify-center rounded-full m-auto shadow-xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
											className="h-8 w-8"
										>
											<path d="M152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z" />
										</svg>
									</div>
								);
								break;
							case 4:
								categoryName = t("clubs");
								categoryIcon = (
									<div className="h-20 w-20 bg-green-400 flex items-center justify-center rounded-full m-auto shadow-xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
											className="h-8 w-40 mr-2"
										>
											<path d="M506.1 127.1c-17.97-20.17-61.46-61.65-122.7-71.1c-22.5-3.354-45.39 3.606-63.41 18.21C302 60.47 279.1 53.42 256.5 56.86C176.8 69.17 126.7 136.2 124.6 139.1c-7.844 10.69-5.531 25.72 5.125 33.57c4.281 3.157 9.281 4.657 14.19 4.657c7.406 0 14.69-3.375 19.38-9.782c.4062-.5626 40.19-53.91 100.5-63.23c7.457-.9611 14.98 .67 21.56 4.483L227.2 168.2C214.8 180.5 207.1 196.1 207.1 214.5c0 17.5 6.812 33.94 19.16 46.29C239.5 273.2 255.9 279.1 273.4 279.1s33.94-6.813 46.31-19.19l11.35-11.35l124.2 100.9c2.312 1.875 2.656 5.251 .5 7.97l-27.69 35.75c-1.844 2.25-5.25 2.594-7.156 1.063l-22.22-18.69l-26.19 27.75c-2.344 2.875-5.344 3.563-6.906 3.719c-1.656 .1562-4.562 .125-6.812-1.719l-32.41-27.66L310.7 392.3l-2.812 2.938c-5.844 7.157-14.09 11.66-23.28 12.6c-9.469 .8126-18.25-1.75-24.5-6.782L170.3 319.8H96V128.3L0 128.3v255.6l64 .0404c11.74 0 21.57-6.706 27.14-16.14h60.64l77.06 69.66C243.7 449.6 261.9 456 280.8 456c2.875 0 5.781-.125 8.656-.4376c13.62-1.406 26.41-6.063 37.47-13.5l.9062 .8126c12.03 9.876 27.28 14.41 42.69 12.78c13.19-1.375 25.28-7.032 33.91-15.35c21.09 8.188 46.09 2.344 61.25-16.47l27.69-35.75c18.47-22.82 14.97-56.48-7.844-75.01l-120.3-97.76l8.381-8.382c9.375-9.376 9.375-24.57 0-33.94c-9.375-9.376-24.56-9.376-33.94 0L285.8 226.8C279.2 233.5 267.7 233.5 261.1 226.8c-3.312-3.282-5.125-7.657-5.125-12.31c0-4.688 1.812-9.064 5.281-12.53l85.91-87.64c7.812-7.845 18.53-11.75 28.94-10.03c59.75 9.22 100.2 62.73 100.6 63.29c3.088 4.155 7.264 6.946 11.84 8.376H544v175.1c0 17.67 14.33 32.05 31.1 32.05L640 384V128.1L506.1 127.1zM48 352c-8.75 0-16-7.245-16-15.99c0-8.876 7.25-15.99 16-15.99S64 327.2 64 336.1C64 344.8 56.75 352 48 352zM592 352c-8.75 0-16-7.245-16-15.99c0-8.876 7.25-15.99 16-15.99s16 7.117 16 15.99C608 344.8 600.8 352 592 352z" />
										</svg>
									</div>
								);
								break;
							case 5:
								categoryName = t("regionalProducts");
								categoryIcon = (
									<div className="h-20 w-20 bg-violet-400 flex items-center justify-center rounded-full m-auto shadow-xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
											className="h-8 w-40 mr-2"
										>
											<path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c.2 35.5-28.5 64.3-64 64.3H128.1c-35.3 0-64-28.7-64-64V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24zM352 224c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64zm-96 96c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80H256z" />
										</svg>
									</div>
								);
								break;
							case 6:
								categoryName = t("offerSearch");
								categoryIcon = (
									<div className="h-20 w-20 bg-orange-400 flex items-center justify-center rounded-full m-auto shadow-xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
											className="h-8 w-8"
										>
											<path d="M374.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l320-320zM128 128c0-35.3-28.7-64-64-64S0 92.7 0 128s28.7 64 64 64s64-28.7 64-64zM384 384c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64z" />
										</svg>
									</div>
								);
								break;
							case 7:
								categoryName = t("newCitizenInfo");
								categoryIcon = (
									<div className="h-20 w-20 bg-stone-400 flex items-center justify-center rounded-full m-auto shadow-xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
											className="h-8 w-40 mr-1"
										>
											<path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
										</svg>
									</div>
								);
								break;
							case 9:
								categoryName = t("lostAndFound");
								categoryIcon = (
									<div className="h-20 w-20 bg-gray-600 flex items-center justify-center rounded-full m-auto shadow-xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
											className="h-8 w-40 mr-2"
										>
											<path d="M253.3 35.1c6.1-11.8 1.5-26.3-10.2-32.4s-26.3-1.5-32.4 10.2L117.6 192H32c-17.7 0-32 14.3-32 32s14.3 32 32 32L83.9 463.5C91 492 116.6 512 146 512H430c29.4 0 55-20 62.1-48.5L544 256c17.7 0 32-14.3 32-32s-14.3-32-32-32H458.4L365.3 12.9C359.2 1.2 344.7-3.4 332.9 2.7s-16.3 20.6-10.2 32.4L404.3 192H171.7L253.3 35.1zM192 304v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16zm96-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16zm128 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
										</svg>
									</div>
								);
								break;
							case 10:
								categoryName = t("companyPortaits");
								categoryIcon = (
									<div className="h-20 w-20 bg-pink-400 flex items-center justify-center rounded-full m-auto shadow-xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
											className="h-8 w-8 ml-1"
										>
											<path d="M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z" />
										</svg>
									</div>
								);
								break;
							case 11:
								categoryName = t("carpoolingPublicTransport");
								categoryIcon = (
									<div className="h-20 w-20 bg-lime-600 flex items-center justify-center rounded-full m-auto shadow-xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
											className="h-8 w-40 mr-1"
										>
											<path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zm288 32c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z" />
										</svg>
									</div>
								);
								break;
							case 12:
								categoryName = t("offers");
								categoryIcon = (
									<div className="h-20 w-20 bg-sky-600 flex items-center justify-center rounded-full m-auto shadow-xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
											className="h-8 w-40 mr-1"
										>
											<path d="M190.5 68.8L225.3 128H224 152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H438.4c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40H288h-1.3l34.8-59.2C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40zM32 288V464c0 26.5 21.5 48 48 48H224V288H32zM288 512H432c26.5 0 48-21.5 48-48V288H288V512z" />
										</svg>
									</div>
								);
								break;
							case 13:
								categoryName = t("eatOrDrink");
								categoryIcon = (
									<div className="h-20 w-20 bg-red-400 flex items-center justify-center rounded-full m-auto shadow-xl">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 448 512"
											className="h-8 w-8"
										>
											<path d="M416 0C400 0 288 32 288 176V288c0 35.3 28.7 64 64 64h32V480c0 17.7 14.3 32 32 32s32-14.3 32-32V352 240 32c0-17.7-14.3-32-32-32zM64 16C64 7.8 57.9 1 49.7 .1S34.2 4.6 32.4 12.5L2.1 148.8C.7 155.1 0 161.5 0 167.9c0 45.9 35.1 83.6 80 87.7V480c0 17.7 14.3 32 32 32s32-14.3 32-32V255.6c44.9-4.1 80-41.8 80-87.7c0-6.4-.7-12.8-2.1-19.1L191.6 12.5c-1.8-8-9.3-13.3-17.4-12.4S160 7.8 160 16V150.2c0 5.4-4.4 9.8-9.8 9.8c-5.1 0-9.3-3.9-9.8-9L127.9 14.6C127.2 6.3 120.3 0 112 0s-15.2 6.3-15.9 14.6L83.7 151c-.5 5.1-4.7 9-9.8 9c-5.4 0-9.8-4.4-9.8-9.8V16zm48.3 152l-.3 0-.3 0 .3-.7 .3 .7z" />
										</svg>
									</div>
								);
								break;
							default:
								categoryName = t("unknownCategory");
								categoryIcon = null;
								break;
						}

						return (
							<div
								key={listing.categoryId}
								onClick={() => {
									goToAllListingsPage(listing.categoryId);
								}}
								className="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-xl mt-10 cursor-pointer"
							>
								<div>{categoryIcon}</div>
								<h2
									className="flex items-center justify-center m-auto mt-2 text-center font-sans font-bold"
									style={{ fontFamily: "Poppins, sans-serif" }}
								>
									{categoryName}
								</h2>
							</div>
						);
					})}
				</div>
			</div>

			<h2
				className="text-gray-900 mb-20 text-3xl md:text-4xl lg:text-5xl mt-20 title-font text-center font-sans font-bold"
				style={{ fontFamily: "Poppins, sans-serif" }}
			>
				{t("discoverMorePlaces")}
			</h2>

			<div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
				<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 relative mb-4 justify-center place-items-center">
					{cities.map((city) => {
						if (city.id !== Number(cityId)) {
							return (
								<div
									key={city.id}
									onClick={() => {
										const scrollPosition = window.scrollY;
										localStorage.setItem("selectedCity", city.name);
										navigateTo(`/AllEvents?cityId=${city.id}`);
										window.addEventListener("popstate", function () {
											window.scrollTo(0, scrollPosition);
										});
									}}
									className="h-80 w-full rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
								>
									<div className="relative h-80 rounded overflow-hidden">
										<img
											alt="ecommerce"
											className="object-cover object-center h-full w-full hover:scale-125 transition-all duration-500"
											src={
												city.image
													? process.env.REACT_APP_BUCKET_HOST + city.image
													: CITYIMAGE
											}
										/>
										<div className="absolute inset-0 flex flex-col justify-end bg-gray-800 bg-opacity-50 text-white z--1">
											<h1
												className="text-xl pb-5 md:text-3xl font-sans font-bold mb-0 ml-4"
												style={{
													fontFamily: "Poppins, sans-serif",
												}}
											>
												{city.name}
											</h1>
										</div>
									</div>
								</div>
							);
						}
						return null;
					})}
				</div>
			</div>

			<div className="my-4 bg-gray-200 h-[1px]"></div>

			<h2
				className="text-gray-900 mb-20 text-3xl md:text-4xl lg:text-5xl mt-20 title-font text-center font-sans font-bold"
				style={{ fontFamily: "Poppins, sans-serif" }}
			>
				{t("recentListings")}
			</h2>

			{listings && listings.length > 0 ? (
				<div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
					<div className="relative place-items-center bg-white mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-10 justify-start">
						{listings &&
							listings.map((listing, index) => (
								<ListingsCard listing={listing} key={index} />
							))}
					</div>
					<button
						type="submit"
						onClick={() => {
							localStorage.setItem("selectedItem", t("chooseOneCategory"));
							navigateTo("/AllEvents");
						}}
						className="w-full rounded-xl sm:w-80 mt-10 mx-auto bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer font-sans"
						style={{ fontFamily: "Poppins, sans-serif" }}
					>
						{t("viewMore")}
					</button>
				</div>
			) : (
				<div>
					<div className="flex items-center justify-center">
						<h1
							className=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("currently_no_listings")}
						</h1>
					</div>
					<div className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
						<span
							className="font-sans text-black"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("to_upload_new_listing")}
						</span>
						<a
							className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-blue-400"
							style={{ fontFamily: "Poppins, sans-serif" }}
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

			<div className="my-4 bg-gray-200 h-[1px]"></div>

			<div className="bg-white lg:px-10 md:px-5 sm:px-0 py-6 mt-10 mb-10 space-y-10 flex flex-col">
				<div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 relative mb-4 justify-center gap-4 place-items-center">
					<div className="pb-10 w-full mb-4 bg-gray-100 rounded-xl cursor-pointer">
						<div className="relative h-96 rounded overflow-hidden w-auto">
							<img
								alt="ecommerce"
								className="object-cover object-center h-48 w-48 m-auto"
								src={ONEIMAGE}
							/>
							<div className="p-6">
								<h2
									className="text-gray-900 mb-5 text-2xl md:text-2xl lg:text-3xl mt-5 title-font text-start font-bold font-sans"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									{t("createAnAccount")}
								</h2>
								<p
									className="text-gray-900 title-font text-lg font-bold text-start font-sans"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									{t("createAnAccountDescription")}
								</p>
							</div>
						</div>
					</div>
					<div className="pb-10 w-full mb-4 bg-gray-100 rounded-xl cursor-pointer">
						<div className="relative h-96 w-96 rounded overflow-hidden w-auto">
							<img
								alt="ecommerce"
								className="object-cover object-center h-48 w-48 m-auto"
								src={TWOIMAGE}
							/>
							<div className="p-6">
								<h2
									className="text-gray-900 mb-5 text-2xl md:text-2xl lg:text-3xl mt-5 title-font text-start font-bold font-sans"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									{t("getVerified")}
								</h2>
								<p
									className="text-gray-900 title-font text-lg font-bold text-start font-sans"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									{t("getVerifiedDescription")}
								</p>
							</div>
						</div>
					</div>
					<div className="pb-10 w-full mb-4 bg-gray-100 rounded-xl cursor-pointer">
						<div className="relative h-96 w-96 rounded overflow-hidden w-auto">
							<img
								alt="ecommerce"
								className="object-cover object-center h-48 w-48 m-auto"
								src={THREEIMAGE}
							/>
							<div className="p-6">
								<h2
									className="text-gray-900 mb-5 text-2xl md:text-2xl lg:text-3xl mt-5 title-font text-start font-bold font-sans"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									{t("start")}
								</h2>
								<p
									className="text-gray-900 title-font text-lg font-bold text-start font-sans"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									{t("startDescription")}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="bg-blue-400 mx-auto py-10 px-4 flex justify-center lg:h-[28rem] sm:h-[35rem]">
				<div className="flex flex-wrap items-center">
					<div className="w-full md:w-1/2 px-4">
						<h2
							className="text-4xl text-white font-bold mb-4 font-sans"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("citizenService")}
						</h2>
						<p
							className="mb-4 text-gray-900 text-lg font-bold font-sans"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("findBestCitizenServicesInTheCity")}
						</p>
						<a
							onClick={() => goToCitizensPage()}
							className="ml-0 w-full sm:w-48 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("clickHereToFind")}
						</a>
					</div>

					<div className="w-full md:w-1/2 flex flex-wrap lg:mt-0 md:mt-6 mt-6">
						<img
							src={STYLEIMAGE}
							alt="Image 1"
							className="w-full md:w-98 mb-2"
						/>
					</div>
				</div>
			</div>

			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default HomePage;
