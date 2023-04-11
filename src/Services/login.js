import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8002'
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