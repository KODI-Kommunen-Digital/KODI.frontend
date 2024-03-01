import React from "react";
import { useTranslation } from "react-i18next";
import HomePageNavBar from "../../Components/HomePageNavBar";
import Footer from "../../Components/Footer";
import { useNavigate } from "react-router-dom";
import { BookingSummary } from '../../Constants/BookingSummary.js';

export default function Summary() {
  window.scrollTo(0, 0);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <section className="bg-white body-font relative">
      <HomePageNavBar />

      <div className="bg-white h-full items-center mt-20 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
        <p className="font-sans font-bold text-purple-900  mb-1 text-4xl title-font text-center">
          {t("summaryBooking")}
        </p>
        <br />

        <p className="font-sans text-center font-bold text-black  mb-1 text-xl title-font">
          {t("serviceName")} : Football coaching
        </p>
        <br />

        {BookingSummary.map((booking) => (
          <div key={booking.id}>
            {booking.user && (
              <div className="max-w-2xl gap-y-4 pt-4 pb-4 px-4 lg:max-w-7xl mx-auto flex flex-col items-center">
              <div className="lg:w-full border-2 border-purple-900 rounded-xl md:w-full h-full">
              <div className="bg-white md:grid md:gap-6 rounded-xl p-8 flex flex-col shadow-xl w-full">
                <p className="font-sans font-bold text-purple-900  mb-4 md:mb-1 text-md title-font">
                  {booking.user.username}
                </p>
                <p className="font-sans font-semibold text-black mb-4 md:mb-1 text-sm title-font">
                  {booking.user.email}
                </p>
                <p className="font-sans font-semibold text-black mb-4 md:mb-1 text-sm title-font">
                  {booking.user.mobile}
                </p>
                <p className="font-sans font-semibold text-black mb-4 md:mb-1 text-sm title-font">
                  {booking.user.remarks}
                </p>
              </div>
              </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-white h-full items-center mt-0 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
        <div className="py-2 mt-1 px-0">
          <button
            type="button"
            onClick={() => {
              navigateTo(
                `/AppointmentBooking/BookAppointments/BookingConfirmation`
              );
            }}
            className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
          >
            {t("confirm")}
          </button>
        </div>
      </div>

      <div className="bottom-0 w-full">
        <Footer />
      </div>
    </section>
  );
}
