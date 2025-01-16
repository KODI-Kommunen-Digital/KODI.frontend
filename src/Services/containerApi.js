import { containerInstance } from "../api/axiosInstance";
import { getUserId } from "./usersApi";
const axios = containerInstance;

export async function createSellerAccount(params) {
  return axios.post(`/v1/seller`, params);
}

export async function getShopsInACity(cityId) {
  return axios.get(`/v1/cities/${cityId}/store`);
}

export async function getOwnerShops(params) {
  return axios.get(`/v1/owners/getStores`, { params });
}

export async function getSellerShops(params) {
  return axios.get(`/v1/seller/getStores`, { params });
}

export async function getUserRoleContainer() {
  return axios.get(`/v1/users/${getUserId()}`);
}

export async function getSellerRequests(cityId, storeId, status, params) {
  return axios.get(
    `/v1/seller/requests?cityId=${cityId}&storeId=${storeId}&status=${status}`,
    params
  );
}

export async function getOrdersSold(params) {
  return axios.get(`/v1/seller/orderSold`, { params });
}

export async function createNewProduct(cityId, storeId, params) {
  return axios.post(`/v1/cities/${cityId}/store/${storeId}/product`, params);
}

export async function updateProduct(cityId, storeId, productId, params) {
  return axios.patch(
    `/v1/cities/${cityId}/store/${storeId}/product/${productId}`,
    params
  );
}

export async function deleteProduct(cityId, storeId, productId) {
  return axios.delete(
    `/v1/cities/${cityId}/store/${storeId}/product/${productId}`
  );
}
export async function deleteProductRequest(cityId, storeId, productRequestId) {
  return axios.delete(
    `/v1/cities/${cityId}/store/${storeId}/productRequest/${productRequestId}`
  );
}

