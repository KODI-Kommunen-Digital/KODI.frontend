import React, { useEffect, useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import SideBar from './SideBar';
import { getSellers ,deleteSeller} from '../Services/owner';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line camelcase
function Seller_store() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState('active');
  const [sellers, setSellers] = useState([]);
  const [pageNo, setPageNo] = useState(1);

  const fetchAll = async (status,pageNo) => {
    try {
      const response = await getSellers(status,pageNo);
      setSellers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const deleteSellerRow = async (id) => {
    try {
      const response = await deleteSeller(id);
      setSellers(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  const handlePageChange = (newPage) => {
    setPageNo(newPage);
  };
  useEffect(() => {
    let status;
    if (activeTab === 'active') status = 1;
    else if (activeTab === 'pending') status = 0;
    else if (activeTab === 'rejected') status = 2;

    fetchAll(status,pageNo);
  }, [activeTab,pageNo]);
  
  const handleViewDetailsClick = (id) => {
    deleteSellerRow(id)
    
  };
  return (
    <section className="bg-slate-600 body-font relative h-screen">
      <SideBar />
      <div className="container px-0 sm:px-0 py-0 pb-2 w-full fixed top-0 z-10 lg:px-5 lg:w-auto relative">
        <div className="relative bg-black mr-0 ml-0 px-10 lg:rounded-lg h-16">
          <div className="w-full">
            <div className="w-full h-full flex items-center lg:py-2 py-5 justify-end xl:justify-center lg:justify-center border-gray-100 md:space-x-10">
              <div className="hidden lg:block">
                <div className="w-full h-full flex items-center justify-end xl:justify-center lg:justify-center md:justify-end sm:justify-end border-gray-100 md:space-x-10">
                  {/* <div
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
                    onClick={() => setSelectedStatus(null)}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("allListings")}
                  </div> */}
                  <div
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
                    onClick={() => setActiveTab('active')}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("active")}
                  </div>
                  <div
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
                    onClick={() => setActiveTab('pending')}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("pending")}
                  </div>
                  <div
                    className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md p-4 text-sm font-bold cursor-pointer"
                    onClick={() => setActiveTab('rejected')}
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("inactive")}
                  </div>
                </div>
              </div>

              <div className="-my-2 -mr-2 lg:hidden">
              <select
                className="text-gray-300 rounded-md p-4 text-sm font-bold cursor-pointer bg-transparent border-none focus:outline-none"
                onChange={(e) => setActiveTab(e.target.value)}
                value={activeTab}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                <option value="active">{t("active")}</option>
                <option value="pending">{t("pending")}</option>
                <option value="inactive">{t("inactive")}</option>
              </select>
              </div>
            </div>
          </div>
        </div>
      </div>
     

      <div className="container w-auto px-0 lg:px-5 py-2 bg-slate-600 min-h-screen flex flex-col">
        <div className="h-full">
          <div className="bg-white mt-0 p-0 space-y-10 overflow-x-auto">
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
                    {t("listings")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 sm:px-3 py-3 hidden lg:table-cell text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("description")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 hidden lg:table-cell text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("date_of_creation")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("action")}
                  </th>
                  
                 
                </tr>
              </thead>
              <tbody>
                {sellers.map((listing, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <th
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap cursor-pointer"
                      >
                        
                        <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
                          <div
                            className="font-normal text-gray-500 truncate"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {listing.title}
                          </div>
                        </div>
                      </th>
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
                      {new Date(listing.createdAt).toLocaleString("de")}
                    </td>
                   
                    <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div
                            className="relative group inline-block"
                            onClick={() => handleViewDetailsClick( listing.id)}
                          >
                            <FaTrash color="black"  className="text-xl text-gray-900 cursor-pointer" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              Delete
                            </div>
                          </div>
                        </div>
                      </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
         
          {pageNo !== 1 ? (
          <span
            className="inline-block  px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
            onClick={() => handlePageChange(pageNo - 1)}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {"<"}
          </span>
        ) : (
          <span />
        )}
        <span
          className="inline-block  px-2 pb-2 pt-2 text-sm font-bold uppercase leading-normal text-neutral-50"
          style={{ fontFamily: "Poppins, sans-serif" }}
        >
        page {pageNo}
        </span>
        {sellers.length >= 9 && (
          <span
            className="inline-block  px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
            onClick={() => handlePageChange(pageNo + 1)}
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            {">"}
          </span>
        )}
          
          </div>
        </div>
      </div>
    </section>
  );
}

// eslint-disable-next-line camelcase
export default Seller_store;
