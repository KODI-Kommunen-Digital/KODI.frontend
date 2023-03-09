import React, {useState, useEffect} from 'react';
import SideBar from '../Components/SideBar';
import Alert from '../Components/Alert';
import './bodyContainer.css';
import { useNavigate } from "react-router-dom";
import {getProfile, updateProfile} from '../Services/profile'

class ProfilePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            profile: {},
            alertInfo: {show : false, message: "", type: null},
            showError: {},
            errorMessage: {},
            formValid: true
        };
        this.handleProfileChange = this.handleProfileChange.bind(this);
        this.updateChanges = this.updateChanges.bind(this);
    }
    componentDidMount() {
        document.title = "Heidi - Profile";
        getProfile().then((response) => {
            const newState = Object.assign({}, this.state);
            newState.profile = response.data.data;
            this.setState(newState);
        }).catch((error) => {
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
        if (newState.formValid != value) {
            newState.formValid = value;
            this.setState(newState);
        }
    }
    handleProfileChange(event) {
        if (event.target.name == "firstname") {
            if (!event.target.value) {
                this.setShowError("firstname", true);
                this.setErrorMessage("firstname", "This field cannot be empty");
            } else {
                this.setShowError("firstname", false);
                this.setErrorMessage("firstname", "");
            }
        }
        if (event.target.name == "lastname") {
            if (!event.target.value) {
                this.setShowError("lastname", true);
                this.setErrorMessage("lastname", "This field cannot be empty");
            } else {
                this.setShowError("lastname", false);
                this.setErrorMessage("lastname", "");
            }
        }
        if (event.target.name == "email") {
            let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (!re.test(event.target.value)) {
                this.setShowError("email", true);
                this.setErrorMessage("email", "The entered email is invalid. Please enter a valid email");
            } else {
                this.setShowError("email", false);
                this.setErrorMessage("email", "");
            }
        }
        if (event.target.name == "phoneNumber") {
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
            if (this.state.showError[property])
                valid = false
        }
        if (valid) {
            updateProfile(this.state.profile).then(() => {
                this.setAlertInfo(true, "Your changes were saved succesfully", "success");
                setInterval(() => {
                    this.setAlertInfo(false, "", null)
                    }, 5000)
            }).catch(() => {
                this.setAlertInfo(true, "Your changes were not saved, please try after sometime!", "danger");
                setInterval(() => {
                    this.setAlertInfo(false, "", null)
                    }, 5000);
            })
        } else {
            this.setAlertInfo(true, "You have entered invalid data. Please correct and try again", "danger");
            setInterval(() => {
                this.setAlertInfo(false, "", null)
                }, 5000);
        }
    }
    render() {
        return (
        <div class="bg-slate-600">
            <SideBar/>
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
                                disabled='true'
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
                                    <img class="rounded-full h-20" src={this.state.profile.image} alt="avatar" />
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
                <div class="bg-white mt-4 p-6">
                    <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
                        Personal Information
                        <div className="my-4 bg-gray-600 h-[1px]"/>
                    </h2>
                    <div class="relative mb-4">
                        <div class="pb-8">
                            <label
                            class="block px-2 text-sm font-medium text-gray-400"
                            >
                            This information will be displayed publicly, so be careful what you share
                            </label>
                        </div>
                        <div class="py-2 grid grid-cols-1 md:grid-cols-2">
                            <div class="mt-1 px-2">
                            <label
                            class="block text-md font-medium text-gray-600"
                            >
                                Email
                            </label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                placeholder="Enter your email here"
                                defaultValue={this.state.profile.email}
                                onChange={this.handleProfileChange}
                            />
                            <div className="h-[24px] text-red-600" style={{visibility: this.state.showError.email ? 'visible' : 'hidden'}}>
                                {this.state.errorMessage.email}
                            </div>
                            </div>
                            <div class="mt-1 px-2">
                            <label
                            htmlFor="phoneNumber"
                            class="block text-md font-medium text-gray-600"
                            >
                                Phone Number
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                id="phoneNumber"
                                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                placeholder="Enter your phone number here"
                                defaultValue={this.state.profile.phoneNumber}
                                onChange={this.handleProfileChange}
                            />
                            <div className="h-[24px] text-red-600" style={{visibility: this.state.showError.phoneNumber ? 'visible' : 'hidden'}}>
                                {this.state.errorMessage.phoneNumber}
                            </div>
                            </div>
                        </div>
                        <div class="py-2 grid grid-cols-1">
                            <div class="mt-1 px-2">
                            <label
                            htmlFor="category"
                            class="block text-md font-medium text-gray-600"
                            >
                                Password
                            </label>
                            <button className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                            onClick={() => this.navigateTo('/passwordUpdate')}>
                                Update Password
                            </button>
                            </div>
                        </div>
                    </div>
                    <div className="py-2 mt-1 px-2">
                        <button className={`w-full hover:bg-slate-600 text-white font-bold py-2 px-4 rounded ${this.state.formValid ? "bg-black" : "bg-slate-600" }`}
                        onClick={this.updateChanges}
                        disabled={!this.state.formValid}>
                            Save Changes
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
        )
    }
}
export default ProfilePage;