import { instance } from "../api/axiosInstance";

export async function getCities(params) {
  return instance.get(`/cities`, { params });
}

export async function getCitizenServices(params) {
  return instance.get("/citizenServices", { params });
}

export async function getcitizenServiceData(params) {
  return instance.get("/citizenServices/citizenServiceData", { params });
}
export async function postCityData(newCitysDataObj) {
  return instance.post(`/cities`, newCitysDataObj);
}

export async function updateCityData(cityId, newCitysDataObj) {
  return instance.patch(`/cities/${cityId}`, newCitysDataObj);
}
export async function deleteCityImage(cityId) {
  return instance.delete(`cities/${cityId}/image`);
}
export async function uploadCityImage(formData, cityId) {
  return instance.post(`/cities/${cityId}/image`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export async function uploadImageLogo(formData, cityId, theme) {
  return instance.post(`/cities/${cityId}/logo/${theme}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
export async function getCityById(cityId) {
  return instance.get(`/cities/${cityId}`);
}

export async function getCitiesByUserId(params) {
  const userId =
    window.localStorage.getItem("userId") ||
    window.sessionStorage.getItem("userId");
  return instance.get(`cities/${userId}/cityAdmin`, { params });
}
export async function deleteCity(cityId) {
  return instance.delete(`cities/${cityId}`);
}
export async function getCityByCityAdmins(userId) {
  return instance.get(`/cities/${userId}/cityAdmin`);

}

export async function createCityUsersPermissions(newCitysDataObj) {
  return instance.post('/moderators', newCitysDataObj);

}
export async function getCityUsersPermissions(searchQuery, pageNo, pageSize) {
  return instance.get("/moderators/my", {
    params: {
      searchQuery,
      pageNo,
      pageSize,
    },
  });
}

export async function updateCityUserPermissions(newCitysDataObj) {
  return instance.put("/moderators", newCitysDataObj);
}
export async function deleteCityUsers(userId) {
  return instance.delete(`/moderators`, {
    data: { userId }
  });
}

export async function getModeratorProfile(userId) {
  return instance.get(`/moderators/${userId}/profile`)

}
