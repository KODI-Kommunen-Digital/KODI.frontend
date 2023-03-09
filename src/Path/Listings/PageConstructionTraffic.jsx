import React, { useState, useRef, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import JoditEditor from "jodit-react";
import "./bodyContainer.css";
import DragDropFiles from "../../Components/DragDropFiles";
import Maps from "../../Components/Maps";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {requiredData} from "../../Components/Maps";

function ListingsPageConstructionTraffic() {
  //window.scrollTo(0, 0);
  const { t, i18n } = useTranslation();
  useEffect(() => {
    document.title = "Construction sites / traffic";
  }, []);

  const editor = useRef(null);
  const [content, setContent] = useState("");

  //Sending data to backend starts
  const [input, setInput] = useState({
    title:'',
    place:'',
    //address:requiredData.address,
    // latitude:requiredData.lat,
    // longitude:requiredData.lon,
    phone: '',
    email:'',
    description: '',
    media: ''
  });

  const [error, setError] = useState({
    title:'',
    place:'',
    address:'',
    phone: '',
    email:'',
    description: '',
    media: ''
  })

  const onInputChange = e => {
    const { name, value } = e.target;
    setInput(prev => ({
      ...prev,
      [name]: value
    }));
    validateInput(e);
  }

  const handleSubmit = async(event) =>{
    event.preventDefault();

    console.log(input)
  }

  const validateInput = e => {
    let { name, value } = e.target;
    setError(prev => {
      const stateObj = { ...prev, [name]: "" };

      switch (name) {
        case "title":
          if (!value) {
            stateObj[name] = t("pleaseEnterTitle");
          }
          break;
          case "place":
            if(!value){
              stateObj[name] = t("pleaseEnterPlace");
            }
            break;
        case "address":
          if(!value){
            stateObj[name] = t("pleaseEnterAddress");
          }
          break;
          case "phone":
            if(!value){
              stateObj[name] = t("pleaseEnterPhone");
            }
            break;

            case "description":
              if(!value){
                stateObj[name] = t("pleaseEnterDescription");
              }
              break;

              case "media":
              if(!value){
                stateObj[name] = t("pleaseEnterMedia");
              }
              break;

        default:
          break;
      }

      return stateObj;
    });
  }
  //Sending data to backend ends

  return (
    <section class="bg-slate-600 body-font relative">
      <SideBar />

      <form onSubmit={handleSubmit} action="#" method="POST">
        <div class="container w-auto px-5 py-2 bg-slate-600">
          <div class="bg-white mt-4 p-6 space-y-10">
            <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
              Information
              <div className="my-4 bg-gray-600 h-[1px]"></div>
            </h2>
            <div class="relative mb-4">
              <label for="title" class="block text-sm font-medium text-gray-600">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={input.title}
                onChange={onInputChange}
                onBlur={validateInput}
                required
                class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                placeholder="enter your title"
              />
            </div>

            <div class="relative mb-4">
              <label for="email" class="block text-sm font-medium text-gray-600">
                Place
              </label>
              <input
                type="text"
                id="place"
                name="place"
                value={input.place}
                onChange={onInputChange}
                onBlur={validateInput}
                class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                placeholder="Enter your place here"
              />
            </div>

            <div class="col-span-6">
              <label
                for="address"
                class="block text-sm font-medium text-gray-600"
              >
                Street address
              </label>

              <Maps/>

            </div>

            <div class="relative mb-4">
              <label for="telephone" class="block text-sm font-medium text-gray-600">
                Telephone
              </label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={input.phone}
                onChange={onInputChange}
                onBlur={validateInput}
                class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                placeholder="enter your telephone number"
              />
            </div>

            <div class="relative mb-4">
              <label for="email" class="block text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={input.email}
                onChange={onInputChange}
                onBlur={validateInput}
                class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                placeholder="youremail@gmail.com"
              />
            </div>

            <div class="relative mb-4">
              <label
                for="content"
                class="block text-sm font-medium text-gray-600"
              >
                Description
              </label>

              <JoditEditor
                ref={editor}
                value={content}
                onChange={(newContent) => setContent(newContent)}
              />
            </div>
          </div>
        </div>

        <div class="container w-auto px-5 py-2 bg-slate-600">
          <div class="bg-white mt-4 p-6 space-y-10">
            <h2 class="text-gray-900 text-lg mb-4 font-medium title-font">
              Media
              <div className="my-4 bg-gray-600 h-[1px]"></div>
            </h2>

            <div>
              <label class="block text-sm font-medium text-gray-700">
                Upload here
              </label>
              <DragDropFiles/>
            </div>
            {/* <div class="relative mb-4 mt-8 border-white">
              <button class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
                Save Changes
              </button>
            </div> */}
          </div>
        </div>

        <div class="container w-auto px-5 py-2 bg-slate-600">
          <div class="bg-white mt-4 p-6 space-y-10">
            <div class="relative mb-4 mt-8 border-white">
              <button type="submit" class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}

export default ListingsPageConstructionTraffic;
