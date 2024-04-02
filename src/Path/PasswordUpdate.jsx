import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HeidiLogo from "../assets/HEIDI_Logo.png";
import { useTranslation } from "react-i18next";
import { updateProfile } from "../Services/usersApi";
import Alert from "../Components/Alert";
import errorCodes from "../Constants/errorCodes";

const PasswordUpdate = () => {
	const { t } = useTranslation();
	useEffect(() => {
		document.title =
			process.env.REACT_APP_REGION_NAME + " " + t("updatePassword");
	}, []);

	const [alertInfo, setAlertInfo] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertType, setAlertType] = useState("");
	const navigate = useNavigate();
	const routeChangeToSettings = () => {
		const path = `/AccountSettings`;
		navigate(path);
	};

	const [input, setInput] = useState({
		oldPassword: "",
		password: "",
		confirmPassword: "",
	});

	const [error, setError] = useState({
		oldPassword: "",
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

	const handleSubmit = async (event) => {
		event.preventDefault();

		try {
			await updateProfile({
				newPassword: input.password,
				currentPassword: input.oldPassword,
			});
			setAlertInfo(true);
			setAlertType("success");
			setAlertMessage("Your password is updated");
			routeChangeToSettings();
		} catch (err) {
			setAlertInfo(true);
			setAlertType("danger");
			let errorMessage = err.response.data.message
			if (err.response.data.errorCode === errorCodes.INVALID_PASSWORD)
				errorMessage = t("incorrectPassword")
			if (err.response.data.errorCode === errorCodes.SAME_PASSWORD_GIVEN)
				errorMessage = t("samePassword")
			setAlertMessage("Failed. " + errorMessage);
		}
	};

	const validateInput = (e) => {
		const { name, value } = e.target;
		setError((prev) => {
			const stateObj = { ...prev, [name]: "" };

			switch (name) {
				case "oldPassword":
					if (!value) {
						stateObj[name] = t("pleaseEnterOldPassword");
					}
					break;
				case "password":
					if (!value) {
						stateObj[name] = t("pleaseEnterNewPassword");
					} else if (
						!/^\S{8,}$/.test(value)
					) {
						stateObj[name] = t("passwordValidation");
					} else if (value.includes(input.username)) {
						stateObj[name] = t("passwordContainsUsername");
					} else if (input.confirmPassword && value !== input.confirmPassword) {
						stateObj.confirmPassword = t("passwordsDoNotMatch");
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

	return (
		<div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="w-full max-w-md space-y-8">
				<div>
					<img
						onClick={() => navigate("/")}
						className="mx-auto h-20 w-auto cursor-pointer"
						src={HeidiLogo}
						alt="HEIDI"
					/>
					<h3 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
						{t("updatePassword")}
					</h3>
				</div>
				<form
					onSubmit={handleSubmit}
					className="mt-8 space-y-6"
					action="#"
					method="POST"
				>
					<input type="hidden" name="remember" value="true" />
					<div className="space-y-2 rounded-md shadow-sm">
						<div>
							<label htmlFor="password" className="sr-only">
								{t("oldPassword")}
							</label>
							<input
								name="oldPassword"
								type="password"
								value={input.oldPassword}
								onChange={onInputChange}
								onBlur={validateInput}
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder={t("oldPassword")}
							></input>
							{error.oldPassword && (
								<span className="err">{error.oldPassword}</span>
							)}
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								{t("newPassword")}
							</label>
							<input
								name="password"
								type="password"
								value={input.password}
								onChange={onInputChange}
								onBlur={validateInput}
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder={t("newPassword")}
							></input>
							{error.password && <span className="err">{error.password}</span>}
						</div>
						<div>
							<label htmlFor="password" className="sr-only">
								{t("confirmNewPassword")}
							</label>
							<input
								name="confirmPassword"
								type="password"
								value={input.confirmPassword}
								onChange={onInputChange}
								onBlur={validateInput}
								required
								className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder={t("confirmNewPassword")}
							></input>
							{error.confirmPassword && (
								<span className="err">{error.confirmPassword}</span>
							)}
						</div>
					</div>

					<div>
						<button
							type="submit"
							id="finalbutton"
							className="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:text-slate-400 focus:outline-none focus:ring-2 focus:text-gray-400 focus:ring-offset-2"
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
							{t("updatePassword")}
						</button>
					</div>
					{alertInfo && (
						<div className="py-2 mt-1 px-2">
							<Alert type={alertType} message={alertMessage} />
						</div>
					)}
				</form>
			</div>
		</div>
	);
};
export default PasswordUpdate;
