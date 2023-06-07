import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HEIDI_Logo from "../Resource/HEIDI_Logo.png";
import { useTranslation } from "react-i18next";
import { updateProfile } from "../Services/usersApi";
import Alert from "../Components/Alert";

const PasswordUpdate = () => {
	const { t } = useTranslation();
	useEffect(() => {
		document.title = "Heidi - Update Password";
	}, []);

	const token =
		window.localStorage.getItem("accessToken") ||
		window.sessionStorage.getItem("accessToken");
	const userId =
		window.localStorage.getItem("userId") ||
		window.sessionStorage.getItem("userId");

	const [alertInfo, setAlertInfo] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertType, setAlertType] = useState("");
	let navigate = useNavigate();
	const routeChangeToSettings = () => {
		let path = `/AccountSettings`;
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
			setAlertMessage("Failed. " + err.response.data.message);
		}
	};

	const validateInput = (e) => {
		let { name, value } = e.target;
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
					} else if (input.confirmPassword && value !== input.confirmPassword) {
						stateObj["confirmPassword"] = t("passwordsDoNotMatch");
					} else {
						stateObj["confirmPassword"] = input.confirmPassword
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
		<div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div class="w-full max-w-md space-y-8">
				<div>
					<img
						onClick={() => navigate("/")}
						class="mx-auto h-20 w-auto cursor-pointer"
						src={HEIDI_Logo}
						alt="HEIDI"
					/>
					<h3 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
						{t("updatePassword")}
					</h3>
				</div>
				<form
					onSubmit={handleSubmit}
					class="mt-8 space-y-6"
					action="#"
					method="POST"
				>
					<input type="hidden" name="remember" value="true" />
					<div class="space-y-2 rounded-md shadow-sm">
						<div>
							<label for="password" class="sr-only">
								{t("oldPassword")}
							</label>
							<input
								name="oldPassword"
								type="password"
								value={input.oldPassword}
								onChange={onInputChange}
								onBlur={validateInput}
								required
								class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder={t("oldPassword")}
							></input>
							{error.oldPassword && (
								<span className="err">{error.oldPassword}</span>
							)}
						</div>
						<div>
							<label for="password" class="sr-only">
								{t("newPassword")}
							</label>
							<input
								name="password"
								type="password"
								value={input.password}
								onChange={onInputChange}
								onBlur={validateInput}
								required
								class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder={t("newPassword")}
							></input>
							{error.password && <span className="err">{error.password}</span>}
						</div>
						<div>
							<label for="password" class="sr-only">
								{t("confirmNewPassword")}
							</label>
							<input
								name="confirmPassword"
								type="password"
								value={input.confirmPassword}
								onChange={onInputChange}
								onBlur={validateInput}
								required
								class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
							class="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:text-slate-400 focus:outline-none focus:ring-2 focus:text-gray-400 focus:ring-offset-2"
						>
							<span class="absolute inset-y-0 left-0 flex items-center pl-3">
								<svg
									class="h-5 w-5 text-gray-50 group-hover:text-slate-400"
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
						<div class="py-2 mt-1 px-2">
							<Alert type={alertType} message={alertMessage} />
						</div>
					)}
				</form>
			</div>
		</div>
	);
};
export default PasswordUpdate;
