import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import { FaEye } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProducts } from '../Services/owner';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line camelcase
function Product_store() {
  const { t } = useTranslation();

  const location = useLocation();
  const navigate = useNavigate();
  const { activeTab: initialActiveTab } = location.state || { activeTab: 'active' };
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [pageNo, setPageNo] = useState(1);
  const [products, setProducts] = useState([]);
  // const [productRequests, setProductRequests] = useState([]);


  const fetchProducts = async (pageNo) => {
    try {
      const response = await getProducts(1, 1, pageNo);
      setProducts(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  // const fetchProductRequest = async (status,pageNo) => {
  //   try {
  //     const response = await getProductRequest(status,pageNo);
  //     setProductRequests(response.data.data);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  useEffect(() => {
    fetchProducts(pageNo);
  }, [pageNo]);

  const handlePageChange = (newPage) => {
    setPageNo(newPage);
  };

  const handleViewDetailsClick = (tab, id) => {
    navigate('/store1/product/product_detail', { state: { activeTab: tab, productId: id } });
  };

  console.log(products);
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
                    {t("category")}
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
              {activeTab === 'active' && (
                <tbody>
                  {products.map((listing, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <th
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap cursor-pointer"
                      >
                        <img
                          className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                          src={listing.productImages[0] ? listing.productImages[0] : " "}
                          alt=""
                        />
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
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {listing.categoryId}
                      </td>
                      <td
                        className="px-6 py-4 hidden lg:table-cell text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {new Date(listing.createdAt).toLocaleString('de')}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div
                            className="relative group inline-block"
                            onClick={() => handleViewDetailsClick('active', listing.id)}
                          >
                            <FaEye className="text-2xl text-gray-900 cursor-pointer" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              View Details
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}

              {activeTab === 'pending' && (
                <tbody>
                  {products.map((listing, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <th
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap cursor-pointer"
                      >
                        <img
                          className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                          alt=""
                        />
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
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {listing.title}
                      </td>
                      <td
                        className="px-6 py-4 hidden lg:table-cell text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {new Date(listing.createdAt).toLocaleString('de')}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div
                            className="relative group inline-block"
                            onClick={() => handleViewDetailsClick('pending', listing.id)}
                          >
                            <FaEye className="text-2xl text-gray-900 cursor-pointer" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              View Details
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}

              {activeTab === 'rejected' && (
                <tbody>
                  {products.map((listing, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <th
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap cursor-pointer"
                      >
                        <img
                          className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                          src={listing.productImages[0] ? listing.productImages[0] : " "}
                          alt=""
                        />
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
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {listing.title}
                      </td>
                      <td
                        className="px-6 py-4 hidden lg:table-cell text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {new Date(listing.createdAt).toLocaleString('de')}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div
                            className="relative group inline-block"
                            onClick={() => handleViewDetailsClick('rejected', listing.id)}
                          >
                            <FaEye className="text-2xl text-gray-900 cursor-pointer" />
                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-black text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              View Details
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              )}
            </table>
          </div>
          <div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
         
            {pageNo !== 1 ? (
              <span
                className="inline-block px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                onClick={() => handlePageChange(pageNo - 1)}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {"<"}
              </span>
            ) : (
              <span />
            )}
            <span
              className="inline-block px-2 pb-2 pt-2 text-sm font-bold uppercase leading-normal text-neutral-50"
              style={{ fontFamily: "Poppins, sans-serif" }}
            >
              page {pageNo}
            </span>
            {products.length >= 9 && (
              <span
                className="inline-block px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
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
export default Product_store;
