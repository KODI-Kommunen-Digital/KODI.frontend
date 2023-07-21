import { getUserId } from "./usersApi";
import getInstance from "../api/axiosInstance";
const axios = getInstance(process.env.REACT_APP_API_BASE_URL)

export async function getFavorites() {
    return axios.get(`/users/${getUserId()}/favorites`);
}
export async function getFavoriteListings() {
    return axios.get(`/users/${getUserId()}/favorites/listings`);
}
export async function deleteListingsById(favoriteId) {
    // eslint-disable-next-line no-undef
    return axios.delete(`/users/${getUserId()}/favorites/${favoriteId}`);
}

export async function postFavoriteListingsData( favoriteListing) {
    return axios.post(`/users/${getUserId()}/favorites`, favoriteListing);
}