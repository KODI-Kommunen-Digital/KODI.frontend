import React, { useState, useEffect } from "react";
import HomePageNavBar from "../Components/HomePageNavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../Components/Footer";
import POSTS from "../assets/POSTS.png";
import POSTSLOGO from "../assets/POSTSLOGO.jpg";
import PROFILEIMAGE from "../assets/ProfilePicture.png";
import PropTypes from "prop-types";
import { getUserForumsPost } from "../Services/forumsApi";
import { Comments } from "../Constants/Comments";

const Description = ({ content }) => {
	return (
		<p
			className="leading-relaxed text-md font-medium my-6 text-gray-900 dark:text-gray-900"
			dangerouslySetInnerHTML={{ __html: content }}
		></p>
	);
};

Description.propTypes = {
	content: PropTypes.string.isRequired,
};

const ViewPost = () => {
	// window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [description, setDescription] = useState("");
	const [userSocial, setUserSocial] = useState([]);
	const [user] = useState();
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [forumPosts, setforumPosts] = useState([]);
	const [, setForumId] = useState(0);
	const [cityId, setCityId] = useState(0);
	const [createdAt, setCreatedAt] = useState("");
	const [title, setTitle] = useState("");
	const [showComments, setShowComments] = useState(false);
	const [showReplyBox, setShowReplyBox] = useState(false);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const toggleDropdown = () => {
		setIsDropdownOpen(!isDropdownOpen);
	};
	const toggleReply = () => {
		setShowReplyBox(!showReplyBox);
	};

	const toggleComments = () => {
		setShowComments(!showComments);
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const cityId = searchParams.get("cityId");
		setCityId(cityId);
		const forumId = searchParams.get("forumId");
		setForumId(forumId);
		if (forumId && cityId) {
			const accessToken =
				window.localStorage.getItem("accessToken") ||
				window.sessionStorage.getItem("accessToken");
			const refreshToken =
				window.localStorage.getItem("refreshToken") ||
				window.sessionStorage.getItem("refreshToken");
			if (accessToken || refreshToken) {
				setIsLoggedIn(true);
			}

			getUserForumsPost(cityId, forumId)
				.then((forumsResponse) => {
					const posts = forumsResponse.data.posts;
					if (posts.length > 0) {
						const forumPost = posts[0];
						console.log(forumPost);
						setforumPosts(forumPost);
						setDescription(forumPost.description);
						setTitle(forumPost.title);
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
	}, [t, cityId, window.location.href, isLoggedIn]);

	useEffect(() => {
		document.title = "View Post";
	}, []);

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	const [, setUserName] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [, setProfilePic] = useState("");

	useEffect(() => {
		if (user) {
			try {
				const socialMedia = user.socialMedia
					? JSON.parse(user.socialMedia)
					: {};
				setUserSocial(socialMedia);
				setUserName(user.userName);
				setFirstname(user.firstname);
				setLastname(user.lastname);
				setProfilePic(user.image);
			} catch (error) {
				console.error("Error parsing user.socialMedia:", error);
			}
		}
	}, [user]);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const terminalViewParam = searchParams.get("terminalView");
	const [, setShowNavBar] = useState(true);

	useEffect(() => {
		if (terminalViewParam === "true") {
			setShowNavBar(false);
		} else {
			setShowNavBar(true);
		}
	}, [terminalViewParam]);

	return (
		<section className="text-gray-600 bg-white body-font">
			<HomePageNavBar />

			<div className="mx-auto w-full grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:grid-cols-3 lg:pt-24 lg:pb-4">
				<div className="grid grid-cols-1 gap-4 col-span-2">
					<div className="overflow-hidden mb-10">
						<h1 className="text-gray-900 mb-4 text-2xl md:text-3xl mt-4 lg:text-3xl title-font text-start font-bold overflow-hidden">
							<span
								className="inline-block max-w-full break-words"
								style={{
									fontFamily: "Poppins, sans-serif",
								}}
							>
								{title}
							</span>
						</h1>
					</div>

					<div className="container-fluid lg:w-full md:w-full mb-10">
						<div className=" mr-0 ml-0 mt-0">
							<div className="h-96 overflow-hidden px-0 py-0 shadow-xl">
								<div className="relative h-96">
									<img
										alt="listing"
										className="object-cover object-center h-full w-full"
										src={
											forumPosts.image
												? process.env.REACT_APP_BUCKET_HOST + forumPosts.image
												: POSTSLOGO
										}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="overflow-hidden mb-10">
						<Description content={description} />
					</div>

					<a
						className="ml-0 w-full sm:w-48 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
						style={{ fontFamily: "Poppins, sans-serif" }}
						onClick={toggleComments}
					>
						Comment
					</a>

					{showComments && (
						<div className="comment-section">
							{Comments.map((comment) => (
								<article
									key={comment.id}
									className="p-6 mb-2 text-base bg-gray-200 rounded-lg dark:bg-gray-900"
								>
									<footer className="flex justify-between items-center mb-2">
										<div className="flex items-center">
											<p className="inline-flex items-center mr-3 text-sm text-gray-900 dark:text-white">
												<img
													className="mr-2 w-6 h-6 rounded-full"
													src={comment.user.avatar}
													alt={comment.user.username}
												/>
												{comment.user.username}
											</p>
											<p className="text-sm text-gray-600 dark:text-gray-400">
												<time dateTime="2022-02-08" title="February 8th, 2022">
													Feb. 8, 2022
												</time>
											</p>
										</div>
										<div className="relative">
											<button
												id={`dropdownComment${comment.id}Button`}
												data-dropdown-toggle={`dropdownComment${comment.id}`}
												className="inline-flex items-center p-2 text-sm font-medium text-center text-gray-400 bg-white rounded-xl hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-50 dark:bg-gray-900 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
												type="button"
												onClick={toggleDropdown}
											>
												<svg
													className="w-5 h-5"
													aria-hidden="true"
													fill="currentColor"
													viewBox="0 0 20 20"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z"></path>
												</svg>
												<span className="sr-only">Comment settings</span>
											</button>
											<div
												id={`dropdownComment${comment.id}`}
												className={`${
													isDropdownOpen ? "" : "hidden"
												} absolute z-10 w-36 mt-1 bg-white rounded-xl divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 right-0`}
											>
												<ul
													className="py-1 text-sm text-gray-700 dark:text-gray-200"
													aria-labelledby={`dropdownComment${comment.id}Button`}
												>
													<li>
														<a
															href="#"
															className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
														>
															Remove
														</a>
													</li>
													<li>
														<a
															href="#"
															className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
														>
															Report
														</a>
													</li>
												</ul>
											</div>
										</div>
									</footer>
									<p className="text-gray-500 dark:text-gray-400">
										{comment.comment}
									</p>
									<div className="flex items-center mt-4 space-x-4">
										<button
											type="button"
											className="flex items-center text-sm text-gray-500 hover:underline dark:text-gray-400"
											onClick={toggleReply}
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
											Reply
										</button>
									</div>
									{showReplyBox && (
										<div className="mt-4">
											<textarea
												className="w-full px-4 py-2 text-sm text-gray-900 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-300 dark:text-white dark:bg-gray-800"
												rows="2"
												placeholder="Write a reply..."
											></textarea>
											<button
												className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
												type="button"
												onClick={() => {
													// Handle reply submission logic here
												}}
												style={{ fontFamily: "Poppins, sans-serif" }}
											>
												Submit Reply
											</button>
										</div>
									)}
								</article>
							))}

							<form className="mb-6">
								<div className="py-2 px-4 mb-4 bg-white rounded-xl rounded-t-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
									<label htmlFor="comment" className="sr-only">
										Your comment
									</label>
									<textarea
										id="comment"
										rows="2"
										className="px-0 w-full text-sm text-gray-900 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
										placeholder="Write a comment..."
										required
									></textarea>
								</div>
								<a
									className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-800 rounded-xl hover:bg-blue-700 focus:outline-none focus:bg-blue-700"
									style={{ fontFamily: "Poppins, sans-serif" }}
								>
									Post comment
								</a>
							</form>
						</div>
					)}
				</div>

				{userSocial && userSocial.length > 0 ? (
					<div className="w-full md:ml-[6rem] lg:ml-[0rem] ml-[1rem] h-full sm:h-96 bg-white rounded-xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-white shadow-xl dark:bg-white">
						<div>
							<div className="p-4 space-y-0 md:space-y-6 sm:p-4">
								<h1
									className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									{t("ownerInfo")}
								</h1>
							</div>
							<div className="my-4 bg-gray-200 h-[1px]"></div>

							<div className="items-center mx-2 py-2 px-2 my-2 gap-4 grid grid-cols-1 sm:grid-cols-2">
								<div className="flex flex-col justify-center items-start">
									<img
										className="rounded-full h-20 w-20"
										src={
											user?.image
												? process.env.REACT_APP_BUCKET_HOST + user?.image
												: PROFILEIMAGE
										}
										alt={user?.lastname}
									/>
								</div>
								<div className="flex-grow text-center sm:text-left mt-6 sm:mt-0">
									<h2
										className="text-gray-900 text-lg title-font mb-2 font-bold dark:text-gray-900"
										style={{
											fontFamily: "Poppins, sans-serif",
										}}
									>
										{firstname + " " + lastname}
									</h2>
									<p
										className="leading-relaxed text-base dark:text-gray-900"
										style={{
											fontFamily: "Poppins, sans-serif",
										}}
									>
										{t("uploaded_on")}
										{createdAt}
									</p>
								</div>
							</div>

							<div className="bg-white mx-2 my-2 py-2 px-2 mt-4 mb-4 flex flex-wrap gap-1 justify-Start">
								{userSocial?.Facebook && (
									<div className="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
										<button
											type="button"
											data-te-ripple-init
											data-te-ripple-color="light"
											className="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-blue-500"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
											</svg>
										</button>
									</div>
								)}
								{userSocial?.Instagram && (
									<div className="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
										<button
											type="button"
											data-te-ripple-init
											data-te-ripple-color="light"
											className="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-pink-600"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
											</svg>
										</button>
									</div>
								)}
								{userSocial?.LinkedIn && (
									<div className="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
										<button
											type="button"
											data-te-ripple-init
											data-te-ripple-color="light"
											className="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-sky-600"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
											</svg>
										</button>
									</div>
								)}
								{userSocial?.Youtube && (
									<div className="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
										<button
											type="button"
											data-te-ripple-init
											data-te-ripple-color="light"
											className="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-red-600"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
											</svg>
										</button>
									</div>
								)}
								{userSocial?.Twitter && (
									<div className="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
										<button
											type="button"
											data-te-ripple-init
											data-te-ripple-color="light"
											className="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-blue-400"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												className="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
											</svg>
										</button>
									</div>
								)}
							</div>

							<div className="flex justify-center my-4">
								<button
									onClick={() =>
										navigateTo(
											user ? `/ViewProfile?userId=${user.id}` : "/ViewProfile"
										)
									}
									type="submit"
									className="group relative flex w-72 md:w-96 lg:mx-4 sm:mx-0 font-bold justify-center rounded-xl border border-transparent text-blue-800 bg-slate-300 py-2 px-4 text-sm shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									<span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
									{t("viewProfile")}
								</button>
							</div>
						</div>
					</div>
				) : (
					<div className="w-full sm:h-72 md:h-80 h-[25rem] md:ml-[6rem] lg:ml-[0rem] ml-[1rem] bg-white rounded-xl dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-white shadow-xl dark:bg-white">
						<div>
							<div className="p-4 space-y-0 md:space-y-6 sm:p-4">
								<h1
									className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									{t("ownerInfo")}
								</h1>
							</div>
							<div className="my-4 bg-gray-200 h-[1px]"></div>

							<div className="items-center mx-2 py-2 px-2 my-2 gap-2 grid grid-cols-1 sm:grid-cols-2">
								<div className="flex justify-center sm:justify-start">
									<img
										className="rounded-full h-20 w-20"
										src={
											user?.image
												? process.env.REACT_APP_BUCKET_HOST + user?.image
												: PROFILEIMAGE
										}
										alt={user?.lastname}
									/>
								</div>
								<div className="flex-grow text-center sm:text-left mt-6 sm:mt-0">
									<h2
										className="text-gray-900 text-lg title-font mb-2 font-bold dark:text-gray-900"
										style={{
											fontFamily: "Poppins, sans-serif",
										}}
									>
										{firstname + " " + lastname}
									</h2>
									<p
										className="leading-relaxed text-base dark:text-gray-900"
										style={{
											fontFamily: "Poppins, sans-serif",
										}}
									>
										{t("uploaded_at") + " " + createdAt}
									</p>
								</div>
							</div>

							<div className="flex justify-center lg:mt-7 md:mt-7 mt-7">
								<button
									onClick={() => {
										let url = `/ViewProfile?userId=${user.id}`;
										if (terminalViewParam === "true") {
											url += "&terminalView=true";
										}
										navigateTo(url);
									}}
									type="submit"
									className="group relative flex w-48 sm:w-96 lg:mx-4 sm:mx-0 font-bold justify-center rounded-xl border border-transparent text-blue-800 bg-slate-300 py-2 px-4 text-sm shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									<span className="absolute inset-y-0 left-0 flex items-center pl-3"></span>
									{t("viewProfile")}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			<div className="mx-auto grid max-w-2xl  gap-y-1 gap-x-8 pb-8 pt-8 px-4 sm:px-6 sm:py-10 lg:max-w-7xl">
				<h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900">
					{t("similarItems")}
				</h1>
				{forumPosts && forumPosts.length > 0 ? (
					<div className="bg-white p-0 mt-10 mb-10 flex flex-wrap gap-10 justify-center">
						<div className="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
							{forumPosts &&
								forumPosts.map((forum) => (
									<div
										key={forum.id}
										onClick={() => {
											let url = `/HomePage/EventDetails?listingId=${forum.id}&cityId=${forum.cityId}`;
											if (terminalViewParam === "true") {
												url += "&terminalView=true";
											}
											navigateTo(url);
										}}
										className="w-full h-full shadow-lg rounded-xl cursor-pointer"
									>
										<a className="block relative h-64 rounded-xl overflow-hidden">
											<img
												alt="ecommerce"
												className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000"
												src={
													forumPosts.logo
														? process.env.REACT_APP_BUCKET_HOST +
														  forumPosts.logo
														: POSTS
												}
											/>
										</a>
										<div className="mt-5 px-2">
											<h2
												className="text-gray-900 title-font text-lg font-bold text-center font-sans truncate"
												style={{
													fontFamily: "Poppins, sans-serif",
												}}
											>
												{forum.title}
											</h2>
										</div>
										<div className="my-4 bg-gray-200 h-[1px]"></div>
										{forum.id && forum.categoryId === 3 ? (
											<p
												className="text-gray-600 my-4 p-2 h-[1.8rem] title-font text-sm font-semibold text-center font-sans truncate"
												style={{
													fontFamily: "Poppins, sans-serif",
												}}
											>
												{new Date(
													forum.startDate.slice(0, 10)
												).toLocaleDateString("de-DE") +
													" To " +
													new Date(
														forum.endDate.slice(0, 10)
													).toLocaleDateString("de-DE")}
											</p>
										) : (
											<p
												className="text-gray-600 my-4 p-2 h-[1.8rem] title-font text-sm font-semibold text-center font-sans truncate"
												style={{
													fontFamily: "Poppins, sans-serif",
												}}
												dangerouslySetInnerHTML={{
													__html: forum.description,
												}}
											/>
										)}
									</div>
								))}
						</div>
					</div>
				) : (
					<div>
						<div className="flex items-center justify-center">
							<h1
								className=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("currently_no_listings")}
							</h1>
						</div>
						<div className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
							<span
								className="font-sans text-black"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("to_upload_new_listing")}
							</span>
							<a
								className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-black"
								onClick={() => {
									localStorage.setItem("selectedItem", "Choose one category");
									isLoggedIn
										? navigateTo("/UploadListings")
										: navigateTo("/login");
								}}
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("click_here")}
							</a>
						</div>
					</div>
				)}
			</div>
			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default ViewPost;
