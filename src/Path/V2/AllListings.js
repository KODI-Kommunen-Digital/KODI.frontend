import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import HomePageNavBar from "../../Components/V2/HomePageNavBar";
import SearchBar from "../../Components/SearchBar";
import ListingsCard from "../../Components/ListingsCard";
import { useNavigate, useLocation } from "react-router-dom";
import {
  eventTabOptions,
  sortByTitleAZ,
  sortByTitleZA,
  sortLatestFirst,
  sortOldestFirst,
} from "../../Services/helper";
import { useTranslation } from "react-i18next";
import { getListings, getListingsBySearch } from "../../Services/listingsApi";
import { getCities } from "../../Services/citiesApi";
import { categoryById } from "../../Constants/categories";
import { hiddenCategories } from "../../Constants/hiddenCategories";
import Footer from "../../Components/Footer";
import LoadingPage from "../../Components/LoadingPage";
import { getCategory } from "../../Services/CategoryApi";
import RegionColors from "../../Components/RegionColors";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { format } from "date-fns";
import PropTypes from "prop-types";
// Constants
const EVENTS_CATEGORY_ID = 3;
const OFFICIAL_NOTIFICATION_CATEGORY_ID = 16;
const DEFAULT_STATUS_ID = 1;
const FETCH_DELAY = 1000;
const POPPINS_FONT = "Poppins, sans-serif";
const MOBILE_BREAKPOINT = 768;
const MOBILE_PAGE_SIZE = 8;
const DESKTOP_PAGE_SIZE = 12;

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

const getEventType = (eventTab) => {
  if (eventTab === "singleDay") return "singleDay";
  if (eventTab === "multiDay") return "multiDay";
  if (eventTab === "recurring") return "recurring";
  return null;
};

