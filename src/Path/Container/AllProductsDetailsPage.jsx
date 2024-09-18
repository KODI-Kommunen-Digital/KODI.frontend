import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import CONTAINERIMAGE from "../../assets/ContainerDefaultImage.jpeg";
import { useLocation } from 'react-router-dom';

const AllProductsDetailsPage = () => {
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

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto md:px-2 md:py-2 bg-gray-800 md:min-h-screen flex items-center justify-center">

                <div className="h-full bg-gray-200 shadow-md px-2 py-2 md:rounded-lg overflow-hidden text-center relative">
                    <div className="max-w-6xl bg-white mx-auto px-4 py-4 md:rounded-lg">
                        <div className="flex flex-col md:flex-row -mx-4">
                            {product && (
                                <div key={product.id} className="mb-6 px-4">
                                    <h2 className="text-xl font-bold text-slate-900 mb-2">
                                        {t("orderId")} : {product.id}
                                    </h2>
                                    <p className="font-bold text-blue-600 text-sm mb-4">
                                        {t("orderDate")} : {new Date(product.createdAt).toLocaleDateString()}
                                    </p>
                                    <div className="md:flex mb-6">
                                        <div className="md:px-4 py-4 md:py-0">
                                            <img className="object-contain object-center h-full w-full max-h-96"
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
                                            <div className="flex mb-4">
                                                <div className="mr-4">
                                                    <span className="font-bold text-slate-700">{t("price")} : </span>
                                                    <span className="font-bold text-green-600">€ {product.price}</span>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-slate-700">{t("tax")} : </span>
                                                    <span className="font-bold text-red-600">{(product.tax * 100).toFixed(2)}%</span>
                                                </div>
                                            </div>
                                            <div className="flex mb-4">
                                                {product?.minCount && (
                                                    <div className="mr-4">
                                                        <span className="font-bold text-slate-700 ">{t("minCount")} : </span>
                                                        <span className="text-slate-600 ">{product.minCount}</span>
                                                    </div>
                                                )}
                                                {product?.maxCount && (
                                                    <div>
                                                        <span className="font-bold text-slate-700 ">{t("maxCount")} : </span>
                                                        <span className="text-slate-600 ">{product.maxCount}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="text-start mb-4">
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

            </div>

        </section>
    );
};

export default AllProductsDetailsPage;