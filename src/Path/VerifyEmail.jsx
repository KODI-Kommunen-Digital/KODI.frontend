import React, { useEffect } from "react";
import { verifyEmail } from "../Services/usersApi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
	const [res, setRes] = useState();
	const [redirect, setRedirect] = useState(false);
	const navigate = useNavigate();
	useEffect(() => {
		async function _() {
			var url = window.location;
			var access_token = new URLSearchParams(url.search).get("token");
			var userId = new URLSearchParams(url.search).get("userId");
			var lang = new URLSearchParams(url.search).get("lang");
			try {
				var response = await verifyEmail({
					token: access_token,
					userId: userId,
					language: lang,
				}).then((res) => res.data.status);
				setRedirect(true);
				setTimeout(() => {
					navigate("/");
				}, 5000);
			} catch (e) {
				response = e.response.data.status === "error" ? "Failed" : "";
			}

			setRes(response);
		}
		_();
	}, [navigate]);

	return (
		<div>
			<h1>Email Verification {res ? res : ""}</h1>
			{redirect && <h1>You will be redirected to Loing Page in 5 sec</h1>}
		</div>
	);
};

export default VerifyEmail;
