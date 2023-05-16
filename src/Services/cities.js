
import axios from "axios";

const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL
  });

export async function getCities() {
	return instance.get(`/cities`);
}

export async function getCitizenServices(params){
  return instance.get('/citizenServices', { params });
}
