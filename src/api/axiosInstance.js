import axios from "axios";

function getLocalAccessToken() {
    const accessToken = window.localStorage.getItem("accessToken");
    return accessToken;
  }

export const instance = axios.create({
    // baseURL: "http://localhost:8080/api",
    baseURL: 'http://localhost:8002',
    headers: {
      "Content-Type": "application/json",
    },
  });

instance.interceptors.request.use(
    async (config) => {
      const token = getLocalAccessToken();
      if (token) {
        config.headers["authorization"] = "Bearer " + token;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = window.localStorage.getItem("refreshToken");
        const response = await instance.post('/refresh-token', { refreshToken });

        const newAccessToken = response.data.accessToken;
        window.localStorage.setItem("accessToken", newAccessToken);

        originalRequest.headers["authorization"] = "Bearer " + newAccessToken;

        return instance(originalRequest);
      } catch (refreshError) {
        // If refreshing the token fails, redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default axios.create({
    baseURL: 'http://localhost:8002'
});