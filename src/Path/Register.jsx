import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeidiLogo from "../assets/HEIDI_Logo.png";
import { useTranslation } from "react-i18next";
import { register } from "../Services/usersApi";
import Alert from "../Components/Alert";
import errorCodes from "../Constants/errorCodes";
import { role } from "../Constants/role";

const Register = () => {
	const { t } = useTranslation();
	const [alertInfo, setAlertInfo] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertType, setAlertType] = useState("");
	const [loading, setLoading] = useState(false);
	const errorMessages = {
		[errorCodes.EMPTY_PAYLOAD]: t("emptyData"),
		[errorCodes.MISSING_FIRSTNAME]: t("firstNameNotPresent"),
		[errorCodes.MISSING_LASTNAME]: t("lastNameNotPresent"),
		[errorCodes.MISSING_USERNAME]: t("usernameNotPresent"),
		[errorCodes.MISSING_PASSWORD]: t("passwordNotPresent"),
		[errorCodes.USER_ALREADY_EXISTS]: t("userAlreadyPresent"),
		[errorCodes.INVALID_USERNAME]: t("checkUsernameOrPassword"),
		[errorCodes.INVALID_PASSWORD]: t("checkUsernameOrPassword"),
		[errorCodes.EMAIL_ALREADY_EXISTS]: t("emailAlreadyRegistered"),
		[errorCodes.EMAIL_NOT_VERIFIED]: t("emailNotVerified"),
	};

	useEffect(() => {
		document.title = process.env.REACT_APP_REGION_NAME + " " + t("register");
	}, []);

	const navigate = useNavigate();
	const routeChangeToLogin = () => {
		const path = `/login`;
		navigate(path);
	};

	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	const [isChecked, setIsChecked] = useState(false);

	const [input, setInput] = useState({
		firstname: "",
		lastname: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const [error, setError] = useState({
		firstname: "",
		lastname: "",
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const onInputChange = (e) => {
		const { name, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
		validateInput(e);
	};

	input.role = role.User;

	const handleSubmit = async (event) => {
		event.preventDefault();
		setLoading(true);
		try {
			if (Object.values(error).filter((e) => e !== "").length > 0) {
				setAlertInfo(true);
				setAlertType("danger");
				setAlertMessage(Object.values(error).filter((e) => e !== "")[0]);
			} else {
				await register(input);
				setAlertInfo(true);
				setAlertType("success");
				setAlertMessage(
					t("registraionSuccessful") +
					`\n ${t("registrationRedirectMessage")}`
				);
				setTimeout(() => {
					routeChangeToLogin();
				}, 10000);
			}
		} catch (err) {
			setAlertInfo(true);
			setAlertType("danger");
			const alertMessage = errorMessages[err.response.data.errorCode] || t("somethingWrong");
			setAlertMessage(alertMessage);
		} finally {
			setLoading(false);
		}
	};

	const validateInput = (e) => {
		const { name, value } = e.target;
		setError((prev) => {
			const stateObj = { ...prev, [name]: "" };

			switch (name) {
				case "username":
					if (!value) {
						stateObj[name] = t("pleaseEnterUsername");
					} else if (value.length < 6) {
						stateObj[name] = t("userNameTooShort");
					} else if (value.length > 15) {
						stateObj[name] = t("userNameTooLong");
					} else if (
						value[0] === value[0].toUpperCase() ||
						/\s/.test(value) ||
						/^_/.test(value) ||
						/^[^a-z_]/.test(value) ||
						/[&='+,;<>.]/.test(value)
					) {
						stateObj[name] = t("userNameValidation");
					}
					break;
				case "email":
					if (!value) {
						stateObj[name] = t("pleaseEnterEmailAddress");
					}
					break;
				case "password":
					if (!value) {
						stateObj[name] = t("pleaseEnterPassword");
					} else if (
						!/^\S{8,}$/.test(value)
					) {
						stateObj[name] = t("passwordValidation");
					} else if (input.confirmPassword && value !== input.confirmPassword) {
						stateObj.confirmPassword = t("passwordsDoNotMatch");
					} else if (value.includes(input.username)) {
						stateObj[name] = t("passwordContainsUsername");
					} else {
						stateObj.confirmPassword = input.confirmPassword
							? ""
							: error.confirmPassword;
					}
					break;

				case "confirmPassword":
					if (!value) {
						stateObj[name] = t("pleaseConfirmPassword");
					} else if (input.password && value !== input.password) {
						stateObj[name] = t("passwordsDoNotMatch");
					}
					break;

				default:
					break;
			}

			return stateObj;
		});
	};

	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => {
		setIsOpen(true);
	};

	const closeModal = () => {
		setIsOpen(false);
	};

	return (
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
					<h3 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
						{t("createAccount")}
					</h3>
				</div>
				<form className="mt-8 space-y-6" onSubmit={handleSubmit}>
					<input type="hidden" name="remember" value="true" />
					<div className="space-y-2 rounded-md shadow-sm">
						<div>
							<span className="grid grid-cols-2 gap-2">
								<label htmlFor="firstname" className="sr-only">
									{t("firstName")}
								</label>
								<input
									name="firstname"
									value={input.firstname}
									type="text"
									required
									onChange={onInputChange}
									onBlur={validateInput}
									autoComplete="on"
									placeholder={t("pleaseEnterFirstName") + "*"}
									className="appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								></input>
								<label htmlFor="lastname" className="sr-only">
									{t("lastName")}
								</label>
								<input
									name="lastname"
									value={input.lastname}
									type="text"
									required
									onChange={onInputChange}
									onBlur={validateInput}
									autoComplete="on"
									placeholder={t("pleaseEnterLastName") + "*"}
									className="appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								></input>
							</span>
						</div>
						<div>
							<label htmlFor="username" className="sr-only">
								{t("username") + "*"}
							</label>
							<input
								id="username"
								name="username"
								value={input.username}
								type="text"
								autoComplete="on"
								onChange={onInputChange}
								onBlur={validateInput}
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder={t("pleaseEnterUsername") + "*"}
							></input>
							{error.username && <span className="err">{error.username}</span>}
						</div>
						<div>
							<label htmlFor="email-address" className="sr-only">
								{t("email") + "*"}
							</label>
							<input
								id="emailaddress"
								name="email"
								type="email"
								value={input.email}
								onChange={onInputChange}
								onBlur={validateInput}
								autoComplete="email"
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder={t("pleaseEnterEmailAddress") + "*"}
							></input>
							{error.email && <span className="err">{error.email}</span>}
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								{t("password") + "*"}
							</label>
							<input
								name="password"
								type="password"
								value={input.password}
								onChange={onInputChange}
								onBlur={validateInput}
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder={t("pleaseEnterPassword") + "*"}
							></input>
							{error.password && <span className="err">{error.password}</span>}
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								{t("confirmPassword")}
							</label>
							<input
								name="confirmPassword"
								type="password"
								value={input.confirmPassword}
								onChange={onInputChange}
								onBlur={validateInput}
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder={t("pleaseConfirmPassword") + "*"}
							></input>
							{error.confirmPassword && (
								<span className="err">{error.confirmPassword}</span>
							)}
						</div>
					</div>

					<div className="flex items-center justify-between">
						<div className="flex items-center">
							<input
								name="remember-me"
								type="checkbox"
								onChange={() => setIsChecked(!isChecked)}
								className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
								required
							/>
							<label
								htmlFor="remember-me"
								className="ml-2 block text-sm text-gray-900"
							>
								{t("i_hereby_accept_the")}
								<a
									onClick={() => {
										navigateTo("/PrivacyPolicy");
									}}
									target="_blank"
									rel="noopener noreferrer"
									className="text-red-500 hover:text-red-300"
								>
									{t("privacy_policy")}
								</a>
								{t("and_the")}
								<a
									onClick={() => {
										navigateTo("/ImprintPage");
									}}
									className="text-red-500 hover:text-red-300"
								>
									{t("terms_conditions")}
								</a>
							</label>
						</div>
					</div>

					{loading ? (
						<button type="button" className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white  hover:text-slate-400 focus:outline-none focus:ring-2 focus:text-gray-400 focus:ring-offset-2">
							<span className="absolute inset-y-0 left-0 flex items-center pl-3">
								<svg aria-hidden="true" className="w-5 h-5 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
									<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
								</svg>
							</span>
							{t("processing")}
						</button>
					) : (
						<div>
							<button
								type="submit"
								id="finalbutton"
								className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white  hover:text-slate-400 focus:outline-none focus:ring-2 focus:text-gray-400 focus:ring-offset-2"
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
								{t("register")}
							</button>
						</div>
					)}

					{alertInfo && (
						<div className="py-2 mt-1 px-2">
							<Alert type={alertType} message={alertMessage} />
						</div>
					)}

					<div className="flex justify-between">
						<div className="text-sm">
							{t("accountPresent")}
							<span
								onClick={routeChangeToLogin}
								className="font-medium cursor-pointer text-black hover:text-gray-500"
							>
								{t("loginHere")}
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
													{t("anleitung")}
												</h2>
												<h3 className="font-bold text-lg text-center mb-4">
													{t("resgistrationInTheApp")}
												</h3>
												<p className="mb-6">
													<strong>{t("schritt")} 1:</strong> {t("nameOrPass")}{" "}
												</p>
												<p className="mb-6">
													<strong>{t("schritt")} 2:</strong> {t("addEmail")}
												</p>
												<p className="mb-6">
													<strong>{t("schritt")} 3:</strong> {t("verifyEmail")}
												</p>
												<p className="mb-6">
													<strong>{t("schritt")} 4:</strong> {t("verified")}
												</p>
												<p className="mb-6">
													{t("enjoyApp")}
												</p>
												<p className="mb-6">
													<strong>{t("danke")}</strong>
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
				</form>
			</div>
		</div>
	);
};
export default Register;
