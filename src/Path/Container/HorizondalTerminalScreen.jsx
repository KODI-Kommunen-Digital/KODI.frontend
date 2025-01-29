// import React, { useState, useEffect } from "react";
// import ListingsCard from "../../Components/ListingsCard";
// import ListingsFeed from "../../Components/V2/ListingsFeed";
// import { getListings } from "../../Services/listingsApi";
// import { hiddenCategories } from "../../Constants/hiddenCategories";
// import { useTranslation } from "react-i18next";

// const HorizondalTerminalScreen = () => {
//     const { t } = useTranslation();
//     const [events, setEvents] = useState([]);
//     const [news, setNews] = useState([]);
//     const [officialNotifications, setOfficialNotifications] = useState([]);
//     const [clubs, setClubs] = useState([]);
//     const [time, setTime] = useState(new Date());

//     useEffect(() => {
//         // Fetch Events
//         getListings({ categoryId: 2 }).then((response) => {
//             const filteredListings = response.data.data.filter(
//                 (listing) => !hiddenCategories.includes(listing.categoryId)
//             );
//             setEvents(filteredListings);
//         });

//         // Fetch News
//         getListings({ categoryId: 1 }).then((response) => {
//             const filteredListings = response.data.data.filter(
//                 (listing) => !hiddenCategories.includes(listing.categoryId)
//             );
//             setNews(filteredListings);
//         });

//         // Fetch Official Notifications
//         getListings({ categoryId: 16 }).then((response) => {
//             const filteredListings = response.data.data.filter(
//                 (listing) => !hiddenCategories.includes(listing.categoryId)
//             );
//             setOfficialNotifications(filteredListings);
//         });

//         // Fetch Clubs
//         getListings({ categoryId: 4 }).then((response) => {
//             const filteredListings = response.data.data.filter(
//                 (listing) => !hiddenCategories.includes(listing.categoryId)
//             );
//             setClubs(filteredListings);
//         });

//         // Update the clock every second
//         const interval = setInterval(() => {
//             setTime(new Date());
//         }, 1000);

//         return () => clearInterval(interval); // Cleanup interval on component unmount
//     }, []);

//     const formattedDate = time.toLocaleDateString();
//     const formattedTime = time.toLocaleTimeString();

//     return (
//         <section className="text-gray-900 body-font">
//             <div className="bg-gray-300 px-5 py-6">
//                 {/* Header Section with Date and Clock */}
//                 <div className="w-full h-full bg-gray-300 p-2">
//                     <div className="flex justify-between items-center bg-white px-5 py-6 rounded-lg shadow-md">
//                         <h1 className="text-xl font-bold">{formattedDate}</h1>
//                         <h2 className="text-xl font-bold">{formattedTime}</h2>
//                     </div>
//                 </div>

//                 <div className="flex bg-gray-300 body-font relative min-h-screen">
//                     {/* Left Side: Events */}
//                     <div className="w-1/2 h-full bg-gray-300 p-2">
//                         <div className="bg-white px-5 py-6 rounded-lg">
//                             <h2 className="text-2xl font-bold mb-4">{t("Events")}</h2>
//                             <div className="space-y-4 overflow-y-scroll">
//                                 {events.map((event, index) => (
//                                     <ListingsFeed key={index} listing={event} />
//                                 ))}
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Side: News, Notifications, Clubs */}
//                     <div className="w-1/2 h-full bg-gray-300 p-2 flex flex-col">
//                         <div className="bg-white rounded-lg">
//                             {[{ title: t("News"), data: news }, { title: t("Official Notifications"), data: officialNotifications }, { title: t("Clubs"), data: clubs }].map(
//                                 (section, index) => (
//                                     <div key={index} className="flex-1 px-5 py-6">
//                                         <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
//                                         <div className="flex space-x-4 overflow-x-scroll scrollbar-hide py-2">
//                                             {section.data.map((item, itemIndex) => (
//                                                 <div
//                                                     key={itemIndex}
//                                                     className="min-w-[250px] max-w-[250px] rounded-lg bg-white"
//                                                 >
//                                                     <ListingsCard listing={item} />
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default HorizondalTerminalScreen;