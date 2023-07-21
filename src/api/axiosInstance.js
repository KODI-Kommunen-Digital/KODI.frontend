import axios from "axios";

const handleLogout = () => {
	try {
		window.localStorage.removeItem("accessToken");
		window.localStorage.removeItem("refreshToken");
		window.localStorage.removeItem("userId");
		window.localStorage.removeItem("selectedItem");
		window.sessionStorage.removeItem("accessToken");
		window.sessionStorage.removeItem("refreshToken");
		window.sessionStorage.removeItem("userId");
		window.sessionStorage.removeItem("selectedItem");
		window.location.href = "/login?sessionExpired=true";
	} catch (error) {
		return error;
	}
};

function getInstance(baseURL) {
    const instance = axios.create({
        baseURL
    });

    const refreshInstance = axios.create({
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
                            const response = await refreshInstance.post(
                                `users/${userId}/refresh`,
                                {
                                    refreshToken,
                                }
                            );
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
                        } else {
                            handleLogout();
                            return Promise.reject(error);
                        }
                    } catch (refreshError) {
                        handleLogout();
                        return Promise.reject(refreshError);
                    }
                } else {
                    handleLogout();
                    return Promise.reject(error);
                }
            }
            return Promise.reject(error);
        }
    );
    return instance;
};
export default getInstance;
