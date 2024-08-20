import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import CONTAINERIMAGE from "../../assets/ContainerDefaultImage.jpeg";
import { getOrderDetails } from "../../Services/containerApi";

const ProductDetailsStore = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [orders, setOrders] = useState(null);

    const fetchProducts = useCallback((orderId) => {
        getOrderDetails(orderId).then((response) => {
            setOrders(response.data.data);
            console.log(orders)
        });
    }, []);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = parseInt(urlParams.get("orderId"));
        if (orderId) {
            fetchProducts(orderId);
        }
    }, [fetchProducts]);

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-800 min-h-screen flex items-center justify-center">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row -mx-4">
                        {orders && (
                            <div key={orders.id} className="mb-6 px-4">
                                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                    {t("orderId")} : {orders.id}
                                </h2>
                                <p className="font-bold text-blue-600 text-sm mb-4">
                                    {t("orderDate")} : {new Date(orders.createdAt).toLocaleDateString()}
                                </p>
                                {orders.products && Array.isArray(orders.products) && orders.products.map(productItem => (
                                    <div key={productItem.id} className="md:flex mb-6">
                                        <div className="px-4">
                                            <img
                                                className="w-full h-full object-cover"
                                                src={
                                                    productItem.product.productImages &&
                                                        productItem.product.productImages.length > 0
                                                        ? productItem.product.productImages[0]
                                                        : CONTAINERIMAGE
                                                }
                                                alt={productItem.product.title}
                                            />
                                        </div>
                                        <div className="px-4">
                                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                                {productItem.product.title}
                                            </h2>
                                            <div className="flex mb-4">
                                                <div className="mr-4">
                                                    <span className="font-bold text-gray-700 dark:text-gray-300">
                                                        {t("price")} : </span>
                                                    <span className="font-bold text-green-600">
                                                        € {productItem.product.price}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-gray-700 dark:text-gray-300">
                                                        {t("tax")} : </span>
                                                    <span className="font-bold text-red-600">
                                                        {(productItem.product.tax * 100).toFixed(2)}%
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-300 ">{t("description")} : </span>
                                                <span className="font-bold text-gray-200 ">
                                                    {productItem.product.description}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </section>
    );
};

export default ProductDetailsStore;