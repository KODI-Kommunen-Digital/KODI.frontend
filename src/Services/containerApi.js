import { containerInstance } from "../api/axiosInstance";
import { getUserId } from "./usersApi";
const axios = containerInstance;

export async function createSellerAccount(params) {
    return axios.post(`/v1/seller`, params);
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
    return axios.post(`/v1/cities/${cityId}/store/${storeId}/product`, params);
}

export async function getMyOrders() {
    return axios.get(`/v1/users/${getUserId()}/orders`);
}

export async function getOrderDetails(orderId) {
    return axios.get(`/v1/users/${getUserId()}/order/${orderId}`);
}

export async function getPaymentDetails(cardId, params) {
    return axios.get(`/v1/users/${getUserId()}/card/${cardId}/transactions`, params);
}

export async function getCards() {
    return axios.get(`/v1/users/${getUserId()}/cards`);
}

export async function associateCard(cardId) {
    return axios.post(`/v1/users/${getUserId()}/card/${cardId}/associate`);
}