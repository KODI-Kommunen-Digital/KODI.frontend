import { useState } from "react";
import { socialMedia } from "../Constants/socialMedia";
import { Select } from "@chakra-ui/react";
import { useEffect } from "react";
import { getProfile } from "../Services/usersApi";

export default function SocialMedia({ setSocialMedia }) {
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState({});
	const [alert, setAlert] = useState("");
	const [data, setData] = useState();
	const [val, setVal] = useState([]);
	useEffect(() => {
		setLoading(true);
		getProfile()
			.then((response) => {
				setUser(response.data.data);
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				setAlert(
					true,
					"Failed to fetch your profile info, please try again!",
					"danger"
				);
			});
	}, []);

	const handleAdd = (value) => {
		console.log(user);
		if (val.length === socialMedia.length) {
			setAlert("All Social added");
		} else {
			setVal([...val, { "": value }]);
		}
	};

	const handleDelete = (index) => {
		var list = [...val];
		list = list.filter((obj, idx) => {
			return idx !== index;
		});
		console.log(list);
		setVal(list);
		setData({ socialMedia: JSON.stringify(list) });
	};

	const handleSocialMediaSelectChanges = (event, idx) => {
		let temp = val;
		if (
			Object.keys(user.socialMedia).indexOf(event.target.value) === -1 &&
			Object.keys(val).indexOf(event.target.value) === -1
		) {
			delete temp[idx][""];
			delete temp[idx][Object.keys(temp[idx])[0]];
			temp[idx][event.target.value] = "";
			setVal([...temp]);
		} else {
			setAlert("This Social already added Delete to add new link");
		}
	};

	const handleSocialMediaLinkChanges = (event, idx) => {
		let temp = val;
		temp[idx][Object.keys(temp[idx])[0]] = event.target.value;
		setVal([...temp]);
		setSocialMedia(temp);
	};
	return (
		<div>
			<div class="container w-auto px-5 py-2 bg-slate-600">
				<div class="bg-white mt-4 p-6 space-y-10">
					<h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
						Social Media
						<div className="my-4 bg-gray-600 h-[1px]"></div>
					</h2>

					<div class="relative mb-4">
						<label
							for="category"
							class="block text-sm font-medium text-gray-600"
						>
							Add your social media accounts here
						</label>
						<div class="relative mb-4">
							<div class="relative mb-4 mt-2 border-white">
								{user.socialMedia &&
									Object.keys(JSON.parse(user.socialMedia)).map((data, i) => {
										return JSON.parse(user.socialMedia)[data] !== "" ? (
											<div
												key={i}
												class="items-stretch py-2 grid grid-cols-1 md:grid-cols-3 gap-4"
											>
												<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
													<label
														for="country"
														class="block text-md font-medium text-gray-600"
													>
														Select
													</label>
													<select
														type="text"
														id="selected"
														name="selected"
														value={data || ""}
														disabled
														autoComplete="country-name"
														className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
													>
														{socialMedia.map((option) => (
															<option key={option} value={option}>
																{option}
															</option>
														))}
													</select>
												</div>
												<div class="mt-2 px-0 ml-2">
													<label
														htmlFor="lastName"
														class="block text-md font-medium text-gray-600"
													>
														Link
													</label>
													<input
														type="text"
														id="socialMedia"
														name="socialMedia"
														defaultValue={JSON.parse(user.socialMedia)[data]}
														className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
														placeholder="ainfo@heidi-app.de"
														disabled
													/>
												</div>
												<div class="flex ml-2 mt-8">
													<button onClick={() => handleDelete(i)}>
														<svg
															xmlns="http://www.w3.org/2000/svg"
															class="w-5 h-5"
															viewBox="0 0 512 512"
														>
															<path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
														</svg>
													</button>
												</div>
											</div>
										) : (
											<></>
										);
									})}
							</div>
							<div class="relative mb-4 mt-2 border-white">
								{val.map((data, i) => {
									return (
										<div
											key={i}
											class="items-stretch py-2 grid grid-cols-1 md:grid-cols-3 gap-4"
										>
											<div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
												<label
													for="country"
													class="block text-md font-medium text-gray-600"
												>
													Select
												</label>
												<Select
													placeholder="Select option"
													onChange={(e) => handleSocialMediaSelectChanges(e, i)}
												>
													{socialMedia.map((option) => (
														<option key={option} value={option}>
															{option}
														</option>
													))}
												</Select>
												{/* <select
																type="text"
																id="selected"
																name="selected"
																value={data || ""}
																onBlur={validateInput}
																onChange={(e) =>
																	this.handleSocialMediaChanges(e, i)
																}
																autoComplete="country-name"
																className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
															>
																{socialMedia.map((option) => (
																	<option key={option} value={option}>
																		{option}
																	</option>
																))}
															</select> */}
											</div>
											<div class="mt-2 px-0 ml-2">
												<label
													htmlFor="lastName"
													class="block text-md font-medium text-gray-600"
												>
													Link
												</label>
												<input
													type="text"
													id="socialMedia"
													name="socialMedia"
													value={val[i][Object.keys(val[i])[0]]}
													defaultValue={""}
													onChange={(e) => handleSocialMediaLinkChanges(e, i)}
													className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
													placeholder="ainfo@heidi-app.de"
												/>
											</div>
											<div class="flex ml-2 mt-8">
												<button onClick={() => handleDelete(i)}>
													<svg
														xmlns="http://www.w3.org/2000/svg"
														class="w-5 h-5"
														viewBox="0 0 512 512"
													>
														<path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
													</svg>
												</button>
											</div>
										</div>
									);
								})}
								<button
									class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded"
									onClick={() => handleAdd("")}
								>
									+ Add your social media
								</button>
							</div>
							<div class="flex justify-center space-x-6 mt-7">
								<svg
									aria-hidden="true"
									focusable="false"
									data-prefix="far"
									data-icon="arrow-alt-circle-up"
									class="w-5 h-5"
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
									class="w-5 h-5"
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
									class="w-5 h-5"
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
									class="w-5 h-5"
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
									class="w-5 h-5"
									role="img"
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 512 512"
								>
									<path
										fill="currentColor"
										d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
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
