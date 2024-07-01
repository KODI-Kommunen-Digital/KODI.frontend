import React from "react";
import SideBar from "../../Components/SideBar";
import { ProductsTest } from "../../Constants/productsForSale";
import { useTranslation } from "react-i18next";
import "../../index.css";
import CONTAINERIMAGE from "../../assets/ContainerDefaultImage.jpeg";
import RegionColors from "../../Components/RegionColors";

const ShoppingCart = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();

    const total = ProductsTest.reduce((acc, product) => {
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
        <section className="bg-gray-300 body-font relative h-screen">
            <SideBar />
            <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-300 min-h-screen flex flex-col">
                <div className="h-full">
                    <div className="bg-gray-300 mt-0 p-0 space-y-10 overflow-x-auto">
                        <h1 className="mb-10 text-center text-2xl font-bold">{t("cartItems")}</h1>
                        <div className="mx-auto max-w-5xl justify-center px-6 md:flex md:space-x-6 xl:px-0">
                            <div className="rounded-lg md:w-2/3">
                                {ProductsTest.map((product, index) => (
                                    <div key={index} className="justify-between mb-6 rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                                        <img src={
                                            product?.avatar
                                                ? product.avatar
                                                : CONTAINERIMAGE
                                        } className="w-full rounded-lg sm:w-40" />
                                        <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                                            <div className="mt-5">
                                                <h2 className="text-lg font-bold text-gray-900">{product.productName}</h2>
                                                <p className={`mt-1 text-md font-bold text-red-600`}>€ {product.price}</p>
                                                <p className="mt-1 text-xs text-gray-700">{product.cartId}</p>
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
                                        <p className="mb-1 text-lg font-bold">€ {grandTotal} EUR</p>
                                        <p className="text-sm text-gray-700">{t("includingVAT")}</p>
                                    </div>
                                </div>
                                <a
                                    className={`relative mt-6 w-full inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-indigo-600 transition duration-300 ease-out border-2 ${RegionColors.darkBorderColor} rounded-full shadow-md group cursor-pointer`}>
                                    <span className={`absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full ${RegionColors.darkBgColor} group-hover:translate-x-0 ease`}>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                                    </span>
                                    <span className={`absolute flex items-center justify-center w-full h-full ${RegionColors.darkTextColor} transition-all duration-300 transform group-hover:translate-x-full ease`}>{t("checkout")}</span>
                                    <span className="relative invisible">{t("checkout")}</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShoppingCart;