import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar";
import SellerStatistics from "../../Components/SellerStatistics";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getOrdersSold } from "../../Services/containerApi";
import "flatpickr/dist/themes/material_blue.css";

const OrdersSold = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const { orderStartDate, orderEndDate, selectedPeriod } = location.state || {};

    const [ordersSold, setOrdersSold] = useState([]);
    const [ordersSoldCount, setOrdersSoldCount] = useState(0);
    const [pageNumber, setPageNo] = useState(1);
    const [errorMessage, setErrorMessage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProductName, setSelectedProductName] = useState("");

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

    const handleProductNameClick = (description) => {
        setSelectedProductName(description);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProductName("");
    };

    if (errorMessage) {
        return <div className="text-red-500 text-center">{errorMessage}</div>;
    }

    return (
        <section className="bg-gray-900 body-font relative min-h-screen">
            <SideBar />
            <div className="container w-auto px-5 py-2 bg-gray-900 min-h-screen flex flex-col">
                <div className="h-full">
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
                            <table className="w-full text-sm text-left text-gray-500 rounded-lg">
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
                                            <td
                                                className="px-6 py-4 text-center font-bold text-gray-500 truncate cursor-pointer"
                                                style={{ fontFamily: "Poppins, sans-serif", maxWidth: "200px" }}
                                                onClick={() => handleProductNameClick(item.productName)}
                                            >
                                                {item.productName}
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-blue-600">{item.totalQuantity}</td>
                                            <td className="px-6 py-4 text-center font-bold text-red-600">€ {item.pricePerQuantity}</td>
                                            <td className="px-6 py-4 text-center font-bold text-green-600">€ {item.totalPrice}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {isModalOpen && (
                        <div
                            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
                            onClick={closeModal}
                        >
                            <div
                                className="relative bg-white rounded-lg shadow-lg transform transition-all sm:max-w-lg w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="px-6 py-4">
                                    <h3 className="text-lg leading-6 font-medium text-slate-800 text-center">
                                        {t("productDetails")}
                                    </h3>
                                    <div className="mt-4">
                                        <p className="text-sm text-gray-500 text-center break-words">
                                            {selectedProductName}
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 flex justify-end">
                                    <button
                                        className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
                                        onClick={closeModal}
                                    >
                                        {t("close")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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
