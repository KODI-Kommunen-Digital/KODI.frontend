import React from "react";
import PropTypes from "prop-types";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { format } from "date-fns";
import { daysOfWeek } from "../Services/helper";
import FlatPickerCommponent from "./FlatPickerCommponent";

const RecurringSchedule = ({
  listingInput,
  setListingInput,
  error,
  setError,
  validateInput,
  t,
  isRecurringScheduleComplete,
}) => {
  return (
    <div className="relative mb-4">
      <div className="relative mb-4">
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="isRecurrence"
            name="isRecurrence"
            checked={listingInput?.isRecurrence}
            onChange={(e) => {
              const isChecked = e.target.checked;
              setListingInput((prev) => ({
                ...prev,
                isRecurrence: isChecked,
                // Always clear non-recurring startDate and endDate when toggling checkbox
                // This ensures clean state whether checking or unchecking
                startDate: "",
                endDate: "",
                // Reset to single empty schedule when unchecking or checking
                recurringSchedules: isChecked
                  ? [
                    {
                      recurringType: "",
                      recurringDays: [],
                      monthlyWeekday: "",
                      dayOrdinal: "",
                      interval: 1,
                      startDate: "",
                      endDate: "",
                      recurringEndTime: "",
                      repeatUntil: "",
                      exceptionDates: [],
                    },
                  ]
                  : prev.recurringSchedules,
              }));
              // Clear errors based on checkbox state
              if (isChecked) {
                // When checking recurring, clear non-recurring date errors
                setError((prevError) => ({
                  ...prevError,
                  startDate: "",
                  endDate: "",
                }));
              } else {
                // When unchecking recurring, clear both date errors and recurring schedule errors
                setError((prevError) => ({
                  ...prevError,
                  startDate: "",
                  endDate: "",
                  recurringSchedules: [
                    {
                      recurringType: "",
                      recurringDays: "",
                      monthlyWeekday: "",
                      dayOrdinal: "",
                      interval: 1,
                      startDate: "",
                      repeatUntil: "",
                      recurringEndTime: "",
                    },
                  ],
                }));
              }
            }}
            className="mr-2"
          />
          <label
            htmlFor="isRecurrence"
            className="block text-sm font-medium text-gray-600"
          >
            {t("recurring")}
          </label>
        </div>
      </div>

      {listingInput?.isRecurrence &&
        listingInput.recurringSchedules.map((schedule, scheduleIndex) => (
          <div
            key={scheduleIndex}
            className="relative mb-6 p-4 border-2 border-gray-200 rounded-lg"
          >
            {/* Header with Schedule number and Remove button */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-700">
                {t("recurringSchedule")} #{scheduleIndex + 1}
              </h3>
              {listingInput.recurringSchedules.length > 1 && (
                <button
                  type="button"
                  onClick={() => {
                    setListingInput((prev) => ({
                      ...prev,
                      recurringSchedules: prev.recurringSchedules.filter(
                        (_, idx) => idx !== scheduleIndex,
                      ),
                    }));
                    setError((prevError) => ({
                      ...prevError,
                      recurringSchedules: prevError.recurringSchedules.filter(
                        (_, idx) => idx !== scheduleIndex,
                      ),
                    }));
                  }}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm"
                >
                  {t("remove")}
                </button>
              )}
            </div>

            {/* Recurring Type Dropdown */}
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-600">
                {t("recurringType")} *
              </label>

              <select
                name="recurringType"
                value={schedule.recurringType || ""}
                onChange={(e) => {
                  const newRecurringType = e.target.value;
                  setListingInput((prev) => {
                    const updatedSchedules = [...prev.recurringSchedules];
                    updatedSchedules[scheduleIndex] = {
                      ...updatedSchedules[scheduleIndex],
                      recurringType: newRecurringType,
                      startDate: "",
                      endDate: "",
                      recurringEndTime: "",
                      repeatUntil: "",
                      recurringDays: [],
                      monthlyWeekday: "",
                      dayOrdinal: "",
                      exceptionDates: [],
                    };
                    return {
                      ...prev,
                      recurringSchedules: updatedSchedules,
                    };
                  });
                  // Clear related errors
                  setError((prevError) => {
                    const updatedErrors = [...prevError.recurringSchedules];
                    updatedErrors[scheduleIndex] = {
                      ...updatedErrors[scheduleIndex],
                      recurringType: "",
                      startDate: "",
                      recurringEndTime: "",
                      repeatUntil: "",
                      recurringDays: "",
                      monthlyWeekday: "",
                      dayOrdinal: "",
                      interval: "",
                    };
                    return {
                      ...prevError,
                      recurringSchedules: updatedErrors,
                    };
                  });
                  validateInput({
                    target: {
                      name: "recurringType",
                      value: newRecurringType,
                    },
                  });
                }}
                onBlur={validateInput}
                className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
              >
                <option value="">{t("chooseRecurringType")}</option>
                <option value="daily">{t("daily")}</option>
                <option value="weekly">{t("weekly")}</option>
                <option value="monthly">{t("monthly")}</option>
              </select>
              <div
                className="mt-2 text-sm text-red-600"
                style={{
                  visibility: error?.recurringSchedules?.[scheduleIndex]
                    ?.recurringType
                    ? "visible"
                    : "hidden",
                }}
              >
                {error?.recurringSchedules?.[scheduleIndex]?.recurringType}
              </div>
            </div>

            {/* Interval Input Field - Show when recurringType is selected */}
            {schedule.recurringType && (
              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  {t("interval")} *
                </label>
                <input
                  type="number"
                  name="interval"
                  value={schedule.interval || ""}
                  min="1"
                  step="1"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    // Allow empty string or positive numbers only
                    const value = inputValue === "" ? "" : parseInt(inputValue);

                    setListingInput((prev) => {
                      const updatedSchedules = [...prev.recurringSchedules];
                      updatedSchedules[scheduleIndex] = {
                        ...updatedSchedules[scheduleIndex],
                        interval: value,
                      };
                      return {
                        ...prev,
                        recurringSchedules: updatedSchedules,
                      };
                    });
                  }}
                  onBlur={(e) => {
                    // Validate on blur
                    const value = parseInt(e.target.value);
                    let errorMessage = "";

                    if (e.target.value === "" || isNaN(value) || value < 1) {
                      errorMessage = t("pleaseEnterValidInterval");
                    }

                    setError((prevError) => {
                      const updatedErrors = [...prevError.recurringSchedules];
                      updatedErrors[scheduleIndex] = {
                        ...updatedErrors[scheduleIndex],
                        interval: errorMessage,
                      };
                      return {
                        ...prevError,
                        recurringSchedules: updatedErrors,
                      };
                    });
                  }}
                  className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                  placeholder="1"
                  required
                />
                <div
                  className="mt-2 text-sm text-red-600"
                  style={{
                    visibility: error?.recurringSchedules?.[scheduleIndex]
                      ?.interval
                      ? "visible"
                      : "hidden",
                  }}
                >
                  {error?.recurringSchedules?.[scheduleIndex]?.interval}
                </div>
              </div>
            )}

            {/* Weekly Days Selection */}
            {schedule.recurringType === "weekly" && (
              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  {t("selectDays")} *
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {daysOfWeek?.map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${day}-${scheduleIndex}`}
                        name={day}
                        checked={
                          schedule.recurringDays
                            ? schedule.recurringDays.includes(day)
                            : false
                        }
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setListingInput((prev) => {
                            const updatedSchedules = [
                              ...prev.recurringSchedules,
                            ];
                            let updatedDays =
                              updatedSchedules[scheduleIndex].recurringDays ||
                              [];
                            if (isChecked) {
                              updatedDays = [...updatedDays, day];
                            } else {
                              updatedDays = updatedDays.filter(
                                (d) => d !== day,
                              );
                            }
                            updatedSchedules[scheduleIndex] = {
                              ...updatedSchedules[scheduleIndex],
                              recurringDays: updatedDays,
                            };

                            return {
                              ...prev,
                              recurringSchedules: updatedSchedules,
                            };
                          });

                          // Validate weekday selection
                          setError((prevError) => {
                            const updatedErrors = [
                              ...prevError.recurringSchedules,
                            ];
                            const updatedDays =
                              listingInput.recurringSchedules[scheduleIndex]
                                .recurringDays || [];
                            let errorMessage = "";
                            if (
                              isChecked
                                ? updatedDays.length + 1 === 0
                                : updatedDays.length - 1 === 0
                            ) {
                              errorMessage = t("pleaseSelectAtLeastOneWeekday");
                            }
                            updatedErrors[scheduleIndex] = {
                              ...updatedErrors[scheduleIndex],
                              recurringDays: errorMessage,
                            };
                            return {
                              ...prevError,
                              recurringSchedules: updatedErrors,
                            };
                          });
                        }}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`${day}-${scheduleIndex}`}
                        className="text-gray-700"
                      >
                        {t(day)}
                      </label>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-2 text-sm text-red-600"
                  style={{
                    visibility: error?.recurringSchedules?.[scheduleIndex]
                      ?.recurringDays
                      ? "visible"
                      : "hidden",
                  }}
                >
                  {error?.recurringSchedules?.[scheduleIndex]?.recurringDays}
                </div>
              </div>
            )}

            {/* Monthly Weekday Selection */}
            {schedule.recurringType === "monthly" && (
              <div className="relative mb-4">
                <label className="block text-sm font-medium text-gray-600">
                  {t("selectDays")} *
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {daysOfWeek?.map((day) => (
                    <div key={day} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`monthly-${day}-${scheduleIndex}`}
                        name={`monthlyWeekday-${scheduleIndex}`}
                        checked={schedule.monthlyWeekday === day}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          setListingInput((prev) => {
                            const updatedSchedules = [
                              ...prev.recurringSchedules,
                            ];
                            updatedSchedules[scheduleIndex] = {
                              ...updatedSchedules[scheduleIndex],
                              monthlyWeekday: isChecked ? day : "",
                              // Clear dayOrdinal when unselecting weekday
                              dayOrdinal: isChecked
                                ? updatedSchedules[scheduleIndex].dayOrdinal
                                : "",
                            };
                            return {
                              ...prev,
                              recurringSchedules: updatedSchedules,
                            };
                          });
                          // Clear error when user selects/deselects a weekday
                          setError((prevError) => {
                            const updatedErrors = [
                              ...prevError.recurringSchedules,
                            ];
                            updatedErrors[scheduleIndex] = {
                              ...updatedErrors[scheduleIndex],
                              monthlyWeekday: "",
                              dayOrdinal: "",
                            };
                            return {
                              ...prevError,
                              recurringSchedules: updatedErrors,
                            };
                          });
                        }}
                        className="mr-2"
                      />
                      <label
                        htmlFor={`monthly-${day}-${scheduleIndex}`}
                        className="text-gray-700"
                      >
                        {t(day)}
                      </label>
                    </div>
                  ))}
                </div>
                <div
                  className="mt-2 text-sm text-red-600"
                  style={{
                    visibility: error?.recurringSchedules?.[scheduleIndex]
                      ?.monthlyWeekday
                      ? "visible"
                      : "hidden",
                  }}
                >
                  {error?.recurringSchedules?.[scheduleIndex]?.monthlyWeekday}
                </div>
              </div>
            )}

            {/* Monthly Day Ordinal Selection - Show only after weekday is selected */}
            {schedule.recurringType === "monthly" &&
              schedule.monthlyWeekday && (
                <div className="relative mb-4">
                  <label className="block text-sm font-medium text-gray-600">
                    {t("selectOrdinal")} *
                  </label>
                  <select
                    name="dayOrdinal"
                    value={schedule.dayOrdinal || ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      setListingInput((prev) => {
                        const updatedSchedules = [...prev.recurringSchedules];
                        updatedSchedules[scheduleIndex] = {
                          ...updatedSchedules[scheduleIndex],
                          dayOrdinal: value,
                        };
                        return {
                          ...prev,
                          recurringSchedules: updatedSchedules,
                        };
                      });
                      // Clear error
                      setError((prevError) => {
                        const updatedErrors = [...prevError.recurringSchedules];
                        updatedErrors[scheduleIndex] = {
                          ...updatedErrors[scheduleIndex],
                          dayOrdinal: "",
                        };
                        return {
                          ...prevError,
                          recurringSchedules: updatedErrors,
                        };
                      });
                    }}
                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                  >
                    <option value="">{t("chooseOrdinal")}</option>
                    <option value="1">
                      {t("first")} (1st {t(schedule.monthlyWeekday)})
                    </option>
                    <option value="2">
                      {t("second")} (2nd {t(schedule.monthlyWeekday)})
                    </option>
                    <option value="3">
                      {t("third")} (3rd {t(schedule.monthlyWeekday)})
                    </option>
                    <option value="4">
                      {t("fourth")} (4th {t(schedule.monthlyWeekday)})
                    </option>
                    <option value="-1">
                      {t("last")} (Last {t(schedule.monthlyWeekday)})
                    </option>
                  </select>
                  <div
                    className="mt-2 text-sm text-red-600"
                    style={{
                      visibility: error?.recurringSchedules?.[scheduleIndex]
                        ?.dayOrdinal
                        ? "visible"
                        : "hidden",
                    }}
                  >
                    {error?.recurringSchedules?.[scheduleIndex]?.dayOrdinal}
                  </div>
                </div>
              )}

            {/* Date and Time Fields - Show when recurringType is selected */}
            {schedule.recurringType && (
              <div className="items-stretch py-2 space-y-4">
                {/* Start Date & Time and End Time in single row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <div className="flex absolute inset-y-0 items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-600 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      ></svg>
                    </div>
                    <FlatPickerCommponent
                      id={`startDate-${scheduleIndex}`}
                      name="startDate"
                      validateInput={validateInput}
                      setListingInput={(updateFn) => {
                        setListingInput((prev) => {
                          const updated =
                            typeof updateFn === "function"
                              ? updateFn(prev)
                              : updateFn;
                          const updatedSchedules = [...prev.recurringSchedules];
                          updatedSchedules[scheduleIndex] = {
                            ...updatedSchedules[scheduleIndex],
                            startDate: updated.startDate,
                            endDate:
                              updated.endDate || updated.recurringEndTime,
                            recurringEndTime: updated.recurringEndTime,
                          };
                          return {
                            ...prev,
                            recurringSchedules: updatedSchedules,
                          };
                        });
                      }}
                      setError={setError}
                      error={{
                        startDate:
                          error?.recurringSchedules?.[scheduleIndex]
                            ?.startDate || "",
                      }}
                      listingInput={{
                        startDate: schedule.startDate,
                        endDate: schedule.endDate,
                        recurringEndTime: schedule.recurringEndTime,
                        isRecurrence: true,
                        recurringType: schedule.recurringType,
                      }}
                      placeholder={t("eventStartDate")}
                      t={t}
                      minDate={null}
                      customOnChange={(date) => {
                        if (!date || date.length === 0 || !date[0]) {
                          return;
                        }

                        const formattedDate = format(
                          date[0],
                          "yyyy-MM-dd'T'HH:mm",
                        );

                        setListingInput((prev) => {
                          const updatedSchedules = [...prev.recurringSchedules];
                          const currentSchedule =
                            updatedSchedules[scheduleIndex];

                          // Set start date without auto-filling end time
                          updatedSchedules[scheduleIndex] = {
                            ...currentSchedule,
                            startDate: formattedDate,
                          };

                          return {
                            ...prev,
                            recurringSchedules: updatedSchedules,
                          };
                        });

                        // Clear errors when user is selecting a date
                        setError((prev) => {
                          const updatedErrors = [...prev.recurringSchedules];
                          updatedErrors[scheduleIndex] = {
                            ...updatedErrors[scheduleIndex],
                            startDate: "",
                            recurringEndTime: "",
                          };
                          return {
                            ...prev,
                            recurringSchedules: updatedErrors,
                          };
                        });
                      }}
                      customOnClose={(selectedDates, dateStr) => {
                        if (dateStr) {
                          validateInput({
                            target: {
                              name: "startDate",
                              value: dateStr.replace(" ", "T"),
                            },
                          });
                          // Also validate recurringEndTime if it exists
                          if (schedule.recurringEndTime) {
                            setTimeout(() => {
                              validateInput({
                                target: {
                                  name: "recurringEndTime",
                                  value: schedule.recurringEndTime,
                                },
                              });
                            }, 100);
                          }
                        }
                      }}
                    />
                  </div>

                  {/* End Date & Time */}
                  <div className="relative">
                    <div className="flex absolute inset-y-0 items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-600 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      ></svg>
                    </div>
                    <FlatPickerCommponent
                      id={`recurringEndTime-${scheduleIndex}`}
                      name="recurringEndTime"
                      validateInput={validateInput}
                      setListingInput={(updateFn) => {
                        setListingInput((prev) => {
                          const updated =
                            typeof updateFn === "function"
                              ? updateFn(prev)
                              : updateFn;
                          const updatedSchedules = [...prev.recurringSchedules];
                          updatedSchedules[scheduleIndex] = {
                            ...updatedSchedules[scheduleIndex],
                            endDate:
                              updated.recurringEndTime || updated.endDate,
                            recurringEndTime: updated.recurringEndTime,
                          };
                          return {
                            ...prev,
                            recurringSchedules: updatedSchedules,
                          };
                        });
                      }}
                      setError={setError}
                      error={{
                        recurringEndTime:
                          error?.recurringSchedules?.[scheduleIndex]
                            ?.recurringEndTime || "",
                      }}
                      listingInput={{
                        startDate: schedule.startDate,
                        endDate: schedule.endDate,
                        recurringEndTime: schedule.recurringEndTime,
                      }}
                      placeholder={t("eventEndTime")}
                      t={t}
                      minDate={null}
                      maxDate={null}
                      customOnChange={(date) => {
                        if (date && date.length > 0) {
                          const selectedDate = date[0];
                          const formattedDate = format(
                            selectedDate,
                            "yyyy-MM-dd'T'HH:mm",
                          );

                          setListingInput((prev) => {
                            const updatedSchedules = [
                              ...prev.recurringSchedules,
                            ];
                            updatedSchedules[scheduleIndex] = {
                              ...updatedSchedules[scheduleIndex],
                              endDate: formattedDate,
                              recurringEndTime: formattedDate,
                            };
                            return {
                              ...prev,
                              recurringSchedules: updatedSchedules,
                            };
                          });

                          // Validate that end time is after start time (only if start date exists)
                          let errorMessage = "";
                          if (schedule.startDate) {
                            const startDateTime = new Date(schedule.startDate);
                            if (selectedDate <= startDateTime) {
                              errorMessage = t(
                                "endTimeMustBeGreaterThanStartTime",
                              );
                            }
                          }

                          setError((prev) => {
                            const updatedErrors = [...prev.recurringSchedules];
                            updatedErrors[scheduleIndex] = {
                              ...updatedErrors[scheduleIndex],
                              recurringEndTime: errorMessage,
                            };
                            return {
                              ...prev,
                              recurringSchedules: updatedErrors,
                            };
                          });
                        }
                      }}
                      customOnClose={(selectedDates, dateStr) => {
                        if (dateStr && schedule.startDate) {
                          const endDateTime = new Date(
                            dateStr.replace(" ", "T"),
                          );
                          const startDateTime = new Date(schedule.startDate);

                          let errorMessage = "";

                          // Only check that end time is after start time
                          if (endDateTime <= startDateTime) {
                            errorMessage = t(
                              "endTimeMustBeGreaterThanStartTime",
                            );
                          }

                          setError((prev) => {
                            const updatedErrors = [...prev.recurringSchedules];
                            updatedErrors[scheduleIndex] = {
                              ...updatedErrors[scheduleIndex],
                              recurringEndTime: errorMessage,
                            };
                            return {
                              ...prev,
                              recurringSchedules: updatedErrors,
                            };
                          });
                        }
                      }}
                    />
                  </div>
                </div>

                {/* Repeat Until Date */}
                <div className="relative">
                  <FlatPickerCommponent
                    id={`repeatUntil-${scheduleIndex}`}
                    name="repeatUntil"
                    validateInput={validateInput}
                    setListingInput={(updateFn) => {
                      setListingInput((prev) => {
                        const updated =
                          typeof updateFn === "function"
                            ? updateFn(prev)
                            : updateFn;
                        const updatedSchedules = [...prev.recurringSchedules];
                        updatedSchedules[scheduleIndex] = {
                          ...updatedSchedules[scheduleIndex],
                          repeatUntil: updated.repeatUntil,
                        };
                        return {
                          ...prev,
                          recurringSchedules: updatedSchedules,
                        };
                      });
                    }}
                    setError={setError}
                    error={{
                      repeatUntil:
                        error?.recurringSchedules?.[scheduleIndex]
                          ?.repeatUntil || "",
                    }}
                    listingInput={{
                      startDate: schedule.startDate,
                      endDate: schedule.endDate,
                      recurringEndTime: schedule.recurringEndTime,
                      repeatUntil: schedule.repeatUntil,
                    }}
                    placeholder={t("repeatUntil")}
                    t={t}
                    minDate={null}
                    customOnChange={(date) => {
                      if (date && date.length > 0) {
                        const selectedDate = date[0];
                        const formattedDate = format(
                          selectedDate,
                          "yyyy-MM-dd'T'HH:mm",
                        );

                        setListingInput((prev) => {
                          const updatedSchedules = [...prev.recurringSchedules];
                          updatedSchedules[scheduleIndex] = {
                            ...updatedSchedules[scheduleIndex],
                            repeatUntil: formattedDate,
                          };
                          return {
                            ...prev,
                            recurringSchedules: updatedSchedules,
                          };
                        });

                        // Validate that repeat until is after start date
                        let errorMessage = "";
                        if (schedule.startDate) {
                          const startDateTime = new Date(schedule.startDate);
                          if (selectedDate <= startDateTime) {
                            errorMessage = t(
                              "repeatUntilMustBeGreaterThanStartDate",
                            );
                          }
                        }

                        setError((prev) => {
                          const updatedErrors = [...prev.recurringSchedules];
                          updatedErrors[scheduleIndex] = {
                            ...updatedErrors[scheduleIndex],
                            repeatUntil: errorMessage,
                          };
                          return {
                            ...prev,
                            recurringSchedules: updatedErrors,
                          };
                        });
                      }
                    }}
                  />
                </div>

                {/* Exception Dates - Only show if both start date and repeat until are set */}
                {schedule.startDate && schedule.repeatUntil && (
                  <div className="relative">
                    <label
                      htmlFor={`exceptionDates-${scheduleIndex}`}
                      className="block text-sm font-medium text-gray-600"
                    >
                      {t("exceptionDates")} ({t("optional")})
                    </label>
                    <Flatpickr
                      id={`exceptionDates-${scheduleIndex}`}
                      name="exceptionDates"
                      value={schedule.exceptionDates}
                      options={{
                        mode: "multiple",
                        dateFormat: "Y-m-d",
                        clickOpens: true,
                        allowInput: false,
                        minDate: format(
                          new Date(schedule.startDate),
                          "yyyy-MM-dd",
                        ),
                        maxDate: format(
                          new Date(schedule.repeatUntil),
                          "yyyy-MM-dd",
                        ),
                      }}
                      onChange={(dates) => {
                        const formattedDates = dates.map((date) =>
                          format(date, "yyyy-MM-dd"),
                        );
                        setListingInput((prev) => {
                          const updatedSchedules = [...prev.recurringSchedules];
                          updatedSchedules[scheduleIndex] = {
                            ...updatedSchedules[scheduleIndex],
                            exceptionDates: formattedDates,
                          };
                          return {
                            ...prev,
                            recurringSchedules: updatedSchedules,
                          };
                        });
                      }}
                      className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                      placeholder={t("selectExceptionDates")}
                    />
                    <div className="mt-1 text-xs text-gray-500">
                      {t("selectDatesToExcludeFromRecurring")} ({t("Between")}{" "}
                      {format(new Date(schedule.startDate), "MMM dd, yyyy")} -{" "}
                      {format(new Date(schedule.repeatUntil), "MMM dd, yyyy")})
                      - {t("startDateEndDateSelectable")}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

      {/* Add New Schedule Button */}
      {listingInput?.isRecurrence && (
        <div className="relative mb-4 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setListingInput((prev) => ({
                ...prev,
                recurringSchedules: [
                  ...prev.recurringSchedules,
                  {
                    recurringType: "",
                    recurringDays: [],
                    monthlyWeekday: "",
                    dayOrdinal: "",
                    interval: 1,
                    startDate: "",
                    endDate: "",
                    recurringEndTime: "",
                    repeatUntil: "",
                    exceptionDates: [],
                  },
                ],
              }));
              setError((prevError) => ({
                ...prevError,
                recurringSchedules: [
                  ...prevError.recurringSchedules,
                  {
                    recurringType: "",
                    recurringDays: "",
                    monthlyWeekday: "",
                    dayOrdinal: "",
                    interval: "",
                    startDate: "",
                    repeatUntil: "",
                    recurringEndTime: "",
                  },
                ],
              }));
            }}
            disabled={
              !isRecurringScheduleComplete(
                listingInput.recurringSchedules[
                listingInput.recurringSchedules.length - 1
                ],
                listingInput.recurringSchedules.length - 1,
              )
            }
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${isRecurringScheduleComplete(
              listingInput.recurringSchedules[
              listingInput.recurringSchedules.length - 1
              ],
              listingInput.recurringSchedules.length - 1,
            )
              ? "bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            title={
              !isRecurringScheduleComplete(
                listingInput.recurringSchedules[
                listingInput.recurringSchedules.length - 1
                ],
                listingInput.recurringSchedules.length - 1,
              )
                ? t("pleaseCompleteAllMandatoryFieldsBeforeAddingNewSchedule")
                : ""
            }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            {t("addAnotherRecurringSchedule")}
          </button>
        </div>
      )}
    </div>
  );
};

RecurringSchedule.propTypes = {
  listingInput: PropTypes.shape({
    isRecurrence: PropTypes.bool,
    recurringSchedules: PropTypes.arrayOf(
      PropTypes.shape({
        recurringType: PropTypes.string,
        recurringDays: PropTypes.arrayOf(PropTypes.string),
        monthlyWeekday: PropTypes.string,
        dayOrdinal: PropTypes.string,
        interval: PropTypes.number,
        startDate: PropTypes.string,
        endDate: PropTypes.string,
        recurringEndTime: PropTypes.string,
        repeatUntil: PropTypes.string,
        exceptionDates: PropTypes.arrayOf(PropTypes.string),
      }),
    ),
  }).isRequired,
  setListingInput: PropTypes.func.isRequired,
  error: PropTypes.shape({
    recurringSchedules: PropTypes.arrayOf(
      PropTypes.shape({
        recurringType: PropTypes.string,
        recurringDays: PropTypes.string,
        monthlyWeekday: PropTypes.string,
        dayOrdinal: PropTypes.string,
        interval: PropTypes.string,
        startDate: PropTypes.string,
        recurringEndTime: PropTypes.string,
        repeatUntil: PropTypes.string,
      }),
    ),
  }).isRequired,
  setError: PropTypes.func.isRequired,
  validateInput: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  isRecurringScheduleComplete: PropTypes.func.isRequired,
};

export default RecurringSchedule;
