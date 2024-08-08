import React, { useState, useEffect } from "react";
import HomePageNavBar from "../Components/V2/HomePageNavBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../Components/Footer";
import { getCities, getCitizenServices } from "../Services/cities";
import LoadingPage from "../Components/LoadingPage";
import RegionColors from "../Components/RegionColors";

const CitizenService = () => {
  window.scrollTo(0, 0);
  const { t } = useTranslation();
  const [cities, setCities] = useState({});
  const [citizenService, setCitizenServices] = useState({});
  const [citiesArray, setCitiesArray] = useState([]);
  const [cityId, setCityId] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      const absolutePath = path.startsWith("/") ? path : `/${path}`;
      navigate(absolutePath);
    }
  };

  useEffect(() => {
    setIsLoading(true)
    const urlParams = new URLSearchParams(window.location.search);
    document.title =
      process.env.REACT_APP_REGION_NAME + " " + t("citizenService");
    getCities().then((response) => {
      setCitiesArray(response.data.data);
      const temp = {};
      for (const city of response.data.data) {
        temp[city.id] = {
          name: city.name,
          hasForum: city.hasForum,
        };
      }
      setCities(temp);
      const cityIdParam = urlParams.get("cityId");
      if (cityIdParam && temp[cityIdParam]) setCityId(cityIdParam);
    });

    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);

  const fetchData = async () => {
    try {
      const response = await getCitizenServices();
      setCitizenServices(response.data.data);
    } catch (error) {
      setCitizenServices([]);
      console.error("Error fetching citizenServices:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = (data) => {
    if (data.isExternalLink) {
      navigateTo(
        cityId
          ? `/CitizenService/CitizenServiceManagement?citizenServiceId=${data.id}&cityId=${cityId}`
          : `/CitizenService/CitizenServiceManagement?citizenServiceId=${data.id}`
      );
    } else {
      const urlWithCityId = cityId
        ? data.link.includes("?")
          ? `${data.link}&cityId=${cityId}`
          : `${data.link}?cityId=${cityId}`
        : data.link;
      navigateTo(urlWithCityId);
    }
  };

  function goBack() {
    navigateTo(`/`);
  }

  return (
    <section className="text-gray-600 bg-white body-font">
      <HomePageNavBar />

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
                <h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
                  {process.env.REACT_APP_REGION_NAME === "WALDI" ? (
                    t("moreService")
                  ) : (
                    t("citizenService")
                  )}
                </h1>

                <div className="col-span-6 sm:col-span-1 mt-1 w-auto px-0 mr-0">
                  <select
                    id="city"
                    name="city"
                    autoComplete="city-name"
                    onChange={(e) => {
                      const selectedCityId = e.target.value;
                      const newUrl = !selectedCityId
                        ? `${window.location.pathname}`
                        : `${window.location.pathname}?cityId=${selectedCityId}`;
                      window.history.replaceState({}, "", newUrl);
                      setCityId(parseInt(selectedCityId));
                    }}
                    value={cityId || 0}
                    className="bg-white h-10 px-5 pr-10 rounded-xl text-sm focus:outline-none w-full text-gray-600"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    <option className="font-sans" value={0} key={0}>
                      {t("allCities", {
                        regionName: process.env.REACT_APP_REGION_NAME,
                      })}
                    </option>
                    {citiesArray.map((city) => (
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
              </div>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingPage />
      ) : (
        <div>
          {citizenService && citizenService.length > 0 ? (
            <div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
              <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 relative mb-4 justify-center place-items-center">
                {citizenService &&
                  citizenService
                    // .filter((data) => data.title !== "forums" || showForum)
                    .map((data, index) => (
                      <div
                        key={index}
                        className="h-80 w-full rounded-lg cursor-pointer transition-all duration-300 hover:shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transform hover:-translate-y-2"
                      >
                        <div className="relative h-80 rounded overflow-hidden">
                          <a
                            rel="noreferrer noopener"
                            onClick={() => handleLinkClick(data)}
                          >
                            <img
                              alt={data.title}
                              className="object-cover object-center h-full w-full"
                              src={process.env.REACT_APP_BUCKET_HOST + data.image}
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-opacity-50 text-white z--1">
                              <p className="mb-4 ml-4 font-sans">
                                {cities[data.cityId]}
                              </p>
                            </div>
                          </a>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-center">
                <div className="m-auto md:mt-20 mt-0 mb-20 text-center font-sans font-bold text-xl">
                  <h1 className="text-5xl md:text-8xl lg:text-10xl text-center font-bold my-10 font-sans bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                    Oops !
                  </h1>
                </div>
                <div className="m-auto mt-20 mb-20 text-center font-sans font-bold text-xl">
                  <h1 className=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
                    {t("currently_no_services")}
                  </h1>
                </div>
                <div
                  className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  <a
                    onClick={() => goBack()}
                    className={`w-full rounded-xl sm:w-80 mt-10 mx-auto ${RegionColors.darkBgColor} ${RegionColors.lightHoverShadowColor} px-8 py-2 text-base font-semibold text-white cursor-pointer font-sans`}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("goBack")}
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!isLoading && (
        <div className="bottom-0 w-full">
          <Footer />
        </div>
      )}
    </section>
  );
};

export default CitizenService;
