import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar";
import "../../index.css";
import { useTranslation } from "react-i18next";
import { getUserRoleContainer } from "../../Services/containerApi";

const SellerScreen = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    const [isOwner, setIsOwner] = useState(null);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const accessToken =
                    window.localStorage.getItem("accessToken") ||
                    window.sessionStorage.getItem("accessToken");
                const refreshToken =
                    window.localStorage.getItem("refreshToken") ||
                    window.sessionStorage.getItem("refreshToken");

                if (!accessToken && !refreshToken) {
                    navigate("/login");
                    return;
                }

                const roleResponse = await getUserRoleContainer();
                const roles = roleResponse.data.data.map(Number);

                setIsOwner(roles.includes(101));
            } catch {
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

    return (
        <section className="bg-gray-900 body-font relative min-h-screen">
            <SideBar />
            <div className="container w-auto px-5 py-5 bg-gray-900 min-h-screen flex flex-col justify-center items-center">
                <div className="h-full">
                    <div className="grid lg:grid-cols-2 md:grid-cols-2 grid-cols-1 -m-4">
                        <div className="border-r-4 shadow-md shadow-indigo-500/20 border-indigo-700 hover:border-indigo-600 m-4 lg:pl-0 rounded-t-xl rounded-b-xl"
                            onClick={() => {
                                navigateTo("/OwnerScreen/ProductStore");
                            }}
                        >
                            <div className="py-10 pb-3 shadow-md rounded-lg h-full relative bg-gray-800 group hover:bg-gray-700 cursor-pointer transition ease-out duration-300">
                                <div className="px-7 mt-20">
                                    <h1 className="text-3xl font-bold text-gray-400 transition ease-out duration-300">01.</h1>
                                    <h2 className="text-1xl mt-4 font-bold text-gray-300">{t("products")}</h2>
                                    <p className="mt-2 opacity-60 text-gray-300">{t("productsDescription")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-r-4 shadow-md shadow-indigo-500/20 border-indigo-700 hover:border-indigo-600 m-4 lg:pl-0 rounded-t-xl rounded-b-xl"
                            onClick={() => {
                                navigateTo("/OwnerScreen/Shelves");
                            }}
                        >
                            <div className="py-10 pb-3 shadow-md rounded-lg h-full relative bg-gray-800 group hover:bg-gray-700 cursor-pointer transition ease-out duration-300">
                                <div className="px-7 mt-20">
                                    <h1 className="text-3xl font-bold text-gray-400 transition ease-out duration-300">02.</h1>
                                    <h2 className="text-1xl mt-4 font-bold text-gray-300">{t("shelves")}</h2>
                                    <p className="mt-2 opacity-60 text-gray-300">{t("shelvesDescription")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-r-4 shadow-md shadow-indigo-500/20 border-indigo-700 hover:border-indigo-600 m-4 lg:pl-0 rounded-t-xl rounded-b-xl"
                            onClick={() => {
                                navigateTo("/OwnerScreen/AllOrders");
                            }}
                        >
                            <div className="py-10 pb-3 shadow-md rounded-lg h-full relative bg-gray-800 group hover:bg-gray-700 cursor-pointer transition ease-out duration-300">
                                <div className="px-7 mt-20">
                                    <h1 className="text-3xl font-bold text-gray-400 transition ease-out duration-300">03.</h1>
                                    <h2 className="text-1xl mt-4 font-bold text-gray-300">{t("orders")}</h2>
                                    <p className="mt-2 opacity-60 text-gray-300">{t("ordersDescription")}</p>
                                </div>
                            </div>
                        </div>

                        <div className="border-r-4 shadow-md shadow-indigo-500/20 border-indigo-700 hover:border-indigo-600 m-4 lg:pl-0 rounded-t-xl rounded-b-xl"
                            onClick={() => {
                                navigateTo("/OwnerScreen/AllProductRequests");
                            }}
                        >
                            <div className="py-10 pb-3 shadow-md rounded-lg h-full relative bg-gray-800 group hover:bg-gray-700 cursor-pointer transition ease-out duration-300">
                                <div className="px-7 mt-20">
                                    <h1 className="text-3xl font-bold text-gray-400 transition ease-out duration-300">04.</h1>
                                    <h2 className="text-1xl mt-4 font-bold text-gray-300">{t("productRequests")}</h2>
                                    <p className="mt-2 opacity-60 text-gray-300">{t("productRequestsDescription")}</p>
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