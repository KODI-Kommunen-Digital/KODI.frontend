import React, { Fragment, useState, useEffect } from "react";
import { Popover, Transition } from "@headlessui/react";
import { useTranslation } from "react-i18next";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { useNavigate, useLocation } from "react-router-dom";
import { logout } from "../Services/usersApi";
import { useAuth } from '../AuthContext';

export default function HomePageNavBar() {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const { isAuthenticated, setLogout } = useAuth();

	useEffect(() => {
		if (isAuthenticated()) {
			setIsLoggedIn(true);
		}
	}, [isAuthenticated]);

	const handleLoginLogout = () => {
		if (isLoggedIn) {
			logout().then(() => {
				setLogout();
				window.localStorage.removeItem("selectedItem");
				window.sessionStorage.removeItem("selectedItem");
				setIsLoggedIn(false);
				navigateTo("/");
			});
		} else {
			navigateTo("/login");
		}
	};
	const handleGotoDashboard = () => {
		navigateTo("/Dashboard");
	};

	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const terminalViewParam = searchParams.get("terminalView");
	const buttonClass = terminalViewParam === "true" ? "hidden" : "visible";
	const gobackClass = terminalViewParam === "true" ? "visible" : "hidden";
	const [, setShowNavBar] = useState(true);
	useEffect(() => {
		if (terminalViewParam === "true") {
			setShowNavBar(false);
		} else {
			setShowNavBar(true);
		}
	}, [terminalViewParam]);

	return (
		<div className="w-full fixed top-0 z-10">
			<Popover className="relative bg-white mr-0 ml-0 px-5 md:px-10 py-5">
				<div className="w-full">
					<div
						className={`flex items-center justify-between border-gray-100  lg:justify-start lg:space-x-10 ${buttonClass}`}
					>
						<div>
							<img
								className={`mx-auto lg:h-10 md:h-10 h-8 w-auto cursor-pointer ${buttonClass}`}
								src={process.env.REACT_APP_BUCKET_HOST + "admin/logo.png"}
								alt="HEDI- Heimat Digital"
								onClick={() => {
									window.localStorage.removeItem("selectedCity");
									navigateTo("/");
									window.location.reload();
								}}
							/>
						</div>

						<div className={`-my-2 -mr-2 lg:hidden ${buttonClass}`}>
							<Popover.Button className="inline-flex items-center justify-center rounded-xl bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500">
								<span className="sr-only">Open menu</span>
								<Bars3Icon className="h-6 w-6" aria-hidden="true" />
							</Popover.Button>
						</div>

						<div className="hidden items-center justify-end lg:flex md:flex-1 lg:w-0 space-x-15">
							<a
								className={`text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer ${buttonClass}`}
								onClick={() => {
									if (isLoggedIn) {
										navigateTo("/Favorite");
									} else {
										window.sessionStorage.setItem("redirectTo", "/Favorite");
										navigateTo("/login");
									}
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
									className="w-5 h-5"
								>
									<path
										strokeLinecap="round"
										strokeWidth="2"
										d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
									></path>
								</svg>
							</a>
							<a
								onClick={handleLoginLogout}
								className={`ml-8 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-bg-slate-300 px-8 py-2 text-base font-semibold text-gray-600 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer ${buttonClass}`}
							>
								{isLoggedIn ? t("logOut") : t("login")}
							</a>
							{isLoggedIn && (
								<a
									onClick={handleGotoDashboard}
									className={`ml-8 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-400 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer ${buttonClass}`}
								>
									{t("dashboard")}
								</a>
							)}
							<a
								onClick={() => {
									localStorage.setItem("selectedItem", t("chooseOneCategory"));
									isLoggedIn
										? navigateTo("/UploadListings")
										: navigateTo("/login");
								}}
								className={`ml-8 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer ${buttonClass}`}
							>
								{t("submit")}
							</a>
						</div>
					</div>

					<div
						className={`flex items-center justify-center border-gray-100 lg:justify-center lg:space-x-10 ${gobackClass}`}
					>
						<a
							onClick={() => {
								if (terminalViewParam === "true") {
									navigateTo("/AllListings?terminalView=true");
								} else {
									navigateTo("/");
								}
							}}
							className={`font-sans inline-flex whitespace-nowrap rounded-xl border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer ${gobackClass}`}
						>
							<span className="mx-2">&#8592;</span> {t("gobacktoalllistings")}
						</a>
					</div>
				</div>

				<Transition
					as={Fragment}
					enter="duration-200 ease-out"
					enterFrom="opacity-0 scale-95"
					enterTo="opacity-100 scale-100"
					leave="duration-100 ease-in"
					leaveFrom="opacity-100 scale-100"
					leaveTo="opacity-0 scale-95"
				>
					<Popover.Panel
						focus
						className="absolute inset-x-0 top-0 origin-top-right transform p-2 transition lg:hidden"
					>
						<div className="divide-y-2 divide-gray-50 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5">
							<div className="space-y-6 py-6 px-5">
								<div className="mr-2 flex justify-between">
									<a
										className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center cursor-pointer"
										onClick={() => {
											if (isLoggedIn) {
												navigateTo("/Favorite");
											} else {
												window.sessionStorage.setItem(
													"redirectTo",
													"/Favorite"
												);
												navigateTo("/login");
											}
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											className="w-5 h-5"
										>
											<path
												strokeLinecap="round"
												strokeWidth="2"
												d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
											></path>
										</svg>
									</a>
									<Popover.Button className="inline-flex items-center justify-center rounded-xl bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500">
										<span className="sr-only">Close menu</span>
										<XMarkIcon className="h-6 w-6" aria-hidden="true" />
									</Popover.Button>
								</div>

								<div>
									<a
										onClick={handleLoginLogout}
										className="flex font-sans w-full items-center justify-center rounded-xl mt-4 px-4 py-2 border-transparent border border-bg-slate-300 text-base font-semibold text-gray-600 shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
									>
										{isLoggedIn ? t("logOut") : t("login")}
									</a>
									{isLoggedIn && (
										<a
											onClick={handleGotoDashboard}
											className="flex font-sans w-full items-center justify-center rounded-xl mt-4 px-4 py-2 border border-transparent bg-blue-400 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
										>
											{t("dashboard")}
										</a>
									)}
									<a
										onClick={() =>
											isLoggedIn
												? navigateTo("/UploadListings")
												: navigateTo("/login")
										}
										className="flex font-sans w-full items-center justify-center rounded-xl mt-4 px-4 py-2 border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
									>
										{t("submit")}
									</a>
								</div>
							</div>
						</div>
					</Popover.Panel>
				</Transition>
			</Popover>
		</div>
	);
}
