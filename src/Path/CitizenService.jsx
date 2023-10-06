import React, { useState, useEffect } from "react";
import HomePageNavBar from "../Components/HomePageNavBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../Components/Footer";
import { getCities, getCitizenServices } from "../Services/cities";

const CitizenService = () => {
	window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [cities, setCities] = useState({});
	const [citizenService, setCitizenServices] = useState({});
	const [citiesArray, setCitiesArray] = useState([]);
	const [cityId, setCityId] = useState(0);
	const [showForum, setShowForum] = useState(false);
	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		document.title = process.env.REACT_APP_REGION_NAME + " Citizen Services";
		getCities().then((response) => {
			setCitiesArray(response.data.data);
			const temp = {};
			for (const city of response.data.data) {
				temp[city.id] = {
					name: city.name,
					hasForum: city.hasForum,
				};
			}
			setCities(temp);
			const cityIdParam = urlParams.get("cityId");
			if (cityIdParam) setCityId(cityIdParam);
		});

		getCitizenServices().then((response) => {
			setCitizenServices(response.data.data);
			console.log(response.data.data);
		});
	}, []);

	useEffect(() => {
		if (!cityId) {
			setShowForum(false);
		} else {
			setShowForum(cities ? cities[cityId].hasForum : false);
		}
	}, [cityId]);

	const handleLinkClick = (data) => {
		if (data.isExternalLink) {
			window.open(data.link, "_blank");
		} else {
			navigateTo(data.link + `?cityId=${cityId}`);
		}
	};

	return (
		<section className="text-gray-600 bg-white body-font">
			<HomePageNavBar />

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
									{t("citizenService")}
								</h1>

								<div className="col-span-6 sm:col-span-1 mt-1 w-auto px-0 mr-0">
									<select
										id="city"
										name="city"
										autoComplete="city-name"
										onChange={(e) => {
											const selectedCityId = e.target.value;
											const newUrl = !selectedCityId
												? `${window.location.pathname}`
												: `${window.location.pathname}?cityId=${selectedCityId}`;
											window.history.replaceState({}, "", newUrl);
											setCityId(parseInt(selectedCityId));
										}}
										value={cityId}
										className="flex items-center whitespace-nowrap rounded-xl bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-gray-900 transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] motion-reduce:transition-none dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
										style={{
											fontFamily: "Poppins, sans-serif",
										}}
									>
										<option className="font-sans" value={0} key={0}>
											{t("allCities", {
												regionName: process.env.REACT_APP_REGION_NAME,
											})}
										</option>
										{citiesArray.map((city) => (
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

			{citizenService && citizenService.length > 0 ? (
				<div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
					<div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 relative mb-4 justify-center place-items-center">
						{citizenService &&
							citizenService
								.filter((data) => data.title !== "forums" || showForum)
								.map((data, index) => (
									<div
										key={index}
										className="h-80 w-full rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
									>
										<div className="relative h-80 rounded overflow-hidden">
											<a
												rel="noreferrer noopener"
												onClick={() => handleLinkClick(data)}
											>
												<img
													alt={data.title}
													className="object-cover object-center h-full w-full hover:scale-125 transition-all duration-500"
													src={process.env.REACT_APP_BUCKET_HOST + data.image}
												/>
												<div className="absolute inset-0 flex flex-col justify-end bg-gray-800 bg-opacity-50 text-white z--1">
													<h1 className="text-xl md:text-3xl font-sans font-bold mb-0 ml-4">
														{t(data.title)}
													</h1>
													<p className="mb-4 ml-4 font-sans">
														{cities[data.cityId]}
													</p>
												</div>
											</a>
										</div>
									</div>
								))}
					</div>
				</div>
			) : (
				<div>
					<div className="text-center">
						<h1 className="text-5xl md:text-8xl lg:text-10xl text-center font-bold my-10 font-sans bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
							Oops !
						</h1>
						<h1 className=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
							{t("currently_no_services")}
						</h1>
					</div>
				</div>
			)}

			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default CitizenService;
