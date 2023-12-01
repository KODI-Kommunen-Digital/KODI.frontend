import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useTranslation } from "react-i18next";
import LoadingPage from "../../Components/LoadingPage";
import {
	getAllForums, getUserForumsMembershipForAllForums, createMemberRequest, cancelMemberRequest
} from "../../Services/forumsApi";
import { getCities } from "../../Services/cities";
import Footer from "../../Components/Footer";
import { statusByName } from '../../Constants/forumStatus';
import { useAuth } from '../../AuthContext';

const AllForums = () => {
	window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [cityId, setCityId] = useState(0);
	const [cities, setCities] = useState([]);
	const [forums, setForums] = useState([]);
	const [memberStatus, setMembershipStatus] = useState({});
	const [pageNo, setPageNo] = useState(1);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigate = useNavigate();
	const [requestId, setRequestId] = useState(0);
	const { isAuthenticated } = useAuth();
	const [isLoading, setIsLoading] = useState(true);


	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		if (isAuthenticated()) {
			setIsLoggedIn(true);
		}
		getCities({ hasForum: true }).then((citiesResponse) => {
			setCities(citiesResponse.data.data);
			const pageNoParam = parseInt(urlParams.get("pageNo"));
			if (pageNoParam) setPageNo(pageNoParam);
			const cityIdParam = urlParams.get("cityId");
			if (cityIdParam) setCityId(cityIdParam);
		});
	}, [isAuthenticated]);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const params = { pageNo, pageSize: 12 };
		setIsLoading(true);

		if (parseInt(cityId)) {
			params.cityId = cityId;
		} else {
			urlParams.delete("cityId");
		}
		if (pageNo > 1) {
			params.pageNo = pageNo;
			urlParams.set("pageNo", pageNo);
		} else {
			urlParams.delete("pageNo");
		}


		if (cityId) {
			const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
			window.history.replaceState({}, "", newUrl);
			const fetchData = async () => {
				try {
					const response = await getAllForums(cityId, { hasForum: true });
					const forums = response.data.data;
					setForums(forums);

					const forumIds = forums.map((forum) => forum.id).join(",");

					if (forumIds) {
						const membershipResponse = await getUserForumsMembershipForAllForums(cityId, { forumIds });
						const membershipResponseData = membershipResponse.data.data;
						const membershipStatus = {};
						membershipResponseData.forEach((memberresponse) => {
							membershipStatus[memberresponse.forumId] = memberresponse.statusId;
							setRequestId(memberresponse.requestId);
						});
						setMembershipStatus(membershipStatus);
						console.log(membershipResponseData)
					}


				} catch (error) {
					console.error("Error fetching forums:", error);

				} finally {
					setIsLoading(false);
				}
			};

			const fetchDataWithDelay = () => {
				setTimeout(() => {
					fetchData();
				}, 1000);
			};

			fetchDataWithDelay();
		} else {
			setForums([]);
			setIsLoading(false);
		}
	}, [cityId, pageNo]);

	const navigateTo = (path) => {
		navigate(path);
	};

	const handleClick = async (cityId, forum) => {
		const path = `/Forum?cityId=${cityId}&forumId=${forum.id}`;
		if (isLoggedIn) {
			navigateTo(path);
		} else {
			sessionStorage.setItem("path", path);
			navigateTo("/login");
		}
	};
	const handleChange = (e) => {
		const selectedCityId = e.target.value;
		const urlParams = new URLSearchParams(window.location.search);
		const selectedCity = cities.find(
			(city) => city.id.toString() === selectedCityId
		);
		if (selectedCity) {
			localStorage.setItem("selectedCity", selectedCity.name);
			setCityId(parseInt(selectedCityId));
			urlParams.set("cityId", selectedCityId);
		} else {
			urlParams.delete("cityId");
			setCityId(0);
		}
		window.history.replaceState({}, "", `?${urlParams.toString()}`);
	};

	const handleLeaveRequest = async (forumId) => {
		try {
			await cancelMemberRequest(cityId, forumId, requestId);
			setRequestId(0);
		} catch (error) {
			console.error("Error sending follow request:", error);
		}
	};

	const handleFollowRequest = async (forumsId) => {
		try {
			const response = await createMemberRequest(parseInt(cityId), forumsId);
			console.log(response)
		} catch (error) {
			console.error("Error sending follow request:", error);
		}
	};

	return (
		<section className="text-gray-600 bg-white body-font">
			<HomePageNavBar />
			<div>
				<div className="container-fluid py-0 mr-0 ml-0 mt-20 w-full flex flex-col">
					<div className="w-full mr-0 ml-0">
						<div className="h-64 overflow-hidden px-0 py-1">
							<div className="relative h-64">
								<img
									alt="ecommerce"
									className="object-cover object-center h-full w-full"
									src={process.env.REACT_APP_BUCKET_HOST + "admin/Homepage.jpg"}
								/>
								<div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
									<h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
										{t("forums")}
									</h1>
									<div>
										<div className="relative w-full px-4 mb-4 md:w-80">
											<select
												id="city"
												name="city"
												autoComplete="city-name"
												onChange={(e) => handleChange(e)}
												value={cityId || 0}
												className="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
												style={{
													fontFamily: "Poppins, sans-serif",
												}}
											>
												<option className="font-sans" value={0} key={0}>
													{t("select")}
												</option>
												{cities.map((city) => (
													<option
														className="font-sans"
														value={city.id}
														key={city.id}
													>
														{city.name}
													</option>
												))}
											</select>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className="mt-5 mb-20 customproview py-6">
					<style>
						{`
							@media (min-height: 1293px) {
							.customproview {
								margin-bottom: 10rem;
							}
							}
						`}
					</style>
					{isLoading ? (
						<LoadingPage />
					) : (
						<>
							{cityId !== 0 ?
								<div>
									<div className="text-center justify-between lg:px-4 md:px-5 sm:px-0 px-4 md:py-6 py-4 bg-white">
										<a
											onClick={() => {
												localStorage.setItem(
													"selectedItem",
													"Choose one category"
												);
												isLoggedIn
													? navigateTo("/CreateGroup")
													: navigateTo("/login");
											}}
											className="mx-4 md:mx-8 mb-2 md:mb-0 w-20 md:w-60 font-sans text-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-400 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
										>
											{t("createGroup")}
										</a>
									</div>
									{forums && forums.length > 0 ? (
										<div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
											<div className="relative place-items-center bg-white mt-4 mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-10 justify-start">
												{forums &&
													forums.map((forum) => (
														<div
															key={forum.id}
															className="w-full h-96 shadow-lg rounded-lg cursor-pointer"
														>
															<a className="block relative h-64 rounded overflow-hidden"
																onClick={() => handleClick(cityId, forum)}>
																{forum.isPrivate ? (
																	<>
																		<img
																			alt="forumImage"
																			className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000"
																			src={
																				forum.image
																					? process.env.REACT_APP_BUCKET_HOST +
																					forum.image
																					: process.env.REACT_APP_BUCKET_HOST +
																					"admin/DefaultForum.jpeg"
																			}
																		/>
																	</>
																) : (
																	<>
																		<img
																			alt="forumImage"
																			className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000"
																			src={
																				forum.image
																					? process.env.REACT_APP_BUCKET_HOST +
																					forum.image
																					: process.env.REACT_APP_BUCKET_HOST +
																					"admin/DefaultForum.jpeg"
																			}
																		/>
																	</>
																)}
															</a>
															<div className="mt-5 px-2">
																<div
																	className="flex justify-between items-center"
																	style={{ fontFamily: "Poppins, sans-serif" }}
																>
																	<h2 className="text-gray-900 title-font text-md font-bold font-sans truncate">
																		{forum.forumName.length > 18
																			? forum.forumName.substring(0, 18) + "..."
																			: forum.forumName}
																	</h2>

																	{forum.isPrivate === 0 ? (
																		<h2 className="text-blue-400 title-font text-md font-bold font-sans truncate">
																			{t("public")}
																		</h2>
																	) : (
																		<h2 className="text-blue-400 title-font text-md font-bold font-sans truncate">
																			{t("private")}
																		</h2>
																	)}
																</div>
																<div className="my-4 bg-gray-200 h-[1px]"></div>

																{forum.isPrivate && memberStatus[forum.id] === statusByName.Pending ? (
																	<div className="text-center">
																		<a
																			onClick={async () => {
																				await handleLeaveRequest(forum.id);
																				window.location.reload();
																			}}
																			style={{ fontFamily: "Poppins, sans-serif" }}
																			className="mx-4 my-4 md:mx-8 mb-2 md:mb-0 w-20 md:w-60 font-sans text-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-red-700 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
																		>
																			{t("cancelRequest")}
																		</a>
																	</div>
																) : memberStatus[forum.id] === statusByName.Accepted ? (
																	<h2
																		onClick={() => handleClick(cityId, forum)}
																		style={{ fontFamily: "Poppins, sans-serif" }}
																		className="text-red-700 my-4 p-2 title-font text-lg font-semibold text-center font-sans truncate"
																	>
																		{t("viewGroup")}
																	</h2>
																) : (
																	<div className="text-center my-4 p-2">
																		<a
																			onClick={async () => {
																				await handleFollowRequest(forum.id);
																				window.location.reload();
																			}}
																			style={{ fontFamily: "Poppins, sans-serif" }}
																			className="mx-4 md:mx-8 mb-2 md:mb-0 w-20 md:w-60 font-sans text-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-red-700 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
																		>
																			{t("follow")}
																		</a>
																	</div>
																)}

															</div>
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
													{t("currently_no_forums")}
												</h1>
											</div>
											<div className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
												<span
													className="font-sans text-black"
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{t("to_upload_new_forum")}
												</span>
												<a
													className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-blue-400"
													style={{ fontFamily: "Poppins, sans-serif" }}
													onClick={() => {
														localStorage.setItem(
															"selectedItem",
															"Choose one category"
														);
														isLoggedIn
															? navigateTo("/CreateGroup")
															: navigateTo("/login");
													}}
												>
													{t("click_here")}
												</a>
											</div>
										</div>
									)}
								</div>
								:
								<div>
									<div className="flex items-center justify-center">
										<h1
											className=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black"
											style={{ fontFamily: "Poppins, sans-serif" }}
										>
											{t("pleaseSelectCity")}
										</h1>
									</div>
									<div className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
										<span
											className="font-sans text-black"
											style={{ fontFamily: "Poppins, sans-serif" }}
										>
											{t("to_create_new_forum")}
										</span>
										<a
											className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-blue-400"
											style={{ fontFamily: "Poppins, sans-serif" }}
											onClick={() => {
												isLoggedIn
													? navigateTo("/CreateGroup")
													: navigateTo("/login");
											}}
										>
											{t("click_here")}
										</a>
									</div>
								</div>
							}
						</>
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
						{forums.length >= 9 && (
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
			</div>
			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default AllForums;