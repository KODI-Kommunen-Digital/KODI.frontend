// import React from "react";
// import SideBar from "../../Components/SideBar";
// import { useTranslation } from "react-i18next";
// import "../../index.css";

// const MyOrders = () => {
//     window.scrollTo(0, 0);
//     const { t } = useTranslation();

//     const products = {
//         id: 1,
//         avatar: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
//         productName: "Duke 350",
//         qrcode: "Duke 350",
//         price: "10000",
//         itemsLeft: 30,
//         statusId: 1,
//         approvalId: 1,
//         stockSold: 20,
//         totalNumber: 50,
//         threshold: 10,
//         upcomingAmount: 3000,
//         userName: "Sonu",
//         customerName: "Sonu Suda, arivikunnam P.O Kundannur",
//         numberOfOrders: 20,
//         createdAt: "2024-03-01T04:30:00.000Z",
//     };

//     return (
//         <section className="bg-gray-800 body-font relative h-screen">
//             <SideBar />
//             <div className="container w-auto px-5 py-2 bg-gray-800 min-h-screen flex flex-col justify-center items-center">
//                 <div className="h-full">

//                     <div className="bg-white mt-10 lg:mt-4 p-0 space-y-0 overflow-x-auto rounded-xl">
//                         <div className="flex flex-col md:flex-row">
//                             <div className="w-full md:w-1/2 bg-cover">
//                                 <img
//                                     className="w-full h-full object-cover"
//                                     src={
//                                         products.image
//                                             ? process.env.REACT_APP_BUCKET_HOST + products.image
//                                             : process.env.REACT_APP_BUCKET_HOST + "admin/DefaultForum.jpeg"
//                                     }
//                                     alt="avatar"
//                                 />
//                             </div>
//                             <div className="flex flex-col p-4 w-full md:w-1/2 space-y-6">
//                                 <div>
//                                     <h1 className="mb-2 text-2xl font-bold leading-tight text-center md:text-left">
//                                         {products.productName}
//                                     </h1>
//                                 </div>
//                                 <div>
//                                     <table className="min-w-full divide-y divide-gray-200">
//                                         <thead>
//                                             <tr>
//                                                 <th className="px-6 py-3 bg-gray-100 text-center leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                                                     <div className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
//                                                         <span className="mr-2">{t("count")}</span>
//                                                     </div>
//                                                 </th>
//                                                 <th className="px-6 py-3 bg-gray-100 text-center leading-4 font-medium text-gray-500 uppercase tracking-wider">
//                                                     <div className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
//                                                         <span className="mr-2">{t("amount")}</span>
//                                                     </div>
//                                                 </th>
//                                             </tr>
//                                         </thead>
//                                         <tbody className="bg-gray-100 divide-y divide-gray-200">
//                                             <tr>
//                                                 <td className="px-6 py-3 bg-gray-100 text-center leading-4 font-medium uppercase tracking-wider">
//                                                     <div className="px-6 py-4 whitespace-no-wrap text-md leading-5">
//                                                         <span className="mr-2">{products.numberOfOrders}</span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="px-6 py-3 bg-gray-100 text-center leading-4 font-medium uppercase tracking-wider">
//                                                     <div className="px-6 py-4 whitespace-no-wrap text-md leading-5">
//                                                         <span className="mr-2 font-bold text-green-600">€ {products.price}</span>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         </tbody>
//                                     </table>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                 </div>
//             </div>
//         </section >
//     );
// };

// export default MyOrders;