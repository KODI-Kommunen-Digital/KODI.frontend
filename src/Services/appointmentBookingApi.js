import { appointmentInstance } from "../api/axiosInstance";
import { getUserId } from "./usersApi";
const axios = appointmentInstance;

export async function getAppointmentsUserCreated(params) {
    return axios.get(`/v1/users/${getUserId()}/appointments`, params);
}

export async function deleteMyServices(cityId, listingId, serviceId) {
    return axios.delete(`/v1/cities/${cityId}/listings/${listingId}/service/${serviceId}`);
}

export async function getUserBookings(params) {
    return axios.get(`/v1/users/${getUserId()}/bookings`, params);
}

export async function deleteUserBooking(cityId, listingId, appointmentId, bookingId) {
    return axios.delete(`/v1/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}/booking/${bookingId}`);
}

export async function getAppointments(cityId, listingId, appointmentId) {
    return axios.get(`/v1/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}`);
}

export async function createAppointments(cityId, listingId, newDataOb) {
    return axios.post(`/v1/cities/${cityId}/listings/${listingId}/appointments`, newDataOb);
}

export async function updateAppointments(cityId, listingId, appointmentId, newDataOb) {
    return axios.patch(`/v1/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}`, newDataOb);
}

export async function deleteAppointments(cityId, listingId, appointmentId) {
    return axios.delete(`/v1/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}`);
}

export async function getOwnerAppointments(params) {
    return axios.get(`/v1/users/${getUserId()}/owner/bookings`, params);
}

export async function deleteUserAppointments(userId, appointmentId, bookingId) {
    return axios.delete(`/v1/users/${userId}/appointments/${appointmentId}/booking/${bookingId}`);
}

export async function createBookings(cityId, listingId, appointmentId, params) {
    return axios.post(`/v1/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}/book`, params);
}

export async function getAppointmentServices(cityId, listingId, appointmentId) {
    return axios.get(`/v1/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}/services`);
}

export async function getAppointmentSlots(cityId, listingId, appointmentId, date, serviceId) {
    return axios.get(`/v1/cities/${cityId}/listings/${listingId}/appointments/${appointmentId}/slots?date=${date}&serviceId[]=${serviceId}`);
}