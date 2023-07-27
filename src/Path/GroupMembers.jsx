import React, { useState, useEffect, Fragment } from "react";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../index.css";
import { getForumMembers } from "../Services/forumsApi";
import GROUPIMAGE from "../assets/GroupImage.avif";
import { useNavigate } from "react-router-dom";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

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
			<div className="container px-0 sm:px-0 py-0 w-full fixed top-0 z-10 lg:px-5 lg:w-auto lg:relative">
				<Popover className="relative bg-black mr-0 ml-0 px-10 lg:rounded-lg h-16">
					<div className="w-full">
						<div className="w-full h-full flex items-center lg:py-2 py-5 justify-end xl:justify-center lg:justify-center border-gray-100 md:space-x-10">
							<div className="hidden lg:block">
								<div className="w-full h-full flex items-center justify-end xl:justify-center lg:justify-center md:justify-end sm:justify-end border-gray-100 md:space-x-10">
									<div
										className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
										style={{
											fontFamily: "Poppins, sans-serif",
										}}
									>
										{t("members")}
									</div>
									<div
										className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
										style={{
											fontFamily: "Poppins, sans-serif",
										}}
									>
										{t("memberRequest")}
									</div>
									<div
										className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
										style={{
											fontFamily: "Poppins, sans-serif",
										}}
									>
										{t("reportedPosts")}
									</div>
								</div>
							</div>

							<div className="-my-2 -mr-2 lg:hidden">
								<Popover.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
									<span className="sr-only">Open menu</span>
									<Bars3Icon className="h-6 w-6" aria-hidden="true" />
								</Popover.Button>
							</div>
						</div>
					</div>

					<Transition
						as={Fragment}
						enter="duration-200 ease-out"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="duration-100 ease-in"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<Popover.Panel
							focus
							className="absolute inset-x-0 top-0 origin-top-right transform p-0 transition lg:hidden"
						>
							<div className="divide-y-2 divide-gray-50 bg-black shadow-lg ring-1 ring-black ring-opacity-5">
								<div className="space-y-6 py-6 px-5">
									<div className="-my-2 -mr-2 lg:hidden flex justify-end">
										<Popover.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
											<span className="sr-only">Close menu</span>
											<XMarkIcon className="h-6 w-6" aria-hidden="true" />
										</Popover.Button>
									</div>

									<div className="space-y-1">
										<div
											className="lg:hidden flex justify-center text-center"
											id="mobile-menu"
										>
											<div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
												<div
													className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
													style={{
														fontFamily: "Poppins, sans-serif",
													}}
												>
													{t("members")}
												</div>
												<div
													className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
													style={{
														fontFamily: "Poppins, sans-serif",
													}}
												>
													{t("memberRequest")}
												</div>
												<div
													className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
													style={{
														fontFamily: "Poppins, sans-serif",
													}}
												>
													{t("reportedPosts")}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Popover.Panel>
					</Transition>
				</Popover>
			</div>

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
										className="px-6 sm:px-6 py-3 text-center"
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
												<div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
													<div
														className="font-normal text-gray-500 truncate"
														style={{ fontFamily: "Poppins, sans-serif" }}
													>
														{member.username}
													</div>
												</div>
											</th>

											<td
												className="px-6 py-4 text-center"
												style={{ fontFamily: "Poppins, sans-serif" }}
											>
												{new Date(member.JoinedAt).toLocaleString("de")}
											</td>

											<td
												className="px-6 py-4 hidden lg:table-cell text-center"
												style={{
													fontFamily: "Poppins, sans-serif",
													color: member.isAdmin === 1 ? "green" : "red",
												}}
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

					<div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
						{pageNo !== 1 ? (
							<span
								className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
								onClick={() => setPageNo(pageNo - 1)}
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{"<"}{" "}
							</span>
						) : (
							<span />
						)}
						<span
							className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("page")} {pageNo}
						</span>

						{members.length >= 9 && (
							<span
								className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-medium uppercase leading-normal text-neutral-50 transition duration-150 ease-in-out focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
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
