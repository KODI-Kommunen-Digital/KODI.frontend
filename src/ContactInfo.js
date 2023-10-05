import React from "react";

function ContactInfo() {
	return (
		<section className="bg-slate-300 body-font relative">
			<div className="container px-5 py-5 mx-auto flex sm:flex-nowrap flex-wrap bg-slate-600">
				<div className="lg:w-4/5 md:w-1/3 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 p-6 mr-2">
					<h2 className="text-gray-900 text-lg mb-4 font-medium title-font">
						Information
						<div className="my-4 bg-gray-600 h-[1px]"></div>
					</h2>
					<div className="relative mb-4">
						<label
							htmlFor="category"
							className="block text-sm font-medium text-gray-600"
						>
							Category
						</label>
						<div className="relative mt-1 rounded-md shadow-sm">
							<input
								type="text"
								name="category"
								id="category"
								className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
								placeholder="all your selection categories"
							/>
							<div className="absolute inset-y-0 right-0 flex items-center">
								<select
									id="currency"
									name="currency"
									className="flex items-center whitespace-nowrap rounded-xl bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-gray-900 transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] motion-reduce:transition-none dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
								>
									<option>Germany</option>
									<option>Spain</option>
									<option>France</option>
								</select>
							</div>
						</div>
					</div>
					<div className="relative mb-4">
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-600"
						>
							Title
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
							placeholder="enter your title"
						/>
					</div>
					<div className="relative mb-4">
						<label
							htmlFor="date"
							className="block text-sm font-medium text-gray-600"
						>
							Date
						</label>
						<div className="relative">
							<div className="flex absolute inset-y-0 right-1 items-center pl-3 pointer-events-none">
								<svg
									aria-hidden="true"
									className="w-5 h-5 text-gray-500 dark:text-gray-400"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										fillRule="evenodd"
										d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
										clipRule="evenodd"
									></path>
								</svg>
							</div>
							<input
								type="email"
								id="email"
								name="email"
								className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
								placeholder="dd-mm-yyyy"
							/>
						</div>
					</div>
					<div className="relative mb-4">
						<label
							htmlFor="time"
							className="block text-sm font-medium text-gray-600"
						>
							Time
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
							placeholder="Select a time"
						/>
						<button
							tabIndex="0"
							type="button"
							className="timepicker-toggle-button"
							data-mdb-toggle="timepicker"
						>
							<i className="fas fa-clock timepicker-icon"></i>
						</button>
					</div>
					<div className="relative mb-4">
						<label
							htmlFor="place"
							className="block text-sm font-medium text-gray-600"
						>
							Place
						</label>
						<input
							type="email"
							id="email"
							name="email"
							className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
							placeholder="enter your place"
						/>
					</div>
					<div className="relative mb-4">
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-600"
						>
							Description
						</label>
						<textarea
							id="message"
							name="message"
							className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 h-32 text-base outline-none text-gray-700 py-1 px-3 resize-none leading-6 transition-colors duration-200 ease-in-out"
						></textarea>
					</div>
				</div>
			</div>
		</section>
	);
}

export default ContactInfo;
