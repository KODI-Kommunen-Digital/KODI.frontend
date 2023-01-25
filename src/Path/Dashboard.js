import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
// import '../Path/Dashboard.css';
import {getDashboarddata} from "../Services/dashboarddata";
import { useNavigate } from "react-router-dom";
import Navbar from "../Path/Navbar";
const dashboardStyle = require('../Path/Dashboard.css')

const Dashboard = () => {
  const [dashboarddata, setDashboarddata] = useState({ listings: [] });
  useEffect(() => {
    getDashboarddata().then((response) => {
      setDashboarddata(response);
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

  return (
    <section className="bg-slate-600 body-font relative h-full">
      <SideBar/>
      <React.Fragment>
        <Navbar/>
      </React.Fragment>

      <html class="h-full bg-gray-100" />
      <body class="h-full" />

      <div class="container w-auto px-5 py-2 bg-slate-600">
        <div class="bg-white mt-4 p-0 space-y-10">
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-4 p-6 space-y-10">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Listings
                </th>
                <th scope="col" class="px-6 py-3">
                  Category
                </th>
                <th scope="col" class="px-6 py-3">
                  Expiration Date
                </th>
                <th scope="col" class="px-6 py-3">
                  Status
                </th>
                <th scope="col" class="px-6 py-3">
                  Gateway/API
                </th>
                <th scope="col" class="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {dashboarddata.listings.map((listing) => (
                <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th
                    scope="row"
                    class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white"
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
                  <td class="px-6 py-4">{listing.category}</td>
                  <td class="px-6 py-4">{listing.expiryDate}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center">
                      <div class="h-2.5 w-2.5 rounded-full bg-green-400 mr-2"></div>
                      {listing.status}
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <a
                      href="#"
                      class="font-medium text-violet-600 dark:text-blue-500 hover:underline"
                    >
                      {listing.gatewayApi}
                    </a>
                  </td>
                  <td class="px-6 py-4">
                    <a
                      href="#"
                      class="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      onClick={() => navigateTo("/")}
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
