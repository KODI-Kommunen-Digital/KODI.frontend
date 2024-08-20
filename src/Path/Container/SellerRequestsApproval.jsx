import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getSellers, getStores, updateSeller } from "../../Services/containerApi";
import { statusByName } from "../../Constants/containerStatus";
import RegionColors from "../../Components/RegionColors";
import { FaEye } from 'react-icons/fa';

const SellerRequestsApproval = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [sellerRequests, setSellerRequests] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 9;
    const [storeId, setStoreId] = useState();
    const [stores, setStores] = useState([]);
    const [selectedCityId, setSelectedCityId] = useState();
    const [selectedStatus, setSelectedStatus] = useState(statusByName.Active);

    const fetchStores = useCallback(() => {
        getStores().then((response) => {
            setStores(response.data.data);
        });
    }, []);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const fetchSellerRequests = useCallback((cityId, storeId, pageNumber, selectedStatus) => {
        if (storeId) {
            getSellers(cityId, storeId, pageNumber, selectedStatus).then((response) => {
                setSellerRequests(response.data.data);
            });
        }
    }, []);

    useEffect(() => {
        if (storeId) {
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
            setSelectedCityId(cityId)
            setPageNumber(1); // Reset page number when a new store is selected

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("storeId", storeId);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            window.history.replaceState({}, "", newUrl);
            fetchSellerRequests(cityId, storeId, 1); // Reset to first page
        }
    };

    const [showConfirmationModal, setShowConfirmationModal] = useState({
        visible: false,
        sellerId: null,
        onConfirm: () => { },
        onCancel: () => { },
    });

    function handleDelete(sellerId, title, description) {
        const selectedStore = stores.find(store => store.id === parseInt(storeId));
        const cityId = selectedStore.cityId;
        const deleteStatus = 2;

        updateSeller(cityId, sellerId, deleteStatus, title, description)
            .then((res) => {
                fetchSellerRequests(cityId, storeId, pageNumber, selectedStatus);

                console.log("Deleted successfully");

                setShowConfirmationModal({ visible: false });
            })
            .catch((error) => console.log(error));
    }

    function deleteSellerRequestOnClick(sellerId, title, description) {
        setShowConfirmationModal({
            visible: true,
            sellerId,
            onConfirm: () => handleDelete(sellerId, title, description),
            onCancel: () => setShowConfirmationModal({ visible: false }),
        });
    }

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    const navigateToSellerDetails = (sellerRequest) => {
        navigate('/OwnerScreen/SellerDetailsStore', { state: { sellerDetails: sellerRequest, cityId: selectedCityId } });
    };

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />
            <div className="container px-0 sm:px-0 py-0 pb-2 w-full fixed top-0 z-10 lg:px-5 lg:w-auto relative">
                <div className="relative bg-black mr-0 ml-0 px-10 lg:rounded-lg h-16">
                    <div className="w-full">
                        <div className="w-full h-full flex items-center lg:py-2 py-5 justify-end xl:justify-center lg:justify-center border-gray-100 md:space-x-10">
                            <div className="hidden lg:block">
                                <div className="w-full h-full flex items-center justify-end xl:justify-center lg:justify-center md:justify-end sm:justify-end border-gray-100 md:space-x-10">
                                    <div
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
                                        onClick={() => setSelectedStatus(statusByName.Active)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {t("active")}
                                    </div>
                                    <div
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
                                        onClick={() => setSelectedStatus(statusByName.Pending)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {t("pending")}
                                    </div>
                                    <div
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
                                        onClick={() => setSelectedStatus(statusByName.Inactive)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {t("inactive")}
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
                                    <option value={statusByName.Inactive}>{t("inactive")}</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container flex justify-center px-5 py-2 gap-2 w-full md:w-auto fixed lg:w-auto relative">
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

            <div className="container w-auto px-5 lg:px-5 py-2 bg-gray-800 min-h-screen flex flex-col">
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
                                                    width: "20%",
                                                }}
                                            >
                                                {t("productName")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "20%",
                                                }}
                                            >
                                                {t("date_of_creation")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center "
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "20%",
                                                }}
                                            >
                                                {t("description")}
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center "
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "20%",
                                                }}
                                            >
                                                {t("action")}
                                            </th>

                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center "
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "20%",
                                                }}
                                            >
                                                {t("viewDetails")}
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {sellerRequests.map((sellerRequest, index) => (
                                            <tr key={index} className="bg-white border-b hover:bg-gray-50">
                                                <th
                                                    scope="row"
                                                    className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap cursor-pointer"
                                                >
                                                    <img
                                                        className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                                                        src={
                                                            sellerRequest.image
                                                                ? process.env.REACT_APP_BUCKET_HOST + sellerRequest.image
                                                                : process.env.REACT_APP_BUCKET_HOST + "admin/DefaultForum.jpeg"
                                                        }
                                                        onClick={() =>
                                                            navigateTo(`/Forum?forumId=${sellerRequest.forumId}&cityId=${sellerRequest.cityId}`)
                                                        }
                                                        alt="avatar"
                                                    />
                                                    <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
                                                        <div
                                                            className="font-bold text-gray-500 cursor-pointer text-center truncate"
                                                            style={{ fontFamily: "Poppins, sans-serif" }}
                                                            onClick={() =>
                                                                navigateTo(`/Forum?forumId=${sellerRequest.forumId}&cityId=${sellerRequest.cityId}`)
                                                            }
                                                        >
                                                            {sellerRequest.title}
                                                        </div>
                                                    </div>
                                                </th>

                                                <td
                                                    className="px-6 py-4 text-center font-bold text-blue-600"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    {new Date(sellerRequest.createdAt).toLocaleString('de')}
                                                </td>

                                                <td
                                                    className="px-6 py-4 text-center font-bold text-blue-600 truncate"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    {sellerRequest.description}
                                                </td>

                                                <td className="px-6 py-4 text-center font-bold">
                                                    <div className="flex justify-center items-center">
                                                        <a
                                                            className={`font-medium text-red-600 px-2 cursor-pointer`}
                                                            style={{ fontFamily: "Poppins, sans-serif" }}
                                                            onClick={() => deleteSellerRequestOnClick(sellerRequest.id, sellerRequest.title, sellerRequest.description)}
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

                                                {showConfirmationModal.visible && (
                                                    <div className="fixed z-50 inset-0 flex items-center justify-center overflow-y-auto">
                                                        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                                            <div
                                                                className="fixed inset-0 transition-opacity"
                                                                aria-hidden="true"
                                                            >
                                                                <div className="absolute inset-0 bg-gray-500 opacity-100"></div>
                                                            </div>
                                                            <span
                                                                className="hidden sm:inline-block sm:align-middle sm:h-screen"
                                                                aria-hidden="true"
                                                            >
                                                                &#8203;
                                                            </span>
                                                            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                                                    <div className="sm:flex sm:items-start">
                                                                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                                                            <svg
                                                                                className="h-6 w-6 text-red-700"
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                stroke="currentColor"
                                                                                aria-hidden="true"
                                                                            >
                                                                                <path
                                                                                    strokeLinecap="round"
                                                                                    strokeLinejoin="round"
                                                                                    strokeWidth="2"
                                                                                    d="M6 18L18 6M6 6l12 12"
                                                                                />
                                                                            </svg>
                                                                        </div>
                                                                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                                                            <h3 className="text-lg leading-6 font-medium text-slate-800">
                                                                                {t("areyousure")}
                                                                            </h3>
                                                                            <div className="mt-2">
                                                                                <p className="text-sm text-gray-500">
                                                                                    {t("doyoureallywanttodeleteListing")}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                                                    <button
                                                                        onClick={showConfirmationModal.onConfirm}
                                                                        type="button"
                                                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                                                    >
                                                                        {t("delete")}
                                                                    </button>

                                                                    <button
                                                                        onClick={showConfirmationModal.onCancel}
                                                                        type="button"
                                                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                                                    >
                                                                        {t("cancel")}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <td className="px-6 py-4">
                                                    <div className="flex items-center justify-center">
                                                        <div
                                                            className="relative group inline-block"
                                                            onClick={() => navigateToSellerDetails(sellerRequest)}
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
                        <div className="bg-gray-100 mt-0 h-[30rem] flex flex-col justify-center items-center">
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

export default SellerRequestsApproval;