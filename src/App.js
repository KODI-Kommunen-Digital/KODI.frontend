import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Error from "./Path/Error";
import ProfilePage from "./Path/ProfilePage";
import LoginPage from "./Path/LoginPage";
import Dashboard from "./Path/Dashboard";
import Register from "./Path/Register";
import ImprintPage from "./Path/ImprintPage";
import PrivacyPolicy from "./Path/PrivacyPolicy";
import LogoutSuccessPage from "./Components/LogoutSuccessPage";

import HomePage from "./Path/HomePage";
import Favorites from "./Path/Favorites";

import Listing from "./Path/SubPages/Listing";
import AllListings from "./Path/SubPages/AllListings";
import ViewProfile from "./Path/SubPages/ViewProfile";
import CitizenService from "./Path/CitizenService";
import DigitalManagement from "./Path/CitizenServices/DigitalManagement";
import Forums from "./Path/CitizenServices/Forums";
import OverviewPage from "./Path/Listings/OverviewPage";
import OverviewPageNewsCategories from "./Path/Listings/OverviewPageNewsCategories";
import UploadListings from "./Path/UploadListings";
import VerifyEmail from "./Path/VerifyEmail";
import AccountSettings from "./Path/AccountSettings";
import AllDevices from "./Path/AllDevices";
import PrivacyPolicyPopup from "./Path/PrivacyPolicyPopup";

import PasswordForgot from "./Path/PasswordForgot";
import PasswordUpdate from "./Path/PasswordUpdate";
import HeidiLogo from "./assets/HEIDI_Logo.png";
import "./i18n";

const App = () => {
	useEffect(() => {
		const link =
			document.querySelector("link[rel*='icon']") ||
			document.createElement("link");
		link.type = "image/x-icon";
		link.rel = "shortcut icon";
		link.href = HeidiLogo;
		document.getElementsByTagName("head")[0].appendChild(link);
	}, []);
	return (
		<BrowserRouter>
			<div>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="Listing" element={<Listing />} exact />
					<Route path="/AllListings" element={<AllListings />} />
					<Route path="/ViewProfile/:username" element={<ViewProfile />} />
					<Route path="/CitizenService" element={<CitizenService />} />
					<Route
						path="/CitizenService/DigitalManagement"
						element={<DigitalManagement />}
					/>
					<Route path="/CitizenService/Forums" element={<Forums />} />

					<Route path="/Dashboard" element={<Dashboard />} exact />
					<Route path="/DashboardAdmin" element={<Dashboard />} exact />
					<Route path="/AccountSettings" element={<AccountSettings />} exact />
					<Route path="/AllDevices" element={<AllDevices />} exact />
					<Route
						path="/PrivacyPolicyPopup"
						element={<PrivacyPolicyPopup />}
						exact
					/>
					<Route path="/UploadListings" element={<UploadListings />} exact />
					<Route path="/ProfilePage" element={<ProfilePage />} />
					<Route path="/PasswordForgot" element={<PasswordForgot />} />
					<Route path="/PasswordUpdate" element={<PasswordUpdate />} />
					<Route path="/login" element={<LoginPage />} />
					<Route path="/Register" element={<Register />} />
					<Route path="/ImprintPage" element={<ImprintPage />} />
					<Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />

					<Route path="/Favorite" element={<Favorites />} />
					<Route path="/LogoutSuccessPage" element={<LogoutSuccessPage />} />

					<Route path="/OverviewPage" element={<OverviewPage />} />
					<Route
						path="/OverviewPage/NewsCategories"
						element={<OverviewPageNewsCategories />}
					/>
					<Route path="/VerifyEmail" element={<VerifyEmail />} />
					<Route path="*" element={<Error />} />
				</Routes>
			</div>
		</BrowserRouter>
	);
};

export default App;
