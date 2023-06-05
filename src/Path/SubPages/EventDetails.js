import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { getDashboarddata } from "../../Services/dashboarddata";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getListings } from "../../Services/listingsApi";
import { getProfile, getProfileByIds } from "../../Services/usersApi";
import { getListingsById } from "../../Services/listingsApi";
import { getVillages } from "../../Services/villages";
import Footer from "../../Components/Footer";
import LISTINGSIMAGE from "../../assets/ListingsImage.jpeg";
import PROFILEIMAGE from "../../assets/ProfilePicture.png";
import { useLocation } from 'react-router-dom';
import {
	getFavorites,
	postFavoriteListingsData,
	deleteListingsById,
} from "../../Services/favoritesApi";

	const Description = ({ content }) => {
		return (
		<p
			className="leading-relaxed text-md font-medium my-6 text-gray-900 dark:text-gray-900"
			dangerouslySetInnerHTML={{ __html: content }}
		></p>
		);
	};

const EventDetails = () => {
	window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [listingId, setListingId] = useState(0);
	const [newListing, setNewListing] = useState(true);
	const [description, setDescription] = useState("");
	const [createdAt, setCreatedAt] = useState("");
	const [title, setTitle] = useState("");
	const [userSocial, setUserSocial] = useState([]);
	const [user, setUser] = useState();
	const [imagePath, setImagePath] = useState("");
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [listings, setListings] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);


	const [input, setInput] = useState({
		categoryId: 0,
		subcategoryId: 0,
		statusId: "pending",
		sourceId: 1,
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
		var params = { statusId: 1 };
		var cityId = searchParams.get("cityId");
		setCityId(cityId);
		var listingId = searchParams.get("listingId");
		setListingId(listingId);
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
			setNewListing(false);
			getVillages(cityId).then((response) => setVillages(response.data.data));
			getListingsById(cityId, listingId,params).then((listingsResponse) => {
				setInput(listingsResponse.data.data);
				var cityUserId = listingsResponse.data.data.userId;
				getProfile(cityUserId, {cityId, cityUser: true}).then((res) => {
					setUser(res.data.data);
				});
				setSelectedCategoryId(listingsResponse.data.data.categoryId)
				setListingId(listingsResponse.data.data.id);
				setDescription(listingsResponse.data.data.description);
				setTitle(listingsResponse.data.data.title);
				setImagePath(listingsResponse.data.data.logo);
				if (isLoggedIn) {
					getFavorites().then((response) => {
						var favorite = response.data.data.filter(
							(f) => f.listingId == listingId
						)[0];
						if (favorite) {
							setFavoriteId(favorite.id);
							setFavButton(t("Unfavorite"));
						} else {
							setFavoriteId(0);
							setFavButton(t("Favorite"));
						}
					});
				}
				setCreatedAt(
					new Intl.DateTimeFormat("de-DE").format(
						Date.parse(listingsResponse.data.data.createdAt)
					)
				);
			});
		}
	}, [t, window.location.href,cityId ]);

	const [villages, setVillages] = useState([]);
	async function onCityChange(e) {
		const cityId = e.target.value;
		setCityId(cityId);
		setInput((prev) => ({
			...prev,
			villageId: 0,
		}));
		getVillages(cityId).then((response) => setVillages(response.data.data));
	}

	//populate the events titles starts
	const [categoriesdata, setCategoriesdata] = useState({
		categoriesListings: [],
	});
	useEffect(() => {
		document.title = "Event Details";
	}, []);

	const [dashboarddata, setDashboarddata] = useState({ listings: [] });
	useEffect(() => {
		getDashboarddata().then((response) => {
			setDashboarddata(response);
		});
	}, []);

	let navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	function handleCategoriesChange(event) {
		setCategoriesdata({
			...categoriesdata,
			[event.target.name]: event.target.value,
		});
	}

	const [content, setContent] = useState("A");

	const handleButtonClick = (value) => {
		setContent(value);
	};

	const [customerServiceDataload, setcustomerServiceDataload] = useState(false);

	const onCancel = () => {
		setcustomerServiceDataload(false);
		setSelectedLink("current");
	};

	const [selectedLink, setSelectedLink] = useState("current");

	function handleLocationSubmit(event) {
		event.preventDefault();
	}
	const [categoryId, setCategoryId] = useState();
	const [selectedCategoryId, setSelectedCategoryId] = useState(0);


	useEffect(() => {
		if (selectedCategoryId) {
		getListings({ categoryId: selectedCategoryId,statusId:1 }).then((response) => {
			const filteredListings = response.data.data.filter(
			(listing) => listing.id !== listingId
			);
			setListings(filteredListings);
		});
		}
	}, [selectedCategoryId, listingId]);


	const [selectedSortOption, setSelectedSortOption] = useState("");

	const [userName, setUserName] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [profilePic, setProfilePic] = useState("");

	useEffect(() => {
		if (user) {
			try {
				const socialMedia = user.socialMedia
					? JSON.parse(user.socialMedia)
					: {};
				setUserSocial(socialMedia);
				setUserName(user.userName);
				setFirstname(user.firstname);
				setLastname(user.lastname);
				setProfilePic(user.image);
			} catch (error) {
				console.error("Error parsing user.socialMedia:", error);
			}
		}
	}, [user]);

	const [handleClassName, setHandleClassName] = useState(
		"text-gray-900 mt-2 bg-white border border-gray-900 hover:text-cyan-500 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 text-center inline-flex items-center dark:focus:ring-gray-500 mb-2 mr-2 sm:mr-2"
	);
	const [favButton, setFavButton] = useState("Favorite");
	const handleFavorite = async (event) => {

		try {
			if (isLoggedIn) {
				var postData = {
					cityId: cityId,
					listingId: listingId,
				};

				if (favoriteId !== 0) {
					await deleteListingsById(favoriteId);
					setFavoriteId(0);
					setSuccessMessage(t("list removed from the favorites"));
					setHandleClassName(
						"text-white-900 mt-2 bg-cyan border border-cyan-900 hover:text-cyan-500 focus:ring-4 focus:outline-4 focus:ring-blue-100 font-medium rounded-lg text-sm px-2 py-1 text-center inline-flex items-center dark:focus:ring-cyan-500 mb-2 mr-2 sm:mr-2"
					);
					setFavButton(t("Unfavorite"));
				}
				else {
					postData.cityId
						? postFavoriteListingsData(postData)
							.then((response) => {
								setFavoriteId(response.data.id);
								setSuccessMessage(t("List added to the favorites"));
								setHandleClassName(
									"text-gray-900 mt-2 bg-white border border-gray-900 hover:text-cyan-500 focus:ring-4 focus:outline-none focus:ring-gray-100 font-medium rounded-lg text-sm px-2 py-1 text-center inline-flex items-center dark:focus:ring-gray-500 mb-2 mr-2 sm:mr-2"
								);
								setFavButton(t("Favorite"));
							})
							.catch((err) => console.log("Error", err))
						: console.log("Error");
				}
			}
			else {
				window.sessionStorage.setItem("redirectTo", "/Favorite");
				navigateTo("/login");
			}
		} catch (error) {
			setErrorMessage(t("Error", error));
		}
	};

	function goToViewProfilePage(listing) {
		navigateTo(`/users?id=${user.id}`);
	}

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const terminalViewParam = searchParams.get('terminalView');
	const favClass = terminalViewParam === 'true' ? 'hidden' : 'visible';
	const [showNavBar, setShowNavBar] = useState(true);
		useEffect(() => {
		if (terminalViewParam === 'true') {
			setShowNavBar(false);
		} else {
			setShowNavBar(true);
		}
		}, [terminalViewParam]);

	return (
		<section class="text-gray-600 bg-white body-font">
			<HomePageNavBar />

			<div class="mx-auto w-full grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:grid-cols-3 lg:pt-24 lg:pb-4">
				<div className="grid grid-cols-1 gap-4 col-span-2">
					<div class="lg:w-full md:w-full h-64">
						<div class="md:grid md:gap-6 bg-white rounded-lg p-8 flex flex-col shadow-xl w-full">
							<div class="mt-5 md:col-span-2 md:mt-0">
								<form method="POST">
									<div class="flex flex-col sm:flex-row sm:items-center text-start justify-between">
										<h1 class="text-gray-900 mb-4 text-2xl md:text-3xl mt-4 lg:text-3xl title-font text-start font-bold overflow-hidden">
										<span class="inline-block max-w-full break-words" style={{ fontFamily: 'Poppins, sans-serif' }}>
											{title}
										</span>
										</h1>
										<div class={`flex items-center ${favClass}`}>
											<button
												type="button"
												class={handleClassName}
												onClick={() => handleFavorite()}
											>
												<span class="ml-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
													{favoriteId !== 0 ? t("unfavorite") : t("favourites")}
												</span>
											</button>
										</div>
									</div>

									<div class="flex flex-wrap gap-1 justify-between mt-6">
										<div>
											{input.categoryId == 1 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("news")}</p>
											) : null}
											{input.categoryId == 2 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("roadTraffic")}</p>
											) : null}
											{input.categoryId == 3 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("events")}</p>
											) : null}
											{input.categoryId == 4 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("clubs")}</p>
											) : null}
											{input.categoryId == 5 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("regionalProducts")}</p>
											) : null}
											{input.categoryId == 6 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("offerSearch")}</p>
											) : null}
											{input.categoryId == 7 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("newCitizenInfo")}</p>
											) : null}
											{input.categoryId == 8 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("defectReport")}</p>
											) : null}
											{input.categoryId == 9 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("lostAndFound")}</p>
											) : null}
											{input.categoryId == 10 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("companyPortaits")}</p>
											) : null}
											{input.categoryId == 11 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>
													{t("carpoolingPublicTransport")}
												</p>
											) : null}
											{input.categoryId == 12 ? (
												<p className="text-start" style={{ fontFamily: 'Poppins, sans-serif' }}>{t("offers")}</p>
											) : null}
										</div>
										{input.id && input.categoryId == 3 ? (
											<p class="leading-relaxed text-base dark:text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
												{new Date(input.startDate.slice(0, 10)).toLocaleDateString('de-DE') +
												" - to - " +
												new Date(input.endDate.slice(0, 10)).toLocaleDateString('de-DE')}
											</p>
											):(
												<p class="leading-relaxed text-base dark:text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
												</p>
										)}
									</div>
								</form>
							</div>
						</div>
					</div>
					<div class="container-fluid lg:w-full md:w-full">
						<div class=" mr-0 ml-0 mt-4">
							<div class="h-96 overflow-hidden px-0 py-0 shadow-xl">
								<div class="relative h-96">
									<img
										alt="listing"
										class="object-cover object-center h-full w-full"
										src={
											input.logo
												? process.env.REACT_APP_BUCKET_HOST + input.logo
												: LISTINGSIMAGE
										}
									/>
								</div>
							</div>
						</div>
					</div>
					<div class="overflow-hidden sm:p-0 mt-[5rem] px-0 py-0">
						<h1 class="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900"  style={{ fontFamily: 'Poppins, sans-serif' }}>
							{t("description")}
						</h1>
						<Description content={description} />
					</div>
				</div>

				{userSocial && userSocial.length > 0  ? (
					<div class="w-full md:ml-[6rem] lg:ml-[0rem] ml-[1rem] h-full sm:h-96 bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-white shadow-xl dark:bg-white">
						<div>
							<div class="p-4 space-y-0 md:space-y-6 sm:p-4">
								<h1 class="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900"  style={{ fontFamily: 'Poppins, sans-serif' }}>
									{t("ownerInfo")}
								</h1>
							</div>
							<div class="my-4 bg-gray-200 h-[1px]"></div>

							<div class="items-center mx-2 py-2 px-2 my-2 gap-4 grid grid-cols-1 sm:grid-cols-2">
								<div class="flex flex-col justify-center items-start">
									<img
										class="rounded-full h-20 w-20"
										src={
											user?.image
												? process.env.REACT_APP_BUCKET_HOST + user?.image
												: PROFILEIMAGE
										}
										alt={user?.lastname}
									/>
								</div>
								<div class="flex-grow text-center sm:text-left mt-6 sm:mt-0">
									<h2 class="text-gray-900 text-lg title-font mb-2 font-bold dark:text-gray-900"  style={{ fontFamily: 'Poppins, sans-serif' }}>
										{firstname + " " + lastname}
									</h2>
									<p class="leading-relaxed text-base dark:text-gray-900"  style={{ fontFamily: 'Poppins, sans-serif' }}>
										{t("uploaded_on")}
										{createdAt}
									</p>
								</div>
							</div>

							<div class="bg-white mx-2 my-2 py-2 px-2 mt-4 mb-4 flex flex-wrap gap-1 justify-Start">
								{userSocial?.Facebook && (
									<div class="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
										<button
											type="button"
											data-te-ripple-init
											data-te-ripple-color="light"
											class="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-blue-500"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
											</svg>
										</button>
									</div>
								)}
								{userSocial?.Instagram && (
									<div class="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
										<button
											type="button"
											data-te-ripple-init
											data-te-ripple-color="light"
											class="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-pink-600"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
											</svg>
										</button>
									</div>
								)}
								{userSocial?.LinkedIn && (
									<div class="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
										<button
											type="button"
											data-te-ripple-init
											data-te-ripple-color="light"
											class="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-sky-600"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
											</svg>
										</button>
									</div>
								)}
								{userSocial?.Youtube && (
									<div class="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
										<button
											type="button"
											data-te-ripple-init
											data-te-ripple-color="light"
											class="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-red-600"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
											</svg>
										</button>
									</div>
								)}
								{userSocial?.Twitter && (
									<div class="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
										<button
											type="button"
											data-te-ripple-init
											data-te-ripple-color="light"
											class="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-blue-400"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-4 w-4"
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
											</svg>
										</button>
									</div>
								)}
							</div>

							<div class="flex justify-center my-4">
								<button
									onClick={() =>
										navigateTo(
											user ? `/ViewProfile?userId=${user.id}` : "/ViewProfile"
										)
									}
									type="submit"
									class="group relative flex w-72 md:w-96 lg:mx-4 sm:mx-0 font-bold justify-center rounded-md border border-transparent text-blue-800 bg-slate-300 py-2 px-4 text-sm shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
									style={{ fontFamily: 'Poppins, sans-serif' }}>
									<span class="absolute inset-y-0 left-0 flex items-center pl-3"></span>
									{t("viewProfile")}
								</button>
							</div>
						</div>

					</div>
				) : (
					<div class="w-full sm:h-72 md:h-80 h-[25rem] md:ml-[6rem] lg:ml-[0rem] ml-[1rem] bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-white shadow-xl dark:bg-white">
						<div>
							<div class="p-4 space-y-0 md:space-y-6 sm:p-4">
								<h1 class="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900"  style={{ fontFamily: 'Poppins, sans-serif' }}>
									{t("ownerInfo")}
								</h1>
							</div>
							<div class="my-4 bg-gray-200 h-[1px]"></div>

							<div class="items-center mx-2 py-2 px-2 my-2 gap-2 grid grid-cols-1 sm:grid-cols-2">
								<div class="flex justify-center sm:justify-start">
									<img
										class="rounded-full h-20 w-20"
										src={
											user?.image
												? process.env.REACT_APP_BUCKET_HOST + user?.image
												: PROFILEIMAGE
										}
										alt={user?.lastname}
									/>
								</div>
								<div class="flex-grow text-center sm:text-left mt-6 sm:mt-0">
									<h2 class="text-gray-900 text-lg title-font mb-2 font-bold dark:text-gray-900"  style={{ fontFamily: 'Poppins, sans-serif' }}>
										{firstname + " " + lastname}
									</h2>
									<p class="leading-relaxed text-base dark:text-gray-900"  style={{ fontFamily: 'Poppins, sans-serif' }}>
										{t("uploaded_at") + " " + createdAt}
									</p>
								</div>
							</div>

							<div class="flex justify-center lg:mt-7 md:mt-7 mt-7">
								<button
									onClick={() => {
										let url = `/ViewProfile?userId=${user.id}`;
										if (terminalViewParam === 'true') {
										url += '&terminalView=true';
										}
										navigateTo(url);
									}}
									type="submit"
									class="group relative flex w-48 sm:w-96 lg:mx-4 sm:mx-0 font-bold justify-center rounded-md border border-transparent text-blue-800 bg-slate-300 py-2 px-4 text-sm shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
									style={{ fontFamily: 'Poppins, sans-serif' }}>
									<span class="absolute inset-y-0 left-0 flex items-center pl-3"></span>
									{t("viewProfile")}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>

			<div class="mx-auto grid max-w-2xl  gap-y-1 gap-x-8 pb-8 pt-8 px-4 sm:px-6 sm:py-10 lg:max-w-7xl">
				<h1 class="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900">
					{t("similarItems")}
				</h1>
				{listings && listings.length > 0 ? (
					<div class="bg-white p-0 mt-10 mb-10 flex flex-wrap gap-10 justify-center">
						<div class="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
							{listings &&
								listings.map((listing) => (
									<div
										onClick={() => {
											let url = `/HomePage/EventDetails?listingId=${listing.id}&cityId=${listing.cityId}`;
											if (terminalViewParam === 'true') {
											url += '&terminalView=true';
											}
											navigateTo(url);
										}}
										class="lg:w-96 md:w-64 h-96 pb-20 w-full shadow-lg rounded-lg cursor-pointer"
									>
										<a class="block relative h-64 rounded overflow-hidden">
											<img
												alt="ecommerce"
												class="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
												src={
													listing.logo
														? process.env.REACT_APP_BUCKET_HOST + listing.logo
														: LISTINGSIMAGE
												}
											/>
										</a>
										<div class="mt-5 px-2">
													<h2 class="text-gray-900 title-font text-lg font-bold text-center font-sans truncate"  style={{ fontFamily: 'Poppins, sans-serif' }}>
														{listing.title}
													</h2>
												</div>
												<div className="my-4 bg-gray-200 h-[1px]"></div>
												{listing.id && listing.categoryId == 3 ? (
												<p class="text-gray-600 title-font text-sm font-semibold text-center font-sans"  style={{ fontFamily: 'Poppins, sans-serif' }}>
													{new Date(listing.startDate.slice(0, 10)).toLocaleDateString('de-DE') +
													" To " +
													new Date(listing.endDate.slice(0, 10)).toLocaleDateString('de-DE')}
												</p>
												):(
													<p class="text-gray-600 p-2 h-[1.8rem] title-font text-sm font-semibold text-center font-sans truncate"  style={{ fontFamily: 'Poppins, sans-serif' }}
													dangerouslySetInnerHTML={{ __html: listing.description }} />
												)}
									</div>
								))}
						</div>
					</div>
				) : (
					<div>
						<div class="flex items-center justify-center">
							<h1 class=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black"  style={{ fontFamily: 'Poppins, sans-serif' }}>
								{t("currently_no_listings")}
							</h1>
						</div>
						<div class="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
							<span class="font-sans text-black"  style={{ fontFamily: 'Poppins, sans-serif' }}>
								{t("to_upload_new_listing")}
							</span>
							<a
								class="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-black"
								onClick={() => {
									localStorage.setItem("selectedItem", "Choose one category");
									isLoggedIn
										? navigateTo("/UploadListings")
										: navigateTo("/login");
								}}
								style={{ fontFamily: 'Poppins, sans-serif' }}>
								{t("click_here")}
							</a>
						</div>
					</div>
				)}
			</div>
			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default EventDetails;
