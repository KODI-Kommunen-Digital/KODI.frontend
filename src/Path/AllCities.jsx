import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import LISTINGSIMAGE from "../assets/ListingsImage.jpg";
import { deleteCity } from "../Services/citiesApi";
import { getProfile } from "../Services/usersApi";
import { role } from "../Constants/role";
import { FaEye } from "react-icons/fa";
import RegionColors from "../Components/RegionColors";
import { useNavigate } from "react-router-dom";
import CITY_LISTING_DUMMY from "../Constants/cityListingDummy";
const AllCities = () => {
  window.scrollTo(0, 0);
  const { t } = useTranslation();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize] = useState(9); // Number of items per page
  const [cities, setCities] = useState([]);
  const [userRole, setUserRole] = useState(role.User);
  const [, setImageLoadStatus] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  useEffect(() => {
    const accessToken =
      window.localStorage.getItem("accessToken") ||
      window.sessionStorage.getItem("accessToken");
    const refreshToken =
      window.localStorage.getItem("refreshToken") ||
      window.sessionStorage.getItem("refreshToken");

    if (!accessToken && !refreshToken && userRole !== role.Admin) {
      navigate("/login");
    }
  }, [navigate, userRole]);

  useEffect(() => {
    document.title = process.env.REACT_APP_REGION_NAME;
  }, []);

  const fetchCities = useCallback(() => {
    // ORIGINAL API CODE - Commented out for testing with dummy data
    // getCitiesByUserId({ searchQuery }).then((citiesResponse) => {
    //     setCities(citiesResponse.data.data);
    // }).catch((error) => {
    //     console.log("API Error:", error);
    // });

    // DUMMY DATA FOR TESTING - Remove this block when ready to use real API
    setCities(CITY_LISTING_DUMMY.data);
  }, [searchQuery, pageNo, pageSize]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await getProfile();
        console.log("Profile Response:", data?.data?.roleId);
        setUserRole(data?.data?.roleId);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const [showConfirmationModal, setShowConfirmationModal] = useState({
    visible: false,
    city: null,
    onConfirm: () => {},
    onCancel: () => {},
  });

  function goToEditCityPage(city) {
    navigateTo(`/EditCity?cityId=${city.id}`);
  }

  function deleteCityOnClick(city) {
    setShowConfirmationModal({
      visible: true,
      city,
      onConfirm: () => handleDeleteCity(city),
      onCancel: () => setShowConfirmationModal({ visible: false }),
    });
  }

  function handleDeleteCity(city) {
    try {
      deleteCity(city.id)
        .then((res) => {
          setCities(cities.filter((c) => c.id !== city.id));
          setShowConfirmationModal({ visible: false });
          // Reset to first page if current page is empty after deletion
          if (paginatedCities.length === 1 && pageNo > 1) {
            setPageNo(pageNo - 1);
          }
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  }

  // Pagination logic
  const totalCities = cities.length;
  const totalPages = Math.ceil(totalCities / pageSize);
  const startIndex = (pageNo - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalCities);
  const paginatedCities = cities.slice(startIndex, endIndex);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPageNo(page);
    }
  };
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPageNo(1); // Reset to first page when searching
    fetchCities();
  };

  return (
    <section className="bg-gray-900 body-font relative min-h-screen">
      <SideBar />

      <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-900 min-h-screen flex flex-col p-5">
        <div className="h-full">
          <div className="flex justify-center p-4">
            <div className="w-full md:w-1/2 lg:w-1/3">
              <form
                onSubmit={handleSearchSubmit}
                className="relative text-gray-600 col-span-6 sm:col-span-1 mt-1 mb-1 px-0 mr-0 w-full"
              >
                <input
                  type="search"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  name="search"
                  placeholder="Search"
                  className="bg-white appearance-none h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full text-gray-600"
                  style={{
                    fontFamily:
                      "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                  }}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-3 mr-4"
                >
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 56.966 56.966"
                    style={{ enableBackground: "new 0 0 56.966 56.966" }}
                    width="512px"
                    height="512px"
                  >
                    <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
          <div className="bg-white mt-4 p-0">
            <h2
              className="text-xl font-semibold text-gray-800 text-center px-5 py-2"
              style={{
                fontFamily:
                  "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
              }}
            >
              {t("cities")}
            </h2>
            <div className="overflow-x-auto">
              {paginatedCities.length > 0 && (
                <table className="w-full text-sm text-left text-gray-500 p-6 space-y-10 rounded-lg">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center"
                        style={{
                          fontFamily:
                            "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                          width: "16.67%",
                        }}
                      >
                        {t("cityName")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 sm:px-3 py-3 hidden lg:table-cell text-center"
                        style={{
                          fontFamily:
                            "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                        }}
                      >
                        {t("parentCity")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 hidden lg:table-cell text-center"
                        style={{
                          fontFamily:
                            "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                        }}
                      >
                        {t("latitude")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center"
                        style={{
                          fontFamily:
                            "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                        }}
                      >
                        {t("longitude")}
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-4 text-center"
                        style={{
                          fontFamily:
                            "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                        }}
                      >
                        {t("action")}
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-4 text-center"
                        style={{
                          fontFamily:
                            "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                        }}
                      >
                        {t("viewCategories")}
                      </th>

                      <th
                        scope="col"
                        className="px-6 py-4 text-center"
                        style={{
                          fontFamily:
                            "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                        }}
                      >
                        {t("viewAdmins")}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCities.map((city, index) => {
                      return (
                        <tr
                          key={index}
                          className="bg-white border-b hover:bg-gray-50"
                        >
                          <th
                            scope="row"
                            className="flex items-center px-6 py-4 text-slate-800 whitespace-nowrap"
                          >
                            {city.image ? (
                              <img
                                alt="City"
                                className="w-10 h-10 object-cover rounded-full"
                                src={city.image}
                                onLoad={() =>
                                  setImageLoadStatus((prev) => ({
                                    ...prev,
                                    [city.id]: true,
                                  }))
                                }
                                onError={() =>
                                  setImageLoadStatus((prev) => ({
                                    ...prev,
                                    [city.id]: true,
                                  }))
                                }
                              />
                            ) : (
                              <img
                                alt="City"
                                className="w-10 h-10 object-cover rounded-full"
                                src={LISTINGSIMAGE}
                                onLoad={() =>
                                  setImageLoadStatus((prev) => ({
                                    ...prev,
                                    [city.id]: true,
                                  }))
                                }
                                onError={() =>
                                  setImageLoadStatus((prev) => ({
                                    ...prev,
                                    [city.id]: true,
                                  }))
                                }
                              />
                            )}
                            <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
                              <div
                                className="text-gray-500 font-bold truncate"
                                style={{
                                  fontFamily:
                                    "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                                }}
                              >
                                {city.name}
                              </div>
                            </div>
                          </th>

                          <td
                            className="px-6 py-4 hidden lg:table-cell text-center"
                            style={{
                              fontFamily:
                                "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                            }}
                          >
                            {city.parentCity}
                          </td>

                          <td
                            className="px-6 py-4 hidden lg:table-cell text-center"
                            style={{
                              fontFamily:
                                "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                            }}
                          >
                            {city.latitude}
                          </td>

                          <td
                            className="px-6 py-4 text-center"
                            style={{
                              fontFamily:
                                "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                            }}
                          >
                            {city.longitude}
                          </td>

                          <td className="px-6 py-4 text-center font-bold">
                            <div className="flex justify-center items-center">
                              <a
                                className={`font-medium text-green-600 px-2 cursor-pointer`}
                                style={{
                                  fontFamily:
                                    "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                                }}
                                onClick={() => goToEditCityPage(city)}
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
                                style={{
                                  fontFamily:
                                    "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                                }}
                                onClick={() => deleteCityOnClick(city)}
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
                                  <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
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
                                          {t("confirmDeleteTitle")}
                                        </h3>
                                        <div className="mt-2">
                                          <p className="text-sm text-gray-500">
                                            {t("confirmDeleteMessage")}
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
                                className="relative group inline-block"
                                onClick={() =>
                                  navigateTo(`/categories?cityId=${city.id}`)
                                }
                              >
                                <FaEye
                                  className={`text-2xl ${RegionColors.darkTextColor} cursor-pointer`}
                                />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {t("viewDetails")}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center">
                              <div
                                className="relative group inline-block"
                                onClick={() =>
                                  navigateTo(`/admins?cityId=${city.id}`)
                                }
                              >
                                <FaEye
                                  className={`text-2xl ${RegionColors.darkTextColor} cursor-pointer`}
                                />
                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  {t("viewDetails")}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          {paginatedCities.length === 0 && (
            <div className="text-center p-6">
              <p className="text-gray-500">{t("noCitiesFound")}</p>
            </div>
          )}
          <div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
            {pageNo > 1 ? (
              <span
                className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                onClick={() => goToPage(pageNo - 1)}
                style={{
                  fontFamily:
                    "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                }}
              >
                {"<"}{" "}
              </span>
            ) : (
              <span />
            )}
            <span
              className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
              style={{
                fontFamily:
                  "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
              }}
            >
              {t("page")} {pageNo}
            </span>

            {pageNo < totalPages && (
              <span
                className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                onClick={() => goToPage(pageNo + 1)}
                style={{
                  fontFamily:
                    "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                }}
              >
                {">"}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AllCities;
