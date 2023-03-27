import axios from "../api/axiosInstance";

export async function getVillages(cityId) {
    return axios.get(`/cities/${cityId}/villages`);
}