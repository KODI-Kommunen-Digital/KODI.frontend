import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getListings, getListingsById } from "../../Services/listingsApi";
import { getProfile } from "../../Services/usersApi";
import Footer from "../../Components/Footer";
import LISTINGSIMAGE from "../../assets/ListingsImage.jpeg";
import UserProfile from "../../Components/UserProfile";
import { categoryById } from "../../Constants/categories";
import { source } from "../../Constants/source";
import { statusByName } from "../../Constants/status";
import PropTypes from "prop-types";
import ListingsCard from "../../Components/ListingsCard";
import LoadingPage from "../../Components/LoadingPage";
import {
	getFavorites,
	postFavoriteListingsData,
	deleteListingsById,
} from "../../Services/favoritesApi";
import LoadingPage from "../../Components/LoadingPage";

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

const EventDetails = () => {
	window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [listingId, setListingId] = useState(0);
	const [description, setDescription] = useState("");
	const [createdAt, setCreatedAt] = useState("");
	const [title, setTitle] = useState("");
	const [user, setUser] = useState();
	const [, setSuccessMessage] = useState("");
	const [, setErrorMessage] = useState("");
	const [listings, setListings] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	const [input, setInput] = useState({
		categoryId: 0,
		subcategoryId: 0,
		statusId: "pending",
		userId: 2,
		title: "",
		place: "",
		phone: "",
		email: "",
		description: "",
		logo: null,
		startDate: "",
		endDate: "",
		originalPrice: "",
		villagedropdown: "",
		zipCode: "",
		discountedPrice: "",
	});

	const [favoriteId, setFavoriteId] = useState(0);
	const [cityId, setCityId] = useState(0);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const pdfLoadingTimeout = setTimeout(() => {
			setIsLoading(false);
		}, 2000);
		const params = { statusId: 1 };
		const cityId = searchParams.get("cityId");
		setCityId(cityId);
		const listingId = searchParams.get("listingId");
		if (listingId && cityId) {
			const accessToken =
				window.localStorage.getItem("accessToken") ||
				window.sessionStorage.getItem("accessToken");
			const refreshToken =
				window.localStorage.getItem("refreshToken") ||
				window.sessionStorage.getItem("refreshToken");
			if (accessToken || refreshToken) {
				setIsLoggedIn(true);
			}
			getListingsById(cityId, listingId, params)
				.then((listingsResponse) => {
					if (listingsResponse.data.data.sourceId !== source.User) {
						window.location.replace(listingsResponse.data.data.website)
					} else {
						setInput(listingsResponse.data.data);
						const cityUserId = listingsResponse.data.data.userId;
						getProfile(cityUserId, { cityId, cityUser: true }).then((res) => {
							setUser(res.data.data);
							if (isLoggedIn) {
								getFavorites().then((response) => {
									const favorite = response.data.data.find(
										(f) =>
											f.listingId === parseInt(listingId) &&
											f.cityId === parseInt(cityId)
									);
									if (favorite) {
										setFavoriteId(favorite.id);
									} else {
										setFavoriteId(0);
									}
									setIsLoading(false)
								});
							} else {
								setIsLoading(false)
							}
						});
						setSelectedCategoryId(listingsResponse.data.data.categoryId);
						setListingId(listingsResponse.data.data.id);
						setDescription(listingsResponse.data.data.description);
						setTitle(listingsResponse.data.data.title);
						setCreatedAt(
							new Intl.DateTimeFormat("de-DE").format(
								Date.parse(listingsResponse.data.data.createdAt)
							)
						);
					}
				})
				.catch((error) => {
					console.error("Error fetching listing:", error);
					navigateTo("/Error");
				});
		}
		return () => clearTimeout(pdfLoadingTimeout);
	}, [t, cityId, window.location.href, isLoggedIn]);

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	const [selectedCategoryId, setSelectedCategoryId] = useState(0);

	useEffect(() => {
		if (selectedCategoryId) {
			getListings({ categoryId: selectedCategoryId, statusId: 1 }).then(
				(response) => {
					const filteredListings = response.data.data.filter(
						(listing) => listing.id !== listingId
					);
					setListings(filteredListings);
				}
			);
		}
	}, [selectedCategoryId, listingId]);

	const [handleClassName, setHandleClassName] = useState(
		"rounded-md bg-white border border-gray-900 text-gray-900 py-2 px-4 text-sm cursor-pointer"
	);
	const handleFavorite = async (event) => {
		try {
			if (isLoggedIn) {
				const postData = {
					cityId,
					listingId,
				};

				if (favoriteId !== 0) {
					await deleteListingsById(favoriteId);
					setFavoriteId(0);
					setSuccessMessage(t("list removed from the favorites"));
					setHandleClassName(
						"rounded-md bg-white border border-gray-900 text-gray-900 py-2 px-4 text-sm cursor-pointer"
					);
				} else {
					postData.cityId
						? postFavoriteListingsData(postData)
							.then((response) => {
								setFavoriteId(response.data.id);
								setSuccessMessage(t("List added to the favorites"));
								setHandleClassName(
									"rounded-md bg-white border border-gray-900 text-gray-900 py-2 px-4 text-sm cursor-pointer"
								);
							})
							.catch((err) => console.log("Error", err))
						: console.log("Error");
				}
			} else {
				window.sessionStorage.setItem("redirectTo", "/Favorite");
				navigateTo("/login");
			}
		} catch (error) {
			setErrorMessage(t("Error", error));
		}
	};

	const location = useLocation();
	const [terminalView, setTerminalView] = useState(false);
	useEffect(() => {
		document.title = "Event Details";
		const searchParams = new URLSearchParams(location.search);
		const terminalViewParam = searchParams.get("terminalView");
		setTerminalView(terminalViewParam === "true")
	}, []);


	return (
		<section className="text-gray-600 bg-white body-font">
			{
				isLoading ?
					<LoadingPage /> :
					<div>
						<HomePageNavBar />

						<div className="mx-auto w-full grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:grid-cols-3 lg:pt-24 lg:pb-4">
							<div className="grid grid-cols-1 gap-4 col-span-2">
								<div className="lg:w-full md:w-full h-64">
									<div className="md:grid md:gap-6 bg-white rounded-lg p-8 flex flex-col shadow-xl w-full">
										<div className="mt-5 md:col-span-2 md:mt-0">
											<form method="POST">
												<div className="flex flex-col sm:flex-row sm:items-center text-start justify-between">
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
													<div className={`flex items-center ${terminalView ? "hidden" : "visible"}`}>
														<button
															type="button"
															className={handleClassName}
															onClick={() => handleFavorite()}
														>
															<span
																style={{
																	fontFamily: "Poppins, sans-serif",
																}}
															>
																{favoriteId !== 0 ? t("unfavorite") : t("favourites")}
															</span>
														</button>
													</div>
												</div>

												<div className="flex items-center gap-2 mt-6">
													<svg
														xmlns="http://www.w3.org/2000/svg"
														height="1em"
														viewBox="0 0 448 512"
														fill="#4299e1"
													>
														<path d="M152 24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H64C28.7 64 0 92.7 0 128v16 48V448c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192 144 128c0-35.3-28.7-64-64-64H344V24c0-13.3-10.7-24-24-24s-24 10.7-24 24V64H152V24zM48 192h80v56H48V192zm0 104h80v64H48V296zm128 0h96v64H176V296zm144 0h80v64H320V296zm80-48H320V192h80v56zm0 160v40c0 8.8-7.2 16-16 16H320V408h80zm-128 0v56H176V408h96zm-144 0v56H64c-8.8 0-16-7.2-16-16V408h80zM272 248H176V192h96v56z" />
													</svg>
													<p
														className="leading-relaxed text-base text-blue-400"
														style={{
															fontFamily: "Poppins, sans-serif",
														}}
													>
														{t("uploaded_on")}
														{createdAt}
													</p>
												</div>

												<div className="flex flex-wrap gap-1 justify-between mt-6">
													<div>
														<p
															className="text-start font-bold"
															style={{
																fontFamily: "Poppins, sans-serif",
															}}
														>
															{t(categoryById[input.categoryId])}
														</p>
													</div>

													{input.id && input.categoryId === 3 ? (
														<p
															className="leading-relaxed text-base dark:text-gray-900 font-bold"
															style={{
																fontFamily: "Poppins, sans-serif",
															}}
														>
															{new Date(
																input.startDate.slice(0, 10)
															).toLocaleDateString("de-DE") +
																" - to - " +
																new Date(
																	input.endDate.slice(0, 10)
																).toLocaleDateString("de-DE")}
														</p>
													) : (
														<p
															className="leading-relaxed text-base"
															style={{
																fontFamily: "Poppins, sans-serif",
															}}
														></p>
													)}
												</div>
											</form>
										</div>
									</div>
								</div>
								<div className="container-fluid lg:w-full md:w-full">
									<div className="mr-0 ml-0 mt-20 md:mt-2 lg:mt-2 md:grid md:grid-cols-1">
										<style>
											{`
								@media (max-width: 280px) {
									.galaxy-fold {
										margin-top: 6rem; /* Adjust the margin value as needed */
									}
								}
							`}
										</style>
										<div className="h-full overflow-hidden px-0 py-0 shadow-xl galaxy-fold">
											<div className="relative h-full">
												<img
													alt="listing"
													className="object-cover object-center h-full w-full"
													src={
														input.sourceId === source.User ?
															(input.logo
																? process.env.REACT_APP_BUCKET_HOST +
																input.logo
																: LISTINGSIMAGE)
															: input.logo
													}
												/>
											</div>
										</div>
									</div>
								</div>

								<div className="overflow-hidden sm:p-0 mt-[5rem] px-0 py-0">
									<h1
										className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("description")}
									</h1>
									<Description content={description} />
								</div>
							</div>
							<UserProfile user={user} />
						</div>

						<div className="mx-auto grid max-w-2xl  gap-y-1 gap-x-8 pb-8 pt-8 px-4 sm:px-6 sm:py-10 lg:max-w-7xl">
							<h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900">
								{t("similarItems")}
							</h1>
							{listings && listings.length > 0 ? (
								<div className="bg-white p-0 mt-10 mb-10 flex flex-wrap gap-10 justify-center">
									<div className="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
										{listings &&
											listings
												.filter((listing) => listing.statusId === statusByName.Active)
												.map((listing, index) => (
													<ListingsCard listing={listing} terminalView={terminalView} key={index} />

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
											className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-blue-400"
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
					</div>
			}
		</section>
	);
};

export default EventDetails;
