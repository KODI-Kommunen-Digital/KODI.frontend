import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { useLocation } from 'react-router-dom';
import { updateSeller } from "../../Services/containerApi";
import { status, statusByName } from "../../Constants/containerStatus";

const SellerDetailsStore = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [seller, setSeller] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState(status);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const filteredStatus = status
        ? Object.fromEntries(Object.entries(status).filter(([key]) => parseInt(key) !== statusByName.ChangeRequested))
        : status;

    const location = useLocation();
    const { sellerDetails, cityId } = location.state || {};

    useEffect(() => {
        if (sellerDetails) {
            setSeller(sellerDetails);
            setSelectedStatus(sellerDetails.status); // Assuming sellerDetails.status contains the status
        }
    }, [sellerDetails]);

    const handleStatusChange = async (newStatus) => {
        setSelectedStatus(newStatus);

        if (seller) {
            try {
                await updateSeller(cityId, seller.id, newStatus, seller.title, seller.description);
                setSeller((prevSeller) => ({
                    ...prevSeller,
                    status: newStatus,
                }));
            } catch (error) {
                console.error("Failed to update seller status", error);
            }
        }
    };

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-800 min-h-screen flex items-center justify-center">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row -mx-4">
                        {seller && (
                            <>
                                <div className="h-full bg-white shadow-md bg-opacity-75 px-8 py-16 rounded-lg overflow-hidden text-center relative">
                                    <div className="md:flex">
                                        <div className="px-4">
                                            <h2 className="text-xl font-bold text-gray-900 mb-6">
                                                {seller.title}
                                            </h2>

                                            <div className="text-center mb-6">
                                                <span className="font-bold text-gray-700">{t("description")} : </span>
                                                <span className="text-gray-600" dangerouslySetInnerHTML={{ __html: seller.description }}></span>
                                            </div>

                                            <div className="relative w-full text-center">
                                                <div className="w-full inline-block">
                                                    <button
                                                        className="text-white bg-blue-800 hover:bg-blue-400 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center"
                                                        type="button"
                                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                                    >
                                                        {filteredStatus[selectedStatus]} <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                                    </button>
                                                    {dropdownOpen && (
                                                        <div className="relative w-full text-center bg-white rounded-xl text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4">
                                                            <ul className="py-1">
                                                                {Object.entries(filteredStatus).map(([key, value]) => (
                                                                    <li key={key}>
                                                                        <button
                                                                            onClick={() => {
                                                                                handleStatusChange(parseInt(key));
                                                                                setDropdownOpen(false);
                                                                            }}
                                                                            className="text-sm hover:bg-blue-400 text-gray-700 block px-4 py-2 w-full text-left"
                                                                        >
                                                                            {value}
                                                                        </button>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SellerDetailsStore;