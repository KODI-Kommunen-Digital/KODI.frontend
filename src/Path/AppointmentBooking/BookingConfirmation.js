import React from "react";
import { FiCheckCircle } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import HomePageNavBar from "../../Components/HomePageNavBar";
import Footer from "../../Components/Footer";

function BookingConfirmation() {
  const { t } = useTranslation();

  return (
    <section className="text-gray-600 bg-white body-font relative">
      <HomePageNavBar />
      <div className="md:mt-40 mt-40 mb-20 p-6">
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-xl">
          <div className="flex items-center mb-4 justify-center gap-4">
            <FiCheckCircle className="text-green-500 mr-2" size={40} />
            <h2 className="font-sans font-semibold text-black mb-1 text-3xl title-font">
              {t("bookingSuccess")}
            </h2>
          </div>
          <br />
          <p className="font-sans font-bold text-black mb-4 text-lg text-center title-font">
            {t("thanks")}
          </p>
          <br />
          <p className="font-sans font-semibold text-black mb-1 text-sm text-center title-font">
            {t("lookForeward")}
          </p>
        </div>
      </div>

      <div className="bottom-0 w-full">
        <Footer />
      </div>
    </section>
  );
}

export default BookingConfirmation;
