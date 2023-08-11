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

const Forum = () => {
	window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [forumPosts, setForumPosts] = useState([]);
	const [forum, setFourm] = useState({});
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
		const urlParams = new URLSearchParams(window.location.search);
		const cityIdParam = parseInt(urlParams.get("cityId"));
		const forumIdParam = parseInt(urlParams.get("forumId"));
		const pageNoParam = parseInt(urlParams.get("pageNo")) || 1;
		document.title = "Heidi - Forums";
		setPageNo(pageNoParam);
		if (cityIdParam && forumIdParam) {
			getForum(cityIdParam, forumIdParam).then((response) => {
				if (response.data.data) {
					setFourm(response.data.data);
					getForumPosts(cityIdParam, forumIdParam, {
						pageNo: pageNoParam,
						pageSize,
					}).then((response2) => {
						setForumPosts(response2.data.data);
					});
					setCityId(cityIdParam);
					setForumId(forumIdParam);
					setIsValidForum(true);
				}
			});
		}
	}, []);

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
			const cityId = parseInt(urlParams.get("cityId"));
			const forumId = parseInt(urlParams.get("forumId"));
			try {
				const response = await getUserForums();
				const userForums = response.data.data;
				const isMember = userForums.some(
					(userForum) => userForum.forumId === forumId
				);
				setMemberStatus(isMember);
				const forum = userForums.find(
					(userForum) => userForum.forumId === forumId
				);
				if (forum) {
					setMemberId(forum.memberId);
				}
				const membersResponse = await getForumMembers(cityId, forumId);
				const forumMembers = membersResponse.data.data;
				setIsOnlyMember(forumMembers.length === 1 && isMember);
			} catch (error) {
				console.error("Error fetching user forums:", error);
			}
		}
		checkUserMembership();
	}, [forumId]);

	const handleFollowRequest = async () => {
		try {
			await forumMemberRequests(cityId, forumId);
			setFollowRequested(true);
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

	const handleDeleteGroup = async () => {
		try {
			await deleteForums(cityId, forumId);
		} catch (error) {
			console.error("Error deleting group:", error);
		}
	};

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
											forum.image
												? process.env.REACT_APP_BUCKET_HOST + forum.image
												: process.env.REACT_APP_BUCKET_HOST +
												  "admin/Homepage.jpg"
										}
									/>
									<div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
										<h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
											{forum.forumName}
										</h1>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="text-center justify-between lg:px-10 md:px-5 sm:px-0 px-4 md:py-6 py-4 bg-gray-100">
						{memberStatus && (
							<div className="flex flex-row md:flex-row items-center justify-center">
								{isOnlyMember ? (
									<div>
										<a
											onClick={handleDeleteGroup}
											className="hidden lg:block mx-4 md:mx-8 mb-2 md:mb-0 w-20 md:w-60 font-sans items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-red-700 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
										>
											{t("deleteGroup")}
										</a>
										<svg
											onClick={handleDeleteGroup}
											className="block lg:hidden mx-4 md:mx-8 mb-2 md:mb-0 w-6 h-6 text-red-700 cursor-pointer"
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
											className="block lg:hidden mx-4 md:mx_8 mb-2 md:mb-0 w-6 h-6 text-red-700 cursor-pointer"
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

								<div>
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
										className="block lg:hidden mx-4 md:mx-8 mb-2 md:mb-0 w-6 h-6 text-blue-400 cursor-pointer"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M4 6h16M4 12h16m-7 6h7"
										/>
									</svg>
								</div>

								<div>
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
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 4v16m8-8H4"
										/>
									</svg>
								</div>
							</div>
						)}

						{forum.isPrivate && !memberStatus && (
							<a
								onClick={followRequested ? undefined : handleFollowRequest}
								className={`mx-8 mb-2 w-60 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-red-700 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer`}
							>
								{followRequested ? t("requestSent") : t("request")}
							</a>
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
								{forum.description}
							</h1>
						</div>
					</div>

					{memberStatus && forumPosts && forumPosts.length > 0 ? (
						<div className="max-w-2xl lg:px-10 md:px-5 sm:px-0 px-2 py-6 lg:max-w-7xl">
							<h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900">
								{t("groupPosts")}
							</h1>
							<div className="bg-white lg:px-0 md:px-0 sm:px-0 px-0 py-6 mt-10 mb-10 space-y-10 flex flex-col">
								<div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 relative mb-4 justify-center place-items-center">
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
																: process.env.REACT_APP_BUCKET_HOST +
																  "admin/Homepage.jpg"
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
								<h1 className=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
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
					{forum.isPrivate && !memberStatus && (
						<div>
							<div className="flex items-center justify-center">
								<h1 className=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
									This group is private
								</h1>
							</div>
							<div className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
								<span className="font-sans text-black">
									To join the group, click the Follow request button!
								</span>
							</div>
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
				<h1 className="text-10xl md:text-5xl lg:text-8xl text-center font-bold my-4 font-sans py-72">
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
