import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ForumsError = () => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	function goToAllForums() {
		navigateTo(`/CitizenService`);
	}

	return (
		<div className="py-60 text-center">
			<h1 className="text-5xl md:text-8xl lg:text-10xl text-center font-bold my-10 font-sans bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
				Oops !
			</h1>
			<h1 className="text-2xl md:text-5xl lg:text-5xl text-center font-bold my-20 font-sans">
				{t("forumError")}
			</h1>
			<a
				onClick={() => goToAllForums()}
				className={`w-full rounded-xl sm:w-80 mt-10 mx-auto ${process.env.REACT_APP_NAME === 'Salzkotten APP' ? 'bg-yellow-600' : process.env.REACT_APP_NAME === 'FICHTEL' ? 'bg-lime-700' : 'bg-blue-800 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]'} px-8 py-2 text-base font-semibold text-white cursor-pointer font-sans`}
				style={{ fontFamily: "Poppins, sans-serif" }}
			>
				{t("goBack")}
			</a>
		</div>
	);
};

export default ForumsError;
