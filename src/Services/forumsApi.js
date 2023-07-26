import { getUserId } from "./usersApi";
import { forumInstance } from "../api/axiosInstance";
const axios = forumInstance;

export async function getUserForums() {
	return axios.get(`/users/${getUserId()}/forums`);
}

export async function getForumPost(cityId, forumsId, postId) {
	return axios.get(`/cities/${cityId}/forums/${forumsId}/posts/${postId}`);
}

export async function getForumPosts(cityId, forumsId, params) {
	return axios.get(`/cities/${cityId}/forums/${forumsId}/posts`, { params });
}

export async function getForum(cityId, forumsId) {
	return axios.get(`/cities/${cityId}/forums/${forumsId}`);
}

export async function getForumMembers(cityId, forumsId) {
	return axios.get(`/cities/${cityId}/forums/${forumsId}/members`);
}

export async function uploadImage(formData) {
	return axios.post(`/users/${getUserId()}/imageUpload`, formData, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
}

export async function updateForumsData(cityId, newForumDataObj, forumsId) {
	return axios.patch(`/cities/${cityId}/forums/${forumsId}`, newForumDataObj);
}

export async function postForumsData(cityId, newForumDataObj) {
	return axios.post(`/cities/${cityId}/forums`, newForumDataObj);
}

export async function deleteForums(cityId, forumsId) {
	return axios.delete(`/cities/${cityId}/forums/${forumsId}`);
}

export async function imageUpload(cityId, forumsId) {
	return axios.post(`/cities/${cityId}/forums/${forumsId}/imageUpload`);
}

export async function imageUpdate(cityId, forumsId) {
	return axios.patch(`/cities/${cityId}/forums/${forumsId}/imageUpload`);
}

export async function getAllForums(cityId) {
	return axios.get(`/cities/${cityId}/forums`);
}

export async function forumPosts(cityId, forumsId, postData) {
	return axios.post(`/cities/${cityId}/forums/${forumsId}`, postData);
}

export async function forumMemberRequests(cityId, forumsId) {
	return axios.post(`/cities/${cityId}/forums/${forumsId}/memberRequests`);
}

export async function createComment(cityId, forumsId, postId, commentData) {
	return axios.post(`/cities/${cityId}/forums/${forumsId}/posts/${postId}/comments`, commentData);
}

export async function getComments(cityId, forumsId, postId, params) {
	return axios.get(`/cities/${cityId}/forums/${forumsId}/posts/${postId}/comments`, { params });
}
