import axios from "../api/axiosInstance";
var userId = 1;

export async function getProfile() {
    return axios.get(`/users/${userId}`);
}

export async function updateProfile(newProfileObj) {
    return axios.patch(`/users/${userId}`, newProfileObj);
}

export async function login(credentials) {
    return axios.post(`/users/login`, credentials);
}

export async function resetPass(credentials) {
    return axios.post(`/users/forgotPassword`, credentials);
}