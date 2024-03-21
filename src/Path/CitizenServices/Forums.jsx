import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useTranslation } from "react-i18next";
import Footer from "../../Components/Footer";
import { getCities } from "../../Services/cities";
import { useNavigate } from "react-router-dom";

const Forums = () => {
	window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [citiesArray, setCitiesArray] = useState([]);
	const [cityId, setCityId] = useState(null);
	const [pageNo] = useState(1);
	const navigate = useNavigate();

	useEffect(() => {
		document.title = process.env.REACT_APP_REGION_NAME + " " + t("forums");
		getCities().then((response) => {
			setCitiesArray(response.data.data);
			const temp = {};
			for (const city of response.data.data) {
				temp[city.id] = city.name;
			}
		});
	}, []);

	useEffect(() => {
		const params = { pageNo, pageSize: 12 };
		const urlParams = new URLSearchParams(window.location.search);
		params.cityId = cityId;
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.replaceState({}, "", newUrl);
	}, [cityId, pageNo]);

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const cityId = urlParams.get("cityId");
		if (parseInt(cityId)) {
			urlParams.set("cityId", cityId);
		} else {
			urlParams.delete("cityId");
		}
	}, []);

	useEffect(() => {
		const params = {};
		if (cityId !== 0) {
			params.cityId = cityId;
		}
	}, [cityId]);

	const navigateTo = (path) => {
		navigate(path);
	};

	function goToAllForums() {
		navigateTo(`/CitizenService`);
	}

	return (
		<section className="text-gray-600 bg-white body-font">
			<HomePageNavBar />

			<div className="container-fluid py-0 mr-0 ml-0 mt-0 w-full flex flex-col relative">
				<div className="w-full mr-0 ml-0">
					<div className="h-[30rem] lg:h-full overflow-hidden px-0 py-0 relative">
						<div className="relative h-[30rem]">
							<img
								alt="ecommerce"
								className="object-cover object-center h-full w-full"
								src={process.env.REACT_APP_BUCKET_HOST + "admin/Homepage.jpg"}
								loading="lazy"
							/>
							<div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-50 text-white z--1">
								<h1 className="text-4xl md:text-6xl lg:text-7xl text-center font-bold mb-4 font-sans">
									{t("forums")}
								</h1>

								<div className="col-span-6 sm:col-span-1 mt-1 w-auto px-0 mr-0">
									<select
										id="city"
										name="city"
										autoComplete="city-name"
										onChange={(e) => setCityId(e.target.value)}
										value={cityId || 0}
										className="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
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

			<div>
				<div className="pt-0 pb-20 text-center">
					<h1 className="text-5xl md:text-8xl lg:text-10xl text-center font-bold my-10 font-sans bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
						Oops !
					</h1>
					<h1 className="text-2xl md:text-5xl lg:text-5xl text-center font-bold my-20 font-sans">
						{t("comingSoon")}
					</h1>
					<a
						onClick={() => goToAllForums()}
						className="w-full rounded-xl sm:w-80 mt-10 mx-auto bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer font-sans"
						style={{ fontFamily: "Poppins, sans-serif" }}
					>
						{t("goBack")}
					</a>
				</div>
			</div>

			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default Forums;
