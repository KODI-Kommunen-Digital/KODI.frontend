import React, { useState, useEffect , useRef  } from "react";
import { FaBars, FaEllipsisH, FaFile, FaTimes } from "react-icons/fa";
import "../Path/Dashboard";
import {getDashboarddata, updateDashboardData,} from "../Services/dashboarddata";
import { Disclosure, Menu, Transition } from '@headlessui/react'
import { Bars3Icon, BellIcon, XMarkIcon } from '@heroicons/react/24/outline'
import SideBar from "../Components/SideBar";

function Navbar() {
  const navRef = useRef();

  const showNavbar = () => {
    navRef.current.classList.toggle("responsive_nav");
  };
  return (
    <div className="dashboard-navbar">
      <nav className="dashboard-nav" ref={navRef}>
        <a href="/#">All Listings</a>
        <a href="/#">Published</a>
        <a href="/#">Pending</a>
        <a href="/#">Expired</a>
        <a href="/#">Reports</a>
        <div class="search-container">
          <form action="#">
            <input type="search" placeholder="Search....." />
          </form>
        </div>
      </nav>
      <button className="nav-btn" onClick={showNavbar}>
        <FaEllipsisH />
      </button>
    </div>
  );
}

export default Navbar;
