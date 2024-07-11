import { containerInstance } from "../api/axiosInstance";
const axios = containerInstance;

export async function getStoreById(cityId,storeId) {
	return axios.get(`/v1/cities/${cityId}/store/${storeId}`);
}
export async function updateStoreById(cityId,storeId,body) {
	return axios.patch(`/v1/cities/${cityId}/store/${storeId}`,body,);
}
export async function getShelves(cityId,storeId) {
	return axios.get(`/v1/cities/${cityId}/store/${storeId}/shelves`);
}
export async function createShelf(cityId,storeId,body) {
	return axios.post(`/v1/cities/${cityId}/store/${storeId}/shelves`,body,);
}
export async function getShelfById(cityId,storeId,shelfId) {
	return axios.get(`/v1/cities/${cityId}/store/${storeId}/shelve/${shelfId}`);
}
// export async function removeProductFromShelf(shelfId,body) {
// 	return axios.patch(`/v1/owners/removeShelfProduct/${shelfId}`,body,);
// }
export async function getSellers(status,pageNo) {
	return axios.get(`/v1/owners/getSellers?status=${status}&pageNo=${pageNo}&pageSize=10`);
}
export async function getOrders(cityId,storeId,pageNo) {
	return axios.get(`/v1/cities/${cityId}/store/${storeId}/orders?pageNumber=${pageNo}&pageSize=10`);
}
export async function getProducts(cityId,storeId,pageNo) {
	return axios.get(`/v1/cities/${cityId}/store/${storeId}/products?pageNo=${pageNo}&pageSize=10`);
}
export async function getProductById(cityId,storeId,productId) {
	return axios.get(`/v1/cities/${cityId}/store/${storeId}/product/${productId}`);
}
// export async function deleteProduct(cityId,storeId,productId) {
// 	return axios.delete(`/v1/cities/${cityId}/store/${storeId}/product/${productId}`);
// }
// export async function updateProduct(cityId,storeId,productId,body) {
// 	return axios.patch(`/v1/cities/${cityId}/store/${storeId}/product/${productId}`,body,);
// }
export async function getOrderById(cityId,storeId,orderId) {
	return axios.get(`/v1/cities/${cityId}/store/${storeId}/orders/${orderId}`);
}
export async function getProductRequest(cityId,storeId,pageNo,status) {
	return axios.get(`/v1/cities/${cityId}/store/${storeId}/productRequest?pageNumber=${pageNo}&pageSize=10&status=${status}`);

}
// export async function getProductRequestById(cityId,storeId,requestId) {
// 	return axios.get(`/v1/cities/${cityId}/store/${storeId}/productRequest/${requestId}`);
// }
// export async function approveProductRequest(requestId,body) {
// 	return axios.patch(`/v1/owners/updateProductRequest/${requestId}`,body,);
// }
// export async function approveSellerRequest(sellerId,body) {
// 	return axios.patch(`/v1/owners/updateSeller/${sellerId}`,body,);
// }
export async function deleteSeller(sellerId) {
	return axios.delete(`/v1/owners/deleteSeller/${sellerId}`);
}
