import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Error from "./Path/Error";
import ForumsError from "./Path/ForumsError";
import ProfilePage from "./Path/ProfilePage";
import LoginPage from "./Path/LoginPage";
import Dashboard from "./Path/Dashboard";
import Register from "./Path/Register";
import ImprintPage from "./Path/ImprintPage";
import PrivacyPolicy from "./Path/PrivacyPolicy";
import LogoutSuccessPage from "./Components/LogoutSuccessPage";
import { AuthProvider } from "./AuthContext";

import HomePage from "./Path/HomePage";
import Favorites from "./Path/Favorites";

import Listing from "./Path/SubPages/Listing";
import AllListings from "./Path/SubPages/AllListings";
import ViewProfile from "./Path/SubPages/ViewProfile";
import CitizenService from "./Path/CitizenService";
import Forum from "./Path/Forums/Forum";
import UploadPosts from "./Path/Forums/UploadPosts";
import AllForums from "./Path/CitizenServices/AllForums";
import DigitalManagement from "./Path/CitizenServices/DigitalManagement";
import OverviewPage from "./Path/Listings/OverviewPage";
import OverviewPageNewsCategories from "./Path/Listings/OverviewPageNewsCategories";
import UploadListings from "./Path/UploadListings";
import CreateGroup from "./Path/CreateGroup";
import MyGroups from "./Path/MyGroups";
import VerifyEmail from "./Path/VerifyEmail";
import AccountSettings from "./Path/AccountSettings";
import AllDevices from "./Path/AllDevices";

import PasswordForgot from "./Path/PasswordForgot";
import PasswordUpdate from "./Path/PasswordUpdate";
import HeidiLogo from "./assets/HEIDI_Logo.png";
import "./i18n";

import ViewPost from "./Path/Forums/ViewPost";
import GroupMembers from "./Path/MyGroups/GroupMembers";
import MemberRequests from "./Path/MyGroups/MemberRequests";
import ReportedPosts from "./Path/MyGroups/ReportedPosts";

const App = () => {
  const isForumEnabled = process.env.REACT_APP_ENABLE_FORUM === "True";
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
      <AuthProvider>
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

            <Route path="/Dashboard" element={<Dashboard />} exact />
            <Route path="/DashboardAdmin" element={<Dashboard />} exact />
            <Route path="/AccountSettings" element={<AccountSettings />} exact />
            <Route path="/AllDevices" element={<AllDevices />} exact />
            <Route path="/UploadListings" element={<UploadListings />} exact />
            <Route path="/ProfilePage" element={<ProfilePage />} />
            <Route path="/PasswordForgot" element={<PasswordForgot />} />
            <Route path="/PasswordUpdate" element={<PasswordUpdate />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/Register" element={<Register />} />
            <Route path="/ImprintPage" element={<ImprintPage />} />
            <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
            <Route path="/EditListings" element={<UploadListings />} exact />

            <Route path="/Favorite" element={<Favorites />} />
            <Route path="/LogoutSuccessPage" element={<LogoutSuccessPage />} />

            <Route path="/OverviewPage" element={<OverviewPage />} />
            <Route
              path="/OverviewPage/NewsCategories"
              element={<OverviewPageNewsCategories />}
            />
            <Route path="/VerifyEmail" element={<VerifyEmail />} />
            <Route path="*" element={<Error />} />
            <Route path="ForumsError" element={<ForumsError />} />
            {isForumEnabled && (
              <React.Fragment>
                <Route path="/Forum/ViewPost" element={<ViewPost />} />
                <Route path="/Forum" element={<Forum />} />
                <Route path="/UploadPosts" element={<UploadPosts />} />
                <Route path="/CreateGroup" element={<CreateGroup />} exact />
                <Route path="/MyGroups" element={<MyGroups />} exact />
                <Route
                  path="/MyGroups/GroupMembers"
                  element={<GroupMembers />}
                  exact
                />
                <Route
                  path="/MyGroups/MemberRequests"
                  element={<MemberRequests />}
                  exact
                />
                <Route
                  path="/MyGroups/ReportedPosts"
                  element={<ReportedPosts />}
                  exact
                />
                <Route path="/CitizenService/AllForums" element={<AllForums />} />
              </React.Fragment>)}

          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
