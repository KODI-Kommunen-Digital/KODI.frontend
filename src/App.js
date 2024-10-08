import React, { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Error from "./Path/Error";
import ForumsError from "./Path/ForumsError";
import ProfilePage from "./Path/ProfilePage";
import LoginPage from "./Path/LoginPage";
import Dashboard from "./Path/Dashboard";
import Register from "./Path/Register";
import ImprintPage from "./Path/ImprintPage";
import Summary from "./Path/AppointmentBooking/Summary";
import BookingSuccessConfirmation from "./Path/AppointmentBooking/BookingSuccessConfirmation";
import BookingErrorConfirmation from "./Path/AppointmentBooking/BookingErrorConfirmation";
import PrivacyPolicy from "./Path/PrivacyPolicy";
import TermsOfUse from "./Path/TermsOfUse";
import LogoutSuccessPage from "./Components/LogoutSuccessPage";

import HomePageV1 from "./Path/V1/HomePage";
import HomePageV2 from "./Path/V2/HomePage";
import AllListingsV1 from "./Path/V1/AllListings";
import AllListingsV2 from "./Path/V2/AllListings";

import Favorites from "./Path/Favorites";
import Listing from "./Path/SubPages/Listing";
import ViewProfile from "./Path/SubPages/ViewProfile";
import CitizenService from "./Path/CitizenService";
import Forum from "./Path/Forums/Forum";
import UploadPosts from "./Path/Forums/UploadPosts";
import AllForums from "./Path/CitizenServices/AllForums";
import CitizenServiceManagement from "./Path/CitizenServices/CitizenServiceManagement";
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
import IFrame from "./Path/Listings/IFrame";
import IFrameListing from "./Path/Listings/IFrameListing.jsx";
import MyAppointments from "./Path/AppointmentBooking/MyAppointments";
import AppointmentsUserCreated from "./Path/AppointmentBooking/AppointmentsUserCreated";
import BookMyAppointments from "./Path/AppointmentBooking/BookMyAppointments";
import MyBookings from "./Path/AppointmentBooking/MyBookings";

import SellerScreen from "./Path/Container/SellerScreen";
import SellerRequests from "./Path/Container/SellerRequests";
import SellerRequestPage from "./Path/Container/SellerRequestPage";
import OrdersSold from "./Path/Container/OrdersSold";
import AddNewProducts from "./Path/Container/AddNewProducts";
import AllProducts from "./Path/Container/AllProducts";
import CustomerScreen from "./Path/Container/CustomerScreen";
import MyOrders from "./Path/Container/MyOrders";
import PaymentStatus from "./Path/Container/PaymentStatus";
import GetCard from "./Path/Container/GetCard";
import OwnerScreen from "./Path/Container/OwnerScreen";
import StoreDetails from "./Path/Container/StoreDetails";
import ViewCategories from "./Path/Container/ViewCategories";
import AddCategoryAndSubCategory from "./Path/Container/AddCategoryAndSubCategory";
import ProductStore from "./Path/Container/ProductStore";
import ProductDetailsStore from "./Path/Container/ProductDetailsStore";
import AllProductsDetailsPage from "./Path/Container/AllProductsDetailsPage";
import Shelves from "./Path/Container/Shelves";
import AllOrders from "./Path/Container/AllOrders";
import AllProductRequests from "./Path/Container/AllProductRequests";
import CreateShelves from "./Path/Container/CreateShelves";
import SellerRequestsApproval from "./Path/Container/SellerRequestsApproval";
import SellerDetailsStore from "./Path/Container/SellerDetailsStore";
import OrderDetails from "./Path/Container/OrderDetails";
import AllProductRequestsDetails from "./Path/Container/AllProductRequestsDetails";
import OrderDetailsStore from "./Path/Container/OrderDetailsStore";

import Modal from "react-modal";
Modal.setAppElement("#root");

const App = () => {
  const isForumEnabled = process.env.REACT_APP_ENABLE_FORUM === "True";
  const isAppointmentEnabled = process.env.REACT_APP_ENABLE_APPOINMENT_BOOKING === "True";
  const isContainerEnabled = process.env.REACT_APP_ENABLE_CONTAINER === "True";
  const inFrame = process.env.REACT_APP_INFRAME === "True";
  const frontendVersion = process.env.REACT_APP_FORNTENDVERSION || '1';

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
          <Route path="/" element={frontendVersion === '1' ? <HomePageV1 /> : <HomePageV2 />} />
          <Route path="/Listing" element={<Listing />} exact />
          <Route path="/AllListings" element={frontendVersion === '1' ? <AllListingsV1 /> : <AllListingsV2 />} />
          <Route path="/ViewProfile/:username" element={<ViewProfile />} />
          <Route path="/CitizenService" element={<CitizenService />} />
          <Route
            path="/CitizenService/CitizenServiceManagement"
            element={<CitizenServiceManagement />}
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
          <Route path="/TermsOfUse" element={<TermsOfUse />} />
          <Route path="/EditListings" element={<UploadListings />} exact />

          {inFrame && (
            <React.Fragment>
              <Route
                path="/IFrame"
                element={
                  <IFrame cityId={process.env.REACT_APP_INFRAME_CITYID || '1'} />
                }
                exact
              />
              <Route path="/IFrameListing" element={<IFrameListing />} exact />
            </React.Fragment>
          )}

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
            </React.Fragment>
          )}

          {isAppointmentEnabled && (
            <React.Fragment>
              <Route
                path="/AppointmentBooking/MyAppointments"
                element={<MyAppointments />}
                exact
              />
              <Route
                path="/AppointmentBooking/MyBookings"
                element={<MyBookings />}
                exact
              />
              <Route
                path="/AppointmentBooking/AppointmentsUserCreated"
                element={<AppointmentsUserCreated />}
                exact
              />
              <Route
                path="/Listings/BookAppointments"
                element={<BookMyAppointments />}
                exact
              />
              <Route
                path="/AppointmentBooking/BookAppointments/Summary"
                element={<Summary />}
              />
              <Route
                path="/AppointmentBooking/BookAppointments/BookingSuccessConfirmation"
                element={<BookingSuccessConfirmation />}
              />

              <Route
                path="/AppointmentBooking/BookAppointments/BookingErrorConfirmation"
                element={<BookingErrorConfirmation />}
              />
            </React.Fragment>
          )}

          {isContainerEnabled && (
            <React.Fragment>
              <Route
                path="/OwnerScreen"
                element={<OwnerScreen />}
                exact
              />

              <Route
                path="/SellerScreen"
                element={<SellerScreen />}
                exact
              />

              <Route
                path="/CustomerScreen"
                element={<CustomerScreen />}
                exact
              />

              <Route
                path="/SellerScreen/SellerRequestPage"
                element={<SellerRequestPage />}
                exact
              />

              <Route
                path="/SellerScreen/SellerRequests"
                element={<SellerRequests />}
                exact
              />

              <Route
                path="/SellerScreen/OrdersSold"
                element={<OrdersSold />}
                exact
              />

              <Route
                path="/SellerScreen/AddNewProducts"
                element={<AddNewProducts />}
                exact
              />

              <Route
                path="/SellerScreen/AllProducts"
                element={<AllProducts />}
                exact
              />

              <Route
                path="/SellerScreen/AllProductsDetailsPage"
                element={<AllProductsDetailsPage />}
                exact
              />

              <Route
                path="/CustomerScreen/MyOrders"
                element={<MyOrders />}
                exact
              />

              <Route
                path="/CustomerScreen/PaymentStatus"
                element={<PaymentStatus />}
                exact
              />

              <Route
                path="/CustomerScreen/GetCard"
                element={<GetCard />}
                exact
              />

              <Route
                path="/CustomerScreen/OrderDetails"
                element={<OrderDetails />}
                exact
              />

              <Route
                path="/OwnerScreen/StoreDetails"
                element={<StoreDetails />}
                exact
              />

              <Route
                path="/OwnerScreen/ViewCategories"
                element={<ViewCategories />}
                exact
              />

              <Route
                path="/OwnerScreen/AddCategoryAndSubCategory"
                element={<AddCategoryAndSubCategory />}
                exact
              />

              <Route
                path="/OwnerScreen/ProductStore"
                element={<ProductStore />}
                exact
              />

              <Route
                path="/OwnerScreen/ProductDetailsStore"
                element={<ProductDetailsStore />}
                exact
              />

              <Route
                path="/OwnerScreen/AllProductRequestsDetails"
                element={<AllProductRequestsDetails />}
                exact
              />

              <Route
                path="/OwnerScreen/SellerDetailsStore"
                element={<SellerDetailsStore />}
                exact
              />

              <Route
                path="/OwnerScreen/Shelves"
                element={<Shelves />}
                exact
              />

              <Route
                path="/OwnerScreen/AllOrders"
                element={<AllOrders />}
                exact
              />

              <Route
                path="/OwnerScreen/AllProductRequests"
                element={<AllProductRequests />}
                exact
              />

              <Route
                path="/OwnerScreen/CreateShelves"
                element={<CreateShelves />}
                exact
              />

              <Route
                path="/OwnerScreen/SellerRequestsApproval"
                element={<SellerRequestsApproval />}
                exact
              />

              <Route
                path="/OwnerScreen/OrderDetailsStore"
                element={<OrderDetailsStore />}
                exact
              />

            </React.Fragment>
          )}

        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
