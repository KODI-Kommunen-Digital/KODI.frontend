import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import { ProductsTest } from "../../Constants/productsForSale";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getUserForums } from "../../Services/forumsApi";

const SellerRequests = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [forums, setForums] = useState([]);
    const [text, setText] = useState("");
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const pageSize = 9;

    const fetchForums = useCallback(() => {
        getUserForums({
            pageNo,
            pageSize,
        }).then((response) => {
            setForums(response.data.data);
        });
    }, [pageNo]);

    useEffect(() => {
        if (pageNo === 1) {
            fetchForums();
        } else {
            fetchForums();
        }
    }, [fetchForums, pageNo]);

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
                                {ProductsTest.map((products, index) => {
                                    return (
                                        <tr
                                            key={index}
                                            className="bg-white border-b hover:bg-gray-50"
                                        >
                                            <th
                                                scope="row"
                                                className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap cursor-pointer"
                                            >
                                                <img
                                                    className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                                                    src={
                                                        products.image
                                                            ? process.env.REACT_APP_BUCKET_HOST +
                                                            products.image
                                                            : process.env.REACT_APP_BUCKET_HOST +
                                                            "admin/DefaultForum.jpeg"
                                                    }
                                                    onClick={() =>
                                                        navigateTo(
                                                            `/Forum?forumId=${products.forumId}&cityId=${products.cityId}`
                                                        )
                                                    }
                                                    alt="avatar"
                                                />
                                                <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
                                                    <div
                                                        className="font-bold text-gray-500 cursor-pointer text-center truncate"
                                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                                        onClick={() =>
                                                            navigateTo(
                                                                `/Forum?forumId=${products.forumId}&cityId=${products.cityId}`
                                                            )
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
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    <div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
                        {pageNo !== 1 ? (
                            <span
                                className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                                onClick={() => setPageNo(pageNo - 1)}
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
                            {t("page")} {pageNo}
                        </span>

                        {forums.length >= pageSize && (
                            <span
                                className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                                onClick={() => setPageNo(pageNo + 1)}
                                style={{ fontFamily: "Poppins, sans-serif" }}
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

export default SellerRequests;