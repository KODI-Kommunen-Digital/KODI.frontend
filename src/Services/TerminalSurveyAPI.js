import { instance } from "../api/axiosInstance";
const axios = instance;

export async function getSurveyFAQ(listingsId) {
  return axios.get(`/listings/${listingsId}`);
}

export async function postVoteById(listingsId,body) {
  return axios.post(`/listings/${listingsId}/vote`,body);
}
