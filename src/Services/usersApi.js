import axios from "../api/axiosInstance";

function getUserId() {
    return window.localStorage.getItem("userId");
}

export async function getProfile() {
    return axios.get(`/users/${getUserId()}`);
}

export async function updateProfile(newProfileObj) {
    return axios.patch(`/users/${getUserId()}`, newProfileObj);
}

export async function getListings() {
    return axios.get(`/users/${getUserId()}/listings`);
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