import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import AddTimeSlots from "../Components/AddTimeSlots";
import PropTypes from 'prop-types';

const ServiceAndTime = ({ validateInput, onDurationUnitChange, onServiceChange, services, handleAddService, handleDeleteService, isChecked, isCheckedList, handleCheckboxChange, handleTimeChange, handleAddTimeSlot, handleDeleteTimeSlot, openingDates, daysOfWeek }) => {

  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const handleTextClick = () => {
    if (!isChecked.some((checked) => checked)) {
      setShowModal(true);
    }
  };

  const handleDoneButtonClick = () => {
    setShowModal(false);
  };

  return (
    <div className="flex flex-col justify-center">
      <button
        className="w-full bg-black mb-4 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
        onClick={() => setShowModal(true)}
      >
        {t("addtimeslot")}
      </button>

      <label
        htmlFor="address"
        className="block text-sm mt-4 font-medium text-gray-600"
      >
        {t("addService")} *
      </label>
      {services.map((service, index) => (
        <>
          <div
            key={index}
            className="items-stretch py-2 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="flex-1">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Service Name"
                value={service.name}
                onChange={(e) => onServiceChange(index, 'name', e.target.value)}
                onBlur={(e) => validateInput(index, e)}
                className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div className="flex">
              <input
                type="text"
                id="duration"
                name="duration"
                placeholder="Duration"
                value={service.duration}
                onChange={(e) => onServiceChange(index, 'duration', e.target.value)}
                onBlur={(e) => validateInput(index, e)}
                className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
              <select
                id="states"
                name="durationUnit"
                value={service.durationUnit}
                className="shadow-md bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                onChange={(e) => onDurationUnitChange(index, e.target.value)}
              >
                <option value="minutes">min</option>
                <option value="seconds">sec</option>
              </select>
            </div>

            <button
              className={`w-full hidden md:inline-block bg-blue-800 mt-4 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md ${isChecked ? "disabled:opacity-60" : ""
                }`}
              onClick={() => setShowModal(true)}
              disabled={isChecked[index]}
            >
              {t("addtimeslot")}
            </button>

            <div className="flex justify-between md:hidden sm:inline-block">
              <p
                className={`font-bold text-blue-600 hover:underline cursor-pointer text-center${isChecked[index] ? " text-green-600" : "text-blue-600"
                  }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
                onClick={handleTextClick}
              >
                {isChecked[index]
                  ? t("timeSlotsSetFromPrevious")
                  : t("addtimeslot")}
              </p>
              {index > 0 && (
                <p
                  className="font-bold hover:underline cursor-pointer text-center"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "red",
                  }}
                  onClick={() => handleDeleteService(index)}
                >
                  {t("delete")}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDeleteService(index)}
              className="w-full hidden md:inline-block bg-red-700 mt-4 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md"
            >
              {t("delete")}
            </button>
            {showModal && (
              <div className="fixed z-50 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
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
                      <AddTimeSlots handleDeleteTimeSlot={handleDeleteTimeSlot} handleAddTimeSlot={handleAddTimeSlot} handleTimeChange={handleTimeChange} daysOfWeek={daysOfWeek} openingDates={openingDates} />

                      <button
                        onClick={handleDoneButtonClick}
                        className="w-full bg-black hover:bg-slate-600  text-white py-2 px-4 mt-4 rounded-md"
                      >
                        {t("done")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <input
              type="checkbox"
              checked={isCheckedList[index]}
              onChange={() => handleCheckboxChange(index)}
            />
            <label
              htmlFor="disableDates"
              className="block text-sm font-medium text-gray-600"
            >
              {t("useProvidedTimeSlots")}
            </label>
          </div>
        </>
      ))}

      <button
        onClick={handleAddService}
        className="w-full bg-black mt-4 bg-black mt-4 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
      >
        {t("addAnotherService")}
      </button>
    </div>
  );
};

ServiceAndTime.propTypes = {
  validateInput: PropTypes.func.isRequired,
  onDurationUnitChange: PropTypes.func.isRequired,
  onServiceChange: PropTypes.func.isRequired,
  services: PropTypes.func.isRequired,
  handleAddService: PropTypes.func.isRequired,
  handleDeleteService: PropTypes.func.isRequired,
  handleDeleteTimeSlot: PropTypes.func.isRequired,
  handleCheckboxChange: PropTypes.func.isRequired,
  handleAddTimeSlot: PropTypes.func.isRequired,
  handleTimeChange: PropTypes.func.isRequired,
  openingDates: PropTypes.func.isRequired,
  daysOfWeek: PropTypes.func.isRequired,
  isChecked: PropTypes.func.isRequired,
  isCheckedList: PropTypes.func.isRequired,
};

export default ServiceAndTime;
