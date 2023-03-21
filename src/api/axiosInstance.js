import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8002'
  });

instance.interceptors.request.use(
    async (config) => {
      const token = window.localStorage.getItem("accessToken");
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
        const userId = window.localStorage.getItem("userId");
        const response = await instance.post(`users/${userId}/refresh`, { refreshToken });

        window.localStorage.setItem("accessToken", response.data.accessToken);
        window.localStorage.setItem("refreshToken", response.data.refreshToken);

        return instance(originalRequest);
      } catch (refreshError) {
        // If refreshing the token fails, redirect to login
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    window.location.href = "/";
    return Promise.reject(error);
  }
);

export default instance;