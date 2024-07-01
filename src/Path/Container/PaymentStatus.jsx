import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import { ProductsTest } from "../../Constants/productsForSale";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getUserForums } from "../../Services/forumsApi";

const PaymentStatus = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [forums, setForums] = useState([]);
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
                                        className="px-6 sm:px-6 py-3 text-center"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                            width: "25%",
                                        }}
                                    >
                                        {t("cardId")}
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
                                        {t("status")}
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
                                            <td
                                                className="px-6 py-4 text-center font-bold"
                                                style={{ fontFamily: "Poppins, sans-serif" }}
                                            >
                                                {products.id}
                                            </td>

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
                                                {products.createdAt}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                {products.Status === 1 && (
                                                    <div className="inline-flex items-center rounded-full bg-blue-600 py-2 px-3 text-xs text-white">
                                                        {t("complete")}
                                                    </div>
                                                )}
                                                {products.Status === 2 && (
                                                    <div className="inline-flex items-center rounded-full bg-red-200 py-1 px-2 text-red-500">
                                                        {t("cancelled")}
                                                    </div>
                                                )}
                                                {products.Status === 3 && (
                                                    <div className="inline-flex items-center rounded-full bg-blue-200 py-1 px-2 text-blue-600">
                                                        {t("pending")}
                                                    </div>
                                                )}
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

export default PaymentStatus;