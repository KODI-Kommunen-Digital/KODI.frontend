import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../bodyContainer.css";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
	getUserForums,
	getPostDetails,
	forumPosts,
	uploadPostImage,
	deletePostImage,
	updateForumPosts,
} from "../../Services/forumsApi";

import { getCities } from "../../Services/citiesApi";
import Alert from "../../Components/Alert";
import FormData from "form-data";

function UploadPosts() {
	const { t } = useTranslation();
	window.scrollTo(0, 0);
	const editor = useRef(null);
	const [newPost, setNewPost] = useState(true);
	const [updating, setUpdating] = useState(false);
	const [cityId, setCityId] = useState(0);
	const [cities, setCities] = useState([]);
	const [isSuccess, setIsSuccess] = useState(false);
	// Drag and Drop starts
	const [image1, setImage1] = useState(null);
	const [, setDragging] = useState(false);
	const CHARACTER_LIMIT = 255;
	const [successMessage, setSuccessMessage] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const navigate = useNavigate();

	function handleDragEnter(e) {
		e.preventDefault();
		e.stopPropagation();
		setDragging(true);
	}

	function handleDragLeave(e) {
		e.preventDefault();
		e.stopPropagation();
		setDragging(false);
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
		setDragging(false);
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

	// Sending data to backend starts
	const [input, setInput] = useState({
		title: "",
		description: "",
		image: null,
		removeImage: false,
		cityId: "",
	});

	const [error, setError] = useState({
		title: "",
		description: "",
		cityId: "",
	});

	const [forumId, setForumId] = useState(null);
	const [forum, setForums] = useState([]);
	const [postId, setPostId] = useState(null);

	useEffect(() => {
		const searchParams = new URLSearchParams(window.location.search);
		const cityIdFromURL = searchParams.get("cityId");
		const forumIdFromURL = searchParams.get("forumId");
		const postId = searchParams.get("postId");
		if (forumIdFromURL && cityIdFromURL && postId) {
			setNewPost(false);
			getPostDetails(cityIdFromURL, forumIdFromURL, postId).then(
				(postResponse) => {
					const postData = postResponse.data.data;
					postData.cityId = cityIdFromURL;
					setInput(postData);
					setDescription(postData.description);
				}
			);
		}
		else if (forumIdFromURL && cityIdFromURL) {
			setNewPost(true);
		}
	}, []);

	useEffect(() => {
		async function fetchData() {
			try {
				const citiesResponse = await getCities({ hasForum: true });
				setCities(citiesResponse.data.data);
				const response = await getUserForums();
				setForums(response.data.data);

				const urlParams = new URLSearchParams(location.search);
				const forumIdFromUrl = Number(urlParams.get("forumId"));
				const cityIdFromURL = Number(urlParams.get("cityId"));
				const postIdFromURL = Number(urlParams.get("postId"));
				if (!isNaN(forumIdFromUrl) && !isNaN(cityIdFromURL)) {
					setForumId(forumIdFromUrl);
					setCityId(cityIdFromURL);
					setPostId(postIdFromURL);
					setInput((prev) => ({
						...prev,
						forumId: forumIdFromUrl,
						cityId: cityIdFromURL,
						postId: postIdFromURL,
					}));
				}
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		}

		fetchData();
	}, [location.search]);

	const handleSubmit = async (event) => {
		event.preventDefault();

		let valid = true;
		for (const key in error) {
			const errorMessage = getErrorMessage(key, input[key]);
			const newError = error;
			newError[key] = errorMessage;
			setError(newError);
			if (errorMessage) {
				valid = false;
			}
		}

		if (valid) {
			setUpdating(true);
			try {
				// if (newPost) {
				// 	await forumPosts(cityId, forumId, input);
				// } else {
				// 	await updateForumPosts(cityId, input, forumId, postId);
				// }
				setIsSuccess(true);
				const response = newPost
					? await forumPosts(cityId, forumId, input)
					: await updateForumPosts(cityId, input, forumId, postId);

				if (newPost) {
					if (image1) {
						const form = new FormData();
						form.append("image", image1);
						await uploadPostImage(cityId, forumId, response.data.id, form);
					}
				} else if (image1) {
					const form = new FormData();
					form.append("image", image1);
					await uploadPostImage(cityId, forumId, input.id, form);
				} else if (input.removeImage) {
					await deletePostImage(cityId, forumId, input.id);
				}

				setSuccessMessage(t("postCreated"));
				setErrorMessage(false);
				setTimeout(() => {
					setSuccessMessage(false);
					navigate(`/Forum?cityId=${cityId}&forumId=${forumId}`);
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
		for (const property in error) {
			if (error[property]) {
				break; // No need to continue checking if an error is found
			}
		}
	}, [error]);

	const onInputChange = (e) => {
		const { name, value } = e.target;
		if (name === "title" && value.length > CHARACTER_LIMIT) {
			setError((prev) => ({
				...prev,
				title: t("characterLimitExceeded", {
					limit: CHARACTER_LIMIT,
					count: value.length
				}),
			}));
			return;
		}
		setInput((prev) => ({
			...prev,
			[name]: value,
		}));
		validateInput(e);
	};

	const [description, setDescription] = useState("");
	const onDescriptionChange = (newContent) => {
		const hasNumberedList = newContent.includes("<ol>");
		const hasBulletList = newContent.includes("<ul>");
		let descriptions = [];
		let listType = "";

		const plainText = newContent.replace(/(<([^>]+)>)/gi, "");
		const characterCount = plainText.length;

		if (characterCount > CHARACTER_LIMIT) {
			setError((prev) => ({
				...prev,
				description: t("characterLimitExceeded", {
					limit: CHARACTER_LIMIT,
					count: characterCount,
				}),
			}));
			return;
		} else {
			setError((prev) => ({
				...prev,
				description: "",
			}));
		}

		if (hasNumberedList || hasBulletList) {
			const liRegex = /<li>(.*?)(?=<\/li>|$)/gi;
			const matches = newContent.match(liRegex);
			if (matches) {
				descriptions = matches.map((match) => match.replace(/<\/?li>/gi, ""));
			}

			listType = hasNumberedList ? "ol" : "ul";

			const listHTML = `<${listType}>${descriptions
				.map((item) => `<li>${item}</li>`)
				.join("")}</${listType}>`;

			let leftoverText = newContent
				.replace(/<ol>.*?<\/ol>/gis, "")
				.replace(/<ul>.*?<\/ul>/gis, "")
				.trim();

			leftoverText = leftoverText.replace(/(<br>|<\/?p>)/gi, "");

			const finalDescription = leftoverText
				? `${leftoverText}<br/>${listHTML}`
				: listHTML;

			setInput((prev) => ({
				...prev,
				description: finalDescription,
			}));
		} else {
			setInput((prev) => ({
				...prev,
				description: newContent.replace(/<p>/g, "").replace(/<\/p>/g, "<br>"),
			}));
		}

		setDescription(newContent);
	};

	const getErrorMessage = (name, value) => {
		switch (name) {
			case "title":
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
		const { name, value } = e.target;
		const errorMessage = getErrorMessage(name, value);
		setError((prevState) => {
			return { ...prevState, [name]: errorMessage };
		});
	};

	async function onForumChange(e) {
		const forumId = e.target.value;
		setForumId(forumId);
		setInput((prev) => ({
			...prev,
			forumId,
		}));
		validateInput(e);

		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("forumId", forumId);
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.replaceState({}, "", newUrl);
	}
	async function onCityChange(e) {
		const cityId = e.target.value;
		setCityId(cityId); // Set the cityId in your component state

		setInput((prev) => ({
			...prev,
			cityId,
		}));

		validateInput(e);

		const urlParams = new URLSearchParams(window.location.search);
		urlParams.set("cityId", cityId);
		const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
		window.history.replaceState({}, "", newUrl);
	}

	const [isFormValid, setIsFormValid] = useState(false);
	useEffect(() => {
		const validateForm = () => {
			const requiredFields = ["title", "description", "cityId"];
			const isValid = requiredFields.every((field) => input[field] && !error[field]);
			setIsFormValid(isValid);
		};

		validateForm();
	}, [input, error]);

	return (
		<section className="bg-gray-800 body-font relative">
			<SideBar />

			<div className="container w-auto px-5 py-2 bg-gray-900">
				<div className="bg-white mt-4 p-6 space-y-10">
					<h2
						style={{
							fontFamily: "Poppins, sans-serif",
						}}
						className="text-slate-800 text-lg mb-4 font-medium title-font"
					>
						{!newPost ? t("editpost") : t("createPost")}
						<div className="my-4 bg-gray-600 h-[1px]"></div>
					</h2>
					<div className="relative mb-4">
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-600"
						>
							{t("title")} *
						</label>
						<input
							type="text"
							id="title"
							name="title"
							value={input.title}
							onChange={onInputChange}
							onBlur={validateInput}
							required
							className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
							placeholder={t("enterTitle")}
						/>
						<div className="flex justify-between text-sm mt-1">
							<span
								className={`${input.title.replace(/(<([^>]+)>)/gi, "").length > CHARACTER_LIMIT
									? "mt-2 text-sm text-red-600"
									: "mt-2 text-sm text-gray-500"
									}`}
							>
								{input.title.replace(/(<([^>]+)>)/gi, "").length}/{CHARACTER_LIMIT}
							</span>
							{error.title && (
								<span className="mt-2 text-sm text-red-600">
									{error.title}
								</span>
							)}
						</div>
					</div>

					<div className="relative mb-4">
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-600"
						>
							{t("city")} *
						</label>
						<select
							type="text"
							id="cityId"
							name="cityId"
							value={cityId}
							onChange={onCityChange}
							disabled={!newPost}
							autoComplete="country-name"
							className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
						>
							<option value={0} key={0}>
								{t("select")}
							</option>
							{cities.map((city) => (
								<option value={Number(city.id)} key={city.id}>
									{city.name}
								</option>
							))}
						</select>
						<div
							className="mt-2 text-sm text-red-600"
							style={{
								visibility: error.cityId ? "visible" : "hidden",
							}}
						>
							{error.cityId}
						</div>
					</div>

					<div className="relative mb-4">
						<label
							htmlFor="title"
							className="block text-sm font-medium text-gray-600"
						>
							{t("forums")} *
						</label>
						<select
							type="text"
							id="forumId"
							name="forumName"
							value={forumId}
							onChange={onForumChange}
							disabled={!newPost}
							autoComplete="country-name"
							className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
						>
							<option value={0}>{t("select")}</option>
							{forum.map((forum) => (
								<option value={Number(forum.forumId)} key={forum.forumId}>
									{forum.forumName}
								</option>
							))}
						</select>
						<div
							className="mt-2 text-sm text-red-600"
							style={{
								visibility: error.cityId ? "visible" : "hidden",
							}}
						>
							{error.cityId}
						</div>
					</div>

					<div className="relative mb-4">
						<label
							htmlFor="description"
							className="block text-sm font-medium text-gray-600"
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
							onBlur={() => {
								const quillInstance = editor.current?.getEditor();
								if (quillInstance) {
									validateInput({
										target: {
											name: "description",
											value: quillInstance.root.innerHTML.replace(/(<br>|<\/?p>)/gi, ""),
										},
									});
								}
							}}
							placeholder={t("writeSomethingHere")}
							readOnly={updating || isSuccess}
							className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-0 px-0 leading-8 transition-colors duration-200 ease-in-out shadow-md"
							style={{
								position: "relative",
								zIndex: 1000,
							}}
						/>
						<div className="flex justify-between text-sm mt-1">
							<span
								className={`${description.replace(/(<([^>]+)>)/gi, "").length > CHARACTER_LIMIT
									? "mt-2 text-sm text-red-600"
									: "mt-2 text-sm text-gray-500"
									}`}
							>
								{description.replace(/(<([^>]+)>)/gi, "").length}/{CHARACTER_LIMIT}
							</span>
							{error.description && (
								<span className="mt-2 text-sm text-red-600">
									{error.description}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="container w-auto px-5 py-2 bg-gray-900">
				<div className="bg-white mt-4 p-6 space-y-10">
					<h2 className="text-slate-800 text-lg mb-4 font-medium title-font">
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
										className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
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
									<div className="relative mb-4 mt-8">
										<label className="file-upload-btn w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded disabled:opacity-60">
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

			<div className="container w-auto px-5 py-2 bg-gray-900">
				<div className="bg-white mt-4 p-6">
					<div className="py-2 mt-1 px-2">
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!isFormValid || updating || isSuccess}
							className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
						>
							{!newPost ? t("saveChanges") : t("createPost")}
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
		</section >
	);
}

export default UploadPosts;
