import { containerInstance } from "../api/axiosInstance";
// import { getUserId } from "./usersApi";
const axios = containerInstance;

export async function createSellerAccount() {
    return axios.get(`/v1/seller`);
}

export async function getShopsInACity(cityId) {
    return axios.get(`/v1/cities/${cityId}/store`);
}

export async function getSellerRequests(params) {
    return axios.get(`/v1/seller/requests`, { params });
}

export async function getOrdersSold(params) {
    return axios.get(`/v1/seller/orderSold`, { params });
}

export async function createNewProduct(cityId, storeId, params) {
    return axios.post(`/v1/cities/${cityId}/store/${storeId}/product`, { params });
}