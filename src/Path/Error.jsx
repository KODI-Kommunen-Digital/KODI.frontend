import React from "react";
import logo from "../assets/HEIDI_Logo_Landscape.png";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Error = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	return (
		<div
			className="fixed inset-0 flex items-center justify-center bg-white"
			style={{ animation: "gradientFlow 10s linear infinite alternate" }}
		>
			<div className="bg-black text-white p-10 rounded-lg shadow-lg w-full max-w-xl md:max-w-2xl lg:max-w-4xl h-full md:h-auto transform hover:-translate-y-2 transition-all duration-300">
				<img
					className="h-20 md:h-40 mx-auto"
					src={logo}
					alt="HEDI- Heimat Digital"
				/>
				<div className="text-center">
					<h1 className="text-8xl md:text-8xl lg:text-10xl text-center font-bold py-10 font-sans bg-white text-transparent bg-clip-text">
						404
					</h1>
					<p className="text-3xl py-10 md:text-4xl">{t("pageNotFound")}</p>
					<a
						onClick={() => navigateTo("/")}
						className="w-full rounded-xl sm:w-80 mt-10 mx-auto bg-white px-8 py-2 text-base font-semibold text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer font-sans"
						style={{ fontFamily: "Poppins, sans-serif" }}
					>
						{t("goBack")}
					</a>
				</div>
			</div>
		</div>
	);
};

export default Error;
