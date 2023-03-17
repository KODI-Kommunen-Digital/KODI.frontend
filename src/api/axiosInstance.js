import axios from "axios";

function getLocalAccessToken() {
    const accessToken = window.localStorage.getItem("accessToken");
    return accessToken;
  }

const instance = axios.create({
    // baseURL: "http://localhost:8080/api",
    baseURL: 'http://localhost:8002',
    headers: {
      "Content-Type": "application/json",
    },
  });

instance.interceptors.request.use(
    (config) => {
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


export default axios.create({
    baseURL: 'http://localhost:8002'
});