// import axios from "../api/axiosInstance";
import axios from "axios";

export async function getCities() {
	return axios.get(`/cities`);
}
