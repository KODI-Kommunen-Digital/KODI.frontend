import React from "react";
import { useTranslation } from "react-i18next";
import RegionColors from "../Components/RegionColors";

const LoadingPage = () => {
  const { t } = useTranslation();

  const regionName = process.env.REACT_APP_NAME;
  const colors = RegionColors[regionName] || RegionColors['Other Region'];
  return (
    <div className={location.pathname === '/' ? "relative h-full flex items-center justify-center bg-white" : "fixed inset-0 flex items-center justify-center bg-white"}>

      <div className="text-center">
        <h1 className={`text-2xl md:text-4xl lg:text-6xl text-center font-bold py-20 font-sans bg-clip-text text-transparent ${colors.darkTextColor}`}>
          {t("loading")}
        </h1>
        <div className="my-10 flex">
          <div className={`relative mx-auto animate-[rotate_1s_infinite] loading-wheel border-8  ${colors.lightBorderColor}`}></div>
        </div>
        <p className={`text-lg py-20 md:text-xl lg:text-4xl font-bold ${colors.lightTextColor}`}>
          {t("youAreAlmostThere")}
        </p>
      </div>
    </div>
  );
};

export default LoadingPage;
