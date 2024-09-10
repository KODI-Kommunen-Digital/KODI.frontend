import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { useLocation } from "react-router-dom";
import CONTAINERIMAGE from "../../assets/ContainerDefaultImage.jpeg";

const OrderDetailsStore = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [orders, setOrders] = useState(null);

    const location = useLocation();
    const { orderDetails } = location.state || {};

    useEffect(() => {
        setOrders(orderDetails);
        console.log(orderDetails);
    }, [orderDetails]);

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-800 min-h-screen flex items-center justify-center">

                <div className="h-full bg-white shadow-md bg-opacity-75 px-8 py-16 rounded-lg overflow-hidden text-center relative">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row -mx-4">
                            {orders && (
                                <div key={orders.id} className="mb-6 px-4">
                                    <h2 className="text-xl font-bold text-gray-900  mb-2">
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
                                                            : process.env.REACT_APP_BUCKET_HOST +
                                                            "admin/Container/ShoppingCart.png"
                                                    }
                                                    onError={(e) => {
                                                        e.target.src = CONTAINERIMAGE;
                                                    }}
                                                />
                                            </div>
                                            <div className="px-4">
                                                <h2 className="text-2xl font-bold text-gray-900  mb-2">
                                                    {productItem.product.title}
                                                </h2>
                                                <div className="flex mb-4">
                                                    <div className="mr-4">
                                                        <span className="font-bold text-gray-900 ">
                                                            {t("price")} : </span>
                                                        <span className="font-bold text-green-600">
                                                            € {productItem.product.price}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-gray-900 ">
                                                            {t("tax")} : </span>
                                                        <span className="font-bold text-red-600">
                                                            {(productItem.product.tax * 100).toFixed(2)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-start mb-4">
                                                    <span className="font-bold text-gray-700">{t("description")} : </span>
                                                    <span className="text-gray-600"
                                                        dangerouslySetInnerHTML={{ __html: productItem.product.description }}>
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

            </div>
        </section>
    );
};

export default OrderDetailsStore;