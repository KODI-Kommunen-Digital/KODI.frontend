import React, { useEffect, useState } from "react";
import HomePageNavBar from "../Components/HomePageNavBar";
import UploadContribution from "../Components/UploadContribution";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getAllListings } from "../Services/listingsApi";
import { sortOldest, sortRecent } from "../Services/helper";
import { getCities } from "../Services/cities";
import { getCategory } from "../Services/CategoryApi";
import { getVillages } from "../Services/villages";
import { categoryByName, categoryById } from "../Constants/categories";

import HOMEPAGEIMG from "../assets/homeimage.jpg";
import ONEIMAGE from "../assets/01.png";
import TWOIMAGE from "../assets/02.png";
import THREEIMAGE from "../assets/03.png";

const HomePage = () => {
	const { t, i18n } = useTranslation();
	//window.scrollTo(0, 0);
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
	useEffect(() => {
		getCities().then((citiesResponse) => {
			setCities(citiesResponse.data.data);
		});
	}, []);

	const [input, setInput] = useState({
		//"villageId": 1,
		categoryId: 0,
		subcategoryId: 0,
		sourceId: 1,
		userId: 2,
	});

	const [listings, setListings] = useState([]);
	const [categories, setCategories] = useState([]);
	const [selectedCategory, setSelectedCategory] = useState("");
	useEffect(() => {
		getAllListings().then((response) => {
			const sortedListings = sortRecent(response.data.data);
			const slicedListings = sortedListings.slice(0, 3);
			setListings([...slicedListings]);
		});
		document.title = "Heidi Home";
	}, []);

	const [selectedSortOption, setSelectedSortOption] = useState("");

	let navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	function goToFilters(filterName) {
		// Encode the button name as a URL parameter
		const encodedName = encodeURIComponent(filterName);

		// Redirect to the filters page with the encoded name as a parameter
		window.location.href = encodedName;
	}

	useEffect(() => {
		getCategory().then((response) => {
			const setCategories = sortRecent(response.data.data);
		});
	}, []);

	function goToEditListingsPage(category) {
		navigateTo(`/Events?categoryId=${category}`);
	}

	return (
		<section class="text-gray-600 body-font relative">
			<HomePageNavBar />
			<div class="container-fluid py-0 mr-0 ml-0 mt-20 w-full flex flex-col">
				<div class="w-full mr-0 ml-0">
					<div class="h-[35rem] overflow-hidden px-0 py-1">
						{/* <a class="block relative h-96 overflow-hidden">
            <img
              alt="ecommerce"
              class="object-cover object-center h-full w-full"
              src= {HOMEPAGEIMG}
            />
          </a> */}
						<div class="relative h-[35rem]">
							<img
								alt="ecommerce"
								class="object-cover object-center h-full w-full"
								src={HOMEPAGEIMG}
							/>
							<div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
								<h1 class="font-sans text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4">
									{t("homePageHeading")}
								</h1>
							</div>
						</div>
					</div>
				</div>
			</div>

			<h2 class="font-sans font-bold text-gray-900 mb-20 text-3xl md:text-4xl mt-20 lg:text-5xl title-font text-center">
				{t("mostPopulatCategories")}
			</h2>

			<div class="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 flex flex-col">
				<div class="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-2 gap-4 relative mb-4 justify-center place-items-center">
					<div
						onClick={() => {
							localStorage.setItem("selectedItem", "News");
							goToEditListingsPage(1);
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer "
					>
						<div className="h-20 w-20 bg-cyan-400 flex items-center justify-center rounded-full m-auto shadow-2xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-40 mr-2"
							>
								<path d="M456 32h-304C121.1 32 96 57.13 96 88v320c0 13.22-10.77 24-24 24S48 421.2 48 408V112c0-13.25-10.75-24-24-24S0 98.75 0 112v296C0 447.7 32.3 480 72 480h352c48.53 0 88-39.47 88-88v-304C512 57.13 486.9 32 456 32zM464 392c0 22.06-17.94 40-40 40H139.9C142.5 424.5 144 416.4 144 408v-320c0-4.406 3.594-8 8-8h304c4.406 0 8 3.594 8 8V392zM264 272h-64C186.8 272 176 282.8 176 296S186.8 320 200 320h64C277.3 320 288 309.3 288 296S277.3 272 264 272zM408 272h-64C330.8 272 320 282.8 320 296S330.8 320 344 320h64c13.25 0 24-10.75 24-24S421.3 272 408 272zM264 352h-64c-13.25 0-24 10.75-24 24s10.75 24 24 24h64c13.25 0 24-10.75 24-24S277.3 352 264 352zM408 352h-64C330.8 352 320 362.8 320 376s10.75 24 24 24h64c13.25 0 24-10.75 24-24S421.3 352 408 352zM400 112h-192c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32v-64C432 126.3 417.7 112 400 112z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 text-center font-sans font-bold">
							{t("news")}
						</h2>
					</div>
					<div
						onClick={() => {
							goToEditListingsPage(2);
							localStorage.setItem("selectedItem", "Road Works / Traffic");
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer"
					>
						<div className="h-20 w-20 bg-red-400 flex items-center justify-center rounded-full m-auto shadow-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-8 ml-2"
							>
								<path d="M64 0C28.7 0 0 28.7 0 64V352c0 88.4 71.6 160 160 160s160-71.6 160-160V64c0-35.3-28.7-64-64-64H64zm96 320c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48zm-48-80c0-26.5 21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48zM160 64c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 font-sans font-bold text-center">
							{t("roadTraffic")}
						</h2>
					</div>
					<div
						onClick={() => {
							goToEditListingsPage(3);
							localStorage.setItem("selectedItem", "Events");
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer"
					>
						<div className="h-20 w-20 bg-yellow-400 flex items-center justify-center rounded-full m-auto shadow-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-8"
							>
								<path d="M152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 font-sans font-bold text-center">
							{t("events")}
						</h2>
					</div>
					<div
						onClick={() => {
							goToEditListingsPage(4);
							localStorage.setItem("selectedItem", "Clubs");
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer"
					>
						<div className="h-20 w-20 bg-green-400 flex items-center justify-center rounded-full m-auto shadow-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-40 mr-2"
							>
								<path d="M506.1 127.1c-17.97-20.17-61.46-61.65-122.7-71.1c-22.5-3.354-45.39 3.606-63.41 18.21C302 60.47 279.1 53.42 256.5 56.86C176.8 69.17 126.7 136.2 124.6 139.1c-7.844 10.69-5.531 25.72 5.125 33.57c4.281 3.157 9.281 4.657 14.19 4.657c7.406 0 14.69-3.375 19.38-9.782c.4062-.5626 40.19-53.91 100.5-63.23c7.457-.9611 14.98 .67 21.56 4.483L227.2 168.2C214.8 180.5 207.1 196.1 207.1 214.5c0 17.5 6.812 33.94 19.16 46.29C239.5 273.2 255.9 279.1 273.4 279.1s33.94-6.813 46.31-19.19l11.35-11.35l124.2 100.9c2.312 1.875 2.656 5.251 .5 7.97l-27.69 35.75c-1.844 2.25-5.25 2.594-7.156 1.063l-22.22-18.69l-26.19 27.75c-2.344 2.875-5.344 3.563-6.906 3.719c-1.656 .1562-4.562 .125-6.812-1.719l-32.41-27.66L310.7 392.3l-2.812 2.938c-5.844 7.157-14.09 11.66-23.28 12.6c-9.469 .8126-18.25-1.75-24.5-6.782L170.3 319.8H96V128.3L0 128.3v255.6l64 .0404c11.74 0 21.57-6.706 27.14-16.14h60.64l77.06 69.66C243.7 449.6 261.9 456 280.8 456c2.875 0 5.781-.125 8.656-.4376c13.62-1.406 26.41-6.063 37.47-13.5l.9062 .8126c12.03 9.876 27.28 14.41 42.69 12.78c13.19-1.375 25.28-7.032 33.91-15.35c21.09 8.188 46.09 2.344 61.25-16.47l27.69-35.75c18.47-22.82 14.97-56.48-7.844-75.01l-120.3-97.76l8.381-8.382c9.375-9.376 9.375-24.57 0-33.94c-9.375-9.376-24.56-9.376-33.94 0L285.8 226.8C279.2 233.5 267.7 233.5 261.1 226.8c-3.312-3.282-5.125-7.657-5.125-12.31c0-4.688 1.812-9.064 5.281-12.53l85.91-87.64c7.812-7.845 18.53-11.75 28.94-10.03c59.75 9.22 100.2 62.73 100.6 63.29c3.088 4.155 7.264 6.946 11.84 8.376H544v175.1c0 17.67 14.33 32.05 31.1 32.05L640 384V128.1L506.1 127.1zM48 352c-8.75 0-16-7.245-16-15.99c0-8.876 7.25-15.99 16-15.99S64 327.2 64 336.1C64 344.8 56.75 352 48 352zM592 352c-8.75 0-16-7.245-16-15.99c0-8.876 7.25-15.99 16-15.99s16 7.117 16 15.99C608 344.8 600.8 352 592 352z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 font-sans font-bold text-center">
							{t("clubs")}
						</h2>
					</div>
					<div
						onClick={() => {
							goToEditListingsPage(5);
							localStorage.setItem("selectedItem", "Regional Products");
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer"
					>
						<div className="h-20 w-20 bg-violet-400 flex items-center justify-center rounded-full m-auto shadow-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-40 mr-2"
							>
								<path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c.2 35.5-28.5 64.3-64 64.3H128.1c-35.3 0-64-28.7-64-64V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24zM352 224c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64zm-96 96c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80H256z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 font-sans font-bold text-center">
							{t("regionalProducts")}
						</h2>
					</div>
					<div
						onClick={() => {
							goToEditListingsPage(6);
							localStorage.setItem("selectedItem", "Offer / Search");
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer"
					>
						<div className="h-20 w-20 bg-orange-400 flex items-center justify-center rounded-full m-auto shadow-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-8"
							>
								<path d="M374.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l320-320zM128 128c0-35.3-28.7-64-64-64S0 92.7 0 128s28.7 64 64 64s64-28.7 64-64zM384 384c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 font-sans font-bold text-center">
							{t("offerSearch")}
						</h2>
					</div>
					<div
						onClick={() => {
							goToEditListingsPage(7);
							localStorage.setItem("selectedItem", "New Citizen Info");
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer"
					>
						<div className="h-20 w-20 bg-stone-400 flex items-center justify-center rounded-full m-auto shadow-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-40 mr-1"
							>
								<path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 font-sans font-bold text-center">
							{t("newCitizenInfo")}
						</h2>
					</div>
					<div
						onClick={() => {
							goToEditListingsPage(8);
							localStorage.setItem("selectedItem", "Defect Report");
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer"
					>
						<div className="h-20 w-20 bg-red-600 flex items-center justify-center rounded-full m-auto shadow-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-40 mr-1"
							>
								<path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 font-sans font-bold text-center">
							{t("defectReport")}
						</h2>
					</div>

					<div
						onClick={() => {
							goToEditListingsPage(9);
							localStorage.setItem("selectedItem", "Lost And Found");
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer"
					>
						<div className="h-20 w-20 bg-gray-600 flex items-center justify-center rounded-full m-auto shadow-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-40 mr-2"
							>
								<path d="M253.3 35.1c6.1-11.8 1.5-26.3-10.2-32.4s-26.3-1.5-32.4 10.2L117.6 192H32c-17.7 0-32 14.3-32 32s14.3 32 32 32L83.9 463.5C91 492 116.6 512 146 512H430c29.4 0 55-20 62.1-48.5L544 256c17.7 0 32-14.3 32-32s-14.3-32-32-32H458.4L365.3 12.9C359.2 1.2 344.7-3.4 332.9 2.7s-16.3 20.6-10.2 32.4L404.3 192H171.7L253.3 35.1zM192 304v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16zm96-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16zm128 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 font-sans font-bold text-center">
							{t("lostAndFound")}
						</h2>
					</div>
					<div
						onClick={() => {
							goToEditListingsPage(10);
							localStorage.setItem("selectedItem", "Company Portraits");
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer"
					>
						<div className="h-20 w-20 bg-pink-400 flex items-center justify-center rounded-full m-auto shadow-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-8 ml-1"
							>
								<path d="M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 font-sans font-bold text-center">
							{t("companyPortaits")}
						</h2>
					</div>
					<div
						onClick={() => {
							goToEditListingsPage(11);
							localStorage.setItem(
								"selectedItem",
								"Carpooling And Public Transport"
							);
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer"
					>
						<div className="h-20 w-20 bg-lime-600 flex items-center justify-center rounded-full m-auto shadow-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-40 mr-1"
							>
								<path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zm288 32c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 font-sans font-bold text-center">
							{t("carpoolingPublicTransport")}
						</h2>
					</div>
					<div
						onClick={() => {
							goToEditListingsPage(12);
							localStorage.setItem("selectedItem", "Offers");
						}}
						class="p-4 justify-center bg-white h-40 sm:w-48 w-40 shadow-xl rounded-lg mt-10 cursor-pointer"
					>
						<div className="h-20 w-20 bg-sky-600 flex items-center justify-center rounded-full m-auto shadow-xl">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="h-8 w-40 mr-1"
							>
								<path d="M190.5 68.8L225.3 128H224 152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H438.4c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40H288h-1.3l34.8-59.2C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40zM32 288V464c0 26.5 21.5 48 48 48H224V288H32zM288 512H432c26.5 0 48-21.5 48-48V288H288V512z" />
							</svg>
						</div>
						<h2 class="flex items-center justify-center m-auto mt-2 font-sans font-bold text-center">
							{t("offers")}
						</h2>
					</div>
				</div>
			</div>

			<h2 class="text-gray-900 mb-20 text-3xl md:text-4xl lg:text-5xl mt-20 title-font text-center font-sans font-bold">
				{t("discoverMorePlaces")}
			</h2>

			{cities.map((city) => (
				<div class="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
					<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 relative mb-4 justify-center place-items-center">
						<div
							onClick={() => {
								navigateTo(`/Places?cityId=${city.id}`);
								localStorage.setItem("selectedItemLocation", city.name);
							}}
							class="h-80 w-full rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
						>
							<div class="relative h-80 rounded overflow-hidden">
								<img
									alt="ecommerce"
									class="object-cover object-center h-full w-full hover:scale-125 transition-all duration-500"
									src={city.image}
								/>
								<div class="absolute inset-0 flex flex-col justify-end bg-gray-800 bg-opacity-50 text-white z--1">
									<h1 class="text-xl md:text-3xl font-sans font-bold mb-0 ml-4">
										{city.name}
									</h1>
									<p class="mb-4 ml-4 font-sans">{t("entries")}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}

			<div className="my-4 bg-gray-200 h-[1px]"></div>

			<h2 class="text-gray-900 mb-20 text-3xl md:text-4xl lg:text-5xl mt-20 title-font text-center font-sans font-bold">
				{t("recentListings")}
			</h2>

			<div class="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
				<div class="xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 relative place-items-center bg-white p-6 mt-4 mb-4 flex flex-wrap gap-10 justify-center">
					{listings &&
						listings
						.filter((listing) => listing.statusId === 1)
						.map((listing) => (
							<div
								onClick={() => {
									localStorage.setItem("selectedCategoryId", (listing.categoryId));
									navigateTo(`/HomePage/EventDetails?listingId=${listing.id}&cityId=${listing.cityId}`);
								}}
								//onClick={() => navigateTo(`/HomePage/EventDetails?listingId=${listing.id}&cityId=${listing.cityId}`)}
								class="lg:w-96 md:w-64 h-96 pb-20 w-full shadow-lg rounded-lg cursor-pointer"
							>
								<a class="block relative h-64 rounded overflow-hidden">
									<img
										alt="ecommerce"
										class="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
										src={HOMEPAGEIMG}
									/>
								</a>
								<div class="mt-10">
									<h2 class="text-gray-900 title-font text-lg font-bold text-center font-sans">
										{listing.title}
									</h2>
									</div>
									<div className="my-4 bg-gray-200 h-[1px]"></div>
								</div>
							))}
				</div>
				<button
					type="submit"
					onClick={() => {
						localStorage.setItem("selectedItem", "Choose one category");
						navigateTo("/ViewMoreListings");
					}}
					class="w-96 mt-10 mx-auto rounded bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer font-sans"
				>
					{t("viewMore")}
				</button>
			</div>

			<div className="my-4 bg-gray-200 h-[1px]"></div>

			<div class="bg-white lg:px-10 md:px-5 sm:px-0 py-6 mt-10 mb-10 space-y-10 flex flex-col">
				<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 relative mb-4 justify-center gap-4 place-items-center">
					<div class="h-full w-full mb-4 bg-gray-100 rounded-lg cursor-pointer">
						<div class="relative h-96 rounded overflow-hidden w-auto">
							<img
								alt="ecommerce"
								class="object-cover object-center h-48 w-48 m-auto"
								src={ONEIMAGE}
							/>
							<div class="p-6">
								<h2 class="text-gray-900 mb-5 text-2xl md:text-2xl lg:text-3xl mt-5 title-font text-start font-bold font-sans">
									{t("createAnAccount")}
								</h2>
								<p class="text-gray-900 title-font text-lg font-bold text-start font-sans">
									{t("createAnAccountDescription")}
								</p>
							</div>
						</div>
					</div>
					<div class="h-full w-full mb-4 bg-gray-100 rounded-lg cursor-pointer">
						<div class="relative h-96 w-96 rounded overflow-hidden w-auto">
							<img
								alt="ecommerce"
								class="object-cover object-center h-48 w-48 m-auto"
								src={TWOIMAGE}
							/>
							<div class="p-6">
								<h2 class="text-gray-900 mb-5 text-2xl md:text-2xl lg:text-3xl mt-5 title-font text-start font-bold font-sans">
									{t("getVerified")}
								</h2>
								<p class="text-gray-900 title-font text-lg font-bold text-start font-sans">
									{t("getVerifiedDescription")}
								</p>
							</div>
						</div>
					</div>
					<div class="h-full w-full mb-4 bg-gray-100 rounded-lg cursor-pointer">
						<div class="relative h-96 w-96 rounded overflow-hidden w-auto">
							<img
								alt="ecommerce"
								class="object-cover object-center h-48 w-48 m-auto"
								src={THREEIMAGE}
							/>
							<div class="p-6">
								<h2 class="text-gray-900 mb-5 text-2xl md:text-2xl lg:text-3xl mt-5 title-font text-start font-bold font-sans">
									{t("start")}
								</h2>
								<p class="text-gray-900 title-font text-lg font-bold text-start font-sans">
									{t("startDescription")}
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<UploadContribution />

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

export default HomePage;
