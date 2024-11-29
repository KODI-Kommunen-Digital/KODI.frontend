import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar";
import "../../index.css";
import { useTranslation } from "react-i18next";
import { getUserRoleContainer } from "../../Services/containerApi";

const OwnerScreen = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    const [isOwner, setIsOwner] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const accessToken =
                    window.localStorage.getItem("accessToken") ||
                    window.sessionStorage.getItem("accessToken");
                const refreshToken =
                    window.localStorage.getItem("refreshToken") ||
                    window.sessionStorage.getItem("refreshToken");

                if (!accessToken && !refreshToken) {
                    navigate("/login");
                    return;
                }

                const roleResponse = await getUserRoleContainer();
                let roles = roleResponse.data.data;
                roles = roles.map(Number);

                if (roles.includes(101)) {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }
            } catch (error) {
                console.error("Error fetching user roles:", error);
                navigate("/Error");
            }
        };

        fetchUserRole();
    }, [navigate]);

    useEffect(() => {
        if (isOwner === false) {
            navigate("/Error");
        }
    }, [isOwner, navigate]);


    return (
        <section className="bg-gray-900 body-font relative h-screen">
            <SideBar />
            <div className="container w-auto px-5 py-5 bg-gray-900 min-h-screen flex flex-col justify-center items-center">
                <div className="h-full">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
                        {/* Store Details */}
                        <div className="p-4 w-full">
                            <div className="h-full bg-gray-800 shadow-lg px-8 py-16 rounded-lg overflow-hidden text-center relative border border-gray-700">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">
                                    {t("storeDetails")}
                                </h2>
                                <h1 className="title-font sm:text-2xl text-xl font-medium text-white mb-4">
                                    {t("stores")}
                                </h1>
                                <p className="leading-relaxed text-gray-300 mb-4">
                                    {t("goToStoreDetails")}
                                </p>
                                <a
                                    onClick={() => {
                                        navigateTo("/OwnerScreen/StoreDetails");
                                    }}
                                    className={`relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out bg-indigo-700 border-2 border-indigo-600 rounded-full shadow-md group cursor-pointer`}
                                >
                                    <span
                                        className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-700 group-hover:translate-x-0 ease`}
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span
                                        className={`absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease`}
                                    >
                                        {t("clickHereToFind")}
                                    </span>
                                    <span className="relative invisible">{t("clickHereToFind")}</span>
                                </a>
                            </div>
                        </div>

                        {/* Create Shelves */}
                        <div className="p-4 w-full">
                            <div className="h-full bg-gray-800 shadow-lg px-8 py-16 rounded-lg overflow-hidden text-center relative border border-gray-700">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">
                                    {t("create")}
                                </h2>
                                <h1 className="title-font sm:text-2xl text-xl font-medium text-white mb-4">
                                    {t("createShelves")}
                                </h1>
                                <p className="leading-relaxed text-gray-300 mb-4">
                                    {t("createNewShelves")}
                                </p>
                                <a
                                    onClick={() => {
                                        navigateTo("/OwnerScreen/CreateShelves");
                                    }}
                                    className={`relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out bg-indigo-700 border-2 border-indigo-600 rounded-full shadow-md group cursor-pointer`}
                                >
                                    <span
                                        className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-700 group-hover:translate-x-0 ease`}
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span
                                        className={`absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease`}
                                    >
                                        {t("clickHereToFind")}
                                    </span>
                                    <span className="relative invisible">{t("clickHereToFind")}</span>
                                </a>
                            </div>
                        </div>

                        {/* Seller Requests */}
                        <div className="p-4 w-full">
                            <div className="h-full bg-gray-800 shadow-lg px-8 py-16 rounded-lg overflow-hidden text-center relative border border-gray-700">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">
                                    {t("requests")}
                                </h2>
                                <h1 className="title-font sm:text-2xl text-xl font-medium text-white mb-4">
                                    {t("sellerRequests")}
                                </h1>
                                <p className="leading-relaxed text-gray-300 mb-4">
                                    {t("seeAllRequestsHere")}
                                </p>
                                <a
                                    onClick={() => {
                                        navigateTo("/OwnerScreen/SellerRequestsApproval");
                                    }}
                                    className={`relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out bg-indigo-700 border-2 border-indigo-600 rounded-full shadow-md group cursor-pointer`}
                                >
                                    <span
                                        className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-700 group-hover:translate-x-0 ease`}
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span
                                        className={`absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease`}
                                    >
                                        {t("clickHereToFind")}
                                    </span>
                                    <span className="relative invisible">{t("clickHereToFind")}</span>
                                </a>
                            </div>
                        </div>

                        {/* Categories and Subcategories */}
                        <div className="p-4 w-full">
                            <div className="h-full bg-gray-800 shadow-lg px-8 py-16 rounded-lg overflow-hidden text-center relative border border-gray-700">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">
                                    {t("list")}
                                </h2>
                                <h1 className="title-font sm:text-2xl text-xl font-medium text-white mb-4">
                                    {t("categoriesAndSubcategories")}
                                </h1>
                                <p className="leading-relaxed text-gray-300 mb-4">
                                    {t("categoriesAndSubcategoriesHere")}
                                </p>
                                <a
                                    onClick={() => {
                                        navigateTo("/OwnerScreen/ViewCategories");
                                    }}
                                    className={`relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out bg-indigo-700 border-2 border-indigo-600 rounded-full shadow-md group cursor-pointer`}
                                >
                                    <span
                                        className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-indigo-700 group-hover:translate-x-0 ease`}
                                    >
                                        <svg
                                            className="w-6 h-6"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span
                                        className={`absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease`}
                                    >
                                        {t("clickHereToFind")}
                                    </span>
                                    <span className="relative invisible">{t("clickHereToFind")}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OwnerScreen;