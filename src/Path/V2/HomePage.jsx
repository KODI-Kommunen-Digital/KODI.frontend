import React, { useCallback, useEffect, useState, useMemo } from "react";
import HomePageNavBar from "../../Components/V2/HomePageNavBar";
import RegionColors from "../../Components/RegionColors";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getListings,
  getListingsCount,
  getListingsBySearch,
} from "../../Services/listingsApi";
import { getCities } from "../../Services/citiesApi";
import Footer from "../../Components/Footer";
import PrivacyPolicyPopup from "../PrivacyPolicyPopup";
import ListingsCard from "../../Components/ListingsCard";
import SearchBar from "../../Components/SearchBar";
import {
  getCategory,
  getListingsSubCategory,
} from "../../Services/CategoryApi";
import LoadingPage from "../../Components/LoadingPage";
import {
  eventTabOptions,
  sortByTitleAZ,
  sortByTitleZA,
  sortLatestFirst,
  sortOldestFirst,
} from "../../Services/helper";
import { hiddenCategories } from "../../Constants/hiddenCategories";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { format } from "date-fns";

import CITYIMAGE from "../../assets/City.png";
import CITYDEFAULTIMAGE from "../../assets/CityDefault.png";
import ONEIMAGE from "../../assets/01.png";
import TWOIMAGE from "../../assets/02.png";
import THREEIMAGE from "../../assets/03.png";
import MostPopularCategories from "../../Components/V2/MostPopularCategories";
import { German } from "flatpickr/dist/l10n/de";
import { English } from "flatpickr/dist/l10n/default";

// Constants
const EVENTS_CATEGORY_ID = 3;
const DEFAULT_PAGE_SIZE = 12;
const DEFAULT_STATUS_ID = 1;
const DEFAULT_PAGE_NO = 1;
const FETCH_DELAY = 1000;
const POPPINS_FONT = "Poppins, sans-serif";

// Helper functions
const isEventsCategory = (categoryId) => {
  return (
    categoryId === EVENTS_CATEGORY_ID ||
    categoryId === String(EVENTS_CATEGORY_ID)
  );
};

const parseUrlParam = (urlParams, key, parser = parseInt) => {
  const value = urlParams.get(key);
  return value ? parser(value) : null;
};

const updateUrlParams = (params) => {
  const urlParams = new URLSearchParams(window.location.search);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      urlParams.set(key, value);
    } else {
      urlParams.delete(key);
    }
  });
  const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
  window.history.replaceState({}, "", newUrl);
};

