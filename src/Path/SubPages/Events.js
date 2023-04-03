import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { getListingsByCity } from "../../Services/listings";
import { useNavigate } from "react-router-dom";
import {sortByTitleAZ, sortByTitleZA, sortRecent, sortOldest} from "../../Services/helper"
import HOMEPAGEIMG from "../../assets/homeimage.jpg";
import { useTranslation } from "react-i18next";

import ('https://fonts.googleapis.com/css2?family=Poppins:wght@200;600&display=swap');

const Events = () => {
  //window.scrollTo(0, 0);
  const { t, i18n } = useTranslation();

  //populate the events titles starts
  const [listingsData, setListingsData] = useState([]);
  useEffect(() => {
    getListingsByCity().then((response) => {
      setListingsData(response);
    });
    document.title = selectedItem;
  }, []);

  //populate the events titles Ends

  // Selected Items Deletion Starts
  const selectedItem = localStorage.getItem('selectedItem');
  // Selected Items Deletion Ends

  let navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };



  function handleCategoriesChange(event) {
    setListingsData({
      ...listingsData,
      [event.target.name]: event.target.value,
    });
  }


  const [selectedSortOption, setSelectedSortOption] = useState('');
  function handleSortOptionChange(event) {
    setSelectedSortOption(event.target.value);
  }

  useEffect(() => {
    switch (selectedSortOption) {
      case 'titleAZ':
        setListingsData([...sortByTitleAZ(listingsData)])
        console.log(listingsData)
        break;
      case 'titleZA':
        setListingsData([...sortByTitleZA(listingsData)]);
        break;
      case 'recent':
        setListingsData([...sortRecent(listingsData)]);
        break;
      case 'oldest':
        setListingsData([...sortOldest(listingsData)]);
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

  function handleLocationChange(event) {
    setLocation(event.target.value);
  }

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
            {/* <a class="block relative h-96 overflow-hidden">
            <img
              alt="ecommerce"
              class="object-cover object-center h-full w-full"
              src= {HOMEPAGEIMG}
            />
          </a> */}
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
                      {/* <label for="floatingInput" class="text-gray-700 font-bold font-sans">
                          {t("location")}
                      </label> */}
                      <select
                          id="button-filter"
                          name="country"
                          autocomplete="country-name"
                          class="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                          <option class="font-sans" value="Default">
                          {t("chooseOneLocation")}
                          </option>
                          <option class="font-sans" value="Default">
                          {t("below")}
                          </option>
                          <option class="font-sans" value="News">
                          {t("fuchstal")}
                          </option>
                          <option class="font-sans" value="Road Works / Traffic">
                          {t("appleVillage")}
                          </option>
                      </select>
                      </div>

                    <div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2 w-full">
                      {/* <label for="floatingInput" class="text-gray-700 font-bold font-sans">
                          {t("category")}
                      </label> */}
                      <select
                          id="button-filter"
                          name="country"
                          autocomplete="country-name"
                          class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      >
                          <option class="font-sans" value="Default">{selectedItem}</option>
                            {selectedItem !== "News" ? (
                              <option value="News">{t("news")}</option>
                            ) : null}
                            {selectedItem !== "Road Works / Traffic" ? (
                              <option class="font-sans" value="Road Works / Traffic">
                              {t("roadTraffic")}
                            </option>
                            ) : null}
                            {selectedItem !== "Events" ? (
                              <option class="font-sans" value="Events">{t("events")}</option>
                            ) : null}
                            {selectedItem !== "Clubs" ? (
                              <option class="font-sans" value="Clubs">{t("clubs")}</option>
                            ) : null}
                            {selectedItem !== "Regional Products" ? (
                              <option class="font-sans" value="Regional Products">{t("regionalProducts")}</option>
                            ) : null}
                            {selectedItem !== "Offer / Search" ? (
                              <option class="font-sans" value="Offer / Search">{t("offerSearch")}</option>
                            ) : null}
                            {selectedItem !== "New Citizen Info" ? (
                              <option class="font-sans" value="New Citizen Info">{t("newCitizenInfo")}</option>
                            ) : null}
                            {selectedItem !== "Defect Report" ? (
                              <option class="font-sans" value="Direct Report">{t("defectReport")}</option>
                            ) : null}
                            {selectedItem !== "Lost And Found" ? (
                              <option class="font-sans" value="Lost And Found">{t("lostAndFound")}</option>
                            ) : null}
                            {selectedItem !== "Company Portraits" ? (
                              <option class="font-sans" value="Company Portraits">{t("companyPortaits")}</option>
                            ) : null}
                            {selectedItem !== "Carpooling And Public Transport" ? (
                              <option class="font-sans" value="Carpooling And Public Transport">
                              {t("carpoolingPublicTransport")}
                            </option>
                            ) : null}
                            {selectedItem !== "Offers" ? (
                              <option class="font-sans" value="Offers">{t("offers")}</option>
                            ) : null}
                      </select>
                      </div>

                      <div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2 w-full">
                        <select id="country" name="country" value={selectedSortOption} onChange={handleSortOptionChange} autocomplete="country-name" class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500">
                          <option value="">{t("sort")}</option>
                          <option value = "titleAZ">{t("atoztitle")}</option>
                          <option value = "titleZA">{t("ztoatitle")}</option>
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
        events
      </h2> */}

      {/* <div className="flex mx-auto flex-wrap mb-10 justify-center">
        <a
          onClick={onCancel}
          className={`cursor-pointer sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start title-font font-bold inline-flex items-center leading-none tracking-wider rounded-t ${
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
          className={`cursor-pointer sm:px-6 py-3 w-1/2 sm:w-auto justify-center sm:justify-start border-b-2 title-font font-bold inline-flex items-center leading-none border-gray-500 tracking-wider rounded-t ${
            selectedLink === "customerService"
              ? "text-blue-800"
              : "text-gray-500"
          }`}
        >
          Citizen Services
        </a>
      </div>
      <div className="my-0 bg-gray-300 h-[1px]"></div>*/}

      {/* <div class="bg-white">
        <div class="mx-auto p-6 mt-4 mb-4 flex flex-col sm:flex-row sm:justify-between items-center">
          <p class="text-black text-lg text-center sm:text-left justify-start sm:ml-20 mb-4 sm:mb-0">
            7
            <a
              href="https://heidi-app.de/"
              rel="noopener noreferrer"
              class="text-black ml-1"
              target="_blank"
            >
              {t("itemsFound")}
            </a>
          </p> */}
          {/* ----- removed for the time ------ */}
            {/* <div class="flex items-center justify-end sm:justify-between w-full sm:w-auto mr-20">
                <button type="button" class="text-gray-900 bg-gray-100 hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 mb-2 sm:mr-4">
                    <svg class="w-4 h-4 mr-2 -ml-1 text-[#626890]" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="ethereum" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path fill="currentColor" d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"></path>
                    </svg>
                    Show map
                </button>
            </div>
        </div>
      </div>*/}

        {/* <div class="w-full h-[28rem] bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:white dark:white">
          <div class="p-6 space-y-10 md:space-y-6 sm:p-8">
            <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900 font-sans">
              {t("filteryourResult")}
            </h1>
            <form class="space-y-4 md:space-y-6" action="#">

            <div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                <label for="floatingInput" class="text-gray-700 font-bold font-sans">
                  {t("location")}
                </label>
                <select
                  id="button-filter"
                  name="country"
                  autocomplete="country-name"
                  class="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option class="font-sans" value="Default">{t("chooseOneLocation")}</option>
                  <option class="font-sans" value="Default">{t("below")}</option>
                  <option class="font-sans" value="News">{t("fuchstal")}</option>
                  <option class="font-sans" value="Road Works / Traffic">
                    {t("appleVillage")}
                  </option>
                </select>
              </div>

              <div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                <label for="floatingInput" class="text-gray-700 font-bold font-sans">
                  {t("category")}
                </label>
                <select
                  id="button-filter"
                  name="country"
                  autocomplete="country-name"
                  class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                >
                  <option class="font-sans" value="Default">{selectedItem}</option>
                  {selectedItem !== "News" ? (
                    <option value="News">{t("news")}</option>
                  ) : null}
                  {selectedItem !== "Road Works / Traffic" ? (
                    <option class="font-sans" value="Road Works / Traffic">
                    {t("roadTraffic")}
                  </option>
                  ) : null}
                  {selectedItem !== "Events" ? (
                    <option class="font-sans" value="Events">{t("events")}</option>
                  ) : null}
                  {selectedItem !== "Clubs" ? (
                    <option class="font-sans" value="Clubs">{t("clubs")}</option>
                  ) : null}
                  {selectedItem !== "Regional Products" ? (
                    <option class="font-sans" value="Regional Products">{t("regionalProducts")}</option>
                  ) : null}
                  {selectedItem !== "Offer / Search" ? (
                    <option class="font-sans" value="Offer / Search">{t("offerSearch")}</option>
                  ) : null}
                  {selectedItem !== "New Citizen Info" ? (
                    <option class="font-sans" value="New Citizen Info">{t("newCitizenInfo")}</option>
                  ) : null}
                  {selectedItem !== "Defect Report" ? (
                    <option class="font-sans" value="Direct Report">{t("defectReport")}</option>
                  ) : null}
                  {selectedItem !== "Lost And Found" ? (
                    <option class="font-sans" value="Lost And Found">{t("lostAndFound")}</option>
                  ) : null}
                  {selectedItem !== "Company Portraits" ? (
                    <option class="font-sans" value="Company Portraits">{t("companyPortaits")}</option>
                  ) : null}
                  {selectedItem !== "Carpooling And Public Transport" ? (
                    <option class="font-sans" value="Carpooling And Public Transport">
                    {t("carpoolingPublicTransport")}
                  </option>
                  ) : null}
                  {selectedItem !== "Offers" ? (
                    <option class="font-sans" value="Offers">{t("offers")}</option>
                  ) : null}
                </select>
              </div>

              {customerServiceDataload && (
                <>
                  <div>
                    <label for="floatingInput" class="text-gray-700 font-bold font-sans">
                      Time
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Select Time..."
                      required=""
                    />
                  </div>
                  <div class="flex justify-center">
                  <div class="timepicker relative form-floating mb-3 xl:w-96">
                    <TimePicker />
                  </div>
              </div>
                  <div>
                    <label for="floatingInput" class="text-gray-700 font-bold font-sans">
                      Phone Number
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter your phone number..."
                      required=""
                    />
                  </div>
                  <div>
                    <label for="floatingInput" class="text-gray-700 font-bold font-sans">
                      Review
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      class="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
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
              class="group font-sans relative flex w-full justify-center rounded-md border border-transparent bg-blue-800 py-2 px-4 text-sm font-medium text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
            >
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 font-sans"></span>
              {t("applyFilter")}
            </button>
          </div>
          <div class="mb-4 ml-7 mr-7">
            <button
              type="submit"
              class="group font-sans relative flex w-full justify-center rounded-md border border-transparent text-blue-800 bg-slate-300 py-2 px-4 text-sm font-medium shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
            >
              <span class="absolute inset-y-0 left-0 flex items-center pl-3 font-sans"></span>
              {t("removeFilter")}
            </button>
          </div>
        </div> */}

      <div class="bg-white p-6 mt-10 mb-10 flex flex-wrap gap-10 justify-center">
        <div class="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
          {/* {listingsData && listingsData.slice(0, 9).map((listing) => ( */}
          {listingsData && listingsData.map((listing) => (
            <div
              onClick={() => navigateTo("/HomePage/EventDetails")}
              class="lg:w-96 md:w-64 h-96 pb-20 w-full shadow-xl rounded-lg cursor-pointer"
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
                    ">
                    <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cubes"
                    class="w-4 mr-3" role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512">
                    <path fill="currentColor"
                        d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z">
                    </path>
                    </svg>
                    Smart Regions
                </h6>
                <div class="uppercase font-semibold mb-4 flex justify-center md:justify-start gap-4">
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f"
                        class="w-2.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512">
                        <path fill="currentColor"
                        d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z">
                        </path>
                    </svg>
                    </a>
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter"
                        class="w-4 text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                        <path fill="currentColor"
                        d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z">
                        </path>
                    </svg>
                    </a>
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="instagram"
                        class="w-3.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="currentColor"
                        d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z">
                        </path>
                    </svg>
                    </a>
                    <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="linkedin-in"
                        class="w-3.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512">
                        <path fill="currentColor"
                        d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z">
                        </path>
                    </svg>
                    </a>
                </div>
                </div>
                <div class="">
                <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                    Learn More
                </h6>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">developer community</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">Contact us</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">Log in</a>
                </p>
                </div>
                <div class="">
                <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start font-sans">
                    Leagal
                </h6>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">imprint</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">terms and conditions</a>
                </p>
                <p class="mb-4">
                    <a href="#!" class="text-gray-600 font-sans">Data protection</a>
                </p>
                <p>
                    <a href="#!" class="text-gray-600 font-sans">Right of withdrawal</a>
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
            <span class="font-sans">© HeidiTheme 2023. All rights reserved. Created by  </span>
            <a class="text-white font-semibold underline font-sans" href="https://heidi-app.de/">HeimatDigital</a>
            </div>
        </footer>
    </section>
  );
};

export default Events;
