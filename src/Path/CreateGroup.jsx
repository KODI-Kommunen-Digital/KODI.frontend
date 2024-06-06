import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./bodyContainer.css";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
	postForumsData,
	updateForumsData,
	getForum,
	uploadForumImage,
	deleteForumImage,
} from "../Services/forumsApi";

import { getCities } from "../Services/cities";
import FormData from "form-data";
import Alert from "../Components/Alert";

function CreateGroup() {
	const { t } = useTranslation();
	const editor = useRef(null);
	const [newGroup, setNewGroup] = useState(true);
	const [updating, setUpdating] = useState(false);

	//Drag and Drop starts
	const [image1, setImage1] = useState(null);

	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const [forumId, setForumId] = useState(0);
	const navigate = useNavigate();

	// const handleToggle = () => {
	// 	setInput((prevInput) => ({
	// 		...prevInput,
	// 		visibility: prevInput.visibility === "public" ? "private" : "public", // Toggle between "public" and "private"
	// 	}));
	// };

	const handleToggle = () => {
		setInput((prevInput) => {
			const newVisibility = prevInput.visibility === "public" ? "private" : "public";
			return {
				...prevInput,
				visibility: newVisibility,
				isPrivate: newVisibility === "private" ? 1 : 0,
			};
		});
	};

	function handleDragEnter(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	function handleDragLeave(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	function handleDragOver(e) {
		e.preventDefault();
		e.stopPropagation();
	}

	function handleDrop1(e) {
		e.preventDefault();
		e.stopPropagation();
		const file = e.dataTransfer.files[0];
		if (file && file.type.startsWith("image/")) {
			setImage1(file);
		}
	}

	function handleInputChange(e) {
		e.preventDefault();
		const file = e.target.files[0];
		if (file && file.type.startsWith("image/")) {
			setImage1(file);
		}
	}

	function handleRemoveImage1() {
		setImage1(null);
		setInput((prevInput) => ({ ...prevInput, image: null, removeImage: true }));
	}

	//Sending data to backend starts
	const [input, setInput] = useState({
		forumName: "",
		description: "",
		image: null,
		removeImage: false,
		visibility: "public",
		isPrivate: 0,
	});
	console.log(input);

	const [error, setError] = useState({
		forumName: "",
		description: "",
		image: null,
		removeImage: false,
		visibility: "public",
	});

	const onInputChange = (e) => {
		const { name, value } = e.target;
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
		validateInput(e);
	};

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		var cityId = searchParams.get("cityId");
		setCityId(cityId);
		var forumId = searchParams.get("forumId");
		if (forumId && cityId) {
			setNewGroup(false);
			setForumId(forumId);
			getForum(cityId, forumId).then((forumsResponse) => {
				let forumsData = forumsResponse.data.data;
				forumsData.cityId = cityId;
				setInput(forumsData);
				setDescription(forumsData.description);
			});
		}
	}, []);
	const handleImageUpload = async (id) => {
		const form = new FormData();
		form.append("image", image1);
		await uploadForumImage(form, cityId, id);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();

		let valid = true;
		for (let key in error) {
			var errorMessage = getErrorMessage(key, input[key]);
			var newError = error;
			newError[key] = errorMessage;
			setError(newError);
			if (errorMessage) {
				valid = false;
			}
		}

		if (valid) {
			setUpdating(true);
			event.preventDefault();
			try {
				input.isPrivate = input.visibility == "private";
				var response = newGroup
					? await postForumsData(cityId, input)
					: await updateForumsData(cityId, input, forumId);
				if (newGroup) {
					if (image1) {
						handleImageUpload(response.data.id);
					}
				} else if (image1) {
					handleImageUpload(input.id);
				} else if (input.removeImage) {
					await deleteForumImage(cityId, input.id);
				}
				setSuccessMessage(t("groupCreated"));
				setErrorMessage(false);
				setTimeout(() => {
					setSuccessMessage(false);
					navigate("/MyGroups");
				}, 5000);
			} catch (error) {
				setErrorMessage(t("changesNotSaved"));
				setSuccessMessage(false);
				setTimeout(() => setErrorMessage(false), 5000);
			}
			setUpdating(false);
		} else {
			setErrorMessage(t("invalidData"));
			setSuccessMessage(false);
			setTimeout(() => setErrorMessage(false), 5000);
		}
	};

	useEffect(() => {
		let valid = true;
		for (let property in error) {
			if (error[property]) {
				valid = false;
			}
		}
	}, [error]);

	const [description, setDescription] = useState("");

	const onDescriptionChange = (newContent) => {
		const hasNumberedList = newContent.includes("<ol>");
		const hasBulletList = newContent.includes("<ul>");
		let descriptions = [];
		let listType = "";
		if (hasNumberedList) {
			const regex = /<li>(.*?)(?=<\/li>|$)/gi;
			const matches = newContent.match(regex);
			descriptions = matches.map((match) => match.replace(/<\/?li>/gi, ""));
			descriptions = descriptions.map(
				(description, index) => `${index + 1}. ${description}`
			);
			listType = "ol";
		} else if (hasBulletList) {
			const regex = /<li>(.*?)(?=<\/li>|$)/gi;
			const matches = newContent.match(regex);
			descriptions = matches.map((match) => match.replace(/<\/?li>/gi, ""));
			descriptions = descriptions.map((description) => `- ${description}`);
			listType = "ul";
		} else {
			// No list tags found, treat the input as plain text
			setInput((prev) => ({
				...prev,
				description: newContent.replace(/(<br>|<\/?p>)/gi, ""), // Remove <br> and <p> tags
			}));
			setDescription(newContent);
			return;
		}
		const listHTML = `<${listType}>${descriptions
			.map((description) => `<li>${description}</li>`)
			.join("")}</${listType}>`;
		setInput((prev) => ({
			...prev,
			description: listHTML,
		}));
		setDescription(newContent);
	};

	const getErrorMessage = (name, value) => {
		switch (name) {
			case "forumName":
				if (!value) {
					return t("pleaseEnterTitle");
				} else {
					return "";
				}

			case "cityId":
				if (!parseInt(value)) {
					return t("pleaseSelectCity");
				} else {
					return "";
				}

			case "description":
				if (!value) {
					return t("pleaseEnterDescription");
				} else {
					return "";
				}

			default:
				return "";
		}
	};

	const validateInput = (e) => {
		let { name, value } = e.target;
		var errorMessage = getErrorMessage(name, value);
		setError((prevState) => {
			return { ...prevState, [name]: errorMessage };
		});
	};
	//Sending data to backend ends

	useEffect(() => {
		getCities({ hasForum: true }).then((citiesResponse) => {
			setCities(citiesResponse.data.data);
		});
	}, []);

	//Social Media ends
	const [cityId, setCityId] = useState(0);
	const [cities, setCities] = useState([]);
	async function onCityChange(e) {
		const cityId = e.target.value;
		setCityId(cityId);
		setInput((prev) => ({
			...prev,
			cityId: cityId,
			villageId: 0,
		}));
		validateInput(e);

		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("cityId", cityId);
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.replaceState({}, "", newUrl);
	}

	return (
		<section class="bg-slate-600 body-font relative h-screen">
			<SideBar />

			<div class="container w-auto px-5 py-2 bg-slate-600">
				<div class="bg-white mt-4 p-6 space-y-10">
					<h2
						style={{
							fontFamily: "Poppins, sans-serif",
						}}
						class="text-gray-900 text-lg mb-4 font-medium title-font"
					>
						{t("createGroup")}
						<div className="my-4 bg-gray-600 h-[1px]"></div>
					</h2>
					<div class="relative mb-4">
						<label
							for="forumName"
							class="block text-sm font-medium text-gray-600"
						>
							{t("forumName")} *
						</label>
						<input
							type="text"
							id="forumName"
							name="forumName"
							value={input.forumName}
							onChange={onInputChange}
							onBlur={validateInput}
							required
							className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
							placeholder={t("enterTitle")}
						/>
						<div
							className="h-[24px] text-red-600"
							style={{
								visibility: error.forumName ? "visible" : "hidden",
							}}
						>
							{error.forumName}
						</div>
					</div>

					<div class="relative mb-4">
						<label
							for="forumName"
							class="block text-sm font-medium text-gray-600"
						>
							{t("city")} *
						</label>
						<select
							type="text"
							id="cityId"
							name="cityId"
							value={cityId}
							onChange={onCityChange}
							disabled={!newGroup}
							autocomplete="country-name"
							class="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
						>
							<option value={0}>{t("select")}</option>
							{cities.map((city) => (
								<option value={Number(city.id)}>{city.name}</option>
							))}
						</select>
						<div
							className="h-[24px] text-red-600"
							style={{
								visibility: error.cityId ? "visible" : "hidden",
							}}
						>
							{error.cityId}
						</div>
					</div>

					<div
						className="relative mb-4 flex items-center"
						onClick={handleToggle}
					>
						<div className="flex items-center">
							<label
								htmlFor="groupType"
								className="block text-sm font-medium text-gray-600 mr-2"
							>
								{t("public")}
							</label>
							<div className="relative">
								<div
									className={`w-14 h-7 rounded-full shadow-inner ${input.visibility === "private"
										? "bg-blue-500"
										: "bg-gray-300"
										}`}
								></div>
								<div
									className={`absolute top-0 left-0 w-7 h-7 bg-white rounded-full shadow transition-transform duration-300 ease-in-out transform ${input.visibility === "private"
										? "translate-x-full"
										: "translate-x-0"
										}`}
								></div>
								{/* No need for an input element here */}
							</div>
							<label
								htmlFor="groupType"
								className="block text-sm font-medium text-gray-600 ml-2"
							>
								{t("private")}
							</label>
						</div>
					</div>

					<div class="relative mb-4">
						<label
							for="description"
							class="block text-sm font-medium text-gray-600"
						>
							{t("description")} *
						</label>
						<ReactQuill
							type="text"
							id="description"
							name="description"
							ref={editor}
							value={description}
							onChange={(newContent) => onDescriptionChange(newContent)}
							onBlur={(range, source, editor) => {
								validateInput({
									target: {
										name: "description",
										value: editor.getHTML().replace(/(<br>|<\/?p>)/gi, ""),
									},
								});
							}}
							placeholder={t("writeSomethingHere")}
							className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-0 px-0 leading-8 transition-colors duration-200 ease-in-out shadow-md"
						/>
						<div
							className="h-[24px] text-red-600"
							style={{
								visibility: error.description ? "visible" : "hidden",
							}}
						>
							{error.description}
						</div>
					</div>
				</div>
			</div>

			<div class="container w-auto px-5 py-2 bg-slate-600">
				<div class="bg-white mt-4 p-6 space-y-10">
					<h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
						{t("uploadLogo")}
						<div className="my-4 bg-gray-600 h-[1px]"></div>
					</h2>

					<div>
						<label className="block text-sm font-medium text-gray-700">
							{t("addLogoHere")}
						</label>
						<div
							className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-black px-6 pt-5 pb-6 bg-slate-200`}
							onDrop={handleDrop1}
							onDragOver={handleDragOver}
							onDragEnter={handleDragEnter}
							onDragLeave={handleDragLeave}
						>
							{image1 || input.image ? (
								<div className="flex flex-col items-center">
									<img
										className="object-contain h-64 w-full mb-4"
										src={
											image1
												? URL.createObjectURL(image1)
												: process.env.REACT_APP_BUCKET_HOST + input.image
										}
										alt="uploaded"
									/>
									<button
										className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
										onClick={handleRemoveImage1}
									>
										{t("remove")}
									</button>
								</div>
							) : (
								<div className="text-center">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										className="mx-auto h-12 w-12"
										viewBox="0 0 20 20"
										fill="currentColor"
									>
										<path
											fillRule="evenodd"
											d="M6 2a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7.414l-2-2V4a1 1 0 00-1-1H6zm6 5a1 1 0 100-2 1 1 0 000 2z"
											clipRule="evenodd"
										/>
									</svg>
									<p className="mt-1 text-sm text-gray-600">
										{t("dragAndDropImage")}
									</p>
									<div class="relative mb-4 mt-8">
										<label className="file-upload-btn w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60">
											<span className="button-label">{t("upload")}</span>
											<input
												id="image1-upload"
												type="file"
												className="sr-only"
												onChange={handleInputChange}
											/>
										</label>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="container w-auto px-5 py-2 bg-slate-600">
				<div className="bg-white mt-4 p-6">
					<div className="py-2 mt-1 px-2">
						<button
							type="button"
							onClick={handleSubmit}
							disabled={updating}
							class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
						>
							{t("saveChanges")}
						</button>
					</div>
					<div>
						{successMessage && (
							<Alert type={"success"} message={successMessage} />
						)}
						{errorMessage && <Alert type={"danger"} message={errorMessage} />}
					</div>
				</div>
			</div>
		</section>
	);
}

export default CreateGroup;
