import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useTranslation } from "react-i18next";
import HOMEPAGEIMG from "./../../assets/homeimage.jpg";
import Footer from "../../Components/Footer";
import { getCities } from "../../Services/cities";

const AllForums = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [citiesArray, setCitiesArray] = useState([]);
    const [cityId, setCityId] = useState(null);
    const [pageNo] = useState(1);

    useEffect(() => {
        document.title = "Heidi - Forums";
        getCities().then((response) => {
            setCitiesArray(response.data.data);
            const temp = {};
            for (const city of response.data.data) {
                temp[city.id] = city.name;
            }
        })
    }, []);

    useEffect(() => {
        const params = { pageNo, pageSize: 12 };
        const urlParams = new URLSearchParams(window.location.search);
        params.cityId = cityId;
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
    }, [cityId, pageNo]);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const cityId = urlParams.get("cityId");
        if (parseInt(cityId)) {
            urlParams.set("cityId", cityId);
        } else {
            urlParams.delete("cityId");
        }
    }, []);

    useEffect(() => {
        const params = {};
        if (cityId !== 0) {
            params.cityId = cityId;
        }
    }, [cityId]);

    return (
        <section className="text-gray-600 bg-white body-font">
            <HomePageNavBar />

            <div className="container-fluid py-0 mr-0 ml-0 mt-20 w-full flex flex-col">
                <div className="w-full mr-0 ml-0">
                    <div className="h-64 overflow-hidden px-0 py-1">
                        <div className="relative h-64">
                            <img
                                alt="ecommerce"
                                className="object-cover object-center h-full w-full"
                                src={HOMEPAGEIMG}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
                                <h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
                                    {t("forums")}
                                </h1>

                                <div className="col-span-6 sm:col-span-1 mt-1 w-auto px-0 mr-0">
                                    <select
                                        id="city"
                                        name="city"
                                        autoComplete="city-name"
                                        onChange={(e) => setCityId(e.target.value)}
                                        value={cityId}
                                        className="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    >
                                        <option className="font-sans" value={0} key={0}>
                                            {t("allCities")}
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

            <div>
                <div className="flex items-center justify-center">
                    <h1 className=" m-auto my-40 text-center font-sans font-bold text-2xl text-black">
                        {t("comingSoon")}
                    </h1>
                </div>
            </div>

            <div className="bottom-0 w-full">
                <Footer />
            </div>
        </section>
    );
};

export default AllForums;
