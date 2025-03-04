import React from "react";
import "./index.css";
import App from "./App";
import "./instrument";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

// Cancel zoom for Hamburg terminal
const enableTerminalScreen =
  process.env.REACT_APP_ENABLE_TERMINALSCREEN === "True";
const metaViewport = document.querySelector("meta[name=viewport]");

if (metaViewport) {
  metaViewport.setAttribute(
    "content",
    enableTerminalScreen
      ? "width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0"
      : "width=device-width, initial-scale=1"
  );
} else {
  const newMetaViewport = document.createElement("meta");
  newMetaViewport.name = "viewport";
  newMetaViewport.content = enableTerminalScreen
    ? "width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0"
    : "width=device-width, initial-scale=1";
  document.head.appendChild(newMetaViewport);
}

// Check the Matomo status
const matomoStatus = process.env.REACT_APP_MATOMO_STATUS === "True";

let instance;
if (matomoStatus) {
  // Create the Matomo instance only if the status is True
  instance = createInstance({
    urlBase: process.env.REACT_APP_MATOMO_URL_BASE, // Matomo Cloud URL from env
    siteId: process.env.REACT_APP_MATOMO_SITE_ID, // Site ID from env
    trackerUrl: process.env.REACT_APP_MATOMO_TRACKER_URL, // Tracker URL from env
    srcUrl: process.env.REACT_APP_MATOMO_SRC_URL, // JavaScript URL from env
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    {matomoStatus ? (
      <MatomoProvider value={instance}>
        <AuthProvider>
          <ChakraProvider>
            <App />
          </ChakraProvider>
        </AuthProvider>
      </MatomoProvider>
    ) : (
      <AuthProvider>
        <ChakraProvider>
          <App />
        </ChakraProvider>
      </AuthProvider>
    )}
  </React.StrictMode>
);

reportWebVitals();
