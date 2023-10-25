import { instance } from "../api/axiosInstance";

export async function getCities(params) {
	return instance.get(`/cities`, { params });
}

export async function getCitizenServices(params) {
	return instance.get("/citizenServices", { params });
}

export async function getDigitalManagement(params) {
	return instance.get("/citizenServices/digitalManagement", { params });
}
