import { categoryById } from "../Constants/categories";
import axios from "../api/axiosInstance";

const instance = axios.create({
    baseURL: 'http://localhost:8002'
  });


export async function getCategory() {
	return instance.get(`/categories`);
}

export async function getCategoryListings(cityId , categoryId) {
	return instance.get(`/cities/${cityId}/categories/${categoryId}`);
}
