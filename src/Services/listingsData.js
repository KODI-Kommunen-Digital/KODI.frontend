import axios from "../api/axios";
var listingsId = 2;
var cityId = 2;

export async function getListings() {
    return axios.get(`/cities/${cityId}/listings/${listingsId}`);
}

export async function updateListings(newListingsObj) {
    return axios.patch(`/cities/${cityId}/listings/${listingsId}`, newListingsObj);
}