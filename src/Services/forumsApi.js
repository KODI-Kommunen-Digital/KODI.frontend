import { getUserId } from "./usersApi";
import { forumInstance } from "../api/axiosInstance";
const axios = forumInstance;

export async function getUserForums(params) {
	return axios.get(`/users/${getUserId()}/forums`, { params });
}

export async function getUserForumRequests(params) {
	return axios.get(`/users/${getUserId()}/memberRequests`, { params });
}

export async function getUserForumsMembershipForAllForums(cityId, params) {
	return axios.get(`/users/${getUserId()}/cities/${cityId}/checkMembership`, { params });
}

export async function getUserForumsMembership(cityId, forumsId) {
	return axios.get(`/users/${getUserId()}/cities/${cityId}/forums/${forumsId}/checkMembership`);
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

export async function deleteForumMembers(cityId, forumsId, memberId) {
	return axios.delete(
		`/cities/${cityId}/forums/${forumsId}/members/${memberId}`
	);
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

export async function uploadForumImage(formData, cityId, forumsId) {
	return axios.post(
		`/cities/${cityId}/forums/${forumsId}/imageUpload`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	);
}

export async function deleteForumImage(cityId, forumsId) {
	return axios.delete(`/cities/${cityId}/forums/${forumsId}/imageDelete`);
}

export async function getAllForums(cityId, params) {
	return axios.get(`/cities/${cityId}/forums`, { params });
}

export async function forumPosts(cityId, forumsId, postData) {
	return axios.post(`/cities/${cityId}/forums/${forumsId}/posts`, postData);
}

export async function getPostDetails(cityId, forumsId, postId) {
	return axios.get(`/cities/${cityId}/forums/${forumsId}/posts/${postId}`);
}

export async function deletePostDetails(cityId, forumsId, postId) {
	return axios.delete(`/cities/${cityId}/forums/${forumsId}/posts/${postId}`);
}

export async function updateForumPosts(cityId, postData, forumsId, postId) {
	return axios.patch(
		`/cities/${cityId}/forums/${forumsId}/posts/${postId}`,
		postData
	);
}

export async function uploadPostImage(cityId, forumsId, postId, form) {
	return axios.post(
		`/cities/${cityId}/forums/${forumsId}/posts/${postId}/imageUpload`,
		form,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	);
}

export async function deletePostImage(cityId, forumsId, postId) {
	return axios.delete(
		`/cities/${cityId}/forums/${forumsId}/posts/${postId}/imageDelete`
	);
}

export async function createMemberRequest(
	cityId,
	forumsId
) {
	return axios.post(
		`/cities/${cityId}/forums/${forumsId}/memberRequests`
	);
}

export async function cancelMemberRequest(
	cityId,
	forumsId,
	memberRequestsId
) {
	return axios.delete(
		`/cities/${cityId}/forums/${forumsId}/memberRequests/${memberRequestsId}`
	);
}

export async function acceptForumMemberRequests(
	cityId,
	forumsId,
	memberRequestsId,
	payload
) {
	return axios.patch(
		`/cities/${cityId}/forums/${forumsId}/memberRequests/${memberRequestsId}`,
		payload
	);
}

export async function getForumMemberRequestStatus(
	cityId,
	forumsId,
	memberId,
	data
) {
	return axios.patch(
		`/cities/${cityId}/forums/${forumsId}/memberRequests/${memberId}`,
		data
	);
}

export async function uploadForumPostImage(formData, cityId, forumsId, postId) {
	return axios.post(
		`/cities/${cityId}/forums/${forumsId}/posts/${postId}/imageUpload`,
		formData,
		{
			headers: {
				"Content-Type": "multipart/form-data",
			},
		}
	);
}

export async function deleteForumPostImage(cityId, forumsId, postId) {
	return axios.delete(
		`/cities/${cityId}/forums/${forumsId}/posts/${postId}/imageDelete`
	);
}

export async function getForumMemberRequests(cityId, forumsId, params) {
	return axios.get(`/cities/${cityId}/forums/${forumsId}/memberRequests`, { params });
}

export async function cancelForumMemberRequest(cityId, forumsId, requestId) {
	return axios.delete(`/cities/${cityId}/forums/${forumsId}/memberRequests/${requestId}`);
}

export async function createComment(cityId, forumsId, postId, commentData) {
	return axios.post(
		`/cities/${cityId}/forums/${forumsId}/posts/${postId}/comments`,
		commentData
	);
}

export async function getComments(cityId, forumsId, postId, params) {
	return axios.get(
		`/cities/${cityId}/forums/${forumsId}/posts/${postId}/comments`,
		{ params }
	);
}

export async function createReportedPosts(cityId, forumsId, postId, data) {
	return axios.post(
		`/cities/${cityId}/forums/${forumsId}/posts/${postId}/reports`,
		data
	);
}

export async function getReportedPosts(cityId, forumsId, params) {
	return axios.get(`/cities/${cityId}/forums/${forumsId}/reports`, { params });
}

export async function reportedComments(cityId, forumsId, postId) {
	return axios.get(
		`/cities/${cityId}/forums/${forumsId}/posts/${postId}/reports`
	);
}

export async function updatePost(cityId, forumsId, postId, patchData) {
	return axios.patch(
		`/cities/${cityId}/forums/${forumsId}/posts/${postId}`,
		patchData
	);
}

export async function adminStatusChange(
	cityId,
	forumsId,
	memberId,
	newAdminValue
) {
	return axios.patch(
		`/cities/${cityId}/forums/${forumsId}/members/${memberId}`,
		{ isAdmin: newAdminValue }
	);
}
