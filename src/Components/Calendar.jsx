import React, { useState } from "react";

const AvailabilityInput = () => {
  const initialAvailability = {
    Monday: [{ start: "", end: "" }],
    Tuesday: [{ start: "", end: "" }],
    Wednesday: [{ start: "", end: "" }],
    Thursday: [{ start: "", end: "" }],
    Friday: [{ start: "", end: "" }],
    Saturday: [{ start: "", end: "" }],
    Sunday: [{ start: "", end: "" }],
  };

  const [availability, setAvailability] = useState(initialAvailability);

  const handleTimeChange = (day, index, field, time) => {
    setAvailability((prevAvailability) => {
      const updatedAvailability = { ...prevAvailability };
      updatedAvailability[day][index] = {
        ...updatedAvailability[day][index],
        [field]: time,
      };
      return updatedAvailability;
    });
  };

  const handleAddTimeRange = (day) => {
    setAvailability((prevAvailability) => {
      const updatedAvailability = { ...prevAvailability };
      updatedAvailability[day] = [
        ...prevAvailability[day],
        { start: "", end: "" },
      ];
      return updatedAvailability;
    });
  };

  const handleDeleteTimeRange = (day, index) => {
    setAvailability((prevAvailability) => {
      const updatedAvailability = { ...prevAvailability };
      updatedAvailability[day] = prevAvailability[day].filter(
        (_, i) => i !== index
      );
      return updatedAvailability;
    });
  };

  return (
    <div className="space-y-4">
      {Object.keys(availability).map((day) => (
        <div key={day} className="space-y-2">
          <label className="w-24 mr-4 font-bold">{day}</label>
          {availability[day].map((timeRange, index) => (
            <div key={index} className="flex space-x-4 items-center">
              <input
                type="time"
                value={timeRange.start}
                onChange={(e) =>
                  handleTimeChange(day, index, "start", e.target.value)
                }
                className="border p-2 rounded-md"
              />
              <span className="font-bold">to</span>
              <input
                type="time"
                value={timeRange.end}
                onChange={(e) =>
                  handleTimeChange(day, index, "end", e.target.value)
                }
                className="border p-2 rounded-md"
              />

              {index === availability[day].length - 1 && (
                <>
                  <button
                    className="text-red-600 hover:text-red-800 ml-2"
                    onClick={() => handleDeleteTimeRange(day, index)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 512 512"
                    >
                      <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          ))}
          {/* Add button for each day */}
          <button
            className="bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded ml-0"
            onClick={() => handleAddTimeRange(day)}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

const Calendar = () => {
  return (
    <div>
      <h2
        style={{
          fontFamily: "Poppins, sans-serif",
        }}
        className="text-gray-900 text-lg mb-4 font-medium title-font"
      >
        Your Availability Time
      </h2>
      <AvailabilityInput />
    </div>
  );
};

export default Calendar;
