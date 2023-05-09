import React, { useState, useEffect } from "react";
import HomePageNavBar from "../Components/HomePageNavBar";
import { getDashboarddata } from "../Services/dashboarddata";
import { useNavigate } from "react-router-dom";
import HOMEPAGEIMG from "../assets/homeimage.jpg";
import LISTINGSIMAGE from "../assets/ListingsImage.png";
import { useTranslation } from "react-i18next";
import { getFavoriteListings } from "../Services/favoritesApi";
import {
	sortByTitleAZ,
	sortByTitleZA,
	sortRecent,
	sortOldest,
} from "../Services/helper";
import Footer from "../Components/Footer";

const Favorites = () => {
	window.scrollTo(0, 0);
	const [dashboarddata, setDashboarddata] = useState({ listings: [] });
	useEffect(() => {
		getDashboarddata().then((response) => {
			setDashboarddata(response);
		});
		document.title = "Favourites";
	}, []);

	let navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	const [favListings, setFavListings] = useState([]);
	useEffect(() => {
		getFavoriteListings().then((response) => {
			setFavListings(response.data.data);
		});
	}, []);

	// Selected Items Deletion Ends

	function handleDashboardChange(event) {
		setDashboarddata({
			...dashboarddata,
			[event.target.name]: event.target.value,
		});
	}

	const [selectedSortOption, setSelectedSortOption] = useState("");
	function handleSortOptionChange(event) {
		setSelectedSortOption(event.target.value);
	}

	useEffect(() => {
		switch (selectedSortOption) {
			case "titleAZ":
				setFavListings([...sortByTitleAZ(favListings)]);
				break;
			case "titleZA":
				setFavListings([...sortByTitleZA(favListings)]);
				break;
			case "recent":
				setFavListings([...sortRecent(favListings)]);
				break;
			case "oldest":
				setFavListings([...sortOldest(favListings)]);
				break;
			default:
				break;
		}
	}, [selectedSortOption]);

	const { t } = useTranslation();

	return (
		<section class="text-gray-600 body-font relative">
			<HomePageNavBar />
			<div class="container-fluid py-0 mr-0 ml-0 mt-20 w-full flex flex-col">
				<div class="w-full mr-0 ml-0">
					<div class="h-64 overflow-hidden px-0 py-1">
						<div class="relative h-64">
							<img
								alt="ecommerce"
								class="object-cover object-center h-full w-full"
								src={HOMEPAGEIMG}
							/>
							<div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
								<h1 class="font-sans text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4">
									{t("favourites")}
								</h1>
							</div>
						</div>
					</div>
				</div>
			</div>

			{favListings && favListings.length > 0 ? (
				<div class="bg-white p-6 mt-10 mb-10 flex flex-wrap gap-10 justify-center">
					<div class="grid grid-1 xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 grid-cols-1 gap-8">
						{favListings &&
							favListings.map((favListing) => (
								<div
									onClick={() =>
										navigateTo(
											`/HomePage/EventDetails?listingId=${favListing.id}&cityId=${favListing.cityId}`
										)
									}
									className="lg:w-96 md:w-64 h-96 pb-20 w-full shadow-xl rounded-lg cursor-pointer"
								>
									<a className="block relative h-64 rounded overflow-hidden">
										<img
											alt="ecommerce"
											className="object-cover object-center w-full h-full block hover:scale-125 transition-all duration-500"
											src={
												favListing.logo
													? process.env.REACT_APP_BUCKET_HOST + favListing.logo
													: LISTINGSIMAGE
											}
										/>
									</a>
									<div className="mt-10">
										<h2 className="text-gray-900 title-font text-lg font-bold text-center font-sans">
											{favListing.title}
										</h2>
									</div>
								</div>
							))}
					</div>
				</div>
			) : (
				<div>
					<div class="flex items-center justify-center">
						<h1 class=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
							{t("currently_no_listings")}
						</h1>
					</div>

					<div class="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
						<span class="font-sans text-black">
							{t("to_upload_new_listing")}
						</span>
						<a
							class="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-black"
							onClick={() => {
								localStorage.setItem("selectedItem", "Choose one category");
								navigateTo("/UploadListings");
							}}
						>
							{t("click_here")}
						</a>
					</div>
				</div>
			)}

			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default Favorites;
