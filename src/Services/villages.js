import getInstance from "../api/axiosInstance";
const axios = getInstance(process.env.REACT_APP_API_BASE_URL)

export async function getVillages(cityId) {
    return axios.get(`/cities/${cityId}/villages`);
}