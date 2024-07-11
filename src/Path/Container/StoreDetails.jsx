import React from "react";
// import { useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar";
import "../../index.css";
import { useTranslation } from "react-i18next";
// import RegionColors from "../../Components/RegionColors";

const SellerScreen = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();

    // const navigate = useNavigate();
    // const navigateTo = (path) => {
    //     if (path) {
    //         navigate(path);
    //     }
    // };

    return (
        <section className="bg-red-50 body-font relative h-screen">
            <SideBar />
            <div className="container w-auto px-5 py-5 bg-red-50 min-h-screen flex flex-col justify-center items-center">
                <div className="h-full">
                    <div className="h-full bg-red-50">
                        <div className="mx-auto lg:px-20" >
                            <div className='grid grid-cols-4 h-full pb-40'>
                                <div className="border-r border-purple-600 mx-3 lg:pl-0">
                                    <div className=" py-10 pb-3 h-full relative bg-purple-100 group hover:bg-purple-200 cursor-pointer transition ease-out duration-300">
                                        {/* <div>
                                            <img src="https://i.ibb.co/FzkhpcD/pngegg.png" alt="https://www.pngegg.com/en/png-nllal/download" />
                                        </div> */}
                                        <div className="px-7 mt-20">
                                            <h1 className="text-3xl font-bold group-hover:text-purple-300 transition ease-out duration-300">01.</h1>
                                            <h2 className="text-1xl mt-4 font-bold">{t("products")}</h2>
                                            <p className="mt-2 opacity-60 group-hover:opacity-70 ">Best selection of scandinavia couch for your home</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-r border-indigo-600 mx-3 lg:pl-0">
                                    <div className=" py-10  pb-3 h-full relative bg-indigo-100 group hover:bg-indigo-200 cursor-pointer transition ease-out duration-300">
                                        {/* <div>
                                            <img src="https://i.ibb.co/JB4GWMJ/pngegg-1.png" alt="https://www.pngegg.com/en/png-zquqj/download" />
                                        </div> */}
                                        <div className="px-7 mt-20">
                                            <h1 className="text-3xl font-bold group-hover:text-indigo-300 transition ease-out duration-300">02.</h1>
                                            <h2 className="text-1xl mt-4 font-bold">{t("shelfs")}</h2>
                                            <p className="mt-2 opacity-60 group-hover:opacity-70 ">Best selection of scandinavia couch for your home</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-r border-red-600 mx-3 lg:pl-0">
                                    <div className=" py-10 pb-3 h-full relative bg-red-100 group hover:bg-red-200 cursor-pointer transition ease-out duration-300">
                                        {/* <div>
                                            <img src="https://i.ibb.co/MgnH44p/pngegg-2.png" alt="https://www.pngegg.com/en/png-epwii/download" />
                                        </div> */}
                                        <div className="px-7 mt-20">
                                            <h1 className="text-3xl font-bold group-hover:text-red-300 transition ease-out duration-300">03.</h1>
                                            <h2 className="text-1xl mt-4 font-bold">{t("allSellers")}</h2>
                                            <p className="mt-2 opacity-60 group-hover:opacity-70 ">Best selection of scandinavia couch for your home</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-r border-emerald-600 mx-3 lg:pl-0">
                                    <div className=" py-10 pb-3 h-full relative bg-emerald-100 group hover:bg-emerald-200 cursor-pointer transition ease-out duration-300">
                                        {/* <div>
                                            <img src="https://i.ibb.co/MgnH44p/pngegg-2.png" alt="https://www.pngegg.com/en/png-epwii/download" />
                                        </div> */}
                                        <div className="px-7 mt-20">
                                            <h1 className="text-3xl font-bold group-hover:text-emerald-300 transition ease-out duration-300">04.</h1>
                                            <h2 className="text-1xl mt-4 font-bold">{t("orders")}</h2>
                                            <p className="mt-2 opacity-60 group-hover:opacity-70 ">Best selection of scandinavia couch for your home</p>
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