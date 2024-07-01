import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/V1/HomePageNavBar";
import SearchBar from "../../Components/SearchBar";
import ListingsCard from "../../Components/ListingsCard";
import { useNavigate, useLocation } from "react-router-dom";
import {
  sortByTitleAZ,
  sortByTitleZA,
  sortLatestFirst,
  sortOldestFirst,
} from "../../Services/helper";
import { useTranslation } from "react-i18next";
import { getListings, getListingsBySearch } from "../../Services/listingsApi";
import { getCities } from "../../Services/cities";
import { categoryById } from "../../Constants/categories";
import { hiddenCategories } from "../../Constants/hiddenCategories";
import Footer from "../../Components/Footer";
import LoadingPage from "../../Components/LoadingPage";
import { getCategory } from "../../Services/CategoryApi";
import RegionColors from "../../Components/RegionColors";

const AllListings = () => {
  window.scrollTo(0, 0);
  const pageSize = 12;
  const { t } = useTranslation();
  const [cityId, setCityId] = useState("");
  const [cities, setCities] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [selectedCategory, setCategoryName] = useState(t("allCategories"));
  const [selectedCity, setCityName] = useState(
    t("allCities", {
      regionName: process.env.REACT_APP_REGION_NAME,
    })
  );
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [listings, setListings] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    document.title = process.env.REACT_APP_REGION_NAME + " " + t("allEvents");
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken =
      window.localStorage.getItem("accessToken") ||
      window.sessionStorage.getItem("accessToken");
    const refreshToken =
      window.localStorage.getItem("refreshToken") ||
      window.sessionStorage.getItem("refreshToken");
    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
    }
    setIsLoading(true);
    Promise.all([getCities(), getCategory()]).then((response) => {
      setCities(response[0].data.data);

      const filteredCategories = response[1]?.data?.data.filter(
        category => !hiddenCategories.hiddenCategories.includes(category.id)
      );

      setCategories(filteredCategories || []);
      const params = { pageSize, statusId: 1 };
      const pageNoParam = parseInt(urlParams.get("pageNo"));
      if (pageNoParam > 1) {
        params.pageNo = pageNoParam;
        urlParams.set("pageNo", pageNo);
        setPageNo(pageNoParam);
      } else {
        urlParams.delete("pageNo");
      }
      const cityIdParam = urlParams.get("cityId");
      if (cityIdParam) {
        const cityId = parseInt(cityIdParam);
        const city = response[0].data.data.find(
          (c) => c.id === parseInt(cityIdParam)
        );
        if (city) {
          setCityName(city.name);
          setCityId(parseInt(cityIdParam));
          params.cityId = cityId;
        } else urlParams.delete("cityId");
      }
      const categoryIdParam = urlParams.get("categoryId");
      if (categoryIdParam) {
        const categoryId = parseInt(categoryIdParam);
        if (categoryById[categoryId]) {
          setCategoryId(categoryId);
          setCategoryName(t(categoryById[categoryId]));
          params.categoryId = categoryId;
          if (categoryId === 3) {
            params.sortByStartDate = true;
          }
        } else urlParams.delete("categoryId");
      }
      setTimeout(() => {
        fetchData(params);
      }, 1000);
    });
  }, []);

  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      const urlParams = new URLSearchParams(window.location.search);
      const params = { pageSize, statusId: 1 };
      if (parseInt(cityId)) {
        setCityName(cities.find((c) => parseInt(cityId) === c.id)?.name);
        urlParams.set("cityId", cityId);
        params.cityId = cityId;
      } else {
        setCityName(
          t("allCities", {
            regionName: process.env.REACT_APP_REGION_NAME,
          })
        );
        urlParams.delete("cityId");
      }
      if (parseInt(categoryId)) {
        setCategoryName(t(categoryById[categoryId]));
        params.categoryId = parseInt(categoryId);
        urlParams.set("categoryId", parseInt(categoryId));
      } else {
        setCategoryName(t("allCategories"));
        urlParams.delete("categoryId");
      }
      if (pageNo > 1) {
        params.pageNo = pageNo;
        urlParams.set("pageNo", pageNo);
      } else {
        params.pageNo = 1;
        urlParams.delete("pageNo");
      }
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, "", newUrl);
      if (parseInt(categoryId) === 3) {
        params.sortByStartDate = true;
      }
      setTimeout(() => {
        fetchData(params);
      }, 1000);
    }
  }, [categoryId, cityId, pageNo]);

  const handleCityChange = (newCityId) => {
    setIsLoading(true);
    setCityId(newCityId);
    clearSearchResults();
    setIsLoading(false);
    setPageNo(1);
  };

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

  const handleSortOptionChange = (event) => {
    setSelectedSortOption(event.target.value);
    clearSearchResults();
  };

  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleOfficialNotificationButton = () => {
    setCategoryId(16)
    navigateTo("/AllListings?terminalView=true&categoryId=16")
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
  }, [selectedSortOption, listings]);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const terminalViewParam = searchParams.get("terminalView");
  const mtClass = terminalViewParam === "true" ? "mt-0" : "mt-20";
  const pyClass = terminalViewParam === "true" ? "py-0" : "py-1";
  const [showNavBar, setShowNavBar] = useState(true);
  useEffect(() => {
    if (terminalViewParam === "true") {
      setShowNavBar(false);
    } else {
      setShowNavBar(true);
    }
  }, [terminalViewParam]);

  const handleCategoryChange = (newCategoryId) => {
    setCategoryId(newCategoryId);
    clearSearchResults();
  };

  const handleSearch = async (searchQuery) => {
    console.log("Search term:", searchQuery);
    setSearchQuery(searchQuery); // Save the search query

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
      console.log("API Response:", response.data.data);
      setListings(response.data.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const clearSearchResults = () => {
    setListings([]); // Clear the listings to remove the search results
    setSearchQuery(""); // Clear the search query
  };

  return (
    <section className="text-gray-600 body-font relative">
      {showNavBar && <HomePageNavBar />}
      <div
        className={`container-fluid py-0 mr-0 ml-0 w-full flex flex-col ${mtClass}`}
      >
        <div className="w-full mr-0 ml-0">
          <div className={`lg:h-64 md:h-64 h-96 overflow-hidden ${pyClass}`}>
            <div className="relative lg:h-64 md:h-64 h-96">
              <img
                alt="ecommerce"
                className="object-cover object-center h-full w-full"
                src={process.env.REACT_APP_BUCKET_HOST + "admin/Homepage.jpg"}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
                <h1
                  className="text-4xl mt-4 md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans galaxy-fold"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <style>
                    {`
													@media (max-width: 280px) {
														.galaxy-fold {
															font-size: 30px;
														}
													}
												`}
                  </style>
                  {selectedCity} : {selectedCategory}
                </h1>

                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 lg:gap-4 md:gap-4 gap-2 relative justify-center place-items-center lg:px-10 md:px-5 sm:px-0 px-2 py-0 mt-0 mb-0">
                  <div className="col-span-6 sm:col-span-1 mt-1 mb-1 px-0 mr-0 w-full">
                    <select
                      id="city"
                      name="city"
                      autoComplete="city-name"
                      onChange={(e) => {
                        handleCityChange(e.target.value);
                      }}
                      value={cityId}
                      className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full text-gray-600"
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
                  <div className="col-span-6 sm:col-span-1 mt-1 mb-1 px-0 mr-0 w-full">
                    <select
                      id="category"
                      name="category"
                      autoComplete="category-name"
                      onChange={(e) => {
                        handleCategoryChange(e.target.value);
                      }}
                      value={categoryId || 0}
                      className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full text-gray-600"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      <option className="font-sans" value={0} key={0}>
                        {t("allCategories")}
                      </option>
                      {categories.map((category) => {
                        return (
                          <option className="font-sans" value={category.id} key={category.id}>
                            {t(category.name)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div className="col-span-6 sm:col-span-1 mt-1 mb-1 px-0 mr-0 w-full">
                    <select
                      id="country"
                      name="country"
                      value={selectedSortOption}
                      onChange={handleSortOptionChange}
                      autoComplete="country-name"
                      className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full text-gray-600"
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
                  </div>

                  <SearchBar onSearch={handleSearch} searchBarClassName="w-full" searchQuery={searchQuery} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 mb-20 customproview py-6">
        {terminalViewParam && (<div className="text-center mt-4 mb-4">
          <a
            onClick={handleOfficialNotificationButton}
            className={`flex items-center ${RegionColors.darkTextColor} border ${RegionColors.darkBorderColor} py-2 px-6 gap-2 rounded inline-flex items-center cursor-pointer`}
            style={{ fontFamily: "Poppins, sans-serif" }}>
            <span>
              {t("officialnotification")}
            </span>
            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              viewBox="0 0 24 24" className="w-6 h-6 ml-2">
              <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </a>
        </div>
        )}
        <style>
          {`
							@media (min-height: 1293px) {
							.customproview {
								margin-bottom: 10rem;
							}
							}
						`}
        </style>
        {isLoading ? (
          <LoadingPage />
        ) : (
          <div>
            {listings && listings.length > 0 ? (
              <div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
                <div className="relative place-items-center bg-white mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-10 justify-start">
                  {listings &&
                    listings.map((listing, index) => (
                      <ListingsCard
                        listing={listing}
                        terminalView={terminalViewParam}
                        key={index}
                      />
                    ))}
                </div>
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
                <div
                  className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <span className="font-sans text-black">
                    {t("to_upload_new_listing")}
                  </span>
                  <a
                    className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-blue-400"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                    onClick={() => {
                      localStorage.setItem(
                        "selectedItem",
                        "Choose one category"
                      );
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
        )}
        <div className="mt-20 mb-20 w-fit mx-auto text-center text-white whitespace-nowrap rounded-md border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer">
          {pageNo !== 1 ? (
            <span
              className="text-lg px-3 hover:bg-blue-400 cursor-pointer rounded-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
              onClick={() => setPageNo(pageNo - 1)}
            >
              {"<"}{" "}
            </span>
          ) : (
            <span />
          )}
          <span
            className="text-lg px-3"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {t("page")} {pageNo}
          </span>
          {listings.length >= pageSize && (
            <span
              className="text-lg px-3 hover:bg-blue-400 cursor-pointer rounded-lg"
              style={{ fontFamily: "Poppins, sans-serif" }}
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

export default AllListings;