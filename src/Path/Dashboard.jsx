import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import {
	getUserListings,
	getProfile
} from "../Services/usersApi";
import {
	getAllListings,
	updateListingsData,
	deleteListing
} from "../Services/listingsApi";
import { useNavigate } from "react-router-dom";
import { sortOldest } from "../Services/helper";
import { categoryById } from "../Constants/categories";
import { status, statusByName } from "../Constants/status";
import { useTranslation } from "react-i18next";
import { Select } from "@chakra-ui/react";

import Error from "./Error"
const dashboardStyle = require("../Path/Dashboard.css");

const Dashboard = () => {
	const { t } = useTranslation();
	const [listings, setListings] = useState([]);
	const [userRole, setUserRole] = useState(3);
	const [viewAllListings, setViewAllListings] = useState(false);
	const [pageNo, setPageNo] = useState(1);
	const [selectedStatus, setSelectedStatus] = useState(null);
	useEffect(() => {
		getProfile().then((response) => {
			setUserRole(response.data.data.roleId);
		});
		fetchListings()
		document.title = "Dashboard";
	}, []);

	useEffect(() => {
		if (pageNo == 1)
			fetchListings()
		else 
			setPageNo(1)
		//When status/viewAllListings is changed, the page number is set to 1 and listings are fetched
	}, [selectedStatus, viewAllListings])
	
	useEffect(() => {
		fetchListings()
	}, [pageNo])

	let navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	function handleDashboardChange(event) {
		setListings({
			...listings,
			[event.target.name]: event.target.value,
		});
	}

	function fetchListings(status = null) {
        if (viewAllListings) {
            getUserListings({ statusId: status }).then((response) => {
                setListings([...sortOldest(response.data.data)]);
            });
        } else {
            getAllListings({ statusId: status }).then((response) => {
                setListings([...sortOldest(response.data.data)]);
            });
        }
    }

	function getStatusClass(statusId) {
		if (status[statusId] == "Active") {
			return "bg-green-400";
		}
		if (status[statusId] == "Inactive") {
			return "bg-red-400";
		}
		if (status[statusId] == "Pending") {
			return "bg-yellow-400";
		}
	}

	function handleChangeInStatus(newStatusId, listing) {
		updateListingsData(listing.cityId, { statusId: newStatusId }, listing.id).then((res) => {
			listing.statusId = newStatusId;
			setListings(listings)
		});
	}

	//Navigate to Edit Listings page Starts
	function goToEditListingsPage(listing) {		
		navigateTo(
			`/UploadListings?listingId=${listing.id}&cityId=${listing.cityId}`
		)

		// <BrowserRouter>
		// 	<Routes>
		// 			<Route path="*" element={<Error />} />
		// 	</Routes>
		// </BrowserRouter>

	}
	

	function deleteListingOnClick(listing) {
		deleteListing(listing.cityId, listing.id).then((res) => {
			setListings(listings.filter(l => l.cityId != listing.cityId || l.id != listing.id))
		})
	}

	function changePageOnClick(increment) {
		increment ? setPageNo(pageNo + 1) : setPageNo(pageNo - 1)
	}
	
	function goToEventDetailsPage(listing) {
		navigateTo(
			`/HomePage/EventDetails?listingId=${listing.id}&cityId=${listing.cityId}`
		);
	}

	//Navigate to Edit Listings page Starts

	return (
		<section className="bg-slate-600 body-font relative">
			<SideBar
				handleGetAllListings={() => {
					setViewAllListings(true);
				}}
				handleGetUserListings={() => {
					setViewAllListings(false);
				}}
			/>
			<div class="container px-0 sm:px-0 py-0 w-full fixed lg:top-5 z-10 lg:px-5 lg:w-auto lg:relative">
				<div className="relative bg-black mr-0 ml-0 px-10 lg:rounded-lg h-16">
					<div className=" w-full h-full flex items-center justify-end xl:justify-center lg:justify-center md:justify-end sm:justify-end border-gray-100 md:space-x-10">
							<div
								class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
								onClick={() => setSelectedStatus(null)}
							>
								{t("allListings")}
							</div>
							<div class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
								onClick={() => setSelectedStatus(statusByName.Active)}
							>
								{t("active")}
							</div>
							<div class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
								onClick={() => setSelectedStatus(statusByName.Pending)}
							>
								{t("pending")}
							</div>
							<div class="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
								onClick={() => setSelectedStatus(statusByName.Inactive)}
							>
								{t("inactive")}
							</div>
					</div>
				</div>
			</div>

			<html class="h-full bg-gray-100" />
			<body class="h-full" />

			<div class="container w-auto px-0 lg:px-5 py-2 bg-slate-600 h-screen">
				<div class="bg-white mt-10 p-0 space-y-10 overflow-x-auto">
					<table class="w-full text-sm text-left lg:mt-[2rem] mt-[2rem] text-gray-500 dark:text-gray-400 p-6 space-y-10 rounded-lg">
						<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-50 dark:text-gray-700">
							<tr>
								<th scope="col" class="px-6 sm:px-6 py-3">
									Listings
								</th>
								<th scope="col" class="px-6 sm:px-3 py-3 hidden lg:table-cell">
									Category
								</th>
								<th scope="col" class="px-6 py-3 hidden lg:table-cell">
									Date of Creation
								</th>
								<th scope="col" class="px-6 py-3">
									Action
								</th>
								{viewAllListings && (
									<th scope="col" class="px-6 py-3">
										UserName
									</th>
								)}
								<th scope="col" class="px-6 py-3 text-center">
									Status
								</th>
							</tr>
						</thead>
						<tbody>
							{listings.map((listing) => {
								return (
									<tr class="bg-white border-b dark:bg-white dark:border-white hover:bg-gray-50 dark:hover:bg-gray-50">
										<th
											scope="row"
											class="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
											onClick={() => goToEventDetailsPage(listing)}
										>
											<img
												class="w-10 h-10 rounded-full hidden sm:table-cell"
												src={listing.image}
												alt="avatar"
											/>
											<div class="pl-0 sm:pl-3">
												<div class="font-normal text-gray-500">
													{listing.title}
												</div>
											</div>
										</th>
										<td class="px-6 py-4 hidden lg:table-cell">
											{categoryById[listing.categoryId]}
										</td>
										<td class="px-6 py-4 hidden lg:table-cell">
											{new Date(listing.createdAt).toLocaleString("de")}
										</td>
										<td class="px-6 py-4">
											<a
												class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer pr-2"
												onClick={() => goToEditListingsPage(listing)}
											>
												Edit
											</a>
											<a
												class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer"
												onClick={() => deleteListingOnClick(listing)}
											>
												Delete
											</a>
										</td>
										{viewAllListings && (
											<td class="px-6 py-4">
												<a class="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer">
													{ listing.username }
												</a>
											</td>
										)}
										<td class="px-6 py-4">
											<div class="flex items-center">
												<div
													class={`h-2.5 w-2.5 rounded-full ${getStatusClass(
														listing.statusId
													)} mr-2`}
												></div>
												{viewAllListings ? (
													<Select
														onChange={(e) => handleChangeInStatus(e.target.value, listing)}
														value={listing.statusId}
													>
														{Object.keys(status).map((state) => {
															return (
																<>
																	<option className="p-0" value={state}>
																		{status[state]}
																	</option>
																</>
															);
														})}
													</Select>
												) : (
													<h1>{status[listing.statusId]}</h1>
												)}
											</div>
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			<div className="bottom-5 right-5 bg-black text-white p-3 my-5 rounded-lg float-right">
				{ (pageNo != 1) ? <span className="text-lg px-3 hover:bg-gray-800 cursor-pointer rounded-lg" onClick={() => changePageOnClick(false)}>{'<'} </span> : <span/>}
				<span className="text-lg px-3">Page { pageNo }</span>
				<span className="text-lg px-3 hover:bg-gray-800 cursor-pointer rounded-lg" onClick={() => changePageOnClick(true)}>{'>'}</span>
			</div>
			</div>
		</section>
	);
};

export default Dashboard;
