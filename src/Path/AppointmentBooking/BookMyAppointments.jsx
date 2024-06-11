import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../bodyContainer.css";
import { useTranslation } from "react-i18next";
import HomePageNavBar from "../../Components/HomePageNavBar";
import PROFILEIMAGE from "../../assets/ProfilePicture.png";
import "react-quill/dist/quill.snow.css";
import { getAppointmentServices, getAppointmentSlots } from "../../Services/appointmentBookingApi";
import {
  getListingsById
} from "../../Services/listingsApi";
import { getProfile } from "../../Services/usersApi";
import { getCategory } from "../../Services/CategoryApi";
import dayjs from "dayjs";
import Footer from "../../Components/Footer";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { generateDate, months } from "../../Components/util/calendar";
import cn from "../../Components/util/cn";
import moment from "moment";
import Alert from "../../Components/Alert";

function BookMyAppointments() {
  const { t } = useTranslation();
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("___");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();


  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(currentDate);

  const [selectedTimes, setSelectedTimes] = useState([]);
  const [numberError, setNumberError] = useState(false);
  const [slotNotSelected, setSlotNotSelected] = useState(false);
  const [numberMismatchError, setNumberMismatchError] = useState(false);
  const [hasTimeSlots, setHasTimeSlots] = useState(false);
  const [timeSlotMinimumError, setTimeSlotMinimumError] = useState(false);
  const [cannotFillMore, setCannotFillMore] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [expandedUser, setExpandedUser] = useState(0); // Initially, no user is expanded
  const [user, setUser] = useState();
  const [serviceData, setServiceData] = useState([]);
  const [listingData, setListingData] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [, setAccessToken] = useState("");
  const [, setRefreshToken] = useState("");

  const [cityId, setCityId] = useState(0);
  const [listingId, setListingId] = useState(0);
  const [appointmentId, setAppointmentId] = useState(0);
  const [selectedServiceId, setSelectedServiceId] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");

  const todayDate = new Date().toISOString().slice(0, 10);
  const [bookingInput, setBookingInput] = useState({
    serviceId: "",
    numberOfPeople: "",
    endTime: "",
    startTime: "",
    remark: "",
    date: todayDate,
    friends: [],
    guestDetails: {
      firstname: "",
      lastname: "",
      email: ""
    }
  });

  const [bookingError, setBookingError] = useState({
    service: "",
    serviceId: "",
    numberOfPeople: "",
    firstname: "",
    lastname: "",
    email: "",
  });

  const handleButtonClick = () => {
    let isValid = true;
    const errors = {};

    if (!bookingInput.serviceId) {
      isValid = false;
      errors.service = t("pleaseEnterService");
      setErrorMessage(t("pleaseEnterService"));
    }

    if (!bookingInput.numberOfPeople) {
      isValid = false;
      errors.numberOfPeople = t("pleaseSelectNumberOfPeople");
      setErrorMessage(t("pleaseSelectNumberOfPeople"));
    }

    if (!bookingInput.startTime) {
      isValid = false;
      setSlotNotSelected(true);
      setErrorMessage(t("noSlotsAvailable"));
    }

    if (hasTimeSlots && !bookingInput.startTime) {
      isValid = false;
      setSlotNotSelected(true);
      setErrorMessage(t("pleaseSelectTimeSlotForAll"));
    }
    if (hasTimeSlots && parseInt(bookingInput.numberOfPeople) !== selectedCount) {
      isValid = false;
      setNumberMismatchError(true);
      setErrorMessage(t("numberOfPeopleAndSelectedSlotDifference"));
    }

    for (let index = 0; index < selectedCount; index++) {
      const firstName = index === 0
        ? (bookingInput.guestDetails?.firstname || user?.firstname || "")
        : (bookingInput?.friends[index - 1]?.firstname || "");
      const lastName = index === 0
        ? (bookingInput.guestDetails?.lastname || user?.lastname || "")
        : (bookingInput?.friends[index - 1]?.lastname || "");
      const email = index === 0
        ? (bookingInput.guestDetails?.email || user?.email || "")
        : (bookingInput?.friends[index - 1]?.email || "");

      if (!firstName.trim()) {
        isValid = false;
        errors[`firstname${index}`] = t("pleaseSelectFirstName");
        setErrorMessage(t("pleaseSelectFirstName"));
      }

      if (!lastName.trim()) {
        isValid = false;
        errors[`lastname${index}`] = t("pleaseSelectLastName");
        setErrorMessage(t("pleaseSelectLastName"));
      }

      if (!email.trim()) {
        isValid = false;
        errors[`email${index}`] = t("pleaseSelectEmail");
        setErrorMessage(t("pleaseSelectEmail"));
      }
    }

    // Update state with validation errors
    setBookingError(errors);

    if (isValid) {
      const { service, numberOfPeople, ...bookingData } = bookingInput;
      navigate(`/AppointmentBooking/BookAppointments/Summary?listingId=${listingId}&cityId=${cityId}&appointmentId=${appointmentId}`, { state: { bookingData } });
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const bookingId = searchParams.get("bookingId");
    getCategory().then((response) => {
      const catList = {};
      response?.data.data.forEach((cat) => {
        catList[cat.id] = cat.name;
      });
      setCategories(catList);
    });
    const cityId = searchParams.get("cityId");
    setCityId(cityId);
    const listingId = searchParams.get("listingId");
    setListingId(listingId);
    setBookingInput((prevInput) => ({ ...prevInput }));
    if (listingId && cityId) {
      getListingsById(cityId, listingId).then((listingsResponse) => {
        const listingData = listingsResponse.data.data;
        setListingData(listingData)
        listingData.cityId = cityId;
        listingData.bookingId = bookingId;
        setTitle(listingData.title);

        const appointmentId = listingData.appointmentId;
        setAppointmentId(appointmentId);
        const listingId = listingData.id
        if (appointmentId) {
          (async () => {
            try {
              const serviceResponse = await getAppointmentServices(cityId, listingId, appointmentId);
              const serviceData = serviceResponse.data.data;
              setServiceData(serviceData);
            } catch (error) {
              console.error("Error fetching appointment or services:", error);
            }
          })();
        }

        // const cityUserId = listingData.userId;
        const userId = localStorage.getItem('userId');
        const accessToken =
          window.localStorage.getItem("accessToken") ||
          window.sessionStorage.getItem("accessToken");
        setAccessToken(accessToken)
        const refreshToken =
          window.localStorage.getItem("refreshToken") ||
          window.sessionStorage.getItem("refreshToken");
        setRefreshToken(refreshToken)
        if (accessToken && refreshToken) {

          getProfile(userId).then((res) => {
            const user = res.data.data;
            setBookingInput((prevInput) => ({
              ...prevInput,
              guestDetails: {
                ...prevInput.guestDetails,
                firstname: user.firstname || "",
                lastname: user.lastname || "",
                email: user.email || "",
              }
            }));
            setUser(user);
          });
        }
      });
    }
  }, []);

  const onInputChange = (e, index) => {
    const { name, value } = e.target;

    if (name === "service" || name === "numberOfPeople") {
      if (index === 0) {
        setBookingInput(prevState => ({
          ...prevState,
          guestDetails: {
            ...prevState.guestDetails,
            [name]: value
          }
        }));
      } else {
        setBookingInput(prevState => ({
          ...prevState,
          [name]: value,
          friends: Array.from({ length: parseInt(value, 10) - 1 }, () => ({})) // According to the change in value the friends array changes, imporovements needed
        }));
      }

      if (selectedTimes.length < value) {
        setTimeSlotMinimumError(false);
      }
    } else {
      if (index === 0) {
        setBookingInput((prev) => ({
          ...prev,
          guestDetails: {
            ...prev.guestDetails,
            [name]: value,
          },
        }));
      } else {
        setBookingInput(prevState => ({
          ...prevState,
          friends: [
            ...prevState.friends.slice(0, index - 1),
            {
              ...prevState.friends[index - 1] || {},
              [name]: value
            },
            ...prevState.friends.slice(index)
          ]
        }));
      }
    }
    validateInput(name, value);
  };

  const handleRemarksChange = (e) => {
    const { name, value } = e.target;
    setBookingInput((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const getErrorMessage = (name, value) => {
    switch (name) {
      case "service":
        return value.trim() === "" ? t("pleaseEnterService") : "";
      case "timeSlot":
        return value.trim() === "" ? t("pleaseSelectTimeSlotForAll") : "";
      case "numberOfPeople":
        return value.trim() === "" ? t("pleaseSelectNumberOfPeople") : "";
      case "firstname":
        return value.trim() === "" ? t("pleaseSelectFirstName") : "";
      case "lastname":
        return value.trim() === "" ? t("pleaseSelectLastName") : "";
      case "phone":
        return value.trim() === "" ? t("pleaseSelectPhone") : "";
      case "email":
        return value.trim() === "" ? t("pleaseSelectEmail") : "";
      default:
        return "";
    }
  };

  const validateInput = (e, index) => {
    if (e && e.target) {
      const { name, value } = e.target;
      const errorMessage = getErrorMessage(name, value);
      setBookingError((prevState) => ({
        ...prevState,
        [name + index]: errorMessage // Append index to the error key
      }));
    }
  };

  const toggleUserDropdown = (index) => {
    setExpandedUser((prevIndex) => (prevIndex === index ? -1 : index));
  };

  const onServiceChange = (event) => {
    const selectedServiceId = event.target.value;
    setSelectedServiceId(selectedServiceId)

    const selectedService = serviceData.find(
      (service) => service.id === parseInt(selectedServiceId)
    );

    if (selectedService) {
      setDuration(selectedService.duration);
    }
    fetchTimeSlots(selectedServiceId);
  };

  const onDateChange = (date) => {
    setSelectDate(moment(date)); // Convert date to moment object here
    setBookingInput({
      ...bookingInput,
      date: moment(date).format("YYYY-MM-DD"),
    });
    fetchTimeSlots(selectedServiceId, moment(date).format("YYYY-MM-DD"));
  };

  const fetchTimeSlots = async (selectedServiceId, formattedDate) => {
    const serviceId = selectedServiceId;
    const date = formattedDate || todayDate;
    if (serviceId && date) {
      try {
        const timeSlotResponse = await getAppointmentSlots(
          cityId,
          listingId,
          appointmentId,
          date,
          serviceId
        );
        setTimeSlots(timeSlotResponse.data.data);

        if (timeSlotResponse.data.data && timeSlotResponse.data.data.length > 0) {
          setHasTimeSlots(true);
        } else {
          setHasTimeSlots(false);
        }
        setBookingInput(prevState => ({
          ...prevState,
          serviceId: serviceId
        }));
      } catch (error) {
        console.error("Error fetching time slots:", error);
      }
    }
  };

  const [, setSlotsLeftCount] = useState("");
  // const handleTimeSelection = (time, slotsLeft, slotIndex, index) => {
  //   console.log(slotIndex)
  //   console.log(index)
  //   if (bookingInput.numberOfPeople !== "" && selectedTimes.length < 8 && selectedTimes.length < bookingInput.numberOfPeople) {
  //     const startTime = time;
  //     const [startHour, startMinute] = time.split(':').map(Number);
  //     let endHour = startHour + Math.floor((startMinute + duration) / 60);
  //     let endMinute = (startMinute + duration) % 60;
  //     endHour = endHour.toString().padStart(2, '0');
  //     endMinute = endMinute.toString().padStart(2, '0');
  //     const endTime = `${endHour}:${endMinute}`;

  //     if (selectedTimes.length === 0) {
  //       setBookingInput((prevState) => ({
  //         ...prevState,
  //         startTime: startTime,
  //         endTime: endTime,
  //         // date: selectedDate,
  //       }));
  //     } else {
  //       if (selectedTimes.length === 1) {
  //         setBookingInput((prevState) => ({
  //           ...prevState,
  //           friends: [
  //             {
  //               startTime: startTime,
  //               endTime: endTime,
  //             },
  //           ],
  //         }));
  //       } else {
  //         setBookingInput((prevState) => ({
  //           ...prevState,
  //           friends: [
  //             ...prevState.friends,
  //             {
  //               startTime: startTime,
  //               endTime: endTime,
  //             },
  //           ],
  //         }));
  //       }
  //     }

  //     setSelectedTimes([...selectedTimes, time]);
  //     setSelectedCount(selectedCount + 1);

  //     if (
  //       timeSlots &&
  //       timeSlots.length > 0 &&
  //       timeSlots[index].openingHours &&
  //       timeSlots[index].openingHours[slotIndex] &&
  //       timeSlots[index].openingHours[slotIndex].availableSlot !== undefined
  //     ) {
  //       const updatedOpeningHours = [...timeSlots[index].openingHours];
  //       const SlotsLeftCount = updatedOpeningHours[slotIndex].availableSlot -= 1;
  //       setSlotsLeftCount(SlotsLeftCount);

  //       return {
  //         ...timeSlots[index],
  //         openingHours: updatedOpeningHours
  //       };
  //     }

  //     setNumberError(false);
  //   } else if (selectedTimes.length >= 8) {
  //     setNumberError(true);
  //     setTimeSlotMinimumError(false);
  //     setCannotFillMore(false);
  //   } else if (selectedTimes.length >= bookingInput.numberOfPeople || bookingInput.numberOfPeople === "") {
  //     setNumberError(false);
  //     setTimeSlotMinimumError(true);
  //     setCannotFillMore(false);
  //   } else if (selectedTimes.length >= timeSlots[index].openingHours[slotIndex].availableSlot) {
  //     setNumberError(false);
  //     setTimeSlotMinimumError(false);
  //     setCannotFillMore(true);
  //   }
  // };

  const handleTimeSelection = (time, slotsLeft, slotIndex, index) => {
    console.log(slotIndex);
    console.log(index);

    // Reset error states before performing checks
    setNumberError(false);
    setTimeSlotMinimumError(false);
    setCannotFillMore(false);

    if (bookingInput.numberOfPeople !== "" && selectedTimes.length < 8 && selectedTimes.length < bookingInput.numberOfPeople) {
      const startTime = time;
      const [startHour, startMinute] = time.split(':').map(Number);
      let endHour = startHour + Math.floor((startMinute + duration) / 60);
      let endMinute = (startMinute + duration) % 60;
      endHour = endHour.toString().padStart(2, '0');
      endMinute = endMinute.toString().padStart(2, '0');
      const endTime = `${endHour}:${endMinute}`;

      // Check if the selected time slot has enough available slots
      if (slotsLeft > 0) {
        if (selectedTimes.length === 0) {
          setBookingInput((prevState) => ({
            ...prevState,
            startTime: startTime,
            endTime: endTime,
            // date: selectedDate,
          }));
        } else {
          if (selectedTimes.length === 1) {
            setBookingInput((prevState) => ({
              ...prevState,
              friends: [
                {
                  startTime: startTime,
                  endTime: endTime,
                },
              ],
            }));
          } else {
            setBookingInput((prevState) => ({
              ...prevState,
              friends: [
                ...prevState.friends,
                {
                  startTime: startTime,
                  endTime: endTime,
                },
              ],
            }));
          }
        }

        setSelectedTimes([...selectedTimes, time]);
        setSelectedCount(selectedCount + 1);

        if (
          timeSlots &&
          timeSlots.length > 0 &&
          timeSlots[index].openingHours &&
          timeSlots[index].openingHours[slotIndex] &&
          timeSlots[index].openingHours[slotIndex].availableSlot !== undefined
        ) {
          const updatedOpeningHours = [...timeSlots[index].openingHours];
          updatedOpeningHours[slotIndex].availableSlot -= 1;
          setSlotsLeftCount(updatedOpeningHours[slotIndex].availableSlot);

          // Update the timeSlots state to reflect the decreased available slot
          const updatedTimeSlots = [...timeSlots];
          updatedTimeSlots[index].openingHours = updatedOpeningHours;
          setTimeSlots(updatedTimeSlots);

          return {
            ...timeSlots[index],
            openingHours: updatedOpeningHours,
          };
        }
      } else {
        setCannotFillMore(true);
      }
    } else if (selectedTimes.length >= 8) {
      setNumberError(true);
    } else if (selectedTimes.length >= bookingInput.numberOfPeople || bookingInput.numberOfPeople === "") {
      setTimeSlotMinimumError(true);
    }
  };

  timeSlots.map((slot, index) => (
    <div key={index} className="time-selection-container overflow-y-auto max-h-[100px]">
      <div className="flex flex-wrap gap-2 justify-center">
        {slot.openingHours.map((openingHour, slotIndex) => (
          <div key={slotIndex} onClick={() => handleTimeSelection(openingHour.startTime, openingHour.availableSlot, slotIndex, index)} className="bg-gray-100 text-slate-800 p-2 rounded-xl font-semibold cursor-pointer text-center">
            <p>{openingHour.startTime}</p>
            <p className="text-xs">{openingHour.availableSlot} slots left</p>
          </div>
        ))}
      </div>
    </div>
  ));

  const handleDeleteSlot = (slotIndex) => {
    const updatedTimes = [...selectedTimes];
    const timeToDelete = updatedTimes[slotIndex]
    timeSlots[0].openingHours.forEach((openingHour) => {
      if (openingHour.startTime === timeToDelete) {
        openingHour.availableSlot += 1
      }
    });
    updatedTimes.splice(slotIndex, 1);
    setTimeSlots(timeSlots);
    setSelectedTimes(updatedTimes);
    setSelectedCount(selectedCount - 1);
    setCannotFillMore(false);
    setNumberError(false);
  };

  return (
    <section className="text-slate-800 bg-gray-100 body-font">
      <HomePageNavBar />

      <div className="bg-gray-100 mx-auto w-full max-w-2xl gap-y-8 gap-x-8 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:pt-24 lg:pb-4">
        <div className="lg:w-full py-5 px-4 md:w-full h-full">
          <div className="md:grid md:gap-6 bg-gray-300 rounded-lg p-8 flex flex-col shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] w-full">
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form method="POST">
                <div className="text-center">
                  <h1 className="text-slate-800 mb-4 text-2xl md:text-3xl mt-4 lg:text-3xl title-font text-start font-bold overflow-hidden">
                    <span
                      className="inline-block max-w-full break-words"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {title}
                    </span>
                  </h1>
                </div>

                <div className="flex flex-wrap gap-1 justify-between mt-6">
                  <div className="flex items-center gap-2 mt-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      viewBox="0 0 512 512"
                      fill="#4299e1"
                    >
                      <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                    </svg>
                    <p
                      className="leading-relaxed text-base text-blue-400"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      Available time {duration} min
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 justify-between mt-6 text-slate-800">
                  <div>
                    <p
                      className="text-start font-bold"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {t(categories[listingData.categoryId])}
                    </p>
                  </div>

                  <p
                    className="leading-relaxed text-base font-bold text-slate-800"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    {t("costInEuros")}10.00
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="items-stretch py-5 px-4 px-4 w-full">
          {/* border-2 border-black  */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="col-span-1 sm:col-span-full mt-1 px-0 mr-2 w-full">
              <label
                htmlFor="country"
                className="block text-md font-medium text-slate-800"
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {t("select")} *
              </label>
              <select
                id="service"
                name="service"
                value={bookingInput.serviceId || ""}
                onChange={(event) => {
                  onInputChange(event);
                  onServiceChange(event);
                }}
                onBlur={validateInput}
                required
                className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-slate-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
              >
                <option value="" disabled>
                  {t("select")}
                </option>
                {serviceData.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
              <div
                className="h-[24px] text-red-600"
                style={{
                  visibility: bookingError.service ? "visible" : "hidden",
                }}
              >
                {bookingError.service}
              </div>
            </div>
            <div className="col-span-1 sm:col-span-full mt-1 px-0 mr-2 w-full">
              <label
                htmlFor="numberOfPeople"
                className="block text-md font-medium text-slate-800"
              >
                {t("numberofPeople")} *
              </label>
              <select
                id="numberOfPeople"
                name="numberOfPeople"
                value={bookingInput.numberOfPeople || ""}
                onChange={onInputChange}
                onBlur={validateInput}
                required
                className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-slate-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
              >
                <option value="" disabled>
                  {t("select")}
                </option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
              <div
                className="h-[24px] text-red-600"
                style={{
                  visibility: bookingError.numberOfPeople ? "visible" : "hidden",
                }}
              >
                {bookingError.numberOfPeople}
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full flex gap-y-8 lg:gap-y-0 py-5 px-4 flex-col lg:flex-row gap-x-8">
          <div className="lg:w-2/3 rounded-lg">
            <div className="grid grid-cols-1 gap-4 col-span-2">
              <div className="bg-gray-300 col-span-2 p-0 rounded-lg w-full h-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
                <div className="relative h-full mx-2 py-2 px-2 my-2">
                  <div className="flex justify-center items-center">
                    <div className="relative w-full h-full">
                      <div className="flex justify-center items-center mb-2">
                        <div className="flex gap-10 items-center">
                          <GrFormPrevious
                            className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                            onClick={() => {
                              setToday(today.month(today.month() - 1));
                            }}
                          />
                          <h1
                            className="select-none text-slate-800 font-semibold cursor-pointer hover:scale-105 transition-all font-bold"
                            onClick={() => {
                              setToday(currentDate);
                            }}
                          >
                            {months[today.month()]}, {today.year()}
                          </h1>
                          <GrFormNext
                            className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
                            onClick={() => {
                              setToday(today.month(today.month() + 1));
                            }}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-7 bg-black text-white rounded-lg font-bold">
                        {days.map((day, index) => {
                          return (
                            <h1
                              key={index}
                              className="p-2 text-center h-14 grid place-content-center text-sm"
                            >
                              {day}
                            </h1>
                          );
                        })}
                      </div>

                      <div className="grid grid-cols-7 ">
                        {generateDate(today.month(), today.year()).map(
                          ({ date, currentMonth, today }, index) => {
                            return (
                              <div
                                id="date"
                                name="date"
                                key={index}
                                className="p-2 text-center h-14 grid place-content-center text-sm font-bold"
                              >
                                <h1
                                  className={cn(
                                    currentMonth ? "text-slate-800" : "text-white",
                                    today ? "bg-red-600 text-slate-800" : "",
                                    selectDate.toDate().toDateString() ===
                                      date.toDate().toDateString()
                                      ? "bg-black text-white"
                                      : "",
                                    "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                                  )}
                                  onClick={() => {
                                    onDateChange(date.toDate());
                                  }}
                                >
                                  {date.date()}
                                </h1>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-2/3 lg:w-1/3 mx-auto">
            <div className="grid grid-cols-1 gap-4 col-span-1">
              <div className="bg-gray-300 mx-auto rounded-lg col-span-1 p-4 rounded-lg max-w-md w-full h-full shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] scrollbar">
                {/* border-2 border-black */}
                <h1 className="text-lg text-center text-slate-800 font-bold mb-4">
                  {selectDate.toDate().toDateString()}
                </h1>
                {!selectedServiceId ? (
                  <p className="h-[40px] text-emerald-500 text-center">{t("selectServiceMsg")}</p>
                ) : new Date(selectDate.toDate()).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0) ? (
                  <p className="h-[24px] text-red-600 text-center">{t("pastDate")}</p>
                ) : (
                  timeSlots.length === 0 ? (
                    <p className="h-[24px] text-red-600 text-center">{t("noSlotsAvailable")}</p>
                  ) : (
                    timeSlots.map((slot, index) => (
                      <div key={index} className="time-selection-container overflow-y-auto max-h-[100px]">
                        <div className="flex flex-wrap gap-2 justify-center">
                          {slot.openingHours.map((openingHour, slotIndex) => (
                            <div key={slotIndex} onClick={() => handleTimeSelection(openingHour.startTime, openingHour.availableSlot, slotIndex, index)} className="bg-gray-100 text-slate-800 p-2 rounded-xl font-semibold cursor-pointer text-center">
                              <p>{openingHour.startTime}</p>
                              <p className="text-xs">{selectedTimes.length === 0 ? openingHour.availableSlot : openingHour.availableSlot} {t("slotsLeft")}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )
                )}

                {numberError && (
                  <div className="text-red-600 text-center mt-2">
                    {t("timeSlotMaxValidation")}
                  </div>
                )}
                {timeSlotMinimumError && (
                  <div className="text-red-500 text-center mt-2">
                    {t("timeSlotNumberValidation")}
                  </div>
                )}
                {cannotFillMore && (
                  <div className="text-red-500 text-center mt-2">
                    {t("cannotFillMoreValidation")}
                  </div>
                )}
                {slotNotSelected && (
                  <div className="text-red-500 text-center mt-2">
                    {t("pleaseSelectTimeSlotForAll")}
                  </div>
                )}
                {numberMismatchError && (
                  <div className="text-red-500 text-center mt-2">
                    {t("numberOfPeopleAndSelectedSlotDifference")}
                  </div>
                )}


                <div className="my-4 bg-gray-100 h-[1px]"></div>

                <div className="mt-4">
                  <h2 className="text-lg text-slate-800 text-center font-bold mb-4">
                    {t("selectedSlots")}
                  </h2>
                  <ul className="mb-2 grid grid-cols-1 md:grid-cols-2 text-center gap-2">
                    {selectedTimes.map((time, slotIndex) => (
                      <li
                        key={slotIndex}
                        className="flex items-center justify-center gap-2"
                      >
                        <span style={{ fontWeight: "bold" }}>{` ${slotIndex + 1
                          }:`}</span>{" "}
                        <span className="p-2 rounded-full cursor-pointer bg-black font-bold text-slate-800">
                          {time}
                        </span>
                        <button
                          className="ml-0 text-red-600"
                          onClick={() => handleDeleteSlot(slotIndex)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User details box */}
      <div className="bg-gray-300">
        <div className="bg-gray-300 h-full h-full gap-y-8 items-center mt-14 py-5 xl:px-0 md:px-10 px-2 mx-auto max-w-2xl lg:max-w-7xl">
          <div className={`text-center w-full gap-y-8 lg:gap-y-0 py-5 px-4`}>
            {Array.from({ length: selectedCount }, (_, index) => (
              <div key={index} className="mt-4">
                <div className="bg-white items-center justify-between rounded-xl p-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <img
                        src={PROFILEIMAGE}
                        alt={`Profile Picture ${index}`}
                        className="mr-2 w-6 h-6 rounded-full object-cover"
                      />
                      <h2 className="text-lg font-medium mb-0">
                        {t("user")} {index + 1}
                      </h2>
                    </div>

                    <button
                      onClick={() => toggleUserDropdown(index)}
                      className="ml-2 text-blue-500 focus:outline-none text-2xl"
                    >
                      {expandedUser === index ? "▼" : "►"}
                    </button>
                  </div>

                  <div
                    className={`${expandedUser === index ? "block" : "hidden"
                      } mt-4 p-4`}
                  >

                    <div className="relative mb-0 grid grid-cols-2 gap-2">
                      <div className="relative mb-0">
                        <input
                          type="text"
                          id={`firstname`}
                          name={`firstname`}
                          value={
                            index === 0
                              ? (bookingInput.guestDetails?.firstname || user?.firstname || "")
                              : (bookingInput?.friends[index - 1]?.firstname || "")
                          }

                          onChange={(e) => onInputChange(e, index)}
                          onBlur={(e) => validateInput(e, index)}
                          className="w-full col-span-6 sm:col-span-1 bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-slate-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                          placeholder={t("firstname")}
                          required
                        />
                        <div
                          className="h-[24px] text-red-600 text-start"
                          style={{
                            visibility: bookingError[`firstname${index}`] ? "visible" : "hidden",
                          }}
                        >
                          {bookingError[`firstname${index}`]}
                        </div>
                      </div>

                      <div className="relative mb-0">
                        <input
                          type="text"
                          id={`lastname`}
                          name={`lastname`}
                          value={
                            index === 0
                              ? (bookingInput.guestDetails?.lastname || user?.lastname || "")
                              : (bookingInput?.friends[index - 1]?.lastname || "")
                          }
                          onChange={(e) => onInputChange(e, index)}
                          onBlur={(e) => validateInput(e, index)}
                          className="w-full col-span-6 sm:col-span-1 bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-slate-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md mt-0"
                          placeholder={t("lastname")}
                          required
                        />
                        <div
                          className="h-[24px] text-red-600 text-start"
                          style={{
                            visibility: bookingError[`lastname${index}`] ? "visible" : "hidden",
                          }}
                        >
                          {bookingError[`lastname${index}`]}
                        </div>
                      </div>
                    </div>

                    <input
                      type="email"
                      id={`email`}
                      name={`email`}
                      value={
                        index === 0
                          ? (bookingInput.guestDetails?.email || user?.email || "")
                          : (bookingInput?.friends[index - 1]?.email || "")
                      }
                      onChange={(e) => onInputChange(e, index)}
                      className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-slate-800 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md mt-2"
                      placeholder={t("email")}
                      onBlur={(e) => validateInput(e, index)}
                      required
                    />
                    <div
                      className="h-[24px] text-red-600 text-start"
                      style={{
                        visibility: bookingError[`email${index}`] ? "visible" : "hidden",
                      }}
                    >
                      {bookingError[`email${index}`]}
                    </div>

                  </div>
                </div>
              </div>
            ))}

            <div className="flex flex-col mt-4">
              <label className="mb-2 font-bold text-lg text-slate-800" htmlFor="comment">{t("remarks")}</label>
              <textarea
                rows="4"
                className="rounded-xl p-4 shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px]"
                id="comment"
                name="remark"
                value={bookingInput.remark}
                onChange={handleRemarksChange}
              ></textarea>
            </div>

          </div>
        </div>

        <div className="bg-gray-300 h-full items-center py-5 md:px-10 px-2 mx-auto max-w-screen-lg lg:mx-20 xl:mx-auto">
          <div className="py-2 mt-1 px-0">
            <a
              onClick={handleButtonClick}
              className="bg-black relative w-full inline-flex items-center justify-center p-4 px-6 py-3 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-black rounded-full shadow-md group cursor-pointer">
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-black duration-300 -translate-x-full bg-white group-hover:translate-x-0 ease">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-white transition-all duration-300 transform group-hover:translate-x-full ease">{t("saveChanges")}</span>
              <span className="relative invisible">
                {t("saveChanges")}
              </span>
            </a>
          </div>

          <div className="py-2 mt-1 px-2">
            {errorMessage && <Alert type={"danger"} message={errorMessage} />}
          </div>
        </div>
      </div>

      <div className="bottom-0 w-full">
        <Footer />
      </div>
    </section >
  );
}

export default BookMyAppointments;