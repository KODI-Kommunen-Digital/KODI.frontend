import axios from "axios";

const instance = axios.create({
	baseURL: process.env.REACT_APP_API_BASE_URL,
});

export async function getCities(params) {
	return instance.get(`/cities`, { params });
}

export async function getCitizenServices(params) {
	return instance.get("/citizenServices", { params });
}
