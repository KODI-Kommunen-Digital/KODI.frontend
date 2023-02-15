import React, { useState, useRef, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import JoditEditor from "jodit-react";
import "./bodyContainer.css";
import DragDropFiles from "../../Components/DragDropFiles";
import Maps from "../../Components/Maps";
//import OpenstreetMapLoader from "../Path/OpenstreetMapLoader";

function ListingsPageConstructionTraffic() {
  useEffect(() => {
    document.title = "Construction sites / traffic";
  }, []);

  const [val, setVal] = useState([]);
  const handleAdd = () => {
    const abc = [...val, []];
    setVal(abc);
  };
  const handleChange = (onChangeValue, i) => {
    const inputdata = [...val];
    inputdata[i] = onChangeValue.target.value;
    setVal(inputdata);
  };
  const handleDelete = (i) => {
    const deletVal = [...val];
    deletVal.splice(i, 1);
    setVal(deletVal);
  };

  const editor = useRef(null);
  const [content, setContent] = useState("");

  const [date, setDate] = useState();

  return (
    <section class="bg-slate-600 body-font relative">
      <SideBar />

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
              type="email"
              id="email"
              name="email"
              required
              class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              placeholder="enter your title"
            />
          </div>
          <div class="col-span-6">
            <label
              for="street-address"
              class="block text-sm font-medium text-gray-600"
            >
              Street address
            </label>

            <Maps/>

          </div>

          <div class="relative mb-4">
            <label for="place" class="block text-sm font-medium text-gray-600">
              Telephone
            </label>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              placeholder="enter your telephone number"
            />
          </div>

          <div class="relative mb-4">
            <label for="place" class="block text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              class="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              placeholder="youremail@gmail.com"
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
          <div class="relative mb-4 mt-8 border-white">
            <button class="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ListingsPageConstructionTraffic;
