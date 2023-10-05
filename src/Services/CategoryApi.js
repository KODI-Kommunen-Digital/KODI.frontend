import axios from "../api/axiosInstance";

export async function getCategory() {
	return axios.get(`/categories`);
}

export async function getCategoryListings(cityId, categoryId) {
	return axios.get(`/cities/${cityId}/categories/${categoryId}`);
}

export async function getCitizenServices() {
	return axios.get(`/citizenServices`);
}

export async function getNewsSubCategory(cityId) {
	return axios.get(`/categories/1/subcategories`);
}
