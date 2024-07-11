import React from "react";
import { useTranslation } from "react-i18next";
import RegionColors from "../Components/RegionColors";

const LoadingPage = () => {
  const { t } = useTranslation();

  return (
    <div className={location.pathname === '/' ? "relative h-full flex items-center justify-center bg-white" : "fixed inset-0 flex items-center justify-center bg-white"}>

      <div className="text-center">
        <h1 className={`text-2xl md:text-4xl lg:text-6xl text-center font-bold py-20 font-sans bg-clip-text ${RegionColors.darkTextColor}`}>
          {t("loading")}
        </h1>
        <div className="my-10 flex">
          <div className={`relative mx-auto h-24 w-24 rounded-full border-t-8 border-b-8  ${RegionColors.lightBorderColor} animate-spin`}></div>
          {/* <div className={`relative mx-auto animate-[rotate_1s_infinite] loading-wheel border-8  ${RegionColors.lightBorderColor}`}></div> */}
        </div>
        <p className={`text-lg py-20 md:text-xl lg:text-4xl font-bold ${RegionColors.lightTextColor}`}>
          {t("youAreAlmostThere")}
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
