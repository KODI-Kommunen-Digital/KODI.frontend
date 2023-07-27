import axios from "axios";

// Function to create a new axios instance with a specified baseURL
const createInstance = (baseURL) => {
	const instance = axios.create({
		baseURL,
	});

	// Function to handle user logout by clearing tokens and redirecting to login page
	const handleLogout = () => {
		try {
			// Remove access and refresh tokens from local storage
			window.localStorage.removeItem("accessToken");
			window.localStorage.removeItem("refreshToken");
			// Remove user ID and selected item from local storage
			window.localStorage.removeItem("userId");
			window.localStorage.removeItem("selectedItem");
			// Remove access and refresh tokens from session storage
			window.sessionStorage.removeItem("accessToken");
			window.sessionStorage.removeItem("refreshToken");
			// Remove user ID and selected item from session storage
			window.sessionStorage.removeItem("userId");
			window.sessionStorage.removeItem("selectedItem");
			// Redirect to the login page with a query parameter to indicate session expiration
			window.location.href = "/login?sessionExpired=true";
		} catch (error) {
			// If an error occurs during logout, return the error
			return error;
		}
	};

	// Request interceptor: Add authorization header with access token to each outgoing request
	instance.interceptors.request.use(
		async (config) => {
			// Retrieve access token from local storage or session storage
			const token =
				window.localStorage.getItem("accessToken") ||
				window.sessionStorage.getItem("accessToken");
			if (token) {
				// If token exists, add it to the request headers as a Bearer token
				config.headers.authorization = "Bearer " + token;
			}
			return config;
		},
		(error) => {
			// If an error occurs during request interception, reject the request with the error
			return Promise.reject(error);
		}
	);

	// Response interceptor: Handle token refresh on receiving a 401 Unauthorized response
	instance.interceptors.response.use(
		(response) => {
			// If the response is successful, return the response
			return response;
		},
		async (error) => {
			const originalRequest = error.config;
			if (error.response.status === 401) {
				// If the response status is 401 (Unauthorized), attempt to refresh the access token
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
							// Create a new axios instance for the token refresh request
							const refreshInstance = axios.create({ baseURL });
							// Send a request to the server to refresh the access token using the refresh token
							const response = await refreshInstance.post(
								`users/${userId}/refresh`,
								{
									refreshToken,
								}
							);
							if (window.localStorage.getItem("refreshToken")) {
								// If using local storage for refresh token, update access and refresh tokens in local storage
								window.localStorage.setItem(
									"accessToken",
									response.data.data.accessToken
								);
								window.localStorage.setItem(
									"refreshToken",
									response.data.data.refreshToken
								);
							} else if (window.sessionStorage.getItem("refreshToken")) {
								// If using session storage for refresh token, update access and refresh tokens in session storage
								window.sessionStorage.setItem(
									"accessToken",
									response.data.data.accessToken
								);
								window.sessionStorage.setItem(
									"refreshToken",
									response.data.data.refreshToken
								);
							}
							// Retry the original request with the updated access token
							return instance(originalRequest);
						} else {
							// If refresh token or user ID is missing, handle logout and reject the original request
							handleLogout();
							return Promise.reject(error);
						}
					} catch (refreshError) {
						// If an error occurs during token refresh, handle logout and reject the original request
						handleLogout();
						return Promise.reject(refreshError);
					}
				} else {
					// If the original request has already been retried, handle logout and reject the request
					handleLogout();
					return Promise.reject(error);
				}
			}
			return Promise.reject(error);
		}
	);

	// Return the created axios instance
	return instance;
};

// Create instances for different API endpoints using the createInstance function and export them
const instance = createInstance(process.env.REACT_APP_API_BASE_URL);
const forumInstance = createInstance(process.env.REACT_APP_API_FORUM_URL);

export { instance, forumInstance };
