import { carParkApiInterfaceInstance } from "../api/axiosInstance";
const axios = carParkApiInterfaceInstance;

export async function getCarParksList() {
    return axios.get(`/getcarparkslist`);
}

export async function getCarParkDetail(id) {
    return axios.get(`/getcarparklist/${id}`);
}