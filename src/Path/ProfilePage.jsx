import React, { useRef } from "react";
import SideBar from "../Components/SideBar";
import Alert from "../Components/Alert";
import "./bodyContainer.css";
import PropTypes from "prop-types";
import SocialMedia from "../Components/socialMedia";
import {
  getProfile,
  updateProfile,
  updatePassword,
  uploadProfilePic,
} from "../Services/usersApi";

import { useTranslation, withTranslation } from "react-i18next";
import PROFILEIMAGE from "../assets/ProfilePicture.png";

function ChangeImage({ setInput, reloadPage }) {
  ChangeImage.propTypes = {
    setInput: PropTypes.func.isRequired,
    reloadPage: PropTypes.func.isRequired,
  };
  const { t } = useTranslation();
  const inputFile = useRef(null);
  let file = false;
  function handleChangeImage(e) {
    file = e.target.files[0];
    const form = new FormData();
    form.append("image", file);
    uploadProfilePic(form).then((res) => {
      setInput("image", res.data.path);
      reloadPage(); // Reload the page after updating the image
    });
  }

  return (
    <>
      {file ? <img src={URL.createObjectURL(file)} alt={"Profile"} /> : ""}
      <button
        onClick={() => inputFile.current.click()}
        className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded w-full sm:w-auto"
      >
        {t("change")}
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
      isLoggedIn: false,
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
    const accessToken =
      window.localStorage.getItem("accessToken") ||
      window.sessionStorage.getItem("accessToken");
    const refreshToken =
      window.localStorage.getItem("refreshToken") ||
      window.sessionStorage.getItem("refreshToken");
    if (!accessToken && !refreshToken) {
      this.navigateTo("/login");
    }
    const { t } = this.props;
    document.title = process.env.REACT_APP_REGION_NAME + " " + t("profile");
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
        this.setAlertInfo(true, t("failedToFetchData"), "danger");
        console.error("Error fetching profile:", error);
      });
  }

  componentDidUpdate() {
    let valid = true;
    for (const property in this.state.showError) {
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
    if (newState.data.socialMedia !== socialMediaVal) {
      newState.data.socialMedia = socialMediaVal;
      this.setState(newState);
    }
  }

  handleProfileChange(event) {
    const { t } = this.props;
    if (event.target.name === "firstname") {
      if (!event.target.value) {
        this.setShowError("firstname", true);
        this.setErrorMessage("firstname", t("this_field_cannot_be_empty"));
      } else {
        this.setShowError("firstname", false);
        this.setErrorMessage("firstname", "");
      }
    }
    if (event.target.name === "lastname") {
      if (!event.target.value) {
        this.setShowError("lastname", true);
        this.setErrorMessage("lastname", t("this_field_cannot_be_empty"));
      } else {
        this.setShowError("lastname", false);
        this.setErrorMessage("lastname", "");
      }
    }
    if (event.target.name === "email") {
      const re =
        /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(event.target.value)) {
        this.setShowError("email", true);
        this.setErrorMessage("email", t("entered_email_not_valid"));
      } else {
        this.setShowError("email", false);
        this.setErrorMessage("email", "");
      }
    }
    if (event.target.name === "socialMedia") {
      if (!event.target.value) {
        this.setShowError("socialMedia", true);
        this.setErrorMessage("socialMedia", t("enter_valid_social_media"));
      } else {
        this.setShowError("socialMedia", false);
        this.setErrorMessage("socialMedia", "");
      }
    }
    if (event.target.name === "phoneNumber") {
      const re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s/0-9]*$/g;
      if (!re.test(event.target.value)) {
        this.setShowError("phoneNumber", true);
        this.setErrorMessage("phoneNumber", t("enter_valid_phone_number"));
      } else {
        this.setShowError("phoneNumber", false);
        this.setErrorMessage("phoneNumber", "");
      }
    }
    this.setProfile(event.target.name, event.target.value);
  }

  updateChanges() {
    const { t } = this.props;
    let valid = true;
    for (const property in this.state.showError) {
      if (this.state.showError[property]) {
        valid = false;
      }
    }
    if (valid) {
      const newState = Object.assign({}, this.state);
      if (newState.updatingProfile !== true) {
        newState.updatingProfile = true;
        this.setState(newState, () => {
          const tempProfile = this.state.profile;
          tempProfile.socialMedia = this.state.data.socialMedia.socialMedia;
          const updatedProfile = Object.assign({}, tempProfile);

          updateProfile(updatedProfile)
            .then(() => {
              const newState = Object.assign({}, this.state);
              if (newState.updatingProfile !== false) {
                newState.updatingProfile = false;
                this.setState(newState, () => {
                  this.setAlertInfo(
                    true,
                    t("your_changes_were_saved_successfully"),
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
                  this.setAlertInfo(true, t("changesNotSaved"), "danger");
                  setInterval(() => {
                    this.setAlertInfo(false, "", null);
                  }, 5000);
                });
              }
            });
        });
      }
    } else {
      this.setAlertInfo(true, t("invalidData"), "danger");
      setInterval(() => {
        this.setAlertInfo(false, "", null);
      }, 5000);
    }
  }

  handleRemoveImage() {
    this.setProfile("image", null);
  }

  handleUpdatePassword = () => {
    const { t } = this.props;
    const { currentPassword, newPassword, confirmPassword } = this.state;
    if (currentPassword === "") {
      this.setState({
        showError: true,
        errorMessage: t("enter_current_password"),
      });
      return;
    }

    if (newPassword === "") {
      this.setState({
        showError: true,
        errorMessage: t("enter_a_new_password"),
      });
      return;
    }

    if (confirmPassword === "") {
      this.setState({
        showError: true,
        errorMessage: t("confirm_your_password"),
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      this.setState({
        showError: true,
        errorMessage: t("password_do_not_match"),
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
    const { t } = this.props;
    return (
      <div className="bg-slate-600">
        <SideBar />
        {this.state.pageLoading ? (
          <div className="flex h-screen justify-center items-center">
            <svg
              aria-hidden="true"
              className="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
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
            <div className="container w-auto px-5 py-2">
              <div className="bg-white mt-4 p-6">
                <h2
                  className="text-gray-900 text-lg mb-4 font-medium title-font"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                  }}
                >
                  {t("account")}
                  <div className="my-4 bg-gray-600 h-[1px]" />
                </h2>
                <div className="relative mb-4">
                  <div className="pb-8">
                    <label
                      className="block px-2 text-lg font-medium text-gray-600"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {t("profile")}
                    </label>
                    <label
                      className="block px-2 text-sm font-medium text-gray-400"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {t("displayed_publicly")}
                    </label>
                  </div>
                  <div className="py-2 grid grid-cols-1 md:grid-cols-2">
                    <div className="mt-1 px-2">
                      <label
                        htmlFor="firstname"
                        className="block text-sm font-medium text-gray-600"
                      >
                        {t("firstName")} *
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        id="firstname"
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder={t("pleaseEnterFirstName")}
                        required
                        defaultValue={this.state.profile.firstname}
                        onChange={this.handleProfileChange}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
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
                    <div className="mt-1 px-2">
                      <label
                        htmlFor="lastname"
                        className="block text-sm font-medium text-gray-600"
                      >
                        {t("lastName")} *
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        id="lastname"
                        required
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder={t("pleaseEnterLastName")}
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
                  <div className="py-3 grid grid-cols-1">
                    <div className="mt-1 px-2">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-600"
                      >
                        {t("username")}
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        className="w-full bg-gray-200 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder={t("pleaseEnterUsername")}
                        required
                        defaultValue={this.state.profile.username}
                        onChange={this.handleProfileChange}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                        disabled={true}
                      />
                    </div>
                  </div>
                  <div className="py-3 grid grid-cols-1">
                    <div className="mt-1 px-2">
                      <label
                        htmlFor="photo"
                        className="block text-sm font-medium text-gray-600"
                      >
                        {t("photo")}
                      </label>
                      <div className="py-2 md:flex md:space-x-4 flex-raw space-y-2">
                        <div className="flex md:flex-col justify-center items-start">
                          <img
                            className="rounded-full h-20 w-20 object-cover"
                            src={
                              this.state.profile.image
                                ? process.env.REACT_APP_BUCKET_HOST +
                                  this.state.profile.image
                                : PROFILEIMAGE
                            }
                            alt="profile"
                          />
                        </div>
                        <div
                          className="flex md:flex-col justify-center items-start"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          <ChangeImage
                            setInput={(key, value) =>
                              this.setProfile(key, value)
                            }
                            reloadPage={() => window.location.reload()}
                          />
                        </div>
                        <div className="flex md:flex-col justify-center md:items-center item-center">
                          <button
                            onClick={() => this.setProfile("image", "")}
                            className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded content-center w-full sm:w-auto"
                            style={{
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            {t("remove")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="py-3 grid grid-cols-1">
                    <div className="mt-1 px-2">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-600"
                      >
                        {t("description")}
                      </label>
                      <textarea
                        type="text"
                        name="description"
                        id="description"
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder={t("enter_description")}
                        defaultValue={this.state.profile.description}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                        onChange={this.handleProfileChange}
                      />
                    </div>
                  </div>
                  <div className="py-3 grid grid-cols-1">
                    <div className="mt-1 px-2">
                      <label
                        htmlFor="website"
                        className="block text-sm font-medium text-gray-600"
                      >
                        {t("url/website")}
                      </label>
                      <input
                        type="text"
                        name="website"
                        id="website"
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder={t("enter_website")}
                        defaultValue={this.state.profile.website}
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                        onChange={this.handleProfileChange}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <SocialMedia setSocialMedia={this.setSocialMedia.bind(this)} />
            <div className="container w-auto px-5 py-2 bg-slate-600">
              <div className="bg-white mt-4 p-6">
                <div className="py-2 mt-1 px-2">
                  <button
                    className="w-full hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
                    onClick={this.updateChanges}
                    disabled={
                      !this.state.formValid || this.state.updatingProfile
                    }
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {t("saveChanges")}
                    {this.state.updatingProfile && (
                      <svg
                        aria-hidden="true"
                        className="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
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
                  <div className="py-2 mt-1 px-2">
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

ProfilePage.propTypes = {
  t: PropTypes.func.isRequired,
};
export default withTranslation()(ProfilePage);
