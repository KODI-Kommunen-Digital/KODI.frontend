import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
  });

function getUserId() {
  return window.localStorage.getItem("userId");
}

export async function login(credentials) {
    return instance.post(`/users/login`, credentials);
}

export async function logout(credentials) {
  return instance.post(`/${getUserId()}/logout`, credentials);
}