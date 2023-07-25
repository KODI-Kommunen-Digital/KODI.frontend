import { instance } from "../api/axiosInstance";
const axios = instance

export async function getVillages(cityId) {
    return axios.get(`/cities/${cityId}/villages`);
}