import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LISTINGSIMAGE from "../../assets/ListingsImage.jpeg";
import PROFILEIMAGE from "../../assets/ProfilePicture.png";
import Footer from "../../Components/Footer";
import { getUserListings, getProfile } from "../../Services/usersApi";
import { getVillages } from "../../Services/villages";
import {
	sortByTitleAZ,
	sortByTitleZA,
	sortLatestFirst,
	sortOldestFirst,
} from "../../Services/helper";

const ViewProfile = () => {
	window.scrollTo(0, 0);
	useEffect(() => {
		document.title = "Profile | Smart Regions";
	}, []);

	const [, setListingId] = useState(0);
	const [, setNewListing] = useState(true);
	const [cityId, setCityId] = useState(0);
	const [, setVillages] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const { t } = useTranslation();

	const [user, setUser] = useState();
	const [userSocial, setUserSocial] = useState([]);

	const [listings, setListings] = useState([]);

	const [selectedSortOption] = useState("");

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const cityId = searchParams.get("cityId");
		setCityId(cityId);
		const listingId = searchParams.get("listingId");
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
		}
	}, [t, cityId]);

	useEffect(() => {
		switch (selectedSortOption) {
			case "titleAZ":
				setListings([...sortByTitleAZ(listings)]);
				break;
			case "titleZA":
				setListings([...sortByTitleZA(listings)]);
				break;
			case "recent":
				setListings([...sortLatestFirst(listings)]);
				break;
			case "oldest":
				setListings([...sortOldestFirst(listings)]);
				break;
			default:
				break;
		}
	}, [selectedSortOption, listings]);

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const userId = searchParams.get("userId");
		if (userId) {
			getProfile(userId)
				.then((response) => {
					setUser(response.data.data);
					setUserSocial(JSON.parse(response.data.data.socialMedia));
				})
				.catch((error) => {
					console.log(error);
				});
			getUserListings(null, userId).then((response) => {
				setListings(response.data.data);
			});
		} else {
			getProfile()
				.then((response) => {
					setUser(response.data.data);
					setUserSocial(JSON.parse(response.data.data.socialMedia));
				})
				.catch((error) => {
					console.log(error);
				});
			getUserListings().then((response) => {
				setListings(response.data.data);
			});
		}
	}, []);

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const terminalViewParam = searchParams.get("terminalView");
	const [, setShowNavBar] = useState(true);
	useEffect(() => {
		if (terminalViewParam === "true") {
			setShowNavBar(false);
		} else {
			setShowNavBar(true);
		}
	}, [terminalViewParam]);

	return (
		<section className="text-gray-600 bg-white body-font">
			<HomePageNavBar />
			{/* {showNavBar && <HomePageNavBar />} */}

			<div className="mx-auto grid max-w-2xl grid-cols-1 gap-y-16 gap-x-8 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:grid-cols-3 lg:pb-4">
				<div className="grid grid-cols-1 gap-4 col-span-2">
					<div className="lg:w-full md:w-full h-full">
						<div className="md:grid md:gap-6 bg-white rounded-lg p-8 flex flex-col shadow-xl w-full">
							<div className="mt-5 md:col-span-2 md:mt-0">
								<form action="#" method="POST">
									<div className="bg-white py-6 mt-4 mb-4 flex flex-wrap gap-10 justify-Start">
										<div className="flex flex-col justify-center items-start">
											<img
												className="rounded-full h-20 w-20"
												src={
													user?.image
														? process.env.REACT_APP_BUCKET_HOST + user?.image
														: PROFILEIMAGE
												}
												alt={user?.lastname}
											/>
										</div>
										<div className="flex-grow text-center sm:text-left mt-6 sm:mt-0">
											<h2
												className="text-gray-900 text-lg title-font mb-2 font-bold dark:text-gray-900"
												style={{ fontFamily: "Poppins, sans-serif" }}
											>
												{user?.firstname + " " + user?.lastname}
											</h2>
											{/* <p className="leading-relaxed text-base font-semibold mb-2 dark:text-gray-900">
												Member for 10 months
											</p> */}
											<p
												className="leading-relaxed text-base dark:text-gray-900"
												style={{ fontFamily: "Poppins, sans-serif" }}
											>
												{t("entries")}
											</p>
										</div>
									</div>
								</form>
							</div>
						</div>
					</div>
					<div className="overflow-hidden sm:p-0 mt-[5rem] px-0 py-0">
						<h1
							className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("aboutMe")}
						</h1>
						<p
							className="leading-relaxed text-md font-medium my-6 text-gray-900 dark:text-gray-900"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{user?.description}
						</p>
					</div>
				</div>

				{userSocial && userSocial.length > 0 ? (
					<div className="w-full h-80 md:ml-[6rem] lg:ml-[0rem] ml-[1rem] bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-white shadow-xl dark:bg-white">
						<div className="p-4 space-y-0 md:space-y-6 sm:p-4">
							<h1
								className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-gray-900"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("contactInfo")}
							</h1>
						</div>
						<div className="my-4 bg-gray-200 h-[1px]"></div>

						<div className="flex-grow text-center sm:text-left mt-6 sm:mt-0 justify-center py-2 px-2 sm:justify-start mx-4 my-4 gap-4">
							<div className="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
									className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
								>
									<path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />
								</svg>
								<p
									className="leading-relaxed text-base dark:text-gray-900 bg-white py-1 mt-1 mb-1"
									style={{ fontFamily: "Poppins, sans-serif" }}
								>
									{user?.email}
								</p>
							</div>
							{user?.website && (
								<div className="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
										className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
									>
										<path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 21 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
									</svg>
									<p
										className="leading-relaxed text-base dark:text-gray-900 bg-white py-1 mt-1 mb-1"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{user?.website}
									</p>
								</div>
							)}
						</div>

						<div className="bg-white py-2 px-2 mt-4 mb-4 flex flex-wrap gap-1 justify-Start">
							{userSocial?.Facebook && (
								<div className="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
									<button
										type="button"
										data-te-ripple-init
										data-te-ripple-color="light"
										className="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-blue-500"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
										</svg>
									</button>
								</div>
							)}
							{userSocial?.Instagram && (
								<div className="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
									<button
										type="button"
										data-te-ripple-init
										data-te-ripple-color="light"
										className="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-pink-600"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
										</svg>
									</button>
								</div>
							)}
							{userSocial?.LinkedIn && (
								<div className="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
									<button
										type="button"
										data-te-ripple-init
										data-te-ripple-color="light"
										className="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-sky-600"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
										</svg>
									</button>
								</div>
							)}
							{userSocial?.Youtube && (
								<div className="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
									<button
										type="button"
										data-te-ripple-init
										data-te-ripple-color="light"
										className="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-red-600"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
										</svg>
									</button>
								</div>
							)}
							{userSocial?.Twitter && (
								<div className="flex justify-center py-2 px-2 sm:justify-start mx-0 my-0 gap-2">
									<button
										type="button"
										data-te-ripple-init
										data-te-ripple-color="light"
										className="inline-block rounded px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg bg-blue-400"
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
										</svg>
									</button>
								</div>
							)}
						</div>
					</div>
				) : (
					<div className="w-full h-56 md:ml-[6rem] lg:ml-[0rem] ml-[1rem] bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-white shadow-xl dark:bg-white">
						<div className="p-4 space-y-0 md:space-y-6 sm:p-4">
							<h1
								className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-gray-900"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("contactInfo")}
							</h1>
						</div>
						<div className="my-4 bg-gray-200 h-[1px]"></div>

						<div className="flex-grow text-center sm:text-left mt-6 sm:mt-0 justify-center py-2 px-2 sm:justify-start mx-4 my-4 gap-4">
							<div className="flex items-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
									className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
								>
									<path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />
								</svg>
								<p
									className="leading-relaxed text-base dark:text-gray-900 bg-white py-1 mt-1 mb-1"
									style={{ fontFamily: "Poppins, sans-serif" }}
								>
									{user?.email}
								</p>
							</div>
							{user?.website && (
								<div className="flex items-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
										className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
									>
										<path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 21 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
									</svg>
									<p
										className="leading-relaxed text-base dark:text-gray-900 bg-white py-1 mt-1 mb-1"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{user?.website}
									</p>
								</div>
							)}
						</div>
					</div>
				)}
			</div>

			<div className="mx-auto grid max-w-2xl gap-y-1 gap-x-8 pb-8 pt-8 px-4 sm:px-6 sm:py-10 lg:max-w-7xl">
				<h1 className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-gray-900">
					{t("profileEntries")}
				</h1>
				{listings && listings.length > 0 ? (
					<div className="bg-white p-0 mt-10 mb-10 flex flex-wrap gap-10 justify-center">
						<div className="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
							{listings &&
								listings
									.filter((listing) => listing.statusId === 1)
									.map((listing) => (
										<div
											key={listing.id}
											onClick={() => {
												let url = `/HomePage/EventDetails?listingId=${listing.id}&cityId=${listing.cityId}`;
												if (terminalViewParam === "true") {
													url += "&terminalView=true";
												}
												navigateTo(url);
											}}
											className="w-full h-full shadow-lg rounded-xl cursor-pointer"
										>
											<a className="block relative h-64 rounded overflow-hidden">
												<img
													alt="ecommerce"
													className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-1000"
													src={
														listing.logo
															? process.env.REACT_APP_BUCKET_HOST + listing.logo
															: LISTINGSIMAGE
													}
												/>
											</a>
											<div className="mt-5 px-2">
												<h2
													className="text-gray-900 title-font text-lg font-bold text-center font-sans truncate"
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{listing.title}
												</h2>
											</div>
											<div className="my-4 bg-gray-200 h-[1px]"></div>
											{listing.id && listing.categoryId === 3 ? (
												<p
													className="text-gray-600 my-4 p-2 h-[1.8rem] title-font text-sm font-semibold text-center font-sans truncate"
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{new Date(
														listing.startDate.slice(0, 10)
													).toLocaleDateString("de-DE") +
														" To " +
														new Date(
															listing.endDate.slice(0, 10)
														).toLocaleDateString("de-DE")}
												</p>
											) : (
												<p
													className="text-gray-600 my-4 p-2 h-[1.8rem] title-font text-sm font-semibold text-center font-sans truncate"
													style={{ fontFamily: "Poppins, sans-serif" }}
													dangerouslySetInnerHTML={{
														__html: listing.description,
													}}
												/>
											)}
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
								{t("currently_no_listings")}
							</h1>
						</div>
						<div
							className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							<span className="font-sans text-black">
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
		</section>
	);
};

export default ViewProfile;
