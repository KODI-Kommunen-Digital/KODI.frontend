import React, { useState, useEffect, Fragment } from "react";
import SideBar from "../Components/SideBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../index.css";
import { FaBell } from 'react-icons/fa';


const AccountSettings = () => {
	const { t, i18n } = useTranslation();
	useEffect(() => {
		document.title = "Heidi - Account Settings";
	}, []);
	 

	let navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};


	return (
		<section className="bg-slate-600 body-font relative">
			<SideBar />
            <>
				<div class="container w-auto px-5 py-2 bg-slate-600">
					<div class="bg-white mt-4 p-6 space-y-10">
						<h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
							{t("updatePassword")}
							<div className="my-4 bg-gray-600 text-base h-[1px]">
								{t("Need_to_change_your_password")}
							</div>
						</h2>
						<button
						    id="finalbutton"
							class="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 mt-4 rounded-md"
							onClick={() => {
								navigateTo("/PasswordUpdate");
							}}
						>{t("updatePassword")}</button>
					</div>
				</div>
            </>
		</section>
	);
};

export default AccountSettings;
