import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Error from './Path/Error';
import ProfilePage from './Path/ProfilePage';
import LoginPage from './Path/LoginPage';
import Dashboard from './Path/Dashboard';
import Register from './Path/Register';
import ImprintPage from './Path/ImprintPage';
import PrivacyPolicy from './Path/PrivacyPolicy';

import HomePage from './Path/HomePage';
import Places from './Path/SubPages/Places';
import Below from './Path/Below';
import Fuchstal from './Path/Fuchstal';
import AppleVillage from './Path/AppleVillage';

import Example1 from './Path/SubPages/Example1';
import Events from './Path/SubPages/Events';
import ViewProfile from './Path/SubPages/ViewProfile';
import CitizenService from './Path/SubPages/CitizenService';
import ViewMoreListings from './Path/SubPages/ViewMoreListings';

import OverviewPage from './Path/Listings/OverviewPage';
import OverviewPageNewsCategories from './Path/Listings/OverviewPageNewsCategories';
import ListingsPageNewcitizeninfo from './Path/Listings/PageNewcitizeninfo';
import ListingsPageEvents from './Path/Listings/PageEvents';
import ListingsPageConstructionTraffic from './Path/Listings/PageConstructionTraffic';
import ListingsPageSocieties from './Path/Listings/PageSocieties';
import ListingsPageRegionalProducts from './Path/Listings/PageRegionalProducts';
import ListingsPageOfferSearch from './Path/Listings/PageOfferSearch';
import ListingsPageDefectReporter from './Path/Listings/PageDefectReporter';
import ListingsPageLostPropertyOffice from './Path/Listings/PageLostPropertyOffice';

import ListingsPageNewsflash from './Path/Listings/PageNewsflash';
import ListingsPageClub from './Path/Listings/PageClub';
import ListingsPageCompanyportaits from './Path/Listings/PageCompanyportaits';
import ListingsPageOffers from './Path/Listings/PageOffers';
import ListingsPageSports from './Path/Listings/PageSports';
import ListingsPageAlert from './Path/Listings/PageAlert';
import ListingsPagePolitics from './Path/Listings/PagePolitics';
import ListingsPageEconomy from './Path/Listings/PageEconomy';
import ListingsPageTopicOfTheDay from './Path/Listings/PageTopicOfTheDay';
import ListingsPageLocal from './Path/Listings/PageLocal';
import ListingsPageClubNews from "./Path/Listings/PageClubNews";

import PasswordForgot from './Path/PasswordForgot';
import PasswordUpdate from './Path/PasswordUpdate';
import HEIDI_Logo from "./Resource/HEIDI_Logo.png";
import "./i18n";

//import OpenStreetMap from './Components/OpenStreetMap';

const App =()=>{
  useEffect(() => {
    const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = HEIDI_Logo;
      document.getElementsByTagName('head')[0].appendChild(link);
  }, []);
  return (
    <BrowserRouter>
      <div>
          <Routes>
            <Route path="/HomePage" element={<HomePage />}/>
            <Route path="/Places" element={<Places />}/>
            <Route path="/Below" element={<Below />}/>
            <Route path="/Fuchstal" element={<Fuchstal />}/>
            <Route path="/AppleVillage" element={<AppleVillage />}/>

            <Route path="/Example1" element={<Example1 />}/>
            <Route path="/Events" element={<Events />}/>
            <Route path="/ViewProfile" element={<ViewProfile />}/>
            <Route path="/CitizenService" element={<CitizenService />}/>
            <Route path="/ViewMoreListings" element={<ViewMoreListings />}/>

            <Route path="/Dashboard" element={<Dashboard />} exact/>
            <Route path="/ProfilePage" element={<ProfilePage />}/>
            <Route path="/PasswordForgot" element={<PasswordForgot />}/>
            <Route path="/PasswordUpdate" element={<PasswordUpdate />}/>
            <Route path="/" element={<LoginPage />}/>
            <Route path="/Register" element={<Register />}/>
            <Route path="/ImprintPage" element={<ImprintPage />}/>
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />}/>

            <Route path="/OverviewPage" element={<OverviewPage />}/>
            <Route path="/OverviewPage/NewsCategories" element={<OverviewPageNewsCategories />}/>
            <Route path="/ListingsPage/Newcitizeninfo" element={<ListingsPageNewcitizeninfo />}/>
            <Route path="/ListingsPage/Events" element={<ListingsPageEvents />}/>
            <Route path="/ListingsPage/ConstructionTraffic" element={<ListingsPageConstructionTraffic />}/>
            <Route path="/ListingsPage/Societies" element={<ListingsPageSocieties />}/>
            <Route path="/ListingsPage/RegionalProducts" element={<ListingsPageRegionalProducts />}/>
            <Route path="/ListingsPage/OfferSearch" element={<ListingsPageOfferSearch />}/>
            <Route path="/ListingsPage/DefectReporter" element={<ListingsPageDefectReporter />}/>
            <Route path="/ListingsPage/LostPropertyOffice" element={<ListingsPageLostPropertyOffice />}/>
            <Route path="/ListingsPage/Newsflash" element={<ListingsPageNewsflash />}/>
            <Route path="/ListingsPage/Club" element={<ListingsPageClub />}/>
            <Route path="/ListingsPage/Companyportaits" element={<ListingsPageCompanyportaits />}/>
            <Route path="/ListingsPage/Offers" element={<ListingsPageOffers />}/>
            <Route path="/ListingsPage/Sports" element={<ListingsPageSports />}/>
            <Route path="/ListingsPage/Alert" element={<ListingsPageAlert />}/>
            <Route path="/ListingsPage/Politics" element={<ListingsPagePolitics />}/>
            <Route path="/ListingsPage/Economy" element={<ListingsPageEconomy />}/>
            <Route path="/ListingsPage/ClubNews" element={<ListingsPageClubNews />}/>
            <Route path="/ListingsPage/TopicOfTheDay" element={<ListingsPageTopicOfTheDay />}/>
            <Route path="/ListingsPage/Local" element={<ListingsPageLocal />}/>
            <Route path='*' element={<Error />}/>
          </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;