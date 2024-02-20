import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../bodyContainer.css";
import { useTranslation } from "react-i18next";
import HomePageNavBar from "../../Components/HomePageNavBar";
import PROFILEIMAGE from "../../assets/ProfilePicture.png";
import "react-quill/dist/quill.snow.css";
import {
  getListingsById,
  postListingsData,
  updateListingsData,
} from "../../Services/listingsApi";
import Alert from "../../Components/Alert";
import { getCategory } from "../../Services/CategoryApi";
import dayjs from "dayjs";
import Footer from "../../Components/Footer";
import PropTypes from "prop-types";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import { generateDate, months } from "../../Components/util/calendar";
import cn from "../../Components/util/cn";

const Description = ({ content }) => {
  const linkify = (text) => {
    const urlRegex =
      /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])(?![^<]*<\/a>)/gi;
    text = text.replace(
      urlRegex,
      (url) =>
        `<a className="underline" href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`
    );

    // Regex for existing anchor tags
    const anchorTagRegex = /<a\s+href="([^"]+)"(.*?)>(.*?)<\/a>/gi;

    return text.replace(anchorTagRegex, (match, url, attributes, linkText) => {
      if (!/className="[^"]*underline[^"]*"/.test(attributes)) {
        // If 'className' attribute exists, append 'underline', otherwise add 'className="underline"'
        if (/className="/.test(attributes)) {
          return `<a href="${url}" ${attributes.replace(
            /className="/,
            'className="underline '
          )}>${linkText}</a>`;
        } else {
          return `<a href="${url}" className="underline" ${attributes}>${linkText}</a>`;
        }
      }
      return match;
    });
  };
  const linkedContent = linkify(content);
  return (
    <p
      className="leading-relaxed text-md font-medium my-0 text-gray-900 dark:text-gray-900"
      dangerouslySetInnerHTML={{ __html: linkedContent }}
    ></p>
  );
};

Description.propTypes = {
  content: PropTypes.string.isRequired,
};

