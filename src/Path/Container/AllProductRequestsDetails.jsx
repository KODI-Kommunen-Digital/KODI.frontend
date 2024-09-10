import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { useLocation } from 'react-router-dom';
import CONTAINERIMAGE from "../../assets/ContainerDefaultImage.jpeg";
import { status, statusByName } from "../../Constants/containerStatus";
import { updateProductRequests } from "../../Services/containerApi";

const AllProductRequestsDetails = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [product, setProduct] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(statusByName.Pending);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const location = useLocation();
    const { productDetails, storeId } = location.state || {};

    useEffect(() => {
        if (productDetails) {
            setProduct(productDetails);
            setSelectedStatus(productDetails.status);
        }
    }, [productDetails]);

    const handleStatusChange = async (newStatus, shelfIds, productId) => {
        const shelfs = shelfIds || [];
        setSelectedStatus(newStatus);

        if (product) {
            try {
                await updateProductRequests(storeId, productId, shelfs, newStatus)
                setProduct((prevProduct) => ({
                    ...prevProduct,
                    status: newStatus,
                }));
            } catch (error) {
                console.error("Failed to update product status", error);
            }
        }
    };

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-800 min-h-screen flex items-center justify-center">


                <div className="h-full bg-white shadow-md bg-opacity-75 px-8 py-16 rounded-lg overflow-hidden text-center relative">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row -mx-4">
                            {product && (
                                <div key={product.id} className="mb-6 px-4">
                                    <h2 className="text-xl font-bold text-gray-800 mb-2">
                                        {t("orderId")} : {product.id}
                                    </h2>
                                    <p className="font-bold text-blue-600 text-sm mb-4">
                                        {t("orderDate")} : {new Date(product.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="md:flex mb-6">
                                        <div className="px-4 md:w-1/2">
                                            <img className="w-full h-full object-cover"
                                                src={product.productImages
                                                    && product.productImages.length > 0
                                                    ? process.env.REACT_APP_BUCKET_HOST +
                                                    product.productImages[0]
                                                    : process.env.REACT_APP_BUCKET_HOST +
                                                    "admin/Container/ShoppingCart.png"}

                                                onError={(e) => {
                                                    e.target.src = CONTAINERIMAGE;
                                                }} />
                                        </div>
                                        <div className="px-4 md:w-1/2">
                                            <h2 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h2>
                                            <div className="flex mb-4">
                                                <div className="mr-4">
                                                    <span className="font-bold text-gray-900 ">{t("price")} : </span>
                                                    <span className="font-bold text-green-600">€ {product.price}</span>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900 ">{t("count")} : </span>
                                                    <span className="font-bold text-red-600">€ {product.count}</span>
                                                </div>
                                            </div>
                                            <div className="flex mb-4">
                                                <div className="mr-4">
                                                    <span className="font-bold text-gray-900">{t("threshold")} : </span>
                                                    <span className="text-gray-600">{product.threshold}</span>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-900">{t("productId")} : </span>
                                                    <span className="text-gray-600 ">{product.productId}</span>
                                                </div>
                                            </div>

                                            <div className="text-start mb-4">
                                                <span className="font-bold text-gray-700">{t("description")} : </span>
                                                <span className="text-gray-600" dangerouslySetInnerHTML={{ __html: product.description }}></span>
                                            </div>

                                            <div className="relative w-full text-center">
                                                <div className="w-full inline-block">
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
                                                                                handleStatusChange(parseInt(key), product.shelfIds, product.id);
                                                                                setDropdownOpen(false);
                                                                            }}
                                                                            className="text-sm hover:bg-blue-400 text-gray-700 block px-4 py-2 w-full text-left"
                                                                        >
                                                                            {value}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
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