import { instance } from "../api/axiosInstance";
const axios = instance;

export async function getUserBookings(userId) {
    return axios.get(`/users/${userId}/bookings`);
}

export async function deleteUserBooking(cityId, listingId, appointmentId, bookingId) {
    return axios.delete(`/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}/booking/${bookingId}`);
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

export async function getOwnerAppointments(userId) {
    return axios.get(`/users/${userId}/owner/bookings`);
}

export async function deleteUserAppointments(userId, appointmentId, bookingId) {
    return axios.delete(`/user/${userId}/appointments/${appointmentId}/booking/${bookingId}`);
}

export async function createBookings(cityId, listingId, appointmentId) {
    return axios.get(`/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}/book`);
}

export async function getAppointmentServices(cityId, listingId, appointmentId) {
    return axios.get(`/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}/services`);
}

export async function getAppointmentSlots(cityId, listingId, appointmentId, date, serviceId) {
    return axios.get(`/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}/slots?date=${date}&serviceId[]=${serviceId}`);
}