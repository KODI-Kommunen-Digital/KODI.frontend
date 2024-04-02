import { instance } from "../api/axiosInstance";
const axios = instance;

export async function getUserBookings(userId) {
    return axios.get(`/users/${userId}/bookings`);
}

export async function createAppointments(cityId, listingId) {
    return axios.post(`/cities/${cityId}/listings/${listingId}/appointments`);
}

export async function updateAppointments(cityId, listingId, appointmentId) {
    return axios.patch(`/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}`);
}

export async function deleteUserBooking(cityId, listingId, appointmentId, bookingId) {
    return axios.delete(`/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}/booking/${bookingId}`);
}

export async function getOwnerAppointments(userId) {
    return axios.get(`/users/${userId}/owner/bookings`);
}

export async function deleteUserAppointments(userId, appointmentId, bookingId) {
    return axios.delete(`/user/${userId}/appointments/${appointmentId}/booking/${bookingId}`);
}