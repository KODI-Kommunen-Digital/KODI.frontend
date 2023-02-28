import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { getDashboarddata } from "../../Services/dashboarddata";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HOMEPAGEIMG from "../../assets/homeimage.jpg";
import LOGO from "../../assets/logo.png";

const Example1 = () => {
  window.scrollTo(0, 0);
  const [dashboarddata, setDashboarddata] = useState({ listings: [] });
  useEffect(() => {
    getDashboarddata().then((response) => {
      setDashboarddata(response);
    });
    document.title = "apple village 1";
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

  const [content, setContent] = useState("A");

  const handleButtonClick = (value) => {
    setContent(value);
  };

  const [customerServiceDataload, setcustomerServiceDataload] = useState(false);

  const customerServiceData = () => {
    setcustomerServiceDataload(true);
    setSelectedLink("customerService");
  };
  const onCancel = () => {
    setcustomerServiceDataload(false);
    setSelectedLink("current");
  };

  const [selectedLink, setSelectedLink] = useState("current");

  const { t, i18n } = useTranslation();

  const [location, setLocation] = useState("");

  function handleLocationChange(event) {
    setLocation(event.target.value);
  }

  function handleLocationSubmit(event) {
    event.preventDefault();
  }

  function getCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(
          `${position.coords.latitude}, ${position.coords.longitude}`
        );
      },
      (error) => {
        console.error(error);
      }
    );
  }

  return (
    <section class="text-gray-600 bg-white body-font">
      <HomePageNavBar />

      <div class="mx-auto grid max-w-2xl grid-cols-1  gap-y-16 gap-x-8 py-24 px-4 sm:px-6 sm:py-32 lg:max-w-7xl lg:grid-cols-3 lg:px-8">
        <div className="grid grid-cols-1 gap-4 col-span-2 ">
          <div class="lg:w-full md:w-full h-64">
            <div class="md:grid md:gap-6 bg-white rounded-lg p-8 flex flex-col shadow-2xl w-full">
              <div class="mt-5 md:col-span-2 md:mt-0">
                <form action="#" method="POST">
                  <p class="text-xs bg-red-600 rounded-sm p-1 font-bold text-white w-24 text-center">
                    MOST POPULAR
                  </p>
                  <div class="flex flex-col sm:flex-row sm:items-center text-start justify-between">
                    <h1 class="text-gray-900 mb-4 text-2xl md:text-3xl mt-4 lg:text-3xl title-font text-start font-bold">
                      Meanwhile example 1
                    </h1>
                    <div class="flex items-center">
                      <button
                        type="button"
                        class="text-gray-900 mt-2 bg-white border border-gray-900 hover:text-cyan-500 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-1 py-1 text-center inline-flex items-center dark:focus:ring-gray-500 mb-2 mr-2 sm:mr-2"
                      >
                        <svg
                          class="w-4 h-4 mr-2 -ml-1 text-[#626890]"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="ethereum"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 320 512"
                        >
                          <path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z" />
                        </svg>
                        Sprachern
                      </button>
                      <button
                        type="button"
                        class="text-gray-900 mt-2 bg-white border border-gray-900 hover:text-cyan-500 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-1 py-1 text-center inline-flex items-center dark:focus:ring-gray-500 mb-2 mr-2 sm:mr-2"
                      >
                        <svg
                          class="w-4 h-4 mr-2 -ml-1 text-[#626890]"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="ethereum"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 320 512"
                        >
                          <path d="M246.6 150.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0l96 96c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L352 109.3V384c0 35.3 28.7 64 64 64h64c17.7 0 32 14.3 32 32s-14.3 32-32 32H416c-70.7 0-128-57.3-128-128c0-35.3-28.7-64-64-64H109.3l41.4 41.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0l-96-96c-12.5-12.5-12.5-32.8 0-45.3l96-96c12.5-12.5 32.8-12.5 45.3 0s12.5 32.8 0 45.3L109.3 256H224c23.3 0 45.2 6.2 64 17.1V109.3l-41.4 41.4z" />
                        </svg>
                        Split
                      </button>
                      <button type="button" class="text-gray-900 mt-0 items-center">
                        <svg
                          class="w-8 h-4 mx-1 text-[#626890]"
                          aria-hidden="true"
                          focusable="false"
                          data-prefix="fab"
                          data-icon="ethereum"
                          role="img"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 320 512"
                        >
                          <path d="M0 256a56 56 0 1 1 112 0A56 56 0 1 1 0 256zm160 0a56 56 0 1 1 112 0 56 56 0 1 1 -112 0zm216-56a56 56 0 1 1 0 112 56 56 0 1 1 0-112z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div class="flex justify-center space-x-6 mt-2 h-5 w-5 mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 576 512"
                    >
                      <path d="M0 24C0 10.7 10.7 0 24 0H69.5c22 0 41.5 12.8 50.6 32h411c26.3 0 45.5 25 38.6 50.4l-41 152.3c-8.5 31.4-37 53.3-69.5 53.3H170.7l5.4 28.5c2.2 11.3 12.1 19.5 23.6 19.5H488c13.3 0 24 10.7 24 24s-10.7 24-24 24H199.7c-34.6 0-64.3-24.6-70.7-58.5L77.4 54.5c-.7-3.8-4-6.5-7.9-6.5H24C10.7 48 0 37.3 0 24zM128 464a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm336-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z" />
                    </svg>
                  </div>
                  <p>Regional Products</p>
                </form>
              </div>
            </div>
          </div>
          <div class="container-fluid lg:w-full md:w-full">
            <div class=" mr-0 ml-0 mt-4">
              <div class="h-96 overflow-hidden px-0 py-0 shadow-2xl">
                <div class="relative h-96">
                  <img
                    alt="ecommerce"
                    class="object-cover object-center h-full w-full"
                    src={HOMEPAGEIMG}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

          <div class="w-full h-full sm:h-96 bg-white rounded-lg dark:border md:mt-0 ml-0 sm:max-w-md xl:p-0 dark:border-gray-700 shadow-2xl dark:bg-white">
          <div class="lg:w-full md:w-full">
            <div class="p-4 space-y-0 md:space-y-6 sm:p-4">
              <h1 class="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900">
                Add owner info
              </h1>
            </div>
            <div class="my-4 bg-gray-200 h-[1px]"></div>

            <div class="items-center mx-2 py-2 px-2 my-2 gap-4 grid grid-cols-1 sm:grid-cols-2">
              <div class="flex justify-center sm:justify-start">
                <img
                  class="h-6 w-auto"
                  src={LOGO}
                  alt="HEDI- Heimat Digital"
                  onClick={() => navigateTo("/HomePage")}
                />
              </div>
              <div class="flex-grow text-center sm:text-left mt-6 sm:mt-0">
                <h2 class="text-gray-900 text-lg title-font mb-2 font-bold dark:text-gray-900">
                  Christian Bale
                </h2>
                <p class="leading-relaxed text-base dark:text-gray-900">Uploaded 5 months ago.</p>
              </div>
            </div>

            <div class="flex justify-center py-2 px-2 sm:justify-start mx-4 my-10 gap-4">
              <button
                type="button"
                data-te-ripple-init
                data-te-ripple-color="light"
                class="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-blue-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                </svg>
              </button>
              {/* <p class="leading-relaxed text-base font-bold">
                Check out social media
              </p> */}
            </div>

            <div class="flex justify-center my-4">
              <button
                onClick={() => navigateTo("/ViewProfile")}
                type="submit"
                class="group relative flex w-72 md:w-96 lg:mx-4 sm:mx-0 font-bold justify-center rounded-md border border-transparent text-blue-800 bg-slate-300 py-2 px-4 text-sm hover:text-cyan-500"
              >
                <span class="absolute inset-y-0 left-0 flex items-center pl-3"></span>
                View profiles
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="mx-auto grid max-w-2xl  gap-y-1 gap-x-8 py-8 px-4 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
        <h1 class="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Description
        </h1>
        <p class="leading-relaxed text-base font-bold my-6">
          In the future there will be a detailed descriptive text for the
          corresponding listings.
        </p>
      </div>

      <div class="mx-auto grid max-w-2xl  gap-y-1 gap-x-8 py-8 px-4 sm:px-6 sm:py-10 lg:max-w-7xl lg:px-8">
        <h1 class="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          Similar items
        </h1>
        <div class="bg-white py-6 mt-4 mb-4 flex flex-wrap gap-10 justify-Start">
          <div
            onClick={() => navigateTo("/Example1")}
            class="lg:w-64 md:w-64 h-96 pb-20 w-full border border-gray-200 shadow-2xl rounded-lg cursor-pointer"
          >
            <a class="block relative h-64 rounded overflow-hidden">
              <img
                alt="ecommerce"
                class="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                src={HOMEPAGEIMG}
              />
            </a>
            <div class="mt-10">
              <h2 class="text-gray-900 title-font text-lg font-bold text-center">
                example-1
              </h2>
            </div>
            <div className="my-4 bg-gray-200 h-[1px]"></div>
          </div>
          <div
            onClick={() => navigateTo("/Example1")}
            class="lg:w-64 md:w-64 h-96 pb-20 w-full border border-gray-200 shadow-2xl rounded-lg cursor-pointer"
          >
            <a class="block relative h-64 rounded overflow-hidden">
              <img
                alt="ecommerce"
                class="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                src={HOMEPAGEIMG}
              />
            </a>
            <div class="mt-10">
              <h2 class="text-gray-900 title-font text-lg font-bold text-center">
                example-2
              </h2>
            </div>
            <div className="my-4 bg-gray-200 h-[1px]"></div>
          </div>
          <div
            onClick={() => navigateTo("/Example1")}
            class="lg:w-64 md:w-64 h-96 pb-20 w-full border border-gray-200 shadow-2xl rounded-lg cursor-pointer"
          >
            <a class="block relative h-64 rounded overflow-hidden">
              <img
                alt="ecommerce"
                class="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
                src={HOMEPAGEIMG}
              />
            </a>
            <div class="mt-10">
              <h2 class="text-gray-900 title-font text-lg font-bold text-center">
                example-3
              </h2>
            </div>
            <div className="my-4 bg-gray-200 h-[1px]"></div>
          </div>
        </div>
      </div>

      <footer class="text-center lg:text-left bg-slate-800 text-white mt-10">
        <div class="mx-6 py-10 text-center md:text-left">
          <div class="grid grid-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div class="">
              <h6
                class="
                  uppercase
                  font-semibold
                  mb-4
                  flex
                  items-center
                  justify-center
                  md:justify-start
                "
              >
                <svg
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="cubes"
                  class="w-4 mr-3"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    fill="currentColor"
                    d="M488.6 250.2L392 214V105.5c0-15-9.3-28.4-23.4-33.7l-100-37.5c-8.1-3.1-17.1-3.1-25.3 0l-100 37.5c-14.1 5.3-23.4 18.7-23.4 33.7V214l-96.6 36.2C9.3 255.5 0 268.9 0 283.9V394c0 13.6 7.7 26.1 19.9 32.2l100 50c10.1 5.1 22.1 5.1 32.2 0l103.9-52 103.9 52c10.1 5.1 22.1 5.1 32.2 0l100-50c12.2-6.1 19.9-18.6 19.9-32.2V283.9c0-15-9.3-28.4-23.4-33.7zM358 214.8l-85 31.9v-68.2l85-37v73.3zM154 104.1l102-38.2 102 38.2v.6l-102 41.4-102-41.4v-.6zm84 291.1l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6zm240 112l-85 42.5v-79.1l85-38.8v75.4zm0-112l-102 41.4-102-41.4v-.6l102-38.2 102 38.2v.6z"
                  ></path>
                </svg>
                Smart Regions
              </h6>
              <div class="uppercase font-semibold mb-4 flex justify-center md:justify-start gap-4">
                <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="facebook-f"
                    class="w-2.5 text-white"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path
                      fill="currentColor"
                      d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                    ></path>
                  </svg>
                </a>
                <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="twitter"
                    class="w-4 text-white"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      fill="currentColor"
                      d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                    ></path>
                  </svg>
                </a>
                <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="instagram"
                    class="w-3.5 text-white"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                    ></path>
                  </svg>
                </a>
                <a href="#!" class=" text-white rounded-full bg-gray-500 p-2">
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="linkedin-in"
                    class="w-3.5 text-white"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      fill="currentColor"
                      d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
            <div class="">
              <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start">
                Learn More
              </h6>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">
                  developer community
                </a>
              </p>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">
                  Contact us
                </a>
              </p>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">
                  Log in
                </a>
              </p>
            </div>
            <div class="">
              <h6 class="uppercase font-semibold mb-4 flex justify-center md:justify-start">
                Leagal
              </h6>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">
                  imprint
                </a>
              </p>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">
                  terms and conditions
                </a>
              </p>
              <p class="mb-4">
                <a href="#!" class="text-gray-600">
                  Data protection
                </a>
              </p>
              <p>
                <a href="#!" class="text-gray-600">
                  Right of withdrawal
                </a>
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
          <span>© HeidiTheme 2023. All rights reserved. Created by </span>
          <a
            class="text-white font-semibold underline"
            href="https://heidi-app.de/"
          >
            HeimatDigital
          </a>
        </div>
      </footer>
    </section>
  );
};

export default Example1;
