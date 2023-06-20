import axios from "../api/axiosInstance";
import { getUserId } from "./usersApi";

export async function getAllForums() {
	return axios.get(`/listings`);
}

export async function getForums(params) {
	return axios.get(`/listings`, { params });
}

export async function getForumsByCity(cityId, params) {
	return axios.get(`/cities/${cityId}/listings`, { params });
}

export async function getForumsById(cityId, listingsId) {
	return axios.get(`/cities/${cityId}/listings/${listingsId}`);
}

export async function postForumsData(cityId, newListingsDataObj) {
	return axios.post(`/cities/${cityId}/listings`, newListingsDataObj);
}

export async function getUserForums() {
	return axios.get(`/users/${getUserId()}/forums`);
}

export async function uploadImage(formData) {
	return axios.post(`/users/${getUserId()}/imageUpload`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}

export async function updateForumsData(cityId, newListingsDataObj, listingsId) {
	return axios.patch(
		`/cities/${cityId}/listings/${listingsId}`,
		newListingsDataObj
	);
}

export async function deleteForums(cityId, listingsId) {
	return axios.delete(`/cities/${cityId}/listings/${listingsId}`);
}
