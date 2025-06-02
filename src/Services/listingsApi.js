import { instance } from "../api/axiosInstance";
import { getUserId } from "./usersApi";
const axios = instance;
const isV2Backend = process.env.REACT_APP_V2_BACKEND === "True";

export async function getAllListings(params) {
    params.sortByStartDate = "true";
	return axios.get(`/listings`,{params});
}

export async function getListings(params) {
	params.showExternalListings = "true";
	params.sortByStartDate ="true";
	return axios.get(`/listings`, { params });
}
export async function getMyListing(params) {
	params.showExternalListings = "true";
	return axios.get(`/users/myListings`, { params });
}
export async function getListingsById(cityId, listingsId) {
	return axios.get(isV2Backend ? `/listings/${listingsId}` : `/cities/${cityId}/listings/${listingsId}`);
}

// export async function postListingsData(cityId, newListingsDataObj) {
// 	return axios.post(`/cities/${cityId}/listings`, newListingsDataObj);
// }

export async function postListingsData(newListingsDataObj) {
	return axios.post(`/listings`, newListingsDataObj);
}

export async function getListingsBySearch(params) {
	return axios.get(`/listings/search`, { params });
}

export async function uploadListingImage(formData, cityId, listingsId) {
	return axios.post(
		isV2Backend ? `/listings/${listingsId}/imageUpload` : `/cities/${cityId}/listings/${listingsId}/imageUpload`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	);
}

export async function uploadListingPDF(formData, cityId, listingsId) {
	return axios.post(
		isV2Backend ? `/listings/${listingsId}/pdfUpload` : `cities/${cityId}/listings/${listingsId}/pdfUpload`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	);
}

export async function deleteListingImage(cityId, listingsId) {
	return axios.delete(isV2Backend ? `listings/${listingsId}/imageDelete` : `/cities/${cityId}/listings/${listingsId}/imageDelete`);
}

export async function uploadPDF(formData) {
	return axios.post(`/users/${getUserId()}/pdfUpload`, formData, {
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
		isV2Backend ? `/listings/${listingsId}` : `/cities/${cityId}/listings/${listingsId}`,
		newListingsDataObj
	);
}

export async function deleteListing(cityId, listingsId) {
	return axios.delete(isV2Backend ? `listings/${listingsId}` : `/cities/${cityId}/listings/${listingsId}`);
}

export async function getListingsCount() {
	return axios.get(`/categories/listingsCount`);
}
