import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar";
import "../../index.css";
import { useTranslation } from "react-i18next";

const SellerScreen = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();

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
        if (!accessToken && !refreshToken) {
            navigate("/login");
        }
    }, []);

    return (
        <section className="bg-gray-900 body-font relative h-screen">
            <SideBar />
            <div className="container w-auto px-5 py-5 bg-gray-900 min-h-screen flex flex-col justify-center items-center">
                <div className="h-full">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-6">
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
                                        navigateTo("/SellerScreen/SellerRequests");
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

                        <div className="p-4 w-full">
                            <div className="h-full bg-gray-800 shadow-lg px-8 py-16 rounded-lg overflow-hidden text-center relative border border-gray-700">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">
                                    {t("orders")}
                                </h2>
                                <h1 className="title-font sm:text-2xl text-xl font-medium text-white mb-4">
                                    {t("ordersSold")}
                                </h1>
                                <p className="leading-relaxed text-gray-300 mb-4">
                                    {t("seeAllOrdersSoldHere")}
                                </p>
                                <a
                                    onClick={() => {
                                        navigateTo("/SellerScreen/OrdersSold");
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

                        <div className="p-4 w-full">
                            <div className="h-full bg-gray-800 shadow-lg px-8 py-16 rounded-lg overflow-hidden text-center relative border border-gray-700">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">
                                    {t("create")}
                                </h2>
                                <h1 className="title-font sm:text-2xl text-xl font-medium text-white mb-4">
                                    {t("addNewProduct")}
                                </h1>
                                <p className="leading-relaxed text-gray-300 mb-4">
                                    {t("addNewProductHere")}
                                </p>
                                <a
                                    onClick={() => {
                                        navigateTo("/SellerScreen/AddNewProducts");
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

                        <div className="p-4 w-full">
                            <div className="h-full bg-gray-800 shadow-lg px-8 py-16 rounded-lg overflow-hidden text-center relative border border-gray-700">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">
                                    {t("view")}
                                </h2>
                                <h1 className="title-font sm:text-2xl text-xl font-medium text-white mb-4">
                                    {t("seeAllProducts")}
                                </h1>
                                <p className="leading-relaxed text-gray-300 mb-4">
                                    {t("seeAllProductHere")}
                                </p>
                                <a
                                    onClick={() => {
                                        navigateTo("/SellerScreen/AllProducts");
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

export default SellerScreen;