import React from "react";
// import logo from "../assets/HEIDI_Logo_Landscape.png";
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
		// <div
		// 	className="fixed inset-0 flex items-center justify-center bg-white"
		// 	style={{ animation: "gradientFlow 10s linear infinite alternate" }}
		// >
		// 	<div className="bg-black text-white p-10 rounded-lg shadow-lg w-full max-w-xl md:max-w-2xl lg:max-w-4xl h-full md:h-auto transform hover:-translate-y-2 transition-all duration-300">
		// 		<img
		// 			className="h-20 md:h-40 mx-auto"
		// 			src={logo}
		// 			alt="HEDI- Heimat Digital"
		// 		/>
		// 		<div className="text-center">
		// 			<h1 className="text-8xl md:text-8xl lg:text-10xl text-center font-bold py-10 font-sans bg-white text-transparent bg-clip-text">
		// 				404
		// 			</h1>
		// 			<p className="text-3xl py-10 md:text-4xl">{t("pageNotFound")}</p>
		// 			<a
		// 				onClick={() => navigateTo("/")}
		// 				className="w-full rounded-xl sm:w-80 mt-10 mx-auto bg-white px-8 py-2 text-base font-semibold text-black shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer font-sans"
		// 				style={{ fontFamily: "Poppins, sans-serif" }}
		// 			>
		// 				{t("goBack")}
		// 			</a>
		// 		</div>
		// 	</div>
		// </div>

		<div className="bg-gray-100 p-10 h-screen flex flex-col justify-center items-center">
			<center>
				<svg className="emoji-404 " enableBackground="new 0 0 226 249.135" height="249.135" id="Layer_1" overflow="visible" version="1.1" viewBox="0 0 226 249.135" width="226" xmlSpace="preserve" ><circle cx="113" cy="113" fill="#FFE585" r="109" /><line enableBackground="new    " fill="none" opacity="0.29" stroke="#6E6E96" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" x1="88.866" x2="136.866" y1="245.135" y2="245.135" /><line enableBackground="new    " fill="none" opacity="0.17" stroke="#6E6E96" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" x1="154.732" x2="168.732" y1="245.135" y2="245.135" /><line enableBackground="new    " fill="none" opacity="0.17" stroke="#6E6E96" strokeLinecap="round" strokeLinejoin="round" strokeWidth="8" x1="69.732" x2="58.732" y1="245.135" y2="245.135" /><circle cx="68.732" cy="93" fill="#6E6E96" r="9" /><path d="M115.568,5.947c-1.026,0-2.049,0.017-3.069,0.045  c54.425,1.551,98.069,46.155,98.069,100.955c0,55.781-45.219,101-101,101c-55.781,0-101-45.219-101-101  c0-8.786,1.124-17.309,3.232-25.436c-3.393,10.536-5.232,21.771-5.232,33.436c0,60.199,48.801,109,109,109s109-48.801,109-109  S175.768,5.947,115.568,5.947z" enableBackground="new    " fill="#FF9900" opacity="0.24" /><circle cx="156.398" cy="93" fill="#6E6E96" r="9" /><ellipse cx="67.732" cy="140.894" enableBackground="new    " fill="#FF0000" opacity="0.18" rx="17.372" ry="8.106" /><ellipse cx="154.88" cy="140.894" enableBackground="new    " fill="#FF0000" opacity="0.18" rx="17.371" ry="8.106" /><path d="M13,118.5C13,61.338,59.338,15,116.5,15c55.922,0,101.477,44.353,103.427,99.797  c0.044-1.261,0.073-2.525,0.073-3.797C220,50.802,171.199,2,111,2S2,50.802,2,111c0,50.111,33.818,92.318,79.876,105.06  C41.743,201.814,13,163.518,13,118.5z" fill="#FFEFB5" /><circle cx="113" cy="113" fill="none" r="109" stroke="#6E6E96" strokeWidth="8" /></svg>
				<div className=" tracking-widest mt-4">
					{/* <span className="text-gray-500 text-6xl block"><span>{t("currently_no_bookings")}</span> */}
					<span className="text-gray-500 text-xl">{t("currently_no_bookings")}</span>

				</div>
			</center>
			<center className="mt-6">
				<a
					onClick={() =>
						navigateTo("/AppointmentBooking/AppointmentsUserCreated")
					}
					className="bg-white relative w-full inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-black transition duration-300 ease-out border-2 border-black rounded-full shadow-md group cursor-pointer">
					<span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 translate-x-full bg-black group-hover:-translate-x-0 ease">
						<svg className="w-6 h-6 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
						</svg>
					</span>
					<span className="absolute flex items-center justify-center w-full h-full text-black transition-all duration-300 transform group-hover:-translate-x-full ease">{t("goBack")}</span>
					<span className="relative invisible">
						{t("goBack")}
					</span>
				</a>
			</center>
		</div>
	);
};

export default Error;
