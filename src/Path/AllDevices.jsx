import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../index.css";
import DEVICEIMAGE from "../assets/computer-tablet-phone-icon.png";
import {
	fetchDeviceList,
	logoutOfAllDevices,
	logoutOfOneDevice,
} from "../Services/usersApi";
import { useNavigate } from "react-router-dom";

const AllDevices = () => {
	const { t } = useTranslation();
	const [devices, setDevices] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		const accessToken =
			window.localStorage.getItem("accessToken") ||
			window.sessionStorage.getItem("accessToken");
		const refreshToken =
			window.localStorage.getItem("refreshToken") ||
			window.sessionStorage.getItem("refreshToken");
		if (accessToken || refreshToken) {
			setIsLoggedIn(true);
		}
		fetchDeviceList().then((response) => {
			setDevices(response.data.data);
			console.log(response.data.data);
		});
	}, []);

	const handleLoginLogout = async () => {
		if (isLoggedIn) {
			try {
				await logoutOfAllDevices();
				window.localStorage.removeItem("accessToken");
				window.localStorage.removeItem("refreshToken");
				window.localStorage.removeItem("userId");
				window.localStorage.removeItem("selectedItem");
				window.sessionStorage.removeItem("accessToken");
				window.sessionStorage.removeItem("refreshToken");
				window.sessionStorage.removeItem("userId");
				window.sessionStorage.removeItem("selectedItem");
				setIsLoggedIn(false);
				navigateTo("/");
			} catch (error) {
				return error;
			}
		} else {
			navigateTo("/login");
		}
	};

	const handleLoginLogoutOneDevice = async (ids) => {
		try {
			await logoutOfOneDevice(ids);
			window.localStorage.removeItem("accessToken");
			window.localStorage.removeItem("refreshToken");
			window.localStorage.removeItem("userId");
			window.localStorage.removeItem("selectedItem");
			window.sessionStorage.removeItem("accessToken");
			window.sessionStorage.removeItem("refreshToken");
			window.sessionStorage.removeItem("userId");
			window.sessionStorage.removeItem("selectedItem");
			if (devices.find((device) => device.id === ids)) {
				navigateTo("/");
			} else {
				setDevices(devices.filter((device) => device.id !== ids));
			}

			setIsLoggedIn(false);
		} catch (err) {
			console.log(err);
		}
	};

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

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

						<label
							className="block px-2 text-sm font-medium text-gray-500"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("logotofeachdevice")}
						</label>

						{devices && devices.length > 0 ? (
							<>
								{devices.map((device) => (
									<div
										key={device.id}
										onClick={() => handleLoginLogoutOneDevice(device.id)}
										className="p-2.5 mt-3 flex items-center rounded-md cursor-pointer text-black"
									>
										<div className="border items-center sm:items-start space-y-2 sm:space-y-0 border-gray-300 transition-all duration-300 hover:bg-red-200 hover:shadow-lg transform hover:-translate-y-1 rounded-md p-2.5 flex flex-col sm:flex-row w-full sm:space-x-4">
											<svg
												className="h-6 w-10 fill-current"
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 496 512"
											>
												<path d="M64 0C28.7 0 0 28.7 0 64V352c0 35.3 28.7 64 64 64H240l-10.7 32H160c-17.7 0-32 14.3-32 32s14.3 32 32 32H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H346.7L336 416H512c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM512 64V352H64V64H512z" />
											</svg>

											<div className="sm:ml-4 ml-0 text-black font-bold flex flex-col sm:flex-row items-center sm:items-start">
												<h1
													style={{ fontFamily: "Poppins, sans-serif" }}
													className="font-bold overflow-hidden whitespace-nowrap overflow-ellipsis"
												>
													{device.device}
												</h1>
												<span
													style={{ fontFamily: "Poppins, sans-serif" }}
													className="font-bold text-gray-500 ml-1"
												>
													({device.browser})
												</span>
											</div>

											<div className="sm:ml-4 ml-0 text-black font-bold flex flex-col sm:flex-row items-center sm:items-start">
												<p
													className="text-sm text-red-600 ml-1 items-center"
													style={{ fontFamily: "Poppins, sans-serif" }}
												>
													{t("clickTologOut")}
												</p>
											</div>
										</div>
									</div>
								))}
							</>
						) : (
							<p
								className="p-2.5 mt-3 flex items-center rounded-md cursor-pointer text-black"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("noDevicesLoggedIn")}
							</p>
						)}

						<button
							id="finalbutton"
							onClick={handleLoginLogout}
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
