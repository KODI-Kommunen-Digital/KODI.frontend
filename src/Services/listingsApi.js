import axios from "../api/axiosInstance";

export async function getAllListings() {
    return axios.get(`/listings`);
}

export async function getListings(params) {
    return axios.get(`/listings?${Object.keys(params)}=${Object.values(params)}` , params);
}

export async function getListingsByCity(cityId, params) {
    return axios.get(`/cities/${cityId}/listings?&${Object.keys(params)}=${Object.values(params)}`);
}

export async function getListingsById(cityId, listingsId) {
    return axios.get(`/cities/${cityId}/listings/${listingsId}`);
}

export async function postListingsData(cityId, newListingsDataObj) {
    return axios.post(`/cities/${cityId}/listings`, newListingsDataObj);
}

export async function updateListingsData(cityId, newListingsDataObj, listingsId) {
    return axios.patch(`/cities/${cityId}/listings/${listingsId}`, newListingsDataObj);
}