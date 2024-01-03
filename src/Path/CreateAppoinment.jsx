import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import Calendar from "../Components/Calendar";
import { useTranslation } from "react-i18next";
import Alert from "../Components/Alert";

function CreateAppointment() {
  const { t } = useTranslation();
  const [service, selectService] = useState([{ title: "", duration: "15" }]);
  const [time, setTime] = useState([{ title: "", duration: "" }]);
  const [alert, setAlert] = useState("");
  const [successMessage] = useState("");
  const [errorMessage] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    document.title =
      process.env.REACT_APP_REGION_NAME + " " + t("createAppointment");
  }, [t]);

  const handleChangeService = (e, index) => {
    const { name, value } = e.target;
    selectService((prevService) => {
      const updatedService = [...prevService];
      updatedService[index] = { ...updatedService[index], [name]: value };
      return updatedService;
    });
  };

  const handleDeleteService = (index) => {
    selectService((prevService) => prevService.filter((_, i) => i !== index));
  };

  const handleAddService = () => {
    if (service.length === 0 || service[service.length - 1].title !== "") {
      selectService([...service, { title: "", duration: "15" }]);
    } else {
      setAlert("Please fill in the title before adding another service.");
    }
  };

  // For Time
  const handleChangeTime = (e, index) => {
    const { name, value } = e.target;
    setTime((prevTime) => {
      const updatedTime = [...prevTime];
      updatedTime[index] = { ...updatedTime[index], [name]: value };
      return updatedTime;
    });
  };

