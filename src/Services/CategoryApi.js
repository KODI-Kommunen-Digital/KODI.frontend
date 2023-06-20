import axios from "../api/axiosInstance";


export async function getCategory() {
    return axios.get(`/categories`);
}

export async function getCategoryListings(cityId , categoryId) {
    return axios.get(`/cities/${cityId}/categories/${categoryId}`);
}
