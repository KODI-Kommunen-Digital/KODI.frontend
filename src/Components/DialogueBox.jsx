import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import {
	getForumMemberRequests,
	getForumMemberRequestStatus,
} from "../Services/forumsApi";
import { useNavigate } from "react-router-dom";

const Modal = ({ onClose, onSend, text, handleTextChange }) => {
	const { t } = useTranslation();

	return (
		<div className="fixed inset-0 flex justify-center items-center z-50">
			<div className="bg-white relative w-80 p-6 rounded shadow">
				<h2 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
					{t("reason")}
				</h2>
				<textarea
					className="w-full p-2 border rounded resize-none"
					rows="4"
					value={text}
					onChange={handleTextChange}
				/>
				<div className="justify-center mt-4">
					<button
						className="w-full font-sans items-center justify-center rounded-xl mt-4 px-4 py-2 border border-transparent bg-blue-400 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
						onClick={onClose}
					>
						Cancel
					</button>
					<button
						className="w-full font-sans items-center justify-center rounded-xl mt-4 px-4 py-2 border border-transparent bg-blue-800 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
						onClick={onSend}
					>
						Send
					</button>
				</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	onClose: PropTypes.func.isRequired,
	onSend: PropTypes.func.isRequired,
	text: PropTypes.string.isRequired,
	handleTextChange: PropTypes.func.isRequired,
};

const DialogueBox = () => {
	window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [cityId, setCityId] = useState(0);
	const [forumId, setForumId] = useState(0);
	// const [memberId, setMemberId] = useState(0);
	const [memberRequests, setRequests] = useState([]);

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		document.title = "Heidi - Member Requests";
		const cityIdParam = parseInt(urlParams.get("cityId"));
		const forumIdParam = parseInt(urlParams.get("forumId"));
		getForumMemberRequests(cityIdParam, forumIdParam)
			.then((response) => {
				console.log(response.data.data);
				setRequests(response.data.data);
				setCityId(cityIdParam);
				setForumId(forumIdParam);
			})
			.catch(() => navigateTo("/Error"));
	}, []);

	const [showPopup, setShowPopup] = useState(false);
	const [text, setText] = useState("");

	const handleRemoveClick = () => {
		setShowPopup(true);
	};

	const handleSendClick = () => {
		console.log("Sending text:", text);

		const data = {
			reason: text,
			accept: false,
		};

		console.log("Data to be sent:", data);
		const memberId = memberRequests[0].requestId;
		sendForumMemberRequestStatus(memberId, data);
	};

	const sendForumMemberRequestStatus = async (memberId, data) => {
		try {
			await getForumMemberRequestStatus(cityId, forumId, memberId, data);
			setShowPopup(false);
		} catch (error) {
			console.error("Error sending data:", error);
		}
	};

	const handleCancelClick = () => {
		setShowPopup(false);
	};

	const handleTextChange = (e) => {
		setText(e.target.value);
	};

	return (
		<div>
			<button
				className="font-medium text-blue-600 px-2 dark:text-blue-500 hover:underline cursor-pointer text-center"
				style={{ fontFamily: "Poppins, sans-serif" }}
				onClick={handleRemoveClick}
			>
				{t("remove")}
			</button>

			{showPopup && (
				<Modal
					onClose={handleCancelClick}
					onSend={handleSendClick}
					text={text}
					handleTextChange={handleTextChange}
				/>
			)}
		</div>
	);
};

export default DialogueBox;
