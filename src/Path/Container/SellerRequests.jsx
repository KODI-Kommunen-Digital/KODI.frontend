import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getSellerRequests, getSellerShops } from "../../Services/containerApi";
import { status, statusByName } from "../../Constants/containerStatus";

const SellerRequests = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [sellerRequests, setSellerRequests] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 9;
    const [storeId, setStoreId] = useState();
    const [stores, setStores] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(statusByName.Active);

    const fetchStores = useCallback(() => {
        getSellerShops().then((response) => {
            setStores(response.data.data);
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
        fetchStores();
    }, [fetchStores]);

    const fetchSellerRequests = useCallback((cityId, storeId, pageNumber, selectedStatus) => {
        if (storeId) {
            getSellerRequests(cityId, storeId, selectedStatus, {
                params: {
                    pageNumber,
                    pageSize,
                },
            }).then((response) => {
                const requests = response.data.data;
                setSellerRequests(requests);
            });
        }
    }, []);

    useEffect(() => {
        if (storeId) {
            setPageNumber(1);
            const selectedStore = stores.find(store => store.id === parseInt(storeId));
            const cityId = selectedStore.cityId;
            fetchSellerRequests(cityId, storeId, pageNumber, selectedStatus);
        }
    }, [fetchSellerRequests, storeId, pageNumber, selectedStatus]);

    const handleStoreChange = async (event) => {
        const storeId = event.target.value;
        const selectedStore = stores.find(store => store.id === parseInt(storeId));

        if (selectedStore) {
            const cityId = selectedStore.cityId;
            setStoreId(storeId);
            setPageNumber(1); // Reset page number when a new store is selected

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("storeId", storeId);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            window.history.replaceState({}, "", newUrl);
            fetchSellerRequests(cityId, storeId, 1);
        }
    };

    const handleStoreClick = (storeId) => {
        const selectedStore = stores.find(store => store.id === parseInt(storeId));

        if (selectedStore) {
            const cityId = selectedStore.cityId;
            setStoreId(storeId);
            setPageNumber(1); // Reset page number when a new store is selected

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("storeId", storeId);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            window.history.replaceState({}, "", newUrl);
            fetchSellerRequests(cityId, storeId, 1, selectedStatus);
        }
    };

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    function getStatusClass(statusId) {
        if (status[statusId] === "Active") {
            return "bg-green-400";
        }
        if (status[statusId] === "Pending") {
            return "bg-yellow-400";
        }
    }

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />
            <div className="container px-0 sm:px-0 py-0 pb-2 w-full fixed top-0 z-10 lg:px-5 lg:w-auto relative">
                <div className="relative bg-black mr-0 ml-0 px-10 lg:rounded-lg h-18">
                    <div className="w-full">
                        <div className="w-full h-full flex items-center lg:py-2 py-5 justify-end xl:justify-center lg:justify-center border-gray-100 md:space-x-10">
                            <div className="hidden lg:block">
                                <div className="w-full h-full flex items-center justify-end xl:justify-center lg:justify-center md:justify-end sm:justify-end border-gray-100 md:space-x-10">
                                    <div
                                        className={`${selectedStatus === statusByName.Active ? "bg-gray-700 text-white" : "text-gray-300"
                                            } hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer`}
                                        onClick={() => setSelectedStatus(statusByName.Active)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {t("active")}
                                    </div>
                                    <div
                                        className={`${selectedStatus === statusByName.Pending ? "bg-gray-700 text-white" : "text-gray-300"
                                            } hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer`}
                                        onClick={() => setSelectedStatus(statusByName.Pending)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {t("pending")}
                                    </div>
                                </div>
                            </div>

                            <div className="-my-2 -mr-2 lg:hidden">
                                <select
                                    className="text-white bg-black font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center border-none focus:outline-none"
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    value={selectedStatus || ""}
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    <option value={statusByName.Active}>{t("active")}</option>
                                    <option value={statusByName.Pending}>{t("pending")}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container w-auto px-5 py-2 bg-gray-800 min-h-screen flex flex-col">
                <div className="h-full">

                    {sellerRequests && sellerRequests.length > 0 ? (
                        <>
                            <div className="flex justify-center px-5 py-2 gap-2 w-full md:w-auto fixed lg:w-auto relative">
                                <div className="col-span-6 sm:col-span-1 mt-1 mb-1 px-0 mr-0 w-full md:w-80">
                                    <select
                                        id="stores"
                                        name="stores"
                                        autoComplete="stores"
                                        onChange={handleStoreChange}
                                        value={storeId || 0}
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
                                        {stores.map((card) => (
                                            <option className="font-sans" value={card.id} key={card.id}>
                                                {card.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white mt-4 p-0">
                                <h2 className="text-xl font-semibold text-gray-800 text-center px-5 py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                                    {t("sellerRequestsHeading")}
                                </h2>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left space-y-10 text-gray-500 p-6 rounded-lg">
                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                            <tr>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-center"
                                                    style={{
                                                        fontFamily: "Poppins, sans-serif",
                                                        width: "25%",
                                                    }}
                                                >
                                                    {t("sellerName")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-center"
                                                    style={{
                                                        fontFamily: "Poppins, sans-serif",
                                                        width: "25%",
                                                    }}
                                                >
                                                    {t("date_of_creation")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-center "
                                                    style={{
                                                        fontFamily: "Poppins, sans-serif",
                                                        width: "25%",
                                                    }}
                                                >
                                                    {t("description")}
                                                </th>

                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-center "
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
                                            {sellerRequests.map((products, index) => (
                                                <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                                    <th className="px-6 py-4 text-center font-bold text-gray-500 truncate"
                                                        style={{ fontFamily: "Poppins, sans-serif", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>

                                                        {products.title}
                                                    </th>

                                                    <td
                                                        className="px-6 py-4 text-center font-bold text-blue-600"
                                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                                    >
                                                        {products.createdAt
                                                            ? new Date(products.createdAt).toLocaleString('de')
                                                            : "-"}
                                                    </td>

                                                    <div className="px-6 py-4">
                                                        <td
                                                            className="text-center font-bold text-blue-600 line-clamp-3"
                                                            style={{
                                                                fontFamily: "Poppins, sans-serif",
                                                                maxWidth: "200px",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "pre-wrap"
                                                            }}
                                                            dangerouslySetInnerHTML={{ __html: products.description }}
                                                        >
                                                        </td>
                                                    </div>

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center">
                                                            <div
                                                                className={`h-2.5 w-2.5 rounded-full ${getStatusClass(
                                                                    products.status
                                                                )} mr-2`}
                                                            ></div>

                                                            <h1 style={{ fontFamily: "Poppins, sans-serif" }}>
                                                                {t(status[products.status].toLowerCase())}
                                                            </h1>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}

                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
                                {pageNumber !== 1 ? (
                                    <span
                                        className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                                        onClick={() => setPageNumber(pageNumber - 1)}
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
                                        onClick={() => setPageNumber(pageNumber + 1)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {">"}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bg-gray-100 mt-0 min-h-[30rem] px-5 py-2 flex flex-col justify-center items-center">
                            <div className="flex justify-center px-5 py-2 gap-2 w-full">
                                <div className="w-full">
                                    {stores.length < 5 ? (
                                        <div className="flex justify-center gap-2 ">
                                            {stores.map((store) => (
                                                <div key={store.id} className="w-full max-w-xs">
                                                    <div
                                                        className={`p-4 text-center  border-2 border-black rounded-full cursor-pointer transition-all ${storeId === store.id ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                        onClick={() => handleStoreClick(store.id)}
                                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                                    >
                                                        {store.name}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
                                            {stores.map((store) => (
                                                <div key={store.id} className="w-full">
                                                    <div
                                                        className={`p-4 text-center  border-2 border-black rounded-full cursor-pointer transition-all ${storeId === store.id ? 'bg-gray-300' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                        onClick={() => handleStoreClick(store.id)}
                                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                                    >
                                                        {store.id}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {storeId && sellerRequests.length === 0 && (
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