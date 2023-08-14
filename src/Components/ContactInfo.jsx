import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

function ContactInfo({ user }) {
	const { t } = useTranslation();
	const [userSocial, setUserSocial] = useState({});
	const socialMediaSVGPathList = {
		Facebook: {
			bgColor: "bg-blue-500",
			link: "M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z",
		},
		Instagram: {
			bgColor: "bg-pink-600",
			link: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
		},
		LinkedIn: {
			bgColor: "bg-sky-600",
			link: "M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z",
		},
		Youtube: {
			bgColor: "bg-red-600",
			link: "M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z",
		},
		Twitter: {
			bgColor: "bg-blue-400",
			link: "M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z",
		},
	};
	useEffect(() => {
		if (user && user.socialMedia) {
			const socialMediaList = JSON.parse(user.socialMedia);
			const tempUserSocial = {};
			for (const socialMedia of socialMediaList) {
				Object.assign(tempUserSocial, socialMedia);
			}
			setUserSocial(tempUserSocial);
		}
	}, [user]);
	return (
		<div>
			<div className="w-full h-full lg:h-[21rem] md:ml-[6rem] lg:ml-[0rem] ml-[1rem] bg-white rounded-lg dark:border md:mt-0 sm:max-w-md xl:p-0 dark:border-white shadow-xl dark:bg-white">
				<div className="p-4 space-y-0 md:space-y-6 sm:p-4">
					<h1
						className="text-lg font-bold leading-tight tracking-tight text-gray-900 md:text-xl dark:text-gray-900"
						style={{ fontFamily: "Poppins, sans-serif" }}
					>
						{t("contactInfo")}
					</h1>
				</div>
				<div className="my-4 bg-gray-200 h-[1px]"></div>

				<div className="flex-grow text-center sm:text-left mt-6 sm:mt-0 justify-center py-2 px-2 sm:justify-start mx-0 my-4 gap-4">
					<div className="flex items-center py-0 px-2">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 512 512"
							className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
						>
							<path d="M64 112c-8.8 0-16 7.2-16 16v22.1L220.5 291.7c20.7 17 50.4 17 71.1 0L464 150.1V128c0-8.8-7.2-16-16-16H64zM48 212.2V384c0 8.8 7.2 16 16 16H448c8.8 0 16-7.2 16-16V212.2L322 328.8c-38.4 31.5-93.7 31.5-132 0L48 212.2zM0 128C0 92.7 28.7 64 64 64H448c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128z" />
						</svg>
						<p
							className="leading-relaxed text-base dark:text-gray-900 bg-white py-1 mt-1 mb-1 truncate"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{user?.email}
						</p>
					</div>
					{user?.website && (
						<div className="flex items-center py-0 px-2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 512 512"
								className="w-4 h-4 mr-2 -ml-1 text-[#626890]"
							>
								<path d="M352 256c0 22.2-1.2 43.6-3.3 64H163.3c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64H348.7c2.2 20.4 3.3 41.8 3.3 64zm28.8-64H503.9c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64H380.8c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32H376.7c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0H167.7c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 21 58.2 27 94.7zm-209 0H18.6C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192H131.2c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64H8.1C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6H344.3c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352H135.3zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6H493.4z" />
							</svg>
							<p
								className="leading-relaxed text-base dark:text-gray-900 bg-white py-1 mt-1 mb-1 truncate"
								style={{ fontFamily: "Poppins, sans-serif" }}
							>
								{user?.website}
							</p>
						</div>
					)}

					<div className="items-center bg-white py-2 px-2 mt-4 mb-4 flex flex-wrap gap-1">
						{userSocial &&
							Object.entries(userSocial).map(([key, value]) => (
								<div
									key={key}
									className="flex py-2 px-2 md:px-2 mx-0 my-0 gap-1"
								>
									<button
										type="button"
										data-te-ripple-init
										data-te-ripple-color="light"
										className={
											"inline-block rounded-xl px-6 py-2.5 text-xs font-medium uppercase leading-normal text-white shadow-md transition duration-150 ease-in-out hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg " +
											socialMediaSVGPathList[key].bgColor
										}
										onClick={() => {
											window.open(value, "_blank");
										}}
									>
										<svg
											xmlns="http://www.w3.org/2000/svg"
											className="h-4 w-4"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d={socialMediaSVGPathList[key].link} />
										</svg>
									</button>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
}

ContactInfo.propTypes = {
	user: PropTypes.shape({
		firstname: PropTypes.string,
		lastname: PropTypes.string,
		email: PropTypes.string,
		socialMedia: PropTypes.string,
		image: PropTypes.string,
		id: PropTypes.number,
		website: PropTypes.string,
	}).isRequired,
	createdAt: PropTypes.string.isRequired,
};
export default ContactInfo;
