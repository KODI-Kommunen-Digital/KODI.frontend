import React , { useState }from "react";
import { useTranslation } from "react-i18next";

const AddTimeSlots = () => {
    const { t } = useTranslation();
  const [timeSlots, setTimeSlots] = useState([]);

  const handleInputTimeChange = (dayIndex, field, value) => {
    const newTimeSlots = [...timeSlots];
    newTimeSlots[dayIndex][field] = value;
    setTimeSlots(newTimeSlots);
  };

  return (
    <div className="flex flex-col md:flex-col gap-4">
      {[
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ].map((day, dayIndex) => (
        <div key={dayIndex} className="flex-1">
          <label htmlFor={`${day}-${dayIndex}`}>{day}</label>
          <div className="items-stretch py-2 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex">
              <input
                type="time"
                placeholder="From"
                value={timeSlots[dayIndex]?.from || ""}
                onChange={(e) =>
                  handleInputTimeChange(dayIndex, "from", e.target.value)
                }
                className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div className="flex">
              <input
                type="time"
                placeholder="To"
                value={timeSlots[dayIndex]?.to || ""}
                onChange={(e) =>
                  handleInputTimeChange(dayIndex, "to", e.target.value)
                }
                className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
            </div>

            <div className="flex gap-4">
              <button className="w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-slate-600 sm:ml-3 sm:w-auto sm:text-sm">
                {t("add")}
              </button>
              <button className="w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 sm:ml-3 sm:w-auto sm:text-sm">
                {t("delete")}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddTimeSlots;
