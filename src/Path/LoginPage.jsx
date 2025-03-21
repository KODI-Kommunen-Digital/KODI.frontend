import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../index.css";
import { useTranslation } from "react-i18next";
import HeidiLogo from "../assets/HEIDI_Logo.png";
import { resetPass, login, sendVerificationEmail } from "../Services/usersApi";
import Alert from "../Components/Alert";
import errorCodes from "../Constants/errorCodes";

const LoginPage = () => {
	const { t } = useTranslation();
	const TIMEOUT_DURATION = 5000;
	const userRef = useRef();
	const [rememberMe, setRememberMe] = useState(false);
	const [forgotPassword, setForgotPassword] = useState(false);
	const [mailNotRecieved, setMailNotRecieved] = useState(false);
	const [sendEmail, setSendEmail] = useState(false);
	const [alertInfo, setAlertInfo] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertType, setAlertType] = useState("");
	const [user, setUser] = useState("");
	const [userReset, setUserReset] = useState("");
	const [pwd, setPwd] = useState("");
	const [loginLoading, setLoginLoading] = useState("");
	const [forgotPasswordLoading, setForgotPasswordLoading] = useState("");
	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	const routeChangeToUpload = useCallback(() => {
		const path = `/UploadListings`;
		navigate(path);
	}, [navigate]);
	const routeChangeToRegister = () => {
		const path = `/Register`;
		navigate(path);
	};
	const location = useLocation();
	const [timeOutAlertMessage, settimeOutAlertMessage] = useState("");
	useEffect(() => {
		document.title = process.env.REACT_APP_REGION_NAME + " " + t("login");
		const searchParams = new URLSearchParams(location.search);

		userRef.current.focus();
		const accessToken =
			window.localStorage.getItem("accessToken") ||
			window.sessionStorage.getItem("accessToken");
		const refreshToken =
			window.localStorage.getItem("refreshToken") ||
			window.sessionStorage.getItem("refreshToken");
		if (accessToken?.length === 456 || refreshToken?.length === 456) {
			routeChangeToUpload();
		}

		if (searchParams.get("sessionExpired") === "true") {
			settimeOutAlertMessage(t("sessionExpired"));
			setAlertType("danger");
			setTimeout(() => {
				settimeOutAlertMessage("");
			}, TIMEOUT_DURATION);
		}
	}, [routeChangeToUpload, location]);

	const [showPassword, setShowPassword] = useState(false);

	const handlePasswordChange = (event) => {
		setPwd(event.target.value);
	};

	const toggleShowPassword = () => {
		setShowPassword(!showPassword);
	};

	const onCancel = () => {
		setForgotPassword(false);
		setSendEmail(false);
		setMailNotRecieved(false);
		setAlertInfo(false);
		setUserReset("");
		setAlertMessage("");
		setRememberMe(false);
	};

	const emailNotVerified = async () => {
		try {
			await sendVerificationEmail({ email: userReset });
			setAlertInfo(true);
			setAlertType("success");
			setAlertMessage(t("checkYourmail"))
		} catch (err) {
			setAlertInfo(true);
			setAlertType("danger");
			setAlertMessage(t("somethingWrong"));
		};
	}

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoginLoading(true);
		try {
			const response = await login({ username: user, password: pwd });
			setLoginLoading(false);

			const accessToken = response.data.data.accessToken;
			const refreshToken = response.data.data.refreshToken;
			const userId = response.data.data.userId;
			const cityUsers = response.data.data.cityUsers;

			if (rememberMe) {
				window.localStorage.setItem("accessToken", accessToken);
				window.localStorage.setItem("refreshToken", refreshToken);
				window.localStorage.setItem("userId", userId);
				window.localStorage.setItem("cityUsers", JSON.stringify(cityUsers));
			} else {
				window.sessionStorage.setItem("accessToken", accessToken);
				window.sessionStorage.setItem("refreshToken", refreshToken);
				window.sessionStorage.setItem("userId", userId);
				window.sessionStorage.setItem("cityUsers", JSON.stringify(cityUsers));
			}

			setUser("");
			setPwd("");
			setRememberMe(false);
			navigateTo("/");
		} catch (err) {
			setLoginLoading(false);
			setAlertInfo(true);
			setAlertType("danger");
			const errorCode = err.response?.data?.errorCode;

			switch (errorCode) {
				case errorCodes.EMPTY_PAYLOAD:
					setAlertMessage(t("usernamePasswordNotPresent"));
					break;
				case errorCodes.MISSING_USERNAME:
					setAlertMessage(t("usernameNotPresent"));
					break;
				case errorCodes.MISSING_PASSWORD:
					setAlertMessage(t("passwordNotPresent"));
					break;
				case errorCodes.INVALID_USERNAME:
				case errorCodes.INVALID_PASSWORD:
				case errorCodes.INVALID_CREDENTIALS:
					setAlertMessage(t("checkUsernameOrPassword"));
					break;
				case errorCodes.EMAIL_NOT_VERIFIED:
					setMailNotRecieved(true);
					setAlertMessage(t("emailNotVerified"));
					break;
				default:
					setAlertMessage(t("somethingWrong"));
					break;
			}
		}
	};

	const handleKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleSubmit(e);
		}
	};

	const passwordReset = async (event) => {
		event.preventDefault();
		setForgotPasswordLoading(true);
		try {
			await resetPass({ username: userReset, language: "de" });
			setForgotPasswordLoading(false);
			setAlertInfo(true);
			setAlertType("success");
			setAlertMessage(t("checkYourmail"))
		} catch (err) {
			setForgotPasswordLoading(false);
			setAlertInfo(true);
			setAlertType("danger");
			setAlertMessage(t("somethingWrong"));
		}
	};

	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
		<div>
			<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					<div>
						<img
							onClick={() => navigate("/")}
							className="mx-auto h-20 w-auto cursor-pointer"
							// src={process.env.REACT_APP_BUCKET_HOST + "admin/logo.png"}
							src={HeidiLogo}
							alt="HEDI- Heimat Digital"
						/>
						<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-800">
							{t("signIntoAccount")}
						</h2>
					</div>
					<div className="mt-8 space-y-6">
						<input type="hidden" name="remember" value="true" />
						<div className="space-y-2 rounded-md shadow-sm">
							<div>
								<label htmlFor="username" className="sr-only">
									{t("username")}
								</label>
								<input
									type="text"
									id="username"
									ref={userRef}
									name="username"
									value={user}
									autoComplete="on"
									onChange={(e) => setUser(e.target.value)}
									onKeyDown={handleKeyDown}
									required
									className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-slate-800 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
									placeholder={t("usernameOrEmail") + "*"}
								/>
							</div>
							<div className="relative flex items-center">
								<label htmlFor="password" className="sr-only">
									{t("password")}
								</label>
								<input
									type={showPassword ? "text" : "password"}
									id="password"
									name="password"
									value={pwd}
									onChange={handlePasswordChange}
									onKeyDown={handleKeyDown}
									required
									className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 pr-12 text-slate-800 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
									placeholder={t("pleaseEnterPassword") + "*"}
									style={{ paddingRight: '3rem' }}
								/>
								<button
									type="button"
									className="absolute right-0 mr-3 flex font-bold items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
									onClick={toggleShowPassword}
									style={{ zIndex: 20 }}
								>
									{showPassword ?
										<svg className="h-6 text-black" fill="none" xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 640 512">
											<path fill="currentColor"
												d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z">
											</path>
										</svg> :
										<svg className="h-6 text-black" fill="none" xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 576 512">
											<path fill="currentColor"
												d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z">
											</path>
										</svg>
									}
									{/* {showPassword ? t("hide") : t("show")} */}
								</button>
							</div>
						</div>

						<div className="flex items-center justify-between">
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
									defaultChecked={rememberMe}
									onChange={() => {
										setRememberMe(!rememberMe);
									}}
								/>
								<label
									htmlFor="remember-me"
									className="ml-2 block text-sm text-slate-800"
								>
									{t("rememberMe")}
								</label>
							</div>

							<div className="text-sm">
								<span
									onClick={() => setForgotPassword(true)}
									className="font-medium text-black cursor-pointer hover:text-blue-400"
								>
									{t("forgotYourPassword")}
								</span>
							</div>
						</div>

						<div>
							<button
								onClick={handleSubmit}
								type="button"
								value="Submit"
								id="finalbutton"
								disabled={loginLoading}
								className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:text-slate-400 disabled:opacity-60 focus:outline-none focus:ring-2 focus:text-gray-400 focus:ring-offset-2"
							>
								<span className="absolute inset-y-0 left-0 flex items-center pl-3">
									<svg
										className="h-5 w-5 text-gray-50 group-hover:text-slate-400"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true"
									>
										<path
											fillRule="evenodd"
											d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z"
											clipRule="evenodd"
										/>
									</svg>
								</span>
								{t("signIn")}
								{loginLoading && (
									<svg
										aria-hidden="true"
										className="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
										viewBox="0 0 100 101"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
											fill="currentColor"
										/>
										<path
											d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
											fill="currentFill"
										/>
									</svg>
								)}
							</button>
						</div>
						{alertInfo && (
							<div className="py-2 mt-1 px-2">
								<Alert type={alertType} message={alertMessage} />
							</div>
						)}
						{timeOutAlertMessage && (
							<div className="py-2 mt-1 px-2">
								<Alert type={alertType} message={timeOutAlertMessage} />
							</div>
						)}
						{mailNotRecieved && (<div className="flex justify-between">
							<div className="text-sm">
								{t("resendEmailVerification")}
								<span
									onClick={() => {
										setSendEmail(true);
										setForgotPassword(false);
									}}
									className="font-medium cursor-pointer text-black hover:text-blue-400"
								>
									{t("click_here")}
								</span>
							</div>
						</div>)}
						<div className="flex justify-between">
							<div className="text-sm">
								{t("notMember")}
								<span
									onClick={routeChangeToRegister}
									className="font-medium cursor-pointer text-black hover:text-slate-400"
								>
									{" "}
									{t("clickToRegister")}
								</span>
							</div>

							<div className="flex cursor-pointer">
								<span
									onClick={openModal}
									className="hover:text-blue-400 text-black font-bold px-4 rounded-xl"
								>
									{t("Help")}
								</span>

								{isOpen && (
									<div className="fixed inset-0 flex items-center justify-center z-50">
										<div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

										<div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
											<div className="modal-content py-4 text-left px-6">
												<div>
													<h2 className="font-bold text-xl text-center mb-6">
														{t("anleitung")}
													</h2>
													<h3 className="font-bold text-lg text-center mb-6">
														{t("subtitle")}
													</h3>
													<p className="mb-6" dangerouslySetInnerHTML={{ __html: t("step1") }}></p>
													<p className="mb-6" dangerouslySetInnerHTML={{ __html: t("step2") }}></p>
													<p className="mb-6" dangerouslySetInnerHTML={{ __html: t("step3") }}></p>
													<p className="mb-6" dangerouslySetInnerHTML={{ __html: t("step4") }}></p>
													<p className="font-bold text-lg text-center mb-6">
														<strong>{t("thankYou")}</strong>
													</p>
												</div>

												<div className="mt-6 text-center">
													<button
														onClick={closeModal}
														className="hover:bg-gray-800 text-white font-bold py-1 px-3 rounded bg-black disabled:opacity-60"
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
					{(forgotPassword || sendEmail) && (
						<>
							<div id="myDIV" className="text-sm space-y-4">
								{forgotPassword ? t("forgotPasswordMessage") : sendEmail ? t("enter_email") : null}
								<label htmlFor="username" className="sr-only">
									{t("username")}
								</label>
								<input
									type="text"
									id="username"
									name="username"
									value={userReset}
									onChange={(e) => setUserReset(e.target.value)}
									required
									className="mt-1 mb-1 relative block w-full appearance-none rounded-md shadow-sm border border-gray-300 px-3 py-2 text-slate-800 hover:scale-102 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
									placeholder={forgotPassword ? t("usernameOrEmail") : t("pleaseEnterEmailAddress") + "*"}
								/>
								<div className="flex gap-2">
									<button
										type="button"
										id="finalbutton"
										onClick={forgotPassword ? passwordReset : sendEmail ? emailNotVerified : null}
										disabled={forgotPasswordLoading}
										className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:text-slate-400 focus:outline-none focus:ring-2 focus:text-gray-400 focus:ring-offset-2 disabled:opacity-60"
									>
										{t("sendLink")}
										{forgotPasswordLoading && (
											<svg
												aria-hidden="true"
												className="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
												viewBox="0 0 100 101"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
													fill="currentColor"
												/>
												<path
													d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
													fill="currentFill"
												/>
											</svg>
										)}
									</button>
									<button
										type="Cancel"
										id="finalbutton"
										onClick={onCancel}
										disabled={forgotPasswordLoading}
										className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:text-slate-400 focus:outline-none focus:ring-2 focus:text-gray-400 focus:ring-offset-2 disabled:opacity-60"
									>
										{t("cancel")}
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</div >
	);
};
export default LoginPage;
