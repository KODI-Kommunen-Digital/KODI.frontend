import React, { useEffect, useState } from "react";
import HomePageNavBar from "../../Components/V2/HomePageNavBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getListings } from "../../Services/listingsApi";
import { getCities } from "../../Services/citiesApi";
import TroisdorfTerminalListingsCard from "./TroisdorfTerminalListingsCard";
import { getCategory } from "../../Services/CategoryApi";
import LoadingPage from "../../Components/LoadingPage";
import { hiddenCategories } from "../../Constants/hiddenCategories";
import SearchBar from "../../Components/SearchBar";

const HomePage = () => {
    const { t } = useTranslation();
    const [cityId, setCityId] = useState();
    const [categoryId, setCategoryId] = useState();
    const [cities, setCities] = useState([]);
    const [listings, setListings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const queryParams = new URLSearchParams(location.search);
    const terminalViewParam = queryParams.get("terminalView");

    const isTerminalScreenEnvEnabled =
        process.env.REACT_APP_ENABLE_TROISDORF_TERMINALSCREEN === "True";

    const isTerminalScreenEnabled =
        isTerminalScreenEnvEnabled && terminalViewParam === "true";

    useEffect(() => {
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

        getCategory().then((response) => {
            const catList = {};
            response?.data?.data
                .filter(cat => !hiddenCategories.includes(cat.id))
                .forEach((cat) => {
                    catList[cat.id] = cat.name;
                });
            setCategories(catList);
        });

        document.title = process.env.REACT_APP_REGION_NAME + " " + t("home");
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);

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
            const listings = response?.data?.data || [];

            const filteredListings = listings.filter(
                listing => !hiddenCategories.includes(listing.categoryId)
            );

            setListings(filteredListings);
        } catch (error) {
            setListings([]);
            console.error("Error fetching listings:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (searchTerm) => {
        setSearchQuery(searchTerm);
    };

    // const clearSearchResults = () => {
    //     setListings([]);
    //     setSearchQuery("");
    // };

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <section className="text-gray-600 body-font relative">
            <HomePageNavBar />

            <div className="container-fluid py-0 mr-0 ml-0 mt-0 w-full flex flex-col relative">
                <div className="w-full mr-0 ml-0">
                    <div className="h-[40rem] lg:h-full overflow-hidden px-0 py-0 relative">
                        <div className="relative h-[40rem]">
                            <img
                                alt="ecommerce"
                                className="object-cover object-center h-full w-full"
                                src={process.env.REACT_APP_BUCKET_HOST + "admin/Homepage.jpg"}
                                loading="lazy"
                            />
                            <div className="absolute inset-0 flex flex-col gap-4 items-center justify-center bg-gray-800 bg-opacity-75 text-white z--1">
                                <div className="flex flex-col xl:flex-row md:items-center justify-between gap-4 mt-4 px-5 md:px-10 lg:px-[10rem] 2xl:px-[20rem]">
                                    <h1
                                        className="font-sans mb-8 lg:mb-12 text-4xl md:text-5xl lg:text-5xl font-bold tracking-wide"
                                        style={{ fontFamily: "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif" }}
                                    >
                                        {t("homePageHeading")}
                                    </h1>

                                    <div className="mb-8 lg:mb-12 w-full">
                                        <SearchBar onSearch={handleSearch} searchQuery={searchQuery} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <LoadingPage />
            ) : (
                <>
                    <div
                        className="text-gray-900 px-5 md:px-10 lg:px-[5rem] xl:px-[10rem] 2xl:px-[20rem] py-6 text-xl md:text-3xl mt-10 lg:text-3xl title-font text-start font-sans font-bold flex justify-between items-center"
                        style={{ fontFamily: "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif" }}
                    >
                        {categoryId ? (
                            <h2>{t(categories[categoryId])}</h2>
                        ) : (
                            <h2>{t("allCategories")}</h2>
                        )}
                    </div>

                    {listings && listings.length > 0 ? (
                        <div className="bg-white px-5 md:px-10 lg:px-[5rem] xl:px-[10rem] 2xl:px-[20rem] py-6 mt-0 mb-0 space-y-10 flex flex-col">
                            <div className="columns-1 md:columns-2 gap-4">
                                {listings &&
                                    listings.map((listing, index) => (
                                        <div
                                            key={index}
                                            className={`break-inside-avoid ${index % 2 === 1 ? "mt-6" : ""}`}
                                        >
                                            <TroisdorfTerminalListingsCard listing={listing} isTerminalScreenEnabled={isTerminalScreenEnabled} key={index} />
                                        </div>
                                    ))}
                            </div>

                            <button
                                className="mt-10 px-6 py-3 bg-gray-700 w-80 text-white rounded-full hover:scale-105 transition mx-auto"
                                onClick={() => {
                                    if (!isTerminalScreenEnabled) {
                                        localStorage.setItem("selectedItem", t("chooseOneCategory"));
                                    }
                                    const url = "/AllListings?terminalView=true";
                                    navigateTo(url);
                                }}
                                style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                                {t("viewMore")}
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center min-h-[40vh] px-6">
                            <h2 className="mb-6 text-4xl font-bold">
                                {t("currently_no_listings")}
                            </h2>
                            <p className="text-lg text-gray-600">
                                {t("selectOtherCityorCategory")}
                            </p>
                            <button
                                onClick={navigateTo(`/`)}
                                className="mt-10 px-6 py-3 bg-gray-700 text-white rounded-full hover:scale-105 transition"
                            >
                                {t("goBack")}
                            </button>
                        </div>
                    )}
                </>
            )}

        </section>
    );
};

export default HomePage;