import React from 'react';
import STYLEIMAGE from "../assets/styleimage.png";
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function UploadContribution() {
    const { t } = useTranslation();

    let navigate = useNavigate();
    const navigateTo = (path) => {
      if (path) {
        navigate(path);
      }
    };


  return (
    <div className="bg-blue-400 mx-auto py-10 px-4 flex justify-center lg:h-[28rem] sm:h-[35rem]">
        <div className="flex flex-wrap items-center">

            <div className="w-full md:w-1/2 px-4">
            <h2 className="text-4xl text-white font-bold mb-4 font-sans">{t("citizenService")}</h2>
            <p className="mb-4 text-gray-900 text-lg font-bold font-sans">{t("findBestCitizenServicesInTheCity")}</p>
            <a
              onClick={() => navigateTo("/CitizenService")}
              className="ml-0 w-full sm:w-48 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
            >
              {t("clickHereToFind")}
            </a>
            </div>

            <div className="w-full md:w-1/2 flex flex-wrap lg:mt-0 md:mt-6 mt-6">
              <img src={STYLEIMAGE} alt="Image 1" className="w-full md:w-98 mb-2" />
            </div>


        </div>
    </div>

  );
}

export default UploadContribution;
