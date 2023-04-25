import React from 'react';
import SideBar from '../Components/SideBar';
import Alert from '../Components/Alert';
import './bodyContainer.css';
import {getProfile, updateProfile, updatePassword} from '../Services/usersApi'
import { socialMedia }  from "../Constants/socialMedia";
import {getListingsById} from '../Services/listingsApi'
import { getVillages } from "../Services/villages";
// import ('https://fonts.googleapis.com/css2?family=Poppins:wght@200;600&display=swap');

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            input: {
                socialMedia: "",
              },
            profile: {},
            alertInfo: {show : false, message: "", type: null},
            showError: {},
            errorMessage: {},
            formValid: true,
            pageLoading: true,
            updatingProfile: false,
            val: [{  selected: "" , socialMedia: ""}],
            data: {
                socialMedia: ""
            }
        };
        this.handleProfileChange = this.handleProfileChange.bind(this);
        this.updateChanges = this.updateChanges.bind(this);
    }
    componentDidMount() {
        document.title = "Your Profile";
        this.setPageLoading(true)
        getProfile().then((response) => {
            const newState = Object.assign({}, this.state);
            newState.profile = response.data.data;
            newState.pageLoading = false;
            this.setState(newState);
        }).catch((error) => {
            this.setPageLoading(false)
            this.setAlertInfo(true, "Failed to fetch your profile info, please try again!", "danger");
        })
    }
    componentDidUpdate() {
        let valid = true;
        for (let property in this.state.showError) {
            if (this.state.showError[property]) {
                valid = false
                break
            }
        }
        this.setFormValid(valid)
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
        newState.alertInfo = {show, message, type};
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
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(event.target.value)) {
                this.setShowError("email", true);
                this.setErrorMessage("email", "The entered email is invalid. Please enter a valid email");
            } else {
                this.setShowError("email", false);
                this.setErrorMessage("email", "");
            }
        }
        if (event.target.name === "socialMedia") {
            if (!event.target.value) {
                this.setShowError("socialMedia", true);
                this.setErrorMessage("socialMedia", "Please enter a valid social media");
            } else {
                this.setShowError("socialMedia", false);
                this.setErrorMessage("socialMedia", "");
            }
        }
        if (event.target.name === "phoneNumber") {
            let re = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g
            if (!re.test(event.target.value)) {
                this.setShowError("phoneNumber", true);
                this.setErrorMessage("phoneNumber", "The entered phone number is invalid. Please enter a valid number");
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
              const updatedData = this.state.val.reduce((obj, data) => {
                obj[data.selected] = data.socialMedia;
                return obj;
              }, {});
              const updatedProfile = Object.assign({}, this.state.profile, { socialMedia: updatedData });
              updateProfile(updatedProfile).then(() => {
                const newState = Object.assign({}, this.state);
                if (newState.updatingProfile !== false) {
                  newState.updatingProfile = false;
                  this.setState(newState, () => {
                    this.setAlertInfo(true, "Your changes were saved succesfully", "success");
                    setInterval(() => {
                      this.setAlertInfo(false, "", null);
                    }, 5000);
                  });
                }
              }).catch(() => {
                const newState = Object.assign({}, this.state);
                if (newState.updatingProfile !== false) {
                  newState.updatingProfile = false;
                  this.setState(newState, () => {
                    this.setAlertInfo(true, "Your changes were not saved, please try after sometime!", "danger");
                    setInterval(() => {
                      this.setAlertInfo(false, "", null);
                    }, 5000);
                  });
                }
              });
            });
          }
        } else {
          this.setAlertInfo(true, "You have entered invalid data. Please correct and try again", "danger");
          setInterval(() => {
            this.setAlertInfo(false, "", null);
          }, 5000);
        }
      }

      handleAdd = (value) => {
        const { val } = this.state;
        this.setState({val: [...val, { selected: "" , socialMedia: value}]});
      };

      handleDelete = (index) => {
        const list = [...this.state.val];
        list.splice(index, 1);
        this.setState({
            val: list,
            data: { socialMedia: JSON.stringify(list) }
        }, () => {
        });
    };

        handleSocialMediaChanges = (event, index) => {
            const { name, value } = event.target;
            this.setState(prevState => ({
            val: prevState.val.map((data, i) =>
                i === index ? { ...data, [name]: value } : data
            )
            }), () => {
            const updatedData = this.state.val.reduce((obj, data) => {
                obj[data.selected] = data.socialMedia;
                return obj;
            }, {});
            console.log(updatedData);
            this.setState(prevState => ({
                input: {
                ...prevState.input,
                socialMedia: updatedData[event.target.value]
                }
            }));
            });
        }

            componentDidUpdate(prevProps, prevState) {
                const { val } = this.state;
                if (val !== prevState.val) {
                const socialMediaValues = val.map(item => item.socialMedia).join(','); // join the array of strings into a single string
                this.setState(prevState => ({
                    input: { ...prevState.input, socialMedia: socialMediaValues }
                }));
                }
            }

      handleUpdatePassword = () => {
        const { currentPassword, newPassword, confirmPassword } = this.state;
        if (currentPassword === "") {
          this.setState({
            showError: true,
            errorMessage: "Please enter your current password."
          });
          return;
        }

        if (newPassword === "") {
          this.setState({
            showError: true,
            errorMessage: "Please enter a new password."
          });
          return;
        }

        if (confirmPassword === "") {
          this.setState({
            showError: true,
            errorMessage: "Please confirm your new password."
          });
          return;
        }

        if (newPassword !== confirmPassword) {
          this.setState({
            showError: true,
            errorMessage: "The new password and confirmation password do not match."
          });
          return;
        }

        updatePassword({ currentPassword, newPassword })
          .then(response => {
            console.log(response);
          })
          .catch(error => {
            console.error(error);
          });
      }

    render() {
        const { val } = this.state;
        const { data, validateInput, setInput, setData, handleSocialMediaChanges, i } = this.props;
        return (
        <div class="bg-slate-600">
            <SideBar/>
            {
            this.state.pageLoading ?
            <div class="flex h-screen justify-center items-center">
                <svg aria-hidden="true" class="inline w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
            </div> :
            <div>
                <div class="container w-auto px-5 py-2">
                    <div class="bg-white mt-4 p-6">
                        <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
                            Account
                            <div className="my-4 bg-gray-600 h-[1px]"/>
                        </h2>
                        <div class="relative mb-4">
                            <div class="pb-8">
                                <label
                                class="block px-2 text-lg font-medium text-gray-600"
                                >
                                Profile
                                </label>
                                <label
                                class="block px-2 text-sm font-medium text-gray-400"
                                >
                                This information will be displayed publicly, so be careful what you share
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
                                    <div className="h-[24px] text-red-600" style={{visibility: this.state.showError.firstname ? 'visible' : 'hidden'}}>
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
                                    <div className="h-[24px] text-red-600" style={{visibility: this.state.showError.lastname ? 'visible' : 'hidden'}}>
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
                                        <img class="rounded-full h-20" src={this.state.profile.image} alt="image" />
                                    </div>
                                    <div class="flex flex-col justify-center items-center">
                                        <button class="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
                                            Change
                                        </button>
                                    </div>
                                    <div class="flex flex-col justify-center items-center">
                                        <button class="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded content-center">
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

                            <div class="container w-auto px-5 py-2 bg-slate-600">
                                <div class="bg-white mt-4 p-6 space-y-10">
                                        <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
                                        Social Media
                                        <div className="my-4 bg-gray-600 h-[1px]"></div>
                                        </h2>

                                        <div class="relative mb-4">
                                        <label
                                            for="category"
                                            class="block text-sm font-medium text-gray-600"
                                        >
                                            Add your social media accounts here
                                        </label>
                                        <div class="relative mb-4">
                                            <div class="relative mb-4 mt-2 border-white">
                                            {this.state.val.map((data, i) => {
                                                return (
                                                <div key={i} class="items-stretch py-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div class="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                                                    <label
                                                        for="country"
                                                        class="block text-md font-medium text-gray-600"
                                                    >
                                                        Select
                                                    </label>
                                                    <select
                                                        type="text"
                                                        id="selected"
                                                        name="selected"
                                                        value={data.selected || ""}
                                                        onBlur={validateInput}
                                                        onChange={e => this.handleSocialMediaChanges(e, i)}
                                                        autoComplete="country-name"
                                                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                                        >
                                                        <option>Select</option>
                                                        {socialMedia.map(option => (
                                                            <option key={option} value={option}>
                                                            {option}
                                                            </option>
                                                        ))}
                                                        </select>
                                                    </div>
                                                    <div class="mt-2 px-0 ml-2">
                                                    <label
                                                        htmlFor="lastName"
                                                        class="block text-md font-medium text-gray-600"
                                                    >
                                                        Website
                                                    </label>
                                                    <input
                                                        type="text"
                                                        id="socialMedia"
                                                        name="socialMedia"
                                                        defaultValue={this.state.profile.socialMedia}
                                                        onChange={e => this.handleSocialMediaChanges(e, i)}
                                                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                                        placeholder="ainfo@heidi-app.de"
                                                    />

                                                    </div>
                                                    <div class="flex ml-2 mt-8">
                                                    <button onClick={() => this.handleDelete(i)}>
                                                        <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        class="w-5 h-5"
                                                        viewBox="0 0 512 512"
                                                        >
                                                        <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                                                        </svg>
                                                    </button>
                                                    </div>
                                                </div>
                                                );
                                            })}
                                            <button
                                                class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded"
                                                onClick={() => this.handleAdd("")}
                                            >
                                                + Add your social media
                                            </button>
                                            </div>
                                            <div class="flex justify-center space-x-6 mt-7">
                                            <svg
                                                aria-hidden="true"
                                                focusable="false"
                                                data-prefix="far"
                                                data-icon="arrow-alt-circle-up"
                                                class="w-5 h-5"
                                                role="img"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <path
                                                fill="currentColor"
                                                d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                                                />
                                            </svg>
                                            <svg
                                                aria-hidden="true"
                                                focusable="false"
                                                data-prefix="far"
                                                data-icon="arrow-alt-circle-right"
                                                class="w-5 h-5"
                                                role="img"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <path
                                                fill="currentColor"
                                                d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
                                                />
                                            </svg>
                                            <svg
                                                aria-hidden="true"
                                                focusable="false"
                                                data-prefix="far"
                                                data-icon="arrow-alt-circle-down"
                                                class="w-5 h-5"
                                                role="img"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <path
                                                fill="currentColor"
                                                d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"
                                                />
                                            </svg>
                                            <svg
                                                aria-hidden="true"
                                                focusable="false"
                                                data-prefix="far"
                                                data-icon="arrow-alt-circle-down"
                                                class="w-5 h-5"
                                                role="img"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <path
                                                fill="currentColor"
                                                d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"
                                                />
                                            </svg>
                                            <svg
                                                aria-hidden="true"
                                                focusable="false"
                                                data-prefix="far"
                                                data-icon="arrow-alt-circle-down"
                                                class="w-5 h-5"
                                                role="img"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 512 512"
                                            >
                                                <path
                                                fill="currentColor"
                                                d="M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z"
                                                />
                                            </svg>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                <div class="container w-auto px-5 py-2 bg-slate-600">
                    <div class="bg-white mt-4 p-6">
                        <div className="py-2 mt-1 px-2">
                            <button className="w-full hover:bg-slate-600 text-white font-bold py-2 px-4 rounded bg-black disabled:opacity-60"
                            onClick={this.updateChanges}
                            disabled={!this.state.formValid || this.state.updatingProfile}>
                                Save Changes
                                { this.state.updatingProfile &&
                                <svg aria-hidden="true" class="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                                </svg> }
                            </button>
                        </div>
                        { this.state.alertInfo.show ? 
                            <div class="py-2 mt-1 px-2">
                                <Alert ref={this.alertRef} type={this.state.alertInfo.type} message={this.state.alertInfo.message}/>
                            </div> :
                            null
                        }
                    </div>
                </div>
            </div>
            }
        </div>
        )
    }
}
export default ProfilePage;