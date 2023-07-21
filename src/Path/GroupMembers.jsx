import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../index.css";
import { getForumMembers } from "../Services/forumsApi";
import GROUPIMAGE from "../assets/GroupImage.avif";
import { useNavigate } from "react-router-dom";
// import { getCities } from "../Services/cities";

const GroupMembers = () => {
	const { t } = useTranslation();
	const [members, setMembers] = useState([]);
	const [, setCityId] = useState(0);
	const [, setForumId] = useState(0);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		document.title = "Heidi - Forum Members";
		const cityIdParam = urlParams.get("cityId");
		const forumIdParam = urlParams.get("id");
		getForumMembers(cityIdParam, forumIdParam).then((response) => {
			setMembers(response.data.data);
			console.log(response.data.data);
			setCityId(cityIdParam);
			setForumId(forumIdParam);
		});
	}, []);
	const [pageNo, setPageNo] = useState(1);

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
											width: "33.3%",
										}}
									>
										{t("members")}
									</th>

									<th
										scope="col"
										className="px-6 sm:px-6 py-3 text-center hidden lg:table-cell"
										style={{
											fontFamily: "Poppins, sans-serif",
											width: "33.3%",
										}}
									>
										{t("date_of_joining")}
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
										className="px-6 py-3 text-center"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("action")}
									</th>
								</tr>
							</thead>
							<tbody>
								{members.map((member, index) => {
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
														member.logo
															? process.env.REACT_APP_BUCKET_HOST + member.logo
															: GROUPIMAGE
													}
													alt="avatar"
												/>
												<div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem]">
													<div
														className="font-normal text-gray-500 truncate"
														style={{ fontFamily: "Poppins, sans-serif" }}
													>
														{member.username}
													</div>
												</div>
											</th>

											<td
												className="px-6 py-4 hidden lg:table-cell text-center"
												style={{ fontFamily: "Poppins, sans-serif" }}
											>
												{new Date(member.JoinedAt).toLocaleString("de")}
											</td>

											<td
												className="px-6 py-4 hidden lg:table-cell text-center"
												style={{ fontFamily: "Poppins, sans-serif" }}
											>
												{member.isAdmin === 1 ? "You are admin" : "Member"}
											</td>

											<td className="px-6 py-4 text-center">
												<a
													className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer text-center"
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{t("remove")}
												</a>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>

					<div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center text-white bg-black rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 float-left cursor-pointer">
						<button
							type="button"
							className="text-lg px-3"
							style={{ fontFamily: "Poppins, sans-serif" }}
							onClick={() => navigateTo("/MyGroups")}
						>
							{t("backToMyGroups")}
						</button>
					</div>

					<div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center text-white bg-black rounded-lg hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800 float-right cursor-pointer">
						{pageNo !== 1 ? (
							<span
								className="text-md px-3 hover:bg-gray-800 cursor-pointer rounded-lg"
								onClick={() => setPageNo(pageNo - 1)}
								style={{ fontFamily: "Poppins, sans-serif" }}
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

						{members.length >= 9 && (
							<span
								className="text-lg px-3 hover:bg-gray-800 cursor-pointer rounded-lg"
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

export default GroupMembers;
