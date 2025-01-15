import React, { useState, useEffect, useCallback } from "react";
import Flatpickr from "react-flatpickr";
import { useNavigate } from "react-router-dom";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import "flatpickr/dist/themes/material_blue.css";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { getOrdersSold } from "../../Services/containerApi";

const PeriodSelection = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [tempStartDate, setTempStartDate] = useState("");
    const [tempEndDate, setTempEndDate] = useState("");
    const [selectedPeriod, setSelectedPeriod] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [orderStartDate, setOrderStartDate] = useState("");
    const [orderEndDate, setOrderEndDate] = useState("");
    const [ordersSoldLength, setOrdersSoldLength] = useState(0);

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const periodOptions = [
        { value: "today", label: t("today") },
        { value: "this-week", label: t("thisWeek") },
        { value: "this-month", label: t("thisMonth") },
        { value: "this-year", label: t("thisYear") },
    ];

    const fetchOrdersSoldLength = useCallback(() => {
        if (orderStartDate && orderEndDate) {
            getOrdersSold({ orderStartDate, orderEndDate })
                .then((response) => {
                    if (response.data.status === "error") {
                        setErrorMessage(t("selectAnotherDate"));
                    } else {
                        setOrdersSoldLength(response.data.data.length);
                    }
                })
                .catch((error) => {
                    setErrorMessage(error.message || t("selectAnotherDate"));
                });
        }
    }, [orderStartDate, orderEndDate, t]);

    useEffect(() => {
        if (orderStartDate && orderEndDate) {
            fetchOrdersSoldLength();
        }
    }, [orderStartDate, orderEndDate, fetchOrdersSoldLength]);

    const handleDateSelect = (year, month, day) => {
        const selectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        setOrderStartDate(selectedDate);
        setOrderEndDate(selectedDate);
        setTempStartDate(selectedDate);
        setTempEndDate(selectedDate);
        setSelectedPeriod("");
    };

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
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` === orderStartDate ||
                `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` === orderEndDate;

            calendarDays.push(
                <div
                    key={day}
                    className={`text-sm font-bold h-10 w-10 rounded-full grid place-content-center transition-all cursor-pointer select-none 
                                ${isSelectedDate ? "bg-black text-white" :
                            isToday ? "bg-red-600 text-white" :
                                isFutureDate ? "text-slate-400 cursor-not-allowed" :
                                    "hover:bg-black hover:text-white"}`}
                    onClick={() => !isFutureDate && handleDateSelect(year, month, day)}
                >
                    {day}
                </div>
            );
        }

        return calendarDays;
    };

    const handleOkayClick = () => {
        if (tempStartDate && tempEndDate) {
            navigate("/SellerScreen/OrdersSold", { state: { orderStartDate: tempStartDate, orderEndDate: tempEndDate } });
        } else {
            setErrorMessage(t("pleaseSelectBothDates"));
        }
    };

    const handlePeriodClick = (periodValue) => {
        setSelectedPeriod(periodValue);
        const { startDate, endDate } = setOrderDatesForPeriod(periodValue);
        setOrderStartDate(startDate);
        setOrderEndDate(endDate);
        navigate("/SellerScreen/OrdersSold", { state: { selectedPeriod: periodValue, orderStartDate: startDate, orderEndDate: endDate } });
    };

    const setOrderDatesForPeriod = (period) => {
        const today = new Date();
        let startDate, endDate;
        switch (period) {
            case "today": {
                startDate = today.toISOString().split("T")[0];
                endDate = startDate;
                break;
            }
            case "this-week": {
                const firstDayOfWeek = new Date(today);
                firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());
                startDate = firstDayOfWeek.toISOString().split("T")[0];
                endDate = today.toISOString().split("T")[0];
                break;
            }
            case "this-month": {
                startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split("T")[0];
                endDate = today.toISOString().split("T")[0];
                break;
            }
            case "this-year": {
                startDate = new Date(today.getFullYear(), 0, 1).toISOString().split("T")[0];
                endDate = today.toISOString().split("T")[0];
                break;
            }
            default:
                startDate = "";
                endDate = "";
        }
        return { startDate, endDate };
    };

    const handlePrevMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = prev - 1;
            if (newMonth < 0) {
                setCurrentYear((prevYear) => prevYear - 1);
                return 11;
            }
            return newMonth;
        });
    };

    const handleNextMonth = () => {
        setCurrentMonth((prev) => {
            const newMonth = prev + 1;
            if (newMonth > 11) {
                setCurrentYear((prevYear) => prevYear + 1);
                return 0;
            }
            return newMonth;
        });
    };

    return (
        <div className="bg-gray-800 relative min-h-screen mt-0 min-h-[30rem] px-5 py-2 flex flex-col justify-center items-center">
            <center>
                <div className="tracking-widest mt-4">
                    {errorMessage ? (
                        <span className="text-red-500 text-center">{errorMessage}</span>
                    ) : (
                        <span className="text-gray-500 text-xl">
                            {ordersSoldLength > 0 ? `${ordersSoldLength} ${t("ordersFound")}` : t("noOrdersFound")}
                        </span>
                    )}
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
                                    options={{
                                        dateFormat: "Y-m-d",
                                        maxDate: new Date(), // Restrict future dates
                                    }}
                                    value={tempStartDate}
                                    onChange={([date]) => {
                                        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                            .toISOString()
                                            .split("T")[0];
                                        setTempStartDate(localDate);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-800 rounded"
                                />
                            </div>
                            <div>
                                <label htmlFor="endDate" className="block text-gray-800">
                                    {t("endDate")}
                                </label>
                                <Flatpickr
                                    options={{
                                        dateFormat: "Y-m-d",
                                        maxDate: new Date(), // Restrict future dates
                                    }}
                                    value={tempEndDate}
                                    onChange={([date]) => {
                                        const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                                            .toISOString()
                                            .split("T")[0];
                                        setTempEndDate(localDate);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-800 rounded"
                                />
                            </div>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={handleOkayClick}
                                className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
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
                            ? "bg-green-600 text-white"
                            : "bg-gray-200 hover:bg-green-600 hover:text-white"
                            }`}
                        onClick={() => handlePeriodClick(period.value)}
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
        </div>
    );
};

PeriodSelection.propTypes = {
    t: PropTypes.func.isRequired,
};

export default PeriodSelection;