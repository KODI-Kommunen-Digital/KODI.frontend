import React, { useEffect, useState } from 'react'
import SideBar from './SideBar';
import { FaSearch, FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

import { useNavigate } from 'react-router-dom';
import { getShelves } from '../Services/owner';

// eslint-disable-next-line camelcase
function Shelf_store() {
  const navigate = useNavigate();
  const [shelves, setShelves] = useState([]);
  const fetchAll = async () => {
    try {
      const response = await getShelves(1, 1);
      setShelves(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
   
    fetchAll();
  }, []);    
    
  return (
    <section className="bg-slate-600 body-font relative h-screen">
      <SideBar />
    <div className="container w-auto px-0 lg:px-5 py-2 bg-slate-600 min-h-screen flex flex-col">
      
    <div className="h-full">
      
      <div className="bg-white mt-0 p-5 overflow-x-auto">
      <h2
          className="text-gray-900 text-lg mb-4 font-medium title-font"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          Shelf Listings
          <div className="my-4 bg-gray-600 h-[1px]"></div>
        </h2>
      <div className="relative ">
        <button onClick={()=>navigate('/store1/shelfcreate')}
         className="flex items-center mb-5 bg-slate-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition float-right">
          <FaPlus className="mr-2" />
          Add Shelf
        </button>
        </div>
        <table className="w-full text-sm text-left lg:mt-[2rem] mt-[2rem] text-gray-500  p-6 space-y-10 rounded-lg">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 sm:px-6 py-3"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  width: "20%",
                }}
              >
                Title
              </th>
              <th
                scope="col"
                className="px-6 py-3 hidden lg:table-cell text-center"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
               Date
              </th>
              <th
                scope="col"
                className="px-6 sm:px-3 py-3 hidden lg:table-cell text-center"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Description
              </th>
              
              <th
                  scope="col"
                  className="px-6 py-3 text-center"
                  style={{ fontFamily: "Poppins, sans-serif" }}
                >
                  Product Id
                </th>
              <th
                scope="col"
                className="px-6 py-3 text-center"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                action
              </th>
              
               
            
           
            </tr>
          </thead>
          <tbody>
  {shelves.map((listing, index) => {
    return (
      <tr
        key={index}
        className="bg-white border-b hover:bg-gray-50"
      >
        <th
          scope="row"
          className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap cursor-pointer"
        >
          {/* <img
            className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
            src={
              listing.sourceId === 1
                ? listing.logo
                  ? process.env.REACT_APP_BUCKET_HOST + listing.logo
                  : LISTINGSIMAGE
                : listing.logo || LISTINGSIMAGE
            }
            alt="avatar"
          /> */}
          <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
            <div
              className="font-normal text-gray-500 truncate"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              {listing.title}
            </div>
          </div>
        </th>
        <td
          className="px-6 py-4 hidden lg:table-cell text-center"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {new Date(listing.createdAt).toLocaleString("de")}
        </td>
        <td
          className="px-6 py-4 hidden lg:table-cell text-center"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {listing.description}
        </td>
        <td
          className="px-6 py-4 hidden lg:table-cell text-center"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
          {listing.product ? listing.product.title : null}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center justify-center">
            <FaSearch color='black' />&nbsp;&nbsp;&nbsp;
            <FaEdit color='black'/>&nbsp;&nbsp;&nbsp;
            <FaTrash color='black'/>
          </div>
        </td>
      </tr>
    );
  })}
</tbody>

        </table>
      </div>
     
    </div>
  </div>
</section>
  )
}

// eslint-disable-next-line camelcase
export default Shelf_store