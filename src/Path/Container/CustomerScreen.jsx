import React from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar";
import "../../index.css";
import { useTranslation } from "react-i18next";
import RegionColors from "../../Components/RegionColors";

const CustomerScreen = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <section className="bg-gray-300 body-font relative h-screen">
            <SideBar />
            <div className="container w-auto px-5 py-2 bg-gray-300 min-h-screen flex flex-col justify-center items-center">
                <div className="h-full">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 -m-4">
                        <div className="p-4 w-full">
                            <div className="h-full bg-white shadow-md bg-opacity-75 px-8 py-16 rounded-lg overflow-hidden text-center relative">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">{t("orders")}</h2>
                                <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-4">{t("yourOrders")}</h1>
                                <p className="leading-relaxed mb-4">{t("viewYourOrder")}</p>
                                <a onClick={() => {
                                    navigateTo("/CustomerScreen/MyOrders");
                                }}
                                    className={`relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 ${RegionColors.darkBorderColor} rounded-full shadow-md group cursor-pointer`}>
                                    <span className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full ${RegionColors.darkBgColor} group-hover:translate-x-0 ease`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                    <span className={`absolute flex items-center justify-center w-full h-full ${RegionColors.darkTextColor} transition-all duration-300 transform group-hover:translate-x-full ease`}>{t("clickHereToFind")}</span>
                                    <span className="relative invisible">{t("clickHereToFind")}</span>
                                </a>
                                <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                                    <span className="text-gray-400 inline-flex items-center leading-none text-sm py-1">
                                        <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>1.2K {t("orders")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 w-full">
                            <div className="h-full bg-white shadow-md bg-opacity-75 px-8 py-16 rounded-lg overflow-hidden text-center relative">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">{t("cart")}</h2>
                                <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-4">{t("shoppingCart")}</h1>
                                <p className="leading-relaxed mb-4">{t("seeShoppingCart")}</p>
                                <a onClick={() => {
                                    navigateTo("/CustomerScreen/ShoppingCart");
                                }}
                                    className={`relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 ${RegionColors.darkBorderColor} rounded-full shadow-md group cursor-pointer`}>
                                    <span className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full ${RegionColors.darkBgColor} group-hover:translate-x-0 ease`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                    <span className={`absolute flex items-center justify-center w-full h-full ${RegionColors.darkTextColor} transition-all duration-300 transform group-hover:translate-x-full ease`}>{t("clickHereToFind")}</span>
                                    <span className="relative invisible">{t("clickHereToFind")}</span>
                                </a>
                                <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                                    <span className="text-gray-400 inline-flex items-center leading-none text-sm py-1">
                                        <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>1.2K {t("requests")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 w-full">
                            <div className="h-full bg-white shadow-md bg-opacity-75 px-8 py-16 rounded-lg overflow-hidden text-center relative">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">{t("payments")}</h2>
                                <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-4">{t("paymentStatus")}</h1>
                                <p className="leading-relaxed mb-4">{t("seeAllApymentStatus")}</p>
                                <a onClick={() => {
                                    navigateTo("/SellerScreen/OrdersSold");
                                }}
                                    className={`relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 ${RegionColors.darkBorderColor} rounded-full shadow-md group cursor-pointer`}>
                                    <span className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full ${RegionColors.darkBgColor} group-hover:translate-x-0 ease`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                    <span className={`absolute flex items-center justify-center w-full h-full ${RegionColors.darkTextColor} transition-all duration-300 transform group-hover:translate-x-full ease`}>{t("clickHereToFind")}</span>
                                    <span className="relative invisible">{t("clickHereToFind")}</span>
                                </a>
                                <div className="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                                    <span className="text-gray-400 inline-flex items-center leading-none text-sm py-1">
                                        <svg className="w-4 h-4 mr-1" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                            <circle cx="12" cy="12" r="3"></circle>
                                        </svg>1.2K {t("requests")}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 w-full">
                            <div className="h-full bg-white shadow-md bg-opacity-75 px-8 py-16 rounded-lg overflow-hidden text-center relative">
                                <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-2">{t("card")}</h2>
                                <h1 className="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-4">{t("applyCard")}</h1>
                                <p className="leading-relaxed mb-4">{t("applyForCard")}</p>
                                <a onClick={() => {
                                    navigateTo("/SellerScreen/AddNewProducts");
                                }}
                                    className={`relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 ${RegionColors.darkBorderColor} rounded-full shadow-md group cursor-pointer`}>
                                    <span className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full ${RegionColors.darkBgColor} group-hover:translate-x-0 ease`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                    <span className={`absolute flex items-center justify-center w-full h-full ${RegionColors.darkTextColor} transition-all duration-300 transform group-hover:translate-x-full ease`}>{t("clickHereToFind")}</span>
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

export default CustomerScreen;