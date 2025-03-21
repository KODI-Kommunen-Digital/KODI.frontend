import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import CONTAINERIMAGE from "../../assets/ContainerDefaultImage.jpeg";
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserRoleContainer } from "../../Services/containerApi";

const ProductDetailsStore = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [product, setProduct] = useState(null);

    const location = useLocation();
    const { productDetails } = location.state || {};

    useEffect(() => {
        if (productDetails) {
            setProduct(productDetails);
        }
    }, [productDetails]);

    const navigate = useNavigate();

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
        <section className="bg-gray-900 body-font relative min-h-screen">
            <SideBar />

            <div className="container w-auto md:px-2 md:py-2 bg-gray-800 md:min-h-screen flex items-center justify-center">
                <div className="max-w-6xl bg-white mx-auto px-4 py-4 md:rounded-lg">
                    <div className="flex flex-col md:flex-row -mx-4">
                        {product && (
                            <div key={product.id} className="mb-6 px-4">
                                <div className="md:px-4 py-4 md:py-0">
                                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                                        {t("productId")} : {product.id}
                                    </h2>
                                    <p className="font-bold text-blue-600 text-sm mb-4">
                                        {t("orderDate")} : {new Date(product.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="md:flex mb-6">
                                    <div className="md:px-4 py-4 md:py-0">
                                        <img className="object-cover object-center h-full w-full max-h-96 max-w-96"
                                            src={product.productImages &&
                                                product.productImages.length > 0
                                                ? process.env.REACT_APP_BUCKET_HOST + product.productImages[0] : process.env.REACT_APP_BUCKET_HOST +
                                                "admin/Container/ShoppingCart.png"}
                                            onError={(e) => {
                                                e.target.src = CONTAINERIMAGE;
                                            }} />
                                    </div>

                                    <div className="px-4 bg-gray-200 bg-opacity-75 shadow-md py-4">
                                        <h2 className="text-2xl font-bold text-slate-900 mb-2">{product.title}</h2>
                                        <p className="font-bold text-blue-600 text-sm mb-4">
                                            {new Date(product.createdAt).toLocaleDateString()}
                                        </p>
                                        <div className="flex mb-4 gap-4">
                                            <div>
                                                <span className="font-bold text-slate-700">{t("price")} : </span>
                                                <span className="font-bold text-green-600">€ {product.price}</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-700">{t("tax")} : </span>
                                                <span className="font-bold text-red-600">{(product.tax != null ? product.tax : 0).toFixed(2)}%</span>
                                            </div>
                                            <div>
                                                <span className="font-bold text-slate-900">{t("minAge")} : </span>
                                                <span className="font-bold text-blue-600">{product.minAge != null ? product.minAge : 0}</span>
                                            </div>
                                        </div>
                                        <div className="flex mb-4">
                                            {product?.minCount != null && product.minCount !== 0 && (
                                                <div className="mr-4">
                                                    <span className="font-bold text-slate-700 ">{t("minCount")} : </span>
                                                    <span className="text-slate-600 ">{product.minCount}</span>
                                                </div>
                                            )}
                                            {product?.maxCount != null && product.maxCount !== 0 && (
                                                <div>
                                                    <span className="font-bold text-slate-700 ">{t("maxCount")} : </span>
                                                    <span className="text-slate-600 ">{product.maxCount}</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="text-start mb-4"
                                            style={{
                                                maxHeight: "100px",
                                                overflow: "auto",
                                            }}
                                        >
                                            <span className="font-bold text-slate-700">{t("description")} : </span>
                                            <span className="text-slate-600" dangerouslySetInnerHTML={{ __html: product.description }}></span>
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

export default ProductDetailsStore;