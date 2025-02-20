import { instance } from "../api/axiosInstance";
const axios = instance;

export async function getSurveyFAQ() {
  return axios.get(`/listings`);
}

export async function postVoteById(listingsId) {
  return axios.post(`/listings/${listingsId}/vote`);
}
