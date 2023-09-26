import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../../Components/Footer";
import {
	getForum,
	getUserForums,
	getForumPosts,
	deleteForumMembers,
	deleteForums,
	getForumMembers,
	forumMemberRequests,
} from "../../Services/forumsApi";
import POSTSLOGO from "../../assets/POSTSLOGO.jpg";

const Forum = () => {
	window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [forumPosts, setForumPosts] = useState([]);
	const [forums, setForums] = useState({});
	const [isValidForum, setIsValidForum] = useState(false);
	const [cityId, setCityId] = useState(null);
	const [forumId, setForumId] = useState(null);
	const [memberId, setMemberId] = useState(null);
	const [pageNo, setPageNo] = useState(1);
	const pageSize = 12;

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	useEffect(() => {
		if (cityId && forumId) {
			const params = { pageNo, pageSize };
			const urlParams = new URLSearchParams(window.location.search);
			urlParams.set("pageNo", pageNo);
			const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
			window.history.replaceState({}, "", newUrl);
			getForumPosts(cityId, forumId, params).then((response) => {
				setForumPosts(response.data.data);
			});
		}
	}, [pageNo]);

	const [followRequested, setFollowRequested] = useState(false);
	const [memberStatus, setMemberStatus] = useState(false);
	const [isOnlyMember, setIsOnlyMember] = useState(false);
	useEffect(() => {
		async function checkUserMembership() {
			const urlParams = new URLSearchParams(window.location.search);
			const cityIdParam = parseInt(urlParams.get("cityId"));
			const forumIdParam = parseInt(urlParams.get("forumId"));
			const pageNoParam = parseInt(urlParams.get("pageNo")) || 1;
			document.title = "Forums";
			setPageNo(pageNoParam);
			// const storedFollowRequested = localStorage.getItem("followRequested");
			// if (storedFollowRequested) {
			// 	setFollowRequested(true);
			// }
			if (cityIdParam && forumIdParam) {
				getForum(cityIdParam, forumIdParam).then((response) => {
					if (response.data.data) {
						setForums(response.data.data);
						setCityId(cityIdParam);
						setForumId(forumIdParam);
						setIsValidForum(true);
					}
				});
			}
			const cityId = parseInt(urlParams.get("cityId"));
			const forumId = parseInt(urlParams.get("forumId"));
			try {
				const response = await getUserForums();
				const userForums = response.data.data;
				const isMember = userForums.some(
					(userForum) => userForum.forumId === forumId
				);
				setMemberStatus(isMember);
				const forums = userForums.find(
					(userForum) => userForum.forumId === forumId
				);
				if (forums) {
					setMemberId(forums.memberId);
				}
				if (isMember) {
					const membersResponse = await getForumMembers(cityId, forumId);
					const forumMembers = membersResponse.data.data;
					setIsOnlyMember(forumMembers.length === 1 && isMember);
					const response2 = await getForumPosts(cityIdParam, forumIdParam, {
						pageNo: pageNoParam,
						pageSize,
					});
					setForumPosts(response2.data.data);
				}
			} catch (error) {
				console.error("Error fetching user forums:", error);
			}
		}
		checkUserMembership();
	}, [forumId]);

	const handleFollow = async () => {
		try {
			await forumMemberRequests(cityId, forumId);
			setMemberStatus(true);
			localStorage.setItem("memberStatus", "true");
		} catch (error) {
			console.error("Error sending follow request:", error);
		}
	};

	const handleFollowRequest = async () => {
		try {
			await forumMemberRequests(cityId, forumId);
			setFollowRequested(true);
			localStorage.setItem("followRequested", "true");
		} catch (error) {
			console.error("Error sending follow request:", error);
		}
	};

	const handleLeaveGroup = async () => {
		try {
			await deleteForumMembers(cityId, forumId, memberId);
			setMemberStatus(false);
			setFollowRequested(false);
		} catch (error) {
			console.error("Error leaving group:", error);
		}
	};

	function goToAllForums() {
		navigateTo(`/CitizenService`);
	}

	const handleDelete = async () => {
		try {
			await deleteForums(cityId, forumId);
			goToAllForums();
		} catch (error) {
			console.error("Error deleting group:", error);
		}
	};

	const [showConfirmationModal, setShowConfirmationModal] = useState({
		visible: false,
		onConfirm: () => {},
		onCancel: () => {},
	});

	function handleDeleteGroup() {
		setShowConfirmationModal({
			visible: true,
			onConfirm: () => handleDelete(),
			onCancel: () => setShowConfirmationModal({ visible: false }),
		});
	}

	return (
		<section className="text-gray-600 bg-white body-font">
			<HomePageNavBar />
			{isValidForum ? (
				<div>
					<div className="container-fluid py-0 mr-0 ml-0 mt-20 w-full flex flex-col">
						<div className="w-full mr-0 ml-0">
							<div className="h-96 overflow-hidden px-0 py-1">
								<div className="relative h-96">
									<img
										alt="forumImage"
										className="object-cover object-center h-full w-full"
										src={
											forums.image
												? process.env.REACT_APP_BUCKET_HOST + forums.image
												: process.env.REACT_APP_BUCKET_HOST +
												  "admin/Homepage.jpg"
										}
									/>
									<div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
										<h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
											{forums.forumName}
										</h1>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="text-center justify-between lg:px-10 md:px-5 sm:px-0 px-4 md:py-6 py-4 bg-gray-50">
						{forums.isPrivate && !memberStatus ? (
							<a
								onClick={followRequested ? undefined : handleFollowRequest}
								className={`mx-8 mb-2 w-60 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-red-700 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer`}
							>
								{followRequested ? t("requestSent") : t("request")}
							</a>
						) : (
							<div className="flex flex-row md:flex-row items-center justify-center">
								{!memberStatus ? (
									<div>
										<a
											onClick={handleFollow}
											className="hidden lg:block mx-4 md:mx-8 mb-2 md:mb-0 w-20 md:w-60 font-sans items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-red-700 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
										>
											{t("follow")}
										</a>
										<svg
											onClick={handleFollow}
											className="block lg:hidden mx-4 md:mx-8 mb-2 md:mb-0 w-6 h-6 text-red-700 cursor-pointer transition-transform duration-300 transform hover:scale-110"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
											/>
										</svg>
									</div>
								) : isOnlyMember ? (
									<div>
										<a
											onClick={handleDeleteGroup}
											className="hidden lg:block mx-4 md:mx-8 mb-2 md:mb-0 w-20 md:w-60 font-sans items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-red-700 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
										>
											{t("deleteGroup")}
										</a>
										<svg
											onClick={handleDeleteGroup}
											className="block lg:hidden mx-4 md:mx-8 mb-2 md:mb-0 w-6 h-6 text-red-700 cursor-pointer transition-transform duration-300 transform hover:scale-110"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M3 6h18M5 6l1 13h12l1-13M10 10v6M14 10v6"
											/>
										</svg>
										{showConfirmationModal.visible && (
											<div className="fixed z-50 inset-0 overflow-y-auto">
												<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
													<div
														className="fixed inset-0 transition-opacity"
														aria-hidden="true"
													>
														<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
													</div>
													<span
														className="hidden sm:inline-block sm:align-middle sm:h-screen"
														aria-hidden="true"
													>
														&#8203;
													</span>
													<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
														<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
															<div className="sm:flex sm:items-start">
																<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
																	<svg
																		className="h-6 w-6 text-red-700"
																		xmlns="http://www.w3.org/2000/svg"
																		fill="none"
																		viewBox="0 0 24 24"
																		stroke="currentColor"
																		aria-hidden="true"
																	>
																		<path
																			strokeLinecap="round"
																			strokeLinejoin="round"
																			strokeWidth="2"
																			d="M6 18L18 6M6 6l12 12"
																		/>
																	</svg>
																</div>
																<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
																	<h3 className="text-lg leading-6 font-medium text-gray-900">
																		{t("areyousure")}
																	</h3>
																	<div className="mt-2">
																		<p className="text-sm text-gray-500">
																			Do you really want to delete this group?
																			This action cannot be reverted.
																		</p>
																	</div>
																</div>
															</div>
														</div>
														<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
															<button
																onClick={showConfirmationModal.onConfirm}
																type="button"
																className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
															>
																{t("delete")}
															</button>

															<button
																onClick={showConfirmationModal.onCancel}
																type="button"
																className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
															>
																{t("cancel")}
															</button>
														</div>
													</div>
												</div>
											</div>
										)}
									</div>
								) : (
									<div>
										<a
											onClick={handleLeaveGroup}
											className="hidden lg:block mx-4 md:mx-8 mb-2 md:mb-0 w-20 md:w-60 font-sans items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-red-700 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
										>
											{t("leaveGroup")}
										</a>
										<svg
											onClick={handleLeaveGroup}
											className="block lg:hidden mx-4 md:mx-8 mb-2 md:mb-0 w-6 h-6 text-red-700 cursor-pointer transition-transform duration-300 transform hover:scale-110"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M6 18L18 6M6 6l12 12"
											/>
										</svg>
									</div>
								)}

								{memberStatus && (
									<div className="flex flex-row md:flex-row items-center justify-center">
										<a
											onClick={() =>
												navigateTo(
													`/MyGroups/GroupMembers?forumId=${forumId}&cityId=${cityId}`
												)
											}
											className="hidden lg:block mx-4 md:mx-8 mb-2 md:mb-0 w-20 md:w-60 font-sans items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-400 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
										>
											{t("groupMembers")}
										</a>
										<svg
											onClick={() =>
												navigateTo(
													`/MyGroups/GroupMembers?forumId=${forumId}&cityId=${cityId}`
												)
											}
											xmlns="http://www.w3.org/2000/svg"
											height="1em"
											viewBox="0 0 640 512"
											className="block lg:hidden mx-4 md:mx-8 mb-2 md:mb-0 w-6 h-6 text-green-600 cursor-pointer transition-transform duration-300 transform hover:scale-110"
										>
											<path d="M96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3zM609.3 512H471.4c5.4-9.4 8.6-20.3 8.6-32v-8c0-60.7-27.1-115.2-69.8-151.8c2.4-.1 4.7-.2 7.1-.2h61.4C567.8 320 640 392.2 640 481.3c0 17-13.8 30.7-30.7 30.7zM432 256c-31 0-59-12.6-79.3-32.9C372.4 196.5 384 163.6 384 128c0-26.8-6.6-52.1-18.3-74.3C384.3 40.1 407.2 32 432 32c61.9 0 112 50.1 112 112s-50.1 112-112 112z" />
										</svg>

										<a
											onClick={() =>
												navigateTo(
													`/UploadPosts?forumId=${forumId}&cityId=${cityId}`
												)
											}
											className="hidden lg:block mx-4 md:mx-8 mb-2 md:mb-0 w-20 md:w-60 font-sans items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
										>
											{t("createPost")}
										</a>
										<svg
											onClick={() =>
												navigateTo(
													`/UploadPosts?forumId=${forumId}&cityId=${cityId}`
												)
											}
											className="block lg:hidden mx-4 md:mx-8 mb-2 md:mb-0 w-6 h-6 text-blue-800 cursor-pointer"
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<rect x="3" y="3" width="18" height="18" rx="2" ry="2" />{" "}
											<line x1="12" y1="8" x2="12" y2="16" />{" "}
											<line x1="8" y1="12" x2="16" y2="12" />
										</svg>
									</div>
								)}
							</div>
						)}
					</div>

					<div className="max-w-2xl lg:px-10 md:px-5 sm:px-0 px-2 py-6 lg:max-w-7xl">
						<div className="overflow-hidden sm:p-0 mt-[0rem] px-0 py-0">
							<h1
								className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("description")}
							</h1>
							<h1 className="leading-relaxed text-md font-medium my-6 text-gray-900 dark:text-gray-900">
								{forums.description}
							</h1>
						</div>
					</div>

					{forums.isPrivate && !memberStatus ? (
						<div>
							<div className="flex items-center justify-center">
								<h1 className="m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
									This group is private
								</h1>
							</div>
							<div className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
								<span className="font-sans text-black">
									To join the group, click the Follow request button!
								</span>
							</div>
						</div>
					) : (
						<div>
							{memberStatus && forumPosts && forumPosts.length > 0 ? (
								<div className="max-w-full lg:px-10 md:px-5 sm:px-0 px-2 py-6 lg:max-w-full">
									<h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900">
										{t("groupPosts")}
									</h1>
									<div className="bg-white lg:px-0 md:px-0 sm:px-0 px-0 py-6 mt-10 mb-10 space-y-10 flex flex-col">
										<div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-1 gap-10 relative mb-4 justify-center place-items-center">
											{forumPosts &&
												forumPosts.map((forumPost, index) => (
													<div
														key={index}
														onClick={() => {
															navigateTo(
																`/Forum/ViewPost?postId=${forumPost.id}&forumId=${forumId}&cityId=${cityId}`
															);
														}}
														className="w-full h-full shadow-lg rounded-lg cursor-pointer"
													>
														<a className="block relative h-64 rounded overflow-hidden">
															<img
																alt="ecommerce"
																className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000"
																src={
																	forumPost.image
																		? process.env.REACT_APP_BUCKET_HOST +
																		  forumPost.image
																		: POSTSLOGO
																}
															/>
														</a>
														<div className="my-5 px-2">
															<h2
																className="text-gray-900 title-font text-lg font-bold text-center font-sans truncate"
																style={{ fontFamily: "Poppins, sans-serif" }}
															>
																{forumPost.title}
															</h2>
														</div>
													</div>
												))}
										</div>
									</div>
								</div>
							) : (
								<div>
									<div className="flex items-center justify-center">
										<h1 className="m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
											{t("currently_no_posts")}
										</h1>
									</div>
									<div className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
										<span className="font-sans text-black">
											{t("to_upload_new_post")}
										</span>
										<a
											className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-blue-400"
											onClick={() => {
												navigateTo(
													`/UploadPosts?forumId=${forumId}&cityId=${cityId}`
												);
											}}
										>
											{t("click_here")}
										</a>
									</div>
								</div>
							)}
						</div>
					)}

					<div className="mt-20 mb-20 w-fit mx-auto text-center text-white whitespace-nowrap rounded-md border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer">
						{pageNo !== 1 ? (
							<span
								className="text-lg px-3 hover:bg-blue-400 cursor-pointer rounded-lg"
								style={{ fontFamily: "Poppins, sans-serif" }}
								onClick={() => setPageNo(pageNo - 1)}
							>
								{"<"}{" "}
							</span>
						) : (
							<span />
						)}
						<span
							className="text-lg px-3"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("page")} {pageNo}
						</span>
						{forumPosts.length >= pageSize && (
							<span
								className="text-lg px-3 hover:bg-blue-400 cursor-pointer rounded-lg"
								style={{ fontFamily: "Poppins, sans-serif" }}
								onClick={() => setPageNo(pageNo + 1)}
							>
								{">"}
							</span>
						)}
					</div>
				</div>
			) : (
				<h1 className="text-2xl md:text-5xl lg:text-5xl text-center font-bold my-4 font-sans py-72">
					Invalid Forum
				</h1>
			)}

			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default Forum;
