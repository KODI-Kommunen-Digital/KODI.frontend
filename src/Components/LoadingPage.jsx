import React from "react";
import { useTranslation } from "react-i18next";

const LoadingPage = () => {
  const { t } = useTranslation();

  return (
    <div
      className="h-screen w-full py-20 relative flex md:flex-row flex-col gap-10 justify-center items-center bg-white"
    >
      {/* Now both are same loaders */}

      {location.pathname === "/" ? (
        // **First Loader (When path is "/")**   
        <div
          id="loading-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="absolute animate-ping h-[16rem] w-[16rem] rounded-full border-t-4 border-b-4 border-red-500"></div>
          <div className="absolute animate-spin h-[14rem] w-[14rem] rounded-full border-t-4 border-b-4 border-purple-500"></div>
          <div className="absolute animate-ping h-[12rem] w-[12rem] rounded-full border-t-4 border-b-4 border-pink-500"></div>
          <div className="absolute animate-spin h-[10rem] w-[10rem] rounded-full border-t-4 border-b-4 border-yellow-500"></div>
          <div className="absolute animate-ping h-[8rem] w-[8rem] rounded-full border-t-4 border-b-4 border-green-500"></div>
          <div className="absolute animate-spin h-[6rem] w-[6rem] rounded-full border-t-4 border-b-4 border-blue-500"></div>
          <div className="rounded-full h-28 w-28 animate-bounce flex items-center justify-center text-gray-900 font-semibold text-xl">
            {t("loading")}
          </div>
        </div>
      ) : (
        // **Second Loader (For all other paths)**
        <div
          id="loading-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center bg-white"
        >
          <div className="absolute animate-ping h-[16rem] w-[16rem] rounded-full border-t-4 border-b-4 border-red-500"></div>
          <div className="absolute animate-spin h-[14rem] w-[14rem] rounded-full border-t-4 border-b-4 border-purple-500"></div>
          <div className="absolute animate-ping h-[12rem] w-[12rem] rounded-full border-t-4 border-b-4 border-pink-500"></div>
          <div className="absolute animate-spin h-[10rem] w-[10rem] rounded-full border-t-4 border-b-4 border-yellow-500"></div>
          <div className="absolute animate-ping h-[8rem] w-[8rem] rounded-full border-t-4 border-b-4 border-green-500"></div>
          <div className="absolute animate-spin h-[6rem] w-[6rem] rounded-full border-t-4 border-b-4 border-blue-500"></div>
          <div className="rounded-full h-28 w-28 animate-bounce flex items-center justify-center text-gray-900 font-semibold text-xl">
            {t("loading")}
          </div>
        </div>
      )}
    </div>

  );
};

export default LoadingPage;
