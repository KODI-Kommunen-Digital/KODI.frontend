import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../Components/SideBar";
import SearchBar from "../Components/SearchBar";
import { getProfile } from "../Services/usersApi";
import { deleteAppointments } from "../Services/appointmentBookingApi";
import {
  getListings,
  getMyListing,
  updateListingsData,
  deleteListing,
  getListingsBySearch,
} from "../Services/listingsApi";
import { useNavigate } from "react-router-dom";
import { role } from "../Constants/role";
import { status, statusByName } from "../Constants/status";
import { useTranslation } from "react-i18next";
import LISTINGSIMAGE from "../assets/ListingsImage.jpg";
import { getCategory } from "../Services/CategoryApi";
import PdfThumbnail from "../Components/PdfThumbnail";
import APPOINTMENTDEFAULTIMAGE from "../assets/Appointments.png";
import { getCities } from "../Services/citiesApi";
import { hiddenCategories } from "../Constants/hiddenCategories";

const Dashboard = () => {
  window.scrollTo(0, 0);
  const { t } = useTranslation();
  const [listings, setListings] = useState([]);
  const [viewAllListings, setViewAllListings] = useState(null);
  const [pageNo, setPageNo] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [categories, setCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [cityId, setCityId] = useState();
  const isV2Backend = process.env.REACT_APP_V2_BACKEND === "True";

  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    getCities().then((citiesResponse) => {
      setCities(citiesResponse.data.data);
    });
    const cityId = parseInt(urlParams.get("cityId"));
    if (cityId) {
      setCityId(cityId);
    }

    document.title = process.env.REACT_APP_REGION_NAME + " " + t("dashboard");
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const pagenoParam = searchParams.get("pageNo");
    if (!isNaN(pagenoParam) && parseInt(searchParams.get("pageNo")) > 1) {
      setPageNo(parseInt(searchParams.get("pageNo")));
    } else {
      searchParams.delete("pageNo");
      const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
      window.history.replaceState({}, "", newUrl);
    }
    const accessToken =
      window.localStorage.getItem("accessToken") ||
      window.sessionStorage.getItem("accessToken");
    const refreshToken =
      window.localStorage.getItem("refreshToken") ||
      window.sessionStorage.getItem("refreshToken");
    if (!accessToken && !refreshToken) {
      window.location.href = "/login";
    }
    getCategory().then((response) => {
      const catList = {};
      response?.data?.data.forEach((cat) => {
        catList[cat.id] = cat.name;
      });
      setCategories(catList);
    });
    getProfile().then((response) => {
      if (window.location.pathname === "/DashboardAdmin" && response.data.data.roleId === role.Admin) {
        setViewAllListings(true);
      } else {
        setViewAllListings(false);
      }
    });
  }, [window.location.pathname]);

  const fetchListings = useCallback(() => {
    if (viewAllListings === true) {
      const params = {
        statusId: selectedStatus,
        pageNo,
      };

      // Check if cityId exists in the URL before adding it to params
      const urlParams = new URLSearchParams(window.location.search);
      const cityIdParam = urlParams.get("cityId");
      if (cityIdParam) {
        const cityId = parseInt(cityIdParam);
        params.cityId = cityId;
      }

      getListings(params).then((response) => {
        const listingsData = response.data.data;
        setListings(listingsData);
      });
    }
    if (viewAllListings === false) {
      getMyListing({
        statusId: selectedStatus,
        pageNo,
      }).then((response) => {
        const listingsData = response.data.data;
        setListings(listingsData);
      });
    }
  }, [selectedStatus, viewAllListings, pageNo, cityId]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings, pageNo]);

  useEffect(() => {
    setPageNo(1);
  }, [selectedStatus, viewAllListings]);

  function getStatusClass(statusId) {
    if (status[statusId] === "Active") {
      return "bg-green-400";
    }
    if (status[statusId] === "Inactive") {
      return "bg-red-400";
    }
    if (status[statusId] === "Pending") {
      return "bg-yellow-400";
    }
  }

  const setPageNoAndUpdateURL = (newPageNo) => {
    if (newPageNo < 1) {
      newPageNo = 1;
    }
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("pageNo", newPageNo);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
    setPageNo(newPageNo);
  };

  const setAllListingsPageNoAndUpdateURL = (newPageNo) => {
    if (newPageNo < 1) {
      newPageNo = 1;
    }
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("pageNo", newPageNo);
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
    setPageNo(newPageNo);
  };

  function handleChangeInStatus(newStatusId, listing) {
    updateListingsData(listing.cityId, { statusId: newStatusId }, listing.id)
      .then((res) => {
        // Update the listing status locally without reloading the page
        const updatedListings = listings.map((item) =>
          item.id === listing.id ? { ...item, statusId: newStatusId } : item
        );
        setListings(updatedListings);
      })
      .catch((error) => console.log(error));
  }

  function goToEditListingsPage(listing) {
    if (listing.categoryId === 18) {
      navigateTo(
        isV2Backend ? `/EditListings?listingId=${listing.id}&categoryId=${listing.categoryId}&appointmentId=${listing.appointmentId}` : `/EditListings?listingId=${listing.id}&cityId=${listing.cityId}&categoryId=${listing.categoryId}&appointmentId=${listing.appointmentId}`
      );
    } else {
      navigateTo(
        isV2Backend ? `/EditListings?listingId=${listing.id}` : `/EditListings?listingId=${listing.id}&cityId=${listing.cityId}`
      );
    }
  }
  const [showConfirmationModal, setShowConfirmationModal] = useState({
    visible: false,
    listing: null,
    onConfirm: () => { },
    onCancel: () => { },
  });

  const fetchUpdatedListings = useCallback(() => {
    fetchListings();
  }, [fetchListings]);

  function handleDelete(listing) {
    try {
      if (listing.appointmentId) {
        deleteAppointments(listing.cityId, listing.id, listing.appointmentId);
      }
      deleteListing(listing.cityId, listing.id)
        .then((res) => {
          setListings(
            listings.filter(
              (l) => l.cityId !== listing.cityId || l.id !== listing.id
            )
          );
          setShowConfirmationModal({ visible: false });

          fetchUpdatedListings();
          // window.location.reload();
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  }

  function deleteListingOnClick(listing) {
    setShowConfirmationModal({
      visible: true,
      listing,
      onConfirm: () => handleDelete(listing),
      onCancel: () => setShowConfirmationModal({ visible: false }),
    });
  }

  function goToListingPage(listing) {
    if (listing.sourceId === 1 || listing.showExternal === 0) {
      navigateTo(isV2Backend ? `/Listing?listingId=${listing.id}` : `/Listing?listingId=${listing.id}&cityId=${listing.cityId}`);
    } else if (listing.website) {
      window.location.href = listing.website;
    } else {
      navigateTo(`/error`);
    }
  }
  const handleSearch = async (searchQuery, statusName) => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const params = {};
      if (statusName && statusByName[statusName]) {
        params.statusId = statusByName[statusName];
      }

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

      const listingsData = response.data.data;
      setListings(listingsData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onCityChange = (e) => {
    const selectedCityId = e.target.value;
    const selectedCity = cities.find((city) => city.id.toString() === selectedCityId);
    const urlParams = new URLSearchParams(window.location.search);

    if (selectedCity) {
      localStorage.setItem("selectedCity", selectedCity.name);
      urlParams.set("cityId", selectedCityId);
    } else {
      localStorage.setItem("selectedCity", t("allCities"));
      urlParams.delete("cityId");
    }
    urlParams.delete("pageNo");
    setPageNoAndUpdateURL(1)

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
    setCityId(selectedCityId || 0);
  };

  return (
    <section className="bg-gray-900 body-font relative min-h-screen">
      <SideBar />

      <div className="container px-0 sm:px-0 py-0 pb-2 w-full fixed top-0 z-10 lg:px-5 lg:w-auto relative">
        <div className="relative bg-black mr-0 ml-0 px-10 lg:rounded-lg h-18">
          <div className="w-full">
            <div className="w-full h-full flex items-center lg:py-2 py-5 justify-end xl:justify-center lg:justify-center border-gray-100 md:space-x-10">
              <div className="hidden lg:block">
                <div className="w-full h-full flex items-center justify-end xl:justify-center lg:justify-center md:justify-end sm:justify-end border-gray-100 md:space-x-10">
                  <div
                    className={`${selectedStatus === null ? "bg-gray-700 text-white" : "text-gray-300"
                      } hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer`}
                    onClick={() => setSelectedStatus(null)}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("allListings")}
                  </div>
                  <div
                    className={`${selectedStatus === statusByName.Active ? "bg-gray-700 text-white" : "text-gray-300"
                      } hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer`}
                    onClick={() => setSelectedStatus(statusByName.Active)}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("active")}
                  </div>
                  <div
                    className={`${selectedStatus === statusByName.Pending ? "bg-gray-700 text-white" : "text-gray-300"
                      } hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer`}
                    onClick={() => setSelectedStatus(statusByName.Pending)}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("pending")}
                  </div>
                  <div
                    className={`${selectedStatus === statusByName.Inactive ? "bg-gray-700 text-white" : "text-gray-300"
                      } hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer`}
                    onClick={() => setSelectedStatus(statusByName.Inactive)}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("inactive")}
                  </div>
                </div>
              </div>

              <div className="-my-2 -mr-2 lg:hidden">
                <select
                  className="text-white bg-black font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center border-none focus:outline-none"
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  value={selectedStatus || ""}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <option value="">{t("allListings")}</option>
                  <option value={statusByName.Active}>{t("active")}</option>
                  <option value={statusByName.Pending}>{t("pending")}</option>
                  <option value={statusByName.Inactive}>{t("inactive")}</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container flex justify-center px-5 py-2 gap-2 w-full md:w-auto fixed lg:w-auto relative">
        <SearchBar
          onSearch={handleSearch}
          searchBarClassName="w-full md:w-80"
        />

        {window.location.pathname.includes("/DashboardAdmin") && (
          <div className="col-span-6 sm:col-span-1 mt-1 mb-1 px-0 mr-0 w-full md:w-80">
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
                {t("allCities", {
                  regionName: process.env.REACT_APP_REGION_NAME,
                })}
              </option>
              {cities.map((city) => (
                <option className="font-sans" value={city.id} key={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>


      <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-900 min-h-screen flex flex-col">
        <div className="h-full">
          <div className="bg-white mt-4 p-0">
            <h2 className="text-xl font-semibold text-gray-800 text-center px-5 py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              {t("listings")}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left  text-gray-500  p-6 space-y-10 rounded-lg">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        width: "16.67%",
                      }}
                    >
                      {t("listings")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 sm:px-3 py-3 hidden lg:table-cell text-center"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {t("category")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 hidden lg:table-cell text-center"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {t("date_of_creation")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {t("noOfViews")}
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-center"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {t("action")}
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-4 text-center"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {t("status")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing, index) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="flex items-center px-6 py-4 text-slate-800 whitespace-nowrap cursor-pointer"
                          onClick={() => {
                            if (!hiddenCategories.includes(listing.categoryId)) {
                              goToListingPage(listing);
                            }
                          }}
                        >
                          {listing.pdf ? (
                            <div className="object-cover object-center w-10 h-10 rounded-full overflow-hidden"
                            >
                              <PdfThumbnail
                                pdfUrl={process.env.REACT_APP_BUCKET_HOST + listing.pdf}
                              />
                            </div>
                          ) : listing.logo ? (
                            <img
                              className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                              src={
                                listing.sourceId === 1 ? listing.logo ? process.env.REACT_APP_BUCKET_HOST + listing.logo : LISTINGSIMAGE : listing.logo
                              }
                              onError={(e) => {
                                e.target.src = listing.appointmentId !== null ? APPOINTMENTDEFAULTIMAGE : LISTINGSIMAGE; // Set default image if loading fails
                              }}
                              alt="avatar"
                            />
                          ) : (
                            <img
                              alt="Listing"
                              className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                              src={listing.appointmentId !== null ? APPOINTMENTDEFAULTIMAGE : LISTINGSIMAGE}
                            />
                          )}

                          <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
                            <div
                              className="text-gray-500 font-bold truncate"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {listing.title}
                            </div>
                          </div>
                        </th>

                        <td
                          className="px-6 py-4 hidden lg:table-cell text-center"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {t(categories[listing.categoryId])}
                        </td>

                        <td
                          className="px-6 py-4 hidden lg:table-cell text-center font-bold text-blue-600"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {new Date(listing.createdAt).toLocaleString("de")}
                        </td>

                        <td
                          className="px-6 py-4 font-bold text-blue-600 text-center"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {listing.viewCount}
                        </td>

                        <td className="px-6 py-4 text-center font-bold">
                          <div className="flex justify-center items-center">
                            <a
                              className={`font-medium text-green-600 px-2 cursor-pointer`}
                              style={{ fontFamily: "Poppins, sans-serif" }}
                              onClick={() => goToEditListingsPage(listing)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 640 512"
                                className="w-6 h-6 fill-current transition-transform duration-300 transform hover:scale-110"
                              >
                                <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                              </svg>
                            </a>

                            <a
                              className={`font-medium text-red-600 px-2 cursor-pointer`}
                              style={{ fontFamily: "Poppins, sans-serif" }}
                              onClick={() => deleteListingOnClick(listing)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="1em"
                                viewBox="0 0 640 512"
                                className="w-6 h-6 fill-current transition-transform duration-300 transform hover:scale-110"
                              >
                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                              </svg>
                            </a>
                          </div>
                        </td>
                        {showConfirmationModal.visible && (
                          <div className="fixed z-50 inset-0 flex items-center justify-center overflow-y-auto">
                            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                              <div
                                className="fixed inset-0 transition-opacity"
                                aria-hidden="true"
                              >
                                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                              </div>
                              <span
                                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                aria-hidden="true"
                              >
                                &#8203;
                              </span>
                              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                  <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                      <svg
                                        className="h-6 w-6 text-red-700"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                      <h3 className="text-lg leading-6 font-medium text-slate-800">
                                        {t("areyousure")}
                                      </h3>
                                      <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                          {t("doyoureallywanttodeleteListing")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                  <button
                                    onClick={showConfirmationModal.onConfirm}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                  >
                                    {t("delete")}
                                  </button>

                                  <button
                                    onClick={showConfirmationModal.onCancel}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                  >
                                    {t("cancel")}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <td className="px-6 py-4">
                          <div className="flex items-center justify-center">
                            <div
                              className={`h-2.5 w-2.5 rounded-full ${getStatusClass(
                                listing.statusId
                              )} mr-2`}
                            ></div>
                            {viewAllListings ? (
                              <select
                                className="border font-sans border-gray-300 text-gray-500 sm:text-sm rounded-xl p-2.5 w-full"
                                onChange={(e) =>
                                  handleChangeInStatus(e.target.value, listing)
                                }
                                value={listing.statusId || 0}
                                style={{ fontFamily: "Poppins, sans-serif" }}
                              >
                                {Object.keys(status).map((state, index) => {
                                  return (
                                    <option
                                      className="p-0"
                                      key={index}
                                      value={state}
                                    >
                                      {t(status[state]?.toLowerCase())}
                                    </option>
                                  );
                                })}
                              </select>
                            ) : (
                              <h1 style={{ fontFamily: "Poppins, sans-serif" }}>
                                {t(status[listing.statusId]?.toLowerCase())}
                              </h1>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
            {pageNo !== 1 ? (
              <span
                className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                onClick={
                  viewAllListings
                    ? () => setAllListingsPageNoAndUpdateURL(pageNo - 1)
                    : () => setPageNoAndUpdateURL(pageNo - 1)
                }
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {"<"}{" "}
              </span>
            ) : (
              <span />
            )}
            <span
              className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {t("page")} {pageNo}
            </span>

            {listings.length >= 9 && (
              <span
                className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                onClick={
                  viewAllListings
                    ? () => setAllListingsPageNoAndUpdateURL(pageNo + 1)
                    : () => setPageNoAndUpdateURL(pageNo + 1)
                }
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {">"}
              </span>
            )}
          </div>
        </div>
      </div>
    </section >
  );
};

export default Dashboard;
