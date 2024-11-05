import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { useLocation, useNavigate } from "react-router-dom";
import CONTAINERIMAGE from "../../assets/ContainerDefaultImage.jpeg";
import { getUserRoleContainer } from "../../Services/containerApi";

const OrderDetailsStore = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [orders, setOrders] = useState(null);

    const location = useLocation();
    const { orderDetails } = location.state || {};

    const navigate = useNavigate();

    useEffect(() => {
        setOrders(orderDetails);
        console.log(orderDetails);
    }, [orderDetails]);

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

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto md:px-2 md:py-2 bg-gray-800 md:min-h-screen flex items-center justify-center">

                <div className="h-full bg-gray-200 shadow-md px-2 py-2 md:rounded-lg overflow-hidden text-center relative">
                    <div className="max-w-6xl bg-white mx-auto px-4 py-4 md:rounded-lg">
                        <div className="flex flex-col md:flex-row -mx-4">
                            {orders && (
                                <div key={orders.id} className="mb-6 px-4">
                                    <h2 className="text-xl font-bold text-slate-900  mb-2">
                                        {t("orderId")} : {orders.id}
                                    </h2>
                                    <p className="font-bold text-blue-600 text-sm mb-4">
                                        {t("orderDate")} : {new Date(orders.createdAt).toLocaleDateString()}
                                    </p>
                                    {orders.products && Array.isArray(orders.products) && orders.products.map(productItem => (
                                        <div key={productItem.id} className="md:flex mb-6">
                                            <div className="md:px-4 py-4 md:py-0">
                                                <img
                                                    className="object-cover object-center h-full w-full max-h-96"
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
                                            <div className="px-4 bg-gray-200 bg-opacity-75 shadow-md py-4">
                                                <h2 className="text-2xl font-bold text-slate-900  mb-2">
                                                    {productItem.product.title}
                                                </h2>
                                                <div className="flex mb-4">
                                                    <div className="mr-4">
                                                        <span className="font-bold text-slate-900 ">
                                                            {t("price")} : </span>
                                                        <span className="font-bold text-green-600">
                                                            € {productItem.product.price}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="font-bold text-slate-900 ">
                                                            {t("tax")} : </span>
                                                        <span className="font-bold text-red-600">
                                                            {(productItem.product.tax).toFixed(2)}%
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="text-start mb-4">
                                                    <span className="font-bold text-slate-700">{t("description")} : </span>
                                                    <span className="text-slate-600"
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