// DatePicker Component
const DatePicker = ({
  value,
  onChange,
  placeholder,
  t,
  className = "",
  setPageNo = 1,
}) => {
  const handleDateChange = useCallback(
    (date) => {
      setPageNo(1);
      if (date[0]) {
        const formattedDate = format(date[0], "yyyy-MM-dd");
        onChange(formattedDate);
      }
    },
    [onChange, setPageNo],
  );

  const handleClear = useCallback(
    (e) => {
      e.stopPropagation();
      setPageNo(1);
      onChange("");
    },
    [onChange, setPageNo],
  );

  const flatpickrOptions = useMemo(
    () => ({
      dateFormat: "Y-m-d",
      allowInput: true,
    }),
    [],
  );

  return (
    <div className={`relative ${className}`}>
      <Flatpickr
        value={value}
        options={flatpickrOptions}
        onChange={handleDateChange}
        className="bg-white h-10 border-2 border-gray-500 px-4 pr-10 rounded-xl text-sm focus:outline-none w-48 text-gray-600 relative"
        placeholder={placeholder}
        style={{ fontFamily: POPPINS_FONT, zIndex: 1 }}
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-50"
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
DatePicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  t: PropTypes.func,
  className: PropTypes.string,
  setPageNo: PropTypes.func,
};

DatePicker.defaultProps = {
  value: "",
  placeholder: "",
  className: "",
  t: () => {},
  setPageNo: () => {},
};
const AllListings = () => {
  window.scrollTo(0, 0);
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const pageSize = useMemo(
    () =>
      window.innerWidth <= MOBILE_BREAKPOINT
        ? MOBILE_PAGE_SIZE
        : DESKTOP_PAGE_SIZE,
    [],
  );

  const [cityId, setCityId] = useState("");
  const [cities, setCities] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [selectedCategory, setCategoryName] = useState(t("allCategories"));
  const [selectedCity, setCityName] = useState(
    t("allCities", {
      regionName: process.env.REACT_APP_REGION_NAME,
    }),
  );
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [listings, setListings] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventTab, setEventTab] = useState("singleDay");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [terminalView, setTerminalView] = useState(false);
  const isInitialMount = useRef(true);
  const initialLoadComplete = useRef(false);

  // Memoized values
  const isEvents = useMemo(() => isEventsCategory(categoryId), [categoryId]);
  const terminalViewParam = useMemo(
    () => new URLSearchParams(location.search).get("terminalView") === "true",
    [location.search],
  );

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

  // Initial data load
  useEffect(() => {
    document.title = `${process.env.REACT_APP_REGION_NAME} ${t("allEvents")}`;
    const urlParams = new URLSearchParams(window.location.search);

    const accessToken =
      window.localStorage.getItem("accessToken") ||
      window.sessionStorage.getItem("accessToken");
    const refreshToken =
      window.localStorage.getItem("refreshToken") ||
      window.sessionStorage.getItem("refreshToken");
    setIsLoggedIn(!!(accessToken && refreshToken));

    setIsLoading(true);
    Promise.all([getCities(), getCategory()])
      .then((response) => {
        setCities(response[0].data.data);

        const filteredCategories = response[1]?.data?.data.filter(
          (category) => !hiddenCategories.includes(category.id),
        );
        setCategories(filteredCategories || []);

        const params = { pageSize, statusId: DEFAULT_STATUS_ID };

        const pageNoParam = parseUrlParam(urlParams, "pageNo");
        if (pageNoParam > 1) {
          params.pageNo = pageNoParam;
          setPageNo(pageNoParam);
        }

        const cityIdParam = parseUrlParam(urlParams, "cityId");
        if (cityIdParam) {
          const city = response[0].data.data.find((c) => c.id === cityIdParam);
          if (city) {
            setCityName(city.name);
            setCityId(cityIdParam);
            params.cityId = cityIdParam;
          }
        }

        const categoryIdParam = parseUrlParam(urlParams, "categoryId");
        if (categoryIdParam && categoryById[categoryIdParam]) {
          setCategoryId(categoryIdParam);
          setCategoryName(t(categoryById[categoryIdParam]));
          params.categoryId = categoryIdParam;
          if (categoryIdParam === EVENTS_CATEGORY_ID) {
            params.sortByStartDate = true;
          }
        }

        const startDateParam = urlParams.get("startDate");
        if (startDateParam) {
          setStartDate(startDateParam);
          if (categoryIdParam === EVENTS_CATEGORY_ID) {
            params.startDate = startDateParam;
          }
        }

        const endDateParam = urlParams.get("endDate");
        if (endDateParam) {
          setEndDate(endDateParam);
          if (categoryIdParam === EVENTS_CATEGORY_ID) {
            params.endDate = endDateParam;
          }
        }

        const eventTabParam = urlParams.get("eventTab");
        if (eventTabParam) {
          setEventTab(eventTabParam);
          if (categoryIdParam === EVENTS_CATEGORY_ID) {
            const eventType = getEventType(eventTabParam);
            if (eventType) {
              params.eventType = eventType;
            }
          }
        }

        const sortParam = urlParams.get("sort");
        if (sortParam) {
          setSelectedSortOption(sortParam);
        }

        const searchParam = urlParams.get("search") || "";
        if (searchParam) {
          setSearchQuery(searchParam);
        }

        setTimeout(async () => {
          try {
            params.showExternalListings = "false";
            if (searchParam) {
              const searchParams = {
                searchQuery: searchParam,
                pageSize,
                pageNo: params.pageNo || 1,
                statusId: DEFAULT_STATUS_ID,
                showExternalListings: "false",
              };
              if (params.cityId) searchParams.cityId = params.cityId;
              if (params.categoryId) {
                searchParams.categoryId = params.categoryId;
                if (params.categoryId === EVENTS_CATEGORY_ID) {
                  searchParams.sortByStartDate = true;
                  if (params.eventType) searchParams.eventType = params.eventType;
                  if (params.startDate) searchParams.startAfterDate = params.startDate;
                  if (params.endDate) searchParams.endBeforeDate = params.endDate;
                }
              }
              const response = await getListingsBySearch(searchParams);
              const listings = response.data.data || [];
              const filteredListings = listings.filter(
                (listing) => !hiddenCategories.includes(listing.categoryId),
              );
              setListings(filteredListings);
            } else {
              const response = await getListings(params);
              const listings = response.data.data;
              const filteredListings = listings.filter(
                (listing) => !hiddenCategories.includes(listing.categoryId),
              );
              setListings(filteredListings);
            }
          } catch (error) {
            console.error("Error fetching listings:", error);
            setListings([]);
          } finally {
            initialLoadComplete.current = true;
            setIsLoading(false);
          }
        }, FETCH_DELAY);
      })
      .catch((error) => {
        console.error("Error loading initial data:", error);
        initialLoadComplete.current = true;
        setIsLoading(false);
      });
  }, [t, pageSize]);

  // Sync state with URL parameters when location changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const urlStartDate = urlParams.get("startDate") || "";
    if (urlStartDate && urlStartDate !== startDate) {
      setStartDate(urlStartDate);
    } else if (!urlStartDate && startDate) {
      setStartDate("");
    }

    const urlEndDate = urlParams.get("endDate") || "";
    if (urlEndDate && urlEndDate !== endDate) {
      setEndDate(urlEndDate);
    } else if (!urlEndDate && endDate) {
      setEndDate("");
    }

    const urlEventTab = urlParams.get("eventTab");
    const currentCategoryId = parseUrlParam(urlParams, "categoryId");
    if (isEventsCategory(currentCategoryId)) {
      if (urlEventTab && urlEventTab !== eventTab) {
        setEventTab(urlEventTab);
      } else if (!urlEventTab && eventTab !== "singleDay") {
        setEventTab("singleDay");
      }
    } else if (eventTab !== "singleDay") {
      setEventTab("singleDay");
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

  // Update URL and fetch data when filters change
  useEffect(() => {
    // Skip on initial mount - initial load is handled by the first useEffect
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    // Skip until initial load has finished (avoids calling listings API when search in URL)
    if (!initialLoadComplete.current) {
      return;
    }

    setIsLoading(true);
    const params = { pageSize, statusId: DEFAULT_STATUS_ID };

    const urlParams = {};
    if (parseInt(cityId)) {
      const city = cities.find((c) => parseInt(cityId) === c.id);
      if (city) {
        setCityName(city.name);
        urlParams.cityId = cityId;
        params.cityId = cityId;
      }
    } else {
      setCityName(
        t("allCities", {
          regionName: process.env.REACT_APP_REGION_NAME,
        }),
      );
      urlParams.cityId = null;
    }

    if (parseInt(categoryId)) {
      setCategoryName(t(categoryById[categoryId]));
      params.categoryId = parseInt(categoryId);
      urlParams.categoryId = parseInt(categoryId);
    } else {
      setCategoryName(t("allCategories"));
      urlParams.categoryId = null;
    }

    if (pageNo > 1) {
      params.pageNo = pageNo;
      urlParams.pageNo = pageNo;
    } else {
      params.pageNo = 1;
      urlParams.pageNo = null;
    }

    if (startDate) {
      urlParams.startDate = startDate;
    } else {
      urlParams.startDate = null;
    }

    if (endDate) {
      urlParams.endDate = endDate;
    } else {
      urlParams.endDate = null;
    }

    if (isEvents) {
      if (eventTab) {
        urlParams.eventTab = eventTab;
      } else {
        urlParams.eventTab = null;
      }
    } else {
      urlParams.eventTab = null;
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

    if (parseInt(categoryId) === EVENTS_CATEGORY_ID) {
      params.sortByStartDate = true;
    }

    const timeoutId = setTimeout(async () => {
      if (searchQuery) {
        setListings([]);
        const searchParams = {
          searchQuery,
          pageSize,
          pageNo: params.pageNo || 1,
          statusId: DEFAULT_STATUS_ID,
          showExternalListings: "false",
        };
        if (parseInt(cityId)) searchParams.cityId = cityId;
        if (parseInt(categoryId)) {
          searchParams.categoryId = parseInt(categoryId);
          if (categoryId === EVENTS_CATEGORY_ID) {
            searchParams.sortByStartDate = true;
            const eventType = getEventType(eventTab);
            if (eventType) searchParams.eventType = eventType;
            if (startDate) searchParams.startAfterDate = startDate;
            if (endDate) searchParams.endBeforeDate = endDate;
          }
        }
        try {
          const response = await getListingsBySearch(searchParams);
          const data = response.data.data || [];
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
    categoryId,
    cityId,
    pageNo,
    startDate,
    endDate,
    eventTab,
    selectedSortOption,
    searchQuery,
    cities,
    t,
    isEvents,
    pageSize,
  ]);

  const fetchData = useCallback(
    async (params) => {
      setListings([]);
      setSearchQuery("");
      params.showExternalListings = "false";

      if (isEvents) {
        if (!params.eventType) {
          const eventType = getEventType(eventTab);
          if (eventType) {
            params.eventType = eventType;
          }
        }
        if (!params.startDate && startDate) {
          params.startDate = startDate;
        }
        if (!params.endDate && endDate) {
          params.endDate = endDate;
        }
        params.sortByStartDate = true;
      }

      try {
        const response = await getListings(params);
        const listings = response.data.data;
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
    [isEvents, eventTab, startDate, endDate],
  );

  const handleCityChange = useCallback((newCityId) => {
    setCityId(newCityId);
    setListings([]);
    setPageNo(1);
  }, []);

  const handleCategoryChange = useCallback((newCategoryId) => {
    setCategoryId(newCategoryId);
    setListings([]);
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setSelectedSortOption("");
    setPageNo(1);

    if (!isEventsCategory(newCategoryId)) {
      setEventTab("singleDay");
    }
  }, []);

  const handleSortOptionChange = useCallback((event) => {
    setSelectedSortOption(event.target.value);
  }, []);

  const handleSearch = useCallback((query) => {
    setPageNo(1);
    setSearchQuery(query);
  }, []);

  const handleEventTabChange = useCallback(
    (id) => {
      setEventTab(id);
      setStartDate("");
      setEndDate("");
      setSelectedSortOption("");
      setSearchQuery("");
      setPageNo(1);

      const urlParams = {};
      urlParams.startDate = null;
      urlParams.endDate = null;
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

  const handleOfficialNotificationButton = useCallback(() => {
    setCategoryId(OFFICIAL_NOTIFICATION_CATEGORY_ID);
    navigate(
      `/AllListings?terminalView=true&categoryId=${OFFICIAL_NOTIFICATION_CATEGORY_ID}`,
    );
  }, [navigate]);

  const navigateTo = useCallback(
    (path) => {
      if (path) {
        navigate(path);
      }
    },
    [navigate],
  );

  const handleUploadClick = useCallback(() => {
    localStorage.setItem("selectedItem", "Choose one category");
    navigateTo(isLoggedIn ? "/UploadListings" : "/login");
  }, [isLoggedIn, navigateTo]);

  const handlePageChange = useCallback((newPageNo) => {
    setPageNo(newPageNo);
  }, []);

  return (
    <section className="text-gray-600 body-font relative">
      <style>
        {`
          .flatpickr-calendar {
            z-index: 30 !important;
          }
        `}
      </style>
      <HomePageNavBar />
      <div className="container-fluid py-0 mr-0 ml-0 w-full flex flex-col mt-0">
        <div className="w-full mr-0 ml-0">
          <div className="lg:h-full h-[30rem] overflow-hidden py-0">
            <div className="relative h-[30rem]">
              <img
                alt="ecommerce"
                className="object-cover object-center h-full w-full"
                src={process.env.REACT_APP_BUCKET_HOST + "admin/Homepage.jpg"}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 text-white z--1">
                <h1
                  className="text-4xl mt-4 md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans galaxy-fold"
                  style={{ fontFamily: POPPINS_FONT }}
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
                      onChange={(e) => handleCityChange(e.target.value)}
                      value={cityId}
                      className="bg-white h-10 px-5 pr-10 rounded-xl text-sm focus:outline-none w-full text-gray-600"
                      style={{ fontFamily: POPPINS_FONT }}
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
                      onChange={(e) => handleCategoryChange(e.target.value)}
                      value={categoryId || 0}
                      className="bg-white h-10 px-5 pr-10 rounded-xl text-sm focus:outline-none w-full text-gray-600"
                      style={{ fontFamily: POPPINS_FONT }}
                    >
                      <option className="font-sans" value={0} key={0}>
                        {t("allCategories")}
                      </option>
                      {categories.map((category) => (
                        <option
                          className="font-sans"
                          value={category.id}
                          key={category.id}
                        >
                          {t(category.name)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-6 sm:col-span-1 mt-1 mb-1 px-0 mr-0 w-full">
                    <select
                      id="country"
                      name="country"
                      value={selectedSortOption}
                      onChange={handleSortOptionChange}
                      autoComplete="country-name"
                      className="bg-white h-10 px-5 pr-10 rounded-xl text-sm focus:outline-none w-full text-gray-600"
                      style={{ fontFamily: POPPINS_FONT }}
                    >
                      <option value="">{t("sort")}</option>
                      <option value="titleAZ">{t("atoztitle")}</option>
                      <option value="titleZA">{t("ztoatitle")}</option>
                      <option value="recent">{t("recent")}</option>
                      <option value="oldest">{t("oldest")}</option>
                    </select>
                  </div>

                  <SearchBar
                    onSearch={handleSearch}
                    searchBarClassName="w-full"
                    searchQuery={searchQuery}
                  />
                  {isEvents && (
                    <div className="flex flex-row gap-1 pl-40 sm:pl-0 col-span-6 sm:col-span-4 justify-center items-center">
                      <DatePicker
                        value={startDate}
                        onChange={setStartDate}
                        placeholder={t("startDate") || "Start Date"}
                        t={t}
                        className="col-span-6 sm:col-span-1 mt-1 mb-1 px-0 mr-0 w-full gap-1"
                        setPageNo={setPageNo}
                      />
                      <DatePicker
                        value={endDate}
                        onChange={setEndDate}
                        placeholder={t("endDate") || "End Date"}
                        t={t}
                        className="col-span-6 sm:col-span-1 mt-1 mb-1 px-0 mr-0 w-full"
                        setPageNo={setPageNo}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 mb-20 customproview py-6">
        <style>
          {`
            @media (min-height: 1293px) {
              .customproview {
                margin-bottom: 10rem;
              }
            }
          `}
        </style>
        {terminalViewParam && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-4 mb-4">
            <a
              onClick={handleOfficialNotificationButton}
              className={`flex items-center w-80 text-white border ${RegionColors.darkBgColor} py-2 px-6 gap-2 rounded-lg cursor-pointer`}
              style={{ fontFamily: POPPINS_FONT }}
            >
              <span>{t("officialnotification")}</span>
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

            <a
              onClick={() => navigateTo("/?terminalView=true")}
              className="flex items-center w-80 text-white bg-green-600 py-2 px-6 gap-2 rounded-lg cursor-pointer"
              style={{ fontFamily: POPPINS_FONT }}
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                className="w-6 h-6 ml-2"
              >
                <path d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              <span>{t("goBack")}</span>
            </a>
          </div>
        )}
        {isLoading ? (
          <LoadingPage />
        ) : (
          <div>
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
                        {t(tab?.label)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {sortedListings && sortedListings.length > 0 ? (
              <div className="bg-white lg:px-10 md:px-5 px-2 py-5 mt-5 mb-5 space-y-10 flex flex-col">
                <div className="relative place-items-center bg-white mb-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-10 justify-start">
                  {sortedListings.map((listing, index) => (
                    <ListingsCard
                      listing={listing}
                      terminalView={terminalViewParam}
                      key={listing.id || index}
                    />
                  ))}
                </div>
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
                <div
                  className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl"
                  style={{ fontFamily: POPPINS_FONT }}
                >
                  <span className="font-sans text-black">
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
          </div>
        )}
        <div
          className={`mt-20 mb-20 rounded-xl w-fit mx-auto text-center text-white whitespace-nowrap border border-transparent ${
            process.env.REACT_APP_NAME === "Salzkotten APP"
              ? "bg-yellow-600 hover:bg-yellow-400"
              : process.env.REACT_APP_NAME === "FICHTEL"
              ? "bg-lime-700 hover:bg-lime-300"
              : "bg-blue-800 hover:bg-blue-400 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
          } px-8 py-2 text-base font-semibold cursor-pointer`}
        >
          {pageNo !== 1 && (
            <span
              className={`text-lg px-3 ${RegionColors.lightHoverColor} cursor-pointer`}
              style={{ fontFamily: POPPINS_FONT }}
              onClick={() => handlePageChange(pageNo - 1)}
            >
              {"<"}{" "}
            </span>
          )}
          <span className="text-lg px-3" style={{ fontFamily: POPPINS_FONT }}>
            {t("page")} {pageNo}
          </span>
          {listings.length >= pageSize && (
            <span
              className={`text-lg px-3 ${RegionColors.lightHoverColor} cursor-pointer rounded-lg`}
              style={{ fontFamily: POPPINS_FONT }}
              onClick={() => handlePageChange(pageNo + 1)}
            >
              {">"}
            </span>
          )}
        </div>
      </div>

      {!isLoading && !terminalView && (
        <div className="bottom-0 w-full">
          <Footer />
        </div>
      )}
    </section>
  );
};

export default AllListings;
