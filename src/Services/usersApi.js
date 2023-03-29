import axios from "../api/axiosInstance";
var userId = window.localStorage.getItem("userId");

export async function getProfile() {
    return axios.get(`/users/${userId}`);
}

export async function updateProfile(newProfileObj) {
    return axios.patch(`/users/${userId}`, newProfileObj);
}

export async function resetPass(credentials) {
    return axios.post(`/users/forgotPassword`, credentials);
}

export async function updatePassword(credentials) {
    return axios.post(`/users/resetPassword`, credentials);
}

export async function register(credentials) {
    return axios.post(`/users/register`, credentials);
}