// DatePicker Component
// eslint-disable-next-line react/prop-types
const DatePicker = ({ value, onChange, placeholder, t, minDate, maxDate }) => {
  const handleDateChange = useCallback(
    (date) => {
      if (date[0]) {
        const formattedDate = format(date[0], "yyyy-MM-dd");
        onChange(formattedDate);
      }
    },
    [onChange],
  );

  const handleClear = useCallback(() => {
    onChange("");
  }, [onChange]);

  const flatpickrOptions = useMemo(
    () => ({
      dateFormat: "Y-m-d",
      allowInput: true,
      minDate: minDate || null,
      maxDate: maxDate || null,
      locale: process.env.REACT_APP_LANG === "de" ? German : English,
    }),
    [minDate, maxDate],
  );

  return (
    <div className="col-span-6 sm:col-span-1 mt-0 mb-0 px-0 mr-0 w-full relative">
      <Flatpickr
        value={value}
        options={flatpickrOptions}
        onChange={handleDateChange}
        className="bg-white h-10 border-2 border-gray-500 px-4 pr-10 rounded-xl text-sm focus:outline-none w-full text-gray-600"
        placeholder={placeholder}
        style={{ fontFamily: POPPINS_FONT }}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          style={{ zIndex: 10 }}
          type="button"
          aria-label="Clear date"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

const HomePage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

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
  const [searchQuery, setSearchQuery] = useState("");
  const [terminalView, setTerminalView] = useState(false);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [eventTab, setEventTab] = useState("singleDay");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Memoized values
  const isEvents = useMemo(() => isEventsCategory(categoryId), [categoryId]);
  const sortedListings = useMemo(() => {
    if (!selectedSortOption || !listings.length) return listings;

    const listingsCopy = [...listings];
    switch (selectedSortOption) {
      case "titleAZ":
        return sortByTitleAZ(listingsCopy);
      case "titleZA":
        return sortByTitleZA(listingsCopy);
      case "recent":
        return sortLatestFirst(listingsCopy);
      case "oldest":
        return sortOldestFirst(listingsCopy);
      default:
        return listingsCopy;
    }
  }, [listings, selectedSortOption]);

  // Initialize terminalView
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    setTerminalView(queryParams.get("terminalView") === "true");
  }, []);

  // Sync state with URL parameters when location changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const urlCityId = parseUrlParam(urlParams, "cityId");
    if (urlCityId && urlCityId !== cityId) {
      setCityId(urlCityId);
    } else if (!urlCityId && cityId !== undefined) {
      setCityId(undefined);
    }

    const urlCategoryId = parseUrlParam(urlParams, "categoryId");
    if (urlCategoryId && urlCategoryId !== categoryId) {
      setCategoryId(urlCategoryId);
    } else if (!urlCategoryId && categoryId !== undefined) {
      setCategoryId(undefined);
    }

    const urlStartDate =
      urlParams.get("startAfterDate") || urlParams.get("startDate") || "";
    if (urlStartDate !== startDate) {
      setStartDate(urlStartDate);
    }

    const urlEndDate =
      urlParams.get("endBeforeDate") || urlParams.get("endDate") || "";
    if (urlEndDate !== endDate) {
      setEndDate(urlEndDate);
    }

    const urlEventTab = urlParams.get("eventTab");
    const currentCategoryId = parseUrlParam(urlParams, "categoryId");
    if (isEventsCategory(currentCategoryId)) {
      if (urlEventTab && urlEventTab !== eventTab) {
        setEventTab(urlEventTab);
      } else if (!urlEventTab && eventTab !== "singleDay") {
        setEventTab("singleDay");
      }
    }

    const urlSubCategoryId = parseUrlParam(urlParams, "subcategoryId");
    if (urlSubCategoryId && urlSubCategoryId !== selectedSubCategoryId) {
      setSelectedSubCategoryId(urlSubCategoryId);
    } else if (
      !urlSubCategoryId &&
      selectedSubCategoryId !== null &&
      selectedSubCategoryId !== undefined
    ) {
      setSelectedSubCategoryId(null);
    }

    const urlSort = urlParams.get("sort") || "";
    if (urlSort && urlSort !== selectedSortOption) {
      setSelectedSortOption(urlSort);
    } else if (!urlSort && selectedSortOption) {
      setSelectedSortOption("");
    }

    const urlSearch = urlParams.get("search") || "";
    if (urlSearch !== searchQuery) {
      setSearchQuery(urlSearch);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  // Initial data load
  useEffect(() => {
    if (!terminalView) {
      const hasAcceptedPrivacyPolicy = localStorage.getItem(
        "privacyPolicyAccepted",
      );
      if (!hasAcceptedPrivacyPolicy) {
        setShowPopup(true);
      }
    }

    const urlParams = new URLSearchParams(window.location.search);

    // Load cities
    getCities()
      .then((citiesResponse) => {
        const sortedCities = [...citiesResponse.data.data].sort((a, b) =>
          a.name.localeCompare(b.name),
        );
        setCities(sortedCities);
      })
      .catch((error) => {
        console.error("Error fetching cities:", error);
      });

    // Initialize from URL params
    const initialCityId = parseUrlParam(urlParams, "cityId");
    if (initialCityId) setCityId(initialCityId);

    const initialCategoryId = parseUrlParam(urlParams, "categoryId");
    if (initialCategoryId) setCategoryId(initialCategoryId);

    const startDateParam =
      urlParams.get("startAfterDate") || urlParams.get("startDate");
    if (startDateParam) setStartDate(startDateParam);

    const endDateParam =
      urlParams.get("endBeforeDate") || urlParams.get("endDate");
    if (endDateParam) setEndDate(endDateParam);

    const eventTabParam = urlParams.get("eventTab");
    if (eventTabParam) setEventTab(eventTabParam);

    const subCategoryIdParam = urlParams.get("subcategoryId");
    if (subCategoryIdParam) {
      setSelectedSubCategoryId(parseInt(subCategoryIdParam));
    }

    const sortParam = urlParams.get("sort");
    if (sortParam) {
      setSelectedSortOption(sortParam);
    }

    const searchParam = urlParams.get("search") || "";
    if (searchParam) {
      setSearchQuery(searchParam);
    }

    // Load listings count
    getListingsCount()
      .then((response) => {
        const data = response?.data?.data || [];
        const sortedData = data.sort(
          (a, b) => parseInt(b.totalCount) - parseInt(a.totalCount),
        );
        setListingsCount(sortedData);
      })
      .catch((error) => {
        console.error("Error fetching listings count:", error);
      });

    // Load categories
    getCategory()
      .then((response) => {
        const catList = {};
        response?.data?.data
          .filter((cat) => !hiddenCategories.includes(cat.id))
          .forEach((cat) => {
            catList[cat.id] = cat.name;
          });
        setCategories(catList);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    document.title = `${process.env.REACT_APP_REGION_NAME} ${t("home")}`;
  }, [t, terminalView]);

  // Check login status and fetch listings
  useEffect(() => {
    if (!terminalView) {
      const accessToken =
        window.localStorage.getItem("accessToken") ||
        window.sessionStorage.getItem("accessToken");
      const refreshToken =
        window.localStorage.getItem("refreshToken") ||
        window.sessionStorage.getItem("refreshToken");
      setIsLoggedIn(!!(accessToken || refreshToken));
    }

    setIsLoading(true);
    const params = {
      pageSize: DEFAULT_PAGE_SIZE,
      statusId: DEFAULT_STATUS_ID,
      pageNo: DEFAULT_PAGE_NO,
    };

    const urlParams = {};
    if (parseInt(cityId)) {
      urlParams.cityId = cityId;
      params.cityId = cityId;
    }
    if (parseInt(categoryId)) {
      urlParams.categoryId = categoryId;
      params.categoryId = categoryId;
    }
    if (parseInt(categoryId) === EVENTS_CATEGORY_ID) {
      params.sortByStartDate = true;
    }
    // Always set date params (null if empty) so they can be removed from URL
    urlParams.startAfterDate = startDate || null;
    urlParams.endBeforeDate = endDate || null;
    if (isEvents) {
      if (eventTab) {
        urlParams.eventTab = eventTab;
      }
    }
    if (selectedSubCategoryId) {
      urlParams.subcategoryId = selectedSubCategoryId;
    }
    if (selectedSortOption) {
      urlParams.sort = selectedSortOption;
    } else {
      urlParams.sort = null;
    }

    if (searchQuery) {
      urlParams.search = searchQuery;
    } else {
      urlParams.search = null;
    }

    updateUrlParams(urlParams);

    const timeoutId = setTimeout(async () => {
      if (searchQuery) {
        setListings([]);
        const searchParams = {
          searchQuery,
          pageSize: DEFAULT_PAGE_SIZE,
          pageNo: DEFAULT_PAGE_NO,
          statusId: DEFAULT_STATUS_ID,
          showExternalListings: "false",
        };
        if (parseInt(cityId)) searchParams.cityId = cityId;
        if (parseInt(categoryId)) {
          searchParams.categoryId = categoryId;
          if (parseInt(categoryId) === EVENTS_CATEGORY_ID) {
            searchParams.sortByStartDate = true;
            if (eventTab === "singleDay") searchParams.eventType = "singleDay";
            else if (eventTab === "multiDay")
              searchParams.eventType = "multiDay";
            else if (eventTab === "recurring")
              searchParams.eventType = "recurring";
            if (startDate) searchParams.startAfterDate = startDate;
            if (endDate) searchParams.endBeforeDate = endDate;
          }
        }
        if (selectedSubCategoryId)
          searchParams.subcategoryId = selectedSubCategoryId;
        try {
          const response = await getListingsBySearch(searchParams);
          const data = response?.data?.data || [];
          const filtered = data.filter(
            (listing) => !hiddenCategories.includes(listing.categoryId),
          );
          setListings(filtered);
        } catch (err) {
          console.error("Error fetching search results:", err);
          setListings([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        await fetchData(params);
      }
    }, FETCH_DELAY);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    cityId,
    categoryId,
    startDate,
    endDate,
    eventTab,
    selectedSubCategoryId,
    selectedSortOption,
    searchQuery,
    terminalView,
    isEvents,
  ]);

  // Load subcategories when category changes
  useEffect(() => {
    const loadSubCategories = async () => {
      if (categoryId) {
        try {
          const response = await getListingsSubCategory(categoryId);
          setSubCategories(response?.data?.data || []);
        } catch (error) {
          console.error("Error fetching subcategories:", error);
          setSubCategories([]);
        }
      } else {
        setSubCategories([]);
      }
    };

    loadSubCategories();
  }, [categoryId]);

  // Scroll position management
  useEffect(() => {
    if (!terminalView) {
      const savedPosition = sessionStorage.getItem("scrollPosition");
      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition));
      }

      const handleBeforeUnload = () => {
        sessionStorage.setItem("scrollPosition", window.scrollY);
      };

      window.addEventListener("beforeunload", handleBeforeUnload);
      return () => {
        window.removeEventListener("beforeunload", handleBeforeUnload);
      };
    }
  }, [terminalView]);

  const fetchData = useCallback(
    async (params) => {
      setSearchQuery("");
      params.showExternalListings = "false";

      if (selectedSubCategoryId) {
        params.subcategoryId = selectedSubCategoryId;
      }

      if (isEvents) {
        if (eventTab === "singleDay") {
          params.eventType = "singleDay";
        } else if (eventTab === "multiDay") {
          params.eventType = "multiDay";
        } else if (eventTab === "recurring") {
          params.eventType = "recurring";
        }
        if (startDate) {
          params.startAfterDate = startDate;
        }
        if (endDate) {
          params.endBeforeDate = endDate;
        }
      }

      try {
        const response = await getListings(params);
        const listings = response?.data?.data || [];
        const filteredListings = listings.filter(
          (listing) => !hiddenCategories.includes(listing.categoryId),
        );
        setListings(filteredListings);
      } catch (error) {
        setListings([]);
        console.error("Error fetching listings:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [selectedSubCategoryId, isEvents, eventTab, startDate, endDate],
  );

  const getTheListings = useCallback(async (newCategoryId, event) => {
    event.preventDefault();

    setCategoryId(newCategoryId);
    setSelectedSubCategoryId(null);
    setStartDate("");
    setEndDate("");
    setSelectedSortOption("");

    if (!isEventsCategory(newCategoryId)) {
      setEventTab("singleDay");
    }

    try {
      const response = await getListingsSubCategory(newCategoryId);
      setSubCategories(response?.data?.data || []);
      setIsCategoryMenuOpen(true);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
    }

    setListings([]);
  }, []);

  const handleSubCategorySelect = useCallback((subCategoryId) => {
    setListings([]);
    setSelectedSubCategoryId(subCategoryId);
  }, []);

  const handleSortOptionChange = useCallback(
    (event) => {
      const newValue = event.target.value;
      if (newValue !== selectedSortOption) {
        setSelectedSortOption(newValue);
      }
    },
    [selectedSortOption],
  );

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const goToCitizensPage = useCallback(() => {
    const navUrl = cityId
      ? `/CitizenService?cityId=${cityId}`
      : `/CitizenService`;
    navigate(navUrl);
  }, [cityId, navigate]);

  const handlePrivacyPolicyAccept = useCallback(() => {
    if (!terminalView) {
      localStorage.setItem("privacyPolicyAccepted", "true");
    }
    setShowPopup(false);
  }, [terminalView]);

  const handleEventTabChange = useCallback(
    (id) => {
      setEventTab(id);
      setStartDate("");
      setEndDate("");
      setSelectedSortOption("");
      setSearchQuery("");

      const urlParams = {};
      urlParams.startAfterDate = null;
      urlParams.endBeforeDate = null;
      urlParams.search = null;
      if (isEvents) {
        urlParams.eventTab = id;
      } else {
        urlParams.eventTab = null;
      }
      updateUrlParams(urlParams);
    },
    [isEvents],
  );

  const navigateTo = useCallback(
    (path) => {
      if (path) {
        navigate(path);
      }
    },
    [navigate],
  );

  const handleViewMore = useCallback(() => {
    if (!terminalView) {
      localStorage.setItem("selectedItem", t("chooseOneCategory"));
    }
    const urlParams = new URLSearchParams(window.location.search);
    const allListingsParams = new URLSearchParams();
    urlParams.forEach((value, key) => {
      allListingsParams.set(key, value);
    });
    if (terminalView) {
      allListingsParams.set("terminalView", "true");
    }
    const queryString = allListingsParams.toString();
    const url = queryString ? `/AllListings?${queryString}` : "/AllListings";
    navigateTo(url);
  }, [terminalView, t, navigateTo]);

  const handleCityClick = useCallback(
    (city) => {
      const scrollPosition = window.scrollY;
      localStorage.setItem("selectedCity", city.name);
      navigateTo(`/AllListings?cityId=${city.id}`);
      window.addEventListener("popstate", function () {
        window.scrollTo(0, scrollPosition);
      });
    },
    [navigateTo],
  );

  const handleUploadClick = useCallback(() => {
    localStorage.setItem("selectedItem", "Choose one category");
    navigateTo(isLoggedIn ? "/UploadListings" : "/login");
  }, [isLoggedIn, navigateTo]);

  const handleAppStoreClick = useCallback(() => {
    window.location.href = process.env.REACT_APP_APPLESTORE;
  }, []);

  const handlePlayStoreClick = useCallback(() => {
    window.location.href = process.env.REACT_APP_GOOGLEPLAYSTORE;
  }, []);

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
              <div className="absolute inset-0 flex flex-col gap-4 items-start justify-center bg-gray-800 bg-opacity-75 text-white z--1">
                <div className="flex flex-col items-start max-w-[90%] lg:px-20 md:px-5 px-5 py-6">
                  <h1
                    className="font-sans mb-8 lg:mb-12 text-4xl md:text-6xl lg:text-7xl font-bold tracking-wide"
                    style={{ fontFamily: POPPINS_FONT }}
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
            isMenuOpen={isCategoryMenuOpen}
            setIsMenuOpen={setIsCategoryMenuOpen}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingPage />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-12 lg:gap-2 md:gap-2 gap-2 relative mt-10">
            <div
              className={`text-slate-800 lg:px-10 md:px-5 px-5 py-3 text-xl md:text-3xl lg:text-3xl title-font text-start font-sans font-bold lg:pl-[5rem] ${
                isEvents ? "md:col-span-3" : "md:col-span-6"
              }`}
              style={{ fontFamily: POPPINS_FONT }}
            >
              <h2>
                {categoryId ? t(categories[categoryId]) : t("allCategories")}
              </h2>
            </div>

            <div
              className={`flex flex-col md:flex-row lg:gap-2 md:gap-2 gap-2 relative justify-center place-items-center lg:px-10 md:px-5 px-5 py-3 ${
                isEvents ? "md:col-span-9" : "md:col-span-6"
              }`}
            >
              {isEvents && (
                <>
                  <DatePicker
                    value={startDate}
                    onChange={setStartDate}
                    placeholder={t("startDate") || "Start Date"}
                    t={t}
                    maxDate={endDate || null}
                  />
                  <DatePicker
                    value={endDate}
                    onChange={setEndDate}
                    placeholder={t("endDate") || "End Date"}
                    t={t}
                    minDate={startDate || null}
                  />
                </>
              )}

              <div className="col-span-6 sm:col-span-1 mt-0 mb-0 px-0 mr-0 w-full">
                <select
                  value={selectedSortOption}
                  onChange={handleSortOptionChange}
                  className="bg-white h-10 border-2 border-gray-500 px-5 pr-10 rounded-xl text-sm focus:outline-none w-full text-gray-600 cursor-pointer"
                  style={{ fontFamily: POPPINS_FONT }}
                >
                  <option value="">{t("sort")}</option>
                  <option value="titleAZ">{t("atoztitle")}</option>
                  <option value="titleZA">{t("ztoatitle")}</option>
                  <option value="recent">{t("recent")}</option>
                  <option value="oldest">{t("oldest")}</option>
                </select>
              </div>

              {(categoryId === 1 || categoryId === "1") &&
                subCategories.length > 0 && (
                  <div className="col-span-6 sm:col-span-1 mt-0 mb-0 px-0 mr-0 w-full">
                    <select
                      value={selectedSubCategoryId || ""}
                      onChange={(e) => handleSubCategorySelect(e.target.value)}
                      className="bg-white h-10 border-2 border-gray-500 px-5 pr-10 rounded-xl text-sm focus:outline-none w-full text-gray-600 cursor-pointer"
                      style={{ fontFamily: POPPINS_FONT }}
                    >
                      <option value="">{t("allSubcategories")}</option>
                      {subCategories.map((subCat) => (
                        <option key={subCat.id} value={subCat.id}>
                          {t(subCat.name)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

              <SearchBar
                onSearch={handleSearch}
                searchBarClassName="w-full"
                searchQuery={searchQuery}
              />
            </div>
          </div>

          {isEvents && (
            <div className="bg-white lg:px-20 md:px-5 px-3 py-4 md:py-6 mt-0">
              <div className="flex justify-center">
                <div className="flex w-full md:w-fit overflow-hidden rounded-xl border border-gray-300 bg-gray-100 shadow-sm">
                  {eventTabOptions?.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleEventTabChange(tab.id)}
                      className={`flex-1 md:flex-none px-6 py-2.5 text-sm sm:text-base font-semibold transition-all ${
                        eventTab === tab.id
                          ? "bg-gray-600 text-white"
                          : "bg-transparent text-gray-600 hover:bg-gray-200"
                      }`}
                      style={{ fontFamily: POPPINS_FONT }}
                      type="button"
                    >
                      {t(tab?.id)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {sortedListings && sortedListings.length > 0 ? (
            <div className="bg-white lg:px-20 md:px-5 px-5 py-6 mt-0 mb-10 space-y-10 flex flex-col">
              <div className="relative place-items-center bg-white mb-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-10 justify-start">
                {sortedListings.map((listing, index) => (
                  <ListingsCard
                    listing={listing}
                    terminalView={terminalView}
                    key={listing.id || index}
                  />
                ))}
              </div>

              <a
                className="relative w-full sm:w-80 cursor-pointer items-center justify-center inline-block px-4 py-2 font-medium group"
                type="submit"
                onClick={handleViewMore}
                style={{ fontFamily: POPPINS_FONT }}
              >
                <span
                  className={`absolute inset-0 w-full sm:w-80 h-full transition duration-200 ease-out transform translate-x-1 translate-y-1 ${
                    terminalView ? "bg-green-600" : "bg-gray-900"
                  } group-hover:-translate-x-0 group-hover:-translate-y-0`}
                ></span>
                <span
                  className={`absolute inset-0 w-full sm:w-80 h-full bg-white border-2 ${
                    terminalView
                      ? "border-green-600 group-hover:bg-green-600"
                      : "border-gray-900 group-hover:bg-gray-900"
                  }`}
                ></span>
                <span
                  className={`relative ${
                    terminalView
                      ? "text-green-600 group-hover:text-white"
                      : "text-gray-900 group-hover:text-white"
                  }`}
                >
                  {t("viewMore")}
                </span>
              </a>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-center">
                <h1
                  className="m-auto mt-20 text-center font-sans font-bold text-2xl text-black"
                  style={{ fontFamily: POPPINS_FONT }}
                >
                  {t("currently_no_listings")}
                </h1>
              </div>
              <div className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
                <span
                  className="font-sans text-black"
                  style={{ fontFamily: POPPINS_FONT }}
                >
                  {t("to_upload_new_listing")}
                </span>
                <a
                  className={`m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer ${RegionColors.lightTextColor}`}
                  style={{ fontFamily: POPPINS_FONT }}
                  onClick={handleUploadClick}
                >
                  {t("click_here")}
                </a>
              </div>
            </div>
          )}

          {!terminalView && (
            <>
              <h2
                className="text-slate-800 lg:px-20 md:px-5 px-5 py-6 text-xl md:text-3xl mt-10 lg:text-3xl title-font text-start font-sans font-bold"
                style={{ fontFamily: POPPINS_FONT }}
              >
                {t("discoverMorePlaces")}
              </h2>

              <div className="bg-white lg:px-20 md:px-5 px-5 py-6 mt-0 mb-10 space-y-10 flex flex-col">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 relative mb-4 justify-center place-items-center">
                  {cities
                    .filter((city) => city.id !== Number(cityId))
                    .map((city) => (
                      <div
                        key={city.id}
                        onClick={() => handleCityClick(city)}
                        className="h-80 w-full rounded-xl cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
                      >
                        <div className="relative h-80 rounded overflow-hidden">
                          <img
                            alt={city.name}
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
                          <div
                            className="absolute inset-0 flex flex-col justify-end text-white z--1"
                            style={{
                              background:
                                "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)",
                            }}
                          >
                            <h1
                              className="text-xl pb-5 md:text-3xl font-sans font-bold mb-0 ml-4"
                              style={{ fontFamily: POPPINS_FONT }}
                            >
                              {city.name}
                            </h1>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className="bg-white lg:px-20 md:px-5 px-5 py-6 space-y-10 flex flex-col">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 relative mb-4 justify-center gap-4 place-items-center">
                  {[
                    {
                      image: ONEIMAGE,
                      title: t("createAnAccount"),
                      description: t("createAnAccountDescription"),
                    },
                    {
                      image: TWOIMAGE,
                      title: t("getVerified"),
                      description: t("getVerifiedDescription"),
                    },
                    {
                      image: THREEIMAGE,
                      title: t("start"),
                      description: t("startDescription"),
                    },
                  ].map((step, index) => (
                    <div
                      key={index}
                      className="pb-10 w-full mb-4 bg-slate-100 rounded-xl cursor-pointer"
                    >
                      <div className="relative h-96 rounded overflow-hidden w-auto">
                        <img
                          alt={step.title}
                          className="object-cover object-center h-48 w-48 m-auto"
                          src={step.image}
                        />
                        <div className="p-6">
                          <h2
                            className="text-slate-800 mb-2 text-2xl md:text-2xl lg:text-3xl mt-2 title-font text-start font-bold font-sans"
                            style={{ fontFamily: POPPINS_FONT }}
                          >
                            {step.title}
                          </h2>
                          <p
                            className="text-slate-800 title-font text-lg font-bold text-start font-sans"
                            style={{ fontFamily: POPPINS_FONT }}
                          >
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div
                className={`mx-auto lg:px-20 md:px-5 px-5 py-6 flex justify-center lg:h-[28rem] sm:h-[35rem] ${RegionColors.lightBgColor}`}
              >
                <div className="flex flex-wrap items-center">
                  <div className="w-full md:w-1/2 px-4">
                    <h2
                      className="text-4xl text-white font-bold mb-4 font-sans"
                      style={{ fontFamily: POPPINS_FONT }}
                    >
                      {t("citizenService")}
                    </h2>
                    <p
                      className="mb-4 text-slate-800 text-lg font-bold font-sans"
                      style={{ fontFamily: POPPINS_FONT }}
                    >
                      {t("findBestCitizenServicesInTheCity")}
                    </p>

                    <a
                      onClick={goToCitizensPage}
                      className={`flex items-center ${RegionColors.darkTextColor} border ${RegionColors.darkBorderColor} py-2 px-6 gap-2 rounded inline-flex items-center cursor-pointer`}
                      style={{ fontFamily: POPPINS_FONT }}
                    >
                      <span>{t("clickHereToFind")}</span>
                      <svg
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        className="w-6 h-6 ml-2"
                      >
                        <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </a>
                  </div>

                  <div className="w-full md:w-1/2 flex flex-wrap lg:mt-0 md:mt-6 mt-6">
                    <img
                      src={
                        process.env.REACT_APP_BUCKET_HOST +
                        "admin/CitizenService2.png"
                      }
                      alt="Citizen Service"
                      className="w-full md:w-98 mb-2"
                    />
                  </div>
                </div>
              </div>

              <div
                className={`${RegionColors.darkBgColor} lg:px-20 md:px-5 px-5 py-6 flex justify-start`}
              >
                <style>
                  {`
                    @media (max-width: 280px) {
                      .galaxy-fold {
                        flex-direction: column;
                      }
                    }
                  `}
                </style>
                <div className="flex flex-col md:flex-row place-items-center justify-start">
                  <p
                    className="flex mt-4 px-4 py-2 text-white items-center cursor-pointer text-lg font-bold font-sans"
                    style={{ fontFamily: POPPINS_FONT }}
                  >
                    {t("downloadUs")}
                  </p>
                  <div className="flex mt-4 px-4 py-2 md:gap-4 gap-4 items-center cursor-pointer galaxy-fold">
                    <div
                      className="flex mt-0 w-36 h-10 bg-white text-black rounded-lg items-center justify-center transition duration-300 transform hover:scale-105"
                      onClick={handleAppStoreClick}
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
                      onClick={handlePlayStoreClick}
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
        </>
      )}

      {!isLoading && !terminalView && (
        <div className="bottom-0 w-full">
          <Footer />
        </div>
      )}
    </section>
  );
};

export default HomePage;
