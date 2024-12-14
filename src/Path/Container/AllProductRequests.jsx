import React, { useState, useEffect, useCallback } from 'react';
import SideBar from "../../Components/SideBar";
import { useNavigate } from 'react-router-dom';
import { getProductRequests, getOwnerShops, getUserRoleContainer } from "../../Services/containerApi";
import { statusByName } from "../../Constants/containerStatus";
import { useTranslation } from 'react-i18next';
import { FaEye } from 'react-icons/fa';
import RegionColors from "../../Components/RegionColors";
import CONTAINERIMAGE from "../../assets/ContainerDefaultImage.jpeg";

function AllProductRequests() {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [pageNumber, setPageNumber] = useState(1);
    const pageSize = 9;
    const [productRequests, setProductRequests] = useState([]);
    const [storeId, setStoreId] = useState();
    const [cityId, setCityId] = useState();
    const [selectedStatus, setSelectedStatus] = useState(statusByName.Active);
    const [stores, setStores] = useState([]);

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
                    const cityId = selectedStore.cityId;
                    setCityId(cityId)
                    setPageNumber(1);

                    fetchProductRequests(cityId, storeIdNumber, 1, selectedStatus);
                }
            }
        });
    }, []);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    const fetchProductRequests = useCallback(async (cityId,storeId, pageNumber, selectedStatus) => {
        if (storeId) {
            try {
                const response = await getProductRequests(storeId, pageNumber, selectedStatus);
                const allRequests = response.data.data;
                setProductRequests(allRequests);
            } catch (error) {
                console.error("Error fetching product requests:", error);
            }
        }
    }, []);

    useEffect(() => {
        if (storeId) {
            setPageNumber(1);
            const selectedStore = stores.find(store => store.id === parseInt(storeId));
            if (selectedStore) {
                fetchProductRequests(cityId, storeId, pageNumber, selectedStatus);
            }
        }
    }, [fetchProductRequests, storeId, selectedStatus]);

    const handleStoreChange = async (event) => {
        const storeId = event.target.value;
        const selectedStore = stores.find(store => store.id === parseInt(storeId));

        if (selectedStore) {
            const cityId = selectedStore.cityId;
            setCityId(cityId);
            setStoreId(storeId);
            setPageNumber(1);

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("storeId", storeId);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            window.history.replaceState({}, "", newUrl);
            fetchProductRequests(cityId, storeId, 1, selectedStatus);
        }
    };

    const handleStoreClick = (storeId) => {
        const selectedStore = stores.find(store => store.id === parseInt(storeId));

        if (selectedStore) {
            const cityId = selectedStore.cityId;
            setStoreId(storeId);
            setCityId(cityId);
            setPageNumber(1);

            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set("storeId", storeId);
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            window.history.replaceState({}, "", newUrl);
            fetchProductRequests(cityId, storeId, 1, selectedStatus);
        }
    };

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    const [isOwner, setIsOwner] = useState(null);
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
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
                const roleResponse = await getUserRoleContainer();
                let roles = roleResponse.data.data;
                roles = roles.map(Number);
                if (roles.includes(101)) {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }
            } catch (error) {
                console.error("Error fetching user roles:", error);
                navigate("/Error");
            }
        };

        fetchUserRole();
    }, [navigate]);

    useEffect(() => {
        if (isOwner === false) {
            navigate("/Error");
        }
    }, [isOwner, navigate]);

    const handleViewDetailsClick = (product) => {
        navigate('/OwnerScreen/AllProductRequestsDetails', {
            state: {
                productDetails: product,
                storeId: storeId,
                cityId: cityId,
                isSeller:false
            }
        });
    };

    

    return (
        <section className="bg-gray-900 body-font relative h-screen">
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
                                        onClick={() => {
                                            setSelectedStatus(statusByName.Active);
                                            setPageNumber(1)
                                        }}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {t("approved")}
                                    </div>
                                    <div
                                        className={`${selectedStatus === statusByName.Pending ? "bg-gray-700 text-white" : "text-gray-300"
                                            } hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer`}
                                        onClick={() => {
                                            setSelectedStatus(statusByName.Pending);
                                            setPageNumber(1)
                                        }}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {t("pending")}
                                    </div>
                                    <div
                                        className={`${selectedStatus === statusByName.Inactive ? "bg-gray-700 text-white" : "text-gray-300"
                                            } hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer`}
                                        onClick={() => {
                                            setSelectedStatus(statusByName.Inactive);
                                            setPageNumber(1)
                                        }}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {t("rejected")}
                                    </div>
                                    {/* <div
                                        className={`${selectedStatus === statusByName.ChangeRequested ? "bg-gray-700 text-white" : "text-gray-300"
                                            } hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer`}
                                        onClick={() => setSelectedStatus(statusByName.ChangeRequested)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {t("changeRequested")}
                                    </div> */}
                                </div>
                            </div>

                            <div className="-my-2 -mr-2 lg:hidden">
                                <select
                                    className="text-white bg-black font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center border-none focus:outline-none"
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    value={selectedStatus || ""}
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    <option value={statusByName.Active}>{t("approved")}</option>
                                    <option value={statusByName.Pending}>{t("pending")}</option>
                                    <option value={statusByName.Inactive}>{t("rejected")}</option>
                                    {/* <option value={statusByName.ChangeRequested}>{t("changeRequested")}</option> */}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-900 min-h-screen flex flex-col">
                <div className="h-full">
                    {storeId && productRequests && productRequests.length > 0 ? (
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
                                        {stores.map((store) => (
                                            <option className="font-sans" value={store.id} key={store.id}>
                                                {store.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="bg-white mt-4 p-0">
                                <h2 className="text-xl font-semibold text-gray-800 text-center px-5 py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                                    {t("allProductRequests")}
                                </h2>
                                <div className="overflow-x-auto">
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
                                                    {t("title")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-center"
                                                    style={{
                                                        fontFamily: "Poppins, sans-serif",
                                                        width: "16.66%",
                                                    }}
                                                >
                                                    {t("price")}
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-center"
                                                    style={{
                                                        fontFamily: "Poppins, sans-serif",
                                                        width: "16.66%",
                                                    }}
                                                >
                                                    {t("count")}
                                                </th>

                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-center"
                                                    style={{
                                                        fontFamily: "Poppins, sans-serif",
                                                        width: "16.66%",
                                                    }}
                                                >
                                                    {t("minAge")}
                                                </th>
                                               
                                                <th
                                                    scope="col"
                                                    className="px-6 py-4 text-center"
                                                    style={{
                                                        fontFamily: "Poppins, sans-serif",
                                                        width: "16.66%",
                                                    }}
                                                >
                                                    {t("viewDetails")}
                                                </th>

                                            </tr>
                                        </thead>

                                        <tbody>
                                            {productRequests.map((product, index) => (
                                                <tr
                                                    key={index}
                                                    className="bg-white border-p hover:bg-gray-50"
                                                >
                                                    <th
                                                        scope="row"
                                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap cursor-pointer"
                                                    >
                                                        <img
                                                            className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                                                            src={
                                                                product.productImages
                                                                    ? process.env.REACT_APP_BUCKET_HOST +
                                                                    product.productImages[0]
                                                                    : process.env.REACT_APP_BUCKET_HOST +
                                                                    "admin/Container/ShoppingCart.png"
                                                            }
                                                            onError={(e) => {
                                                                e.target.src = CONTAINERIMAGE;
                                                            }}
                                                        />
                                                        <div className="pl-0 sm:pl-3 overflow-hidden max-w-[14.3rem] sm:max-w-[10rem]">
                                                            <div
                                                                className="text-gray-500 font-bold truncate"
                                                                style={{ fontFamily: "Poppins, sans-serif", maxWidth: "200px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                                                            >
                                                                {product.title}
                                                            </div>
                                                        </div>
                                                    </th>

                                                    <td
                                                        className="px-6 py-4 text-center font-bold text-green-600"
                                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                                    >
                                                        {product.price}
                                                    </td>

                                                    <td
                                                        className={`px-6 py-4 text-center font-bold text-red-600`}
                                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                                    >
                                                        {product.count}
                                                    </td>

                                                    <td
                                                        className={`px-6 py-4 text-center font-bold text-blue-600`}
                                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                                    >
                                                        {product.minAge != null ? product.minAge : 0}
                                                    </td>

                                                    

                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center">
                                                            <div
                                                                className="relative group inline-block"
                                                                onClick={() => handleViewDetailsClick(product)}
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
                            </div>

                            <div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
                                {pageNumber !== 1 ? (
                                    <span
                                        className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                                        onClick={() => {
                                            setPageNumber(pageNumber - 1);
                                            fetchProductRequests(cityId, storeId, pageNumber - 1, selectedStatus);
                                        }
                                        }
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

                                {productRequests.length >= pageSize && (
                                    <span
                                        className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                                        onClick={() => {
                                            setPageNumber(pageNumber + 1);
                                            fetchProductRequests(cityId, storeId, pageNumber + 1, selectedStatus); // Make sure to fetch with the new page number
                                        }}
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
                                    {stores.length < 5 ? (
                                        <div className="flex justify-center gap-2">
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

                            {storeId && productRequests.length === 0 && (
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
}

export default AllProductRequests;