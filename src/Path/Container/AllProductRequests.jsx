import React, { useState, useEffect, useCallback } from 'react';
import SideBar from "../../Components/SideBar";
import { useNavigate } from 'react-router-dom';
import { getProductRequests, getShelves, getOwnerShops } from "../../Services/containerApi";
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
    const [shelves, setShelves] = useState([]);

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

    const fetchProductRequests = useCallback((cityId, storeId, pageNumber, selectedStatus) => {
        if (cityId && storeId) {
            getProductRequests(cityId, storeId, pageNumber, selectedStatus).then((response) => {
                setProductRequests(response.data.data);
            });
        }
    }, []);

    useEffect(() => {
        if (storeId) {
            const selectedStore = stores.find(store => store.id === parseInt(storeId));
            if (selectedStore) {
                fetchProductRequests(cityId, storeId, pageNumber, selectedStatus);
            }
        }
    }, [fetchProductRequests, cityId, storeId, pageNumber, selectedStatus]);

    const fetchShelves = useCallback((cityId, storeId) => {
        if (cityId && storeId) {
            getShelves(cityId, storeId).then((response) => {
                setShelves(response.data.data);
            });
        }
    }, []);

    useEffect(() => {
        fetchShelves(cityId, storeId);
    }, [fetchShelves, cityId, storeId]);

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
            fetchShelves(cityId, storeId);
        }
    };

    const handleShelfChange = async (productId, shelfId) => {
        const updatedProductRequests = productRequests.map(product => {
            if (product.id === productId) {
                return { ...product, shelfId: shelfId };
            }
            return product;
        });

        setProductRequests(updatedProductRequests);
    };

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    const handleViewDetailsClick = (product) => {
        navigate('/OwnerScreen/AllProductRequestsDetails', { state: { productDetails: product } });
    };

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
                                    <div
                                        className={`${selectedStatus === statusByName.Inactive ? "bg-gray-700 text-white" : "text-gray-300"
                                            } hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer`}
                                        onClick={() => setSelectedStatus(statusByName.Inactive)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {t("inactive")}
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
                                    <option value={statusByName.Active}>{t("active")}</option>
                                    <option value={statusByName.Pending}>{t("pending")}</option>
                                    <option value={statusByName.Inactive}>{t("inactive")}</option>
                                    {/* <option value={statusByName.ChangeRequested}>{t("changeRequested")}</option> */}
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
                        {stores.map((store) => (
                            <option className="font-sans" value={store.id} key={store.id}>
                                {store.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-800 min-h-screen flex flex-col">
                <div className="h-full">
                    {storeId && productRequests && productRequests.length > 0 ? (
                        <>
                            <div className="bg-white mt-0 p-0 space-y-10 overflow-x-auto">
                                <table className="w-full text-sm text-left lg:mt-[2rem] mt-[2rem] text-gray-500  p-6 space-y-10 rounded-lg">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "14.3%",
                                                }}
                                            >
                                                {t("title")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "14.3%",
                                                }}
                                            >
                                                {t("price")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "14.3%",
                                                }}
                                            >
                                                {t("count")}
                                            </th>

                                            {/* <th
                                                scope="col"
                                                className="px-6 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "14.3%",
                                                }}
                                            >
                                                {t("selectShelf")}
                                            </th> */}
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "14.3%",
                                                }}
                                            >
                                                {t("shelfName")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "14.3%",
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
                                                className="bg-white border-b hover:bg-gray-50"
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
                                                        }} />
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

                                                <td className="px-6 py-4">

                                                    <select
                                                        className="border font-sans border-gray-300 text-gray-500 sm:text-sm rounded-xl p-2.5 w-full"
                                                        onChange={(e) => handleShelfChange(product.id, e.target.value)}
                                                        value={product.shelfId || ''}
                                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                                    >
                                                        <option value="">{t("shelfName")}</option>
                                                        {shelves.map((shelf) => (
                                                            <option key={shelf.id} value={shelf.id}>
                                                                {shelf.title}
                                                            </option>
                                                        ))}
                                                    </select>
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

                                {productRequests.length >= pageSize && (
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
                                    <span className="text-gray-500 text-xl">{t("currently_no_products")}</span>
                                </div>
                            </center>
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

export default AllProductRequests;