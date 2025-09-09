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
export async function postCatgeoryData(cityId, newCategoryDataObj) {
  return instance.post(`/cities/${cityId}/category`, newCategoryDataObj);
}

export const deleteCategory = (cityId, data) => {
  return axios.delete(`/cities/${cityId}/category`, { data });
};