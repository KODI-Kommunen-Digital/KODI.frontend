import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useNavigate, useLocation } from "react-router-dom";
import LISTINGSIMAGE from "../../assets/ListingsImage.jpeg";
import { useTranslation } from "react-i18next";
import { getAllForums, getUserForumsMembers } from "../../Services/forumsApi";
import { getCities } from "../../Services/cities";
import Footer from "../../Components/Footer";

const Forums = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [cityId, setCityId] = useState(1);
    const [cities, setCities] = useState([]);
    const [cityName, setCityName] = useState("");
    const [listings, setListings] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [membersCount, setMembersCount] = useState();
    const [isMember, setIsMember] = useState(false);
    const [requestPending, setRequestPending] = useState(false);

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
        getCities().then((citiesResponse) => {
            setCities(citiesResponse.data.data);
            const cityIdParam = urlParams.get("cityId");
            if (cityIdParam) setCityId(cityIdParam);

        });
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const params = { pageNo, pageSize: 9, statusId: 1 };
        if (parseInt(cityId)) {
            setCityName(cities.find((c) => parseInt(cityId) === c.id)?.name);
            console.log(cities, cityId);
            urlParams.set("cityId", cityId);
            params.cityId = cityId;
        } else {
            setCityName(t("allCities"));
            urlParams.delete("cityId");
        }
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
        getAllForums(cityId).then((response) => {
            const data = response.data.data;
            setListings(data);
        });
    }, [cities, cityId, pageNo, t]);
    const checkIfMember = (cityId, forumId) => {
        if (isLoggedIn) {
            getUserForumsMembers(cityId, forumId).then((response) => {
                const data = response.data.data;
                console.log(data)
                setIsMember(true);
                setMembersCount(data.length)
            });
        }
    }
    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

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

    return (
        <section className="text-gray-600 body-font relative">
            {showNavBar && <HomePageNavBar />}
            <div
                className={`container-fluid py-0 mr-0 ml-0 w-full flex flex-col ${mtClass}`}
            >
                <div className="w-full mr-0 ml-0">
                    <div className={`lg:h-64 md:h-64 h-72 overflow-hidden ${pyClass}`}>
                        <div className="relative lg:h-64 md:h-64 h-72">
                            <img
                                alt="ecommerce"
                                className="object-cover object-center h-full w-full"
                                src={process.env.REACT_APP_BUCKET_HOST + "admin/Homepage.jpg"}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
                                <div>
                                    <div className="relative w-full px-4 mb-4 md:w-80">
                                        <select
                                            id="city"
                                            name="city"
                                            autoComplete="city-name"
                                            onChange={(e) => {
                                                const selectedCityId = e.target.value;
                                                const urlParams = new URLSearchParams(
                                                    window.location.search
                                                );
                                                const selectedCity = cities.find(
                                                    (city) => city.id.toString() === selectedCityId
                                                );
                                                if (selectedCity) {
                                                    localStorage.setItem("selectedCity", selectedCity.name);
                                                    window.location.href = `/?cityId=${selectedCityId}`;
                                                } else {
                                                    localStorage.setItem("selectedCity", t("allCities"));
                                                    urlParams.delete("cityId");
                                                    setCityId(0);
                                                }
                                            }}
                                            value={cityId || 0}
                                            className="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                            style={{
                                                fontFamily: "Poppins, sans-serif",
                                            }}
                                        >
                                            <option className="font-sans" value={0} key={0}>
                                                {t("allCities")}
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
                                </div>
                            </div>
                        </div>
                        <div className="relative w-full px-4 mb-4 md:w-80">
                            <select
                                id="city"
                                name="city"
                                autoComplete="city-name"
                                onChange={(e) => {
                                    const selectedCityId = e.target.value;
                                    const urlParams = new URLSearchParams(
                                        window.location.search
                                    );
                                    const selectedCity = cities.find(
                                        (city) => city.id.toString() === selectedCityId
                                    );
                                    if (selectedCity) {
                                        localStorage.setItem("selectedCity", selectedCity.name);
                                        window.location.href = `/?cityId=${selectedCityId}`;
                                    } else {
                                        localStorage.setItem("selectedCity", t("allCities"));
                                        urlParams.delete("cityId");
                                        setCityId(0);
                                    }
                                }}
                                value={cityId || 0}
                                className="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                style={{
                                    fontFamily: "Poppins, sans-serif",
                                }}
                            >
                                <option className="font-sans" value={0} key={0}>
                                    {t("allCities")}
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
                    </div>
                </div>
            </div>

            <div className="mt-5 mb-20 p-6">
                <div>
                    {listings && listings.length > 0 ? (
                        <div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
                            {/* <div className="relative place-items-center bg-white mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-10 justify-start">
                                {listings &&
                                    listings.map((listing) => (
                                        <div
                                            key={listing.id}
                                            onClick={() => {
                                                let url = `/cities/${1}/forums/${listing.id}`;
                                                if (terminalViewParam === "true") {
                                                    url += "&terminalView=true";
                                                }
                                                navigateTo(url);
                                            }}
                                            className="w-full h-full shadow-lg rounded-lg cursor-pointer"
                                        >
                                            <a className="block relative h-64 rounded overflow-hidden">
                                                <img
                                                    alt="ecommerce"
                                                    className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000"
                                                    src={
                                                        listing.image
                                                            ? process.env.REACT_APP_BUCKET_HOST + listing.image
                                                            : LISTINGSIMAGE
                                                    }
                                                />
                                            </a>
                                            <div className="mt-5 px-2">
                                                <div
                                                    className="flex justify-between items-center"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    <h2 className="text-gray-900 title-font text-lg font-bold font-sans truncate">
                                                        {listing.forumName}
                                                    </h2>
                                                    {listing.isPrivate === 0 ? (
                                                        <h2 className="text-gray-900 title-font text-lg font-bold font-sans truncate">
                                                            Public
                                                        </h2>
                                                    ) : (
                                                        checkIfMember(cityId, listing.id) && isMember ? (
                                                            <button>Request Access</button>
                                                        ) : (
                                                            <h2 className="text-gray-900 title-font text-lg font-bold font-sans truncate">
                                                                Private
                                                            </h2>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                            <div className="my-4 bg-gray-200 h-[1px]"></div>
                                        </div>
                                    ))}
                            </div> */}
                            <div className="relative place-items-center bg-white mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-10 justify-start">
                                {listings &&
                                    listings.map((listing) => (
                                        <div
                                            key={listing.id}
                                            onClick={() => {
                                                let url = `/cities/${1}/forums/${listing.id}`;
                                                if (terminalViewParam === "true") {
                                                    url += "&terminalView=true";
                                                }
                                                navigateTo(url);
                                            }}
                                            className="w-full h-full shadow-lg rounded-lg cursor-pointer"
                                        >
                                            <a className="block relative h-64 rounded overflow-hidden">
                                                {!isMember ? (
                                                    listing.isPrivate ? (
                                                        <>
                                                            <img
                                                                alt="ecommerce"
                                                                className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000 filter blur"
                                                                src={
                                                                    listing.image
                                                                        ? process.env.REACT_APP_BUCKET_HOST + listing.image
                                                                        : LISTINGSIMAGE
                                                                }
                                                            />
                                                            {!requestPending && (
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <p className="text-Black font-bold text-lg">Make a Request</p>
                                                                </div>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <img
                                                                alt="ecommerce"
                                                                className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000 filter blur"
                                                                src={
                                                                    listing.image
                                                                        ? process.env.REACT_APP_BUCKET_HOST + listing.image
                                                                        : LISTINGSIMAGE
                                                                }
                                                            />

                                                            <div className="absolute inset-0 flex items-center justify-center">
                                                                <p className="text-Black font-bold text-lg">Join the Group</p>
                                                            </div>

                                                        </>
                                                    )
                                                ) : (
                                                    <>
                                                        <img
                                                            alt="ecommerce"
                                                            className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000"
                                                            src={
                                                                listing.image
                                                                    ? process.env.REACT_APP_BUCKET_HOST + listing.image
                                                                    : LISTINGSIMAGE
                                                            }
                                                        />
                                                    </>
                                                )
                                                }
                                            </a>
                                            <div className="mt-5 px-2">
                                                <div
                                                    className="flex justify-between items-center"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    <h2 className="text-gray-900 title-font text-lg font-bold font-sans truncate">
                                                        {listing.forumName}
                                                    </h2>
                                                    {listing.isPrivate === 0 ? (
                                                        <h2 className="text-gray-900 title-font text-lg font-bold font-sans truncate">
                                                            Public
                                                        </h2>
                                                    ) : (
                                                        checkIfMember(cityId, listing.id) && isMember ? (
                                                            <button onClick={() => setRequestPending(true)}>
                                                                Request Access
                                                            </button>
                                                        ) : (
                                                            <h2 className="text-gray-900 title-font text-lg font-bold font-sans truncate">
                                                                Private
                                                            </h2>
                                                        )
                                                    )}
                                                </div>
                                                <div className="flex justify-between items-center"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}>
                                                    <h2 className="text-gray-500 title-font text-lg font-sans truncate">
                                                        <p> City:{cityName}</p>
                                                    </h2>
                                                    <h2 className="text-gray-500 title-font text-lg  font-sans truncate">
                                                        <p> Members: {membersCount}</p>
                                                    </h2>
                                                </div>
                                            </div>
                                            <div className="my-4 bg-gray-200 h-[1px]"></div>
                                        </div>
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
                                    className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-black"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                    onClick={() => {
                                        localStorage.setItem("selectedItem", "Choose one category");
                                        isLoggedIn
                                            ? navigateTo("/CreateGroup")
                                            : navigateTo("/login");
                                    }}
                                >
                                    {t("click_here")}
                                </a>
                            </div>
                        </div>
                    )}
                </div>
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
                    {listings.length >= 9 && (
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

export default Forums;