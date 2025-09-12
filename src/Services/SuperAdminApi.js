import { instance } from "../api/axiosInstance";
const axios = instance;

export async function createCityAdmin(params) {
    return axios.post(`/admin/register`, params);
}

export async function fetchCreatedAdmins() {
    return axios.get("/admin/userlistings");
}
