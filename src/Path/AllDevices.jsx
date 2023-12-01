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
import { useAuth } from '../AuthContext';
import { getCookie } from '../cookies/cookieServices';

const AllDevices = () => {
	const { t } = useTranslation();
	const [devices, setDevices] = useState([]);
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const { isAuthenticated, setLogout } = useAuth();

	useEffect(() => {
		const refreshToken = window.localStorage.getItem("refreshToken") || getCookie("refreshToken");
		if (isAuthenticated()) {
			setIsLoggedIn(true);
		}
		fetchDeviceList(refreshToken).then((response) => {
			setDevices(response.data.data);
		});
	}, [isAuthenticated]);

	const handleLogout = async () => {
		if (isLoggedIn) {
			try {
				await logoutOfAllDevices();
				setLogout();
				window.localStorage.removeItem("selectedItem");
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

	const handleLogoutOneDevice = async (ids) => {
		try {
			await logoutOfOneDevice(ids);

			setDevices(devices.filter((device) => device.id !== ids));
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

	const [showConfirmationModal, setShowConfirmationModal] = useState({
		visible: false,
		onConfirm: () => { },
		onCancel: () => { },
	});

	function logoutAccountOnClick() {
		setShowConfirmationModal({
			visible: true,
			onConfirm: () => handleLogout(),
			onCancel: () => setShowConfirmationModal({ visible: false }),
		});
	}

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

						{devices && devices.length > 0 && (
							<label
								className="block px-2 text-sm font-medium text-gray-500"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("logotofeachdevice")}
							</label>
						)}

						{devices && devices.length > 0 ? (
							<>
								{devices.map((device) => (
									<div
										key={device.id}
										onClick={() => handleLogoutOneDevice(device.id)}
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
													style={{
														fontFamily: "Poppins, sans-serif",
													}}
													className="font-bold overflow-hidden whitespace-nowrap overflow-ellipsis"
												>
													{device.device || t("UnknownDevice")}
												</h1>
												<span
													style={{
														fontFamily: "Poppins, sans-serif",
													}}
													className="font-bold text-gray-500 ml-1"
												>
													({device.browser || t("UnknownBrowser")})
												</span>
											</div>

											<div className="sm:ml-4 ml-0 text-black font-bold flex flex-col sm:flex-row items-center sm:items-start">
												<p
													className="text-sm text-red-600 ml-1 items-center"
													style={{
														fontFamily: "Poppins, sans-serif",
													}}
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
							onClick={logoutAccountOnClick}
							className="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 mt-4 rounded-md"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("logoutOfAllDevices")}
						</button>
						{showConfirmationModal.visible && (
							<div className="fixed z-10 inset-0 overflow-y-auto">
								<div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
									<div
										className="fixed inset-0 transition-opacity"
										aria-hidden="true"
									>
										<div className="absolute inset-0 bg-gray-500 opacity-75"></div>
									</div>
									<span
										className="hidden sm:inline-block sm:align-middle sm:h-screen"
										aria-hidden="true"
									>
										&#8203;
									</span>
									<div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
										<div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
											<div className="sm:flex sm:items-start">
												<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
													<svg
														className="h-6 w-6 text-red-600"
														xmlns="http://www.w3.org/2000/svg"
														fill="none"
														viewBox="0 0 24 24"
														stroke="currentColor"
														aria-hidden="true"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															strokeWidth="2"
															d="M6 18L18 6M6 6l12 12"
														/>
													</svg>
												</div>
												<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
													<h3 className="text-lg leading-6 font-medium text-gray-900">
														{t("areyousure")}
													</h3>
													<div className="mt-2">
														<p className="text-sm text-gray-500">
															{t("doYouReallyWantToLogoutAccount")}
														</p>
													</div>
												</div>
											</div>
										</div>
										<div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
											<button
												onClick={showConfirmationModal.onConfirm}
												type="button"
												className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
											>
												{t("logout")}
											</button>

											<button
												onClick={showConfirmationModal.onCancel}
												type="button"
												className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
											>
												{t("cancel")}
											</button>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</div>
			</>
		</section>
	);
};

export default AllDevices;
