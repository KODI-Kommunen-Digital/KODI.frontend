import axios from "../api/axiosInstance";

export async function getCities() {
    return axios.get(`/cities`);
}