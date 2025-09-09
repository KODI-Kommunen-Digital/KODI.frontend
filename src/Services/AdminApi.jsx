import { instance } from "../api/axiosInstance";

// export async function getAdmins(cityId,params) {
// 	return instance.get(`/cities/${cityId}/admins`, { params });
// }
export async function getAdmins(cityId, searchQuery, pageNo, pageSize) {
    return instance.get(`/cities/${cityId}/admins`, {
        params: {
            searchQuery,
            pageNo,
            pageSize,
        },
    });
}

export async function postAdminData(cityId, newCitysDataObj) {
    return instance.post(`/cities/${cityId}/admins`, newCitysDataObj);
}

export async function deleteAdmin(cityId, userId) {
    return instance.delete(`/cities/${cityId}/admins`, {
        data: { userId }  // Axios sends this in the request body for DELETE
    });
}

