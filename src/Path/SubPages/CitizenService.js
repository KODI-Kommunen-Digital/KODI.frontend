import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import below from "../../assets/homeimage.jpg";
import fuchstal from "../../assets/homeimage.jpg";
import applevillage from "../../assets/homeimage.jpg";
import HOMEPAGEIMG from "../../assets/homeimage.jpg";
import Footer from "../../Components/Footer";

const CitizenService = () => {
  window.scrollTo(0, 0);
  const { t } = useTranslation();
  let navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <section class="text-gray-600 bg-white body-font">
      <HomePageNavBar />

      <div class="container-fluid py-0 mr-0 ml-0 mt-20 w-full flex flex-col">
        <div class="w-full mr-0 ml-0">
          <div class="h-64 overflow-hidden px-0 py-1">
            <div class="relative h-64">
            <img
                alt="ecommerce"
                class="object-cover object-center h-full w-full"
                src={HOMEPAGEIMG}
              />
              <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
                <h1 class="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
                {t("citizenService")}
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
          <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 relative mb-4 justify-center place-items-center">
            <div onClick={() => {
              navigateTo("/Places");
              localStorage.setItem("selectedItemLocation", "Below");
              }} class="h-80 w-full rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
              <div class="relative h-80 rounded overflow-hidden">
                <img alt="ecommerce" class="object-cover object-center h-full w-full hover:scale-125 transition-all duration-500" src={below} />
                <div class="absolute inset-0 flex flex-col justify-end bg-gray-800 bg-opacity-50 text-white z--1">
                  <h1 class="text-xl md:text-3xl font-sans font-bold mb-0 ml-4">
                  {t("below")}
                  </h1>
                  <p class="mb-4 ml-4 font-sans">{t("entries")}</p>
                </div>
              </div>
            </div>
            <div onClick={() => {
              navigateTo("/Places");
              localStorage.setItem("selectedItemLocation", "Fuchstal");
              }} class="h-80 w-full rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
              <div class="relative h-80 rounded overflow-hidden">
                <img alt="ecommerce" class="object-cover object-center h-full w-full" src={fuchstal} />
                <div class="absolute inset-0 flex flex-col justify-end bg-gray-800 bg-opacity-50 text-white z--1">
                  <h1 class="text-xl md:text-3xl font-sans font-bold mb-0 ml-4 overflow-hidden">
                  {t("fuchstal")}
                  </h1>
                  <p class="mb-4 ml-4 font-sans">{t("entries")}</p>
                </div>
              </div>
            </div>
            <div onClick={() => {
              navigateTo("/Places");
              localStorage.setItem("selectedItemLocation", "Apple village");
              }} class="h-80 w-full rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
              <div class="relative h-80 rounded overflow-hidden">
                <img alt="ecommerce" class="object-cover object-center h-full w-full" src={applevillage} />
                <div class="absolute inset-0 flex flex-col justify-end bg-gray-800 bg-opacity-50 text-white z--1">
                  <h1 class="text-xl md:text-3xl font-bold mb-0 ml-4 font-sans">
                  {t("appleVillage")}
                  </h1>
                  <p class="mb-4 ml-4 font-sans">{t("entries")}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="bottom-0 w-full">
				<Footer/>
			</div>
    </section>
  );
};

export default CitizenService;