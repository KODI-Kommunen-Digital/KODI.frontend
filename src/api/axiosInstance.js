import axios from "axios";
const isV2Backend = process.env.REACT_APP_V2_BACKEND === "True";

// Function to create a new axios instance with a specified baseURL
const createInstance = (baseURL) => {
  const instance = axios.create({
    baseURL,
  });

  // const refreshInstance = axios.create({
  // 	baseURL: process.env.REACT_APP_API_BASE_URL,
  // });

  const handleLogout = () => {
    try {
      window.localStorage.removeItem("accessToken");
      window.localStorage.removeItem("refreshToken");
      window.localStorage.removeItem("userId");
      window.localStorage.removeItem("selectedItem");
      window.sessionStorage.removeItem("accessToken");
      window.sessionStorage.removeItem("refreshToken");
      window.sessionStorage.removeItem("userId");
      window.sessionStorage.removeItem("selectedItem");
      if (process.env.REACT_APP_LANG === "en") {
        alert("You have been logged out. Please log in again.");
      } else {
        alert("Sie wurden abgemeldet. Bitte loggen Sie sich erneut ein.");
      }
      window.location.href = "/login";
    } catch (error) {
      return error;
    }
  };

  // Request interceptor: Add authorization header with access token to each outgoing request
  instance.interceptors.request.use(
    async (config) => {
      // Retrieve access token from local storage or session storage
      const token =
        window.localStorage.getItem("accessToken") ||
        window.sessionStorage.getItem("accessToken");
      if (token) {
        // If token exists, add it to the request headers as a Bearer token
        config.headers.authorization = "Bearer " + token;
      }
      return config;
    },
    (error) => {
      // If an error occurs during request interception, reject the request with the error
      return Promise.reject(error);
    }
  );

  // Response interceptor: Handle token refresh on receiving a 401 Unauthorized response
  instance.interceptors.response.use(
    (response) => {
      // If the response is successful, return the response
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      if (error.response.status === 401) {
        console.log(originalRequest.url);
        // If the response status is 401 (Unauthorized), attempt to refresh the access token
        if (originalRequest.url.includes("/login")) {
          return Promise.reject(error);
        }
        if (!originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshToken =
              window.localStorage.getItem("refreshToken") ||
              window.sessionStorage.getItem("refreshToken");
            const userId =
              window.localStorage.getItem("userId") ||
              window.sessionStorage.getItem("userId");
            if (refreshToken && userId) {
              // Create a new axios instance for the token refresh request
              const refreshBaseURL = isV2Backend
                ? process.env.REACT_APP_API_BASE_URL_V2
                : process.env.REACT_APP_API_BASE_URL_V1;

              const refreshInstance = axios.create({
                baseURL: refreshBaseURL,
              });

              // Send a request to the server to refresh the access token using the refresh token
              const response = await refreshInstance.post(
                `users/${userId}/refresh`,
                {
                  refreshToken,
                }
              );
              if (window.localStorage.getItem("refreshToken")) {
                // If using local storage for refresh token, update access and refresh tokens in local storage
                window.localStorage.setItem(
                  "accessToken",
                  response.data.data.accessToken
                );
                window.localStorage.setItem(
                  "refreshToken",
                  response.data.data.refreshToken
                );
              } else if (window.sessionStorage.getItem("refreshToken")) {
                // If using session storage for refresh token, update access and refresh tokens in session storage
                window.sessionStorage.setItem(
                  "accessToken",
                  response.data.data.accessToken
                );
                window.sessionStorage.setItem(
                  "refreshToken",
                  response.data.data.refreshToken
                );
              }
              // Retry the original request with the updated access token
              return instance(originalRequest);
            } else {
              // If refresh token or user ID is missing, handle logout and reject the original request
              handleLogout();
              return Promise.reject(error);
            }
          } catch (refreshError) {
            // If an error occurs during token refresh, handle logout and reject the original request
            handleLogout();
            return Promise.reject(refreshError);
          }
        } else {
          // If the original request has already been retried, handle logout and reject the request
          handleLogout();
          return Promise.reject(error);
        }
      }
      return Promise.reject(error);
    }
  );

  // Return the created axios instance
  return instance;
};

// Create instances for different API endpoints using the createInstance function and export them
const baseURL = isV2Backend
  ? process.env.REACT_APP_API_BASE_URL_V2
  : process.env.REACT_APP_API_BASE_URL_V1;

const instance = createInstance(baseURL);
const forumInstance = createInstance(process.env.REACT_APP_API_FORUM_URL);
const carParkApiInterfaceInstance = createInstance(process.env.REACT_APP_CAR_PARK_API_INTERFACE_URL);
const appointmentInstance = createInstance(
  process.env.REACT_APP_API_APPOINTMENT_URL
);
const containerInstance = createInstance(
  process.env.REACT_APP_API_CONTAINER_URL
);

export { instance, forumInstance, appointmentInstance, containerInstance, carParkApiInterfaceInstance };
