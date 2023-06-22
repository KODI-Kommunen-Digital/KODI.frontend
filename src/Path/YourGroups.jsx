import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../index.css";
import { getUserForums } from "../Services/forumsApi";

const YourGroups = () => {
	const { t } = useTranslation();
	const [groups, setGroups] = useState([]);

	useEffect(() => {
		getUserForums().then((response) => {
			setGroups(response.data.data);
		});
	}, []);

	return (
		<section className="bg-slate-600 body-font relative h-screen">
			<SideBar />
			<>
				<div className="container w-auto px-5 py-2 bg-slate-600">
					<div className="bg-white mt-4 p-6">
						<h2
							className="text-gray-900 text-lg mb-4 font-medium title-font"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("yourGroups")}
						</h2>
						<div className="my-4 bg-gray-600 text-base h-[1px]" />

						{groups && groups.length > 0 ? (
							<ul>
								{groups &&
									groups.map((group) => (
										<li key={group.id}>{group.groupName}</li>
									))}
							</ul>
						) : (
							<div>
								<div className="flex items-center justify-center">
									<h1
										className="m-auto mt-20 text-center font-sans font-bold text-2xl text-black"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("currently_no_groups")}
									</h1>
								</div>
								<div className="m-auto mt-10 mb-40 text-center font-sans font-bold text-xl">
									<span
										className="font-sans text-black"
										style={{ fontFamily: "Poppins, sans-serif" }}
									>
										{t("to_create_new_group")}
									</span>
									<a
										className="m-auto mt-20 text-center font-sans font-bold text-xl cursor-pointer text-black"
										style={{ fontFamily: "Poppins, sans-serif" }}
										onClick={() => {
											localStorage.setItem(
												"selectedItem",
												"Choose one category"
											);
											isLoggedIn
												? navigateTo("/UploadListings")
												: navigateTo("/login");
										}}
									>
										{t("click_here")}
									</a>
								</div>
							</div>
						)}
					</div>
				</div>
			</>
		</section>
	);
};

export default YourGroups;
