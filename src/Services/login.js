import axios from "../api/axiosInstance";

function getUserId() {
	return window.localStorage.getItem("userId");
}

export async function login(credentials) {
	return axios.post(`/users/login`, credentials);
}

export async function logout(credentials) {
	return axios.post(`/${getUserId()}/logout`, credentials);
}
