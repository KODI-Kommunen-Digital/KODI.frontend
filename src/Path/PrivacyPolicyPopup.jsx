import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const PrivacyPolicyPopup = ({ onClose }) => {
    const [isOpen, setIsOpen] = useState(true);
    const { t } = useTranslation();
    const [isFirstPopupOpen, setIsFirstPopupOpen] = useState(true);
    const [isSecondPopupOpen, setIsSecondPopupOpen] = useState(false);

    useEffect(() => {
        setIsFirstPopupOpen(true);
        setIsSecondPopupOpen(false);
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        onClose();
    };

    const handleReturn = () => {
        setIsFirstPopupOpen(true);
        setIsSecondPopupOpen(false);
    };

    const handleOpenSecondPopup = () => {
        setIsSecondPopupOpen(true);
        setIsFirstPopupOpen(false);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div>
            {isFirstPopupOpen && (
                <div
                    className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-20 ${
                        isOpen ? "" : "hidden"
                    }`}
                >
                    <div className="bg-white p-6 lg:rounded-md fixed top-0 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-center gap-4 py-2 px-4 mt-4 mx-auto">
                            <div className="text-center">
                                <img
                                    className="mx-auto h-10 w-auto cursor-pointer"
                                    src={process.env.REACT_APP_BUCKET_HOST + "admin/logo.png"}
                                    alt="HEDI- Heimat Digital"
                                />
                            </div>
                            <h2 className="text-gray-900 text-2xl mb-0 font-extrabold title-font">
                                {t("privacypolicy")}
                            </h2>
                        </div>

                        <div className="p-0 mt-0 mb-0 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center sm:w-[50rem] md:w-[40rem] lg:w-[50rem]">
                            <div className="p-2">
                                <p className="font-semibold my-4">{t("privacypolicyp1")}</p>
                                <p className="font-semibold my-4">
                                    {t("privacypolicyp2")}
                                    <a
                                        href="/PrivacyPolicy"
                                        className="text-blue-800 font-semibold"
                                    >
                                        {t("privacypolicyp5")}
                                    </a>
                                    {t("privacypolicyp6")}
                                    <a
                                        href="/PrivacyPolicy"
                                        className="text-blue-800 font-semibold"
                                    >
                                        {t("privacypolicyp7")}
                                    </a>
									.
                                </p>
                            </div>
                            <div className="p-2">
                                <h3 className="text-lg font-semibold mt-4">
                                    {t("privacypolicyh1")}
                                </h3>
                                <p className="font-semibold">{t("privacypolicyp3")}</p>

                                <div className="flex items-center">
                                    {/* <input type="checkbox" id="externalMediaCheckbox" className="mr-2" /> */}
                                    <h3 className="text-lg font-semibold mt-4">
                                        {t("privacypolicyh2")}
                                    </h3>
                                </div>
                                <p className="font-semibold">{t("privacypolicyp4")}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-2 justify-center">
                            <button
                                onClick={handleClose}
                                className="w-full mt-4 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
                                id="finalbutton"
                            >
                                {t("acceptAll")}
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full mt-4 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
                                id="finalbutton"
                            >
                                {t("acceptessential")}
                            </button>
                            <button
                                onClick={handleOpenSecondPopup}
                                className="w-full mt-4 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
                                id="finalbutton"
                            >
                                {t("individualprivicy")}
                            </button>
                        </div>
                        <p className="text-sm font-normal mt-4 mb-2 text-center">
                            <a href="/PrivacyPolicy">{t("dataprotection")}</a> |{" "}
                            <a href="/ImprintPage">{t("imprint")}</a>{" "}
                        </p>
                    </div>
                </div>
            )}

            {isSecondPopupOpen && (
                <div
                    className={`fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-20 ${
                        isSecondPopupOpen ? "" : "hidden"
                    }`}
                >
                    <div className="bg-white p-6 lg:rounded-md fixed top-0 overflow-y-auto max-h-[90vh]">
                        <div className="flex justify-center gap-4 py-2 px-4 mt-4 mx-auto">
                            <div className="text-center">
                                <img
                                    className="mx-auto h-10 w-auto cursor-pointer"
                                    src={process.env.REACT_APP_BUCKET_HOST + "admin/logo.png"}
                                    alt="HEDI- Heimat Digital"
                                />
                            </div>
                            <h2 className="text-gray-900 text-2xl mb-0 font-extrabold title-font">
                                {t("privacypolicy")}
                            </h2>
                        </div>

                        <div className="p-0 mt-0 mb-0 grid grid-cols-1 sm:grid-cols-1 gap-4 justify-center sm:w-[50rem] md:w-[40rem] lg:w-[50rem]">
                            <div className="p-2 font-semibold">
                                <p className="font-semibold my-4">
                                    {t("privacypolicyp8")}{" "}
                                    <a
                                        href="/PrivacyPolicy"
                                        className="text-blue-800 font-semibold"
                                    >
                                        {t("privacypolicyp9")}
                                    </a>
                                    {t("privacypolicyp10")}
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 justify-center">
                            <button
                                onClick={handleClose}
                                className="w-full hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded bg-black disabled:opacity-60"
                                id="finalbutton"
                            >
                                {t("acceptAll")}
                            </button>
                            <button
                                onClick={handleClose}
                                className="w-full hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded bg-black disabled:opacity-60"
                                id="finalbutton"
                            >
                                {t("acceptessential")}
                            </button>
                            <button
                                onClick={handleReturn}
                                className="w-full mt-4 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
                                id="finalbutton"
                            >
                                {t("return")}
                            </button>
                        </div>

                        <div className="p-0 mt-0 mb-0 grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center sm:w-[50rem] md:w-[40rem] lg:w-[50rem]">
                            <div className="bg-gray-200 items-center mt-4 p-2 rounded-md">
                                <h3 className="text-lg font-semibold mb-2">
                                    {t("privacypolicyh3")}
                                </h3>
                                <p className="font-semibold">{t("privacypolicyp11")}</p>
                            </div>

                            <div className="bg-gray-200 items-center mt-4 p-2 rounded-md">
                                <h3 className="text-lg font-semibold mb-0">
                                    {t("privacypolicyh4")}
                                </h3>
                                <p className="font-semibold">{t("privacypolicyp12")}</p>
                            </div>
                        </div>

                        <p className="text-sm font-normal mt-4 mb-2 text-center">
                            {" "}
							Cookie Details | <a href="/PrivacyPolicy">
								Data protection
                            </a> | <a href="/ImprintPage">Imprint</a>{" "}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

PrivacyPolicyPopup.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default PrivacyPolicyPopup;
