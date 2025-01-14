import { instance } from "../api/axiosInstance";
const isV2Backend = process.env.REACT_APP_V2_BACKEND === "True";

export async function getAds(cityId) {
  return instance.get(isV2Backend ? `/ads` : `/ads?cityId=${cityId}`);
}
