
import axios from "axios";

const instance = axios.create({
    baseURL: 'http://localhost:8002'
  });


export async function getCities() {
	return instance.get(`/cities`);
}
