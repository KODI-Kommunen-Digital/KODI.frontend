import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const ServiceAndTime = ({ newListing, appointmentInput, setAppointmentInput, appointmentError, setAppointmentError, daysOfWeek, initialTimeSlot }) => {

  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const [editServiceIndex, setEditServciceIndex] = useState();
  const [editAppointmentTime, setEditAppointmentTime] = useState(false)
  const [validNumberofServicesError, setValidNumberofServicesError] = useState("");

  const [isValidInput, setIsValidInput] = useState(true);
  const [isValidServiceCount, setIsValidServiceCount] = useState(true);

  const getErrorMessage = (name, value) => {
    switch (name) {
      case "startTime":
        if (!value.trim()) {
          return t("pleaseEnterStartTime");
        } else {
          return "";
        }

      case "endTime":
        if (!value.trim()) {
          return t("pleaseEnterEndTime");
        } else {
          return "";
        }

      case "name":
        if (!value.trim()) {
          return t("pleaseSelectServiceName");
        } else {
          return "";
        }

      case "duration":
        if (!value.trim()) {
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
      // setShowModal(true);
    }
  };

  const handleDoneButtonClick = () => {
    setShowModal(false);
    setEditAppointmentTime(false)
    setEditServciceIndex()
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

  // const onDurationUnitChange = (index, value) => {
  //   setAppointmentInput((prevInput) => ({
  //     ...prevInput,
  //     services: prevInput.services.map((service, i) =>
  //       i === index ? { ...service, durationUnit: value } : service
  //     ),
  //   }));
  // };

  const handleAddService = () => {
    setAppointmentInput((prevInput) => {
      const { services } = prevInput;
      const { maxBookingPerSlot } = 5;

      if (services.length >= maxBookingPerSlot) {
        setIsValidServiceCount(false);
        setValidNumberofServicesError(t("maximumNumOfService1") + maxBookingPerSlot + t("maximumNumOfService2"));
        return prevInput;
      }
      const newService = {
        name: "",
        duration: "",
        // durationUnit: "minutes",
        slotSameAsAppointment: false,
        metadata: {
          holidays: [],
          openingDates: daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [initialTimeSlot] }), {}),
          maxBookingPerSlot: 5, // Or you can adjust it according to your logic
        },
      };

      return {
        ...prevInput,
        services: [...services, newService],
      };
    });
  };

  const handleDeleteService = (indexToDelete) => {
    setAppointmentInput((prevInput) => ({
      ...prevInput,
      services: prevInput.services.filter((_, index) => index !== indexToDelete),
    }));
  };
  const [isCheckedList, setIsCheckedList] = useState(
    appointmentInput.services ? new Array(appointmentInput.services.length).fill(false) : []
  );

  const [isChecked, setIsChecked] = useState(
    appointmentInput.services ? new Array(appointmentInput.services.length).fill(false) : []
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
      console.log(currentService)

      if (updatedCheckedList[index]) {
        // If the checkbox is checked, populate openingDates
        updatedServices[index] = {
          ...currentService,
          slotSameAsAppointment: true,
          metadata: {
            ...currentService.metadata,
            openingDates: prevInput.metadata.openingDates,
          },
        };
      } else {
        // If the checkbox is unchecked, keep openingDates as it is
        updatedServices[index] = {
          ...currentService,
          slotSameAsAppointment: false,
          metadata: {
            ...currentService.metadata,
            openingDates: daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [initialTimeSlot] }), {}),
          },
        };
      }

      return {
        ...prevInput,
        // slotSameAsAppointment: false,
        services: updatedServices,
      };
    });
  };

  const handleTimeChange = (day, index, key, value, dayIndex) => {
    setAppointmentInput((prevInput) => {
      if (editAppointmentTime) {
        const updatedOpeningDates = {
          ...prevInput.metadata.openingDates,
          [day]: prevInput.metadata.openingDates[day].map((slot, i) =>
            i === dayIndex ? { ...slot, [key]: value } : slot
          ),
        };

        return {
          ...prevInput,
          metadata: {
            ...prevInput.metadata,
            openingDates: updatedOpeningDates,
          },
        };
      } else {
        const updatedServices = prevInput.services.map((service, i) => {
          if (i === editServiceIndex) {
            const updatedOpeningDates = {
              ...service.metadata.openingDates,
              [day]: service.metadata.openingDates[day].map((slot, j) =>
                j === dayIndex ? { ...slot, [key]: value } : slot
              ),
            };
            return {
              ...service,
              metadata: {
                ...service.metadata,
                openingDates: updatedOpeningDates,
              },
            };
          }
          return service;
        });

        return {
          ...prevInput,
          services: updatedServices,
        };
      }
    });
  };

  const handleAddTimeSlot = (day) => {
    setAppointmentInput((prevInput) => {
      const currentDaySchedule = prevInput.metadata.openingDates[day];

      if (!Array.isArray(currentDaySchedule)) {
        return prevInput;
      }

      if (editAppointmentTime) {
        const updatedOpeningDates = {
          ...prevInput.metadata.openingDates,
          [day]: [...currentDaySchedule, initialTimeSlot],
        };
        return {
          ...prevInput,
          metadata: {
            ...prevInput.metadata,
            openingDates: updatedOpeningDates,
          },
        };
      } else {
        const updatedServices = prevInput.services.map((service, index) => {
          if (index === editServiceIndex) {
            return {
              ...service,
              metadata: {
                ...service.metadata,
                openingDates: {
                  ...service.metadata.openingDates,
                  [day]: [...service.metadata.openingDates[day], initialTimeSlot],
                },
              },
            };
          } else {
            return service;
          }
        });

        return {
          ...prevInput,
          services: updatedServices,
        };
      }
    });
  };

  const handleDeleteTimeSlot = (day, index) => {
    setAppointmentInput((prevInput) => {
      const currentDaySchedule = prevInput.metadata.openingDates[day];

      if (!Array.isArray(currentDaySchedule)) {
        return prevInput;
      }
      if (editAppointmentTime) {
        return {
          ...prevInput,
          metadata: {
            ...prevInput.metadata,
            openingDates: {
              ...prevInput.metadata.openingDates,
              [day]: currentDaySchedule.filter((_, i) => i !== index),
            },
          },
        };
      } else {
        const updatedServices = prevInput.services.map((service) => ({
          ...service,
          metadata: {
            ...service.metadata,
            openingDates: {
              ...service.metadata.openingDates,
              [day]: service.metadata.openingDates[day].filter((_, i) => i !== index),
            },
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
    const updatedServices = appointmentInput.services.map(service => ({
      ...service,
      openingDates: daysOfWeek.reduce((acc, day) => {
        acc[day] = appointmentInput.metadata.openingDates[day].map(() => ({
          startTime: "",
          endTime: "",
        }));
        return acc;
      }, {}),
    }));

    setAppointmentInput(prevState => ({
      ...prevState,
      services: updatedServices,
    }));
  };
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
      {Array.isArray(appointmentInput.services) && appointmentInput.services.map((service, serviceIndex) => (
        <>
          <div
            key={serviceIndex}
            className="items-stretch py-2 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div className="relative mb-0">
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Service Name"
                value={service.name}
                onChange={(e) => onServiceChange(serviceIndex, 'name', e.target.value)}
                onBlur={(e) => validateInput(serviceIndex, e)}
                className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              />
              <div
                className="h-[24px] text-red-600"
                style={{
                  visibility: appointmentError[serviceIndex]?.name ? "visible" : "hidden",
                }}
              >
                {appointmentError[serviceIndex]?.name}
              </div>
            </div>

            <div className="relative mb-0">
              <div className="flex">
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  placeholder="Duration in min"
                  value={service.duration}
                  onChange={(e) => { onServiceChange(serviceIndex, 'duration', e.target.value); handleInputChange(e.target.value); }}
                  onBlur={(e) => validateInput(serviceIndex, e)}
                  className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />

                {/* <select
                  id="states"
                  name="durationUnit"
                  value={service.durationUnit}
                  className="shadow-md bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                  onChange={(e) => onDurationUnitChange(serviceIndex, e.target.value)}
                >
                  <option value="minutes">min</option>
                  <option value="seconds">sec</option>
                </select> */}
              </div>

              <div
                className="h-[24px] text-red-600"
                style={{
                  visibility: appointmentError[serviceIndex]?.duration ? "visible" : "hidden",
                }}
              >
                {appointmentError[serviceIndex]?.duration}
              </div>

              {!isValidInput && (
                <p className="text-red-600">{t("pleaseEnterValidNumber")}</p>
              )}
            </div>
            <button
              className={`w-full hidden md:inline-block bg-blue-800 mt-0 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl ${isChecked ? "disabled:opacity-60" : ""
                }`}
              onClick={() => {
                setShowModal(true)
                setEditServciceIndex(serviceIndex)
              }}
              disabled={isChecked[serviceIndex]}
            >
              {t("addtimeslot")}
            </button>

            <div className="flex justify-between md:hidden sm:inline-block">
              <p
                className={`font-bold text-blue-600 hover:underline cursor-pointer text-center${isChecked[serviceIndex] ? " text-green-600" : "text-blue-600"
                  }`}
                style={{ fontFamily: "Poppins, sans-serif" }}
                onClick={handleTextClick}
              >
                {isChecked[serviceIndex]
                  ? t("timeSlotsSetFromPrevious")
                  : t("addtimeslot")}
              </p>
              {serviceIndex > 0 && (
                <p
                  className="font-bold hover:underline cursor-pointer text-center"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    color: "red",
                  }}
                  onClick={() => handleDeleteService(serviceIndex)}
                >
                  {t("delete")}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDeleteService(serviceIndex)}
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
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden p-6 mx-4 my-8 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transform transition-all sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white p-4">
                      {/* <button
                        onClick={() => {
                          setShowModal(false)
                          setEditServciceIndex()
                          setEditAppointmentTime(false)
                          resetTimeSlots();
                        }}
                        className="absolute top-0 right-0 p-4 text-xl cursor-pointer"
                      >
                        &times;
                      </button> */}

                      {daysOfWeek.map((day) => (
                        <div key={day} className="mb-4">

                          {/* {JSON.stringify(appointmentInput.services[index].openingDates[day])} */}
                          {editAppointmentTime && appointmentInput.metadata && appointmentInput.metadata.openingDates[day].map((timeSlot, index) => (
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
                                      timeSlot.startTime ? timeSlot.startTime : "00:00"
                                    }
                                    onChange={(e) => { handleTimeChange(day, index, "startTime", e.target.value, index) }
                                    }
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
                                      timeSlot.endTime ? timeSlot.endTime : "00:00"
                                    }
                                    onChange={(e) => { handleTimeChange(day, index, "endTime", e.target.value, index) }
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

                          {!editAppointmentTime && appointmentInput.services[editServiceIndex].metadata.openingDates[day].map((timeSlot, index) => (
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
                                      timeSlot.startTime ? timeSlot.startTime : "00:00"
                                    }
                                    onChange={(e) => { handleTimeChange(day, serviceIndex, "startTime", e.target.value, index) }}
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
                                      timeSlot.endTime ? timeSlot.endTime : "00:00"
                                    }
                                    onChange={(e) => { handleTimeChange(day, serviceIndex, "endTime", e.target.value, index) }}
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                          onClick={handleDoneButtonClick}
                          className="w-full bg-black hover:bg-slate-600 text-white py-2 px-4 mt-4 ext-white font-bold py-2 px-4 rounded-xl"
                        >
                          {t("done")}
                        </button>

                        <button
                          onClick={() => {
                            setShowModal(false)
                            setEditServciceIndex()
                            setEditAppointmentTime(false)
                            resetTimeSlots();
                          }}
                          className="w-full bg-red-800 hover:bg-red-700 text-white py-2 px-4 mt-4 ext-white font-bold py-2 px-4 rounded-xl"
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div >

          <div className="flex gap-2 mt-4">
            <input
              type="checkbox"
              checked={isCheckedList[serviceIndex]}
              onChange={() => handleCheckboxChange(serviceIndex)}
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

      <div className="py-2 mt-1 px-2">
        <button
          onClick={handleAddService}
          className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
        >
          {t("addAnotherService")}
        </button>

        <div
          className="h-[24px] text-red-600"
        >
          {!isValidServiceCount && (
            <p >{t(validNumberofServicesError)}</p>
          )}
        </div>
      </div>
    </div >
  );
};

ServiceAndTime.propTypes = {
  newListing: PropTypes.object.isRequired,
  appointmentError: PropTypes.object.isRequired,
  appointmentInput: PropTypes.object.isRequired,
  setAppointmentError: PropTypes.func.isRequired,
  setAppointmentInput: PropTypes.func.isRequired,
  daysOfWeek: PropTypes.array.isRequired,
  initialTimeSlot: PropTypes.object.isRequired,
};

export default ServiceAndTime;
