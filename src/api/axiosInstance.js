import axios from "axios";

const instance = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL,
});

instance.interceptors.request.use(
	async (config) => {
		const token =
			window.localStorage.getItem("accessToken") ||
			window.sessionStorage.getItem("accessToken");
		if (token) {
			config.headers.authorization = "Bearer " + token;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

instance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;
		if (error.response.status === 401) {
			if (!originalRequest._retry) {
				originalRequest._retry = true;
				try {
					const refreshToken =
						window.localStorage.getItem("refreshToken") ||
						window.sessionStorage.getItem("refreshToken");
					const userId =
						window.localStorage.getItem("userId") ||
						window.sessionStorage.getItem("userId");
					if (refreshToken && userId) {
						const response = await instance.post(`users/${userId}/refresh`, {
							refreshToken,
						});

						if (window.localStorage.getItem("refreshToken")) {
							window.localStorage.setItem(
								"accessToken",
								response.data.data.accessToken
							);
							window.localStorage.setItem(
								"refreshToken",
								response.data.data.refreshToken
							);
						} else if (window.sessionStorage.getItem("refreshToken")) {
							window.sessionStorage.setItem(
								"accessToken",
								response.data.data.accessToken
							);
							window.sessionStorage.setItem(
								"refreshToken",
								response.data.data.refreshToken
							);
						}
						return instance(originalRequest);
					}
				} catch (refreshError) {
					// If refreshing the token fails, redirect to login
					window.location.href = "/login";
					return Promise.reject(refreshError);
				}
			} else {
				window.location.href = "/login";
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	}
);

export default instance;