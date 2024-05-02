import React from "react";
import { useTranslation } from "react-i18next";
import HomePageNavBar from "../../Components/HomePageNavBar";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";
import { FiXCircle } from "react-icons/fi";

function BookingErrorConfirmation() {
    const { t } = useTranslation();
    window.scrollTo(0, 0);
    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <section className="text-gray-600 bg-white body-font relative">
            <HomePageNavBar />
            <div className="md:mt-40 mt-40 mb-20 p-6">
                <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
                    <div className="flex flex-col items-center mb-4 justify-center gap-4">
                        <FiXCircle className="text-red-500 mr-2" size={40} />
                        <h2 className="font-sans font-semibold text-black mb-1 text-3xl title-font">
                            {t("bookingError")}
                        </h2>
                    </div>
                    <br />
                    <p className="font-sans font-bold text-black mb-4 text-lg text-center title-font">
                        {t("bookingErrorMessage")}
                    </p>
                    <br />
                    <p className="font-sans font-semibold text-black mb-4 text-sm text-center title-font">
                        {t("lookForeward")}
                    </p>
                    <br />
                    <div className="mb-1 py-0 mt-1 px-0 text-center">
                        <a
                            onClick={() => navigateTo("/AppointmentBooking/MyBookings")}
                            className="relative w-full inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-black transition duration-300 ease-out border-2 border-black rounded-full shadow-md group">
                            <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-black group-hover:translate-x-0 ease">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                            </span>
                            <span className="absolute flex items-center justify-center w-full h-full text-black transition-all duration-300 transform group-hover:translate-x-full ease">{t("goToMyBookings")}</span>
                            <span className="relative invisible">
                                {t("goToMyBookings")}
                            </span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="bottom-0 w-full">
                <Footer />
            </div>
        </section>
    );
}

export default BookingErrorConfirmation;
