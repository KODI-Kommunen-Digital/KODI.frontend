import React from 'react';
import STYLEIMAGE from "../assets/styleimage.png";

const uploadContribution = () => {
  return (
    <div className="bg-blue-400 mx-auto py-10 px-4 flex justify-center lg:h-[28rem] sm:h-[35rem]">
        <div className="flex flex-wrap items-center">

            <div className="w-full md:w-1/2 px-4">
            <h2 className="text-5xl text-white font-bold mb-4">Upload the first post here</h2>
            <p className="mb-4 text-gray-900 text-lg font-bold">Whether event, offers or news. Here you can easily upload a contribution</p>
            <div class="flex">
                <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-blue-800 px-8 py-2 text-lg font-semibold text-white shadow-sm hover:bg-cyan-500">upload post</button>
            </div>
            </div>

            <div className="w-full md:w-1/2 flex flex-wrap lg:mt-0 md:mt-6 mt-6">
              <img src={STYLEIMAGE} alt="Image 1" className="w-full md:w-98 mb-2" />
            </div>


        </div>
    </div>

  );
}

export default uploadContribution;



{/* <div class="flex justify-center">
            <button class="inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-sm hover:bg-cyan-500">upload post</button>
          </div> */}