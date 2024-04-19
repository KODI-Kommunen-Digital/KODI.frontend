import React, { useEffect, useState, lazy, Suspense } from "react";
import HomePageNavBar from "../Components/HomePageNavBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SearchBar from "../Components/SearchBar";
import { getListings, getListingsCount, getListingsBySearch } from "../Services/listingsApi";
import { getCities } from "../Services/cities";
import Footer from "../Components/Footer";
import PrivacyPolicyPopup from "./PrivacyPolicyPopup";
import ListingsCard from "../Components/ListingsCard";

import CITYIMAGE from "../assets/City.png";
import CITYDEFAULTIMAGE from "../assets/CityDefault.png";
import ONEIMAGE from "../assets/01.png";
import TWOIMAGE from "../assets/02.png";
import THREEIMAGE from "../assets/03.png";
const LazyMostPopularCategories = lazy(() =>
  import("../Components//MostPopularCategories")
);

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

    document.title = process.env.REACT_APP_REGION_NAME + " " + t("home");
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
      const defaultCityName = process.env.REACT_APP_REGION_NAME === "HIVADA"
        ? t("allClusters")
        : (process.env.REACT_APP_NAME === 'KODI - DEMO' ? t("allCategories") : t("allCities"));

      localStorage.setItem("selectedCity", defaultCityName);
      urlParams.delete("cityId");
      setCityId(0);
    }
  };

  function goToAllListingsPage(category) {
    let navUrl = `/AllListings?categoryId=${category}`;
    if (cityId)
      navUrl = `/AllListings?categoryId=${category}` + `&cityId=${cityId}`;
    navigateTo(navUrl);
  }

  function goToCitizensPage() {
    let navUrl = `/CitizenService`;
    if (cityId) navUrl = `/CitizenService?cityId=${cityId}`;
    if (process.env.REACT_APP_NAME === 'KODI - DEMO') {
      window.location.href = "https://community.kodi-app.de/";
    } else {
      navigateTo(navUrl);
    }
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

  const handleSearch = async (searchQuery) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const params = { statusId: 1 };

      const cityId = urlParams.get("cityId");
      if (cityId && parseInt(cityId)) {
        params.cityId = parseInt(cityId);
      }

      const categoryId = urlParams.get("categoryId");
      if (categoryId && parseInt(categoryId)) {
        params.categoryId = parseInt(categoryId);
      }
      const response = await getListingsBySearch({
        searchQuery,
        ...params,
      });
      setListings(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }

    const listingsSection = document.getElementById("listingsSection");
    listingsSection.scrollIntoView({ behavior: "smooth" });
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
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
                <h1
                  className="font-sans mb-8 lg:mb-12 text-4xl md:text-6xl lg:text-7xl text-center font-bold tracking-wide"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {t(process.env.REACT_APP_NAME === "KODI - DEMO"
                    ? "homePageHeadingKODI"
                    : "homePageHeading",
                  )}
                </h1>

                <div className="flex justify-center px-5 py-2 gap-2 w-full md:w-auto fixed lg:w-auto relative">
                  <div className="relative w-full px-4 mb-4 mt-1 md:w-80">
                    <select
                      id="city"
                      name="city"
                      autoComplete="city-name"
                      onChange={onCityChange}
                      value={cityId || 0}
                      className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full text-gray-600"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      <option className="font-sans" value={0} key={0}>
                        {t(process.env.REACT_APP_REGION_NAME === "HIVADA"
                          ? "allClusters"
                          : (process.env.REACT_APP_NAME === 'KODI - DEMO' ? "allCategories" : "allCities"), {
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

                  <SearchBar
                    onSearch={handleSearch}
                    searchBarClassName="w-full md:w-80"
                  />
                </div>

                <div className="flex flex-col mt-4 md:gap-0 gap-2 cursor-pointer">
                  <div
                    className="flex mt-3 w-36 h-10 bg-black text-white rounded-lg items-center justify-center transition duration-300 transform hover:scale-105"
                    onClick={() => {
                      if (process.env.REACT_APP_REGION_NAME === "WALDI") {
                        window.location.href = process.env.REACT_APP_APPLESTORE;
                      } else if (process.env.REACT_APP_REGION_NAME === "KODI - DEMO") {
                        window.location.href = process.env.REACT_APP_APPLESTORE;
                      } else {
                        window.location.href = process.env.REACT_APP_APPLESTORE;
                      }
                    }}
                  >
                    <div className="mr-2">
                      <svg viewBox="0 0 384 512" width="20">
                        <path
                          fill="currentColor"
                          d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs">{t("downloadOnThe")}</div>
                      <div className="-mt-1 font-sans text-sm font-semibold">
                        {t("appStore")}
                      </div>
                    </div>
                  </div>

                  <div
                    className="flex mt-3 w-36 h-10 bg-black text-white rounded-lg items-center justify-center transition duration-300 transform hover:scale-105"
                    onClick={() => {
                      if (process.env.REACT_APP_REGION_NAME === "WALDI") {
                        window.location.href =
                          process.env.REACT_APP_GOOGLEPLAYSTORE;
                      } else if (process.env.REACT_APP_REGION_NAME === "KODI - DEMO") {
                        window.location.href =
                          process.env.REACT_APP_GOOGLEPLAYSTORE;
                      } else {
                        window.location.href =
                          process.env.REACT_APP_GOOGLEPLAYSTORE;
                      }
                    }}
                  >
                    <div className="mr-2">
                      <svg viewBox="30 336.7 120.9 129.2" width="20">
                        <path
                          fill="#FFD400"
                          d="M119.2,421.2c15.3-8.4,27-14.8,28-15.3c3.2-1.7,6.5-6.2,0-9.7  c-2.1-1.1-13.4-7.3-28-15.3l-20.1,20.2L119.2,421.2z"
                        />
                        <path
                          fill="#FF3333"
                          d="M99.1,401.1l-64.2,64.7c1.5,0.2,3.2-0.2,5.2-1.3  c4.2-2.3,48.8-26.7,79.1-43.3L99.1,401.1L99.1,401.1z"
                        />
                        <path
                          fill="#48FF48"
                          d="M99.1,401.1l20.1-20.2c0,0-74.6-40.7-79.1-43.1  c-1.7-1-3.6-1.3-5.3-1L99.1,401.1z"
                        />
                        <path
                          fill="#3BCCFF"
                          d="M99.1,401.1l-64.3-64.3c-2.6,0.6-4.8,2.9-4.8,7.6  c0,7.5,0,107.5,0,113.8c0,4.3,1.7,7.4,4.9,7.7L99.1,401.1z"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs">{t("getItOn")}</div>
                      <div className="-mt-1 font-sans text-sm font-semibold">
                        {t("googlePlay")}
                      </div>
                    </div>
                  </div>
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
        {t("mostPopularCategories")}
      </h2>

      <Suspense fallback={<div>Loading...</div>}>
        <LazyMostPopularCategories
          listingsCount={listingsCount}
          t={t}
          goToAllListingsPage={goToAllListingsPage}
        />
      </Suspense>

      {process.env.REACT_APP_REGION_NAME === "WALDI" && (
        <div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
          <button
            type="submit"
            onClick={() => goToCitizensPage()}
            className="w-full rounded-xl sm:w-80 mt-10 mx-auto bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer font-sans"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {t("mehr")}
          </button>
        </div>
      )}

      <h2
        className="text-gray-900 mb-20 text-3xl md:text-4xl lg:text-5xl mt-20 title-font text-center font-sans font-bold"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {t("discoverMorePlaces")}
      </h2>

      <div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 relative mb-4 justify-center place-items-center">
          {cities.map((city) => {
            const citiesToHide = ["2", "5", "7"];
            if (
              city.id !== Number(cityId) &&
              !(process.env.REACT_APP_NAME === "KODI - DEMO" && citiesToHide.includes(city.id.toString()))
            ) {
              return (
                <div
                  key={city.id}
                  onClick={() => {
                    const scrollPosition = window.scrollY;
                    localStorage.setItem("selectedCity", city.name);
                    navigateTo(`/AllListings?cityId=${city.id}`);
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
                      onError={(e) => {
                        e.target.src = CITYDEFAULTIMAGE;
                      }}
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
        id="listingsSection"
        className="text-gray-900 mb-20 text-3xl md:text-4xl lg:text-5xl mt-20 title-font text-center font-sans font-bold"
        style={{ fontFamily: "Poppins, sans-serif" }}
      >
        {t(process.env.REACT_APP_NAME === "KODI - DEMO"
          ? "recentListingsKODI"
          : "recentListings",
        )}
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
              navigateTo("/AllListings");
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

      {process.env.REACT_APP_REGION_NAME !== "WALDI" && (
        <div className="bg-blue-400 mx-auto py-10 px-4 flex justify-center lg:h-[28rem] sm:h-[35rem]">
          <div className="flex flex-wrap items-center">
            <div className="w-full md:w-1/2 px-4">
              <h2
                className="text-4xl text-white font-bold mb-4 font-sans"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {process.env.REACT_APP_NAME === 'KODI - DEMO' ? t("community") : t("citizenService")}
              </h2>
              <p
                className="mb-4 text-gray-900 text-lg font-bold font-sans"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {process.env.REACT_APP_NAME === 'KODI - DEMO' ? t("findCommunity") : t("findBestCitizenServicesInTheCity")}
              </p>
              <a
                onClick={() => goToCitizensPage()}
                className="ml-0 w-full sm:w-48 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {process.env.REACT_APP_NAME === 'KODI - DEMO' ? t("button") : t("clickHereToFind")}
              </a>
            </div>

            <div className="w-full md:w-1/2 flex flex-wrap lg:mt-0 md:mt-6 mt-6">
              <img
                src={
                  process.env.REACT_APP_BUCKET_HOST + "admin/CitizenService2.png"
                }
                alt="Image 1"
                className="w-full md:w-98 mb-2"
              />
            </div>
          </div>
        </div>
      )}

      <div className="bottom-0 w-full">
        <Footer />
      </div>
    </section>
  );
};

export default HomePage;
