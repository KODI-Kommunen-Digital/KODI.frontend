import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { getDashboarddata } from "../../Services/dashboarddata";
import { useNavigate } from "react-router-dom";
import HOMEPAGEIMG from "../../assets/homeimage.jpg";
import { useTranslation } from "react-i18next";
import { getCategoriesdata } from "../../Services/CategoriesData";
import { getUserListings } from "../../Services/usersApi";
import {
	sortByTitleAZ,
	sortByTitleZA,
	sortRecent,
	sortOldest,
} from "../../Services/helper";

const Places = () => {
	window.scrollTo(0, 0);
	const [dashboarddata, setDashboarddata] = useState({ listings: [] });
	useEffect(() => {
		getDashboarddata().then((response) => {
			setDashboarddata(response);
		});
		document.title = selectedItemLocation;
	}, []);

	let navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	const [listings, setListings] = useState([]);
	useEffect(() => {
		getUserListings().then((response) => {
			setListings([...sortRecent(response.data.data)]);
		});
	}, []);

	const [selectedCategory, setSelectedCategory] = useState("");
	const sortedListings = [...listings].sort((a, b) => {
		const dateA = new Date(a.date);
		const dateB = new Date(b.date);
		return dateB - dateA;
	});

	//populate the events titles starts
	const [categoriesdata, setCategoriesdata] = useState({
		categoriesListings: [],
	});
	useEffect(() => {
		getCategoriesdata().then((response) => {
			setCategoriesdata(response);
		});
		document.title = selectedItemLocation;
	}, []);

	//populate the events titles Ends
	// Selected Items Deletion Starts
	const selectedItemLocation = localStorage.getItem("selectedItemLocation");
	// Selected Items Deletion Ends

	function handleDashboardChange(event) {
		setDashboarddata({
			...dashboarddata,
			[event.target.name]: event.target.value,
		});
	}
	// Selected Items Deletion Starts
	const selectedItem = localStorage.getItem("selectedItem");
	// Selected Items Deletion Ends

	const [selectedSortOption, setSelectedSortOption] = useState("");
	function handleSortOptionChange(event) {
		setSelectedSortOption(event.target.value);
	}

	useEffect(() => {
		switch (selectedSortOption) {
			case "titleAZ":
				setListings([...sortByTitleAZ(listings)]);
				console.log(listings);
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

	const { t, i18n } = useTranslation();

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
								<h1 class="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4">
									{selectedItemLocation}
								</h1>
								<div>
									<div class="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 relative justify-center place-items-center lg:px-10 md:px-5 sm:px-0 px-2 py-0 mt-0 mb-0">
										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2 w-full">
											<select
												id="button-filter"
												name="country"
												autocomplete="country-name"
												class="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
											>
												<option value="Default">{selectedItemLocation}</option>
												{selectedItemLocation !== "Below" ? (
													<option value="Below">Below</option>
												) : null}
												{selectedItemLocation !== "Fuchstal" ? (
													<option value="Fuchstal">Fuchstal</option>
												) : null}
												{selectedItemLocation !== "Apple village" ? (
													<option value="Apple village">Apple village</option>
												) : null}
											</select>
										</div>

										<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2 w-full">
											<select
												id="button-filter"
												name="country"
												autocomplete="country-name"
												class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
											>
												<option>{t("chooseOneCategory")}</option>
												<option value="News">News</option>
												<option value="Road Works / Traffic">
													Road Works / Traffic
												</option>
												<option value="Events">Events</option>
												<option value="Clubs">Clubs</option>
												<option value="Regional Products">
													Regional Products
												</option>
												<option value="Offer / Search">Offer / Search</option>
												<option value="New Citizen Info">
													New Citizen Info
												</option>
												<option value="Direct Report">Direct Report</option>
												<option value="Lost And Found">Lost And Found</option>
												<option value="Company Portraits">
													Company Portraits
												</option>
												<option value="Carpooling And Public Transport">
													Carpooling And Public Transport
												</option>
												<option value="Offers">Offers</option>
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

			{/* <h2 class="text-gray-900 mb-10 text-2xl md:text-3xl mt-20 lg:text-4xl title-font text-center font-bold">
        below
      </h2>

      <div className="flex mx-auto flex-wrap mb-10 justify-center">
        <a
          onClick={onCancel}
          className={`cursor-pointer sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start title-font font-bold inline-flex items-center leading-none border-gray-500 tracking-wider rounded-t ${
            selectedLink === "current" ? "text-blue-800" : "text-gray-500"
          }`}
        >
          <svg
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            className="w-5 h-5 mr-3"
            viewBox="0 0 24 24"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          </svg>
          Current
        </a>
        {/* ----- removed for the time ------ */}
			{/* <a
        onClick={customerServiceData}
        id="loadMoreBtn"
        className={`cursor-pointer sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-bold inline-flex items-center leading-none border-gray-500 tracking-wider rounded-t ${selectedLink === 'customerService' ? 'text-blue-800' : 'text-gray-500'}`}
      >
        Citizen Services
      </a>
      </div> */}

			{/* <div className="my-0 bg-gray-300 h-[1px]"></div> */}

			{/* <div class="w-full h-[28rem] bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div class="p-6 space-y-0 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl ">
              Filter your result
            </h1>
            <form class="space-y-4 md:space-y-6" action="#">
              <div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                <label for="floatingInput" class="text-gray-700 font-bold">
                  Location
                </label>
                <select
                  id="button-filter"
                  name="country"
                  autocomplete="country-name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option value="Default">{selectedItemLocation}</option>
                  {selectedItemLocation !== "Below" ? (
                    <option value="Below">Below</option>
                  ) : null}
                  {selectedItemLocation !== "Fuchstal" ? (
                    <option value="Fuchstal">Fuchstal</option>
                  ) : null}
                  {selectedItemLocation !== "Apple village" ? (
                    <option value="Apple village">
                    Apple village
                  </option>
                  ) : null}
                </select>
              </div>
              <div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                <label for="floatingInput" class="text-gray-700 font-bold">
                  Category
                </label>
                <select
                  id="country"
                  name="country"
                  autocomplete="country-name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option>Choose a category</option>
                  <option value="News">News</option>
                  <option value="Road Works / Traffic">
                    Road Works / Traffic
                  </option>
                  <option value="Events">Events</option>
                  <option value="Clubs">Clubs</option>
                  <option value="Regional Products">Regional Products</option>
                  <option value="Offer / Search">Offer / Search</option>
                  <option value="New Citizen Info">New Citizen Info</option>
                  <option value="Direct Report">Direct Report</option>
                  <option value="Lost And Found">Lost And Found</option>
                  <option value="Company Portraits">Company Portraits</option>
                  <option value="Carpooling And Public Transport">
                    Carpooling And Public Transport
                  </option>
                  <option value="Offers">Offers</option>
                </select>
              </div>
              {customerServiceDataload && (
                <>
                  <div class="flex justify-center">
                    <div class="timepicker relative form-floating mb-3 xl:w-96">
                      <label
                        for="floatingInput"
                        class="text-gray-700 font-bold"
                      >
                        Time
                      </label>
                      <input
                        type="text"
                        class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Select a time"
                      />
                    </div>
                  </div>
                  {/* <div class="flex justify-center">
                  <div class="timepicker relative form-floating mb-3 xl:w-96">
                    <TimePicker />
                  </div>
              </div>
                  <div>
                    <label for="floatingInput" class="text-gray-700 font-bold">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter your phone number..."
                      required=""
                    />
                  </div>
                  <div>
                    <label for="floatingInput" class="text-gray-700 font-bold">
                      Review
                    </label>
                    <input
                      type="text"
                      name="email"
                      id="email"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Write your review..."
                      required=""
                    />
                  </div>
                </>
              )}
            </form>
          </div>
          <div class="mb-4 ml-7 mr-7">
            <button
              type="submit"
              class="group relative flex w-full justify-center rounded-md border border-transparent bg-blue-800 py-2 px-4 text-sm font-medium text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
            >
              <span class="absolute inset-y-0 left-0 flex items-center pl-3"></span>
              Apply Filter
            </button>
          </div>
          <div class="mb-4 ml-7 mr-7">
            <button
              type="submit"
              class="group relative flex w-full justify-center rounded-md border border-transparent text-blue-800 bg-slate-300 py-2 px-4 text-sm font-medium shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
            >
              <span class="absolute inset-y-0 left-0 flex items-center pl-3"></span>
              Remove Filter
            </button>
          </div>
        </div> */}

			<div class="bg-white p-6 mt-10 mb-10 flex flex-wrap gap-10 justify-center">
				<div class="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
					{/* {listingsData && listingsData.slice(0, 9).map((listing) => ( */}
					{sortedListings &&
						sortedListings.map((listing) => (
							<div
								onClick={() => navigateTo("/HomePage/EventDetails")}
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
								<a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
								<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24">
								<path
									d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
								</svg>
								</a>
								<a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
								<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24">
								<path
									d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
								</svg>
								</a>
								<a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
								<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24">
								<path
									d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
								</svg>
								</a>
								<a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
								<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5"
								fill="currentColor"
								viewBox="0 0 24 24">
								<path
									d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
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

export default Places;
