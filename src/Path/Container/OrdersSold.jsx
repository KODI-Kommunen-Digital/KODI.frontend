import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar";
import SellerStatistics from "../../Components/SellerStatistics";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getOrdersSold } from "../../Services/containerApi";
import "flatpickr/dist/themes/material_blue.css";

const OrdersSold = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { orderStartDate, orderEndDate, selectedPeriod } = location.state || {};

    const [ordersSold, setOrdersSold] = useState([]);
    const [ordersSoldCount, setOrdersSoldCount] = useState(0);
    const [pageNumber, setPageNo] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const pageSize = 9;

    const totalRevenue = ordersSold.reduce((total, product) => total + (product.totalPrice || 0), 0);
    const totalQuantitySold = ordersSold.reduce((total, product) => total + (parseInt(product.totalQuantity, 10) || 0), 0);
    const totalProducts = ordersSold.length;
    const averagePricePerQuantity = (
        ordersSold.reduce((total, product) => total + (product.pricePerQuantity || 0), 0) / (totalProducts || 1)
    ).toFixed(2);

    let topProductNameByQuantity = "";
    let maxQuantity = -1;

    ordersSold.forEach((product) => {
        const quantity = product.totalQuantity || 0;
        if (quantity > maxQuantity) {
            maxQuantity = quantity;
            topProductNameByQuantity = product.productName;
        }
    });

    const fetchOrdersSold = useCallback(() => {
        if (orderStartDate && orderEndDate) {
            getOrdersSold({
                orderStartDate,
                orderEndDate,
                pageNumber,
                pageSize,
            })
                .then((response) => {
                    if (response.data.status === "error") {
                        setErrorMessage(t("selectAnotherDate"));
                    } else {
                        setOrdersSold(response.data.data);
                        setOrdersSoldCount(response.data.count);
                    }
                })
                .catch((error) => {
                    setErrorMessage(error.message || t("selectAnotherDate"));
                });
        }
    }, [orderStartDate, orderEndDate, pageNumber, pageSize, t]);

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
        if (orderStartDate && orderEndDate) {
            fetchOrdersSold();
        }
    }, [orderStartDate, orderEndDate, fetchOrdersSold, navigate]);

    if (errorMessage) {
        return <div className="text-red-500 text-center">{errorMessage}</div>;
    }

    return (
        <section className="bg-gray-800 body-font relative min-h-screen">
            <SideBar />
            <div className="container w-auto px-2 py-2 bg-gray-800 min-h-screen flex flex-col">
                <div className="h-full">
                    <div>
                        <SellerStatistics
                            totalRevenue={totalRevenue}
                            topProductNameByQuantity={topProductNameByQuantity}
                            totalQuantitySold={totalQuantitySold}
                            averagePricePerQuantity={averagePricePerQuantity}
                        />
                        <div className="bg-white mt-4 p-0">
                            <h2 className="text-xl font-semibold text-gray-800 text-center px-5 py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                                {t("ordersSold")}
                            </h2>
                            {selectedPeriod && (
                                <p className="text-center text-gray-600 italic">
                                    {t("selectedPeriod")}: <span className="font-bold">{t(selectedPeriod)}</span>
                                </p>
                            )}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-gray-500 p-6 space-y-10 rounded-lg">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-center">{t("productName")}</th>
                                            <th className="px-6 py-4 text-center">{t("stockSold")}</th>
                                            <th className="px-6 py-4 text-center">{t("price")}</th>
                                            <th className="px-6 py-4 text-center">{t("totalIncome")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordersSold.map((item, index) => (
                                            <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 text-center text-gray-500 font-bold truncate">{item.productName}</td>
                                                <td className="px-6 py-4 text-center font-bold text-blue-600">{item.totalQuantity}</td>
                                                <td className="px-6 py-4 text-center font-bold text-red-600">€ {item.pricePerQuantity}</td>
                                                <td className="px-6 py-4 text-center font-bold text-green-600">€ {item.totalPrice}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <center className="mt-6">
                        <a
                            onClick={() => navigate("/SellerScreen/PeriodSelection")}
                            className="relative inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-black transition duration-300 ease-out bg-indigo-700 border-2 border-indigo-600 rounded-full shadow-md group cursor-pointer"
                        >
                            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 translate-x-full bg-indigo-700 group-hover:-translate-x-0 ease">
                                <svg
                                    className="w-6 h-6 transform rotate-180"
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
                            <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:-translate-x-full ease">
                                {t("goBack")}
                            </span>
                            <span className="relative invisible">{t("goBack")}</span>
                        </a>
                    </center>

                    <div className="bottom-5 right-5 mt-4 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
                        {pageNumber > 1 && (
                            <span
                                className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50 cursor-pointer"
                                onClick={() => setPageNo(pageNumber - 1)}
                            >
                                {"<"}
                            </span>
                        )}
                        <span className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50">
                            {t("page")} {pageNumber}
                        </span>
                        {ordersSold.length >= pageSize && pageNumber * pageSize < ordersSoldCount && (
                            <span
                                className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50 cursor-pointer"
                                onClick={() => setPageNo(pageNumber + 1)}
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

export default OrdersSold;