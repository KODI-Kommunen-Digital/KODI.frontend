import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getSellerRequests } from "../../Services/containerApi";

const SellerRequests = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [sellerRequests, setSellerRequests] = useState([]);
    const [text, setText] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [pageNumber, setPageNo] = useState(1);
    const pageSize = 9;

    const fetchSellerRequests = useCallback(() => {
        getSellerRequests({
            pageNumber,
            pageSize,
        }).then((response) => {
            console.log(response.data.data)
            setSellerRequests(response.data.data);
        });
    }, []);

    useEffect(() => {
        fetchSellerRequests();
    }, [fetchSellerRequests, pageNumber]);

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    const handleTextChange = (event) => {
        setText(event.target.value);
    };

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
        setText("");
    };

    return (
        <section className="bg-slate-600 body-font relative h-screen">
            <SideBar />
            <div className="container w-auto px-5 lg:px-5 py-2 bg-slate-600 min-h-screen flex flex-col">
                <div className="h-full">

                    {sellerRequests && sellerRequests.length > 0 ? (
                        <>
                            <div className="bg-white mt-4 p-0 space-y-10 overflow-x-auto">
                                <table className="w-full text-sm text-left lg:mt-[2rem] mt-[2rem] text-gray-500 p-6 space-y-10 rounded-lg">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "16.66%",
                                                }}
                                            >
                                                {t("productName")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "16.66%",
                                                }}
                                            >
                                                {t("price")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center "
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "16.66%",
                                                }}
                                            >
                                                {t("numberOfOrders")}
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center "
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "16.66%",
                                                }}
                                            >
                                                {t("customerDetails")}
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center "
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "16.66%",
                                                }}
                                            >
                                                {t("action")}
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sellerRequests.map((products, index) => (
                                            <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                                <th
                                                    scope="row"
                                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap cursor-pointer"
                                                >
                                                    <img
                                                        className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                                                        src={
                                                            products.image
                                                                ? process.env.REACT_APP_BUCKET_HOST + products.image
                                                                : process.env.REACT_APP_BUCKET_HOST + "admin/DefaultForum.jpeg"
                                                        }
                                                        onClick={() =>
                                                            navigateTo(`/Forum?forumId=${products.forumId}&cityId=${products.cityId}`)
                                                        }
                                                        alt="avatar"
                                                    />
                                                    <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
                                                        <div
                                                            className="font-bold text-gray-500 cursor-pointer text-center truncate"
                                                            style={{ fontFamily: "Poppins, sans-serif" }}
                                                            onClick={() =>
                                                                navigateTo(`/Forum?forumId=${products.forumId}&cityId=${products.cityId}`)
                                                            }
                                                        >
                                                            {products.productName}
                                                        </div>
                                                    </div>
                                                </th>

                                                <td
                                                    className="px-6 py-4 text-center font-bold"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    {products.price}
                                                </td>

                                                <td
                                                    className="px-6 py-4 text-center font-bold text-blue-600"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    {products.numberOfOrders}
                                                </td>

                                                <td
                                                    className="px-6 py-4 text-center font-bold"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    {products.customerName}
                                                </td>

                                                <td className="px-6 py-4 text-center font-bold">
                                                    <div className="flex justify-center items-center">
                                                        <a
                                                            className={`font-medium text-green-600 px-2 cursor-pointer`}
                                                            style={{ fontFamily: "Poppins, sans-serif" }}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                height="1em"
                                                                viewBox="0 0 640 512"
                                                                className="w-6 h-6 fill-current transition-transform duration-300 transform hover:scale-110"
                                                            >
                                                                <path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z" />
                                                            </svg>
                                                        </a>

                                                        <a
                                                            className={`font-medium text-red-600 px-2 cursor-pointer`}
                                                            style={{ fontFamily: "Poppins, sans-serif" }}
                                                            onClick={openPopup}
                                                        >
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                height="1em"
                                                                viewBox="0 0 640 512"
                                                                className="w-6 h-6 fill-current transition-transform duration-300 transform hover:scale-110"
                                                            >
                                                                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                            </svg>
                                                        </a>
                                                    </div>
                                                </td>

                                                {isPopupOpen && (
                                                    <div className="fixed w-full px-4 sm:px-6 inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
                                                        <div className="bg-white p-6 rounded-lg shadow relative w-full max-w-md max-h-full">
                                                            <h2 className="text-xl flex justify-center items-center font-medium leading-normal text-neutral-800">
                                                                {t("reason")}
                                                            </h2>
                                                            <textarea
                                                                className="w-full p-2 border rounded-lg resize-none text-sm text-gray-600"
                                                                rows="4"
                                                                value={text}
                                                                onChange={handleTextChange}
                                                            />
                                                            <div className="text-center justify-center mt-4">
                                                                <button
                                                                    className="mt-3 mb-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                                    onClick={closePopup}
                                                                >
                                                                    {t("cancel")}
                                                                </button>
                                                                <button
                                                                    className="w-full mt-3 mb-3 inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                                // onClick={handleReportPost}
                                                                >
                                                                    {t("send")}
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
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

                                {sellerRequests.length >= pageSize && (
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
                        <div className="bg-gray-100 mt-10 h-[30rem] flex flex-col justify-center items-center">
                            <center>
                                <svg
                                    className="emoji-404"
                                    enableBackground="new 0 0 226 249.135"
                                    height="249.135"
                                    id="Layer_1"
                                    overflow="visible"
                                    version="1.1"
                                    viewBox="0 0 226 249.135"
                                    width="226"
                                    xmlSpace="preserve"
                                >
                                    <circle cx="113" cy="113" fill="#FFE585" r="109" />
                                    <line
                                        enableBackground="new    "
                                        fill="none"
                                        opacity="0.29"
                                        stroke="#6E6E96"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="8"
                                        x1="88.866"
                                        x2="136.866"
                                        y1="245.135"
                                        y2="245.135"
                                    />
                                    <line
                                        enableBackground="new    "
                                        fill="none"
                                        opacity="0.17"
                                        stroke="#6E6E96"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="8"
                                        x1="154.732"
                                        x2="168.732"
                                        y1="245.135"
                                        y2="245.135"
                                    />
                                    <line
                                        enableBackground="new    "
                                        fill="none"
                                        opacity="0.17"
                                        stroke="#6E6E96"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="8"
                                        x1="69.732"
                                        x2="58.732"
                                        y1="245.135"
                                        y2="245.135"
                                    />
                                    <circle cx="68.732" cy="93" fill="#6E6E96" r="9" />
                                    <path
                                        d="M115.568,5.947c-1.026,0-2.049,0.017-3.069,0.045  c54.425,1.551,98.069,46.155,98.069,100.955c0,55.781-45.219,101-101,101c-55.781,0-101-45.219-101-101  c0-8.786,1.124-17.309,3.232-25.436c-3.393,10.536-5.232,21.771-5.232,33.436c0,60.199,48.801,109,109,109s109-48.801,109-109  S175.768,5.947,115.568,5.947z"
                                        enableBackground="new    "
                                        fill="#FF9900"
                                        opacity="0.24"
                                    />
                                    <circle cx="156.398" cy="93" fill="#6E6E96" r="9" />
                                    <ellipse
                                        cx="67.732"
                                        cy="140.894"
                                        enableBackground="new    "
                                        fill="#FF0000"
                                        opacity="0.18"
                                        rx="17.372"
                                        ry="8.106"
                                    />
                                    <ellipse
                                        cx="154.88"
                                        cy="140.894"
                                        enableBackground="new    "
                                        fill="#FF0000"
                                        opacity="0.18"
                                        rx="17.371"
                                        ry="8.106"
                                    />
                                    <path
                                        d="M13,118.5C13,61.338,59.338,15,116.5,15c55.922,0,101.477,44.353,103.427,99.797  c0.044-1.261,0.073-2.525,0.073-3.797C220,50.802,171.199,2,111,2S2,50.802,2,111c0,50.111,33.818,92.318,79.876,105.06  C41.743,201.814,13,163.518,13,118.5z"
                                        fill="#FFEFB5"
                                    />
                                    <circle cx="113" cy="113" fill="none" r="109" stroke="#6E6E96" strokeWidth="8" />
                                </svg>
                                <div className="tracking-widest mt-4">
                                    <span className="text-gray-500 text-xl">{t("currently_no_items")}</span>
                                </div>
                            </center>
                            <center className="mt-6">
                                <a
                                    onClick={() => navigateTo("/SellerScreen")}
                                    className="bg-white relative w-full inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-black transition duration-300 ease-out border-2 border-black rounded-full shadow-md group cursor-pointer"
                                >
                                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 translate-x-full bg-black group-hover:-translate-x-0 ease">
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
                                    <span className="absolute flex items-center justify-center w-full h-full text-black transition-all duration-300 transform group-hover:-translate-x-full ease">
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

export default SellerRequests;