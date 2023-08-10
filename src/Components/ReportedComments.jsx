import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { reportedComments } from "../Services/forumsApi";
import { useNavigate } from "react-router-dom";

const Modal = ({ onClose, text }) => {
	const { t } = useTranslation();

	return (
		<div className="fixed inset-0 flex justify-center items-center z-50">
			<div className="bg-white relative w-80 p-6 rounded shadow">
				<h2 className="text-xl font-medium leading-normal text-neutral-800 dark:text-neutral-200">
					{t("reportedComments")}
				</h2>
				<textarea
					className="w-full p-2 border rounded resize-none"
					rows="4"
					value={text}
				/>
				<div className="justify-center mt-4">
					<button
						className="w-full font-sans items-center justify-center rounded-xl mt-4 px-4 py-2 border border-transparent bg-blue-400 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
						onClick={onClose}
					>
						Cancel
					</button>
				</div>
			</div>
		</div>
	);
};

Modal.propTypes = {
	onClose: PropTypes.func.isRequired,
	text: PropTypes.string.isRequired,
	handleTextChange: PropTypes.func.isRequired,
};

const ReportedComments = () => {
	window.scrollTo(0, 0);
	const { t } = useTranslation();
	const [cityId, setCityId] = useState(null);
	const [forumId, setForumId] = useState(null);
	const [postId, setPostId] = useState(null);

	const navigate = useNavigate();
	const navigateTo = (path) => {
		if (path) {
			navigate(path);
		}
	};

	useEffect(() => {
		document.title = "Heidi - Reported Posts";
		reportedComments(cityId, forumId, postId)
			.then((response) => {
				// setRequests(response.data.data);
				console.log(response.data.data);
				setCityId(response.data.data.id);
				setForumId(response.data.data.forumId);
				setPostId(response.data.data.postId);
			})
			.catch(() => navigateTo("/Error"));
	}, []);

	const [showPopup, setShowPopup] = useState(false);

	const handleRemoveClick = () => {
		setShowPopup(true);
	};

	const handleCancelClick = () => {
		setShowPopup(false);
	};

	return (
		<div>
			<button
				className="font-medium text-blue-600 px-2 dark:text-blue-500 hover:underline cursor-pointer text-center"
				style={{ fontFamily: "Poppins, sans-serif" }}
				onClick={handleRemoveClick}
			>
				{t("viewReports")}
			</button>

			{showPopup && <Modal onClose={handleCancelClick} />}
		</div>
	);
};

export default ReportedComments;
