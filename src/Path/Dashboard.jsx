import React, { useState, useEffect , Fragment} from "react";
import { Popover, Transition } from '@headlessui/react'
import {Bars3Icon,XMarkIcon,} from '@heroicons/react/24/outline'
import LOGO from "../assets/logo.png";
import SideBar from "../Components/SideBar";
import {getDashboarddata} from "../Services/dashboarddata";
import { useNavigate } from "react-router-dom";
import {sortOldest} from "../Services/helper";

const dashboardStyle = require('../Path/Dashboard.css')

const Dashboard = () => {
  const [dashboarddata, setDashboarddata] = useState([]);
  useEffect(() => {
    getDashboarddata().then((response) => {
      setDashboarddata([...sortOldest((response.listings))]);
    });
    document.title = "Dashboard";
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

  //Navigate to Edit Listings page Starts
  function goToEditListingsPage(editCategory) {
    if (editCategory == "News") {
      navigateTo("/OverviewPageNewsCategories");
    }
    else if (editCategory == "Road Works / Traffic") {
      navigateTo("/ListingsPageConstructionTraffic");
    }
    else if (editCategory == "Events") {
      navigateTo("/ListingsPageEvents");
    }
    else if (editCategory == "Clubs") {
      navigateTo("/ListingsPageClub");
    }
    else if (editCategory == "Regional Products") {
      navigateTo("/ListingsPageRegionalProducts");
    }
    else if (editCategory == "Offer / Search") {
      navigateTo("/ListingsPageOfferSearch");
    }
    else if (editCategory == "New Citizen Info") {
      navigateTo("/ListingsPageNewcitizeninfo");
    }
    else if (editCategory == "Defect Report") {
      navigateTo("/ListingsPageDefectReporter");
    }
    else if (editCategory == "Lost And Found") {
      navigateTo("/ListingsPageLostPropertyOffice");
    }
    else if (editCategory == "Company Portraits") {
      navigateTo("/ListingsPageCompanyportaits");
    }
    else if (editCategory == "Carpooling And Public Transport") {
      navigateTo("/OverviewPageNewsCategories");
    }
    else if (editCategory == "Offers") {
      navigateTo("/ListingsPageOffers");
    }
  }

  function handleEditListingsClick() {
    dashboarddata.listings.forEach((listing) => goToEditListingsPage(listing));
  }

  //Navigate to Edit Listings page Starts

  return (
    <section className="bg-slate-600 body-font relative">
      <SideBar/>
      {/* <React.Fragment>
        <Navbar/>
      </React.Fragment> */}
      <div class="container px-5 py-0 w-full fixed top-0 z-10 lg:px-5 lg:w-auto lg:relative">
        <Popover className="relative bg-black mr-0 ml-0 px-10 rounded-lg">
          <div className="w-full">
            <div className="flex items-center justify-end xl:justify-center lg:justify-center md:justify-center sm:justify-end border-gray-100 py-5 md:space-x-10">


              <div class="hidden md:block">
                  <div class="ml-10 flex items-baseline space-x-4">
                    <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer" aria-current="page">All Listings</a>

                    <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer">Publsihed</a>

                    <a  class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer">Pending</a>

                    <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer">Expired</a>

                    {/* <a class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium cursor-pointer">Reports</a> */}
                  </div>
                </div>

              <div className="-my-2 -mr-2 md:hidden">
                <Popover.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">Open menu</span>
                  <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                </Popover.Button>
              </div>

              {/* <div class="hidden md:block">
                <div className="justify-end mt-0 ml-0 flex items-baseline space-x-4">
                  <select
                    id="language"
                    name="language"
                    onChange={handleLanguageChange}
                    value={selectedLanguage}
                    className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-700"
                  >
                    <option value={null} disabled selected>
                      Select a language
                    </option>
                    {languages.map((language) => (
                      <option key={language.language} value={language.language}>
                        {language.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div> */}

              {/* <div class="hidden md:block">
                <div class="flex justify-center">
                  <div class="mb-0">
                    <div class="relative mb-0 flex w-full flex-wrap items-stretch">
                      <input
                        type="search"
                        class="relative m-0 -mr-px block w-[1%] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-200"
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="button-addon1" />
                      <button
                        class="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase bg-white leading-tight text-black shadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                        type="button"
                        id="button-addon1"
                        data-te-ripple-init
                        data-te-ripple-color="light">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          class="h-5 w-5">
                          <path
                            fill-rule="evenodd"
                            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                            clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div> */}



            </div>
          </div>

          <Transition
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel focus className="absolute inset-x-0 top-0 origin-top-right transform p-0 transition md:hidden">
              <div className="divide-y-2 divide-gray-50 bg-black shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="space-y-6 py-6 px-5">

                <div className="-my-2 -mr-2 md:hidden flex justify-end">
                      <Popover.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>

                    <div class="space-y-1">
                    <div class="md:hidden flex justify-center text-center" id="mobile-menu">
                      <div class="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                        <a class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium cursor-pointer" aria-current="page">All Listings</a>

                        <a class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium cursor-pointer">Publsihed</a>

                        <a  class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium cursor-pointer">Pending</a>

                        <a class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium cursor-pointer">Expired</a>

                        {/* <a class="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium cursor-pointer">Reports</a> */}
                      </div>
                    </div>

                    {/* <div class="md:hidden flex justify-center px-3 py-2" id="mobile-menu">
                      <div className="flex items-center justify-end">
                        <select
                          id="language"
                          name="language"
                          onChange={handleLanguageChange}
                          value={selectedLanguage}
                          className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-gray-300 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-700"
                        >
                          <option value={null} disabled selected>
                            Select a language
                          </option>
                          {languages.map((language) => (
                            <option key={language.language} value={language.language}>
                              {language.name}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div> */}

                    {/* <div class="md:hidden flex justify-center px-3 py-2" id="mobile-menu">
                      <div class="flex justify-center">
                        <div class="mb-0">
                          <div class="relative mb-0 flex w-full flex-wrap items-stretch">
                            <input
                              type="search"
                              class="relative m-0 -mr-px block w-[1%] min-w-0 flex-auto rounded-l border border-solid border-neutral-300 bg-transparent bg-clip-padding px-3 py-1.5 text-base font-normal text-neutral-700 outline-none transition duration-300 ease-in-out focus:border-primary focus:text-neutral-700 focus:shadow-te-primary focus:outline-none dark:text-neutral-200 dark:placeholder:text-neutral-200"
                              placeholder="Search"
                              aria-label="Search"
                              aria-describedby="button-addon1" />
                            <button
                              class="relative z-[2] flex items-center rounded-r bg-primary px-6 py-2.5 text-xs font-medium uppercase bg-white leading-tight text-blackshadow-md transition duration-150 ease-in-out hover:bg-primary-700 hover:shadow-lg focus:bg-primary-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-primary-800 active:shadow-lg"
                              type="button"
                              id="button-addon1"
                              data-te-ripple-init
                              data-te-ripple-color="light">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                class="h-5 w-5">
                                <path
                                  fill-rule="evenodd"
                                  d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                                  clip-rule="evenodd" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div> */}

                    </div>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </div>

      <html class="h-full bg-gray-100" />
      <body class="h-full" />

      <div class="container w-auto px-5 py-2 bg-slate-600 h-full">

        <div class="bg-white mt-4 p-0 space-y-10">
          <table class="w-full text-sm text-left lg:mt-[2rem] mt-[7rem] text-gray-500 dark:text-gray-400 p-6 space-y-10 rounded-lg">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Listings
                </th>
                <th scope="col" class="px-6 py-3 hidden sm:table-cell">
                  Category
                </th>
                <th scope="col" class="px-6 py-3 hidden sm:table-cell">
                  Date of Creation
                </th>
                <th scope="col" class="px-6 py-3 hidden sm:table-cell">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 hidden sm:table-cell">
                  Gateway/API
                </th>
                <th scope="col" class="px-6 py-3">
                  Edit
                </th>
                <th scope="col" class="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboarddata.map((listing) => (
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th
                    scope="row"
                    class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                    onClick={() => navigateTo("/Example1")}
                  >
                    <img
                      class="w-10 h-10 rounded-full"
                      src={listing.image}
                      alt="avatar"
                    />
                    <div class="pl-3">
                      <div class="text-base font-semibold">{listing.name}</div>
                      <div class="font-normal text-gray-500">
                        {listing.email}
                      </div>
                    </div>
                  </th>
                  <td class="px-6 py-4 hidden sm:table-cell">{listing.category}</td>
                  <td class="px-6 py-4 hidden sm:table-cell">{listing.date}</td>
                  <td class="px-6 py-4 hidden sm:table-cell">
                    <div class="flex items-center">
                      <div class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>
                      {listing.status}
                    </div>
                  </td>
                  <td class="px-6 py-4 hidden sm:table-cell">
                    <a
                      href="#"
                      class="font-medium text-violet-600 dark:text-blue-500 hover:underline"
                    >
                      {listing.gatewayApi}
                    </a>
                  </td>
                  <td class="px-6 py-4">
                    <a
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => goToEditListingsPage(listing.category)}
                    >
                      {listing.edit}
                    </a>
                  </td>
                  <td class="px-6 py-4">
                    <a
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
                      onClick={() => navigateTo("/OverviewPage")}
                    >
                      {listing.action}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
