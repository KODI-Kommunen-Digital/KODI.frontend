import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../Components/SideBar";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../index.css";
import { getUserForums, deleteForums } from "../Services/forumsApi";

const MyGroups = () => {
  const { t } = useTranslation();
  const [forums, setForums] = useState([]);
  const [pageNo, setPageNo] = useState(1);
  const pageSize = 9;

  // useEffect(() => {
  // 	getUserForums().then((response) => {
  // 		setForums(response.data.data);
  // 	});
  // }, []);

  const fetchForums = useCallback(() => {
    getUserForums({
      pageNo,
      pageSize,
    }).then((response) => {
      const sortedForums = response.data.data.sort((a, b) => {
        return new Date(b.JoinedAt) - new Date(a.JoinedAt);
      });
      console.log(sortedForums);
      setForums(sortedForums);
    });
  }, [pageNo]);

  useEffect(() => {
    if (pageNo === 1) {
      fetchForums();
    } else {
      fetchForums();
    }
  }, [fetchForums, pageNo]);

  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  function goToEditForums(forums) {
    navigateTo(
      `/CreateGroup?forumId=${forums.forumId}&cityId=${forums.cityId}`
    );
  }

  const [showConfirmationModal, setShowConfirmationModal] = useState({
    visible: false,
    forums: null,
    onConfirm: () => {},
    onCancel: () => {},
  });

  function handleDelete(forum) {
    deleteForums(forum.cityId, forum.forumId)
      .then((res) => {
        getUserForums(
          forums.filter(
            (f) => f.cityId !== forum.cityId || f.forumId !== forum.forumId
          )
        );
        console.log("Deleted successfully");

        setShowConfirmationModal({ visible: false });
        window.location.reload();
      })
      .catch((error) => console.log(error));
  }

  function deleteForumOnClick(forums) {
    setShowConfirmationModal({
      visible: true,
      forums,
      onConfirm: () => handleDelete(forums),
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
                    className="px-6 sm:px-6 py-3"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "16.66%",
                    }}
                  >
                    {t("groupName")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 sm:px-6 py-3 text-center"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "16.66%",
                    }}
                  >
                    {t("members")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 sm:px-6 py-3 text-center "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "16.66%",
                    }}
                  >
                    {t("date_of_creation")}
                  </th>

                  <th
                    scope="col"
                    className="px-6 sm:px-6 py-3 text-center "
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "16.66%",
                    }}
                  >
                    {t("role")}
                  </th>

                  <th
                    scope="col"
                    className="px-6 sm:px-6 py-3 text-center"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "16.66%",
                    }}
                  >
                    {t("privacy")}
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
                {forums.map((forum, index) => {
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
                            forum.image
                              ? process.env.REACT_APP_BUCKET_HOST + forum.image
                              : process.env.REACT_APP_BUCKET_HOST +
                                "admin/DefaultForum.jpeg"
                          }
                          onClick={() =>
                            navigateTo(
                              `/Forum?forumId=${forum.forumId}&cityId=${forum.cityId}`
                            )
                          }
                          alt="avatar"
                        />
                        <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
                          <div
                            className="font-medium text-gray-500 cursor-pointer text-center truncate"
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            onClick={() =>
                              navigateTo(
                                `/Forum?forumId=${forum.forumId}&cityId=${forum.cityId}`
                              )
                            }
                          >
                            {forum.forumName}
                          </div>
                        </div>
                      </th>

                      <td
                        className="font-medium text-blue-600 hover:underline cursor-pointer text-center"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                        onClick={() =>
                          navigateTo(
                            `/MyGroups/GroupMembers?forumId=${forum.forumId}&cityId=${forum.cityId}`
                          )
                        }
                      >
                        {t("members")}
                      </td>

                      <td
                        className="px-6 py-4  text-center"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {new Date(forum.JoinedAt).toLocaleString("de")}
                      </td>

                      <td
                        className="px-6 py-4  text-center"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          color: forum.isAdmin === 1 ? "green" : "red",
                        }}
                      >
                        {forum.isAdmin === 1 ? t("admin") : t("member")}
                      </td>
                      <td
                        className="px-6 py-4  text-center"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {forum.isPrivate === 1
                          ? t("privateGroup")
                          : t("publicGroup")}
                      </td>
                      <td className="px-6 py-4  text-center">
                        {forum.isAdmin ? (
                          <div>
                            <a
                              className="font-medium text-blue-600 hover:underline cursor-pointer pr-2"
                              onClick={() => goToEditForums(forum)}
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {t("edit")}
                            </a>
                            <a
                              className="font-medium text-blue-600 hover:underline cursor-pointer text-center"
                              onClick={() => deleteForumOnClick(forum)}
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {t("delete")}
                            </a>
                          </div>
                        ) : (
                          <div className="text-gray-500">{t("onlyAdmins")}</div>
                        )}
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
                                          {t("doyoureallywanttodeleteListing")}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                  <button
                                    onClick={showConfirmationModal.onConfirm}
                                    type="button"
                                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-700 text-base font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
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
            {pageNo !== 1 ? (
              <span
                className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                onClick={() => setPageNo(pageNo - 1)}
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
              {t("page")} {pageNo}
            </span>

            {forums.length >= pageSize && (
              <span
                className="inline-block bg-black px-2 pb-2 pt-2 text-xs font-bold uppercase leading-normal text-neutral-50"
                onClick={() => setPageNo(pageNo + 1)}
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

export default MyGroups;
