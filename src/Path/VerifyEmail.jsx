import React, { useState, useEffect, useCallback } from "react";
import { verifyEmail } from "../Services/usersApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HomePageNavBar from "../Components/V2/HomePageNavBar";
import Footer from "../Components/Footer";
import RegionColors from "../Components/RegionColors";

const VerifyEmail = () => {
	const { t } = useTranslation();
	window.scrollTo(0, 0);
	const navigate = useNavigate();
	const navigateTo = useCallback(
		(path) => {
			if (path) {
				navigate(path);
			}
		},
		[navigate]
	);
	const [verifyState, setVerifyState] = useState("pending");
	const [makeVerifyEmailCall, setMakeVerifyEmailCall] = useState(false);
	const [token, setToken] = useState("");
	const [userId, setUserId] = useState(0);
	useEffect(() => {
		const params = new URLSearchParams(window.location.search);
		const urlToken = params.get("token");
		const urlUserId = params.get("userId");

		if (!urlToken || !urlUserId) {
			navigate('/login');
		} else {
			setToken(urlToken);
			setUserId(urlUserId);
			setMakeVerifyEmailCall(true);
		}
	}, []);

	const [count, setCount] = useState(10);
	const [redirect, setRedirect] = useState(false);

	useEffect(() => {
		if (makeVerifyEmailCall) {
			verifyEmail({
				token,
				userId,
				language: "de",
			})
				.then((response) => {
					setRedirect(true);
					setVerifyState("success");
					setTimeout(() => {
						navigateTo("/login");
					}, 5000);
				})
				.catch((e) => {
					setVerifyState("failed");
				});
		}
	}, [makeVerifyEmailCall]);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (count > 0) {
				setCount(count - 1);
			} else {
				setRedirect(true);
				// window.location.href = '/';
			}
		}, 1000);
		return () => clearTimeout(timer);
	}, [count]);

	return (
		<section>
			<HomePageNavBar />
			<div className="md:mt-40 mt-20 mb-20 p-6">
				{verifyState === "pending" ? (
					<div>
						<div className="mt-20 mb-20 py-30 text-center">
							<h1 className="text-5xl md:text-8xl lg:text-10xl text-center font-bold my-10 font-sans bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
								{t("youAreOnTheWay")}
							</h1>
							<h1 className=" m-auto mt-20 mb-20 text-center font-sans font-bold text-2xl">
								{t("email_being_verified")}
							</h1>
						</div>
						<div className="mt-20 mb-20 py-30 text-center">
							<div className="my-10 flex">
								<div className="relative mx-auto h-28 w-28 animate-[displace_5s_infinite] border border-blue-200">
									<div className="h-14 animate-[flip_5s_infinite] bg-blue-100"></div>
								</div>
							</div>
						</div>
					</div>
				) : verifyState === "success" ? (
					<div>
						<div className="mt-20 mb-20 py-30 text-center">
							<h1 className="text-5xl md:text-8xl lg:text-10xl text-center font-bold my-10 font-sans bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
								{t("success")}
							</h1>
							<h1 className=" m-auto mt-20 mb-20 text-center font-sans font-bold text-2xl">
								{t("email_verified")}
								{t("heidi_full_extend")}
							</h1>
						</div>

						<div className="mb-20 mt-20 py-30 text-center">
							<button
								type="submit"
								onClick={() => navigateTo("/login")}
								className={`w-full rounded-xl sm:w-80 mt-10 mx-auto ${RegionColors.darkBgColor} ${RegionColors.lightHoverShadowColor} px-8 py-2 text-base font-semibold text-white cursor-pointer font-sans`}
							>
								{t("goback")}
							</button>
						</div>

						<div className="mb-20 mt-20 py-30 text-center">
							{redirect ? (
								<h1 className=" m-auto mt-20 text-center font-sans font-semibold text-lg">
									{t("please_wait")}
								</h1>
							) : (
								<h1 className=" m-auto mt-20 text-center font-sans font-semibold text-lg">
									{t("redirecting_in")} ( {count} ) {t("seconds")}
								</h1>
							)}
						</div>
					</div>
				) : (
					<div>
						<div className="mt-20 mb-20 py-30 text-center">
							<h1 className="text-5xl md:text-8xl lg:text-10xl text-center font-bold my-20 py-2 font-sans bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
								{t("Failed")}
							</h1>
							<h1 className=" mx-auto mt-20 mb-20 text-center font-sans font-bold sm:text-2xl text-lg">
								{t("email_verification_not_succesfull")}
							</h1>
						</div>

						<div className="mt-20 mb-20 py-30 text-center">
							<button
								type="submit"
								onClick={() => navigateTo("/login")}
								className={`w-full rounded-xl sm:w-80 mt-10 mx-auto ${RegionColors.darkBgColor} ${RegionColors.lightHoverShadowColor} px-8 py-2 text-base font-semibold text-white cursor-pointer font-sans`}
							>
								{t("goback")}
							</button>
						</div>
					</div>
				)}
			</div>
			<div className="bottom-0 w-full">
				<Footer />
			</div>
		</section>
	);
};

export default VerifyEmail;
