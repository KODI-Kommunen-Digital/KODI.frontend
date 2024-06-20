// import React, { useEffect, useState } from "react";
// import { useTranslation } from "react-i18next";
// import HomePageNavBar from "../../Components/V2/HomePageNavBar";
// import { useNavigate, useLocation } from "react-router-dom";
// // import PropTypes from "prop-types";
// import { createBookings } from "../../Services/appointmentBookingApi";

// const Summary = () => {
//   window.scrollTo(0, 0);
//   const { t } = useTranslation();
//   const { state } = useLocation();
//   const [updating, setUpdating] = useState(false);
//   const bookingData = state.bookingData;

//   const [cityId, setCityId] = useState(0);
//   const [listingId, setListingId] = useState(0);
//   const [appointmentId, setAppointmentId] = useState(0);
//   const [isSuccess, setIsSuccess] = useState(false);

//   const navigate = useNavigate();
//   const navigateTo = (path) => {
//     if (path) {
//       navigate(path);
//     }
//   };

//   useEffect(() => {
//     const searchParams = new URLSearchParams(window.location.search);
//     const cityId = searchParams.get("cityId");
//     setCityId(cityId);
//     const listingId = searchParams.get("listingId");
//     setListingId(listingId);
//     const appointmentId = searchParams.get("appointmentId");
//     setAppointmentId(appointmentId);
//   }, []);

//   const handleSubmit = async (event) => {
//     event.preventDefault();

//     try {
//       setUpdating(true);
//       const response = await createBookings(cityId, listingId, appointmentId, bookingData);
//       console.log("Booking created:", response);
//       setIsSuccess(true); // Set isSuccess to true upon successful submission
//       setUpdating(false);
//       navigate("/AppointmentBooking/BookAppointments/BookingSuccessConfirmation");
//     } catch (error) {
//       console.error("Error creating booking:", error);
//       setIsSuccess(false); // Set isSuccess to false upon failed submission
//       navigate("/AppointmentBooking/BookAppointments/BookingErrorConfirmation");
//       setUpdating(false);
//     }
//   };


//   console.log(bookingData)

//   return (
//     <section className="bg-zinc-100 body-font relative">
//       <HomePageNavBar />

//       <div className="bg-zinc-100 mx-auto w-full max-w-2xl gap-y-8 gap-x-8 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:pt-24 lg:pb-4">
//         <div className="max-w-2xl gap-y-4 py-5 px-4 lg:max-w-7xl mx-auto flex flex-col items-center">
//           <p className="font-sans font-bold text-slate-800  mb-1 text-4xl title-font text-center">
//             {t("summaryBooking")}
//           </p>
//         </div>

//         <div className="max-w-2xl gap-y-4 py-5 px-4 lg:max-w-7xl mx-auto flex flex-col items-center">
//           <div className="lg:w-full border-2 border-slate-800 rounded-xl w-full h-full">
//             <div className="bg-white md:grid md:gap-6 rounded-xl p-8 flex flex-col shadow-xl w-full">
//               <p className="font-sans font-bold text-slate-800  mb-4 md:mb-1 text-md title-font">
//                 {bookingData.guestDetails.firstname + " " + bookingData.guestDetails.lastname}
//               </p>
//               <p className="font-sans font-semibold text-black mb-4 md:mb-1 text-sm title-font">
//                 {bookingData.guestDetails.email}
//               </p>
//               <p className="font-sans font-semibold text-black mb-4 md:mb-1 text-sm title-font">
//                 {bookingData.guestDetails.description}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Friends Details */}
//         {bookingData.friends.map((friend, index) => (
//           <div key={index} className="max-w-2xl gap-y-4 py-5 px-4 lg:max-w-7xl mx-auto flex flex-col items-center">
//             <div className="lg:w-full border-2 border-slate-800 rounded-xl w-full h-full">
//               <div className="bg-white md:grid md:gap-6 rounded-xl p-8 flex flex-col shadow-xl w-full">
//                 <p className="font-sans font-bold text-slate-800  mb-4 md:mb-1 text-md title-font">
//                   {friend.firstname + " " + friend.lastname}
//                 </p>
//                 <p className="font-sans font-semibold text-black mb-4 md:mb-1 text-sm title-font">
//                   {friend.email}
//                 </p>
//               </div>
//             </div>
//           </div>
//         ))}

//         <div className="bg-zinc-100 h-full items-center mt-0 py-5 xl:px-0 px-10 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
//           <div className="py-2 mt-1 px-0 flex flex-col lg:flex-row gap-4">
//             <a
//               onClick={handleSubmit}
//               disabled={updating || isSuccess}
//               className="bg-slate-800 relative w-full inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-slate-800 rounded-full shadow-md group cursor-pointer">
//               <span className="absolute inset-0 flex items-center justify-center w-full h-full text-slate-800 duration-300 -translate-x-full bg-white group-hover:translate-x-0 ease">
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
//               </span>
//               <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">{t("confirm")}</span>
//               <span className="relative invisible">
//                 {t("confirm")}

//                 {updating && (
//                   <svg
//                     aria-hidden="true"
//                     className="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
//                     viewBox="0 0 100 101"
//                     fill="none"
//                     xmlns="http://www.w3.org/2000/svg"
//                   >
//                     <path
//                       d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
//                       fill="currentColor"
//                     />
//                     <path
//                       d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
//                       fill="currentFill"
//                     />
//                   </svg>
//                 )}
//               </span>
//             </a>

//             <a
//               onClick={() =>
//                 navigateTo(`/Listings/BookAppointments?listingId=${listingId}&cityId=${cityId}&appointmentId=${appointmentId}`)
//               }
//               disabled={updating}
//               className="bg-white relative w-full inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-slate-800 transition duration-300 ease-out border-2 border-slate-800 rounded-full shadow-md group cursor-pointer">
//               <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 translate-x-full bg-slate-800 group-hover:-translate-x-0 ease">
//                 <svg className="w-6 h-6 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
//                 </svg>
//               </span>
//               <span className="absolute flex items-center justify-center w-full h-full text-slate-800 transition-all duration-300 transform group-hover:-translate-x-full ease">{t("goBack")}</span>
//               <span className="relative invisible">
//                 {t("goBack")}
//               </span>
//             </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// // Summary.propTypes = {
// //   bookingData: PropTypes.object.isRequired,
// //   location: PropTypes.shape({
// //     state: PropTypes.shape({
// //       bookingData: PropTypes.shape({
// //         categoryId: PropTypes.number,
// //         bookingId: PropTypes.number,
// //         endTime: PropTypes.arrayOf(PropTypes.string),
// //         startTime: PropTypes.arrayOf(PropTypes.string),
// //         date: PropTypes.string,
// //         numberOfPeople: PropTypes.string,
// //         friends: PropTypes.arrayOf(
// //           PropTypes.shape({
// //             firstName: PropTypes.string,
// //             lastname: PropTypes.string,
// //             email: PropTypes.string,
// //             phone: PropTypes.string,
// //             description: PropTypes.string
// //           })
// //         ),
// //         guestDetails: PropTypes.shape({
// //           firstName: PropTypes.string,
// //           lastname: PropTypes.string,
// //           email: PropTypes.string,
// //           phone: PropTypes.string,
// //           description: PropTypes.string
// //         })
// //       })
// //     })
// //   })
// // };

// export default Summary;