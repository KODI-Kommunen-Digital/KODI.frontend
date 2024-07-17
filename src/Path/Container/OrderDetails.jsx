import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import CONTAINERIMAGE from "../../assets/ContainerDefaultImage.jpeg";
import RegionColors from "../../Components/RegionColors";
import { getOrderDetails } from "../../Services/containerApi";

const OrderDetails = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [, setMyOrders] = useState([]);

    const myOrders = [
        {
            id: 1,
            createdAt: "2024-03-01T04:30:00.000Z",
            updatedAt: "2024-03-01T04:30:00.000Z",
            deletedAt: "2024-03-01T04:30:00.000Z",
            title: "This is product1",
            description: "This is a seller",
            price: 1,
            tax: 1,
            shopId: 1,
            meta: "This is a seller",
            isActive: "This is in stock",
            archived: "archived",
            sellerId: 1,
            categoryId: 1,
            subCategoryId: 1,
            productImages: [
                "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Mangos_-_single_and_halved.jpg/330px-Mangos_-_single_and_halved.jpg"
            ]
        }
    ];

    const fetchMyOrders = useCallback(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const orderId = urlParams.get('orderId');

        getOrderDetails(orderId).then((response) => {
            setMyOrders(response.data.data);
        });
    }, []);

    useEffect(() => {
        fetchMyOrders();
    }, [fetchMyOrders]);

    const total = myOrders.reduce((acc, product) => {
        const price = parseFloat(product.price) || 0;
        const tax = parseFloat(product.tax) || 0;
        acc.price += price;
        acc.tax += tax;
        return acc;
    }, { price: 0, tax: 0 });

    const totalPrice = total.price;
    const totalTax = total.tax;
    const grandTotal = totalPrice + totalTax;

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />
            <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-800 min-h-screen flex flex-col">
                <div className="h-full">
                    <div className="bg-gray-800 mt-20 p-0 space-y-10 overflow-x-auto">
                        <h1 className="mb-10 text-center text-2xl font-bold">{t("myOrders")}</h1>
                        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                            <div className="rounded-lg md:w-2/3">
                                {myOrders.map((product, index) => (
                                    <div key={index} className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                                        <img src={product.productImages && product.productImages.length > 0 ? product.productImages[0] : CONTAINERIMAGE}
                                            className="w-full rounded-lg sm:w-40" />
                                        <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                            <div className="mt-5">
                                                <h2 className="text-lg font-bold text-gray-900">{product.title}</h2>
                                                <p className={`mt-1 text-md font-bold text-green-600`}>€ {product.price}</p>
                                                <p className="mt-1 text-xs font-bold text-blue-600">
                                                    {new Date(product.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div className="mt-5">
                                                <h2 className={`text-lg font-bold ${RegionColors.darkTextColor}`}>{product.description}</h2>
                                                <p className=" mt-1 text-md font-bold text-red-600 text-end">{t("tax")} : € {product.tax}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                            </div>

                            <div className="mt-6 h-full rounded-lg border bg-white p-6 shadow-md md:mt-0 md:w-1/3">
                                <div className="mb-2 flex justify-between">
                                    <p className="text-gray-700">{t("subTotal")}</p>
                                    <p className="text-gray-700">€ {totalPrice}</p>
                                </div>
                                <div className="flex justify-between">
                                    <p className="text-gray-700">{t("tax")}</p>
                                    <p className="text-gray-700">€ {totalTax}</p>
                                </div>
                                <hr className="my-4" />
                                <div className="flex justify-between">
                                    <p className="text-lg font-bold">{t("total")}</p>
                                    <div className="">
                                        <p className="mb-1 text-lg font-bold text-end">€ {grandTotal} EUR</p>
                                        <p className="text-sm text-gray-700 text-end">{t("includingVAT")}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default OrderDetails;