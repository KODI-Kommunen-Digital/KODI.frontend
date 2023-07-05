import axios from "../api/axiosInstance";
import { getUserId } from "./usersApi";

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

export async function updateForumsData(cityId, newForumDataObj, forumsId) {
	return axios.patch(`/cities/${cityId}/forums/${forumsId}`, newForumDataObj);
}

export async function postForumsData(cityId, newForumDataObj) {
	return axios.post(`/cities/${cityId}/forums`, newForumDataObj);
}

export async function deleteForums(cityId, listingsId) {
	return axios.delete(`/cities/${cityId}/listings/${listingsId}`);
}

export async function imageUpload(cityId, forumsId) {
	return axios.post(`/cities/${cityId}/forums/${forumsId}/imageUpload`);
}

export async function imageUpdate(cityId, forumsId) {
	return axios.patch(`/cities/${cityId}/forums/${forumsId}/imageUpload`);
}
