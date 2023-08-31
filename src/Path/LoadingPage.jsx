import React from "react";

const LoadingPage = () => {
	return (
		<div className="fixed inset-0 flex items-center justify-center bg-white">
			<div className="text-center">
				<h1 className="text-2xl md:text-4xl lg:text-6xl text-center font-bold py-20 font-sans bg-clip-text text-transparent text-blue-800">
					{t("loading")}
				</h1>
				<div className="my-10 flex">
					<div className="relative mx-auto h-28 w-28 animate-[displace_5s_infinite] border border-blue-200">
						<div className="h-14 animate-[flip_5s_infinite] bg-blue-100"></div>
					</div>
				</div>
				<p className="text-lg py-20 md:text-xl lg:text-4xl font-bold text-blue-400">
					{t("youAreAlmosetThere")}
				</p>
			</div>
		</div>
	);
};

export default LoadingPage;
