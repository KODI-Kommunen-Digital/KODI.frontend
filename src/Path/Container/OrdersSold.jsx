import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import SellerStatistics from "../../Components/SellerStatistics";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getOrdersSold } from "../../Services/containerApi";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";

const OrdersSold = () => {
    window.scrollTo(0, 0);
    const { t } = useTranslation();
    const [ordersSold, setOrdersSold] = useState([]);
    const [ordersSoldCount, setOrdersSoldCount] = useState([]);

    const [pageNumber, setPageNo] = useState(1);
    const pageSize = 9;
    const [orderStartDate, setOrderStartDate] = useState('');
    const [orderEndDate, setOrderEndDate] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [selectedPeriod, setSelectedPeriod] = useState('today');
    const [tempStartDate, setTempStartDate] = useState('');
    const [tempEndDate, setTempEndDate] = useState('');

    const monthNames = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const periodOptions = [
        { value: 'today', label: t('today') },
        { value: 'this-week', label: t('thisWeek') },
        { value: 'this-month', label: t('thisMonth') },
        { value: 'this-year', label: t('thisYear') },
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
            const isFutureDate = new Date(year, month, day) > currentDate;
            const isSelectedDate =
                orderStartDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` ||
                orderEndDate === `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

            calendarDays.push(
                <div
                    key={day}
                    className={`text-sm font-bold h-10 w-10 rounded-full grid place-content-center transition-all cursor-pointer select-none 
                                ${isSelectedDate ? 'bg-black text-white' :
                            isToday ? 'bg-red-600 text-white' :
                                isFutureDate ? 'text-slate-400 cursor-not-allowed' :
                                    'hover:bg-black hover:text-white'}`}
                    onClick={() => !isFutureDate && handleDateSelect(year, month, day)}
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
        setSelectedPeriod('');
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

    const formatDate = (date) => {
        return date.toISOString().split('T')[0];
    };

    const setOrderDatesForPeriod = (period) => {
        const today = new Date();
        let startDate, endDate;
        switch (period) {
            case 'today': {
                startDate = formatDate(today);
                endDate = formatDate(today);
                break;
            }
            case 'this-week': {
                const firstDayOfWeek = new Date(today);
                firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
                startDate = formatDate(firstDayOfWeek);
                endDate = formatDate(today);
                break;
            }
            case 'this-month': {
                const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                startDate = formatDate(firstDayOfMonth);
                endDate = formatDate(today);
                break;
            }
            case 'this-year': {
                const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
                startDate = formatDate(firstDayOfYear);
                endDate = formatDate(today);
                break;
            }
            default: {
                startDate = '';
                endDate = '';
            }
        }
        setOrderStartDate(startDate);
        setOrderEndDate(endDate);
    };

    const handlePeriodClick = (periodValue) => {
        setSelectedPeriod(periodValue);
        setOrderStartDate('');
        setOrderEndDate('');
        setTimeout(() => setOrderDatesForPeriod(periodValue), 0);
    };

    const totalRevenue = ordersSold.reduce((total, product) => {
        return total + (product.totalPrice || 0);
    }, 0);

    const totalQuantitySold = ordersSold.reduce((total, product) => {
        return total + (parseInt(product.totalQuantity, 10) || 0);
    }, 0);

    const totalProducts = ordersSold.length;
    const averagePricePerQuantity = (
        ordersSold.reduce((total, product) => {
            return total + (product.pricePerQuantity || 0);
        }, 0) / (totalProducts || 1)
    ).toFixed(2);

    let topProductNameByQuantity = '';
    let maxQuantity = -1;

    ordersSold.forEach(product => {
        const quantity = product.totalQuantity || 0;
        if (quantity > maxQuantity) {
            maxQuantity = quantity;
            topProductNameByQuantity = product.productName;
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
                    setOrdersSoldCount(response.data.count);
                }
            }).catch((error) => {
                setErrorMessage("Failed. " + error.message);
            });
        }
    }, [orderStartDate, orderEndDate, pageNumber, pageSize, t]);

    // const handleFetchOrders = useCallback(() => {
    //     if (orderStartDate && orderEndDate) {
    //         getOrdersSold({
    //             orderStartDate,
    //             orderEndDate,
    //             pageNumber,
    //             pageSize,
    //         })
    //             .then(response => {
    //                 if (response.data.status === "error") {
    //                     setErrorMessage(t("selectAnotherDate"));
    //                 } else {
    //                     setOrdersSold(response.data.data);
    //                     setOrdersSoldCount(response.data.count);
    //                 }
    //             })
    //             .catch(err => {
    //                 setErrorMessage(err.message);
    //             });
    //     }
    // }, [orderStartDate, orderEndDate, pageNumber, pageSize, t]);

    useEffect(() => {
        if (selectedPeriod) {
            setOrderDatesForPeriod(selectedPeriod);
        }
    }, [selectedPeriod]);

    // useEffect(() => {
    //     handleFetchOrders();
    // }, [orderStartDate, orderEndDate, handleFetchOrders]);

    useEffect(() => {
        const accessToken =
            window.localStorage.getItem("accessToken") ||
            window.sessionStorage.getItem("accessToken");
        const refreshToken =
            window.localStorage.getItem("refreshToken") ||
            window.sessionStorage.getItem("refreshToken");
        if (!accessToken && !refreshToken) {
            navigate("/login");
        }
        if (orderStartDate && orderEndDate) {
            fetchOrdersSold();
        }
    }, [orderStartDate, orderEndDate, fetchOrdersSold]);

    const handleOkayClick = () => {
        if (tempStartDate && tempEndDate) {
            setOrderStartDate(tempStartDate);
            setOrderEndDate(tempEndDate);
        } else {
            setErrorMessage(t("pleaseSelectBothDates"));
        }
    };

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <section className="bg-gray-800 body-font relative min-h-screen">
            <SideBar />

            <div className="container w-auto px-2 py-2 bg-gray-800 min-h-screen flex flex-col">
                <div className="h-full">

                    {ordersSold && ordersSold.length > 0 ? (
                        <>
                            <div>
                                <SellerStatistics totalRevenue={totalRevenue} topProductNameByQuantity={topProductNameByQuantity} totalQuantitySold={totalQuantitySold} averagePricePerQuantity={averagePricePerQuantity} />

                                <div className="bg-white mt-4 p-0">
                                    <h2 className="text-xl font-semibold text-gray-800 text-center px-5 py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
                                        {t("ordersSold")}
                                    </h2>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left  text-gray-500  p-6 space-y-10 rounded-lg">
                                            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                                                <tr>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-center"
                                                        style={{
                                                            fontFamily: "Poppins, sans-serif",
                                                            width: "20%",
                                                        }}
                                                    >
                                                        {t("productName")}
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-center "
                                                        style={{
                                                            fontFamily: "Poppins, sans-serif",
                                                            width: "20%",
                                                        }}
                                                    >
                                                        {t("stockSold")}
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-center"
                                                        style={{
                                                            fontFamily: "Poppins, sans-serif",
                                                            width: "25%",
                                                        }}
                                                    >
                                                        {t("price")}
                                                    </th>
                                                    <th
                                                        scope="col"
                                                        className="px-6 py-4 text-center"
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
                                                    return (
                                                        <tr
                                                            key={index}
                                                            className="bg-white border-b hover:bg-gray-50"
                                                        >
                                                            <td
                                                                className="px-6 py-4 text-center text-gray-500 font-bold truncate"
                                                                style={{ fontFamily: "Poppins, sans-serif" }}
                                                            >
                                                                {item.productName}
                                                            </td>
                                                            <td
                                                                className="px-6 py-4 text-center font-bold text-blue-600"
                                                                style={{ fontFamily: "Poppins, sans-serif" }}
                                                            >
                                                                {item.totalQuantity}
                                                            </td>
                                                            <td
                                                                className="px-6 py-4 text-center font-bold text-red-600"
                                                                style={{ fontFamily: "Poppins, sans-serif" }}
                                                            >
                                                                € {item.pricePerQuantity}
                                                            </td>
                                                            <td
                                                                className="px-6 py-4 text-center font-bold text-green-600"
                                                                style={{ fontFamily: "Poppins, sans-serif" }}
                                                            >
                                                                € {item.totalPrice}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="bottom-5 right-5 mt-4 px-1 py-2 text-xs font-medium text-center float-right cursor-pointer bg-black rounded-xl">
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

                                {ordersSold.length >= pageSize && pageNumber * pageSize < ordersSoldCount && (
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
                        <div className="bg-gray-800 mt-0 min-h-[30rem] px-5 py-2 flex flex-col justify-center items-center">
                            <center>
                                <div className="tracking-widest mt-4">
                                    <span
                                        className={
                                            ordersSold.length === 0 || errorMessage
                                                ? "text-green-600 text-xl"
                                                : "text-gray-500 text-xl"
                                        }
                                    >
                                        {t("eaitherSelectAPeriodOrChooseADateFromCalendar")}
                                    </span>
                                </div>
                            </center>

                            <div className="lg:w-7/12 md:w-9/12 sm:w-10/12 mx-auto p-4 mt-4">
                                <div className="bg-zinc-100 shadow-lg rounded-lg overflow-hidden">
                                    <div className="items-center px-6 py-3">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="startDate" className="block text-gray-800">
                                                    {t("startDate")}
                                                </label>
                                                <Flatpickr
                                                    options={{ dateFormat: "Y-m-d" }}
                                                    value={tempStartDate}
                                                    onChange={([date]) => setTempStartDate(date.toISOString().split('T')[0])}
                                                    className="w-full px-3 py-2 border border-gray-800 rounded"
                                                />
                                            </div>
                                            <div>
                                                <label htmlFor="endDate" className="block text-gray-800">
                                                    {t("endDate")}
                                                </label>
                                                <Flatpickr
                                                    options={{ dateFormat: "Y-m-d" }}
                                                    value={tempEndDate}
                                                    onChange={([date]) => setTempEndDate(date.toISOString().split('T')[0])}
                                                    className="w-full px-3 py-2 border border-gray-800 rounded"
                                                />
                                            </div>
                                        </div>
                                        <div className="mt-4">
                                            <button
                                                onClick={handleOkayClick}
                                                className=" w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                                            >
                                                {t("select")}
                                            </button>
                                            {errorMessage && (
                                                <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 p-4">
                                {periodOptions.map((period) => (
                                    <div
                                        key={period.value}
                                        className={`w-full sm:w-auto px-4 py-2 text-center text-gray-800 border-2 border-gray-800 rounded-full cursor-pointer transition-all ${selectedPeriod === period.value
                                            ? 'bg-green-600 text-white'
                                            : 'bg-gray-200 hover:bg-green-600 hover:text-white'
                                            }`}
                                        onClick={() => handlePeriodClick(period.value)}
                                        style={{ fontFamily: 'Poppins, sans-serif' }}
                                    >
                                        {period.label}
                                    </div>
                                ))}
                            </div>

                            <div className="lg:w-7/12 md:w-9/12 sm:w-10/12 mx-auto p-4">
                                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                    <div className="flex items-center justify-between px-6 py-3 bg-black">

                                        <GrFormPrevious
                                            className="text-sm font-bold h-5 w-5 rounded-full grid place-content-center bg-white text-black transition-all cursor-pointer select-none"
                                            onClick={handlePrevMonth}
                                        />

                                        <h2 className="text-white">{`${monthNames[currentMonth]} ${currentYear}`}</h2>

                                        <GrFormNext
                                            className="text-sm font-bold h-5 w-5 rounded-full grid place-content-center bg-white text-black transition-all cursor-pointer select-none"
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
                                    <span
                                        className={
                                            ordersSold.length === 0 || errorMessage
                                                ? "text-red-600 text-xl"
                                                : "text-gray-500 text-xl"
                                        }
                                    >
                                        {ordersSold.length === 0 || errorMessage ? t("selectAnotherDate") : t("selectDate")}
                                    </span>
                                </div>
                            </center>


                            <center className="mt-6 mb-4">
                                <a
                                    onClick={() => navigateTo("/SellerScreen")}
                                    className="relative w-full inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-black transition duration-300 ease-out bg-indigo-700 border-2 border-indigo-600 rounded-full shadow-md group cursor-pointer"
                                >
                                    <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 translate-x-full bg-indigo-700 group-hover:-translate-x-0 ease">
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
                                    <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:-translate-x-full ease">
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