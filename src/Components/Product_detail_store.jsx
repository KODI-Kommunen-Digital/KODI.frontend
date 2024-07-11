import React, { useState, useEffect } from 'react';
import SideBar from './SideBar';
import { IoArrowBack } from 'react-icons/io5';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProductById } from '../Services/owner';

// eslint-disable-next-line camelcase
function Product_detail_store() {
  const navigate = useNavigate();
  const location = useLocation();
  const [product, setProduct] = useState(null);
  const { activeTab, productId } = location.state || { activeTab: null, productId: null };

  const fetchProductDetails = async (productId) => {
    try {
      const response = await getProductById(1, 1, productId);
      setProduct(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProductDetails(productId);
    }
  }, [productId]);

  // Logging the activeTab and product to debug
  console.log(activeTab);
  console.log(product);

  if (!product) {
    return <div>Loading...</div>;
  }

  const {
    id = '',
    title = '',
    sellerId = '',
    price = '',
    description = '',
    categoryId = '',
    maxCount = '',
    minCount = '',
    inventory = '',
    productImages = []
  } = product;

  return (
    <section className="base-bg-slate-600 body-font relative">
      <SideBar />
      <div className="container w-auto px-5 py-2 base-bg-slate-600">
        <div className="bg-white mt-4 p-6 space-y-10">
          <h2
            className="text-gray-900 text-lg mb-4 font-medium title-font"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Product Detail
            <div className="my-4 bg-gray-600 h-[1px]"></div>
          </h2>
          <div className="relative">
            <button
              onClick={() => navigate('/store1/product', { state: { activeTab } })}
              className="flex items-center mb-5 bg-slate-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition float-right"
            >
              <IoArrowBack className="mr-2" /> Back
            </button>
            <div className="mb-5">
              <h2 className="text-2xl font-bold mb-2">
                Product Id: {id}
              </h2>
            </div>
          </div>
          <div className="py-3 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="mt-1 px-2">
              <img src={productImages[0] ? productImages[0] : null} className='w-30 h-40' alt="Product" />
            </div>
            <div className="mt-1 px-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-600"
              >
                Product title
              </label>
              <input
                type="text"
                name="username"
                id="username"
                className="w-full bg-gray-200 rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
                disabled={true}
                value={title}
              />
            </div>
            <div className="mt-1 px-2">
              <label
                htmlFor="seller"
                className="block text-sm font-medium text-gray-600"
              >
                Seller
              </label>
              <input
                type="text"
                name="seller"
                id="seller"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
                value={sellerId}
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              />
              <div className="h-[24px] text-red-600"></div>
            </div>
            <div className="mt-1 px-2">
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-600"
              >
                Price
              </label>
              <input
                type="text"
                name="price"
                id="price"
                required
                value={price}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
              <div className="h-[24px] text-red-600"></div>
            </div>
            <div className="mt-1 px-2">
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-600"
              >
                Description
              </label>
              <textarea
                name="description"
                id="description"
                value={description}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              />
            </div>
            <div className="mt-1 px-2">
              <label
                htmlFor="category"
                className="block text-sm font-medium text-gray-600"
              >
                Category
              </label>
              <input
                type="text"
                name="category"
                id="category"
                value={categoryId}
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              />
              <div className="h-[24px] text-red-600"></div>
            </div>
            <div className="mt-1 px-2">
              <label
                htmlFor="inventory"
                className="block text-sm font-medium text-gray-600"
              >
                Inventory
              </label>
              <input
                type="text"
                name="inventory"
                id="inventory"
                value={inventory}
                required
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
              <div className="h-[24px] text-red-600"></div>
            </div>
            <div className="mt-1 px-2">
              <label
                htmlFor="mincount"
                className="block text-sm font-medium text-gray-600"
              >
                Mincount
              </label>
              <input
                type="text"
                value={minCount}
                name="mincount"
                id="mincount"
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                required
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              />
              <div className="h-[24px] text-red-600"></div>
            </div>
            <div className="mt-1 px-2">
              <label
                htmlFor="maxcount"
                className="block text-sm font-medium text-gray-600"
              >
                Maxcount
              </label>
              <input
                type="text"
                name="maxcount"
                value={maxCount}
                id="maxcount"
                required
                className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
              <div className="h-[24px] text-red-600"></div>
            </div>
          </div>
        </div>
      </div>
      {activeTab === 'pending' && (
        <div className="container w-auto px-5 py-2 bg-slate-600">
          <div className="bg-white mt-4 p-6">
            <div className="py-2 mt-1 px-2">
              <button
                type="button"
                className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

// eslint-disable-next-line camelcase
export default Product_detail_store;
