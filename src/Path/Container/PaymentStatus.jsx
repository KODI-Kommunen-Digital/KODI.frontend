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
    const [paymentStatusCount, setPaymentStatusCount] = useState([]);

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
                setPaymentStatusCount(response.data.count)

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
        <section className="bg-gray-900 body-font relative h-full">
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

                                {paymentStatus.length >= pageSize && pageNumber * pageSize < paymentStatusCount && (
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
                    ) : cards.length > 0 ? (
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
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                                            {cards.map((card) => (
                                                <div key={card.id} className="w-full">
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

                    ) : (
                        <div className="bg-gray-100 mt-10 h-[30rem] flex flex-col justify-center items-center">
                            <center>
                                <svg className="emoji-404" enableBackground="new 0 0 226 249.135" height="249.135" id="Layer_1" overflow="visible" version="1.1" viewBox="0 0 226 249.135" width="226" xmlSpace="preserve" ><circle cx="113" cy="113" fill="#FFE585" r="109" /><line enableBackground="new    " fill="none" opacity="0.29" stroke="#6E6E96" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" x1="88.866" x2="136.866" y1="245.135" y2="245.135" /><line enableBackground="new    " fill="none" opacity="0.17" stroke="#6E6E96" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" x1="154.732" x2="168.732" y1="245.135" y2="245.135" /><line enableBackground="new    " fill="none" opacity="0.17" stroke="#6E6E96" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" x1="69.732" x2="58.732" y1="245.135" y2="245.135" /><circle cx="68.732" cy="93" fill="#6E6E96" r="9" /><path d="M115.568,5.947c-1.026,0-2.049,0.017-3.069,0.045  c54.425,1.551,98.069,46.155,98.069,100.955c0,55.781-45.219,101-101,101c-55.781,0-101-45.219-101-101  c0-8.786,1.124-17.309,3.232-25.436c-3.393,10.536-5.232,21.771-5.232,33.436c0,60.199,48.801,109,109,109s109-48.801,109-109  S175.768,5.947,115.568,5.947z" enableBackground="new    " fill="#FF9900" opacity="0.24" /><circle cx="156.398" cy="93" fill="#6E6E96" r="9" /><ellipse cx="67.732" cy="140.894" enableBackground="new    " fill="#FF0000" opacity="0.18" rx="17.372" ry="8.106" /><ellipse cx="154.88" cy="140.894" enableBackground="new    " fill="#FF0000" opacity="0.18" rx="17.371" ry="8.106" /><path d="M13,118.5C13,61.338,59.338,15,116.5,15c55.922,0,101.477,44.353,103.427,99.797  c0.044-1.261,0.073-2.525,0.073-3.797C220,50.802,171.199,2,111,2S2,50.802,2,111c0,50.111,33.818,92.318,79.876,105.06  C41.743,201.814,13,163.518,13,118.5z" fill="#FFEFB5" /><circle cx="113" cy="113" fill="none" r="109" stroke="#6E6E96" strokeWidth="8" /></svg>
                                <div className=" tracking-widest mt-4">
                                    {/* <span className="text-gray-500 text-6xl block"><span>{t("currently_no_bookings")}</span> */}
                                    <span className="text-gray-500 text-xl">{t("currently_no_bookings")}</span>

                                </div>
                            </center>
                            <center className="mt-6">
                                <a
                                    onClick={() =>
                                        navigateTo("/CustomerScreen")
                                    }
                                    className="bg-white relative w-full inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-black transition duration-300 ease-out border-2 border-black rounded-full shadow-md group cursor-pointer">
                                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 translate-x-full bg-black group-hover:-translate-x-0 ease">
                                        <svg className="w-6 h-6 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                        </svg>
                                    </span>
                                    <span className="absolute flex items-center justify-center w-full h-full text-black transition-all duration-300 transform group-hover:-translate-x-full ease">{t("goBack")}</span>
                                    <span className="relative invisible">
                                        {t("goBack")}
                                    </span>
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