import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import SellerStatistics from "../../Components/SellerStatistics";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getOrdersSold } from "../../Services/containerApi";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

const OrdersSold = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [ordersSold, setOrdersSold] = useState([]);
    const [pageNumber, setPageNo] = useState(1);
    const pageSize = 9;
    const [orderStartDate, setOrderStartDate] = useState('');
    const [orderEndDate, setOrderEndDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const generateCalendar = (year, month) => {
        const firstDayOfMonth = new Date(year, month, 1);
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfWeek = firstDayOfMonth.getDay();

        const calendarDays = [];

        for (let i = 0; i < firstDayOfWeek; i++) {
            calendarDays.push(<div key={`empty-${i}`}></div>);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date();
            const isToday = year === currentDate.getFullYear() && month === currentDate.getMonth() && day === currentDate.getDate();
            const isSelectedDate =
                orderStartDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ||
                orderEndDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            calendarDays.push(
                <div
                    key={day}
                    className={`text-sm font-bold h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none ${isSelectedDate ? 'bg-black text-white' : isToday ? 'bg-red-600 text-white' : ''}`}
                    onClick={() => handleDateSelect(year, month, day)}
                >
                    {day}
                </div>
            );
        }

        return calendarDays;
    };

    const handleDateSelect = (year, month, day) => {
        const selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setOrderStartDate(selectedDate);
        setOrderEndDate(selectedDate);
    };

    const handlePrevMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = prev - 1;
            if (newMonth < 0) {
                setCurrentYear(prevYear => prevYear - 1);
                return 11;
            }
            return newMonth;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth(prev => {
            const newMonth = prev + 1;
            if (newMonth > 11) {
                setCurrentYear(prevYear => prevYear + 1);
                return 0;
            }
            return newMonth;
        });
    };

    // Calculate Total Revenue
    const totalRevenue = ordersSold.reduce((total, product) => {
        return total + product.cart_items.totalPrice;
    }, 0);

    // Calculate Total Quantity Sold
    const totalQuantitySold = ordersSold.reduce((total, product) => {
        return total + product.cart_items.quantity;
    }, 0);

    // Calculate Average Price Per Quantity
    const totalProducts = ordersSold.length; // Assuming this is the total number of products
    const averagePricePerQuantity = ordersSold.reduce((total, product) => {
        return total + product.cart_items.pricePerQuantity;
    }, 0) / totalProducts;

    // Find Top Selling Products based on quantity (assuming descending order)
    let topProductNameByQuantity = '';
    let maxQuantity = -1;

    ordersSold.forEach(order => {
        const quantity = order.cart_items.quantity;
        if (quantity > maxQuantity) {
            maxQuantity = quantity;
            topProductNameByQuantity = order.cart_items.productName;
        }
    });

    const fetchOrdersSold = useCallback(() => {
        if (orderStartDate && orderEndDate) {
            getOrdersSold({
                orderStartDate,
                orderEndDate,
                pageNumber,
                pageSize,
            }).then((response) => {
                if (response.data.status === "error") {
                    setErrorMessage("Failed. " + t("selectAnotherDate"));
                } else {
                    setOrdersSold(response.data.data);
                }
            }).catch((error) => {
                setErrorMessage("Failed. " + (error.message));
            });
        }
    }, [orderStartDate, orderEndDate, pageNumber, pageSize]);


    useEffect(() => {
        if (orderStartDate && orderEndDate) {
            fetchOrdersSold();
        }
    }, [orderStartDate, orderEndDate, fetchOrdersSold]);

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto px-5 lg:px-5 py-2 bg-gray-800 min-h-screen flex flex-col">
                <div className="h-full">

                    {ordersSold && ordersSold.length > 0 ? (
                        <>
                            <SellerStatistics totalRevenue={totalRevenue} topProductNameByQuantity={topProductNameByQuantity} totalQuantitySold={totalQuantitySold} averagePricePerQuantity={averagePricePerQuantity} />

                            <div className="bg-white mt-10 p-0 space-y-0 shadow-xl overflow-x-auto">
                                <h2 className="text-gray-900 text-lg p-6 font-medium title-font">
                                    {t("productDetails")}
                                </h2>
                                <table className="w-full text-sm text-left lg:mt-[0rem] mt-[0rem] text-gray-500 p-6 space-y-10 rounded-lg">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "20%",
                                                }}
                                            >
                                                {t("productName")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center "
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "20%",
                                                }}
                                            >
                                                {t("stockSold")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "25%",
                                                }}
                                            >
                                                {t("price")}
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 sm:px-6 py-3 text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    width: "25%",
                                                }}
                                            >
                                                {t("totalIncome")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ordersSold.map((item, index) => {
                                            const products = item.cart_items;
                                            return (
                                                <tr
                                                    key={index}
                                                    className="bg-white border-b hover:bg-gray-50"
                                                >
                                                    <th
                                                        scope="row"
                                                        className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap cursor-pointer"
                                                    >
                                                        <img
                                                            className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                                                            src={
                                                                products.image
                                                                    ? process.env.REACT_APP_BUCKET_HOST +
                                                                    products.image
                                                                    : process.env.REACT_APP_BUCKET_HOST +
                                                                    "admin/DefaultForum.jpeg"
                                                            }
                                                            onClick={() =>
                                                                navigateTo(
                                                                    `/Forum?forumId=${products.forumId}&cityId=${products.cityId}`
                                                                )
                                                            }
                                                            alt="avatar"
                                                        />
                                                        <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
                                                            <div
                                                                className="font-bold text-gray-500 cursor-pointer text-center truncate"
                                                                style={{ fontFamily: "Poppins, sans-serif" }}
                                                                onClick={() =>
                                                                    navigateTo(
                                                                        `/Forum?forumId=${products.forumId}&cityId=${products.cityId}`
                                                                    )
                                                                }
                                                            >
                                                                {products.productName}
                                                            </div>
                                                        </div>
                                                    </th>
                                                    <td
                                                        className={`px-6 py-4 text-center font-bold text-blue-600`}
                                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                                    >
                                                        {products.quantity}
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-center font-bold text-red-600"
                                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                                    >
                                                        € {products.pricePerQuantity}
                                                    </td>
                                                    <td
                                                        className="px-6 py-4 text-center font-bold text-green-600"
                                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                                    >
                                                        € {products.totalPrice}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
                                {pageNumber !== 1 ? (
                                    <span
                                        className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                                        onClick={() => setPageNo(pageNumber - 1)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {"<"}{" "}
                                    </span>
                                ) : (
                                    <span />
                                )}
                                <span
                                    className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                >
                                    {t("page")} {pageNumber}
                                </span>

                                {ordersSold.length >= pageSize && (
                                    <span
                                        className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                                        onClick={() => setPageNo(pageNumber + 1)}
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {">"}
                                    </span>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="bg-gray-100 mt-0 h-[40rem] flex flex-col justify-center items-center">
                            <div className="lg:w-7/12 md:w-9/12 sm:w-10/12 mx-auto p-4">
                                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                    <div className="flex items-center justify-between px-6 py-3 bg-black">

                                        <GrFormPrevious
                                            className="w-5 h-5 cursor-pointer hover:scale-105 transition-all text-white"
                                            onClick={handlePrevMonth}
                                        />

                                        <h2 className="text-white">{`${monthNames[currentMonth]} ${currentYear}`}</h2>

                                        <GrFormNext
                                            className="w-5 h-5 cursor-pointer hover:scale-105 transition-all text-white"
                                            onClick={handleNextMonth}
                                        />
                                    </div>
                                    <div className="grid grid-cols-7 gap-2 p-4 bg-zinc-100" id="calendar">
                                        {generateCalendar(currentYear, currentMonth)}
                                    </div>
                                </div>
                            </div>

                            <center>
                                <div className="tracking-widest mt-4">
                                    <span className="text-gray-500 text-xl">{errorMessage ? t("selectAnotherDate") : t("selectDate")}</span>
                                </div>
                            </center>
                            <center className="mt-6">
                                <a
                                    onClick={() => navigateTo("/SellerScreen")}
                                    className="bg-white relative w-full inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-black transition duration-300 ease-out border-2 border-black rounded-full shadow-md group cursor-pointer"
                                >
                                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 translate-x-full bg-black group-hover:-translate-x-0 ease">
                                        <svg
                                            className="w-6 h-6 transform rotate-180"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            ></path>
                                        </svg>
                                    </span>
                                    <span className="absolute flex items-center justify-center w-full h-full text-black transition-all duration-300 transform group-hover:-translate-x-full ease">
                                        {t("goBack")}
                                    </span>
                                    <span className="relative invisible">{t("goBack")}</span>
                                </a>
                            </center>
                        </div>
                    )}
                </div>
            </div>
        </section >
    );
};

export default OrdersSold;