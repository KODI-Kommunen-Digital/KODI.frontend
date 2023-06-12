import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HEIDI_Logo from "../Resource/HEIDI_Logo.png";
import { updatePassword } from "../Services/usersApi";
import { useTranslation } from "react-i18next";
import Alert from "../Components/Alert";

const PasswordForgot = () => {
	const { t } = useTranslation();

	const searchParams = new URLSearchParams(window.location.search);
	const token = searchParams.get("token");
	const userId = searchParams.get("userId");

	const [updatingPassword, setUpdatingPassword] = useState(false);
	const [alertInfo, setAlertInfo] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertType, setAlertType] = useState("");

	useEffect(() => {
		document.title = "Heidi - Update Password";
	}, []);

	let navigate = useNavigate();
	const routeChangeToLogin = () => {
		let path = `/login`;
		navigate(path);
	};

	const [input, setInput] = useState({
		password: "",
		confirmPassword: "",
	});

	const [error, setError] = useState({
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

	const validateInput = (e) => {
		let { name, value } = e.target;
		setError((prev) => {
			const stateObj = { ...prev, [name]: "" };

			switch (name) {
				case "password":
					if (!value) {
						stateObj[name] = "Please enter new Password.";
					} else if (input.confirmPassword && value !== input.confirmPassword) {
						stateObj["confirmPassword"] =
							"Password and Confirm Password does not match.";
					} else {
						stateObj["confirmPassword"] = input.confirmPassword
							? ""
							: error.confirmPassword;
					}
					break;

				case "confirmPassword":
					if (!value) {
						stateObj[name] = "Please enter Confirm Password.";
					} else if (input.password && value !== input.password) {
						stateObj[name] = "Password and Confirm Password does not match.";
					}
					break;

				default:
					break;
			}

			return stateObj;
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		try {
			setUpdatingPassword(true);
			await updatePassword({
				userId: userId,
				token: token,
				password: input.password,
			});
			setUpdatingPassword(false);
			setAlertInfo(true);
			setAlertType("success");
			setAlertMessage("Your password is updated. Redirecting to login in 5s");
			setTimeout(() => {
				routeChangeToLogin();
			}, 5000);
		} catch (err) {
			setUpdatingPassword(false);
			setAlertInfo(true);
			setAlertType("danger");
			setAlertMessage("Failed. " + err.response.data.message);
		}
	};

	return (
		<div class="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div class="w-full max-w-md space-y-8">
				<div>
					<img
						onClick={() => navigate("/")}
						class="mx-auto h-20 w-auto cursor-pointer"
						src={HEIDI_Logo}
						alt="Your Company"
					/>
					<h3 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
						{t("create_new_password")}
					</h3>
				</div>
				<div class="mt-8 space-y-6" action="#" method="POST">
					<input type="hidden" name="remember" value="true" />
					<div class="space-y-2 rounded-md shadow-sm">
						<div>
							<label htmlFor="password" class="sr-only">
								{t("newPassword")}
							</label>
							<input
								name="password"
								value={input.password}
								onChange={onInputChange}
								onBlur={validateInput}
								type="password"
								autoComplete="current-password"
								required
								class="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 hover:scale-102 hover:border-sky-800 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-indigo-500 sm:text-sm"
								placeholder={t("pleaseEnterPassword")}
							></input>
							{error.password && <span className="err">{error.password}</span>}
						</div>
						<div>
							<label htmlFor="password" class="sr-only">
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
								placeholder={t("pleaseConfirmPassword")}
							></input>
							{error.confirmPassword && (
								<span className="err">{error.confirmPassword}</span>
							)}
						</div>
					</div>
					<div>
						<button
							onClick={handleSubmit}
							type="button"
							id="finalbutton"
							disabled={updatingPassword}
							class="group relative flex w-full justify-center rounded-md border border-transparent bg-black py-2 px-4 text-sm font-medium text-white hover:text-slate-400 focus:outline-none focus:ring-2 focus:text-gray-400 focus:ring-offset-2 disabled:opacity-60"
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
							{updatingPassword && (
								<svg
									aria-hidden="true"
									class="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
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
						<div class="py-2 mt-1 px-2">
							<Alert type={alertType} message={alertMessage} />
						</div>
					)}
					<div class="text-sm">
						{t("accountPresent")}
						<span
							onClick={routeChangeToLogin}
							class="font-medium cursor-pointer text-black hover:text-gray-500"
						>
							{t("loginHere")}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
export default PasswordForgot;
