import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';
import ListingsCard from "../../Components/ListingsCard";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getListings } from "../../Services/listingsApi";
import { getCities } from "../../Services/cities";
import LoadingPage from "../../Components/LoadingPage";
import { getCategory } from "../../Services/CategoryApi";
import './HeidiListings.css'
import { hiddenCategories } from "../../Constants/hiddenCategories";
import RegionColors from "../../Components/RegionColors";

const IFrame = ({ cityId }) => {
    const navigate = useNavigate();
    const location = useLocation();

    window.scrollTo(0, 0);
    const pageSize = 8;
    const iFrame = true;
    const { t } = useTranslation();
    const [categoryId, setCategoryId] = useState(0);
    const [listings, setListings] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [, setCategories] = useState([]);

    const fetchData = async (params) => {
        params.showExternalListings = "false";
        params.cityId = cityId;
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
            const catList = {};
            response[1]?.data.data
                .filter(cat => !hiddenCategories.hiddenCategories.includes(cat.id))
                .forEach((cat) => {
                    catList[cat.id] = cat.name;
                });
            setCategories(catList);
            const params = { pageSize, statusId: 1 };
            const pageNoParam = parseInt(urlParams.get("pageNo"));
            if (pageNoParam > 1) {
                params.pageNo = pageNoParam;
                urlParams.set("pageNo", pageNo);
                setPageNo(pageNoParam);
            } else {
                urlParams.delete("pageNo");
            }
            const categoryIdParam = urlParams.get("categoryId");
            if (categoryIdParam) {
                const categoryId = parseInt(categoryIdParam);
                if (catList[categoryId]) {
                    setCategoryId(categoryId);
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
            if (parseInt(categoryId)) {
                params.categoryId = parseInt(categoryId);
                urlParams.set("categoryId", parseInt(categoryId));
            } else {
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
    }, [categoryId, pageNo]);

    if (isLoading) return <div><LoadingPage /></div>;
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    const handleOfficialNotificationButton = () => {
        setCategoryId(16)
        navigateTo("/AllListings?terminalView=true&categoryId=16")
    };


    const searchParams = new URLSearchParams(location.search);
    const terminalViewParam = searchParams.get("terminalView");

    return (
        <section className="text-gray-600 body-font relative custom-scroll">
            <div className="mt-2 mb-2 customproview py-0">
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
                            <div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-0 mt-0 mb-0 space-y-10 flex flex-col">
                                <div className="relative place-items-center bg-white mt-0 mb-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-10 justify-start">
                                    {listings &&
                                        listings.map((listing, index) => (
                                            <ListingsCard
                                                listing={listing}
                                                terminalView={terminalViewParam}
                                                iFrame={iFrame}
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
                <div className="mt-2 mb-2 w-fit mx-auto text-center text-white whitespace-nowrap rounded-md border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer">
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
        </section>
    );
};

IFrame.propTypes = {
    cityId: PropTypes.string.isRequired,
};

export default IFrame;