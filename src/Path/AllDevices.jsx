import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../index.css";
import axios from "axios";
import DEVICEIMAGE from "../assets/computer-tablet-phone-icon.png";
import {
	logout,
	fetchDeviceList,
	logoutOfAllDevices,
	logoutOfOneDevice,
} from "../Services/usersApi";

const AllDevices = () => {
	const { t } = useTranslation();
	const [devices, setDevices] = useState([]);

	useEffect(() => {
		fetchDeviceList().then((response) => {
			setDevices(response.data.data);
		});
	}, []);
	console.log(devices);

	return (
		<section className="bg-slate-600 body-font relative h-screen">
			<SideBar />
			<>
				<div className="container w-auto px-5 py-2 bg-slate-600">
					<div className="bg-white mt-4 p-6">
						<h2
							className="text-gray-900 text-lg mb-4 font-medium title-font"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("alldevicepagetitle")}
						</h2>
						<div className="my-4 bg-gray-600 text-base h-[1px]" />

						<div className="flex justify-center py-2 px-4 mt-4 mx-auto">
							<div className="text-center">
								<img
									alt="devices"
									className="object-cover object-center h-48 w-full bg-white"
									src={DEVICEIMAGE}
								/>
							</div>
						</div>

						{devices && devices.length > 0 ? (
							<>
								{devices.map((device) => (
									<div
										key={device.id}
										className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-slate-600 text-black"
									>
										<svg
											className="h-6 w-10 fill-current"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 496 512"
										>
											<path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V352H64V64H512z" />
										</svg>
										<span
											className="text-[15px] ml-4 text-black font-bold"
											style={{ fontFamily: "Poppins, sans-serif" }}
										>
											{device.device} {device.browser}
										</span>
									</div>
								))}
							</>
						) : (
							<div>
								<div className="flex items-center justify-center">
									<h1
										className="m-auto mt-20 text-center font-sans font-bold text-2xl text-black"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("currently_no_groups")}
									</h1>
								</div>
								<div className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
									<span
										className="font-sans text-black"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("to_create_new_group")}
									</span>
									<a
										className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-black"
										style={{ fontFamily: "Poppins, sans-serif" }}
										onClick={() => {
											localStorage.setItem(
												"selectedItem",
												"Choose one category"
											);
											isLoggedIn
												? navigateTo("/UploadListings")
												: navigateTo("/login");
										}}
									>
										{t("click_here")}
									</a>
								</div>
							</div>
						)}

						<button
							id="finalbutton"
							className="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 mt-4 rounded-md"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("logoutofalldevices")}
						</button>
					</div>
				</div>
			</>
		</section>
	);
};

export default AllDevices;
