import axios from "../api/axiosInstance";

export async function getListings(params) {
    return axios.get(`/listings` , params);
}

export async function getListingsByCity(cityId, parmas) {
    return axios.get(`/cities/${cityId}/listings` , parmas);
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