export async function uploadImage(formData, cityId, storeId, productId) {
  return axios.post(
    `/v1/cities/${cityId}/store/${storeId}/imageUpload/${productId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
}

export async function addSubCategory(storeId, subCategoryId) {
  return axios.post(`/v1/owners/subCategory`, {
    storeId,
    subCategoryId,
  });
}

export async function addCategory(storeId, categoryId) {
  return axios.post(`/v1/owners/category`, {
    storeId,
    categoryId,
  });
}

export async function getOwnerSubCategory(categoryId) {
  return axios.get(`/v1/owners/globalCategory/${categoryId}/subCategories`);
}

export async function getOwnerCategory() {
  return axios.get(`/v1/owners/globalCategories`);
}

export async function getSubCategory(cityId, storeId, categoryId) {
  return axios.get(
    `/v1/cities/${cityId}/store/${storeId}/category/${categoryId}/subcategories`
  );
}

export async function getCategory(cityId, storeId) {
  return axios.get(`/v1/cities/${cityId}/store/${storeId}/categories`);
}

export async function deleteSubCategory(storeId, subCategoryId) {
  return axios.delete(`/v1/owners/subCategory`, {
    params: {
      storeId,
      subCategoryId,
    },
  });
}

export async function deleteCategory(storeId, categoryId) {
  return axios.delete(`/v1/owners/subCategory`, {
    storeId,
    categoryId,
  });
}

export async function deleteImage(cityId, storeId, productId) {
  return axios.delete(
    `/v1/cities/${cityId}/store/${storeId}/product/${productId}/imageDelete`
  );
}

export async function getMyOrders(pageNumber) {
  return axios.get(
    `/v1/users/${getUserId()}/orders?pageNumber=${pageNumber}&pageSize=9`
  );
}

export async function getOrderDetails(orderId) {
  return axios.get(`/v1/users/${getUserId()}/order/${orderId}`);
}

export async function getPaymentDetails(cardId, params) {
  return axios.get(
    `/v1/users/${getUserId()}/card/${cardId}/transactions`,
    params
  );
}

export async function getCards() {
  return axios.get(`/v1/users/${getUserId()}/cards`);
}

export async function associateCard(cardId, cardLinkingData) {
  return axios.post(
    `/v1/users/${getUserId()}/card/${cardId}/associate`,
    cardLinkingData
  );
}

// OWNER APIs Start
// export async function getStores() {
//     return axios.get(`/v1/owners/getStores`);
// }

export async function getShelves(cityId, storeId) {
  return axios.get(`/v1/cities/${cityId}/store/${storeId}/shelves`);
}

export async function getStoreById(cityId, storeId) {
  return axios.get(`/v1/cities/${cityId}/store/${storeId}`);
}

export async function updateStoreById(cityId, storeId, params) {
  return axios.patch(`/v1/cities/${cityId}/store/${storeId}`, params);
}

export async function getAllShelves(cityId, storeId, pageNo) {
  return axios.get(
    `/v1/cities/${cityId}/store/${storeId}/shelves?pageNumber=${pageNo}&pageSize=9`
  );
}

export async function createShelf(cityId, storeId, params) {
  return axios.post(`/v1/cities/${cityId}/store/${storeId}/shelves`, params);
}

export async function updateSeller(
  cityId,
  sellerId,
  status,
  title,
  description
) {
  try {
    const response = await axios.patch(
      `/v1/owners/updateSeller/${sellerId}`,
      {
        title,
        description,
        status,
      },
      {
        params: {
          cityId,
          sellerId,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating seller:", error);
    throw error;
  }
}

export async function updateProductRequests(
  storeId,
  requestId,
  shelfIds,
  statusId,
  maxCount
) {
  try {
    const response = await axios.patch(
      `/v1/owners/productRequest/${requestId}`,
      {
        storeId,
        shelfIds,
        statusId,
        maxCount,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product request:", error);
    throw error;
  }
}

export async function getShelfById(cityId, storeId, shelfId) {
  return axios.get(`/v1/cities/${cityId}/store/${storeId}/shelve/${shelfId}`);
}

export async function getSellers(cityId, storeId, pageNo, status) {
  return axios.get(
    `/v1/owners/getSellers?cityId=${cityId}&storeId=${storeId}&pageNo=${pageNo}&status=${status}&pageSize=9`
  );
}

export async function getProductsForShelf(storeId) {
  return axios.get(`/v1/owners/products?storeId=${storeId}`);
}

export async function getProducts(storeId, pageNumber, status) {
  return axios.get(
    `/v1/owners/products?storeId=${storeId}&pageNumber=${pageNumber}&status=${status}&pageSize=9&sort=createdAt&sortDesc=true`
  );
}

export async function getSellerProducts(storeId, pageNumber, status) {
  return axios.get(
    `/v1/seller/products?storeId=${storeId}&pageNumber=${pageNumber}&status=${status}&pageSize=9&sort=createdAt&sortDesc=true`
  );
}

export async function getProductRequests(storeId, pageNumber, status) {
  return axios.get(
    `/v1/owners/productRequests?storeId=${storeId}&pageNumber=${pageNumber}&status=${status}&pageSize=9&sort=createdAt&sortDesc=true`
  );
}

export async function getProductRequestsSeller(
  cityId,
  storeId,
  pageNumber,
  status
) {
  return axios.get(
    `/v1/cities/${cityId}/store/${storeId}/productRequest?pageNumber=${pageNumber}&status=${status}&pageSize=9&sort=createdAt&sortDesc=true`
  );
}

export async function getOrders(cityId, storeId, pageNumber) {
  return axios.get(
    `/v1/cities/${cityId}/store/${storeId}/orders?pageNumber=${pageNumber}&pageSize=9`
  );
}

export async function getProductById(cityId, storeId, productId) {
  return axios.get(
    `/v1/cities/${cityId}/store/${storeId}/product/${productId}`
  );
}

export async function getOrderById(cityId, storeId, orderId) {
  return axios.get(`/v1/cities/${cityId}/store/${storeId}/orders/${orderId}`);
}

export async function deleteSeller(sellerId) {
  return axios.delete(`/v1/owners/deleteSeller/${sellerId}`);
}
