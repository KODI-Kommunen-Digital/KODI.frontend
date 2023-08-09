import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../index.css";
import { getUserForums } from "../Services/forumsApi";
import GROUPIMAGE from "../assets/GroupImage.avif";

const MyGroups = () => {
	const { t } = useTranslation();
	const [forums, setForums] = useState([]);

	useEffect(() => {
		getUserForums().then((response) => {
			setForums(response.data.data);
		});
	}, []);

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
						<table className="w-full text-sm text-left lg:mt-[2rem] mt-[2rem] text-gray-500 dark:text-gray-400 p-6 space-y-10 rounded-lg">
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
														forum.image
															? process.env.REACT_APP_BUCKET_HOST + forum.image
															: GROUPIMAGE
													}
													alt="avatar"
												/>
												<div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
													<div
														className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer text-center"
														style={{ fontFamily: "Poppins, sans-serif" }}
														onClick={() =>
															navigateTo(
																`/Forum?forumId=${forum.forumId}&cityId=${forum.cityId}`
															)
														}
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
														`/MyGroups/GroupMembers?forumId=${forum.forumId}&cityId=${forum.cityId}`
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
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</section>
	);
};

export default MyGroups;
