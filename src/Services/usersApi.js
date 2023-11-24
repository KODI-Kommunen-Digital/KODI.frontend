import { instance } from "../api/axiosInstance";
import UAParser from "ua-parser-js";
import { getCookie } from '../cookies/cookieServices';

const axiosInstance = instance;
const parser = new UAParser();
const userAgent = parser.getResult();
const accessToken = window.localStorage.getItem("accessToken") || getCookie("accessToken");
const refreshToken = window.localStorage.getItem("refreshToken") || getCookie("refreshToken");

if (userAgent.device.vendor === undefined) {
	userAgent.device.vendor = "";
}
if (userAgent.device.model === undefined) {
	userAgent.device.model = "";
}

const browserName = userAgent.browser.name;
const deviceType =
	userAgent.os.name +
	" " +
	userAgent.device.vendor +
	" " +
	userAgent.device.model;
const headers = { browserName, deviceType };

export function getUserId() {
	const userId = window.localStorage.getItem("userId") || getCookie("userId");
	return userId;
}

export async function getProfile(userId, params = {}) {
	if (!userId) {
		userId = getUserId();
	}
	return axiosInstance.get(`/users/${userId}`, { params });
}

export async function fetchUsers(params = {}) {
	return axiosInstance.get("/users", { params });
}

export async function updateProfile(newProfileObj) {
	return axiosInstance.patch(`/users/${getUserId()}`, newProfileObj);
}

export async function getUserListings(params = {}, userId) {
	if (!userId) userId = getUserId();
	return axiosInstance.get(`/users/${userId}/listings`, { params });
}

export async function deleteAccount() {
	return axiosInstance.delete(`/users/${getUserId()}`);
}

export async function resetPass(credentials) {
	return axiosInstance.post(`/users/forgotPassword`, credentials);
}

export async function updatePassword(credentials) {
	return axiosInstance.post(`/users/resetPassword`, credentials);
}

export async function register(credentials) {
	return axiosInstance.post(`/users/register`, credentials);
}

export async function verifyEmail(credentials) {
	return axiosInstance.post(`/users/VerifyEmail`, credentials);
}

export async function sendVerificationEmail(credentials) {
	return axiosInstance.post(`/users/sendVerificationEmail`, credentials);
}

export async function login(credentials) {
	return axiosInstance.post(`/users/login`, credentials, { headers });
}

export async function logout() {
	return axiosInstance.post(`users/${getUserId()}/logout`, { accessToken, refreshToken });
}

export async function uploadProfilePic(formData) {
	return axiosInstance.post(`/users/${getUserId()}/imageUpload`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}

export async function deleteProfilePic() {
	return axiosInstance.delete(`/users/${getUserId()}/imageDelete`);
}

export async function fetchDeviceList(params) {
	return axiosInstance.post(`/users/${getUserId()}/loginDevices`, {
		refreshToken: params,
	});
}

export async function logoutOfAllDevices() {
	return axiosInstance.delete(`/users/${getUserId()}/loginDevices`);
}

export async function logoutOfOneDevice(id) {
	return axiosInstance.delete(`/users/${getUserId()}/loginDevices?id=${id}`);
}
