import React, { useState, useEffect } from 'react';
import STYLEIMAGE from "../assets/styleimage.png";
import RegionColors from "../Components/RegionColors";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCities } from "../Services/cities";

function UploadContribution() {
    const { t } = useTranslation();


    const [cities, setCities] = useState([]);

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    useEffect(() => {
        getCities().then((citiesResponse) => {
            setCities(citiesResponse.data.data);
        });
    }, []);


    return (
        <div className={`${RegionColors.lightBgColor} mx-auto py-10 px-4 flex justify-center lg:h-[28rem] sm:h-[35rem]`}>
            <div className="flex flex-wrap items-center">

                <div className="w-full md:w-1/2 px-4">
                    <h2 className="text-4xl text-white font-bold mb-4 font-sans">{t("citizenService")}</h2>
                    <p className="mb-4 text-slate-800 text-lg font-bold font-sans">{t("findBestCitizenServicesInTheCity")}</p>
                    <a
                        onClick={(e) => {
                            const selectedCityId = e.target.value;
                            const selectedCity = cities.find((city) => city.id.toString() === selectedCityId);
                            if (selectedCity) {
                                localStorage.setItem("selectedCity", selectedCity.name);
                                // window.location.href = `/CitizenService?cityId=${selectedCityId}`;
                                navigateTo("/CitizenService");
                            } else {
                                navigateTo("/CitizenService");
                            }
                        }}
                        className={`ml-0 w-full sm:w-48 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent ${RegionColors.darkBgColor} ${RegionColors.lightHoverShadowColor} px-8 py-2 text-base font-semibold text-white cursor-pointer`}
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
