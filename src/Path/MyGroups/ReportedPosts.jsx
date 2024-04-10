import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import {
	getReportedPosts,
	updatePost,
	reportedComments,
} from "../../Services/forumsApi";
import PROFILEPICTURE from "../../assets/ProfilePicture.png";
import { useNavigate } from "react-router-dom";
import ForumNavbar from "../../Components/ForumNavbar";

const ReportedPosts = () => {
	const { t } = useTranslation();
	const [reports, setReports] = useState([]);
	const [cityId, setCityId] = useState(0);
	const [forumId, setForumId] = useState(0);
	const [postReportedComments, setReportedComments] = useState([]);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		document.title = t("reportedPosts");
		const cityIdParam = parseInt(urlParams.get("cityId"));
		const forumIdParam = parseInt(urlParams.get("forumId"));
		getReportedPosts(cityIdParam, forumIdParam, { minReports: 1 })
			.then((response) => {
				setReports(response.data.data);
				setCityId(cityIdParam);
				setForumId(forumIdParam);
			})
			.catch((e) => navigateTo("/Error"));
	}, []);

	// useEffect(() => {
	// 	if (cityId !== null && forumId !== null) {
	// 		fetchReportedComments();
	// 	}
	// }, [cityId, forumId]);

	const fetchReportedComments = async (cityId, forumId, postId) => {
		try {
			const response = await reportedComments(cityId, forumId, postId);
			console.log(response.data.data);
			setReportedComments(response.data.data);
		} catch (error) {
			console.error("Error fetching reported comments:", error);
		}
	};

	function hideOrViewPost(postId, hide) {
		updatePost(cityId, forumId, postId, { isHidden: hide }).then(() => {
			const report = reports.find((r) => r.id === postId);
			report.isHidden = hide;
			setReports([...reports]);
		});
	}

	const [showReportsModal, setShowReportsModal] = useState({
		visible: false,
		reports: null,
		onCancel: () => {
			setShowReportsModal({ ...showReportsModal, visible: false });
		},
	});

	const handleViewReports = (postId) => {
		fetchReportedComments(cityId, forumId, postId);
		setShowReportsModal({ ...showReportsModal, visible: true });
	};

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	return (
		<section className="bg-slate-600 body-font relative h-screen">
			<SideBar />
			<ForumNavbar cityId={cityId} forumId={forumId} />
			<div className="container w-auto px-0 lg:px-5 py-2 bg-slate-600 min-h-screen flex flex-col">
				<div className="h-full">
					<div className="bg-white mt-10 p-0 space-y-10 overflow-x-auto">
						<table className="w-full text-sm text-left lg:mt-[2rem] mt-[2rem] text-gray-500 dark:text-gray-400 p-6 space-y-10 rounded-lg">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-50 dark:text-gray-700">
								<tr>
									<th
										scope="col"
										className="px-6 sm:px-6 py-3"
										style={{
											fontFamily: "Poppins, sans-serif",
											width: "25%",
										}}
									>
										{t("reportedPosts")}
									</th>

									<th
										scope="col"
										className="px-3 sm:px-3 py-3 text-center"
										style={{
											fontFamily: "Poppins, sans-serif",
											width: "18.75%",
										}}
									>
										{t("numberOfReports")}
									</th>

									<th
										scope="col"
										className="px-6 sm:px-6 py-3 text-center"
										style={{
											fontFamily: "Poppins, sans-serif",
											width: "18.75%",
										}}
									>
										{t("hiddenPost")}
									</th>

									<th
										scope="col"
										className="px-6 py-3 text-center"
										style={{
											fontFamily: "Poppins, sans-serif",
											width: "18.75%",
										}}
									>
										{t("view")}
									</th>

									<th
										scope="col"
										className="px-6 py-3 text-center"
										style={{
											fontFamily: "Poppins, sans-serif",
											width: "18.75%",
										}}
									>
										{t("action")}
									</th>
								</tr>
							</thead>
							<tbody>
								{reports &&
									reports.map((report, index) => {
										return (
											<tr
												key={index}
												className="bg-white border-b dark:bg-white dark:border-white hover:bg-gray-50 dark:hover:bg-gray-50"
											>
												<th
													scope="row"
													className="flex items-center px-6 py-4 text-slate-800 whitespace-nowrap dark:text-white cursor-pointer"
												>
													<img
														className="w-10 h-10 rounded-full hidden sm:table-cell"
														src={
															report.image
																? process.env.REACT_APP_BUCKET_HOST +
																report.image
																: PROFILEPICTURE
														}
														alt="avatar"
													/>
													<div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
														<div
															className="font-normal text-gray-500 truncate"
															style={{ fontFamily: "Poppins, sans-serif" }}
															onClick={() =>
																navigateTo(
																	`/Forum/ViewPost?postId=${report.id}&forumId=${forumId}&cityId=${cityId}`
																)
															}
														>
															{report.title}
														</div>
													</div>
												</th>

												<td
													className="px-3 py-4 text-center"
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{report.numberOfReports}
												</td>

												<td
													className="px-6 py-4 text-center"
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{report.isHidden ? t("yes") : t("no")}
												</td>

												<td className="px-6 py-4 text-center">
													<a
														className="font-medium text-blue-600 px-2 dark:text-blue-500 hover:underline cursor-pointer text-center"
														style={{ fontFamily: "Poppins, sans-serif" }}
														onClick={() => handleViewReports(report.id)}
													>
														{t("viewReports")}
													</a>
													{showReportsModal.visible && (
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
																<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
																	<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
																		<div className="sm:flex sm:items-start">
																			<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
																				<svg
																					className="h-12 w-12 text-red-700"
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
																						d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 14h-.01M12 9V13"
																					/>
																				</svg>
																			</div>
																			<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
																				<h3 className="text-lg leading-6 font-medium text-slate-800">
																					{t("reasonforReport")}
																				</h3>
																				<div className="mt-2">
																					{postReportedComments.map(
																						(comment, index) => (
																							<div key={index}>
																								{comment.Reason}
																							</div>
																						)
																					)}
																				</div>
																			</div>
																		</div>
																	</div>
																	<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
																		<button
																			onClick={showReportsModal.onCancel}
																			type="button"
																			className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
																		>
																			{t("cancel")}
																		</button>
																	</div>
																</div>
															</div>
														</div>
													)}
												</td>
												<td className="px-6 py-4 text-center">
													<a
														className="font-medium text-blue-600 px-2 dark:text-blue-500 hover:underline cursor-pointer text-center"
														style={{ fontFamily: "Poppins, sans-serif" }}
														onClick={() =>
															hideOrViewPost(report.id, !report.isHidden)
														}
													>
														{report.isHidden ? t("unHidePost") : t("hidePost")}
													</a>
												</td>
											</tr>
										);
									})}
							</tbody>
						</table>
					</div>

					<div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-left cursor-pointer">
						<button
							type="button"
							className="inline-block rounded-xl bg-black px-3 pb-2 pt-2 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
							style={{ fontFamily: "Poppins, sans-serif" }}
							onClick={() => navigateTo("/MyGroups")}
						>
							{t("backToMyGroups")}
						</button>
					</div>
				</div>
			</div>
		</section>
	);
};

export default ReportedPosts;
