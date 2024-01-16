// import React , { useState }from "react";
// import { useTranslation } from "react-i18next";

// const AddTimeSlots = () => {
//     const { t } = useTranslation();
//   const [timeSlots, setTimeSlots] = useState([]);

//   const handleInputTimeChange = (dayIndex, field, value) => {
//     const newTimeSlots = [...timeSlots];
//     newTimeSlots[dayIndex][field] = value;
//     setTimeSlots(newTimeSlots);
//   };

//   return (
//     <div className="flex flex-col md:flex-col gap-4">
//       {[
//         "Monday",
//         "Tuesday",
//         "Wednesday",
//         "Thursday",
//         "Friday",
//         "Saturday",
//         "Sunday",
//       ].map((day, dayIndex) => (
//         <div key={dayIndex} className="flex-1">
//           <label htmlFor={`${day}-${dayIndex}`}>{day}</label>
//           <div className="items-stretch py-2 grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="flex">
//               <input
//                 type="time"
//                 placeholder="From"
//                 value={timeSlots[dayIndex]?.from || ""}
//                 onChange={(e) =>
//                   handleInputTimeChange(dayIndex, "from", e.target.value)
//                 }
//                 className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
//               />
//             </div>

//             <div className="flex">
//               <input
//                 type="time"
//                 placeholder="To"
//                 value={timeSlots[dayIndex]?.to || ""}
//                 onChange={(e) =>
//                   handleInputTimeChange(dayIndex, "to", e.target.value)
//                 }
//                 className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
//               />
//             </div>

//             <div className="flex gap-4">
//               <button className="w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-slate-600 sm:ml-3 sm:w-auto sm:text-sm">
//                 {t("add")}
//               </button>
//               <button className="w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 sm:ml-3 sm:w-auto sm:text-sm">
//                 {t("delete")}
//               </button>
//             </div>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default AddTimeSlots;

import React, { useState } from "react";
import "tailwindcss/tailwind.css";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const AddTimeSlots = () => {
  const initialTimeSlot = { from: "09:00", to: "17:00" }; // Default time slot

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

  return (
    <div className="container mx-auto mt-8">
      {daysOfWeek.map((day) => (
        <div key={day} className="mb-4">
          <h2 className="text-xl font-semibold mb-2">{day}</h2>
          {schedule[day]?.map((timeSlot, index) => (
            <div key={index} className="flex space-x-4">
              <div>
                <input
                  type="text"
                  value={timeSlot.from || ""}
                  onChange={(e) => handleTimeChange(day, index, "from", e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="HH:mm"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={timeSlot.to || ""}
                  onChange={(e) => handleTimeChange(day, index, "to", e.target.value)}
                  className="mt-1 p-2 w-full border rounded-md focus:outline-none focus:border-blue-500"
                  placeholder="HH:mm"
                />
              </div>
            </div>
          ))}
          <button
            onClick={() => handleAddTimeSlot(day)}
            className="ml-4 p-2 bg-blue-500 text-white rounded-md"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
};

export default AddTimeSlots;


