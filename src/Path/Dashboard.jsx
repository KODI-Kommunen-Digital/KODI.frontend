import React, { useState, useEffect, Fragment, useCallback } from "react";
import SideBar from "../Components/SideBar";
import { getUserListings, getProfile } from "../Services/usersApi";
import {
	getListings,
	updateListingsData,
	deleteListing,
} from "../Services/listingsApi";
import { useNavigate } from "react-router-dom";
import { categoryById } from "../Constants/categories";
import { status, statusByName } from "../Constants/status";
import { useTranslation } from "react-i18next";
import LISTINGSIMAGE from "../assets/ListingsImage.jpeg";
import { Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Dashboard = () => {
	window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [listings, setListings] = useState([]);
	const [, setUserRole] = useState(3);
	const [viewAllListings, setViewAllListings] = useState(null);
	const [pageNo, setPageNo] = useState(1);
	const [selectedStatus, setSelectedStatus] = useState(null);

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	useEffect(() => {
		const accessToken =
			window.localStorage.getItem("accessToken") ||
			window.sessionStorage.getItem("accessToken");
		const refreshToken =
			window.localStorage.getItem("refreshToken") ||
			window.sessionStorage.getItem("refreshToken");
		if (!accessToken && !refreshToken) {
			window.location.href = "/login";
		}
		getProfile().then((response) => {
			setUserRole(response.data.data.roleId);
		});
		if (window.location.pathname === "/Dashboard") {
			setViewAllListings(false);
		} else {
			setViewAllListings(true);
		}
		document.title = "Dashboard";

		if (viewAllListings === true) {
			getListings({
				statusId: selectedStatus,
				pageNo,
			}).then((response) => {
				setListings(response.data.data);
			});
		}

		if (viewAllListings === false) {
			getUserListings({
				statusId: selectedStatus,
				pageNo,
			}).then((response) => {
				setListings(response.data.data);
			});
		}
	}, [window.location.pathname]);

	const fetchListings = useCallback(() => {
		if (viewAllListings === true) {
			getListings({
				statusId: selectedStatus,
				pageNo,
			}).then((response) => {
				setListings(response.data.data);
			});
		}
		if (viewAllListings === false) {
			getUserListings({
				statusId: selectedStatus,
				pageNo,
			}).then((response) => {
				setListings(response.data.data);
			});
		}
	}, [selectedStatus, viewAllListings, pageNo]);

	useEffect(() => {
		if (pageNo === 1) {
			fetchListings();
		} else {
			fetchListings();
		}
	}, [fetchListings, pageNo]);

	function getStatusClass(statusId) {
		if (status[statusId] === "Active") {
			return "bg-green-400";
		}
		if (status[statusId] === "Inactive") {
			return "bg-red-400";
		}
		if (status[statusId] === "Pending") {
			return "bg-yellow-400";
		}
	}

	function handleChangeInStatus(newStatusId, listing) {
		updateListingsData(listing.cityId, { statusId: newStatusId }, listing.id)
			.then((res) => {
				const tempListings = listings;
				tempListings[tempListings.indexOf(listing)].statusId = newStatusId;
				setListings([...tempListings]);
			})
			.catch((error) => console.log(error));
	}

	// Navigate to Edit Listings page Starts
	function goToEditListingsPage(listing) {
		navigateTo(
			`/UploadListings?listingId=${listing.id}&cityId=${listing.cityId}`
		);
	}

	const [showConfirmationModal, setShowConfirmationModal] = useState({
		visible: false,
		listing: null,
		onConfirm: () => {},
		onCancel: () => {},
	});

	const fetchUpdatedListings = useCallback(() => {
		fetchListings();
	}, [fetchListings]);

	function handleDelete(listing) {
		deleteListing(listing.cityId, listing.id)
			.then((res) => {
				setListings(
					listings.filter(
						(l) => l.cityId !== listing.cityId || l.id !== listing.id
					)
				);
				setShowConfirmationModal({ visible: false });

				fetchUpdatedListings();
				window.location.reload();
			})
			.catch((error) => console.log(error));
	}

	function deleteListingOnClick(listing) {
		setShowConfirmationModal({
			visible: true,
			listing,
			onConfirm: () => handleDelete(listing),
			onCancel: () => setShowConfirmationModal({ visible: false }),
		});
	}

	function goToEventDetailsPage(listing) {
		navigateTo(
			`/HomePage/EventDetails?listingId=${listing.id}&cityId=${listing.cityId}`
		);
	}

	// Navigate to Edit Listings page Starts

	return (
		<section className="bg-slate-600 body-font relative">
			<SideBar />

			<div className="container px-0 sm:px-0 py-0 w-full fixed top-0 z-10 lg:px-5 lg:w-auto lg:relative">
				<Popover className="relative bg-black mr-0 ml-0 px-10 lg:rounded-lg h-16">
					<div className="w-full">
						<div className="w-full h-full flex items-center lg:py-2 py-5 justify-end xl:justify-center lg:justify-center border-gray-100 md:space-x-10">
							<div className="hidden lg:block">
								<div className="w-full h-full flex items-center justify-end xl:justify-center lg:justify-center md:justify-end sm:justify-end border-gray-100 md:space-x-10">
									<div
										className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
										onClick={() => setSelectedStatus(null)}
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("allListings")}
									</div>
									<div
										className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
										onClick={() => setSelectedStatus(statusByName.Active)}
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("active")}
									</div>
									<div
										className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
										onClick={() => setSelectedStatus(statusByName.Pending)}
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("pending")}
									</div>
									<div
										className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
										onClick={() => setSelectedStatus(statusByName.Inactive)}
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("inactive")}
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
													onClick={() => setSelectedStatus(null)}
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{t("allListings")}
												</div>
												<div
													className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
													onClick={() => setSelectedStatus(statusByName.Active)}
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{t("active")}
												</div>
												<div
													className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
													onClick={() =>
														setSelectedStatus(statusByName.Pending)
													}
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{t("pending")}
												</div>
												<div
													className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
													onClick={() =>
														setSelectedStatus(statusByName.Inactive)
													}
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{t("inactive")}
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
											width: "20%",
										}}
									>
										{t("listings")}
									</th>
									<th
										scope="col"
										className="px-6 sm:px-3 py-3 hidden lg:table-cell text-center"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("category")}
									</th>
									<th
										scope="col"
										className="px-6 py-3 hidden lg:table-cell text-center"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("date_of_creation")}
									</th>
									<th
										scope="col"
										className="px-6 py-3 text-center"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("action")}
									</th>
									{viewAllListings && (
										<th
											scope="col"
											className="px-6 py-3 text-center"
											style={{ fontFamily: "Poppins, sans-serif" }}
										>
											{t("username")}
										</th>
									)}
									<th
										scope="col"
										className="px-6 py-3 text-center"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("status")}
									</th>
								</tr>
							</thead>
							<tbody>
								{listings.map((listing, index) => {
									return (
										<tr
											key={index}
											className="bg-white border-b dark:bg-white dark:border-white hover:bg-gray-50 dark:hover:bg-gray-50"
										>
											<th
												scope="row"
												className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
												onClick={() => goToEventDetailsPage(listing)}
											>
												<img
													className="w-10 h-10 rounded-full hidden sm:table-cell"
													src={
														listing.logo
															? process.env.REACT_APP_BUCKET_HOST + listing.logo
															: LISTINGSIMAGE
													}
													alt="avatar"
												/>
												<div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
													<div
														className="font-normal text-gray-500 truncate"
														style={{ fontFamily: "Poppins, sans-serif" }}
													>
														{listing.title}
													</div>
												</div>
											</th>

											<td
												className="px-6 py-4 hidden lg:table-cell text-center"
												style={{ fontFamily: "Poppins, sans-serif" }}
											>
												{categoryById[listing.categoryId]}
											</td>
											<td
												className="px-6 py-4 hidden lg:table-cell text-center"
												style={{ fontFamily: "Poppins, sans-serif" }}
											>
												{new Date(listing.createdAt).toLocaleString("de")}
											</td>
											<td className="px-6 py-4 text-center">
												<a
													className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer pr-2"
													onClick={() => goToEditListingsPage(listing)}
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{t("edit")}
												</a>
												<a
													className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer text-center"
													onClick={() => deleteListingOnClick(listing)}
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
											{viewAllListings && (
												<td className="px-6 py-4 text-center">
													<a
														className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
														style={{ fontFamily: "Poppins, sans-serif" }}
													>
														{listing.username}
													</a>
												</td>
											)}
											<td className="px-6 py-4">
												<div className="flex items-center justify-center">
													<div
														className={`h-2.5 w-2.5 rounded-full ${getStatusClass(
															listing.statusId
														)} mr-2`}
													></div>
													{viewAllListings ? (
														<select
															className="border font-sans border-gray-300 text-gray-500 sm:text-sm rounded-xl p-2.5"
															onChange={(e) =>
																handleChangeInStatus(e.target.value, listing)
															}
															value={listing.statusId}
															style={{ fontFamily: "Poppins, sans-serif" }}
														>
															{Object.keys(status).map((state, index) => {
																return (
																	<>
																		<option
																			className="p-0"
																			key={index}
																			value={state}
																		>
																			{t(status[state].toLowerCase())}
																		</option>
																	</>
																);
															})}
														</select>
													) : (
														<h1 style={{ fontFamily: "Poppins, sans-serif" }}>
															{t(status[listing.statusId].toLowerCase())}
														</h1>
													)}
												</div>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
					<div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
						{pageNo !== 1 ? (
							<span
								className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
								onClick={() => setPageNo(pageNo - 1)}
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{"<"}{" "}
							</span>
						) : (
							<span />
						)}
						<span
							className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("page")} {pageNo}
						</span>

						{listings.length >= 9 && (
							<span
								className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
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

export default Dashboard;
