import axios from "../api/axiosInstance";
var listingsId = 2;
var cityId = 1;

export async function getListingsData(listingId) {
    return axios.get(`/cities/${cityId}/listings/${listingsId}` , listingId);
}

export async function postListingsData(newListingsDataObj) {
    return axios.post(`/cities/${cityId}/listings`, newListingsDataObj);
}

export async function updateListingsData(newListingsDataObj) {
    return axios.patch(`/cities/${cityId}/listings/${listingsId}`, newListingsDataObj);
}