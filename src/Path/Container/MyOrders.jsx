import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getMyOrders } from "../../Services/containerApi";
import RegionColors from "../../Components/RegionColors";

const MyOrders = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [myOrders, setMyOrders] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const pageSize = 9;

    const fetchMyOrders = useCallback(() => {
        getMyOrders({
            pageNo,
            pageSize,
        }).then((response) => {
            setMyOrders(response.data.data);
        });
    }, []);

    useEffect(() => {
        fetchMyOrders();
    }, [fetchMyOrders, pageNo]);

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
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
                                            width: "25%",
                                        }}
                                    >
                                        {t("productName")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 sm:px-6 py-3 text-center"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                            width: "25%",
                                        }}
                                    >
                                        {t("amount")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 sm:px-6 py-3 text-center "
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                            width: "25%",
                                        }}
                                    >
                                        {t("orderDate")}
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 sm:px-6 py-3 text-center "
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                            width: "25%",
                                        }}
                                    >
                                        {t("viewDetails")}
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {myOrders.map((myOrder, index) => {
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
                                                        myOrder.image
                                                            ? process.env.REACT_APP_BUCKET_HOST +
                                                            myOrder.image
                                                            : process.env.REACT_APP_BUCKET_HOST +
                                                            "admin/DefaultForum.jpeg"
                                                    }
                                                    onClick={() =>
                                                        navigateTo(
                                                            `/Forum?forumId=${myOrder.forumId}&cityId=${myOrder.cityId}`
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
                                                                `/Forum?forumId=${myOrder.forumId}&cityId=${myOrder.cityId}`
                                                            )
                                                        }
                                                    >
                                                        {myOrder.products}
                                                    </div>
                                                </div>
                                            </th>

                                            <td
                                                className="px-6 py-4 text-center font-bold"
                                                style={{ fontFamily: "Poppins, sans-serif" }}
                                            >
                                                {myOrder.amount}
                                            </td>

                                            <td
                                                className="px-6 py-4 text-center font-bold text-blue-600"
                                                style={{ fontFamily: "Poppins, sans-serif" }}
                                            >
                                                {myOrder.createdAt}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <a
                                                    onClick={() => {
                                                        navigateTo(`/CustomerScreen/OrderDetails?orderId=${myOrder.id}`);
                                                    }}
                                                    className={`flex items-center ${RegionColors.darkTextColor} py-2 px-6 gap-2 rounded inline-flex cursor-pointer`}
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    <span>{t("clickHere")}</span>
                                                    <svg
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth="2"
                                                        viewBox="0 0 24 24"
                                                        className="w-6 h-6 ml-2"
                                                    >
                                                        <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                                    </svg>
                                                </a>
                                            </td>
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

                        {myOrders.length >= pageSize && (
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

export default MyOrders;