import React, { useState, useEffect, useCallback } from 'react';
import SideBar from "../../Components/SideBar";
import { useNavigate } from 'react-router-dom';
import { getOrders, getOwnerShops } from "../../Services/containerApi";
import { useTranslation } from 'react-i18next';
import RegionColors from "../../Components/RegionColors";
import { FaEye } from 'react-icons/fa';

function AllSellers() {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 9;
    const [orders, setOrders] = useState([]);
    const [storeId, setStoreId] = useState();
    const [stores, setStores] = useState([]);

    const fetchProducts = useCallback((cityId, storeId, pageNumber) => {
        if (storeId) {
            getOrders(cityId, storeId, pageNumber).then((response) => {
                const allOrders = response.data.data;
                setOrders(allOrders);
            });
        }
    }, []);

    const handleViewDetails = (order) => {
        navigate('/OwnerScreen/OrderDetailsStore', { state: { orderDetails: order } });
    };

    useEffect(() => {
        if (storeId) {
            setPageNumber(1);
            const selectedStore = stores.find(store => store.id === parseInt(storeId));
            const cityId = selectedStore.cityId;
            if (selectedStore) {
                fetchProducts(cityId, storeId, pageNumber);
            }
        }
    }, [fetchProducts, storeId, pageNumber]);

    const fetchStores = useCallback(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const urlStoreId = urlParams.get("storeId");

        getOwnerShops().then((response) => {
            const fetchedStores = response.data.data;
            setStores(fetchedStores);

            if (urlStoreId) {
                const storeIdNumber = parseInt(urlStoreId, 10);
                const selectedStore = fetchedStores.find(store => store.id === storeIdNumber);

                if (selectedStore) {
                    setStoreId(storeIdNumber);
                    setPageNumber(1);

                    fetchProducts(selectedStore.cityId, storeIdNumber, 1);
                }
            }
        });
    }, []);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

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
            fetchProducts(cityId, storeId, 1);
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
            fetchProducts(cityId, storeId, 1);
        }
    };

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-800 min-h-screen flex flex-col">
                <div className="h-full">
                    {storeId && orders && orders.length > 0 ? (
                        <>

                            <div className="flex justify-center px-5 py-2 gap-2 w-full md:w-auto fixed lg:w-auto relative">
                                <div className="col-span-6 sm:col-span-1 mt-4 mb-1 px-0 mr-0 w-full md:w-80">
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
                                        {stores.map((store) => (
                                            <option className="font-sans" value={store.id} key={store.id}>
                                                {store.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white mt-0 p-0 space-y-10 overflow-x-auto">
                                <table className="w-full text-sm text-left  text-gray-500  p-6 space-y-10 rounded-lg">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "16.66%",
                                                }}
                                            >
                                                {t("order")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-3 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "16.66%",
                                                }}
                                            >
                                                {t("user")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-3 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "16.66%",
                                                }}
                                            >
                                                {t("amount")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "16.66%",
                                                }}
                                            >
                                                {t("date_of_creation")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-center "
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "16.66%",
                                                }}
                                            >
                                                {t("discount")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-4 text-center "
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
                                        {orders.map((order) => (
                                            <tr key={order.id} className="bg-white border-b hover:bg-gray-50">
                                                <td className="px-6 py-4 text-center font-bold text-gray-500"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    {order.id ? order.id.toString().padStart(3, '0') : "-"}
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-blue-600"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    {order.user?.username || "-"}
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-gray-500"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    {order.amount != null ? `€ ${order.amount.toFixed(2)}` : "-"}
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-blue-600"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    {order.createdAt ? new Date(order.createdAt).toLocaleString('de') : "-"}
                                                </td>
                                                <td className="px-6 py-4 text-center font-bold text-gray-500"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    {order.discount != null ? `€ ${order.discount.toFixed(2)}` : "-"}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center">
                                                        <div
                                                            className="relative group inline-block"
                                                            onClick={() => handleViewDetails(order)}
                                                        >
                                                            <FaEye className={`text-2xl ${RegionColors.darkTextColor} cursor-pointer`} />
                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                                {t("viewDetails")}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
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

                                {orders.length >= pageSize && (
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

                            {storeId && orders.length === 0 && (
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
                                    onClick={() => navigateTo("/OwnerScreen/StoreDetails")}
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
}


export default AllSellers;