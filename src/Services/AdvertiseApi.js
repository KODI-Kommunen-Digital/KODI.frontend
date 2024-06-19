import { instance } from "../api/axiosInstance";

export async function getAds(cityId) {
  return instance.get(`/ads?cityId=${cityId}`);
}
