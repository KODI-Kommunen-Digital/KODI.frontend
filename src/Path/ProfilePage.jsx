import React, { useRef } from "react";
import SideBar from "../Components/SideBar";
import Alert from "../Components/Alert";
import "./bodyContainer.css";
import SocialMedia from "../Components/socialMedia";
import {
	getProfile,
	updateProfile,
	updatePassword,
} from "../Services/usersApi";
import { socialMedia } from "../Constants/socialMedia";
import { getListingsById, uploadImage } from "../Services/listingsApi";
import { getVillages } from "../Services/villages";
// import ('https://fonts.googleapis.com/css2?family=Poppins:wght@200;600&display=swap');

function ChangeImage({ setInput, input }) {
	const inputFile = useRef(null);
	var file = false;
	function handleChangeImage(e) {
		console.log("Chanege Image", input);
		file = e.target.files[0];
		const form = new FormData();
		form.append("image", file);
		uploadImage(form).then((res) => {
			setInput("image", res.data.path);
		});
	}
	return (
		<>
			{file ? <img src={URL.createObjectURL(file)} alt={"Profile"} /> : ""}
			<button
				onClick={() => inputFile.current.click()}
				class="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
			>
				Change
			</button>
			<input
				onChange={handleChangeImage}
				className="sr-only"
				type="file"
				id="file"
				ref={inputFile}
				style={{ display: "none" }}
			/>
		</>
	);
}

