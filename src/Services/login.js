import axios from "axios";

function getUserId() {
	return (
		window.localStorage.getItem("userId") ||
		window.sessionStorage.getItem("userId")
	);
}

export async function login(credentials) {
	return axios.post(
		`${process.env.REACT_APP_API_BASE_URL}/users/login`,
		credentials
	);
}

export async function logout(credentials) {
	return axios.post(`users/${getUserId()}/logout`, credentials);
}
