import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getProfile } from "../../Services/usersApi";
import { getOwnerAppointments, deleteUserAppointments } from "../../Services/appointmentBookingApi";

const MyAppointments = () => {
  const { t } = useTranslation();
  const [appointments, setOwnerAppointments] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 9;
  const [userId, setUserId] = useState(0);

  // const fetchAppointments = useCallback((appointmentId) => {
  //   getOwnerAppointments({
  //     pageNumber,
  //     pageSize,
  //     appointmentId
  //   }).then((response) => {
  //     setOwnerAppointments(response.data.data);

  //     getProfile().then((response) => {
  //       setUserId(response.data.data.id);
  //     });
  //   }).catch((error) => {
  //     console.error("Error fetching services:", error);
  //   });
  // }, [pageNumber]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const appointmentId = urlParams.get('appointmentId');
    getOwnerAppointments({
      pageNumber,
      pageSize,
      appointmentId
    }).then((response) => {
      setOwnerAppointments(response.data.data);

      getProfile().then((response) => {
        setUserId(response.data.data.id);
      });
    }).catch((error) => {
      console.error("Error fetching services:", error);
    });
  }, [pageNumber]);

  const [showConfirmationModal, setShowConfirmationModal] = useState({
    visible: false,
    forums: null,
    onConfirm: () => { },
    onCancel: () => { },
  });

  function handleDelete(appointment) {
    deleteUserAppointments(userId, appointment.appointmentId, appointment.id)
      .then((res) => {
        getOwnerAppointments(
          appointments.filter(
            (a) => a.appointmentId !== appointment.appointmentId || a.id !== appointment.id
          )
        );
        console.log("Deleted successfully");

        setShowConfirmationModal({ visible: false });
        window.location.reload();
      })
      .catch((error) => console.log(error));
  }

  function deleteAppointmentOnClick(appointments) {
    setShowConfirmationModal({
      visible: true,
      appointments,
      onConfirm: () => handleDelete(appointments),
      onCancel: () => setShowConfirmationModal({ visible: false }),
    });
  }

  return (
    <section className="bg-slate-600 body-font relative h-screen">
      <SideBar />
      <div className="container w-auto px-0 lg:px-5 py-2 bg-slate-600 min-h-screen flex flex-col">
        <div className="h-full">
          <div className="bg-white mt-10 p-0 space-y-10 overflow-x-auto">
            <table className="w-full text-sm text-left lg:mt-[2rem] mt-[2rem] text-gray-500 p-6 space-y-10 rounded-lg">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 sm:px-6 py-3 text-center"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "16.66%",
                    }}
                  >
                    {t("serviceId")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 sm:px-6 py-3 text-center"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "16.66%",
                    }}
                  >
                    {t("client")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 sm:px-6 py-3 text-center"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "16.66%",
                    }}
                  >
                    {t("email")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 sm:px-6 py-3 text-center "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "16.66%",
                    }}
                  >
                    {t("from")}
                  </th>

                  <th
                    scope="col"
                    className="px-6 sm:px-6 py-3 text-center "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "16.66%",
                    }}
                  >
                    {t("to")}
                  </th>

                  <th
                    scope="col"
                    className="px-6 sm:px-6 py-3 text-center "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "16.66%",
                    }}
                  >
                    {t("action")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment, index) => {
                  return (
                    <tr
                      key={index}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <th
                        scope="row"
                        className="px-6 py-4 text-center"
                      >
                        <div
                          className="font-medium text-blue-600 cursor-pointer text-center truncate"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {`MAP${appointment.id.toString().padStart(6, '0')}`}
                        </div>
                      </th>

                      <td
                        className="px-6 py-4 text-center truncate"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {appointment.guest_details?.firstName + " " + appointment.guest_details?.lastName}
                      </td>

                      <td
                        className="text-blue-600 hover:underline cursor-pointer text-center truncate"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {appointment.guest_details?.email}
                      </td>

                      <td
                        className="px-6 py-4  text-center"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {new Date(appointment.startTime).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>

                      <td
                        className="px-6 py-4  text-center"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {new Date(appointment.endTime).toLocaleString("en-US", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="px-6 py-4  text-center">
                        <div>
                          <a
                            className="hover:underline cursor-pointer text-center text-red-700 hover:text-red-600"
                            onClick={() => deleteAppointmentOnClick(appointment)}
                            style={{
                              fontFamily: "Poppins, sans-serif",
                            }}
                          >
                            {t("reject")}
                          </a>
                        </div>
                        {showConfirmationModal.visible && (
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
                              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                  <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                                      <svg
                                        className="h-6 w-6 text-red-700"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                        aria-hidden="true"
                                      >
                                        <path
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          d="M6 18L18 6M6 6l12 12"
                                        />
                                      </svg>
                                    </div>
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                                        {t("areyousure")}
                                      </h3>
                                      <div className="mt-2">
                                        <p className="text-sm text-gray-500">
                                          {t("doyoureallywanttodeleteBooking")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                  <button
                                    onClick={showConfirmationModal.onConfirm}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                  >
                                    {t("delete")}
                                  </button>

                                  <button
                                    onClick={showConfirmationModal.onCancel}
                                    type="button"
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                  >
                                    {t("cancel")}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
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
                onClick={() => setPageNumber(pageNumber - 1)}
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

            {appointments.length >= pageSize && (
              <span
                className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                onClick={() => setPageNumber(pageNumber + 1)}
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                {">"}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MyAppointments;
