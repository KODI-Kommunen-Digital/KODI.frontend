import React, { useEffect, useState } from "react";
import HomePageNavBar from "../../Components/V2/HomePageNavBar";
import RegionColors from "../../Components/RegionColors";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getListings, getListingsCount, getListingsBySearch } from "../../Services/listingsApi";
import { getCities } from "../../Services/cities";
import Footer from "../../Components/Footer";
import PrivacyPolicyPopup from "../PrivacyPolicyPopup";
import ListingsCard from "../../Components/ListingsCard";
import SearchBar from "../../Components/SearchBar";
import { getCategory } from "../../Services/CategoryApi";
import LoadingPage from "../../Components/LoadingPage";
import {
  sortByTitleAZ,
  sortByTitleZA,
  sortLatestFirst,
  sortOldestFirst,
} from "../../Services/helper";
import { hiddenCategories } from "../../Constants/hiddenCategories";

import CITYIMAGE from "../../assets/City.png";
import CITYDEFAULTIMAGE from "../../assets/CityDefault.png";
import ONEIMAGE from "../../assets/01.png";
import TWOIMAGE from "../../assets/02.png";
import THREEIMAGE from "../../assets/03.png";
import MostPopularCategories from "../../Components/V2/MostPopularCategories";

const HomePage = () => {
  const { t } = useTranslation();
  const [cityId, setCityId] = useState();
  const [categoryId, setCategoryId] = useState();
  const [cities, setCities] = useState([]);
  const [listings, setListings] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [listingsCount, setListingsCount] = useState([]);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showPopup, setShowPopup] = useState(false);
  const [categories, setCategories] = useState([]);

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
    const categoryId = parseInt(urlParams.get("categoryId"));
    if (categoryId) {
      setCategoryId(categoryId);
    }
    getListingsCount().then((response) => {
      const data = response.data.data;
      const sortedData = data.sort(
        (a, b) => parseInt(b.totalCount) - parseInt(a.totalCount)
      );

      setListingsCount(sortedData);
    });

    getCategory().then((response) => {
      const catList = {};
      response?.data?.data
        .filter(cat => !hiddenCategories.hiddenCategories.includes(cat.id))
        .forEach((cat) => {
          catList[cat.id] = cat.name;
        });
      setCategories(catList);
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
    setIsLoading(true);
    const params = { pageSize: 12, statusId: 1, pageNo: 1 };
    if (parseInt(cityId)) {
      urlParams.set("cityId", cityId);
      params.cityId = cityId;
    } else {
      urlParams.delete("cityId");
    }
    if (parseInt(categoryId)) {
      urlParams.set("categoryId", categoryId);
      params.categoryId = categoryId;
    } else {
      urlParams.delete("categoryId");
    }

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, "", newUrl);

    setTimeout(() => {
      fetchData(params);
    }, 1000);
  }, [cities, cityId, categoryId]);

  const fetchData = async (params) => {
    params.showExternalListings = "false";
    try {
      const response = await getListings(params);
      const listings = response.data.data;

      const filteredListings = listings.filter(
        listing => !hiddenCategories.hiddenCategories.includes(listing.categoryId)
      );

      setListings(filteredListings);
    } catch (error) {
      setListings([]);
      console.error("Error fetching listings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  function getTheListings(categoryId, event) {
    event.preventDefault();

    const selectedCategoryId = categoryId;
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCityId = urlParams.get("cityId");

    if (selectedCategoryId && selectedCityId) {
      localStorage.setItem("selectedCategory", selectedCategoryId.name);
      window.location.href = `?categoryId=${selectedCategoryId}&cityId=${selectedCityId}`;
    } else if (selectedCategoryId) {
      localStorage.setItem("selectedCategory", selectedCategoryId.name);
      window.location.href = `?categoryId=${selectedCategoryId}`;
    } else if (selectedCityId) {
      window.location.href = `?cityId=${selectedCityId}`;
    } else {
      localStorage.setItem("selectedCategory", t("allCategories"));
      localStorage.setItem("selectedCity", t("allCities"));
      urlParams.delete("cityId");
      urlParams.delete("categoryId");
      setCityId(0);
      setCategoryId("all");
      window.location.href = `?`;
    }
  }

  window.scrollTo(0, sessionStorage.getItem("scrollPosition"));

  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("scrollPosition", window.scrollY);
  });


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
  }, [selectedSortOption]); // We removed [selectedSortOption, listings] due to Warning: Maximum update depth exceeded. This can happen when a component calls setState inside useEffect, but useEffect either doesn't have a dependency array, or one of the dependencies changes on every render

  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  function handleSortOptionChange(event) {
    const newValue = event.target.value;
    if (newValue !== selectedSortOption) {
      setSelectedSortOption(newValue);
    }
  }

  const handleSearch = async (searchQuery) => {
    console.log("Search term:", searchQuery);

    try {
      const urlParams = new URLSearchParams(window.location.search);
      const params = { statusId: 1 };

      const cityId = urlParams.get('cityId');
      if (cityId && parseInt(cityId)) {
        params.cityId = parseInt(cityId);
      }

      const categoryId = urlParams.get('categoryId');
      if (categoryId && parseInt(categoryId)) {
        params.categoryId = parseInt(categoryId);
      }
      const response = await getListingsBySearch({
        searchQuery,
        ...params
      });
      setListings(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }

    // const listingsSection = document.getElementById("listingsSection");
    // listingsSection.scrollIntoView({ behavior: "smooth" });  // Use this if you want navidation to a place in page. Use id="listingsSection" in that section
  };

  function goToCitizensPage() {
    let navUrl = `/CitizenService`;
    if (cityId) navUrl = `/CitizenService?cityId=${cityId}`;
    navigateTo(navUrl);
  }

  const handlePrivacyPolicyAccept = () => {
    localStorage.setItem("privacyPolicyAccepted", "true");
    setShowPopup(false);
  };

  return (
    <section className="text-gray-600 body-font relative">
      <HomePageNavBar />
      {showPopup && <PrivacyPolicyPopup onClose={handlePrivacyPolicyAccept} />}

      <div className="container-fluid py-0 mr-0 ml-0 mt-0 w-full flex flex-col relative">
        <div className="w-full mr-0 ml-0">
          <div className="h-[30rem] lg:h-full overflow-hidden px-0 py-0 relative">
            <div className="relative h-[30rem]">
              <img
                alt="ecommerce"
                className="object-cover object-center h-full w-full"
                src={process.env.REACT_APP_BUCKET_HOST + "admin/Homepage.jpg"}
                loading="lazy"
              />
              <div className="absolute inset-0 flex flex-col gap-4 items-start justify-center bg-gray-800 bg-opacity-50 text-white z--1">
                <div className="flex flex-col items-start max-w-[90%] md:max-w-[70%] lg:max-w-[60%] lg:px-20 md:px-5 px-5 py-6">
                  <h1
                    className="font-sans mb-8 lg:mb-12 text-4xl md:text-6xl lg:text-7xl font-bold tracking-wide"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {t("homePageHeading")}
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <MostPopularCategories
            listingsCount={listingsCount}
            t={t}
            getTheListings={getTheListings}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="grid md:grid-cols-2 grid-cols-1 lg:gap-4 md:gap-4 gap-2 relative mt-10 justify-between">
            <div className="text-slate-800 lg:px-20 md:px-5 px-5 py-6 text-xl md:text-3xl lg:text-3xl title-font text-start font-sans font-bold"
              style={{ fontFamily: "Poppins, sans-serif" }}>
              {categoryId ? (
                <h2>{t(categories[categoryId])}</h2>
              ) : (
                <h2>{t("allCategories")}</h2>
              )}
            </div>

            <div className="flex flex-col md:flex-row lg:gap-4 md:gap-4 gap-2 relative justify-center place-items-center lg:px-20 md:px-5 px-5 py-6">
              <div className="col-span-6 sm:col-span-1 mt-0 mb-0 px-0 mr-0 w-full">
                <select
                  value={selectedSortOption}
                  onChange={handleSortOptionChange}
                  className="bg-white h-10 border-2 border-gray-500 px-5 pr-10 rounded-xl text-sm focus:outline-none w-full text-gray-600 cursor-pointer"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  <option value="">{t("sort")}</option>
                  <option value="titleAZ">{t("atoztitle")}</option>
                  <option value="titleZA">{t("ztoatitle")}</option>
                  <option value="recent">{t("recent")}</option>
                  <option value="oldest">{t("oldest")}</option>
                </select>

                {/* <select
                  className="text-slate-800 rounded-md p-4 gap-2 text-md font-bold cursor-pointer bg-transparent border-none focus:outline-none"
                  value={selectedSortOption}
                  onChange={handleSortOptionChange}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <option value="">{t("sort")}</option>
                  <option value="titleAZ">{t("atoztitle")}</option>
                  <option value="titleZA">{t("ztoatitle")}</option>
                  <option value="recent">{t("recent")}</option>
                  <option value="oldest">{t("oldest")}</option>
                </select> */}
              </div>

              <SearchBar onSearch={handleSearch} searchBarClassName="w-full" />
            </div>
          </div>

          {listings && listings.length > 0 ? (
            <div className="bg-white lg:px-20 md:px-5 px-5 py-6 mt-0 mb-10 space-y-10 flex flex-col">
              <div className="relative place-items-center bg-white mt-4 mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-10 justify-start">
                {listings &&
                  listings.map((listing, index) => (
                    <ListingsCard listing={listing} key={index} />
                  ))}
              </div>

              <a className="relative w-full items-center justify-center inline-block px-4 py-2 font-medium group" type="submit"
                onClick={() => {
                  localStorage.setItem("selectedItem", t("chooseOneCategory"));
                  navigateTo("/AllListings");
                }} style={{ fontFamily: "Poppins, sans-serif" }}>
                <span className="absolute inset-0 w-full sm:w-80 h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 bg-slate-800 group-hover:-translate-x-0 group-hover:-translate-y-0"></span>
                <span className="absolute inset-0 w-full sm:w-80 h-full bg-white border-2 border-slate-800 group-hover:bg-slate-800"></span>
                <span className="relative text-slate-800 group-hover:text-white">{t("viewMore")}</span>
              </a>
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
                  className={`m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer ${RegionColors.lightTextColor}`}
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

          <h2
            className="text-slate-800 lg:px-20 md:px-5 px-5 py-6 text-xl md:text-3xl mt-10 lg:text-3xl title-font text-start font-sans font-bold"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {t("discoverMorePlaces")}
          </h2>

          <div className="bg-white lg:px-20 md:px-5 px-5 py-6 mt-0 mb-10 space-y-10 flex flex-col">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 relative mb-4 justify-center place-items-center">
              {cities.map((city) => {
                if (city.id !== Number(cityId)) {
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
                            e.target.src = CITYDEFAULTIMAGE; // Set default image if loading fails
                          }}
                        />
                        <div className="absolute inset-0 flex flex-col justify-end text-white z--1" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)' }}>
                          <h1 className="text-xl pb-5 md:text-3xl font-sans font-bold mb-0 ml-4" style={{ fontFamily: "Poppins, sans-serif" }}>
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

          {/* <div className="my-4 bg-gray-200 h-[1px]"></div> */}

          {/* <div className="bg-slate-500 lg:px-20 md:px-5 px-5 py-6 mt-10 mb-10 space-y-10 flex flex-col"> */}
          <div className="bg-white lg:px-20 md:px-5 px-5 py-6 space-y-10 flex flex-col">
            <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 relative mb-4 justify-center gap-4 place-items-center">
              <div className="pb-10 w-full mb-4 bg-slate-100 rounded-xl cursor-pointer">
                <div className="relative h-96 rounded overflow-hidden w-auto">
                  <img
                    alt="ecommerce"
                    className="object-cover object-center h-48 w-48 m-auto"
                    src={ONEIMAGE}
                  />
                  <div className="p-6">
                    <h2
                      className="text-slate-800 mb-2 text-2xl md:text-2xl lg:text-3xl mt-2 title-font text-start font-bold font-sans"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {t("createAnAccount")}
                    </h2>
                    <p
                      className="text-slate-800 title-font text-lg font-bold text-start font-sans"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {t("createAnAccountDescription")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pb-10 w-full mb-4 bg-slate-100 rounded-xl cursor-pointer">
                <div className="relative h-96 w-96 rounded overflow-hidden w-auto">
                  <img
                    alt="ecommerce"
                    className="object-cover object-center h-48 w-48 m-auto"
                    src={TWOIMAGE}
                  />
                  <div className="p-6">
                    <h2
                      className="text-slate-800 mb-2 text-2xl md:text-2xl lg:text-3xl mt-2 title-font text-start font-bold font-sans"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {t("getVerified")}
                    </h2>
                    <p
                      className="text-slate-800 title-font text-lg font-bold text-start font-sans"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {t("getVerifiedDescription")}
                    </p>
                  </div>
                </div>
              </div>
              <div className="pb-10 w-full mb-4 bg-slate-100 rounded-xl cursor-pointer">
                <div className="relative h-96 w-96 rounded overflow-hidden w-auto">
                  <img
                    alt="ecommerce"
                    className="object-cover object-center h-48 w-48 m-auto"
                    src={THREEIMAGE}
                  />
                  <div className="p-6">
                    <h2
                      className="text-slate-800 mb-2 text-2xl md:text-2xl lg:text-3xl mt-2 title-font text-start font-bold font-sans"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {t("start")}
                    </h2>
                    <p
                      className="text-slate-800 title-font text-lg font-bold text-start font-sans"
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

          <div className={`mx-auto lg:px-20 md:px-5 px-5 py-6 flex justify-center lg:h-[28rem] sm:h-[35rem] ${RegionColors.lightBgColor}`}>
            <div className="flex flex-wrap items-center">
              <div className="w-full md:w-1/2 px-4">
                <h2
                  className="text-4xl text-white font-bold mb-4 font-sans"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {t("citizenService")}
                </h2>
                <p
                  className="mb-4 text-slate-800 text-lg font-bold font-sans"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  {t("findBestCitizenServicesInTheCity")}
                </p>

                <a
                  onClick={() => goToCitizensPage()}
                  className={`flex items-center ${RegionColors.darkTextColor} border ${RegionColors.darkBorderColor} py-2 px-6 gap-2 rounded inline-flex items-center cursor-pointer`}
                  style={{ fontFamily: "Poppins, sans-serif" }}>
                  <span>
                    {t("clickHereToFind")}
                  </span>
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                    viewBox="0 0 24 24" className="w-6 h-6 ml-2">
                    <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
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

          <div className={`${RegionColors.darkBgColor} lg:px-20 md:px-5 px-5 py-6 flex justify-start`}>
            <style>
              {`
								@media (max-width: 280px) {
									.galaxy-fold {
										flex-direction: column; /* Adjust the margin value as needed */
									}
								}
							`}
            </style>
            <div className="flex flex-col md:flex-row place-items-center justify-start">
              <p
                className="flex mt-4 px-4 py-2 text-white items-center cursor-pointer text-lg font-bold font-sans"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {t("downloadUs")}
              </p>
              <div className="flex mt-4 px-4 py-2 md:gap-4 gap-4 items-center cursor-pointer galaxy-fold">
                <div
                  className="flex mt-0 w-36 h-10 bg-white text-black rounded-lg items-center justify-center transition duration-300 transform hover:scale-105"
                  onClick={() => {
                    if (process.env.REACT_APP_REGION_NAME === "WALDI") {
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
                  <div className="block">
                    <div className="text-xs">{t("downloadOnThe")}</div>
                    <div className="-mt-1 font-sans text-sm font-semibold">
                      {t("appStore")}
                    </div>
                  </div>
                </div>

                <div
                  className="flex mt-0 w-36 h-10 bg-white text-black rounded-lg items-center justify-center transition duration-300 transform hover:scale-105"
                  onClick={() => {
                    if (process.env.REACT_APP_REGION_NAME === "WALDI") {
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
                  <div className="block">
                    <div className="text-xs">{t("getItOn")}</div>
                    <div className="-mt-1 font-sans text-sm font-semibold">
                      {t("googlePlay")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {!isLoading && (
        <div className="bottom-0 w-full">
          <Footer />
        </div>
      )}

    </section>
  );
};

export default HomePage;