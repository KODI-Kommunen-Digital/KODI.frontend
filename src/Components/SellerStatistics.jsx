import React from 'react';
import { useTranslation } from "react-i18next";
import PropTypes from 'prop-types';

const SellerStatistics = ({ totalRevenue, topProductNameByQuantity, totalQuantitySold, averagePricePerQuantity }) => {
    const { t } = useTranslation();
    return (
        <section className="text-slate-800 body-font bg-slate-300">
            <div className="bg-slate-300 mt-0 space-y-0 overflow-x-auto">
                <div className="w-full text-sm text-left text-slate-500 p-0 space-y-10 rounded-xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 gap-0 mt-0">
                        <a className=" bg-blue-200 flex flex-col p-5 border-b-4 border-r-4 border-blue-600">
                            <div className="flex justify-start">
                                <div className="flex items-center justify-center h-10 w-10 bg-blue-200 rounded-full border-2 border-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-full flex-1 mt-3 text-base text-slate-800">{t("totalRevenue")}</div>
                            <div className="w-full flex-1 mt-3 text-3xl font-bold leading-8 text-slate-800">€ {totalRevenue || t("noData")}</div>
                        </a>
                        <a className=" bg-yellow-200 flex flex-col p-5 border-b-4 border-r-4 border-yellow-600">
                            <div className="flex justify-start">
                                <div className="flex items-center justify-center h-10 w-10 bg-yellow-200 rounded-full border-2 border-yellow-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-full flex-1 mt-3 text-base text-slate-800">{t("totalQuantity")}</div>
                            <div className="w-full flex-1 mt-3 text-3xl font-bold leading-8 text-slate-800">{totalQuantitySold || t("noData")}</div>
                        </a>
                        <a className=" bg-pink-200 flex flex-col p-5 border-b-4 border-r-4 border-pink-600">
                            <div className="flex justify-start">
                                <div className="flex items-center justify-center h-10 w-10 bg-pink-200 rounded-full border-2 border-pink-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-pink-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-full flex-1 mt-3 text-base text-slate-800">{t("avgPrice")}</div>
                            <div className="w-full flex-1 mt-3 text-3xl font-bold leading-8 text-slate-800">€ {averagePricePerQuantity || t("noData")}</div>
                        </a>
                        <a className=" bg-green-200 flex flex-col p-5 border-b-4 border-r-4 border-green-600">
                            <div className="flex justify-start">
                                <div className="flex items-center justify-center h-10 w-10 bg-green-200 rounded-full border-2 border-green-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-full flex-1 mt-3 text-base text-slate-800">{t("topSelling")}</div>
                            <div className="w-full flex-1 mt-3 text-3xl font-bold leading-8 text-slate-800">{topProductNameByQuantity || t("noData")}</div>
                        </a>
                    </div>

                </div>
            </div>
        </section>
    );
}

SellerStatistics.propTypes = {
    totalRevenue: PropTypes.number.isRequired,
    topProductNameByQuantity: PropTypes.string.isRequired,
    totalQuantitySold: PropTypes.number.isRequired,
    averagePricePerQuantity: PropTypes.number.isRequired,
};

export default SellerStatistics;