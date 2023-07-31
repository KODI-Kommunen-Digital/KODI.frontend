import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../index.css";
import { getUserForums, deleteForums } from "../Services/forumsApi";
// import { status } from "../Constants/status";
import GROUPIMAGE from "../assets/GroupImage.avif";

const MyGroups = () => {
	const { t } = useTranslation();
	const [forums, setForums] = useState([]);
	const [, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const accessToken =
			window.localStorage.getItem("accessToken") ||
			window.sessionStorage.getItem("accessToken");
		const refreshToken =
			window.localStorage.getItem("refreshToken") ||
			window.sessionStorage.getItem("refreshToken");
		if (accessToken || refreshToken) {
			setIsLoggedIn(true);
		}
		getUserForums().then((response) => {
			setForums(response.data.data);
		});
	}, []);
	const [pageNo, setPageNo] = useState(1);

	// function getStatusClass(statusId) {
	// 	if (status[statusId] === "Active") {
	// 		return "bg-green-400";
	// 	}
	// 	if (status[statusId] === "Inactive") {
	// 		return "bg-red-400";
	// 	}
	// 	if (status[statusId] === "Pending") {
	// 		return "bg-yellow-400";
	// 	}
	// }

	function goToEditForumsPage(forum) {
		navigateTo(`/CreateGroup?forumId=${forum.id}&cityId=${forum.cityId}`);
	}

	const [showConfirmationModal, setShowConfirmationModal] = useState({
		visible: false,
		forum: null,
		onConfirm: () => {},
		onCancel: () => {},
	});

	function handleDelete(forum) {
		deleteForums(forum.cityId, forum.id)
			.then((res) => {
				setForums(
					forums.filter((f) => f.cityId !== forum.cityId || f.id !== forum.id)
				);
				setShowConfirmationModal({ visible: false }); // hide the confirmation modal
			})
			.catch((error) => console.log(error));
	}

	function deleteForumsOnClick(forum) {
		setShowConfirmationModal({
			visible: true,
			forum,
			onConfirm: () => handleDelete(forum),
			onCancel: () => setShowConfirmationModal({ visible: false }),
		});
	}

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	return (
		<section className="bg-slate-600 body-font relative h-screen">
			<SideBar />

			<div className="container w-auto px-0 lg:px-5 py-2 bg-slate-600 min-h-screen flex flex-col">
				<div className="h-full">
					<div className="bg-white mt-10 p-0 space-y-10 overflow-x-auto">
						<table className="w-full text-sm text-left lg:mt-[2rem] mt-[2rem] text-gray-500 dark:text-gray-400 p-6 space-y-10 rounded-xl">
							<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-50 dark:text-gray-700">
								<tr>
									<th
										scope="col"
										className="px-6 sm:px-6 py-3"
										style={{
											fontFamily: "Poppins, sans-serif",
											width: "16.67%",
										}}
									>
										{t("groupName")}
									</th>
									<th
										scope="col"
										className="px-6 sm:px-6 py-3 text-center"
										style={{
											fontFamily: "Poppins, sans-serif",
											width: "16.67%",
										}}
									>
										{t("members")}
									</th>
									<th
										scope="col"
										className="px-6 sm:px-6 py-3 text-center hidden lg:table-cell"
										style={{
											fontFamily: "Poppins, sans-serif",
											width: "16.67%",
										}}
									>
										{t("date_of_creation")}
									</th>

									<th
										scope="col"
										className="px-6 sm:px-6 py-3 text-center hidden lg:table-cell"
										style={{
											fontFamily: "Poppins, sans-serif",
											width: "16.67%",
										}}
									>
										{t("admin")}
									</th>

									<th
										scope="col"
										className="px-6 sm:px-6 py-3 text-center hidden lg:table-cell"
										style={{
											fontFamily: "Poppins, sans-serif",
											width: "16.67%",
										}}
									>
										{t("privacy")}
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-center"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("action")}
									</th>
									{/* <th
										scope="col"
										className="px-6 py-3 text-center"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("status")}
									</th> */}
								</tr>
							</thead>
							<tbody>
								{forums.map((forum, index) => {
									return (
										<tr
											key={index}
											className="bg-white border-b dark:bg-white dark:border-white hover:bg-gray-50 dark:hover:bg-gray-50"
										>
											<th
												scope="row"
												className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
											>
												<img
													className="w-10 h-10 rounded-full hidden sm:table-cell"
													src={
														forum.logo
															? process.env.REACT_APP_BUCKET_HOST + forum.logo
															: GROUPIMAGE
													}
													alt="avatar"
												/>
												<div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
													<div
														className="font-normal text-gray-500 truncate"
														style={{ fontFamily: "Poppins, sans-serif" }}
													>
														{forum.forumName}
													</div>
												</div>
											</th>

											<td
												className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer text-center"
												style={{ fontFamily: "Poppins, sans-serif" }}
												onClick={() =>
													navigateTo(
														`/MyGroups/GroupMembers?id=${forum.forumId}&cityId=${forum.cityId}`
													)
												}
											>
												{t("members")}
											</td>

											<td
												className="px-6 py-4 hidden lg:table-cell text-center"
												style={{ fontFamily: "Poppins, sans-serif" }}
											>
												{new Date(forum.JoinedAt).toLocaleString("de")}
											</td>

											<td
												className="px-6 py-4 hidden lg:table-cell text-center"
												style={{ fontFamily: "Poppins, sans-serif" }}
											>
												{forum.isAdmin === 1 ? "You are admin" : "Member"}
											</td>
											<td
												className="px-6 py-4 hidden lg:table-cell text-center"
												style={{ fontFamily: "Poppins, sans-serif" }}
											>
												{forum.isPrivate === 1
													? "Private group"
													: "Public group"}
											</td>

											<td className="px-6 py-4 text-center">
												<a
													className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer pr-2"
													onClick={() => goToEditForumsPage(forum)}
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{t("edit")}
												</a>
												<a
													className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer text-center"
													onClick={() => deleteForumsOnClick(forum)}
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{t("delete")}
												</a>
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
																				className="h-6 w-6 text-red-600"
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
																					{t("doyoureallywanttodeleteListing")}
																				</p>
																			</div>
																		</div>
																	</div>
																</div>
																<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
																	<button
																		onClick={showConfirmationModal.onConfirm}
																		type="button"
																		className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
																	>
																		{t("delete")}
																	</button>

																	<button
																		onClick={showConfirmationModal.onCancel}
																		type="button"
																		className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
																	>
																		{t("cancel")}
																	</button>
																</div>
															</div>
														</div>
													</div>
												)}
											</td>

											{/* <td className="px-6 py-4">
												<div className="flex items-center justify-center">
													<div
														className={`h-2.5 w-2.5 rounded-full ${getStatusClass(
															forum.statusId
														)} mr-2`}
													></div>
													<h1 style={{ fontFamily: "Poppins, sans-serif" }}>
														{status[forum.statusId]
															? t(status[forum.statusId].toLowerCase())
															: ""}
													</h1>
												</div>
											</td> */}
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
					<div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
						{pageNo !== 1 ? (
							<span
								className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
								onClick={() => setPageNo(pageNo - 1)}
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{"<"}{" "}
							</span>
						) : (
							<span />
						)}
						<span
							className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("page")} {pageNo}
						</span>

						{forums.length >= 9 && (
							<span
								className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
								onClick={() => setPageNo(pageNo + 1)}
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{">"}
							</span>
						)}
					</div>
				</div>
			</div>
		</section>
	);
};

export default MyGroups;
