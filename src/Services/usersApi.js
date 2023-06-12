import axios from "../api/axiosInstance";

export function getUserId() {
    return (
        window.localStorage.getItem("userId") ||
		window.sessionStorage.getItem("userId")
    );
}

export async function getProfileByIds(ids) {
    return axios.get(`/users?id=${ids}`);
}

export async function getProfile(userId, params = {}) {
    if (!userId)
        userId = getUserId()
    return axios.get(`/users/${userId}`, { params });
}

export async function updateProfile(newProfileObj) {
    return axios.patch(`/users/${getUserId()}`, newProfileObj);
}

export async function getUserListings(params = {}, userId) {
    if (!userId)
        userId = getUserId()
    return axios.get(`/users/${userId}/listings`, { params });
}

export async function deleteAccount() {
    return axios.delete(`/users/${getUserId()}`);
}

export async function resetPass(credentials) {
    return axios.post(`/users/forgotPassword`, credentials);
}

export async function updatePassword(credentials) {
    return axios.post(`/users/resetPassword`, credentials);
}

export async function register(credentials) {
    return axios.post(`/users/register`, credentials);
}

export async function verifyEmail(credentials) {
    return axios.post(`/users/VerifyEmail`, credentials);
}

export async function login(credentials) {
    return axios.post(`/users/login`, credentials);
}

export async function logout(credentials) {
    return axios.post(`users/${getUserId()}/logout`, credentials);
}