import React, { useState, useEffect } from "react";
import { verifyEmail } from "../Services/usersApi";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import HomePageNavBar from "../Components/HomePageNavBar";
import Footer from "../Components/Footer";

const VerifyEmail = () => {
	const { t, i18n } = useTranslation();
	window.scrollTo(0, 0);
	let navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};
	const [verifyState, setVerifyState] = useState("pending");
	useEffect(() => {
		var url = window.location;
		var access_token = new URLSearchParams(url.search).get("token");
		var userId = new URLSearchParams(url.search).get("userId");
		var lang = new URLSearchParams(url.search).get("lang");
		verifyEmail({
			token: access_token,
			userId: userId,
			language: "de"
		}).then((response) => {
			setRedirect(true);
			setVerifyState("success");
			setTimeout(() => {
				navigateTo("/login");
			}, 5000);
		}).catch((e) => {
			setVerifyState("failed");
		})
	}, []);

	const [count, setCount] = useState(5);
	const [redirect, setRedirect] = useState(false);
	useEffect(() => {
		const timer = setTimeout(() => {
			if (count > 0) {
				setCount(count - 1);
			} else {
				setRedirect(true);
				//window.location.href = '/';
			}
		}, 1000);
		return () => clearTimeout(timer);
	}, [count]);

	return (
		<section>
			<HomePageNavBar />
			{ verifyState == "success" ?
				<div>
					<div class="flex items-center justify-center">
						<h1 class=" m-auto mt-40 text-center font-sans font-bold text-2xl">
							The Email Verification was successfull !
						</h1>
					</div>

					<div class="flex items-center justify-center">
						<h1 class=" m-auto mt-20 text-center font-sans font-semibold text-lg">
							The Verification was successfull. Now you can use HEIDI to its full
							extend.
						</h1>
					</div>

					<div class="flex items-center justify-center">
						<button
							type="submit"
							onClick={() => navigateTo("/login")}
							class="w-96 mt-20 mx-auto rounded bg-black px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer font-sans"
						>
							{t("goback")}
						</button>
					</div>

					<div className="flex items-center justify-center">
						{redirect ? (
							<h1 class=" m-auto mt-20 text-center font-sans font-semibold text-lg">
								Please wait. It wont take much long
							</h1>
						) : (
							<h1 class=" m-auto mt-20 text-center font-sans font-semibold text-lg">
								Redirecting in ( {count} ) seconds...
							</h1>
						)}
					</div>
				</div> : verifyState == "pending" ? 
				<div>
					<div class="flex items-center justify-center">
						<h1 class=" m-auto mt-40 text-center font-sans font-bold text-2xl">
							Your Email is being verified
						</h1>
					</div>

					<div class="flex items-center justify-center">
						<h1 class=" m-auto mt-20 text-center font-sans font-semibold text-lg">
							Please wait till ypur email is verified.
						</h1>
					</div>
				</div> :
				<div>
					<div class="flex items-center justify-center">
						<h1 class=" m-auto mt-40 text-center font-sans font-bold text-2xl">
							The Email Verification was not succesful! Please try again later!!
						</h1>
					</div>
				</div>
			}
			<div className="fixed bottom-0 w-full">
				<Footer/>			
			</div>
		</section>
	);
};

export default VerifyEmail;
