import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../../index.css";
import { getPaymentDetails, getCards } from "../../Services/containerApi";

const PaymentStatus = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [paymentStatus, setPaymentStatus] = useState([]);
    const [pageNumber, setPageNo] = useState(1);
    const pageSize = 9;

    const [cardId, setCardId] = useState(0);
    const [cards, setCards] = useState([]);

    const handleCardChange = async (event) => {
        const cardId = event.target.value;
        setCardId(cardId);
        setPageNo(1);

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("cardId", cardId);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
    };

    const handleCardClick = (cardId) => {
        setCardId(cardId);
        setPageNo(1);

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("cardId", cardId);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
    };

    const fetchCards = useCallback(() => {
        getCards().then((response) => {
            setCards(response.data.data);
        });
    }, []);

    useEffect(() => {
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

        fetchCards();
    }, [fetchCards]);

    const fetchPaymentStatus = useCallback((cardId) => {
        if (cardId) {
            getPaymentDetails(cardId, {
                params: {
                    pageNumber,
                    pageSize,
                },
            }).then((response) => {
                const status = response.data.data;
                setPaymentStatus(status);
            });
        }
    }, [pageNumber, pageSize]);

    useEffect(() => {
        if (cardId) {
            fetchPaymentStatus(cardId);
        }
    }, [fetchPaymentStatus, cardId, pageNumber]);

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <section className="bg-gray-900 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto px-5 py-2 bg-gray-900 min-h-screen flex flex-col">
                <div className="h-full">

                    {cardId && paymentStatus && paymentStatus.length > 0 ? (
                        <>
                            <div className="flex justify-center px-5 py-2 gap-2 w-full md:w-auto fixed lg:w-auto relative">
                                <div className="col-span-6 sm:col-span-1 mt-4 mb-1 px-0 mr-0 w-full md:w-80">
                                    <select
                                        id="cards"
                                        name="cards"
                                        autoComplete="cards"
                                        onChange={handleCardChange}
                                        value={cardId || 0}
                                        className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full text-gray-600"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                        }}
                                    >
                                        <option className="font-sans" value={0} key={0}>
                                            {t("select", {
                                                regionName: process.env.REACT_APP_REGION_NAME,
                                            })}
                                        </option>
                                        {cards.map((card) => (
                                            <option className="font-sans" value={card.id} key={card.id}>
                                                {card.id}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white mt-4 p-0">
                                <h2 className="text-xl font-semibold text-gray-800 text-center px-5 py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                                    {t("paymentStatus")}
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left  text-gray-500 p-6 space-y-10 rounded-lg">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-center"
                                                    style={{
                                                        fontFamily: "Poppins, sans-serif",
                                                        width: "33.33%",
                                                    }}
                                                >
                                                    {t("transactionId")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-center"
                                                    style={{
                                                        fontFamily: "Poppins, sans-serif",
                                                        width: "33.33%",
                                                    }}
                                                >
                                                    {t("amount")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-center "
                                                    style={{
                                                        fontFamily: "Poppins, sans-serif",
                                                        width: "33.33%",
                                                    }}
                                                >
                                                    {t("orderDate")}
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {paymentStatus.map((payment, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        className="bg-white border-b hover:bg-gray-50"
                                                    >
                                                        <td
                                                            className="px-6 py-4 text-center font-bold"
                                                            style={{ fontFamily: "Poppins, sans-serif" }}
                                                        >
                                                            {payment.id}
                                                        </td>

                                                        <td
                                                            className="px-6 py-4 text-center font-bold"
                                                            style={{ fontFamily: "Poppins, sans-serif" }}
                                                        >
                                                            € {payment.amount}
                                                        </td>

                                                        <td
                                                            className="px-6 py-4 text-center font-bold text-blue-600"
                                                            style={{ fontFamily: "Poppins, sans-serif" }}
                                                        >
                                                            {new Date(payment.createdAt).toLocaleDateString()}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
                                {pageNumber !== 1 ? (
                                    <span
                                        className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                                        onClick={() => setPageNo(pageNumber - 1)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {"<"}{" "}
                                    </span>
                                ) : (
                                    <span />
                                )}
                                <span
                                    className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    {t("page")} {pageNumber}
                                </span>

                                {paymentStatus.length >= pageSize && (
                                    <span
                                        className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                                        onClick={() => setPageNo(pageNumber + 1)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {">"}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bg-gray-800 mt-0 min-h-[30rem] px-5 py-2 flex flex-col justify-center items-center">
                            <div className="flex justify-center px-5 py-2 gap-2 w-full">
                                <div className="w-full">
                                    {cards.length < 5 ? (
                                        // Center the card if there's only one card
                                        <div className="flex justify-center gap-2">
                                            {cards.map((card) => (
                                                <div key={card.id} className="w-full max-w-xs">
                                                    {/* Card Selector */}
                                                    <div
                                                        className={`p-4 text-center  border-2 border-black rounded-full cursor-pointer transition-all ${cardId === card.id ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                        onClick={() => handleCardClick(card.id)}
                                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                                    >
                                                        {card.id}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // Use grid for multiple cards
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                                            {cards.map((card) => (
                                                <div key={card.id} className="w-full">
                                                    {/* Card Selector */}
                                                    <div
                                                        className={`p-4 text-center  border-2 border-black rounded-full cursor-pointer transition-all ${cardId === card.id ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                        onClick={() => handleCardClick(card.id)}
                                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                                    >
                                                        {card.id}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {cardId !== 0 && paymentStatus.length === 0 && (
                                <div className="text-center mt-6">
                                    <p className="text-gray-500">
                                        {t("noDataForStore")}
                                    </p>
                                    <p className="text-gray-500">
                                        {t("selectAnotherStore")}
                                    </p>
                                </div>
                            )}

                            <center className="mt-6">
                                <a
                                    onClick={() => navigateTo("/CustomerScreen")}
                                    className="relative w-full inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-black transition duration-300 ease-out bg-indigo-700 border-2 border-indigo-600 rounded-full shadow-md group cursor-pointer"
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
                        </div>

                    )}
                </div>
            </div>
        </section>
    );
};

export default PaymentStatus;