function BookMyAppointments() {
  const { t } = useTranslation();
  const [listingId, setListingId] = useState(0);
  const [newBooking, setNewBooking] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [bookingId, setBookingId] = useState(false);
  const [categoryId, setCategoryId] = useState(0);
  const [, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  const [input, setInput] = useState({
    categoryId: 0,
    bookingId: 0,
    cityId: 0,
    statusId: 1,
    serviceId: 0,
    title: "",
    firstName: "",
    lastName: "",
    remarks: "",
    email: "",
    phone: "",
    service: "",
    logo: null,
  });

  const [error, setError] = useState({
    categoryId: "",
    bokingId: "",
    title: "",
    firstName: "",
    lastName: "",
    remarks: "",
    email: "",
    phone: "",
    service: "",
  });

  const handleSubmit = async (event) => {
    let valid = true;
    for (const key in error) {
      const errorMessage = getErrorMessage(key, input[key]);
      const newError = error;
      newError[key] = errorMessage;
      setError(newError);
      if (errorMessage) {
        valid = false;
      }
    }
    if (valid) {
      setUpdating(true);
      event.preventDefault();
      try {
        const response = await (newBooking
          ? postListingsData(bookingId, input)
          : updateListingsData(bookingId, input, listingId));
        if (newBooking) {
          setListingId(response.data.id);
        }
        setErrorMessage(false);
        setTimeout(() => {
          setSuccessMessage(false);
          navigate("/Dashboard");
        }, 5000);
      } catch (error) {
        setErrorMessage(t("changesNotSaved"));
        setSuccessMessage(false);
        setTimeout(() => setErrorMessage(false), 5000);
      }
      setUpdating(false);
    } else {
      setErrorMessage(t("invalidData"));
      setSuccessMessage(false);
      setTimeout(() => setErrorMessage(false), 5000);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const accessToken =
      window.localStorage.getItem("accessToken") ||
      window.sessionStorage.getItem("accessToken");
    const refreshToken =
      window.localStorage.getItem("refreshToken") ||
      window.sessionStorage.getItem("refreshToken");
    if (!accessToken && !refreshToken) {
      navigateTo("/login");
    }
    const bookingId = searchParams.get("bookingId");
    getCategory().then((response) => {
      const catList = {};
      response?.data.data.forEach((cat) => {
        catList[cat.id] = cat.name;
      });
      setCategories(catList);
    });
    setInput((prevInput) => ({ ...prevInput, categoryId }));
    setBookingId(bookingId);
    const listingId = searchParams.get("listingId");
    if (listingId && bookingId) {
      setListingId(parseInt(listingId));
      setNewBooking(false);
      getListingsById(bookingId, listingId).then((listingsResponse) => {
        const listingData = listingsResponse.data.data;
        listingData.bookingId = bookingId;
        setInput(listingData);
        setDescription(listingData.description);
        setCategoryId(listingData.categoryId);
        setBookingId(listingData.bookingId);
        setTitle(listingData.title);
        setCreatedAt(
          new Intl.DateTimeFormat("de-DE").format(
            Date.parse(listingData.createdAt)
          )
        );
      });
    }
  }, []);

  const onInputChange = (e) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: value,
    }));
    validateInput(name, value);
  };

  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const getErrorMessage = (name, value) => {
    switch (name) {
      case "title":
        if (!value) {
          return t("pleaseEnterTitle");
        } else {
          return "";
        }

      case "cityId":
        if (!parseInt(value)) {
          return t("pleaseSelectCity");
        } else {
          return "";
        }

      case "categoryId":
        if (!parseInt(value)) {
          return t("pleaseSelectCategory");
        } else {
          return "";
        }

      case "subCategoryId":
        if (!value && parseInt(input.categoryId) === 1) {
          return t("pleaseSelectSubcategory");
        } else {
          return "";
        }

      case "description":
        if (!value) {
          return t("pleaseEnterDescription");
        } else if (value.length > 65535) {
          return t("characterLimitReacehd");
        } else {
          return "";
        }

      case "startDate":
        if (!value && parseInt(input.categoryId) === 3) {
          return t("pleaseEnterStartDate");
        } else {
          return "";
        }

      case "endDate":
        if (parseInt(input.categoryId) === 3) {
          if (value && new Date(input.startDate) > new Date(value)) {
            return t("endDateBeforeStartDate");
          } else {
            return "";
          }
        } else {
          return "";
        }
      default:
        return "";
    }
  };

  const validateInput = (e) => {
    const { name, value } = e.target;
    const errorMessage = getErrorMessage(name, value);
    setError((prevState) => {
      return { ...prevState, [name]: errorMessage };
    });
  };

  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs();
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(currentDate);

  const [selectedTimes, setSelectedTimes] = useState([]);
  const [numberError, setNumberError] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [expandedUser, setExpandedUser] = useState(0); // Initially, no user is expanded

  const toggleUserDropdown = (index) => {
    setExpandedUser((prevIndex) => (prevIndex === index ? -1 : index)); // Toggle expanded user
  };

  const handleTimeSelection = (time) => {
    if (selectedTimes.length < 8) {
      setSelectedTimes([...selectedTimes, time]);
      setSelectedCount(selectedCount + 1);
      setNumberError(false);
    } else {
      setNumberError(true);
    }
  };

  const handleDeleteSlot = (index) => {
    const updatedTimes = [...selectedTimes];
    updatedTimes.splice(index, 1);
    setSelectedTimes(updatedTimes);
    setSelectedCount(selectedCount - 1);
    setNumberError(false);
  };

  return (
    <section className="text-gray-600 bg-white body-font">
      <HomePageNavBar />

      <div className="max-w-2xl gap-y-16 pt-24 pb-8 px-4 sm:px-6 sm:pt-32 sm:pb-8 lg:max-w-7xl lg:pt-24 lg:pb-4 mx-auto flex flex-col items-center">
        <div className="lg:w-full md:w-full h-full">
          <div className="md:grid md:gap-6 bg-white rounded-lg p-8 flex flex-col shadow-xl w-full">
            <div className="mt-5 md:col-span-2 md:mt-0">
              <form method="POST">
                <div className="text-center">
                  <h1 className="text-gray-900 mb-4 text-2xl md:text-3xl mt-4 lg:text-3xl title-font text-start font-bold overflow-hidden">
                    <span
                      className="inline-block max-w-full break-words"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {title}
                      Appointment Booking Du möchtest dein Haus energetisch
                      sanieren ?
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
                      Available time 30 min
                      {createdAt}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 justify-between mt-6">
                  <div>
                    <p
                      className="text-start font-bold"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                      }}
                    >
                      {t(categories[input.categoryId])}
                      Appointment Booking
                    </p>
                  </div>

                  <p
                    className="leading-relaxed text-base font-bold"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    Cost € 10.00
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="items-stretch py-2 px-0 w-full">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="col-span-1 sm:col-span-full mt-1 px-0 mr-2 w-full">
              <label
                htmlFor="country"
                className="block text-md font-medium text-gray-600"
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {t("select")}
              </label>
              <select
                id="service"
                name="service"
                value={input.service}
                onChange={onInputChange}
                onBlur={validateInput}
                required
                className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
              >
                <option value="" disabled>
                  {t("select")}
                </option>
                <option value="service1">Service 1</option>
                <option value="service2">Service 2</option>
                <option value="service3">Service 3</option>
                <option value="service4">Service 4</option>
              </select>
            </div>
            <div className="col-span-1 sm:col-span-full mt-1 px-0 mr-2 w-full">
              <label
                htmlFor="numberOfPeople"
                className="block text-md font-medium text-gray-600"
              >
                {t("numberofPeople")}
              </label>
              <select
                id="numberOfPeople"
                name="numberOfPeople"
                value={input.numberOfPeople}
                onChange={onInputChange}
                onBlur={validateInput}
                required
                className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
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
            </div>
          </div>
        </div>

        <div className="mx-auto w-full flex flex-col lg:flex-row mt-[2rem] gap-y-16 gap-x-8">
          <div className="lg:w-2/3">
            <div className="grid grid-cols-1 gap-4 col-span-2">
              <div className="bg-white col-span-2 p-0 rounded-lg w-full h-full shadow-xl">
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
                            className="select-none font-semibold cursor-pointer hover:scale-105 transition-all"
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

                      <div className="grid grid-cols-7 bg-black text-white rounded-lg">
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
                                key={index}
                                className="p-2 text-center h-14 grid place-content-center text-sm border-t"
                              >
                                <h1
                                  className={cn(
                                    currentMonth ? "" : "text-gray-400",
                                    today ? "bg-red-600 text-white" : "",
                                    selectDate.toDate().toDateString() ===
                                      date.toDate().toDateString()
                                      ? "bg-black text-white"
                                      : "",
                                    "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none"
                                  )}
                                  onClick={() => {
                                    setSelectDate(date);
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

          <div className="lg:w-1/3 mx-auto">
            <div className="grid grid-cols-1 gap-4">
              <div className="bg-white col-span-1 p-4 rounded-lg max-w-md w-full h-full shadow-xl scrollbar">
                <h1 className="text-lg text-center font-semibold mb-4">
                  {selectDate.toDate().toDateString()}
                </h1>
                <div className="time-selection-container overflow-y-auto max-h-[100px]">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {Array.from({ length: 24 * 2 }).map((_, index) => {
                      const time = dayjs()
                        .hour(8)
                        .minute(0)
                        .add(index * 60, "minutes");
                      return (
                        <div
                          key={index}
                          className={cn(
                            "p-2 rounded-full border cursor-pointer transition-all",
                            "hover:bg-gray-200",
                            "select-none",
                            selectedTimes.includes(time.format("HH:mm")) &&
                              "border-blue-400 text-blue-400"
                          )}
                          onClick={() =>
                            handleTimeSelection(time.format("HH:mm"))
                          }
                        >
                          {time.format("HH:mm")}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {numberError && (
                  <div className="text-red-500 text-center mt-2">
                    {t("timeSlotValidation")}
                  </div>
                )}
                <div className="mt-4">
                  <h2 className="text-lg text-center font-semibold mb-4">
                    {t("selectedSlots")}
                  </h2>
                  <ul className="mb-2 grid grid-cols-2 text-center gap-2">
                    {selectedTimes.map((time, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-center gap-2"
                      >
                        <span style={{ fontWeight: "bold" }}>{` ${
                          index + 1
                        }:`}</span>{" "}
                        {time}
                        <button
                          className="ml-0 text-red-500"
                          onClick={() => handleDeleteSlot(index)}
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

        {/* User details box */}
        <div className={`text-center gap-4 w-full`}>
          {Array.from({ length: selectedCount }, (_, index) => (
            <div key={index} className="mt-4">
              <div className="items-center justify-between border border-gray-300 rounded p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img
                      src={PROFILEIMAGE}
                      alt={`Profile Picture ${index}`}
                      className="mr-2 w-6 h-6 rounded-full object-cover"
                    />
                    <h2 className="text-lg font-medium mb-0">
                      User {index + 1}
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
                  className={`${
                    expandedUser === index ? "block" : "hidden"
                  } mt-4 p-4`}
                >
                  <input
                    type="text"
                    id={`firstName${index}`}
                    name={`firstName${index}`}
                    value={input.firstName}
                    onChange={onInputChange}
                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                    placeholder={t("firstname")}
                    required
                  />
                  <input
                    type="text"
                    id={`lastName${index}`}
                    name={`lastName${index}`}
                    value={input.lastName}
                    onChange={onInputChange}
                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md mt-2"
                    placeholder={t("lastname")}
                    required
                  />
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    value={input.phone}
                    onChange={onInputChange}
                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md mt-2"
                    placeholder={t("phonenumber")}
                  />
                  <input
                    type="email"
                    id={`email${index}`}
                    name={`email${index}`}
                    value={input.email}
                    onChange={onInputChange}
                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md mt-2"
                    placeholder={t("email")}
                    required
                  />
                  <input
                    type="text"
                    id={`remarks${index}`}
                    name={`remarks${index}`}
                    value={input.remarks}
                    onChange={onInputChange}
                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md mt-2"
                    placeholder={t("remarks")}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="relative max-w-2xl gap-y-16 px-5 py-2 lg:max-w-7xl mx-auto">
        <div className="py-2 mt-1 px-o">
          <button
            type="button"
            onClick={() => {
              handleSubmit();
              navigateTo(`/AppointmentBooking/BookAppointments/Summary`);
            }}
            disabled={updating}
            className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
          >
            {t("saveChanges")}
            {updating && (
              <svg
                aria-hidden="true"
                className="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
          </button>
        </div>
        <div className="py-2 mt-1 px-2">
          {successMessage && (
            <Alert type={"success"} message={successMessage} />
          )}
          {errorMessage && <Alert type={"danger"} message={errorMessage} />}
        </div>
      </div>

      <div className="bottom-0 w-full">
        <Footer />
      </div>
    </section>
  );
}

export default BookMyAppointments;
