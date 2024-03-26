import { instance } from "../api/axiosInstance";
const axios = instance;

export async function getUserAppoinments(userId) {
    return axios.get(`/users/${userId}/appointments`);
}

export async function createAppointments(cityId, listingId) {
    return axios.post(`/cities/${cityId}/listings/${listingId}/appointments`);
}

export async function updateAppointments(cityId, listingId, appointmentId) {
    return axios.patch(`/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}`);
}

export async function deleteAppointments(cityId, listingId, appointmentId) {
    return axios.delete(`/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}`);
}