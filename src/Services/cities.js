import axios from "../api/axiosInstance";
var cityId = 2;

export async function getListings() {
    return axios.get(`/cities/`);
}