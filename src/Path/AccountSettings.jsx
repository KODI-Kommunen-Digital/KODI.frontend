import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../index.css";
import Alert from "../Components/Alert";
import { getProfile, updateProfile, deleteAccount } from "../Services/usersApi";
import { useAuth } from '../AuthContext';

const AccountSettings = () => {
	const { t } = useTranslation();
	const [alertInfo, setAlertInfo] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertType, setAlertType] = useState("");
	const { isAuthenticated, setLogout } = useAuth();

	const [input, setInput] = useState({
		username: "",
		email: "",
		phoneNumber: "",
	});

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	useEffect(() => {
		document.title = process.env.REACT_APP_REGION_NAME + " " + t("accountSettings");
		if (!isAuthenticated()) {
			window.location.href = "/login";
		}
		getProfile().then((response) => {
			const { username, email, phoneNumber } = response.data.data;
			setInput((prev) => ({
				...prev,
				username,
				email,
				phoneNumber,
			}));
		});
	}, [isAuthenticated]);

	const onInputChange = (e) => {
		const { name, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSave = async (event) => {
		event.preventDefault();
		try {
			await updateProfile(input);
			setAlertInfo(true);
			setAlertType("success");
			setAlertMessage(t("personalInfoSave"));
			setTimeout(() => {
				setAlertInfo(false);
			}, 5000);
		} catch (err) {
			setAlertInfo(true);
			setAlertType("danger");
			setAlertMessage(t("changesNotSaved"));
		}
	};

	const [showConfirmationModal, setShowConfirmationModal] = useState({
		visible: false,
		onConfirm: () => { },
		onCancel: () => { },
	});

	const handleDeleteAccount = () => {
		deleteAccount()
			.then(() => {
				setLogout();
				window.location.href = "/";
				setShowConfirmationModal({ visible: false });
			})
			.catch((error) => {
				console.log(error);
			});
	};

	function deleteAccountOnClick() {
		setShowConfirmationModal({
			visible: true,
			onConfirm: () => handleDeleteAccount(),
			onCancel: () => setShowConfirmationModal({ visible: false }),
		});
	}

	return (
		<section className="bg-slate-600 body-font relative h-screen">
			<SideBar />
			<>
				<div className="container w-auto px-5 py-2 bg-slate-600">
					<div className="bg-white mt-4 p-6 space-y-10">
						<h2
							className="text-gray-900 text-lg mb-4 font-medium title-font"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("updatePassword")}
							<div className="my-4 bg-gray-600 text-base h-[1px]"></div>
							<label
								className="block px-2 text-sm font-medium text-gray-500"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("Need_to_change_your_password")}
							</label>
						</h2>
						<button
							id="finalbutton"
							className="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 mt-4 rounded-md"
							onClick={() => {
								navigateTo("/PasswordUpdate");
							}}
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("updatePassword")}
						</button>

						<h2
							className="text-gray-900 text-lg mb-4 font-medium title-font"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("personalInformation")}
							<div className="my-4 bg-gray-600 text-base h-[1px]"></div>
							<label
								className="block px-2 text-sm font-medium text-gray-500"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("displayed_publicly")}
							</label>
						</h2>
						<div className="relative mb-4">
							<div className="py-2 grid grid-cols-1 md:grid-cols-2">
								<div className="mt-1 px-2">
									<label className="block text-sm font-medium text-gray-600">
										{t("emailId")}
									</label>
									<input
										type="text"
										name="email"
										value={input.email || ""}
										id="email"
										className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
										placeholder={t("enter_email")}
										style={{ fontFamily: "Poppins, sans-serif" }}
										onChange={onInputChange}
									/>
								</div>
								<div className="mt-1 px-2">
									<label
										htmlFor="phoneNumber"
										className="block text-sm font-medium text-gray-600"
									>
										{t("phoneNumber")}
									</label>
									<input
										type="text"
										name="phoneNumber"
										value={input.phoneNumber || ""}
										id="phoneNumber"
										className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
										placeholder={t("enter_phone")}
										style={{ fontFamily: "Poppins, sans-serif" }}
										onChange={onInputChange}
									/>
								</div>
							</div>
						</div>
						<div className="py-2 mt-1 px-2">
							<button
								className="w-full hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
								id="finalbutton"
								// className="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 mt-4 rounded-md"
								onClick={handleSave}
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("saveChanges")}{" "}
							</button>
						</div>
						{alertInfo && (
							<div className="py-2 mt-1 px-2">
								<Alert type={alertType} message={alertMessage} />
							</div>
						)}

						<h2
							className="text-gray-900 text-lg mb-4 font-medium title-font"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("allDevices")}
							<div className="my-4 bg-gray-600 text-base h-[1px]"></div>
							<label
								className="block px-2 text-sm font-medium text-gray-500"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("alldevicesdescription")}
							</label>
						</h2>

						<div className="py-2 mt-1 px-2">
							<button
								// className="w-full hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
								id="finalbutton"
								className="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 mt-4 rounded-md"
								onClick={() => navigateTo("/AllDevices")}
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("devices")}
							</button>
						</div>
					</div>
				</div>

				<div className="container w-auto px-5 py-2 bg-slate-600">
					<div className="bg-white mt-4 p-6">
						<h2
							className="text-gray-900 text-lg mb-4 font-medium title-font"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("deleteAccount")}
							<div className="my-4 bg-gray-600 text-base h-[1px]"></div>
							<label
								className="block px-2 text-sm font-medium text-gray-500"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("need_to_delete_account")}
							</label>
						</h2>
						<div className="py-2 mt-1 px-2">
							<button
								// className="w-full hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
								id="finalbutton"
								className="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 mt-4 rounded-md"
								onClick={deleteAccountOnClick}
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{t("deleteAccount")}{" "}
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
																{t("doyoureallywanttodeleteAccount")}
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
													{t("delete")}
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
				</div>
			</>
		</section>
	);
};

export default AccountSettings;
