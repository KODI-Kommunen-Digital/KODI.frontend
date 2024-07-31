import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { useLocation } from 'react-router-dom';
import CONTAINERIMAGE from "../../assets/ContainerDefaultImage.jpeg";

const AllProductRequestsDetails = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [product, setProduct] = useState(null);

    const location = useLocation();
    const { productDetails } = location.state || {};

    useEffect(() => {
        setProduct(productDetails);
    }, [productDetails]);

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-800 min-h-screen flex items-center justify-center">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row -mx-4">
                        {product && (
                            <div key={product.id} className="mb-6 px-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                    {t("orderId")} : {product.id}
                                </h2>
                                <p className="font-bold text-blue-600 text-sm mb-4">
                                    {t("orderDate")} : {new Date(product.createdAt).toLocaleDateString()}
                                </p>
                                <div className="md:flex mb-6">
                                    <div className="px-4 md:w-1/2">
                                        <img className="w-full h-full object-cover" src={product.productImages && product.productImages.length > 0 ? process.env.REACT_APP_BUCKET_HOST +
                                            product.productImages[0] : CONTAINERIMAGE} alt={product.title} />
                                    </div>
                                    <div className="px-4 md:w-1/2">
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{product.title}</h2>
                                        <p className="font-bold text-blue-600 text-sm mb-4">
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="flex mb-4">
                                            <div className="mr-4">
                                                <span className="font-bold text-gray-300 ">{t("price")} : </span>
                                                <span className="font-bold text-green-600">€ {product.price}</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-300 ">{t("count")} : </span>
                                                <span className="font-bold text-red-600">€ {product.count}</span>
                                            </div>
                                        </div>
                                        <div className="flex mb-4">
                                            <div className="mr-4">
                                                <span className="font-bold text-gray-300">{t("threshold")} : </span>
                                                <span className="font-bold text-gray-200">{product.threshold}</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-300">{t("productId")} : </span>
                                                <span className="font-bold text-gray-200 ">{product.productId}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="font-bold text-gray-300 ">{t("description")} : </span>
                                            <span className="font-bold text-gray-200 ">
                                                {product.description}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default AllProductRequestsDetails;