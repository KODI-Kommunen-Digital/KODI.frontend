import React, { useState, useEffect } from "react";
import HomePageNavBar from "../Components/V2/HomePageNavBar";
import { useTranslation } from "react-i18next";
import { getFavoriteListings } from "../Services/favoritesApi";
import {
  sortByTitleAZ,
  sortByTitleZA,
  sortLatestFirst,
  sortOldestFirst,
} from "../Services/helper";
import { getCities } from "../Services/citiesApi";
import Footer from "../Components/Footer";
import ListingsCard from "../Components/ListingsCard";
import LoadingPage from "../Components/LoadingPage";
import { getCategory } from "../Services/CategoryApi";
import RegionColors from "../Components/RegionColors";
import { hiddenCategories } from "../Constants/hiddenCategories";

const Favorites = () => {
  window.scrollTo(0, 0);
  const pageSize = window.innerWidth <= 768 ? 8 : 12;
  const { t } = useTranslation();
  const [cityId, setCityId] = useState(null);
  const [cities, setCities] = useState([]);
  const [categoryId, setCategoryId] = useState(0);
  const [pageNo, setPageNo] = useState(1);
  const [selectedSortOption, setSelectedSortOption] = useState("");
  const [favListings, setFavListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const accessToken =
      window.localStorage.getItem("accessToken") ||
      window.sessionStorage.getItem("accessToken");
    const refreshToken =
      window.localStorage.getItem("refreshToken") ||
      window.sessionStorage.getItem("refreshToken");
    if (!accessToken && !refreshToken) {
      window.location.href = "/login";
    }
    document.title = process.env.REACT_APP_REGION_NAME + " " + t("favourites");
    const urlParams = new URLSearchParams(window.location.search);
    getCategory().then((response) => {
      const catList = {};
      response?.data?.data
        .filter(cat => !hiddenCategories.includes(cat.id)) // Filter out hidden categories
        .forEach((cat) => {
          catList[cat.id] = cat.name;
        });
      setCategories(catList);
    });
    getCities().then((citiesResponse) => {
      setCities(citiesResponse.data.data);
      const cityIdParam = urlParams.get("cityId");
      if (cityIdParam) setCityId(cityIdParam);
      const categoryIdParam = urlParams.get("categoryId");
      if (categoryIdParam) setCategoryId(categoryIdParam);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const params = { pageSize: 12, statusId: 1 };
    setIsLoading(true);
    if (parseInt(cityId)) {
      urlParams.set("cityId", cityId);
      params.cityId = cityId;
    } else {
      urlParams.delete("cityId");
    }
    if (parseInt(categoryId)) {
      params.categoryId = categoryId;
      urlParams.set("categoryId", categoryId);
    } else {
      urlParams.delete("categoryId");
    }

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
    getFavoriteListings(params).then((response) => {
      const data = response.data.data;
      setFavListings(data);
      setIsLoading(false);
    });
  }, [categoryId, cityId, pageNo, t]);

  function handleSortOptionChange(event) {
    setSelectedSortOption(event.target.value);
  }

  useEffect(() => {
    switch (selectedSortOption) {
      case "titleAZ":
        setFavListings([...sortByTitleAZ(favListings)]);
        break;
      case "titleZA":
        setFavListings([...sortByTitleZA(favListings)]);
        break;
      case "recent":
        setFavListings([...sortLatestFirst(favListings)]);
        break;
      case "oldest":
        setFavListings([...sortOldestFirst(favListings)]);
        break;
      default:
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSortOption]);

  return (
    <section className="text-gray-600 body-font relative">
      <HomePageNavBar />{" "}
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div>
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
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
                    <h1
                      className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans"
                      style={{ fontFamily: "Poppins, sans-serif" }}
                    >
                      {t("favorites")}
                    </h1>

                    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 lg:gap-4 md:gap-4 gap-2 relative justify-center place-items-center lg:px-10 md:px-5 sm:px-0 px-2 py-0 mt-0 mb-0">
                      <div className="col-span-6 sm:col-span-1 mt-1 mb-1 px-0 mr-0 w-full">
                        <select
                          id="city"
                          name="city"
                          autoComplete="city-name"
                          onChange={(e) => setCityId(e.target.value)}
                          value={cityId || 0}
                          className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full text-gray-600"
                          style={{ fontFamily: "Poppins, sans-serif" }}
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
                          onChange={(e) => setCategoryId(e.target.value)}
                          value={categoryId}
                          className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full text-gray-600"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          <option className="font-sans" value={0} key={0}>
                            {t("allCategories")}
                          </option>
                          {Object.keys(categories).map((key) => {
                            return (
                              <option className="font-sans" value={key} key={key}>
                                {t(categories[key])}
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
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-5 mb-20 p-6">
            <div>
              {favListings && favListings.length > 0 ? (
                <div className="bg-white lg:px-10 md:px-5 px-2 py-5 mt-5 mb-5 space-y-10 flex flex-col">
                  <div className="relative place-items-center bg-white mb-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-4 gap-10 justify-start">
                    {favListings &&
                      favListings.map((favListing, index) => (
                        <ListingsCard listing={favListing} key={index} />
                      ))}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-center">
                    <h1 className=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
                      {t("currently_no_fav_listings")}
                    </h1>
                  </div>
                </div>
              )}
            </div>
            <div className={`mt-20 mb-20 rounded-xl w-fit mx-auto text-center text-white whitespace-nowrap rounded-md border border-transparent ${process.env.REACT_APP_NAME === 'Salzkotten APP' ? 'bg-yellow-600 hover:bg-yellow-400' : process.env.REACT_APP_NAME === 'FICHTEL' ? 'bg-lime-700 hover:bg-lime-300' : 'bg-blue-800 hover:bg-blue-400 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]'} px-8 py-2 text-base font-semibold cursor-pointer`}>
              {pageNo !== 1 ? (
                <span
                  className={`text-lg px-3 ${RegionColors.lightHoverColor} cursor-pointer`}
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
              {favListings.length >= pageSize && (
                <span
                  className={`text-lg px-3 hover:${RegionColors.lightTextColor}  cursor-pointer rounded-lg`}
                  style={{ fontFamily: "Poppins, sans-serif" }}
                  onClick={() => setPageNo(pageNo + 1)}
                >
                  {">"}
                </span>
              )}
            </div>
          </div>

          {!isLoading && (
            <div className="bottom-0 w-full">
              <Footer />
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Favorites;
