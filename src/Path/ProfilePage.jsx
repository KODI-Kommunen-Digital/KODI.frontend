import React from 'react';
import SideBar from '../Components/SideBar';
import './bodyContainer.css';
import { useNavigate } from "react-router-dom";
  
const ProfilePage =() =>{

    let navigate = useNavigate();
    const navigateTo = (path) => {
      if (path) {
        navigate(path);
      }
    }

    return (
    <div>
        <SideBar/>
        <div class="container w-auto px-5 py-2 bg-slate-600">
            <div class="bg-white mt-4 p-6">
                <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
                    Account
                    <div className="my-4 bg-gray-600 h-[1px]"/>
                </h2>
                <div class="relative mb-4">
                    <div class="pb-8">
                        <label
                        for="category"
                        class="block px-2 text-lg font-medium text-gray-600"
                        >
                        Profile
                        </label>
                        <label
                        for="category"
                        class="block px-2 text-sm font-medium text-gray-400"
                        >
                        This information will be displayed publicly, so be careful what you share
                        </label>
                    </div>
                    <div class="py-2 grid grid-cols-1 md:grid-cols-2">
                        <div class="mt-1 px-2">
                            <label
                            for="category"
                            class="block text-md font-medium text-gray-600"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                name="category"
                                id="category"
                                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                placeholder="Max"
                            />
                        </div>
                        <div class="mt-1 px-2">
                            <label
                            for="category"
                            class="block text-md font-medium text-gray-600"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                name="category"
                                id="category"
                                class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                                placeholder="Mullerman"
                            />
                        </div>
                    </div>
                    <div class="py-3 grid grid-cols-1">
                        <div class="mt-1 px-2">
                        <label
                        for="category"
                        class="block text-md font-medium text-gray-600"
                        >
                            Username
                        </label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            placeholder="Max123"
                        />
                        </div>
                    </div>
                    <div class="py-3 grid grid-cols-1">
                        <div class="mt-1 px-2">
                        <label
                        for="category"
                        class="block text-md font-medium text-gray-600"
                        >
                            Photo
                        </label>
                        <div class="py-2 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
                            <div class="flex flex-col justify-center items-center">
                                <img class="rounded-full h-20" src="https://i.ibb.co/L1LQtBm/Ellipse-1.png" alt="avatar" />
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
                        for="category"
                        class="block text-md font-medium text-gray-600"
                        >
                            Description
                        </label>
                        <textarea
                            type="text"
                            name="category"
                            id="category"
                            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            placeholder="Write a description about yourself"
                        />
                        </div>
                    </div> 
                    <div class="py-3 grid grid-cols-1">
                        <div class="mt-1 px-2">
                        <label
                        for="category"
                        class="block text-md font-medium text-gray-600"
                        >
                            URL/Website
                        </label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            placeholder="www.example.com"
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
                        for="category"
                        class="block px-2 text-sm font-medium text-gray-400"
                        >
                        This information will be displayed publicly, so be careful what you share
                        </label>
                    </div>
                    <div class="py-2 grid grid-cols-1 md:grid-cols-2">
                        <div class="mt-1 px-2">
                        <label
                        for="category"
                        class="block text-md font-medium text-gray-600"
                        >
                            Email
                        </label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            placeholder="abc@def.com"
                        />
                        </div>
                        <div class="mt-1 px-2">
                        <label
                        for="category"
                        class="block text-md font-medium text-gray-600"
                        >
                            Phone Number
                        </label>
                        <input
                            type="text"
                            name="category"
                            id="category"
                            class="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                            placeholder="0123456789"
                        />
                        </div>
                    </div>
                    <div class="py-2 grid grid-cols-1">
                        <div class="mt-1 px-2">
                        <label
                        for="category"
                        class="block text-md font-medium text-gray-600"
                        >
                            Password
                        </label>
                        <button class="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                         onClick={() => navigateTo('/passwordUpdate')}>
                            Update Password
                        </button>
                        </div>
                    </div>
                </div>
                <div class="py-2 mt-1 px-2">
                    <button class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    </div>
    )
}
export default ProfilePage;