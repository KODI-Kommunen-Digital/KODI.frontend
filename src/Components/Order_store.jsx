import React, { useState,useEffect} from 'react';

import SideBar from './SideBar';
import {FaEye } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import {getOrders} from '../Services/owner';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line camelcase
function Order_store() {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const [pageNo, setPageNo] = useState(1);
  const [orders, setOrders] = useState([]);

  const fetchOrders = async (pageNo) => {
    try {
      const response = await getOrders(1, 1, pageNo);
      setOrders(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };
  

  useEffect(() => {
    fetchOrders(pageNo);
  }, [pageNo]);

      const handleViewDetailsClick = (id) => {
        console.log(id)
        navigate('/store1/order/product',{ state: { orderId: id } });
      };
      const handlePageChange = (newPage) => {
        setPageNo(newPage);
      };
  return (
    <section className="bg-slate-600 body-font relative h-screen">
      <SideBar />

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
                    {t("customer")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 sm:px-3 py-3 hidden lg:table-cell text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("totalamount")}
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
                    className="px-6 sm:px-3 py-3 hidden lg:table-cell text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("paymentid")}
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
                  {orders.map((listing, index) => (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <th
                        scope="row"
                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap cursor-pointer"
                      >
                       
                        <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
                          <div
                            className="font-normal text-gray-500 truncate"
                            style={{ fontFamily: 'Poppins, sans-serif' }}
                          >
                            {listing.id}
                          </div>
                        </div>
                      </th>

                      <td
                        className="px-6 py-4 hidden lg:table-cell text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {listing.user.username}
                      </td>
                      <td
                        className="px-6 py-4 hidden lg:table-cell text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {listing.amount?listing.amount:0}
                        {/* {(listing.amount ?? 0).toFixed(2)} */}
                      </td>
                      <td
                        className="px-6 py-4 hidden lg:table-cell text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {new Date(listing.createdAt).toLocaleString('de')}
                      </td>
                      <td
                        className="px-6 py-4 hidden lg:table-cell text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {listing.paymentId}
                      </td>
  
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center">
                          <div
                            className="relative group inline-block"
                            onClick={() => handleViewDetailsClick( listing.id)}
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
            {orders.length >= 9 && (
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
  )
}

// eslint-disable-next-line camelcase
export default Order_store