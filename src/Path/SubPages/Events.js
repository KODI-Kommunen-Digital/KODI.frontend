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

import { getListings , getListingsByCity } from "../../Services/listingsApi";

import { getCities } from "../../Services/cities";
import { getCategory , getCategoryListings } from "../../Services/CategoryApi";
import { getVillages } from "../../Services/villages";
import { categoryByName, categoryById } from "../../Constants/categories";
import {getListingsById} from '../../Services/listingsApi'

// import(
// 	"https://fonts.googleapis.com/css2?family=Poppins:wght@200;600&display=swap"
// );

const Events = () => {
	window.scrollTo(0, 0);
	const { t, i18n } = useTranslation();
	const [cityId, setCityId] = useState(0);
	const [villages, setVillages] = useState([]);
	const [cities, setCities] = useState([]);
	const [listingId, setListingId] = useState(0);
	async function onCityChange(e) {
		const cityId = e.target.value;
		setCityId(cityId);
		setInput(prev => ({
		...prev,
		villageId: 0
		}));
		getVillages(cityId).then(response =>
		setVillages(response.data.data)
		)
	}
	useEffect(() => {
		getCities().then(citiesResponse => {
		setCities(citiesResponse.data.data);
	})}, []);

		// Selected Items Deletion Starts
		const selectedItem = localStorage.getItem('selectedItem');
		// Selected Items Deletion Ends

	const [input, setInput] = useState({
		//"villageId": 1,
		"categoryId": 0,
		"subcategoryId": 0,
		"sourceId": 1,
		"userId": 2
	});

	const [listings, setListings] = useState([]);
	const [categoryId, setCategoryId] = useState();
	const [newListing, setNewListing] = useState(true);
	const [description, setDescription] = useState("");
		const [title, setTitle] = useState("");

	const [categories, setCategories] = useState([]);
		useEffect(() => {
			getCategory().then((response) => {
			const sortedCategories = sortRecent(response.data.data);
			setCategories([...sortedCategories]);
			});
		}, []);

	//Navigate to Event Details page Starts
		function goToEventDetailsPage(listing) {
				navigateTo(
					`/HomePage/EventDetails?listingId=${listing.id}&cityId=${listing.cityId}`
				);
		}

	const [selectedCategory, setSelectedCategory] = useState("");

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
		setCategoryId(categoryId);
		//setCityId(null);
		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("categoryId", categoryId);
		urlParams.delete("cityId");
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.pushState({}, "", newUrl);
	};

	const handleLocationChange = (event) => {
		const cityId = event.target.value;
		setCityId(cityId);
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
			}

			if (cityIdParam) {
			  setCityId(cityIdParam);
			}
		  }, []);

		useEffect(() => {
			if (categoryId) {
			  if (cityId) {
				getListingsByCity(cityId, {"categoryId":categoryId}).then((response) => {
					console.log("inside getListingsById" + cityId + "---------" + categoryId)
					console.log(response.data.data)
				  const sortedListings = sortRecent(response.data.data);
				  setListings(sortedListings);
				});
			  } else {
				getListings({ categoryId }).then((response) => {
					console.log("inside getListings"  + categoryId)
				  const sortedListings = sortRecent(response.data.data);
				  setListings(sortedListings);
				});
			  }
			}
		  }, [categoryId, cityId]);

  const [selectedSortOption, setSelectedSortOption] = useState('');
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
      case 'titleAZ':
        setListings([...sortByTitleAZ(listings)])
        break;
      case 'titleZA':
        setListings([...sortByTitleZA(listings)]);
        break;
      case 'recent':
        setListings([...sortRecent(listings)]);
        break;
      case 'oldest':
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

  // Pre-select the corresponding filter option ends


  function handleLocationSubmit(event) {
    event.preventDefault();
    // Do something with the location data, like pass it to a parent component
  }

  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(
          `${position.coords.latitude}, ${position.coords.longitude}`
        );
      },
      (error) => {
        console.error(error);
      }
    );
  }

  return (
    <section class="text-gray-600 body-font relative">
      <HomePageNavBar />
      <div class="container-fluid py-0 mr-0 ml-0 mt-20 w-full flex flex-col">
        <div class="w-full mr-0 ml-0">
          <div class="h-64 overflow-hidden px-1 py-1">
						<div class="relative h-64">
							<img
								alt="ecommerce"
								class="object-cover object-center h-full w-full"
								src={HOMEPAGEIMG}
							/>
							<div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
								<h1 class="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
									{selectedItem}
								</h1>
								<div>
									<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 relative justify-center place-items-center lg:px-10 md:px-5 sm:px-0 px-2 py-0 mt-0 mb-0">
										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2 w-full">
											{cities.map((city) => (
												<select
													id="button-filter"
													name="country"
													autocomplete="country-name"
                          							onChange={handleLocationChange}
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

										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2 w-full">
											<select
												id="button-filter"
												name="country"
												autocomplete="country-name"
												onChange={handleCategoryChange}
												class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
											>
												<option class="font-sans" value="Default">
													{selectedItem}
												</option>
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

										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2 w-full">
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

      <div class="bg-white p-6 mt-10 mb-10 flex flex-wrap gap-10 justify-center">
        <div class="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
          {/* {listingsData && listingsData.slice(0, 9).map((listing) => ( */}
          {listings && listings.map((listing) => (
            <div
              onClick={() => goToEventDetailsPage(listing)}
              className="lg:w-96 md:w-64 h-96 pb-20 w-full shadow-xl rounded-lg cursor-pointer"
            >
              <a className="block relative h-64 rounded overflow-hidden">
                <img
                  alt="ecommerce"
                  className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                  src={HOMEPAGEIMG}
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

      <footer class="text-center lg:text-left bg-black text-white">
            <div class="mx-6 py-10 text-center md:text-left">
            <div class="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div class="">
                <h6 class="

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
								<a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
									<svg
										aria-hidden="true"
										focusable="false"
										data-prefix="fab"
										data-icon="facebook-f"
										class="w-2.5 text-white"
										role="img"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 320 512"
									>
										<path
											fill="currentColor"
											d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
										></path>
									</svg>
								</a>
								<a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
									<svg
										aria-hidden="true"
										focusable="false"
										data-prefix="fab"
										data-icon="twitter"
										class="w-4 text-white"
										role="img"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
									>
										<path
											fill="currentColor"
											d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
										></path>
									</svg>
								</a>
								<a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
									<svg
										aria-hidden="true"
										focusable="false"
										data-prefix="fab"
										data-icon="instagram"
										class="w-3.5 text-white"
										role="img"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
									>
										<path
											fill="currentColor"
											d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
										></path>
									</svg>
								</a>
								<a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
									<svg
										aria-hidden="true"
										focusable="false"
										data-prefix="fab"
										data-icon="linkedin-in"
										class="w-3.5 text-white"
										role="img"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 448 512"
									>
										<path
											fill="currentColor"
											d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
										></path>
									</svg>
								</a>
							</div>
						</div>
						<div class="">
							<h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
								Learn More
							</h6>
							<p class="mb-4">
								<a href="#!" class="text-gray-600 font-sans">
									developer community
								</a>
							</p>
							<p class="mb-4">
								<a href="#!" class="text-gray-600 font-sans">
									Contact us
								</a>
							</p>
							<p class="mb-4">
								<a href="#!" class="text-gray-600 font-sans">
									Log in
								</a>
							</p>
						</div>
						<div class="">
							<h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
								Leagal
							</h6>
							<p class="mb-4">
								<a href="#!" class="text-gray-600 font-sans">
									imprint
								</a>
							</p>
							<p class="mb-4">
								<a href="#!" class="text-gray-600 font-sans">
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