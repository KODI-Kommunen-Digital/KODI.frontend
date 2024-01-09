import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AddTimeSlots from "../Components/AddTimeSlots";

const ServiceAndTime = () => {
  const { t } = useTranslation();
  const [services, setServices] = useState([{ name: "", duration: "" }]);
  const [showModal, setShowModal] = useState(false);

  const handleInputChange = (index, key, value) => {
    const updatedServices = [...services];
    updatedServices[index][key] = value;
    setServices(updatedServices);
  };

  const handleAddService = () => {
    setServices([...services, { name: "", duration: "" }]);
  };

  const handleDeleteService = (index) => {
    const updatedServices = [...services];
    updatedServices.splice(index, 1);
    setServices(updatedServices);
  };

  const handleDoneButtonClick = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col justify-center">
      <label
        htmlFor="address"
        className="block text-sm font-medium text-gray-600"
      >
        Add service *
      </label>
      {services.map((service, index) => (
        <div
          key={index}
          className="items-stretch py-2 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="flex-1">
            <input
              type="text"
              placeholder="Service Name"
              value={service.name}
              onChange={(e) => handleInputChange(index, "name", e.target.value)}
              className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <div className="flex">
            <input
              type="text"
              placeholder="Duration"
              value={service.duration}
              onChange={(e) =>
                handleInputChange(index, "duration", e.target.value)
              }
              className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
            <select
              id="states"
              className="shadow-md bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            >
              <option value="hours">hrs</option>
              <option value="minutes">min</option>
              <option value="seconds">sec</option>
            </select>
          </div>

          <button
            className="w-full hidden md:inline-block bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded-md disabled:opacity-60"
            onClick={() => setShowModal(true)}
          >
            {t("addtimeslot")}
          </button>

          <div className="flex justify-between md:hidden sm:inline-block">
            <button
              className="md:hidden sm:inline-block "
              onClick={() => setShowModal(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 512 512"
              >
                <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
              </svg>
            </button>

            <button
              onClick={() => handleDeleteService(index)}
              className="md:hidden sm:inline-block "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 512 512"
              >
                <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
              </svg>
            </button>
          </div>

          <button
            onClick={() => handleDeleteService(index)}
            className="w-full hidden md:inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            {t("delete")}
          </button>

          {showModal && (
            <div className="fixed z-50 inset-0 overflow-y-auto">
              <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                {/* Background overlay */}
                <div
                  className="fixed inset-0 transition-opacity"
                  aria-hidden="true"
                >
                  <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                </div>

                {/* Modal panel */}
                <span
                  className="hidden sm:inline-block sm:align-middle sm:h-screen"
                  aria-hidden="true"
                >
                  &#8203;
                </span>
                <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden p-6 mx-4 my-8 shadow-xl transform transition-all sm:align-middle sm:max-w-2xl sm:w-full">
                  <div className="bg-white p-4">
                    <button
                      onClick={() => setShowModal(false)}
                      className="absolute top-0 right-0 p-4 text-xl cursor-pointer"
                    >
                      &times;
                    </button>
                    <AddTimeSlots />

                    <button
                      onClick={handleDoneButtonClick}
                      className="w-full bg-black hover:bg-slate-600 text-white py-2 px-4 mt-4 rounded-md"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={handleAddService}
        className="w-full bg-black mt-4 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
      >
        Add Service
      </button>
    </div>
  );
};

export default ServiceAndTime;
