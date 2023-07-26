import { instance } from "../api/axiosInstance";
const axios = instance

export async function getCities(params) {
	return axios.get(`/cities`, { params });
}

export async function getCitizenServices(params) {
	return axios.get("/citizenServices", { params });
}
