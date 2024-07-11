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

// OWNER APIs Start

export async function getStoreById(cityId, storeId) {
    return axios.get(`/v1/cities/${cityId}/store/${storeId}`);
}

export async function updateStoreById(cityId, storeId, body) {
    return axios.patch(`/v1/cities/${cityId}/store/${storeId}`, body,);
}

export async function getShelves(cityId, storeId) {
    return axios.get(`/v1/cities/${cityId}/store/${storeId}/shelves`);
}

export async function createShelf(cityId, storeId, body) {
    return axios.post(`/v1/cities/${cityId}/store/${storeId}/shelves`, body,);
}

export async function getShelfById(cityId, storeId, shelfId) {
    return axios.get(`/v1/cities/${cityId}/store/${storeId}/shelve/${shelfId}`);
}

export async function getSellers(status, pageNo) {
    return axios.get(`/v1/owners/getSellers?status=${status}&pageNo=${pageNo}&pageSize=10`);
}

export async function getOrders(cityId, storeId, pageNo) {
    return axios.get(`/v1/cities/${cityId}/store/${storeId}/orders?pageNumber=${pageNo}&pageSize=10`);
}

export async function getProducts(cityId, storeId, pageNo) {
    return axios.get(`/v1/cities/${cityId}/store/${storeId}/products?pageNo=${pageNo}&pageSize=10`);
}

export async function getProductById(cityId, storeId, productId) {
    return axios.get(`/v1/cities/${cityId}/store/${storeId}/product/${productId}`);
}

export async function getOrderById(cityId, storeId, orderId) {
    return axios.get(`/v1/cities/${cityId}/store/${storeId}/orders/${orderId}`);
}

export async function getProductRequest(cityId, storeId, pageNo, status) {
    return axios.get(`/v1/cities/${cityId}/store/${storeId}/productRequest?pageNumber=${pageNo}&pageSize=10&status=${status}`);

}

export async function deleteSeller(sellerId) {
    return axios.delete(`/v1/owners/deleteSeller/${sellerId}`);
}