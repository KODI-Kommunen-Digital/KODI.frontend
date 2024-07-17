import React from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar";
import "../../index.css";
import { useTranslation } from "react-i18next";
// import RegionColors from "../../Components/RegionColors";
import PRODUCTSIMAGE from "../../assets/products.png";
import SHELFIMAGE from "../../assets/shelf.png";
import SELLERSIMAGE from "../../assets/sellers.png";
import ORDERSIMAGE from "../../assets/orders.png";

const SellerScreen = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />
            <div className="container w-auto px-5 py-5 bg-gray-800 min-h-screen flex flex-col justify-center items-center">
                <div className="h-full">
                    <div className="h-full bg-gray-800">
                        <div className="mx-auto lg:px-20" >
                            <div className='grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 h-full pb-40'
                            >
                                <div className="border-r border-purple-600 m-4 lg:pl-0"
                                    onClick={() => {
                                        navigateTo("/OwnerScreen/ProductStore");
                                    }}
                                >
                                    <div className=" py-10 pb-3 h-full relative bg-purple-100 group hover:bg-purple-200 cursor-pointer transition ease-out duration-300">
                                        <div>
                                            <img src={PRODUCTSIMAGE} />
                                        </div>
                                        <div className="px-7 mt-20">
                                            <h1 className="text-3xl font-bold group-hover:text-purple-300 transition ease-out duration-300">01.</h1>
                                            <h2 className="text-1xl mt-4 font-bold">{t("products")}</h2>
                                            <p className="mt-2 opacity-60 group-hover:opacity-70 ">{t("productsDescription")}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-r border-purple-600 m-4 lg:pl-0"
                                    onClick={() => {
                                        navigateTo("/OwnerScreen/Shelves");
                                    }}
                                >
                                    <div className=" py-10  pb-3 h-full relative bg-indigo-100 group hover:bg-indigo-200 cursor-pointer transition ease-out duration-300">
                                        <div>
                                            <img src={SHELFIMAGE} />
                                        </div>
                                        <div className="px-7 mt-20">
                                            <h1 className="text-3xl font-bold group-hover:text-indigo-300 transition ease-out duration-300">02.</h1>
                                            <h2 className="text-1xl mt-4 font-bold">{t("shelves")}</h2>
                                            <p className="mt-2 opacity-60 group-hover:opacity-70 ">{t("shelvesDescription")}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-r border-purple-600 m-4 lg:pl-0"
                                    onClick={() => {
                                        navigateTo("/OwnerScreen/AllSellers");
                                    }}
                                >
                                    <div className=" py-10 pb-3 h-full relative bg-red-100 group hover:bg-red-200 cursor-pointer transition ease-out duration-300">
                                        <div>
                                            <img src={SELLERSIMAGE} />
                                        </div>
                                        <div className="px-7 mt-20">
                                            <h1 className="text-3xl font-bold group-hover:text-red-300 transition ease-out duration-300">03.</h1>
                                            <h2 className="text-1xl mt-4 font-bold">{t("allSellers")}</h2>
                                            <p className="mt-2 opacity-60 group-hover:opacity-70 ">{t("allSellersDescription")}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-r border-purple-600 m-4 lg:pl-0"
                                    onClick={() => {
                                        navigateTo("/OwnerScreen/AllOrders");
                                    }}
                                >
                                    <div className=" py-10 pb-3 h-full relative bg-emerald-100 group hover:bg-emerald-200 cursor-pointer transition ease-out duration-300">
                                        <div>
                                            <img src={ORDERSIMAGE} />
                                        </div>
                                        <div className="px-7 mt-20">
                                            <h1 className="text-3xl font-bold group-hover:text-emerald-300 transition ease-out duration-300">04.</h1>
                                            <h2 className="text-1xl mt-4 font-bold">{t("orders")}</h2>
                                            <p className="mt-2 opacity-60 group-hover:opacity-70 ">{t("ordersDescription")}</p>
                                        </div>
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

export default SellerScreen;