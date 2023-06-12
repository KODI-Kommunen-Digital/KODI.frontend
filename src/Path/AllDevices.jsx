import React, { useState, useEffect, Fragment } from "react";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../index.css";
import axios from "axios";
import DEVICEIMAGE from "../assets/computer-tablet-phone-icon.png";

const AllDevices = () => {
	const { t } = useTranslation();
	const [devices, setDevices] = useState([]);

	useEffect(() => {
		fetchDeviceList();
	}, []);

	const fetchDeviceList = async () => {
		try {
			const response = await axios.get(
				`${process.env.REACT_APP_API_BASE_URL}/users/devices`
			);
			const deviceList = response.data.data.devices;
			setDevices(deviceList);
		} catch (error) {
			console.error("Error fetching device list:", error);
		}
	};

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
							{t("alldevicepagetitle")}
						</h2>
						<div className="my-4 bg-gray-600 text-base h-[1px]" />

						<div className="flex justify-center py-2 px-4 mt-4 mx-auto">
							<div className="text-center">
								<img
									alt="devices"
									className="object-cover object-center h-48 w-full bg-white"
									src={DEVICEIMAGE}
								/>
							</div>
						</div>

						<ul>
							{devices.map((device) => (
								<li key={device.id}>{device.deviceName}</li>
							))}
						</ul>

						<button
							className="w-full hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
							id="finalbutton"
							class="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 mt-4 rounded-md"
							style={{ fontFamily: "Poppins, sans-serif" }}
						>
							{t("logoutofalldevices")}
						</button>
					</div>
				</div>
			</>
		</section>
	);
};

export default AllDevices;
