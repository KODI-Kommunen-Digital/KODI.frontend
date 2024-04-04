import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const ServiceAndTime = () => {

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const initialTimeSlot = { startTime: "", endTime: "" };

  const [appointmentInput, setAppointmentInput] = useState({
    openingDates: daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [initialTimeSlot] }), {}),
    services: [{ name: "", duration: "", durationUnit: "minutes", slotSameAsAppointment: false, openingDates: daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [initialTimeSlot] }), {}) }],
  });

  const [appointmentError, setAppointmentError] = useState({
    name: "",
    duration: "",
    endTime: "",
    startTime: "",
  });

  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [editAppointmentTime, setEditAppointmentTime] = useState(false)

  const [isValidInput, setIsValidInput] = useState(true);

  const getErrorMessage = (name, value) => {
    switch (name) {
      case "startTime":
        if (!parseInt(value)) {
          return t("pleaseEnterStartTime");
        } else {
          return "";
        }

      case "endTime":
        if (!parseInt(value)) {
          return t("pleaseEnterEndTime");
        } else {
          return "";
        }

      case "name":
        if (!parseInt(value)) {
          return t("pleaseSelectServiceName");
        } else {
          return "";
        }

      case "duration":
        if (!parseInt(value)) {
          return t("pleaseSelectDuration");
        } else {
          return "";
        }
      default:
        return "";
    }
  };

  const validateInput = (index, e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      const errorMessage = getErrorMessage(name, value);
      setAppointmentError((prevState) => ({
        ...prevState,
        [index]: {
          ...prevState[index],
          [name]: errorMessage
        }
      }));
    }
  };

  const handleInputChange = (value) => {
    const input = value;
    if (/^\d*$/.test(input)) {
      setIsValidInput(true); // Input is valid
    } else {
      setIsValidInput(false); // Input is not valid
    }
  };

  const handleTextClick = () => {
    if (!isChecked.some((checked) => checked)) {
      setShowModal(true);
    }
  };

  const handleDoneButtonClick = () => {
    setShowModal(false);
    setEditAppointmentTime(false)
  };

  // Appointment starts
  const onServiceChange = (index, key, value) => {
    setAppointmentInput((prevInput) => ({
      ...prevInput,
      services: prevInput.services.map((service, i) =>
        i === index ? { ...service, [key]: value } : service
      ),
    }));
  };

  const onDurationUnitChange = (index, value) => {
    setAppointmentInput((prevInput) => ({
      ...prevInput,
      services: prevInput.services.map((service, i) =>
        i === index ? { ...service, durationUnit: value } : service
      ),
    }));
  };

  const handleAddService = () => {
    setAppointmentInput((prevInput) => ({
      ...prevInput,
      services: [
        ...prevInput.services,
        {
          name: "",
          duration: "",
          durationUnit: "minutes",
          openingDates: daysOfWeek.reduce(
            (acc, day) => ({ ...acc, [day]: [initialTimeSlot] }),
            {}
          ),
        },
      ],
    }));
  };

  const handleDeleteService = (indexToDelete) => {
    setAppointmentInput((prevInput) => ({
      ...prevInput,
      services: prevInput.services.filter((_, index) => index !== indexToDelete),
    }));
  };
  const [isCheckedList, setIsCheckedList] = useState(
    new Array(appointmentInput.services.length).fill(false)
  );
  const [isChecked, setIsChecked] = useState(
    new Array(appointmentInput.services.length).fill(false)
  );

  const handleCheckboxChange = (index) => {
    const updatedCheckedList = [...isCheckedList];
    updatedCheckedList[index] = !updatedCheckedList[index];
    setIsCheckedList(updatedCheckedList);

    const updatedButtonDisabledList = [...isChecked];
    updatedButtonDisabledList[index] = !updatedButtonDisabledList[index];
    setIsChecked(updatedButtonDisabledList);

    setAppointmentInput((prevInput) => {
      const { services } = prevInput;
      const updatedServices = [...services];
      const currentService = updatedServices[index];

      if (updatedCheckedList[index]) {
        // If the checkbox is checked, populate openingDates
        updatedServices[index] = {
          ...currentService,
          openingDates: prevInput.openingDates,
        };
      } else {
        // If the checkbox is unchecked, keep openingDates as it is
        updatedServices[index] = {
          ...currentService,
        };
      }

      return {
        ...prevInput,
        slotSameAsAppointment: false,
        services: updatedServices,
      };
    });
  };

  const handleTimeChange = (day, index, key, value) => {
    console.log("Value received:", value);
    setAppointmentInput((prevInput) => {
      if (editAppointmentTime) {
        const updatedOpeningDates = {
          ...prevInput.openingDates,
          [day]: prevInput.openingDates[day].map((slot, i) =>
            i === index ? { ...slot, [key]: value } : slot
          ),
        };

        return {
          ...prevInput,
          openingDates: updatedOpeningDates,
        };
      } else {
        const updatedOpeningDates = {
          ...prevInput.services[index].openingDates,
          [day]: prevInput.services[index].openingDates[day].map((slot, i) =>
            i === index ? { ...slot, [key]: value } : slot
          ),
        };

        const updatedServices = prevInput.services
        updatedServices[index].openingDates = updatedOpeningDates
        return {
          ...prevInput,
          services: updatedServices
        };
      }
    });
  };

  const handleAddTimeSlot = (day) => {
    setAppointmentInput((prevInput) => {
      const currentDaySchedule = prevInput.openingDates[day];

      if (!Array.isArray(currentDaySchedule)) {
        return prevInput;
      }

      if (editAppointmentTime) {
        const updatedOpeningDates = {
          ...prevInput.openingDates,
          [day]: [...currentDaySchedule, initialTimeSlot],
        };
        return {
          ...prevInput,
          openingDates: updatedOpeningDates,
        };
      } else {
        const updatedServices = prevInput.services.map((service) => ({
          ...service,
          openingDates: {
            ...service.openingDates,
            [day]: [...service.openingDates[day], initialTimeSlot],
          },
        }));

        return {
          ...prevInput,
          services: updatedServices,
        };
      }
    });
  };

  const handleDeleteTimeSlot = (day, index) => {
    setAppointmentInput((prevInput) => {
      const currentDaySchedule = prevInput.openingDates[day];
      if (!Array.isArray(currentDaySchedule)) {
        return prevInput;
      }
      if (editAppointmentTime) {
        return {
          ...prevInput,
          openingDates: {
            ...prevInput.openingDates,
            [day]: currentDaySchedule.filter((_, i) => i !== index),
          },
        };
      } else {
        const updatedServices = prevInput.services.map((service) => ({
          ...service,
          openingDates: {
            ...service.openingDates,
            [day]: service.openingDates[day].filter((_, i) => i !== index),
          },
        }));

        return {
          ...prevInput,
          services: updatedServices,
        };
      }
    });
  };

  const resetTimeSlots = () => {
    const updatedOpeningDates = daysOfWeek.reduce((acc, day) => {
      acc[day] = appointmentInput.openingDates[day].map(() => ({
        startTime: "",
        endTime: "",
      }));
      return acc;
    }, {});

    setAppointmentInput(prevState => ({
      ...prevState,
      openingDates: updatedOpeningDates,
    }));
  };

  // function formatDateTime(dateTime) {
  //   console.log("DateTime received:", dateTime);
  //   const date = new Date(dateTime.replace("Z", ""));
  //   const hours = String(date.getHours()).padStart(2, "0");
  //   const minutes = String(date.getMinutes()).padStart(2, "0");

  //   return `${hours}:${minutes}`;
  // }
  // Appointment ends

  return (
    <div className="flex flex-col justify-center">
      <button
        className="w-full bg-black mb-4 hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
        onClick={() => {
          setShowModal(true)
          setEditAppointmentTime(true)
        }}
      >
        {t("addtimeslot")}
      </button>

      <label
        htmlFor="address"
        className="block text-sm mt-4 font-medium text-gray-600"
      >
        {t("addService")} *
      </label>
      {appointmentInput.services.map((service, index) => (
        <>
          <div
            key={index}
            className="items-stretch py-2 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="relative mb-4">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Service Name"
                value={service.name}
                onChange={(e) => onServiceChange(index, 'name', e.target.value)}
                onBlur={(e) => validateInput(index, e)}
                className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
              <div
                className="h-[24px] text-red-600"
                style={{
                  visibility: appointmentError[index]?.name ? "visible" : "hidden",
                }}
              >
                {appointmentError[index]?.name}
              </div>
            </div>

            <div className="relative mb-4">
              <div className="flex">
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  placeholder="Duration"
                  value={service.duration}
                  onChange={(e) => { onServiceChange(index, 'duration', e.target.value); handleInputChange(e.target.value); }}
                  onBlur={(e) => validateInput(index, e)}
                  className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />

                <select
                  id="states"
                  name="durationUnit"
                  value={service.durationUnit}
                  className="shadow-md bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  onChange={(e) => onDurationUnitChange(index, e.target.value)}
                >
                  <option value="minutes">min</option>
                  <option value="seconds">sec</option>
                </select>
              </div>

              <div
                className="h-[24px] text-red-600"
                style={{
                  visibility: appointmentError[index]?.duration ? "visible" : "hidden",
                }}
              >
                {appointmentError[index]?.duration}
              </div>

              {!isValidInput && (
                <p className="text-red-600">{t("pleaseEnterValidNumber")}</p>
              )}
            </div>

            <button
              className={`w-full hidden md:inline-block bg-blue-800 mt-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl ${isChecked ? "disabled:opacity-60" : ""
                }`}
              onClick={() => setShowModal(true)}
              disabled={isChecked[index]}
            >
              {t("addtimeslot")}
            </button>

            <div className="flex justify-between md:hidden sm:inline-block">
              <p
                className={`font-bold text-blue-600 hover:underline cursor-pointer text-center${isChecked[index] ? " text-green-600" : "text-blue-600"
                  }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
                onClick={handleTextClick}
              >
                {isChecked[index]
                  ? t("timeSlotsSetFromPrevious")
                  : t("addtimeslot")}
              </p>
              {index > 0 && (
                <p
                  className="font-bold hover:underline cursor-pointer text-center"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "red",
                  }}
                  onClick={() => handleDeleteService(index)}
                >
                  {t("delete")}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDeleteService(index)}
              className="w-full hidden md:inline-block bg-red-800 mt-0 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-xl"
            >
              {t("delete")}
            </button>
            {showModal && (
              <div className="fixed z-50 inset-0 overflow-y-auto">
                <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                  <div
                    className="fixed inset-0 transition-opacity"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                  </div>
                  <span
                    className="hidden sm:inline-block sm:align-middle sm:h-screen"
                    aria-hidden="true"
                  >
                    &#8203;
                  </span>
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden p-6 mx-4 my-8 shadow-xl transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white p-4">
                      <button
                        onClick={() => {
                          setShowModal(false)
                          setEditAppointmentTime(false)
                          resetTimeSlots();
                        }}
                        className="absolute top-0 right-0 p-4 text-xl cursor-pointer"
                      >
                        &times;
                      </button>


                      {/* {!isValidTime && (
                        <p className="text-red-600">{t("pleaseEnterValidTime")}</p>
                      )} */}

                      {daysOfWeek.map((day) => (
                        <div key={day} className="mb-4">

                          {/* {JSON.stringify(appointmentInput.services[index].openingDates[day])} */}
                          {editAppointmentTime && appointmentInput.openingDates[day].map((timeSlot, index) => (
                            <div
                              key={index}
                              className="flex flex-col space-y-4 space-x-2 sm:flex-row sm:space-y-0 sm:items-center mt-2"
                            >
                              <div
                                className="flex space-x-2 items-center mt-0"
                                style={{ width: "100px" }}
                              >
                                <h2 className="relative text-base font-medium mt-1 mr-3">{day}</h2>
                              </div>
                              <div className="flex space-x-2 mt-0 items-center">
                                <div className="relative">
                                  <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    // value={timeSlot.startTime}
                                    value={
                                      timeSlot.startTime ? timeSlot.startTime : ""
                                    }
                                    onChange={(e) => { handleTimeChange(day, index, "startTime", e.target.value) }
                                    }
                                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                                    placeholder="HH:mm"
                                  />
                                  {console.log(timeSlot)}
                                </div>
                                <span className="relative text-gray-500"> - </span>
                                <div className="relative">
                                  <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    // value={timeSlot.endTime}
                                    value={
                                      timeSlot.endTime ? timeSlot.endTime : ""
                                    }
                                    onChange={(e) => { handleTimeChange(day, index, "endTime", e.target.value) }
                                    }
                                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                                    placeholder="HH:mm"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-between md:space-x-2 items-center">
                                <div className="relative">
                                  <svg
                                    onClick={() => handleAddTimeSlot(day)}
                                    className="mt-1 w-6 h-6 text-blue-800 cursor-pointer"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />{" "}
                                    <line x1="12" y1="8" x2="12" y2="16" />{" "}
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                  </svg>
                                </div>
                                {index > 0 && (
                                  <div className="relative">
                                    <svg
                                      onClick={() => handleDeleteTimeSlot(day, index)}
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-5 h-5 mt-1"
                                      viewBox="0 0 512 512"
                                    >
                                      <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}

                          {!editAppointmentTime && appointmentInput.services[index].openingDates[day].map((timeSlot, index) => (
                            <div
                              key={index}
                              className="flex flex-col space-y-4 space-x-2 sm:flex-row sm:space-y-0 sm:items-center mt-2"
                            >
                              <div
                                className="flex space-x-2 items-center mt-0"
                                style={{ width: "100px" }}
                              >
                                <h2 className="relative text-base font-medium mt-1 mr-3">{day}</h2>
                              </div>
                              <div className="flex space-x-2 mt-0 items-center">
                                <div className="relative">
                                  <input
                                    type="time"
                                    id="startTime"
                                    name="startTime"
                                    value={
                                      timeSlot.startTime ? timeSlot.startTime : ""
                                    }
                                    onChange={(e) => { handleTimeChange(day, index, "startTime", e.target.value) }}
                                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                                    placeholder="HH:mm"
                                  />
                                </div>
                                <span className="relative text-gray-500"> - </span>
                                <div className="relative">
                                  <input
                                    type="time"
                                    id="endTime"
                                    name="endTime"
                                    value={
                                      timeSlot.endTime ? timeSlot.startTime : ""
                                    }
                                    onChange={(e) => { handleTimeChange(day, index, "endTime", e.target.value) }}
                                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                                    placeholder="HH:mm"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-between md:space-x-2 items-center">
                                <div className="relative">
                                  <svg
                                    onClick={() => handleAddTimeSlot(day)}
                                    className="mt-1 w-6 h-6 text-blue-800 cursor-pointer"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />{" "}
                                    <line x1="12" y1="8" x2="12" y2="16" />{" "}
                                    <line x1="8" y1="12" x2="16" y2="12" />
                                  </svg>
                                </div>
                                {index > 0 && (
                                  <div className="relative">
                                    <svg
                                      onClick={() => handleDeleteTimeSlot(day, index)}
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-5 h-5 mt-1"
                                      viewBox="0 0 512 512"
                                    >
                                      <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                                    </svg>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                          <div className="my-4 bg-gray-200 h-[1px]"></div>
                        </div>
                      ))}

                      <button
                        onClick={handleDoneButtonClick}
                        className="w-full bg-black hover:bg-slate-600  text-white py-2 px-4 mt-4 rounded-md"
                      >
                        {t("done")}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div >

          <div className="flex gap-2 mt-4">
            <input
              type="checkbox"
              checked={isCheckedList[index]}
              onChange={() => handleCheckboxChange(index)}
            />
            <label
              htmlFor="disableDates"
              className="block text-sm font-medium text-gray-600"
            >
              {t("useProvidedTimeSlots")}
            </label>
          </div>
        </>
      ))
      }

      <button
        onClick={handleAddService}
        className="w-full bg-black mt-4 bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
      >
        {t("addAnotherService")}
      </button>
    </div >
  );
};

export default ServiceAndTime;
