import { categoryById } from "../Constants/categories";
import axios from "../api/axiosInstance";


export async function getCategory() {
	return instance.get(`/categories`);
}

export async function getCategoryListings(cityId , categoryId) {
	return instance.get(`/cities/${cityId}/categories/${categoryId}`);
}
