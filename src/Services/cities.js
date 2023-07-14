import getInstance from "../api/axiosInstance";
const axios = getInstance(process.env.REACT_APP_API_BASE_URL)

export async function getCities(params) {
	return axios.get(`/cities`, { params });
}

export async function getCitizenServices(params) {
	return axios.get("/citizenServices", { params });
}
