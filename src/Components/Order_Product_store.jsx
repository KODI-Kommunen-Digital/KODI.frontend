import React, { useEffect, useState } from 'react';
import SideBar from './SideBar';
import { IoArrowBack } from "react-icons/io5";
import { useLocation, useNavigate } from 'react-router-dom';
import { getOrderById } from '../Services/owner';

// eslint-disable-next-line camelcase
function Order_Product_store() {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState([]);
  const [orderData, setOrderData] = useState({});

  const { orderId } = location.state || { orderId: null };

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await getOrderById(1, 1, orderId);
      setOrder(response.data.data.products);
      setOrderData(response.data.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
    }
  };

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
              Order Details
              <div className="my-4 bg-gray-600 h-[1px]"></div>
            </h2>

            <div className="relative">
              <button
                onClick={() => navigate('/store1/order')}
                className="flex items-center mb-5 bg-slate-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition float-right"
              >
                <IoArrowBack className="mr-2" /> Back
              </button>
              <div className="mb-5">
                <h2 className="text-2xl font-bold mb-2">Order Id: {orderId}</h2>
              </div>
            </div>

            <table className="w-full text-sm text-left lg:mt-[2rem] mt-[2rem] text-gray-500 p-6 space-y-10 rounded-lg">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 sm:px-3 py-3 hidden lg:table-cell text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Product
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 hidden lg:table-cell text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Unit Price
                  </th>
                  <th
                    scope="col"
                    className="px-6 sm:px-3 py-3 hidden lg:table-cell text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {order ? (
                  order.map((listing, index) => (
                    <tr key={index} className="bg-white border-b hover:bg-gray-50">
                      <td
                        className="px-6 py-4 hidden lg:table-cell text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {listing.product.title}
                      </td>
                      <td
                        className="px-6 py-4 hidden lg:table-cell text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {listing.quantity}
                      </td>
                      <td
                        className="px-6 py-4 hidden lg:table-cell text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {listing.pricePerQuantity}
                      </td>
                      <td
                        className="px-6 py-4 hidden lg:table-cell text-center"
                        style={{ fontFamily: 'Poppins, sans-serif' }}
                      >
                        {(listing.quantity * listing.pricePerQuantity).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No order details available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="relative p-6">
              <div className="mb-5 float-right">
                <h2 className="text-xl font-bold">Total Amount: €{orderData.amount}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// eslint-disable-next-line camelcase
export default Order_Product_store;
