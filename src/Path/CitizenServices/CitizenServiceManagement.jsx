import React, { useState, useEffect } from "react";
import HomePageNavBar from "../../Components/HomePageNavBar";
import { useTranslation } from "react-i18next";
import Footer from "../../Components/Footer";
import { getcitizenServiceData, getCities, getCitizenServices } from "../../Services/cities";

const CitizenServiceManagement = () => {
	window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [citizenServiceData, setcitizenServiceData] = useState([]);
	const [citizenService, setCitizenService] = useState();
	const [cities, setCities] = useState({});
	const [citiesArray, setCitiesArray] = useState([]);
	const [cityId, setCityId] = useState(null);
	const pageNo = 1;

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		document.title =
			process.env.REACT_APP_REGION_NAME + " " + t("digitalRathouse");
		getCities().then((response) => {
			setCitiesArray(response.data.data);
			const temp = {};
			for (const city of response.data.data) {
				temp[city.id] = city.name;
			}
			setCities(temp);
			const cityIdParam = urlParams.get("cityId");
			if (cityIdParam) setCityId(cityIdParam);
		});
	}, []);

	useEffect(() => {
		const params = { pageNo, pageSize: 12 };
		const urlParams = new URLSearchParams(window.location.search);
		params.cityId = cityId;
		const citizenServiceId = urlParams.get("citizenServiceId");
		params.citizenServiceId = citizenServiceId;
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.replaceState({}, "", newUrl);
		getCitizenServices({ id: citizenServiceId }).then(res => {
			setCitizenService(res.data.data[0].title)
		});
		getcitizenServiceData(params).then((response) => {
			setcitizenServiceData(response.data.data);
			if (cityId) {
				window.location.replace(response.data.data[0].link);
			}
		});
	}, [cityId]);

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
									{citizenService}
								</h1>

								<div className="col-span-6 sm:col-span-1 mt-1 w-auto px-0 mr-0">
									<select
										id="city"
										name="city"
										autoComplete="city-name"
										onChange={(e) => setCityId(e.target.value)}
										value={cityId || 0}
										className="bg-gray-50 border font-sans border-gray-300 text-gray-900 sm:text-sm rounded-xl focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-50 dark:border-gray-300 dark:placeholder-gray-400 dark:text-gray-900 dark:focus:ring-blue-500 dark:focus:border-blue-500"
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

			{citizenServiceData && citizenServiceData.length > 0 ? (
				<div className="bg-white lg:px-10 md:px-5 sm:px-0 px-2 py-6 mt-10 mb-10 space-y-10 flex flex-col">
					<div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 relative mb-4 justify-center place-items-center">
						{citizenServiceData &&
							citizenServiceData.map((data) => (
								<div
									key={data.id}
									className="h-80 w-full rounded-lg cursor-pointer transition-all duration-300 hover:shadow-xl transform hover:-translate-y-2"
								>
									<div className="relative h-80 rounded overflow-hidden">
										<a
											target="_blank"
											rel="noreferrer noopener"
											href={data.link}
										>
											<img
												onClick={() => window.open(data.link, "_blank")}
												alt={data.title}
												className="object-cover object-center h-full w-full hover:scale-125 transition-all duration-500"
												src={process.env.REACT_APP_BUCKET_HOST + data.image}
											/>
											<div className="absolute inset-0 flex flex-col justify-end bg-gray-800 bg-opacity-50 text-white z--1">
												<h1 className="text-xl md:text-3xl font-sans font-bold mb-0 ml-4">
													{cities[data.cityId]}
												</h1>
											</div>
										</a>
									</div>
								</div>
							))}
					</div>
				</div>
			) : (
				<div className="md:mb-60 mt-20 mb-20 p-6">
					<div className="text-center">
						<div className="m-auto md:mt-20 mt-0 mb-20 text-center font-sans font-bold text-xl">
							<h1 className="text-5xl md:text-8xl lg:text-10xl text-center font-bold my-10 font-sans bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
								Oops !
							</h1>
						</div>
						<div className="m-auto mt-20 mb-20 text-center font-sans font-bold text-xl">
							<h1 className=" m-auto mt-20 text-center font-sans font-bold text-2xl text-black">
								{t("currently_no_services")}
							</h1>
						</div>
					</div>
				</div>
			)}

			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default CitizenServiceManagement;
