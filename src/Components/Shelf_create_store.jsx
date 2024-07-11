import React, { useState } from 'react'
import SideBar from './SideBar'
import { createShelf, getShelfById } from '../Services/owner';

// eslint-disable-next-line camelcase
function Shelf_create_store() {
  const [store, setStore] = useState(null); // Initialize store as null until data is fetched
  const [formData, setFormData] = useState({
    title: '',
    product: '',
    shopid: '',
    description: '',
  });
  const [isFormChanged, setIsFormChanged] = useState(false);
   // Track if form data has changed
  console.log(store)
  const fetchShelfData = async () => {
    try {
      const response = await getShelfById(1, 1); // Replace 1, 1 with actual parameters for getStoreById
      const storeData = response.data.data; // Assuming response.data.data contains store details
      setStore(storeData);
      setFormData({
        title: storeData.title,
        product: storeData.product,
        shopid: storeData.shopid,
        description: storeData.description,
      });
    } catch (error) {
      console.error('Error fetching store data:', error);
    }
  };
 

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
    setIsFormChanged(true);
  };

  const handleSaveChanges = async () => {
    try {
      const response = await createShelf(1, 1, formData);
      fetchShelfData();
      console.log(response.data.data); // Assuming response.data.data contains updated store details
      setIsFormChanged(false);
    } catch (error) {
      console.error('Error updating store data:', error);
    }
  };
  return (
    <section className="base-bg-slate-600 body-font relative">
      <SideBar />
      <div className="container w-auto px-5 py-2 base-bg-slate-600">
        <div className="bg-white mt-4 p-6 space-y-10">
          <h2 className="text-gray-900 text-lg mb-4 font-medium title-font" style={{ fontFamily: "Poppins, sans-serif" }}>
            Shelf details
            <div className="my-4 bg-gray-600 h-[1px]"></div>
          </h2>
          <div className="py-3 grid grid-cols-1">
            <div className="mt-1 px-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-600">
                Title
              </label>
              <input
                type="text"
                id="name"
                className="w-full bg-gray-200 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                value={formData.title}
                onChange={handleInputChange}
                
              />
            </div>
          </div>
          <div className="py-2 grid grid-cols-1 md:grid-cols-2">
            <div className="mt-1 px-2">
              <label htmlFor="latitude" className="block text-sm font-medium text-gray-600">
                Product
              </label>
              <input
                type="text"
                id="latitude"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                value={formData.product}
                onChange={handleInputChange}
                
              />
            </div>
            <div className="mt-1 px-2">
              <label htmlFor="longitude" className="block text-sm font-medium text-gray-600">
                Shopid
              </label>
              <input
                type="text"
                id="longitude"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                value={formData.shopid}
                onChange={handleInputChange}
                
              />
            </div>
          </div>
          
          <div className="py-3 grid grid-cols-1">
            <div className="mt-1 px-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-600">
                Description
              </label>
              <textarea
                id="description"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                value={formData.description}
                onChange={handleInputChange}
               
              />
            </div>
          </div>
        </div>
      </div>
      <div className="container w-auto px-5 py-2 bg-slate-600">
        <div className="bg-white mt-4 p-6">
          <div className="py-2 mt-1 px-2">
            <button
              type="button"
              className={`w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded ${
                !isFormChanged ? 'disabled:opacity-60 cursor-not-allowed' : ''
              }`}
              onClick={handleSaveChanges}
              disabled={!isFormChanged}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// eslint-disable-next-line camelcase
export default Shelf_create_store