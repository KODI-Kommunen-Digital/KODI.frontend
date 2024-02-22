import React, { useState, useEffect } from "react";
import { socialMedia } from "../Constants/socialMedia";
import { Select } from "@chakra-ui/react";
import PropTypes from "prop-types";

import { getProfile } from "../Services/usersApi";
import { useTranslation } from "react-i18next";

export default function SocialMedia({ setSocialMedia }) {
	const [val, setVal] = useState([]);
	const [alert, setAlert] = useState(false);
	const { t } = useTranslation();
	useEffect(() => {
		getProfile().then((response) => {
			if (response.data.data.socialMedia) {
				setVal(JSON.parse(response.data.data.socialMedia));
			}
		});
	}, []);
	useEffect(() => {
		if (alert) {
			setTimeout(() => setAlert(false), 10000);
		}
	}, [alert]);

	const handleAdd = (value) => {
		if (
			val.length === 0 ||
			(val.length !== socialMedia.length &&
				Object.values(val[val.length - 1])[0] !== "" &&
				Object.keys(val[val.length - 1])[0])
		) {
			setVal([...val, { [value]: "" }]);
		}
	};

	const handleDelete = (index) => {
		const updatedVal = [...val].filter((_, idx) => idx !== index);
		setVal([...updatedVal]);
		setSocialMedia({ socialMedia: JSON.stringify([...updatedVal]) });
	};

	const handleSocialMediaSelectChanges = (event, idx) => {
		const temp = [...val];
		const selectedPlatform = event.target.value;
		const filter = temp.filter(
			(data) => Object.keys(data)[0] === selectedPlatform
		);
		if (filter.length > 0) {
			setAlert(t("canNotSelectSameSocialMediaTwice"));
		} else {
			const currentKey = Object.keys(temp[idx])[0];
			const updatedTemp = {
				...temp[idx],
				[selectedPlatform]: temp[idx][currentKey],
			};
			delete updatedTemp[currentKey];
			temp[idx] = updatedTemp;
			setVal([...temp]);
		}
	};

	const handleSocialMediaLinkChanges = (event, idx) => {
		const temp = [...val];
		const currentPlatform = Object.keys(temp[idx])[0];
		temp[idx][currentPlatform] = event.target.value;
		setVal(temp);
	};

	const handleLinkValidation = (event, idx) => {
		const temp = [...val];
		const currentPlatform = Object.keys(temp[idx])[0];
		temp[idx][currentPlatform] = event.target.value;

		const r = /^((https):\/\/)(www\.)?([A-z]+)\.([A-z]{2,})/;
		if (r.test(event.target.value)) {
			setSocialMedia({ socialMedia: JSON.stringify(val) });
		} else {
			setAlert(t("pleaseEnterAValidLink"));
		}
	};

	return (
		<div>
			<div className="container w-auto px-5 py-2 bg-slate-600">
				<div className="bg-white mt-4 p-6 space-y-10">
					<h2
						className="text-gray-900 text-lg mb-4 font-medium title-font"
						style={{ fontFamily: "Poppins, sans-serif" }}
					>
						{t("socialMedia")}
						<div className="my-4 bg-gray-600 h-[1px]"></div>
					</h2>

					<div className="relative mb-4">
						<label
							htmlFor="category"
							className="block text-sm font-medium text-gray-600"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("add_social_media")}
						</label>
						<div className="relative mb-4">
							<div className="relative mb-4 mt-2 border-white">
								{val &&
									val.length > 0 &&
									val.map((data, i) => {
										return (
											<div
												key={i}
												className="items-stretch py-2 grid grid-cols-1 md:grid-cols-3 gap-4"
											>
												<div className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
													<label
														htmlFor="country"
														className="block text-md font-medium text-gray-600"
														style={{
															fontFamily: "Poppins, sans-serif",
														}}
													>
														{t("select")}
													</label>
													<Select
														placeholder={t("selectOption")}
														value={Object.keys(data)[0]}
														onChange={(e) =>
															handleSocialMediaSelectChanges(e, i)
														}
													>
														{socialMedia.map((option) => (
															<option key={option} value={option}>
																{option}
															</option>
														))}
													</Select>
												</div>
												<div className="mt-1 px-0 ml-2">
													<label
														htmlFor="lastName"
														className="block text-md font-medium text-gray-600"
													>
														{t("link")}
													</label>
													<input
														type="text"
														id="socialMedia"
														name="socialMedia"
														onBlur={(e) => handleLinkValidation(e, i)}
														value={val[i][Object.keys(val[i])[0]]}
														onChange={(e) => handleSocialMediaLinkChanges(e, i)}
														className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
														placeholder="ainfo@heidi-app.de"
														style={{
															fontFamily: "Poppins, sans-serif",
														}}
													/>
												</div>
												<div className="flex ml-2 mt-8 hidden md:inline-block">
													<button onClick={() => handleDelete(i)}>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															className="w-5 h-5"
															viewBox="0 0 512 512"
														>
															<path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
														</svg>
													</button>
												</div>
												<button
													onClick={() => handleDelete(i)}
													className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2 md:hidden sm:inline-block inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
												>
													{t("delete")}
												</button>
											</div>
										);
									})}
								{alert && (
									<div
										className="mt-4 mb-10 md:mb-4 h-[24px] text-red-600"
										style={{
											visibility: alert ? "visible" : "hidden",
										}}
									>
										{alert}
									</div>
								)}
								<button
									className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded"
									onClick={() => handleAdd("")}
									style={{
										fontFamily: "Poppins, sans-serif",
									}}
								>
									{t("add_social_media")}
								</button>
							</div>
							<div className="flex justify-center space-x-6 mt-7">
								<svg
									aria-hidden="true"
									focusable="false"
									data-prefix="far"
									data-icon="arrow-alt-circle-up"
									className="w-5 h-5"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path
										fill="currentColor"
										d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
									/>
								</svg>
								<svg
									aria-hidden="true"
									focusable="false"
									data-prefix="far"
									data-icon="arrow-alt-circle-right"
									className="w-5 h-5"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path
										fill="currentColor"
										d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
									/>
								</svg>
								<svg
									aria-hidden="true"
									focusable="false"
									data-prefix="far"
									data-icon="arrow-alt-circle-down"
									className="w-5 h-5"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path
										fill="currentColor"
										d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
									/>
								</svg>
								<svg
									aria-hidden="true"
									focusable="false"
									data-prefix="far"
									data-icon="arrow-alt-circle-down"
									className="w-5 h-5"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path
										fill="currentColor"
										d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
									/>
								</svg>
								<svg
									aria-hidden="true"
									focusable="false"
									data-prefix="far"
									data-icon="arrow-alt-circle-down"
									className="w-5 h-5"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path
										fill="currentColor"
										d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
SocialMedia.propTypes = {
	setSocialMedia: PropTypes.func.isRequired,
};
