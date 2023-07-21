import getInstance from "../api/axiosInstance";
const axios = getInstance(process.env.REACT_APP_API_BASE_URL)

export async function getCategory() {
    return axios.get(`/categories`);
}

export async function getCategoryListings(cityId, categoryId) {
    return axios.get(`/cities/${cityId}/categories/${categoryId}`);
}
