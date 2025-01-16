import { instance } from "../api/axiosInstance";
const axios = instance;

export async function getCategory() {
  return axios.get(`/categories`);
}

export async function getCategoryListings(cityId, categoryId) {
  return axios.get(`/cities/${cityId}/categories/${categoryId}`);
}

export async function getCitizenServices() {
  return axios.get(`/citizenServices`);
}

export async function getListingsSubCategory(categoryId) {
  return axios.get(`/categories/${categoryId}/subcategories`);
}
