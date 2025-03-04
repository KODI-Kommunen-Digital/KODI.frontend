import React from "react";
import "./index.css";
import App from "./App";
import "./instrument";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthProvider";
import { ChakraProvider } from "@chakra-ui/react";
import { MatomoProvider, createInstance } from "@datapunt/matomo-tracker-react";

// Disable Zoom for Hamburg Terminal
const enableTerminalScreen =
  process.env.REACT_APP_ENABLE_TERMINALSCREEN === "True";
const existingMetaViewport = document.querySelector("meta[name=viewport]");
if (existingMetaViewport) {
  existingMetaViewport.remove();
}
const metaViewport = document.createElement("meta");
metaViewport.name = "viewport";
metaViewport.content = enableTerminalScreen
  ? "width=device-width, initial-scale=1.0, user-scalable=no, maximum-scale=1.0, minimum-scale=1.0"
  : "width=device-width, initial-scale=1";

document.head.appendChild(metaViewport);
const preventZoom = (event) => {
  event.preventDefault();
};
if (enableTerminalScreen) {
  document.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey) event.preventDefault();
    },
    { passive: false }
  );

  document.addEventListener("gesturestart", preventZoom, { passive: false });
} else {
  document.removeEventListener("gesturestart", preventZoom);
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
