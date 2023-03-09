import axios from "../api/axios";
var userId = 1;

export async function getProfile() {
    return axios.get(`/users/${userId}`);
}

export async function updateProfile(newProfileObj) {
    return axios.patch(`/users/${userId}`, newProfileObj);
}