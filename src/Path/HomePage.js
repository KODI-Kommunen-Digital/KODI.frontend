import React, { useState, useEffect } from "react";
import HomePageNavBar from "../Components/HomePageNavBar";
import { getDashboarddata } from "../Services/dashboarddata";
import { useNavigate } from "react-router-dom";

import HOMEPAGEIMG from "../assets/homeimage.jpg";
import below from "../assets/homeimage.jpg";
import HOME from "../assets/Home.png";
import BELOWTIMELINEING from "../assets/below.png";
import fuchstal from "../assets/homeimage.jpg";
import applevillage from "../assets/homeimage.jpg";

const HomePage = () => {
  window.scrollTo(0, 0);
  const [dashboarddata, setDashboarddata] = useState({ listings: [] });
  useEffect(() => {
    getDashboarddata().then((response) => {
      setDashboarddata(response);
    });
    document.title = "Home";
  }, []);

  let navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  function handleDashboardChange(event) {
    setDashboarddata({
      ...dashboarddata,
      [event.target.name]: event.target.value,
    });
  }

  return (
    <section class="text-gray-600 body-font relative">
      <HomePageNavBar />
      <div class="container-fluid py-0 mr-0 ml-0 mt-20 w-full flex flex-col">
        <div class="w-full mr-0 ml-0">
          <div class="h-96 overflow-hidden px-1 py-1">
            {/* <a class="block relative h-96 overflow-hidden">
            <img
              alt="ecommerce"
              class="object-cover object-center h-full w-full"
              src= {HOMEPAGEIMG}
            />
          </a> */}
            <div class="relative h-96">
              <img
                alt="ecommerce"
                class="object-cover object-center h-full w-full"
                src={HOME}
              />
              {/* <div class="absolute inset-0 flex flex-col items-center justify-center bg-indigo-900 bg-opacity-50 text-white z-10">
                <h1 class="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4">
                  Find everything from your location
                </h1>
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <h2 class="text-gray-900 mb-20 text-3xl md:text-4xl mt-20 lg:text-5xl title-font text-center">
          The most popular categories
        </h2>

      <div class="bg-white px-40 py-6 mt-10 mb-10 flex flex-col">
        <div class="grid lg:grid-cols-5 md:grid-cols-3 sm:grid-cols-2 gap-4 relative mb-4 justify-center place-items-center">
          <div
            onClick={() => navigateTo("/OverviewPageNewsCategories")}
            class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer"
          >
            <div className="h-20 w-20 bg-cyan-400 flex items-center justify-center rounded-full m-auto shadow-2xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-40 mr-2"
              >
                <path d="M456 32h-304C121.1 32 96 57.13 96 88v320c0 13.22-10.77 24-24 24S48 421.2 48 408V112c0-13.25-10.75-24-24-24S0 98.75 0 112v296C0 447.7 32.3 480 72 480h352c48.53 0 88-39.47 88-88v-304C512 57.13 486.9 32 456 32zM464 392c0 22.06-17.94 40-40 40H139.9C142.5 424.5 144 416.4 144 408v-320c0-4.406 3.594-8 8-8h304c4.406 0 8 3.594 8 8V392zM264 272h-64C186.8 272 176 282.8 176 296S186.8 320 200 320h64C277.3 320 288 309.3 288 296S277.3 272 264 272zM408 272h-64C330.8 272 320 282.8 320 296S330.8 320 344 320h64c13.25 0 24-10.75 24-24S421.3 272 408 272zM264 352h-64c-13.25 0-24 10.75-24 24s10.75 24 24 24h64c13.25 0 24-10.75 24-24S277.3 352 264 352zM408 352h-64C330.8 352 320 362.8 320 376s10.75 24 24 24h64c13.25 0 24-10.75 24-24S421.3 352 408 352zM400 112h-192c-17.67 0-32 14.33-32 32v64c0 17.67 14.33 32 32 32h192c17.67 0 32-14.33 32-32v-64C432 126.3 417.7 112 400 112z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              NEWS
            </h2>
          </div>
          <div
            onClick={() => navigateTo("/ListingsPageConstructionTraffic")}
            class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer"
          >
            <div className="h-20 w-20 bg-red-400 flex items-center justify-center rounded-full m-auto shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-8 ml-2"
              >
                <path d="M64 0C28.7 0 0 28.7 0 64V352c0 88.4 71.6 160 160 160s160-71.6 160-160V64c0-35.3-28.7-64-64-64H64zm96 320c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48zm-48-80c0-26.5 21.5-48 48-48s48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48zM160 64c26.5 0 48 21.5 48 48s-21.5 48-48 48s-48-21.5-48-48s21.5-48 48-48z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              ROAD WORKS / TRAFFIC
            </h2>
          </div>
          <div
            onClick={() => navigateTo("/ListingsPageEvents")}
            class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer"
          >
            <div className="h-20 w-20 bg-yellow-400 flex items-center justify-center rounded-full m-auto shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-8"
              >
                <path d="M152 64H296V24C296 10.75 306.7 0 320 0C333.3 0 344 10.75 344 24V64H384C419.3 64 448 92.65 448 128V448C448 483.3 419.3 512 384 512H64C28.65 512 0 483.3 0 448V128C0 92.65 28.65 64 64 64H104V24C104 10.75 114.7 0 128 0C141.3 0 152 10.75 152 24V64zM48 448C48 456.8 55.16 464 64 464H384C392.8 464 400 456.8 400 448V192H48V448z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              EVENTS
            </h2>
          </div>
          <div
            onClick={() => navigateTo("/ListingsPageClub")}
            class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer"
          >
            <div className="h-20 w-20 bg-green-400 flex items-center justify-center rounded-full m-auto shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-40 mr-2"
              >
                <path d="M506.1 127.1c-17.97-20.17-61.46-61.65-122.7-71.1c-22.5-3.354-45.39 3.606-63.41 18.21C302 60.47 279.1 53.42 256.5 56.86C176.8 69.17 126.7 136.2 124.6 139.1c-7.844 10.69-5.531 25.72 5.125 33.57c4.281 3.157 9.281 4.657 14.19 4.657c7.406 0 14.69-3.375 19.38-9.782c.4062-.5626 40.19-53.91 100.5-63.23c7.457-.9611 14.98 .67 21.56 4.483L227.2 168.2C214.8 180.5 207.1 196.1 207.1 214.5c0 17.5 6.812 33.94 19.16 46.29C239.5 273.2 255.9 279.1 273.4 279.1s33.94-6.813 46.31-19.19l11.35-11.35l124.2 100.9c2.312 1.875 2.656 5.251 .5 7.97l-27.69 35.75c-1.844 2.25-5.25 2.594-7.156 1.063l-22.22-18.69l-26.19 27.75c-2.344 2.875-5.344 3.563-6.906 3.719c-1.656 .1562-4.562 .125-6.812-1.719l-32.41-27.66L310.7 392.3l-2.812 2.938c-5.844 7.157-14.09 11.66-23.28 12.6c-9.469 .8126-18.25-1.75-24.5-6.782L170.3 319.8H96V128.3L0 128.3v255.6l64 .0404c11.74 0 21.57-6.706 27.14-16.14h60.64l77.06 69.66C243.7 449.6 261.9 456 280.8 456c2.875 0 5.781-.125 8.656-.4376c13.62-1.406 26.41-6.063 37.47-13.5l.9062 .8126c12.03 9.876 27.28 14.41 42.69 12.78c13.19-1.375 25.28-7.032 33.91-15.35c21.09 8.188 46.09 2.344 61.25-16.47l27.69-35.75c18.47-22.82 14.97-56.48-7.844-75.01l-120.3-97.76l8.381-8.382c9.375-9.376 9.375-24.57 0-33.94c-9.375-9.376-24.56-9.376-33.94 0L285.8 226.8C279.2 233.5 267.7 233.5 261.1 226.8c-3.312-3.282-5.125-7.657-5.125-12.31c0-4.688 1.812-9.064 5.281-12.53l85.91-87.64c7.812-7.845 18.53-11.75 28.94-10.03c59.75 9.22 100.2 62.73 100.6 63.29c3.088 4.155 7.264 6.946 11.84 8.376H544v175.1c0 17.67 14.33 32.05 31.1 32.05L640 384V128.1L506.1 127.1zM48 352c-8.75 0-16-7.245-16-15.99c0-8.876 7.25-15.99 16-15.99S64 327.2 64 336.1C64 344.8 56.75 352 48 352zM592 352c-8.75 0-16-7.245-16-15.99c0-8.876 7.25-15.99 16-15.99s16 7.117 16 15.99C608 344.8 600.8 352 592 352z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              CLUBS
            </h2>
          </div>
          <div
            onClick={() => navigateTo("/ListingsPageRegionalProducts")}
            class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer"
          >
            <div className="h-20 w-20 bg-violet-400 flex items-center justify-center rounded-full m-auto shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-40 mr-2"
              >
                <path d="M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c.2 35.5-28.5 64.3-64 64.3H128.1c-35.3 0-64-28.7-64-64V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24zM352 224c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64zm-96 96c-44.2 0-80 35.8-80 80c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16c0-44.2-35.8-80-80-80H256z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              REGIONAL PRODUCTS
            </h2>
          </div>
          <div
            onClick={() => navigateTo("/ListingsPageOfferSearch")}
            class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer"
          >
            <div className="h-20 w-20 bg-orange-400 flex items-center justify-center rounded-full m-auto shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-8"
              >
                <path d="M374.6 118.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-320 320c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l320-320zM128 128c0-35.3-28.7-64-64-64S0 92.7 0 128s28.7 64 64 64s64-28.7 64-64zM384 384c0-35.3-28.7-64-64-64s-64 28.7-64 64s28.7 64 64 64s64-28.7 64-64z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              OFFER / SEARCH
            </h2>
          </div>
          <div
            onClick={() => navigateTo("/ListingsPageNewcitizeninfo")}
            class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer"
          >
            <div className="h-20 w-20 bg-stone-400 flex items-center justify-center rounded-full m-auto shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-40 mr-1"
              >
                <path d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-144c-17.7 0-32-14.3-32-32s14.3-32 32-32s32 14.3 32 32s-14.3 32-32 32z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              NEW CITIZEN INFO
            </h2>
          </div>
          <div
            onClick={() => navigateTo("/ListingsPageDefectReporter")}
            class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer"
          >
            <div className="h-20 w-20 bg-red-600 flex items-center justify-center rounded-full m-auto shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-40 mr-1"
              >
                <path d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              DEFECT REPORT
            </h2>
          </div>

          <div
            onClick={() => navigateTo("/ListingsPageLostPropertyOffice")}
            class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer"
          >
            <div className="h-20 w-20 bg-gray-600 flex items-center justify-center rounded-full m-auto shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-40 mr-2"
              >
                <path d="M253.3 35.1c6.1-11.8 1.5-26.3-10.2-32.4s-26.3-1.5-32.4 10.2L117.6 192H32c-17.7 0-32 14.3-32 32s14.3 32 32 32L83.9 463.5C91 492 116.6 512 146 512H430c29.4 0 55-20 62.1-48.5L544 256c17.7 0 32-14.3 32-32s-14.3-32-32-32H458.4L365.3 12.9C359.2 1.2 344.7-3.4 332.9 2.7s-16.3 20.6-10.2 32.4L404.3 192H171.7L253.3 35.1zM192 304v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16zm96-16c8.8 0 16 7.2 16 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16zm128 16v96c0 8.8-7.2 16-16 16s-16-7.2-16-16V304c0-8.8 7.2-16 16-16s16 7.2 16 16z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              LOST AND FOUND
            </h2>
          </div>
          <div
            onClick={() => navigateTo("/ListingsPageCompanyportaits")}
            class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer"
          >
            <div className="h-20 w-20 bg-pink-400 flex items-center justify-center rounded-full m-auto shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-8 ml-1"
              >
                <path d="M48 0C21.5 0 0 21.5 0 48V464c0 26.5 21.5 48 48 48h96V432c0-26.5 21.5-48 48-48s48 21.5 48 48v80h96c26.5 0 48-21.5 48-48V48c0-26.5-21.5-48-48-48H48zM64 240c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V240zm112-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V240c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V240zM80 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16zm80 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H176c-8.8 0-16-7.2-16-16V112zM272 96h32c8.8 0 16 7.2 16 16v32c0 8.8-7.2 16-16 16H272c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              COMPANY PORTRAITS
            </h2>
          </div>
          <div class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer">
            <div className="h-20 w-20 bg-lime-600 flex items-center justify-center rounded-full m-auto shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-40 mr-1"
              >
                <path d="M135.2 117.4L109.1 192H402.9l-26.1-74.6C372.3 104.6 360.2 96 346.6 96H165.4c-13.6 0-25.7 8.6-30.2 21.4zM39.6 196.8L74.8 96.3C88.3 57.8 124.6 32 165.4 32H346.6c40.8 0 77.1 25.8 90.6 64.3l35.2 100.5c23.2 9.6 39.6 32.5 39.6 59.2V400v48c0 17.7-14.3 32-32 32H448c-17.7 0-32-14.3-32-32V400H96v48c0 17.7-14.3 32-32 32H32c-17.7 0-32-14.3-32-32V400 256c0-26.7 16.4-49.6 39.6-59.2zM128 288c0-17.7-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32s32-14.3 32-32zm288 32c17.7 0 32-14.3 32-32s-14.3-32-32-32s-32 14.3-32 32s14.3 32 32 32z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              CARPOOLING / PUBLIC TRANSPORT
            </h2>
          </div>
          <div
            onClick={() => navigateTo("/ListingsPageOffers")}
            class="p-4 justify-center bg-white h-40 w-48 shadow-xl rounded-lg mt-10 cursor-pointer"
          >
            <div className="h-20 w-20 bg-sky-600 flex items-center justify-center rounded-full m-auto shadow-xl">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                class="h-8 w-40 mr-1"
              >
                <path d="M190.5 68.8L225.3 128H224 152c-22.1 0-40-17.9-40-40s17.9-40 40-40h2.2c14.9 0 28.8 7.9 36.3 20.8zM64 88c0 14.4 3.5 28 9.6 40H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32H480c17.7 0 32-14.3 32-32V160c0-17.7-14.3-32-32-32H438.4c6.1-12 9.6-25.6 9.6-40c0-48.6-39.4-88-88-88h-2.2c-31.9 0-61.5 16.9-77.7 44.4L256 85.5l-24.1-41C215.7 16.9 186.1 0 154.2 0H152C103.4 0 64 39.4 64 88zm336 0c0 22.1-17.9 40-40 40H288h-1.3l34.8-59.2C329.1 55.9 342.9 48 357.8 48H360c22.1 0 40 17.9 40 40zM32 288V464c0 26.5 21.5 48 48 48H224V288H32zM288 512H432c26.5 0 48-21.5 48-48V288H288V512z" />
              </svg>
            </div>
            <h2 class="flex items-center justify-center m-auto mt-2 font-semibold text-center">
              OFFERS
            </h2>
          </div>
        </div>
      </div>

      <h2 class="text-gray-900 mb-20 text-3xl md:text-4xl lg:text-5xl mt-20 title-font text-center">
          Discover more places
        </h2>

      <div class="bg-white px-40 py-6 mt-10 mb-10 space-y-10 flex flex-col">
          <div class="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 relative mb-4 justify-center place-items-center">
            <div
            onClick={() => navigateTo("/Below")}
            class="h-96 w-96 mb-4 shadow-xl rounded-lg cursor-pointer"
          >
            <div class="relative h-96 w-96 rounded overflow-hidden">
              <img
                alt="ecommerce"
                class="object-cover object-center h-full w-full"
                src={below}
              />
              <div class="absolute inset-0 flex flex-col justify-end bg-gray-800 bg-opacity-50 text-white z-10">
                <h1 class="text-3xl font-bold mb-0 ml-4">
                  below
                </h1>
                <p class="mb-4 ml-4">entries</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => navigateTo("/Fuchstal")}
            class="h-96 w-96 mb-4 shadow-xl rounded-lg cursor-pointer"
          >
            <div class="relative h-96 w-96 rounded overflow-hidden">
              <img
                alt="ecommerce"
                class="object-cover object-center h-full w-full"
                src={fuchstal}
              />
              <div class="absolute inset-0 flex flex-col justify-end bg-gray-800 bg-opacity-50 text-white z-10">
                <h1 class="text-3xl font-bold mb-0 ml-4">
                  fuchstal
                </h1>
                <p class="mb-4 ml-4">entries</p>
              </div>
            </div>
          </div>
          <div
            onClick={() => navigateTo("/AppleVillage")}
            class="h-96 w-96 mb-4 shadow-xl rounded-lg cursor-pointer"
          >
            <div class="relative h-96 w-96 rounded overflow-hidden">
              <img
                alt="ecommerce"
                class="object-cover object-center h-full w-full"
                src={applevillage}
              />
              <div class="absolute inset-0 flex flex-col justify-end bg-gray-800 bg-opacity-50 text-white z-10">
                <h1 class="text-3xl font-bold mb-0 ml-4">
                  apple village
                </h1>
                <p class="mb-4 ml-4">entries</p>
              </div>
            </div>
          </div>
          </div>
      </div>

      <footer class="text-center lg:text-left bg-slate-800 text-white">
        <div class="mx-6 py-10 text-center md:text-left">
          <div class="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="">
              <h6 class="
                  uppercase
                  font-semibold
                  mb-4
                  flex
                  items-center
                  justify-center
                  md:justify-start
                ">
                <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="cubes"
                  class="w-4 mr-3" role="img" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512">
                  <path fill="currentColor"
                    d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z">
                  </path>
                </svg>
                Smart Regions
              </h6>
              <div class="uppercase font-semibold mb-4 flex justify-center md:justify-start gap-4">
                <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                  <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook-f"
                    class="w-2.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512">
                    <path fill="currentColor"
                      d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z">
                    </path>
                  </svg>
                </a>
                <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                  <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="twitter"
                    class="w-4 text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor"
                      d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z">
                    </path>
                  </svg>
                </a>
                <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                  <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="instagram"
                    class="w-3.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                    <path fill="currentColor"
                      d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z">
                    </path>
                  </svg>
                </a>
                <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                  <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="linkedin-in"
                    class="w-3.5 text-white" role="img" xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512">
                    <path fill="currentColor"
                      d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z">
                    </path>
                  </svg>
                </a>
            </div>
            </div>
            <div class="">
              <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start">
                Learn More
              </h6>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">developer community</a>
              </p>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">Contact us</a>
              </p>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">Log in</a>
              </p>
            </div>
            <div class="">
              <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start">
                Leagal
              </h6>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">imprint</a>
              </p>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">terms and conditions</a>
              </p>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">Data protection</a>
              </p>
              <p>
                <a href="#!" class="text-gray-600">Right of withdrawal</a>
              </p>
            </div>
            <div class="">
              <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start">
              Secure the APP now!
              </h6>
            </div>
          </div>
        </div>
        <div class="text-center p-6 bg-slate-800">
          <div className="my-4 text-gray-600 h-[1px]"></div>
          <span>© HeidiTheme 2023. All rights reserved. Created by  </span>
          <a class="text-white font-semibold underline" href="https://heidi-app.de/">HeimatDigital</a>
        </div>
      </footer>
    </section>
  );
};

export default HomePage;