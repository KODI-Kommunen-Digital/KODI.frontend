import axios from "../api/axiosInstance";
import { getUserId } from "./usersApi";

export async function getAllListings() {
    return axios.get(`/listings`);
}

export async function getListings(params) {
    return axios.get(`/listings`, { params });
}

export async function getListingsByCity(cityId, params) {
    return axios.get(`/cities/${cityId}/listings`, { params });
}

export async function getListingsById(cityId, listingsId) {
    return axios.get(`/cities/${cityId}/listings/${listingsId}`);
}

export async function postListingsData(cityId, newListingsDataObj) {
    return axios.post(`/cities/${cityId}/listings`, newListingsDataObj);
}

export async function uploadImage(formData) {
    return axios.post(`/users/${getUserId()}/imageUpload`, formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}

export async function updateListingsData(
    cityId,
    newListingsDataObj,
    listingsId
) {
    return axios.patch(
        `/cities/${cityId}/listings/${listingsId}`,
        newListingsDataObj
    );
}

export async function deleteListing(cityId, listingsId) {
    return axios.delete(`/cities/${cityId}/listings/${listingsId}`);
}
