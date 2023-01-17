import React, { useState , useRef } from "react";
import SideBar from '../Components/SideBar';
import JoditEditor from 'jodit-react';

function ListingsPage() {

  const editor = useRef(null);
	const [content, setContent] = useState('');

    return (
      <section class="bg-slate-300 body-font relative">
        <SideBar/>
        <div class="container pr-5 pl-10 py-2 mx-auto flex sm:flex-nowrap flex-wrap bg-slate-200">
          <div class="lg:w-4/5 md:w-1/3 bg-white flex flex-col md:ml-auto w-full md:py-8 mt-8 md:mt-0 p-6 mr-2 space-y-10">
            <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
              Information
              <div className="my-4 bg-gray-600 h-[1px]"></div>
            </h2>
            <div class="relative mb-4">
              <label
                for="category"
                class="block text-sm font-medium text-gray-600"
              >
                Category
              </label>
              <div class="relative mt-1 rounded-md shadow-sm">
                <input
                  type="text"
                  name="category"
                  id="category"
                  class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  placeholder="all your selection categories"
                />
                <div class="absolute inset-y-0 right-0 flex items-center">
                  <select
                    id="currency"
                    name="currency"
                    class="h-full rounded-md border-transparent bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option>Germany</option>
                    <option>Spain</option>
                    <option>France</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="relative mb-4">
              <label for="title" class="block text-sm font-medium text-gray-600">
                Title
              </label>
              <input
                type="email"
                id="email"
                name="email"
                class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                placeholder="enter your title"
              />
            </div>
            <div class="relative mb-4">
              <label for="date" class="block text-sm font-medium text-gray-600">
                Date
              </label>
              <div class="relative">
                <div class="flex absolute inset-y-0 right-1 items-center pl-3 pointer-events-none">
                  <svg
                    aria-hidden="true"
                    class="w-5 h-5 text-gray-600 dark:text-gray-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  placeholder="dd-mm-yyyy"
                />
              </div>
            </div>
            <div class="relative mb-4">
              <label for="time" class="block text-sm font-medium text-gray-600">
                Time
              </label>
              <input
                type="email"
                id="email"
                name="email"
                class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="Select a time"
              />
              <button tabindex="0" type="button" class="timepicker-toggle-button" data-mdb-toggle="timepicker">
                <i class="fas fa-clock timepicker-icon"></i>
              </button>
            </div>
            <div class="relative mb-4">
              <label for="place" class="block text-sm font-medium text-gray-600">
                Place
              </label>
              <input
                type="email"
                id="email"
                name="email"
                class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" placeholder="enter your place"
              />
            </div>
            <div class="relative mb-4">
              <label
                for="description"
                class="block text-sm font-medium text-gray-600"
              >
                Description
              </label>

              <JoditEditor
                ref={editor}
                value={content}
                onChange={newContent => setContent(newContent)}
              />

            </div>
          </div>
        </div>
      </section>
    );
}

export default ListingsPage;
