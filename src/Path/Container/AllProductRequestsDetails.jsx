import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { useLocation, useNavigate } from 'react-router-dom';
import CONTAINERIMAGE from "../../assets/ContainerDefaultImage.jpeg";
import { status, statusByName } from "../../Constants/containerStatus";
import { updateProductRequests, getShelves, getUserRoleContainer } from "../../Services/containerApi";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import Alert from "../../Components/Alert";

const AllProductRequestsDetails = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [product, setProduct] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(statusByName.Pending);
    const [shelves, setShelves] = useState([]);
    const [selectedShelves, setSelectedShelves] = useState([]);
    const [maxCount, setMaxCount] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [visibleShelves, setVisibleShelves] = useState(4);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const [isOwner, setIsOwner] = useState(null);
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
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

    const [error, setError] = useState({
        maxCount: "",
        shelfSelection: ""
    });

    const validateInput = (name, value) => {
        if (name === "maxCount") {
            if (!value) {
                return t("pleaseEnterMaxCount");
            } else if (isNaN(value)) {
                return t("pleaseEnterValidNumber");
            } else {
                return "";
            }
        }
        return "";
    };

    const location = useLocation();
    const { cityId, storeId, productDetails } = location.state || {};

    useEffect(() => {
        if (productDetails) {
            setProduct(productDetails);
            setSelectedStatus(productDetails.status);
            setMaxCount(productDetails.maxCount || '');
        }
    }, [productDetails]);

    useEffect(() => {
        if (storeId && product) {
            getShelves(cityId, storeId).then((response) => {
                const filteredShelves = response.data.data.filter((shelf) => {
                    console.log("product" + product.productId)
                    if (product?.status === 1 || product?.status === 2) {
                        console.log("status" + product.status)
                        return (
                            shelf.productId !== null &&
                            (shelf.productId === product.productId)
                        );
                    }
                    console.log("product1" + product.productId)
                    return (
                        shelf.product === null ||
                        (shelf.product && shelf.product.id === product.productId)
                    );
                });

                setShelves(filteredShelves);

                const defaultSelectedShelves = filteredShelves
                    .filter((shelf) => shelf.product?.id === product.productId)
                    .map((shelf) => shelf.id);

                setSelectedShelves(defaultSelectedShelves);
            });
        }
    }, [cityId, storeId, product]);


    const handleStatusChange = (newStatus) => {
        setSelectedStatus(newStatus);
    };

    // Handle checkbox shelf selection
    const handleShelfSelection = (shelfId) => {
        const shelfIdNumber = Number(shelfId);
        if (selectedShelves.includes(shelfIdNumber)) {
            setSelectedShelves(selectedShelves.filter((id) => id !== shelfIdNumber));
        } else {
            setSelectedShelves([...selectedShelves, shelfIdNumber]);
        }
    };

    const handleMaxCountChange = (event) => {
        const value = event.target.value;
        setMaxCount(value === '' ? '' : Number(value));
    };

    const handleApprove = async () => {
        const maxCountError = validateInput("maxCount", maxCount);
        const shelfSelectionError = selectedShelves.length === 0 ? t("pleaseSelectAtLeastOneShelf") : "";
        setError((prevState) => ({
            ...prevState,
            maxCount: maxCountError,
            shelfSelection: shelfSelectionError
        }));

        if (maxCountError || shelfSelectionError) {
            return;
        }

        try {
            const status = statusByName.Active;
            await updateProductRequests(storeId, product.id, selectedShelves, status, maxCount);
            setSuccessMessage(t("productUpdated"));
            setErrorMessage('');
            setTimeout(() => {
                navigate('/OwnerScreen/AllProductRequests');
            }, 5000);
        } catch (error) {
            console.error("productUpdateFailed", error);
            setErrorMessage(t("productUpdateFailed"));
            setSuccessMessage('');
        }
    };

    const handleReject = async () => {
        try {
            const status = statusByName.Inactive;
            await updateProductRequests(storeId, product.id, selectedShelves, status, maxCount);
            setSuccessMessage(t("productUpdated"));
            setErrorMessage('');
            setTimeout(() => {
                navigate('/OwnerScreen/AllProductRequests');
            }, 5000);
        } catch (error) {
            console.error("productUpdateFailed", error);
            setErrorMessage(t("productUpdateFailed"));
            setSuccessMessage('');
        }
    };

    const showMoreShelves = () => {
        setVisibleShelves((prevVisible) => prevVisible + 4);
    };

    const showLessShelves = () => {
        setVisibleShelves(4);
    };

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto md:px-2 md:py-2 bg-gray-800 md:min-h-screen flex items-center justify-center">
                <div className="h-full bg-gray-200 shadow-md px-2 py-2 md:rounded-lg overflow-hidden text-center relative">
                    <div className="max-w-6xl bg-white mx-auto px-4 py-4 md:rounded-lg ">
                        <div className="flex flex-col md:flex-row -mx-4">
                            {product && (
                                <div key={product.id} className="mb-6 px-4">
                                    <h2 className="text-xl font-bold text-slate-800 mb-2">
                                        {t("requestId")} : {product.id}
                                    </h2>
                                    <p className="font-bold text-blue-600 text-sm mb-4">
                                        {t("orderDate")} : {new Date(product.createdAt).toLocaleDateString()}
                                    </p>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-2">{product.title}</h2>
                                    <div className="flex flex-col items-center justify-center mb-4">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <span className="font-bold text-slate-900">{t("price")} : </span>
                                                <span className="font-bold text-green-600">€ {product.price}</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-900">{t("count")} : </span>
                                                <span className="font-bold text-red-600">{product.count}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="md:flex mb-6"> */}
                                    <div className="mb-4">
                                        <div className="flex justify-center items-center">
                                            <div className="py-4">
                                                <img
                                                    className="object-cover text-center h-full w-full max-h-96 max-w-96"
                                                    src={product.productImages && product.productImages.length > 0
                                                        ? process.env.REACT_APP_BUCKET_HOST + product.productImages[0]
                                                        : process.env.REACT_APP_BUCKET_HOST + "admin/Container/ShoppingCart.png"}
                                                    onError={(e) => {
                                                        e.target.src = CONTAINERIMAGE;
                                                    }}
                                                />
                                            </div>
                                        </div>

                                        {product.status !== 2 && (
                                            <div className="p-4 bg-slate-200 bg-opacity-75 shadow-md">
                                                <div className="mb-8">
                                                    <label className="font-bold text-slate-900">
                                                        {product?.status === 1 || product?.status === 2 ? t("selectedShelf") : t("selectShelf")}
                                                    </label>
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 mt-2">
                                                        {shelves.slice(0, visibleShelves).map((shelf) => (
                                                            <div className="relative group" key={shelf.id}>
                                                                <div
                                                                    className={`cursor-pointer p-4 border rounded-lg text-center break-words truncate ${selectedShelves.includes(Number(shelf.id))
                                                                        ? 'bg-green-200 border-green-600 text-green-600' // Selected shelf
                                                                        : 'bg-blue-200 border-blue-600 text-blue-600' // Non-selected shelf
                                                                        }`}
                                                                    onClick={() => handleShelfSelection(shelf.id)}
                                                                >
                                                                    {shelf.title}
                                                                </div>

                                                                {/* Tooltip for full name on hover */}
                                                                <div className="absolute hidden group-hover:block bg-gray-700 text-white text-sm p-2 rounded-lg shadow-md w-max max-w-xs z-10 top-full left-1/2 transform -translate-x-1/2 mt-2">
                                                                    {shelf.title}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <div className="h-[24px] text-red-600">
                                                        {error.shelfSelection}
                                                    </div>

                                                    <div className="flex justify-center mt-4">
                                                        {visibleShelves < shelves.length && (
                                                            <button
                                                                type="button"
                                                                className="flex items-center text-blue-600 hover:text-blue-400"
                                                                onClick={showMoreShelves}
                                                            >
                                                                <span>{t("showMore")}</span>
                                                                <FaArrowDown className="ml-1" />
                                                            </button>
                                                        )}
                                                        {visibleShelves > 4 && (
                                                            <button
                                                                type="button"
                                                                className="flex items-center text-blue-600 hover:text-blue-400 ml-4"
                                                                onClick={showLessShelves}
                                                            >
                                                                <span>{t("showLess")}</span>
                                                                <FaArrowUp className="ml-1" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Max count input */}
                                                <div className="mb-8">
                                                    <label className="font-bold text-slate-900">{t("maxCount")}</label>
                                                    <input
                                                        type="number"
                                                        className="border font-sans border-blue-600 text-blue-600 sm:text-sm rounded-xl p-2.5 w-full"
                                                        value={maxCount === 0 ? '' : maxCount}
                                                        onChange={handleMaxCountChange}
                                                        onBlur={handleMaxCountChange}
                                                    />
                                                    <div
                                                        className="h-[24px] text-red-600"
                                                        style={{
                                                            visibility: error.maxCount ? "visible" : "hidden",
                                                        }}
                                                    >
                                                        {error.maxCount}
                                                    </div>
                                                </div>

                                                {/* Status dropdown */}
                                                {product.status === 0 && (
                                                    <div className="relative w-full text-center">
                                                        <button
                                                            className="text-white bg-blue-800 hover:bg-blue-400 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                                                            type="button"
                                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                                        >
                                                            {status[selectedStatus]} <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                        </button>
                                                        {dropdownOpen && (
                                                            <div className="relative w-full text-center bg-white rounded-xl text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4">
                                                                <ul className="py-1">
                                                                    {Object.entries(status).map(([key, value]) => (
                                                                        <li key={key}>
                                                                            <button
                                                                                onClick={() => {
                                                                                    handleStatusChange(parseInt(key));
                                                                                    setDropdownOpen(false);
                                                                                }}
                                                                                className="text-sm hover:bg-blue-400 text-slate-700 block px-4 py-2 w-full text-left"
                                                                            >
                                                                                {value}
                                                                            </button>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {product.status === 0 && (
                                        <div className="mb-4">
                                            <div className="relative py-4 grid grid-cols-2 gap-4">
                                                <div className="relative w-full text-center">
                                                    <button
                                                        className="w-full bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-60"
                                                        onClick={handleApprove}
                                                    >
                                                        {t("approve")}
                                                    </button>
                                                </div>

                                                <div className="relative w-full text-center">
                                                    <button
                                                        className="w-full bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-60"
                                                        onClick={handleReject}
                                                    >
                                                        {t("reject")}
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="py-2 mt-1 px-2">
                                                {successMessage && (
                                                    <Alert type={"success"} message={successMessage} />
                                                )}
                                                {errorMessage && <Alert type={"danger"} message={errorMessage} />}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AllProductRequestsDetails;