class ProfilePage extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			input: {
				socialMedia: "",
			},
			profile: {},
			alertInfo: { show: false, message: "", type: null },
			showError: {},
			errorMessage: {},
			formValid: true,
			pageLoading: true,
			updatingProfile: false,
			val: [{ selected: "", socialMedia: "" }],
			data: {
				socialMedia: {},
			},
		};
		this.handleProfileChange = this.handleProfileChange.bind(this);
		this.updateChanges = this.updateChanges.bind(this);
		this.setProfile = this.setProfile.bind(this);
		this.setSocialMedia = this.setSocialMedia.bind(this);
	}

	componentDidMount() {
		document.title = "Your Profile";
		this.setPageLoading(true);
		getProfile()
			.then((response) => {
				const newState = Object.assign({}, this.state);
				newState.profile = response.data.data;
				newState.pageLoading = false;
				this.setState(newState);
			})
			.catch((error) => {
				this.setPageLoading(false);
				this.setAlertInfo(
					true,
					"Failed to fetch your profile info, please try again!",
					"danger"
				);
			});
	}
	componentDidUpdate() {
		let valid = true;
		for (let property in this.state.showError) {
			if (this.state.showError[property]) {
				valid = false;
				break;
			}
		}
		this.setFormValid(valid);
	}
	setProfile(property, value) {
		const newState = Object.assign({}, this.state);
		newState.profile[property] = value;
		this.setState(newState);
	}
	setShowError(property, value) {
		const newState = Object.assign({}, this.state);
		newState.showError[property] = value;
		this.setState(newState);
	}
	setErrorMessage(property, value) {
		const newState = Object.assign({}, this.state);
		newState.errorMessage[property] = value;
		this.setState(newState);
	}
	setAlertInfo(show, message, type) {
		const newState = Object.assign({}, this.state);
		newState.alertInfo = { show, message, type };
		this.setState(newState);
	}
	setFormValid(value) {
		const newState = Object.assign({}, this.state);
		if (newState.formValid !== value) {
			newState.formValid = value;
			this.setState(newState);
		}
	}
	setPageLoading(value) {
		const newState = Object.assign({}, this.state);
		if (newState.pageLoading !== value) {
			newState.pageLoading = value;
			this.setState(newState);
		}
	}
	setUpdatingProfile(value) {
		const newState = Object.assign({}, this.state);
		if (newState.updatingProfile !== value) {
			newState.updatingProfile = value;
			this.setState(newState);
		}
	}
	setSocialMedia(socialMediaVal) {
		const newState = Object.assign({}, this.state);
		console.log("SocialMDine", socialMediaVal);
		if (newState.data.socialMedia !== socialMediaVal) {
			newState.data.socialMedia = socialMediaVal;
			this.setState(newState);
		}
	}
	handleProfileChange(event) {
		if (event.target.name === "firstname") {
			if (!event.target.value) {
				this.setShowError("firstname", true);
				this.setErrorMessage("firstname", "This field cannot be empty");
			} else {
				this.setShowError("firstname", false);
				this.setErrorMessage("firstname", "");
			}
		}
		if (event.target.name === "lastname") {
			if (!event.target.value) {
				this.setShowError("lastname", true);
				this.setErrorMessage("lastname", "This field cannot be empty");
			} else {
				this.setShowError("lastname", false);
				this.setErrorMessage("lastname", "");
			}
		}
		if (event.target.name === "email") {
			let re =
				/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if (!re.test(event.target.value)) {
				this.setShowError("email", true);
				this.setErrorMessage(
					"email",
					"The entered email is invalid. Please enter a valid email"
				);
			} else {
				this.setShowError("email", false);
				this.setErrorMessage("email", "");
			}
		}
		if (event.target.name === "socialMedia") {
			if (!event.target.value) {
				this.setShowError("socialMedia", true);
				this.setErrorMessage(
					"socialMedia",
					"Please enter a valid social media"
				);
			} else {
				this.setShowError("socialMedia", false);
				this.setErrorMessage("socialMedia", "");
			}
		}
		if (event.target.name === "phoneNumber") {
			let re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
			if (!re.test(event.target.value)) {
				this.setShowError("phoneNumber", true);
				this.setErrorMessage(
					"phoneNumber",
					"The entered phone number is invalid. Please enter a valid number"
				);
			} else {
				this.setShowError("phoneNumber", false);
				this.setErrorMessage("phoneNumber", "");
			}
		}
		this.setProfile(event.target.name, event.target.value);
	}
	updateChanges() {
		let valid = true;
		for (let property in this.state.showError) {
			if (this.state.showError[property]) {
				valid = false;
			}
		}
		if (valid) {
			const newState = Object.assign({}, this.state);
			if (newState.updatingProfile !== true) {
				newState.updatingProfile = true;
				this.setState(newState, () => {
					const updatedProfile = Object.assign({}, this.state.profile, {
						socialMedia: Object.assign({}, ...this.state.data.socialMedia),
					});
					updateProfile(updatedProfile)
						.then(() => {
							const newState = Object.assign({}, this.state);
							if (newState.updatingProfile !== false) {
								newState.updatingProfile = false;
								this.setState(newState, () => {
									this.setAlertInfo(
										true,
										"Your changes were saved succesfully",
										"success"
									);
									setInterval(() => {
										this.setAlertInfo(false, "", null);
									}, 5000);
								});
							}
						})
						.catch(() => {
							const newState = Object.assign({}, this.state);
							if (newState.updatingProfile !== false) {
								newState.updatingProfile = false;
								this.setState(newState, () => {
									this.setAlertInfo(
										true,
										"Your changes were not saved, please try after sometime!",
										"danger"
									);
									setInterval(() => {
										this.setAlertInfo(false, "", null);
									}, 5000);
								});
							}
						});
				});
			}
		} else {
			this.setAlertInfo(
				true,
				"You have entered invalid data. Please correct and try again",
				"danger"
			);
			setInterval(() => {
				this.setAlertInfo(false, "", null);
			}, 5000);
		}
	}

	componentDidUpdate(prevProps, prevState) {
		const { val } = this.state;
		if (val !== prevState.val) {
			const socialMediaValues = val.map((item) => item.socialMedia).join(","); // join the array of strings into a single string
			this.setState((prevState) => ({
				input: { ...prevState.input, socialMedia: socialMediaValues },
			}));
		}
	}

	handleRemoveImage() {
		console.log("Rinvemvsorn");
		this.setProfile("image", null);
	}

	handleUpdatePassword = () => {
		const { currentPassword, newPassword, confirmPassword } = this.state;
		if (currentPassword === "") {
			this.setState({
				showError: true,
				errorMessage: "Please enter your current password.",
			});
			return;
		}

		if (newPassword === "") {
			this.setState({
				showError: true,
				errorMessage: "Please enter a new password.",
			});
			return;
		}

		if (confirmPassword === "") {
			this.setState({
				showError: true,
				errorMessage: "Please confirm your new password.",
			});
			return;
		}

		if (newPassword !== confirmPassword) {
			this.setState({
				showError: true,
				errorMessage:
					"The new password and confirmation password do not match.",
			});
			return;
		}

		updatePassword({ currentPassword, newPassword })
			.then((response) => {})
			.catch((error) => {
				console.error(error);
			});
	};

	render() {
		const { val } = this.state;
		const {
			data,
			validateInput,
			setInput,
			setData,
			handleChangeImage,
			handleRemoveImage,
			i,
			inputFile,
		} = this.props;

		const userSocialMedia = this.state.profile.socialMedia;
		return (
			<div class="bg-slate-600">
				<SideBar />
				{this.state.pageLoading ? (
					<div class="flex h-screen justify-center items-center">
						<svg
							aria-hidden="true"
							class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
					</div>
				) : (
					<div>
						<div class="container w-auto px-5 py-2">
							<div class="bg-white mt-4 p-6">
								<h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
									Account
									<div className="my-4 bg-gray-600 h-[1px]" />
								</h2>
								<div class="relative mb-4">
									<div class="pb-8">
										<label class="block px-2 text-lg font-medium text-gray-600">
											Profile
										</label>
										<label class="block px-2 text-sm font-medium text-gray-400">
											This information will be displayed publicly, so be careful
											what you share
										</label>
									</div>
									<div class="py-2 grid grid-cols-1 md:grid-cols-2">
										<div class="mt-1 px-2">
											<label
												htmlFor="firstname"
												class="block text-md font-medium text-gray-600"
											>
												First Name
											</label>
											<input
												type="text"
												name="firstname"
												id="firstname"
												class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
												placeholder="Enter your first name here"
												defaultValue={this.state.profile.firstname}
												onChange={this.handleProfileChange}
											/>
											<div
												className="h-[24px] text-red-600"
												style={{
													visibility: this.state.showError.firstname
														? "visible"
														: "hidden",
												}}
											>
												{this.state.errorMessage.firstname}
											</div>
										</div>
										<div class="mt-1 px-2">
											<label
												htmlFor="lastname"
												class="block text-md font-medium text-gray-600"
											>
												Last Name
											</label>
											<input
												type="text"
												name="lastname"
												id="lastname"
												class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
												placeholder="Enter your last name here"
												defaultValue={this.state.profile.lastname}
												onChange={this.handleProfileChange}
											/>
											<div
												className="h-[24px] text-red-600"
												style={{
													visibility: this.state.showError.lastname
														? "visible"
														: "hidden",
												}}
											>
												{this.state.errorMessage.lastname}
											</div>
										</div>
									</div>
									<div class="py-3 grid grid-cols-1">
										<div class="mt-1 px-2">
											<label
												htmlFor="username"
												class="block text-md font-medium text-gray-600"
											>
												User Name
											</label>
											<input
												type="text"
												name="username"
												id="username"
												class="w-full bg-gray-200 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
												placeholder="Enter your username here"
												defaultValue={this.state.profile.username}
												onChange={this.handleProfileChange}
												disabled={true}
											/>
										</div>
									</div>
									<div class="py-3 grid grid-cols-1">
										<div class="mt-1 px-2">
											<label
												htmlFor="photo"
												class="block text-md font-medium text-gray-600"
											>
												Photo
											</label>
											<div class="py-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
												<div class="flex flex-col justify-center items-center">
													<img
														class="rounded-full h-20"
														src={
															process.env.REACT_APP_BUCKET_HOST +
															this.state.profile.image
														}
														alt="profile"
													/>
												</div>
												<div class="flex flex-col justify-center items-center">
													<ChangeImage
														input={this.state}
														setInput={this.setProfile.bind(this)}
													/>
												</div>
												<div class="flex flex-col justify-center items-center">
													<button
														onClick={() => this.setProfile("image", "")}
														class="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded content-center"
													>
														Remove
													</button>
												</div>
											</div>
										</div>
									</div>
									<div class="py-3 grid grid-cols-1">
										<div class="mt-1 px-2">
											<label
												htmlFor="description"
												class="block text-md font-medium text-gray-600"
											>
												Description
											</label>
											<textarea
												type="text"
												name="description"
												id="description"
												class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
												placeholder="Write a description about yourself"
												defaultValue={this.state.profile.description}
												onChange={this.handleProfileChange}
											/>
										</div>
									</div>
									<div class="py-3 grid grid-cols-1">
										<div class="mt-1 px-2">
											<label
												htmlFor="website"
												class="block text-md font-medium text-gray-600"
											>
												URL/Website
											</label>
											<input
												type="text"
												name="website"
												id="website"
												class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
												placeholder="Enter your website here"
												defaultValue={this.state.profile.website}
												onChange={this.handleProfileChange}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<SocialMedia setSocialMedia={this.setSocialMedia.bind(this)} />
						<div class="container w-auto px-5 py-2 bg-slate-600">
							<div class="bg-white mt-4 p-6">
								<div className="py-2 mt-1 px-2">
									<button
										className="w-full hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
										onClick={this.updateChanges}
										disabled={
											!this.state.formValid || this.state.updatingProfile
										}
									>
										Save Changes
										{this.state.updatingProfile && (
											<svg
												aria-hidden="true"
												class="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
												viewBox="0 0 100 101"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
													fill="currentColor"
												/>
												<path
													d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
													fill="currentFill"
												/>
											</svg>
										)}
									</button>
								</div>
								{this.state.alertInfo.show ? (
									<div class="py-2 mt-1 px-2">
										<Alert
											ref={this.alertRef}
											type={this.state.alertInfo.type}
											message={this.state.alertInfo.message}
										/>
									</div>
								) : null}
							</div>
						</div>
					</div>
				)}
			</div>
		);
	}
}
export default ProfilePage;
