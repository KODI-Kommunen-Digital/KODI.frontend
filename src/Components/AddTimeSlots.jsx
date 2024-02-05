import React, { useState } from "react";
import "tailwindcss/tailwind.css";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
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
          <h2 className="text-xl font-semibold mb-2">{day}</h2>
          {schedule[day]?.map((timeSlot, index) => (
            <div
              key={index}
              className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:items-center"
            >
              <div className="flex space-x-4 items-center">
                <input
                  type="text"
                  value={timeSlot.from || ""}
                  onChange={(e) =>
                    handleTimeChange(day, index, "from", e.target.value)
                  }
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="HH:mm"
                />
                <span className="text-gray-500">to</span>
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
              <div className="flex space-x-4 items-center mt-2">
                <button
                  onClick={() => handleAddTimeSlot(day)}
                  className="w-full sm:w-auto justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-slate-600 sm:ml-3 sm:text-sm"
                >
                  {t("add")}
                </button>
                {index > 0 && (
                  <button
                    onClick={() => handleDeleteTimeSlot(day, index)}
                    className="w-full sm:w-auto sm:mt-0 justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 sm:ml-3 sm:text-sm"
                  >
                    {t("delete")}
                  </button>
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
