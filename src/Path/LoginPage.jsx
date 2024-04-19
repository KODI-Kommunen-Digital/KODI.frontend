import React, { useRef, useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import HeidiLogo from "../assets/HEIDI_Logo.png";
import kodiLogo from "../assets/KODILOGO.png";
import "../index.css";
import { useTranslation } from "react-i18next";
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
			const response = await login({
				username: user,
				password: pwd,
			});
			setLoginLoading(false);
			if (rememberMe) {
				window.localStorage.setItem(
					"accessToken",
					response.data.data.accessToken
				);
				window.localStorage.setItem(
					"refreshToken",
					response.data.data.refreshToken
				);
				window.localStorage.setItem("userId", response.data.data.userId);
				window.localStorage.setItem(
					"cityUsers",
					JSON.stringify(response.data.data.cityUsers)
				);
			} else {
				window.sessionStorage.setItem(
					"accessToken",
					response.data.data.accessToken
				);
				window.sessionStorage.setItem(
					"refreshToken",
					response.data.data.refreshToken
				);
				window.sessionStorage.setItem("userId", response.data.data.userId);
				window.localStorage.setItem(
					"cityUsers",
					JSON.stringify(response.data.data.cityUsers)
				);
			}
			setUser("");
			setPwd("");
			setRememberMe(false);

			if (window.sessionStorage.getItem("path")) {
				navigate(window.sessionStorage.getItem("path"));
				sessionStorage.removeItem("path");
			} else if (window.sessionStorage.getItem("redirectTo")) {
				navigate(window.sessionStorage.getItem("redirectTo"));
			} else {
				localStorage.setItem("selectedItem", t("chooseOneCategory"));
				routeChangeToUpload();
			}
		} catch (err) {
			setLoginLoading(false);
			setAlertInfo(true);
			setAlertType("danger");
			if (err.response.data.errorCode === errorCodes.EMPTY_PAYLOAD) {
				setAlertMessage(t("usernamePasswordNotPresent"));
			} else if (err.response.data.errorCode === errorCodes.MISSING_USERNAME) {
				setAlertMessage(t("usernameNotPresent"));
			} else if (err.response.data.errorCode === errorCodes.MISSING_PASSWORD) {
				setAlertMessage(t("passwordNotPresent"));
			} else if (
				err.response.data.errorCode === errorCodes.INVALID_USERNAME ||
				err.response.data.errorCode === errorCodes.INVALID_PASSWORD ||
				err.response.data.errorCode === errorCodes.INVALID_CREDENTIALS
			) {
				setAlertMessage(t("checkUsernameOrPassword"));
			} else if (
				err.response.data.errorCode === errorCodes.EMAIL_NOT_VERIFIED
			) {
				setMailNotRecieved(true);
				setAlertMessage(t("emailNotVerified"));
			} else {
				setAlertMessage(t("somethingWrong"));
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
		<div className="i">
			<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
				<div className="w-full max-w-md space-y-8">
					<div>
						{process.env.REACT_APP_NAME === 'KODI - DEMO' ? (
							<img
								onClick={() => navigate("/")}
								className="mx-auto h-20 w-auto cursor-pointer"
								src={kodiLogo}
								alt="KODI Logo"
							/>
						) : (
							<img
								onClick={() => navigate("/")}
								className="mx-auto h-20 w-auto cursor-pointer"
								src={HeidiLogo}
								alt="Heidi Logo"
							/>
						)}
						<h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
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
									className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
									placeholder={t("usernameOrEmail") + "*"}
								/>
							</div>
							<div className="relative">
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
									className=" block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
									placeholder={t("pleaseEnterPassword") + "*"}
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 hover:text-gray-700 focus:outline-none"
									onClick={toggleShowPassword}
								>
									{showPassword ? t("hide") : t("show")}
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
									className="ml-2 block text-sm text-gray-900"
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
									className="font-medium cursor-pointer text-black hover:text-blue-400"
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
													<h2 className="font-bold text-xl text-center mb-4">
														Anleitung
													</h2>
													<h3 className="font-bold text-lg text-center mb-4">
														Registrieren in der App
													</h3>
													<p className="mb-6">
														<strong>Schritt 1:</strong> Nutzername und Passwort
														festlegen{" "}
													</p>
													<p className="mb-6">
														<strong>Schritt 2:</strong> Es wird Ihnen eine
														E-Mail gesendet an die Mail, die Sie eingegeben
														haben
													</p>
													<p className="mb-6">
														<strong>Schritt 3:</strong> Bitte verifizieren Sie
														die Mail, indem Sie in Ihr Postfach gehen und den
														Bestätigungslink drücken
													</p>
													<p className="mb-6">
														<strong>Schritt 4:</strong> Ihr Account ist
														verifiziert und Sie können sich mit Ihren
														Login-Daten einloggen
													</p>
													<p className="mb-6">
														Wir wünschen Ihnen viel Spaß beim Benutzen der App!
													</p>
													<p className="mb-6">
														<strong>Danke!!</strong>
													</p>
												</div>

												<div className="mt-4 text-center">
													<button
														onClick={closeModal}
														className="hover:bg-slate-600 text-white font-bold py-1 px-3 rounded bg-black disabled:opacity-60"
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
									className="mt-1 mb-1 relative block w-full appearance-none rounded-md shadow-sm border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
