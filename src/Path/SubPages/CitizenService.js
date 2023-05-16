import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HOMEPAGEIMG from "../../assets/homeimage.jpg";
import Footer from "../../Components/Footer";
import { getCitizenServices, getCities } from "../../Services/cities";

const CitizenService = () => {
  const { t } = useTranslation();
  const [citizenServiceData, setcitizenServiceData] = useState([])
  const [cities , setCities] = useState({})

  let navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };


  useEffect(() => {
		document.title = "Heidi - Citizen Services";
    getCities().then((response) => {
      var temp = {}
      for (let city of response.data.data) {
        temp[city.id] = city.name
      }
      setCities(temp)
    })
    getCitizenServices().then((response)=>{
      setcitizenServiceData(response.data.data)
    })
  
	}, []);

  console.log(cities)

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
            {citizenServiceData && citizenServiceData.map((data) => (
              <div class="h-80 w-full rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2">
                <div class="relative h-80 rounded overflow-hidden">
                  <a target="_blank" href={data.link}>  
                  <img onClick={()=> window.open(data.link, "_blank")} alt={data.title} class="object-cover object-center h-full w-full hover:scale-125 transition-all duration-500" src={process.env.REACT_APP_BUCKET_HOST + data.image} />
                    <div class="absolute inset-0 flex flex-col justify-end bg-gray-800 bg-opacity-50 text-white z--1">
                    <h1 class="text-xl md:text-3xl font-sans font-bold mb-0 ml-4">
                    {data.title}
                    </h1>
                    <p class="mb-4 ml-4 font-sans">{cities[data.cityId]}</p>
                  </div>
                  </a>
                </div>
              </div>
            )) }
          </div>
        </div>

      <div className="bottom-0 w-full">
				<Footer/>
			</div>
    </section>
  );
};

export default CitizenService;