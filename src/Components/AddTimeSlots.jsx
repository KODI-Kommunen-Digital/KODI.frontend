import React, { useState } from "react";
import "tailwindcss/tailwind.css";
// import { useTranslation } from "react-i18next";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const AddTimeSlots = () => {
  // const { t } = useTranslation();
  const initialTimeSlot = { from: "From", to: "To" }; // Default time slot

  const [schedule, setSchedule] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [initialTimeSlot] }), {})
  );

  const handleTimeChange = (day, index, type, value) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: (prevSchedule[day] || []).map((slot, i) =>
        i === index ? { ...slot, [type]: value } : slot
      ),
    }));
  };

  const handleAddTimeSlot = (day) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: [...(prevSchedule[day] || []), { from: "", to: "" }],
    }));
  };

  const handleDeleteTimeSlot = (day, index) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      [day]: (prevSchedule[day] || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container mx-auto mt-8">
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-4">
          {/* <h2 className="text-xl font-semibold mb-2">{day}</h2> */}
          {schedule[day]?.map((timeSlot, index) => (
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
                  value={timeSlot.from || ""}
                  onChange={(e) =>
                    handleTimeChange(day, index, "from", e.target.value)
                  }
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="HH:mm"
                />
                <span className="text-gray-500"> - </span>
                <input
                  type="text"
                  value={timeSlot.to || ""}
                  onChange={(e) =>
                    handleTimeChange(day, index, "to", e.target.value)
                  }
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="HH:mm"
                />
              </div>
              <div className="flex space-x-2 items-center mt-0">
                {/* <button
                  onClick={() => handleAddTimeSlot(day)}
                  className="w-full mt-1 sm:w-auto justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-800 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:text-sm"
                >
                  {t("add")}
                </button> */}
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
                  // <button
                  //   onClick={() => handleDeleteTimeSlot(day, index)}
                  //   className="w-full mt-1 sm:w-auto justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 sm:ml-3 sm:text-sm"
                  // >
                  //   {t("delete")}
                  // </button>
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
        </div>
      ))}
    </div>
  );
};

export default AddTimeSlots;
