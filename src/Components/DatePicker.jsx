// import dayjs from "dayjs";
// import React, { useState } from "react";
// import { generateDate, months } from "./util/calendar";
// import cn from "./util/cn";
// import { GrFormNext, GrFormPrevious } from "react-icons/gr";

// export default function DateTimePicker() {
//   const days = ["S", "M", "T", "W", "T", "F", "S"];
//   const currentDate = dayjs();
//   const [today, setToday] = useState(currentDate);
//   const [selectDate, setSelectDate] = useState(currentDate);
//   const [showTimeModal, setShowTimeModal] = useState(false);

//   const openTimeModal = () => {
//     setShowTimeModal(true);
//   };

//   const closeTimeModal = () => {
//     setShowTimeModal(false);
//   };
//   return (
//     <div className="h-full overflow-hidden px-0 py-0 shadow-xl">
//       <div className="relative h-full mx-2 py-2 px-2 my-2">
//         <div className="flex justify-center items-center">
//           {/* <h1 className="select-none font-semibold">
// 						{months[today.month()]}, {today.year()}
// 					</h1> */}
//           <div className="flex gap-10 items-center">
//             <GrFormPrevious
//               className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
//               onClick={() => {
//                 setToday(today.month(today.month() - 1));
//               }}
//             />
//             <h1
//               className="select-none font-semibold cursor-pointer hover:scale-105 transition-all"
//               onClick={() => {
//                 setToday(currentDate);
//               }}
//             >
//               {months[today.month()]}, {today.year()}
//             </h1>
//             <GrFormNext
//               className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
//               onClick={() => {
//                 setToday(today.month(today.month() + 1));
//               }}
//             />
//           </div>
//         </div>
//         <div className="grid grid-cols-7 bg-black text-white">
//           {days.map((day, index) => {
//             return (
//               <h1
//                 key={index}
//                 className="p-2 text-center h-14 grid place-content-center text-sm"
//               >
//                 {day}
//               </h1>
//             );
//           })}
//         </div>

//         <div className="grid grid-cols-7 ">
//           {generateDate(today.month(), today.year()).map(
//             ({ date, currentMonth, today }, index) => {
//               return (
//                 <div
//                   key={index}
//                   className="p-2 text-center h-14 grid place-content-center text-sm border-t"
//                 >
//                   <h1
//                     className={cn(
//                       currentMonth ? "" : "text-gray-400",
//                       today ? "bg-red-600 text-white" : "",
//                       selectDate.toDate().toDateString() ===
//                         date.toDate().toDateString()
//                         ? "bg-black text-white"
//                         : "",
//                       "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
//                     )}
//                     onClick={() => {
//                       setSelectDate(date);
//                       openTimeModal(); // Open the time modal
//                     }}
//                   >
//                     {date.date()}
//                   </h1>
//                 </div>
//               );
//             }
//           )}
//         </div>
//       </div>

//       {showTimeModal && (
//         <div className="fixed top-0 z-50 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
//           <div className="bg-white p-4 rounded-md max-w-md w-full">
//             <h1 className="text-lg text-center font-semibold mb-4">
//               Select a time for {selectDate.toDate().toDateString()}
//             </h1>
//             <div className="time-selection-container overflow-y-auto max-h-[100px]">
//               <div className="flex flex-wrap gap-2">
//                 {Array.from({ length: 24 * 2 }).map((_, index) => {
//                   const time = dayjs()
//                     .hour(8)
//                     .minute(0)
//                     .add(index * 60, "minutes");
//                   return (
//                     <div
//                       key={index}
//                       className={cn(
//                         "p-2 rounded-full border cursor-pointer transition-all",
//                         "hover:bg-gray-200",
//                         "select-none"
//                       )}
//                       onClick={() => {
//                         // Handle time selection as needed
//                         console.log("Selected time:", time.format("HH:mm"));
//                         closeTimeModal(); // Close the time modal after selection
//                       }}
//                     >
//                       {time.format("HH:mm")}
//                     </div>
//                   );
//                 })}
//               </div>
//             </div>
//             <button
//               className="w-full py-2 px-4 mt-4 font-sans inline-flex items-center justify-center whitespace-nowrap rounded-xl border border-transparent bg-blue-800 px-8 py-2 text-base font-semibold text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] cursor-pointer"
//               onClick={closeTimeModal}
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }