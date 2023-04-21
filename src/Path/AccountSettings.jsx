import React, { useState, useEffect, Fragment } from "react";
import SideBar from "../Components/SideBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../index.css";
import { FaBell } from 'react-icons/fa';
import Alert from "../Components/Alert";
import { getProfile, updateProfile } from "../Services/usersApi";


const AccountSettings = () => {
	const { t, i18n } = useTranslation();
	const [userData, setUserData ] = useState({})
	const [alertInfo, setAlertInfo] = useState(false);
	const [alertMessage, setAlertMessage] = useState("");
	const [alertType, setAlertType] = useState("");

	useEffect(() => {
		document.title = "Heidi - Account Settings";
		getProfile().then((response) => {
			setUserData(response.data.data );	
		})
	}, []);

	const [input, setInput] = useState({
		username:"",
		email: "",
		phoneNumber: ""
	  });

	let navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	const onInputChange = e => {
		const { name, value } = e.target;
		setInput(prev => ({
		  ...prev,
		  [name]: value
		}));
	  }

	const handleSave = async(event) =>{
		event.preventDefault();
		input["username"]=userData.username
		try{
			await updateProfile(input)
			setAlertInfo(true)
      		setAlertType('success')
			setAlertMessage('You data has been updated')
		}catch(err){
			setAlertInfo(true)
			setAlertType('danger')
			setAlertMessage('Failed. '+ err.response.data.message)
		}
	}

	const handledeleteAccount = ()=>{
		
	}

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
				<div class="container w-auto px-5 py-2 bg-slate-600">
                    <div class="bg-white mt-4 p-6">
                        <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
                            Personal Information
                            <div className="my-4 bg-gray-600 h-[1px]"/>
                        </h2>
                        <div class="relative mb-4">
                            <div class="pb-8">
                                <label class="block px-2 text-sm font-medium text-gray-400">
                                This information will be displayed publicly, so be careful what you share
                                </label>
                            </div>
                            <div class="py-2 grid grid-cols-1 md:grid-cols-2">
                                <div class="mt-1 px-2">
                                <label class="block text-md font-medium text-gray-600">
                                    Email
                                </label>
                                <input
                                    type="text"
                                    name="email"
									value={input.email}
                                    id="email"
                                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    placeholder="Enter your email here"
                                    defaultValue= {userData.email}
                                    onChange={onInputChange}
                                />
                                </div>
                                <div class="mt-1 px-2">
                                <label htmlFor="phoneNumber" class="block text-md font-medium text-gray-600">
                                    Phone Number (Without +49)
                                </label>
                                <input
                                    type="text"
                                    name="phoneNumber"
									value={input.phoneNumber}
                                    id="phoneNumber"
                                    class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                    placeholder="Enter your phone number here"
                                    defaultValue={userData.phoneNumber}
                                    onChange={onInputChange}
                                />
                                </div>
                            </div>

                        </div>
                        <div className="py-2 mt-1 px-2">
                            <button className="w-full hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
								id="finalbutton"
								class="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 mt-4 rounded-md"
								onClick = {handleSave}
							>{t("saveChanges")} </button>
                        </div>
                        {alertInfo && (
							<div class="py-2 mt-1 px-2">
								<Alert type={alertType} message={alertMessage} />
							</div>
						)}
                    </div>
                </div> 
				<div class="container w-auto px-5 py-2 bg-slate-600">
					<div class="bg-white mt-4 p-6"> 
						<h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
							{t("deleteAccount")}
							<div className="my-4 bg-gray-600 text-base h-[1px]">
								{t("need_to_delete_account")}
							</div>
						</h2>
						<div className="py-2 mt-1 px-2">
                            <button className="w-full hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
								id="finalbutton"
								class="w-full bg-black hover:bg-slate-800 text-white font-bold py-2 px-4 mt-4 rounded-md"
								onClick = {handledeleteAccount}
							>{t("deleteAccount")} </button>
                        </div>
					</div>
				</div>
            </>
		</section>
	);
};

export default AccountSettings;
