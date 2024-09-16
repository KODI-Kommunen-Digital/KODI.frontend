import React from "react";
import "./index.css";
import App from "./App";
import "./instrument";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { MatomoProvider, createInstance } from '@datapunt/matomo-tracker-react';

// Create the Matomo instance with your Matomo Cloud information
const instance = createInstance({
  urlBase: process.env.REACT_APP_MATOMO_URL_BASE,  // Matomo Cloud URL from env
  siteId: process.env.REACT_APP_MATOMO_SITE_ID,  // Site ID from env
  trackerUrl: process.env.REACT_APP_MATOMO_TRACKER_URL,  // Tracker URL from env
  srcUrl: process.env.REACT_APP_MATOMO_SRC_URL,  // JavaScript URL from env
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MatomoProvider value={instance}>
      <AuthProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </AuthProvider>
    </MatomoProvider>
  </React.StrictMode>
);

reportWebVitals();