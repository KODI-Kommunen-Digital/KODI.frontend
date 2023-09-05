import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useTranslation } from "react-i18next";
import Footer from "../../Components/Footer";
import UserProfile from "../../Components/UserProfile";
import POSTSLOGO from "../../assets/POSTSLOGO.jpg";
import PropTypes from "prop-types";
import {
	getForumPost,
	createComment,
	getComments,
	createReportedPosts,
} from "../../Services/forumsApi";
import { getProfile } from "../../Services/usersApi";
import PROFILEIMAGE from "../../assets/ProfilePicture.png";

const Description = ({ content }) => {
	return (
		<p
			className="leading-relaxed text-md font-medium my-6 text-gray-900 dark:text-gray-900"
			dangerouslySetInnerHTML={{ __html: content }}
		></p>
	);
};

Description.propTypes = {
	content: PropTypes.string,
};

const ViewPost = () => {
	// window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [postOwner, setPostOwner] = useState({});
	const [currentUser, setCurrentUser] = useState({});
	const [forumPost, setForumPost] = useState({});
	const [cityId, setCityId] = useState(null);
	const [forumId, setForumId] = useState(null);
	const [postId, setPostId] = useState(null);
	const [createdAt, setCreatedAt] = useState("");
	const [showComments, setShowComments] = useState(false);
	const [showMoreComments, setShowMoreComments] = useState(true);
	const [newComment, setNewComment] = useState("");
	const [comments, setComments] = useState([]);
	const [pageNo, setPageNo] = useState(1);
	const [isPopupOpen, setIsPopupOpen] = useState(false);
	const [firstCommentsLoaded, setFirstCommentsLoaded] = useState(false);
	const [text, setText] = useState("");
	const pageSize = 5;

	const toggleComments = () => {
		if (!showComments && !firstCommentsLoaded) {
			fetchComments();
			setFirstCommentsLoaded(true);
		}
		setShowComments(!showComments);
	};

	const toggleReply = (parentId) => {
		const comment = comments.find((c) => c.id === parentId);
		comment.showReplyBox = !comment.showReplyBox;
		setComments([...comments]);
	};

	const setReply = (parentId, newReply) => {
		const comment = comments.find((c) => c.id === parentId);
		comment.newReply = newReply;
		setComments([...comments]);
	};

	const postComment = (parentId = null) => {
		if (parentId) {
			const comment = comments.find((c) => c.id === parentId);
			if (comment.newReply) {
				const commentData = { comment: comment.newReply, parentId };
				createComment(cityId, forumId, postId, commentData).then((response) => {
					const commentResonse = response.data.data;
					commentResonse.firstname = currentUser.firstname;
					commentResonse.lastname = currentUser.lastname;
					commentResonse.username = currentUser.username;
					comment.childrenCount += 1;
					comment.showReplies = true;
					if (comment.replies) {
						comment.replies.unshift(commentResonse);
					} else {
						comment.replies = [commentResonse];
					}
					setComments([...comments]);
					comment.newReply = "";
				});
			}
			setComments([...comments]);
		} else {
			if (newComment) {
				const commentData = { comment: newComment };
				createComment(cityId, forumId, postId, commentData).then((response) => {
					const commentResonse = response.data.data;
					commentResonse.firstname = currentUser.firstname;
					commentResonse.lastname = currentUser.lastname;
					commentResonse.username = currentUser.username;
					commentResonse.childrenCount = 0;
					comments.unshift(commentResonse);
					setComments([...comments]);
					setNewComment("");
				});
			}
		}
	};

	const fetchComments = (parentId = null) => {
		const params = { pageNo, pageSize };
		let comment = {};
		if (parentId) {
			params.parentId = parentId;
			comment = comments.find((c) => c.id === parentId);
			if (comment.replies && comment.replies.length === comment.childrenCount) {
				return;
			}
			if (comment.pageNo) comment.pageNo += 1;
			else comment.pageNo = 1;
			params.pageNo = comment.pageNo;
		}
		getComments(cityId, forumId, postId, params).then((response) => {
			if (parentId) {
				comment.replies = comment.replies
					? [...comment.replies.concat(response.data.data)]
					: [...response.data.data];
				setComments([...comments]);
			} else {
				if (response.data.data.length > 0) {
					setShowMoreComments(true);
					setComments([...comments.concat(response.data.data)]);
				} else {
					setShowMoreComments(false);
				}
			}
		});
	};

	useEffect(() => {
		document.title = "HEIDI - View Post";
		const searchParams = new URLSearchParams(window.location.search);
		const cityId = searchParams.get("cityId");
		setCityId(cityId);
		const forumId = searchParams.get("forumId");
		setForumId(forumId);
		const postId = searchParams.get("postId");
		setPostId(postId);
		const userId =
			window.localStorage.getItem("userId") ||
			window.sessionStorage.getItem("userId");
		if (forumId && cityId && postId) {
			getForumPost(cityId, forumId, postId)
				.then((forumsResponse) => {
					const forumPost = forumsResponse.data.data;
					console.log(forumsResponse.data.data);
					getProfile(forumPost.userId, { cityId, cityUser: true }).then((userResponse) => {
						const user = userResponse.data.data;
						setPostOwner(user);
					});
					getProfile(userId).then((userResponse) => {
						const user = userResponse.data.data;
						setCurrentUser(user);
					});
					setForumPost(forumPost);
					if (forumPost.createdAt) {
						setCreatedAt(
							new Intl.DateTimeFormat("de-DE").format(
								Date.parse(forumPost.createdAt)
							)
						);
					}
				})
				.catch((error) => {
					console.error("Error fetching user forums post:", error);
				});
		}
	}, []);

	const handleReportPost = () => {
		const data = {
			Reason: text,
			accept: false,
		};
		sendForumMemberReportStatus(data);
	};

	const sendForumMemberReportStatus = async (data) => {
		try {
			await createReportedPosts(cityId, forumId, postId, data);
			setIsPopupOpen(false);
			setText("");
		} catch (error) {
			console.error(t("Error in reporting post", error));
		}
	};

	const handleTextChange = (event) => {
		setText(event.target.value);
	};

	const openPopup = () => {
		setIsPopupOpen(true);
	};

	const closePopup = () => {
		setIsPopupOpen(false);
		setText("");
	};

	useEffect(() => {
		if (pageNo !== 1) {
			fetchComments();
		}
	}, [pageNo]);

	return (
		<section className="text-gray-600 bg-white body-font">
			<HomePageNavBar />

			<div className="mx-auto w-full grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:grid-cols-3 lg:pt-24 lg:pb-4">
				<div className="grid grid-cols-1 gap-4 col-span-2">
					<div className="overflow-hidden mb-10">
						<div className="flex flex-col sm:flex-row sm:items-center text-start justify-between">
							<h1 className="text-gray-900 mb-4 text-2xl md:text-3xl mt-4 lg:text-3xl title-font text-start font-bold overflow-hidden">
								<span
									className="inline-block max-w-full break-words"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									{forumPost.title}
								</span>
							</h1>
							<div className="flex my-4 items-center text-2xl md:text-3xl lg:text-3xl text-blue-400">
								<button
									type="button"
									className="rounded-md bg-white border border-gray-900 text-gray-900 py-2 px-4 text-sm cursor-pointer"
									onClick={openPopup}
								>
									<span
										className="ml-1"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										Report
									</span>
								</button>
								{isPopupOpen && (
									<div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
										<div className="bg-white p-6 rounded-lg shadow relative w-full max-w-md max-h-full">
											<h2 className="text-xl flex justify-center items-center font-medium leading-normal text-neutral-800 dark:text-neutral-200">
												{t("reason")}
											</h2>
											<textarea
												className="w-full p-2 border rounded-lg resize-none text-sm text-gray-600"
												rows="4"
												value={text}
												onChange={handleTextChange}
											/>
											<div className="flex justify-center mt-4">
												<button
													className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
													onClick={closePopup}
												>
													Cancel
												</button>
												<button
													className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
													onClick={handleReportPost}
												>
													Send
												</button>
											</div>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="container-fluid lg:w-full md:w-full mb-10">
						<div className=" mr-0 ml-0 mt-0">
							<style>
								{`
									@media (max-width: 280px) {
										.galaxy-fold {
											margin-top: 1rem; /* Adjust the margin value as needed */
										}
									}
								`}
							</style>
							<div className="h-full overflow-hidden px-0 py-0 shadow-xl galaxy-fold">
								<div className="relative h-full">
									<img
										alt="listing"
										className="object-cover object-center h-full w-full"
										src={
											forumPost.image
												? process.env.REACT_APP_BUCKET_HOST + forumPost.image
												: POSTSLOGO
										}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="overflow-hidden mb-10">
						<Description content={forumPost.description} />
					</div>
					<form className="mb-6">
						<div className="py-2 px-4 mb-4 bg-white rounded-xl rounded-t-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
							<textarea
								id="comment"
								rows="2"
								className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
								placeholder={t("writeComment")}
								value={newComment}
								onChange={(event) => setNewComment(event.target.value)}
							></textarea>
						</div>
						<div className="space-x-2">
							<div
								className={`mt-2 px-4 py-2 w-60 text-sm font-medium focus:bg-blue-700 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-800 text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer`}
								style={{ fontFamily: "Poppins, sans-serif" }}
								onClick={() => postComment()}
							>
								{t("comment")}
							</div>
							<a
								className={`mt-2 px-4 py-2 w-60 text-sm font-medium focus:bg-blue-700 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-800 text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer`}
								style={{ fontFamily: "Poppins, sans-serif" }}
								onClick={toggleComments}
							>
								{showComments ? t("hideComments") : t("showComments")}
							</a>
						</div>
						{showComments && (
							<div>
								<div className="comment-section mt-4">
									{comments.map((comment, index) => (
										<div
											key={index}
											className="p-6 mb-2 text-base bg-gray-200 rounded-lg dark:bg-gray-900"
										>
											<div className="flex justify-between items-center mb-2">
												<div className="flex items-center">
													<p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
														<img
															className="mr-2 w-6 h-6 rounded-full"
															src={
																comment.image
																	? process.env.REACT_APP_BUCKET_HOST +
																	comment.image
																	: PROFILEIMAGE
															}
														/>
														{comment.firstname} {comment.lastname} (@
														{comment.username})
													</p>
													<p className="text-sm text-gray-600 dark:text-gray-400">
														<time
															dateTime="2022-02-08"
															title="February 8th, 2022"
														>
															{new Date(comment.createdAt).toLocaleString("de")}
														</time>
													</p>
												</div>
											</div>
											<p className="text-gray-500 dark:text-gray-400">
												{comment.comment}
											</p>
											<div className="flex items-center mt-4 space-x-4">
												<button
													type="button"
													className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
													onClick={() => toggleReply(comment.id)}
												>
													<svg
														aria-hidden="true"
														className="mr-1 w-4 h-4"
														fill="none"
														stroke="currentColor"
														viewBox="0 0 24 24"
														xmlns="http://www.w3.org/2000/svg"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
														></path>
													</svg>
													{t("reply")}
												</button>
												{comment.childrenCount !== 0 && (
													<button
														type="button"
														className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
														onClick={() => {
															comment.showReplies = !comment.showReplies;
															setComments([...comments]);
															if (comment.showReplies && !comment.firstRepliesLoaded) {
																fetchComments(comment.id);
																comment.firstRepliesLoaded = true;
																setComments([...comments]);
															}
														}}
													>
														<svg
															aria-hidden="true"
															className="mr-1 w-4 h-4"
															fill="none"
															stroke="currentColor"
															viewBox="0 0 24 24"
															xmlns="http://www.w3.org/2000/svg"
														>
															<path
																strokeLinecap="round"
																strokeLinejoin="round"
																strokeWidth="2"
																d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
															></path>
														</svg>
														{!comment.showReplies
															? t("showReplyCount", {
																count: comment.childrenCount,
															})
															: t("hideReplies")}
													</button>
												)}
											</div>
											{comment.showReplyBox && (
												<div className="mt-4">
													<textarea
														className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 dark:text-white dark:bg-gray-800"
														rows="2"
														placeholder={t("writeReply")}
														value={comment.newReply}
														onChange={(event) =>
															setReply(comment.id, event.target.value)
														}
													></textarea>
													<button
														className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
														type="button"
														onClick={() => {
															postComment(comment.id);
														}}
														style={{ fontFamily: "Poppins, sans-serif" }}
													>
														{t("reply")}
													</button>
												</div>
											)}
											{comment.showReplies &&
												comment.replies &&
												comment.replies.map((reply, index) => (
													<div
														key={index}
														className="p-6 mb-2 text-base bg-gray-200 rounded-lg dark:bg-gray-900"
													>
														<div className="flex justify-between items-center mb-2">
															<div className="flex items-center">
																<p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
																	<img
																		className="mr-2 w-6 h-6 rounded-full"
																		src={
																			comment.image
																				? process.env.REACT_APP_BUCKET_HOST +
																				comment.image
																				: PROFILEIMAGE
																		}
																	/>
																	{comment.firstname} {comment.lastname} (@
																	{comment.username})
																</p>
																<p className="text-sm text-gray-600 dark:text-gray-400">
																	<time
																		dateTime="2022-02-08"
																		title="February 8th, 2022"
																	>
																		{reply.createdAt}
																	</time>
																</p>
															</div>
														</div>
														<p className="text-gray-500 dark:text-gray-400">
															{reply.comment}
														</p>
													</div>
												))}
											{comment.showReplies &&
												comment.replies &&
												comment.childrenCount > comment.replies.length && (
													<button
														type="button"
														className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
														onClick={() => fetchComments(comment.id)}
													>
														{t("showMoreReplies")}
													</button>
												)}
										</div>
									))}
								</div>
								{showMoreComments && (
									<button
										type="button"
										className={`mt-2 px-4 py-2 w-60 text-sm font-medium focus:bg-blue-700 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-800 text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer`}
										onClick={() => setPageNo(pageNo + 1)}
									>
										{t("showMoreComments")}
									</button>
								)}
							</div>
						)}
					</form>
				</div>

				<UserProfile user={postOwner} createdAt={createdAt} />
			</div>
			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default ViewPost;
