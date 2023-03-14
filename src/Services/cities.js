import axios from "../api/axios";
var cityId = 2;

export async function getListings() {
    return axios.get(`/cities/`);
}