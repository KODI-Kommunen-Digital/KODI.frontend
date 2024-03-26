import React, { useState, useEffect } from "react";
import "tailwindcss/tailwind.css";
import PropTypes from 'prop-types';

const AddTimeSlots = ({ handleTimeChange, handleAddTimeSlot, handleDeleteTimeSlot, openingDates, daysOfWeek }) => {

  const [timeSlots, setTimeSlots] = useState({});

  useEffect(() => {
    // Initialize time slots when the component mounts
    const initialTimeSlots = daysOfWeek.reduce((acc, day) => ({
      ...acc,
      [day]: [{ startTime: '', endTime: '' }] // Initialize with an empty time slot for each day
    }), {});
    setTimeSlots(initialTimeSlots);
  }, [daysOfWeek]);

  return (
    <div className="container mx-auto mt-8">
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-4">
          {timeSlots[day]?.map((timeSlot, index) => (
            <div
              key={index}
              className="flex flex-col space-y-4 space-x-2 sm:flex-row sm:space-y-0 sm:items-center mt-2"
            >
              <div
                className="flex space-x-2 items-center mt-0"
                style={{ width: "100px" }}
              >
                <h2 className="text-base font-medium mt-1 mr-3">{day}</h2>
              </div>
              <div className="flex space-x-2 mt-0 items-center">
                <input
                  type="text"
                  id="startTime"
                  name="startTime"
                  value={timeSlot.startTime}
                  onChange={(e) =>
                    handleTimeChange(day, index, "startTime", e.target.value)
                  }
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="HH:mm"
                />
                <span className="text-gray-500"> - </span>
                <input
                  type="text"
                  id="endTime"
                  name="endTime"
                  value={timeSlot.endTime}
                  onChange={(e) =>
                    handleTimeChange(day, index, "endTime", e.target.value)
                  }
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="HH:mm"
                />
              </div>
              <div className="flex justify-between md:space-x-2 items-center mt-0">
                <svg
                  onClick={() => handleAddTimeSlot(day)}
                  className="mt-1 md:mb-0 w-6 h-6 text-blue-800 cursor-pointer"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />{" "}
                  <line x1="12" y1="8" x2="12" y2="16" />{" "}
                  <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
                {index > 0 && (
                  <svg
                    onClick={() => handleDeleteTimeSlot(day, index)}
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 mt-1"
                    viewBox="0 0 512 512"
                  >
                    <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                  </svg>
                )}
              </div>
            </div>
          ))}
          <div className="my-4 bg-gray-200 h-[1px]"></div>
        </div>
      ))}
    </div>
  );
};

AddTimeSlots.propTypes = {
  handleDeleteTimeSlot: PropTypes.func.isRequired,
  handleAddTimeSlot: PropTypes.func.isRequired,
  handleTimeChange: PropTypes.func.isRequired,
  openingDates: PropTypes.func.isRequired,
  daysOfWeek: PropTypes.func.isRequired,
};



export default AddTimeSlots;