//   const handleDeleteTime = (index) => {
//     setTime((prevTime) => prevTime.filter((_, i) => i !== index));
//   };

  const handleAddTime = () => {
    if (time.length === 0 || time[time.length - 1].title !== "") {
      setTime([...time, { title: "", duration: "15" }]);
    } else {
      setAlert("Please fill in the title before adding another time slot.");
    }
  };

  const handleClick = () => {
    setShowCalendar(!showCalendar);
  };

  return (
    <section className="bg-slate-600 body-font relative h-screen">
      <SideBar />

      <div className="container w-auto px-5 py-2 bg-slate-600">
        <div className="bg-white mt-4 p-6 space-y-10">
          <div className="relative mb-4">
            <div className="relative mb-4 mt-2 border-white">
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
                className="text-gray-900 text-lg mb-4 font-medium title-font"
              >
                {t("addService")}
                <div className="my-4 bg-gray-600 h-[1px]"></div>
              </h2>
              {service &&
                service.length > 0 &&
                service.map((data, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  >
                    <div className="mt-1 px-0 ml-2">
                      <label
                        htmlFor={`title`}
                        className="block text-md font-medium text-gray-600"
                      >
                        {t("addServiceName")}
                      </label>
                      <input
                        type="text"
                        id={`title`}
                        name={`title`}
                        value={data.title}
                        onChange={(e) => handleChangeService(e, i)}
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        placeholder="ainfo@heidi-app.de"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      />
                    </div>

                    <div className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                      <label
                        htmlFor={`duration`}
                        className="block text-md font-medium text-gray-600"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                        }}
                      >
                        {t("duration")}
                      </label>
                      <select
                        id={`duration`}
                        name={`duration`}
                        value={data.duration}
                        onChange={(e) => handleChangeService(e, i)}
                        className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                      >
                        <option value="15">15 min</option>
                        <option value="30">30 min</option>
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                        <option value="75">75 min</option>
                        <option value="90">90 min</option>
                      </select>
                    </div>

                    <div className="flex ml-2 mt-8">
                      <button onClick={() => handleDeleteService(i)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          viewBox="0 0 512 512"
                        >
                          <path d="M135.2 17.7C140.6 6.8 151.7 0 163.8 0H284.2c12.1 0 23.2 6.8 28.6 17.7L320 32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H32C14.3 96 0 81.7 0 64S14.3 32 32 32h96l7.2-14.3zM32 128H416V448c0 35.3-28.7 64-64 64H96c-35.3 0-64-28.7-64-64V128zm96 64c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16zm96 0c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16s16-7.2 16-16V208c0-8.8-7.2-16-16-16z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              {alert && (
                <div
                  className="mt-4 mb-10 md:mb-4 h-[24px] text-red-600"
                  style={{
                    visibility: alert ? "visible" : "hidden",
                  }}
                >
                  {alert}
                </div>
              )}
              <button
                className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded"
                onClick={handleAddService}
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {t("adAnotherAppoinment")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container w-auto px-5 py-2 bg-slate-600">
        <div className="bg-white mt-4 p-6 space-y-10">
          <div className="relative mb-4">
            <div className="relative mb-4 mt-2 border-white">
              <h2
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
                className="text-gray-900 text-lg mb-4 font-medium title-font"
              >
                {t("timeSlots")}
                <div className="my-4 bg-gray-600 h-[1px]"></div>
              </h2>
              {time &&
                time.length > 0 &&
                time.map((data, i) => (
                  <>
                    <div
                      key={i}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    >
                      <div className="mt-1 px-0 ml-2">
                        <label
                          htmlFor={`title`}
                          className="block text-md font-medium text-gray-600"
                        >
                          {t("addEmployeeName")}
                        </label>
                        <input
                          type="text"
                          id={`title`}
                          name={`title`}
                          value={data.title}
                          onChange={(e) => handleChangeTime(e, i)}
                          className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                          placeholder="ainfo@heidi-app.de"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                          }}
                        />
                      </div>

                      <div className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                        <label
                          htmlFor={`duration`}
                          className="block text-md font-medium text-gray-600"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          {t("selectService")}
                        </label>
                        <select
                          id={`duration`}
                          name={`duration`}
                          value={data.duration}
                          onChange={(e) => handleChangeTime(e, i)}
                          className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-2 px-3 leading-8 transition-colors duration-200 ease-in-out"
                        >
                          <option value="15">Hair cut</option>
                          <option value="30">Swimming</option>
                          <option value="45">Cricket Practice</option>
                          <option value="60">Date</option>
                          <option value="75">Eting class</option>
                          <option value="90">Gym</option>
                        </select>
                      </div>

                      <div className="flex ml-2 mt-8">
                        <button onClick={handleClick}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-5 h-5"
                            viewBox="0 0 512 512"
                          >
                            <path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192zM224 248c13.3 0 24 10.7 24 24v56h56c13.3 0 24 10.7 24 24s-10.7 24-24 24H248v56c0 13.3-10.7 24-24 24s-24-10.7-24-24V376H144c-13.3 0-24-10.7-24-24s10.7-24 24-24h56V272c0-13.3 10.7-24 24-24z" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {showCalendar && (
                      <div className="flex ml-2 mt-8 px-0">
                        <div className="w-full">
                          <Calendar />
                        </div>
                      </div>
                    )}
                  </>
                ))}
              {alert && (
                <div
                  className="mt-4 mb-10 md:mb-4 h-[24px] text-red-600"
                  style={{
                    visibility: alert ? "visible" : "hidden",
                  }}
                >
                  {alert}
                </div>
              )}
              <button
                className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 mt-4 rounded"
                onClick={handleAddTime}
                style={{
                  fontFamily: "Poppins, sans-serif",
                }}
              >
                {t("addAnotherEmployee")}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container w-auto px-5 py-2 bg-slate-600">
        <div className="bg-white mt-4 p-6">
          <div className="py-2 mt-1 px-2">
            <button
              type="button"
              className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
            >
              {t("saveChanges")}
            </button>
          </div>
          <div>
            {successMessage && <Alert type={"success"} message={"success"} />}
            {errorMessage && <Alert type={"danger"} message={"danger"} />}
          </div>
        </div>
      </div>
    </section>
  );
}

export default CreateAppointment;
