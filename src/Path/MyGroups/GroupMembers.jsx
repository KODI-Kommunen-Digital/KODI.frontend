import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import {
  getForumMembers,
  deleteForumMembers,
  adminStatusChange,
} from "../../Services/forumsApi";
import GROUPIMAGE from "../../assets/GroupImage.avif";
import { useNavigate } from "react-router-dom";
import ForumNavbar from "../../Components/ForumNavbar";
import { getUserId } from "../../Services/usersApi";

const GroupMembers = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [cityId, setCityId] = useState(0);
  const [forumId, setForumId] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOnlyAdmin, setIsOnlyAdmin] = useState(false);
  const [currentUserId, setIsCurrentUserId] = useState(0);
  const [memberToBeRemoved, setMemberToBeRemoved] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken =
      window.localStorage.getItem("accessToken") ||
      window.sessionStorage.getItem("accessToken");
    const refreshToken =
      window.localStorage.getItem("refreshToken") ||
      window.sessionStorage.getItem("refreshToken");
    if (!accessToken && !refreshToken) {
      navigate("/login");
    }

    document.title = t("forumMembers");
    const cityIdParam = parseInt(urlParams.get("cityId"));
    const forumIdParam = parseInt(urlParams.get("forumId"));
    const currentUserId = parseInt(getUserId());

    setIsCurrentUserId(currentUserId);
    async function fetchData() {
      try {
        const response = await getForumMembers(cityIdParam, forumIdParam);
        const membersData = response.data.data;
        setMembers(membersData);
        const isAdmin = membersData.find(
          (m) => m.userId === currentUserId && m.isAdmin === 1
        );
        const adminLength = membersData.filter((m) => m.isAdmin === 1).length;
        setCityId(cityIdParam);
        setIsOnlyAdmin(adminLength === 1);
        setIsAdmin(isAdmin);
        setForumId(forumIdParam);
      } catch (error) {
        navigateTo("/Error");
      }
    }

    fetchData();
  }, []);

  const handleAdminToggle = async (member) => {
    const urlParams = new URLSearchParams(window.location.search);
    const cityIdParam = parseInt(urlParams.get("cityId"));
    const forumIdParam = parseInt(urlParams.get("forumId"));
    const newIsAdminValue = member.isAdmin === 1 ? 0 : 1;

    try {
      await adminStatusChange(
        cityIdParam,
        forumIdParam,
        member.memberId,
        newIsAdminValue
      );
      setMembers((prevMembers) =>
        prevMembers.map((m) =>
          m.userId === member.userId ? { ...m, isAdmin: newIsAdminValue } : m
        )
      );
    } catch (error) {
      console.error("Error changing admin status:", error);
    }
  };

  const [showConfirmationModal, setShowConfirmationModal] = useState({
    visible: false,
    members: null,
    onConfirm: () => { },
    onCancel: () => { },
  });

  function handleRemove(member) {
    const searchParams = new URLSearchParams(window.location.search);
    const cityId = searchParams.get("cityId");
    const forumId = searchParams.get("forumId");

    deleteForumMembers(cityId, forumId, member.memberId)
      .then(() => {
        setShowConfirmationModal({ visible: false });
      })
      .catch((error) => console.log(error));
  }

  function removeMemberOnClick(member) {
    setMemberToBeRemoved(member.userId);
    setShowConfirmationModal({
      visible: true,
      member,
      onConfirm: () => handleRemove(member),
      onCancel: () => setShowConfirmationModal({ visible: false }),
    });
  }

  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <section className="bg-gray-900 body-font relative min-h-screen">
      <SideBar />
      {isAdmin && <ForumNavbar cityId={cityId} forumId={forumId} />}
      <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-900 min-h-screen flex flex-col">
        <div className="h-full">
          <div className="bg-white mt-4 p-0">
            <h2 className="text-xl font-semibold text-gray-800 text-center px-5 py-2" style={{ fontFamily: "Poppins, sans-serif" }}>
              {t("groupMembers")}
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left  text-gray-500 p-6 space-y-10 rounded-lg">
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
                      {t("members")}
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-4 text-center"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        width: "20%",
                      }}
                    >
                      {t("date_of_joining")}
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-4 text-center"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        width: "20%",
                      }}
                    >
                      {t("admin")}
                    </th>

                    <th
                      scope="col"
                      className="px-6 py-4 text-center"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        width: "20%",
                      }}
                    >
                      {t("remove")}
                    </th>

                    {isAdmin && (
                      <th
                        scope="col"
                        className="px-6 py-4 text-center"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          width: "20%",
                        }}
                      >
                        {t("action")}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, index) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white border-b hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="flex items-center px-6 py-4 text-slate-800 whitespace-nowrap cursor-pointer"
                        >
                          <img
                            className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                            src={
                              member.image
                                ? process.env.REACT_APP_BUCKET_HOST + member.image
                                : GROUPIMAGE
                            }
                            alt="avatar"
                          />
                          <div className="pl-0 sm:pl-3 overflow-hidden max-w">
                            <div
                              className="font-bold text-gray-500 truncate"
                              onClick={() =>
                                navigateTo(`/ViewProfile/${member.username}`)
                              }
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {member.firstname} {member.lastname} (@
                              {member.username})
                            </div>
                          </div>
                        </th>

                        <td
                          className="px-6 py-4 text-center"
                          style={{ fontFamily: "Poppins, sans-serif" }}
                        >
                          {new Date(member.joinedAt).toLocaleString("de")}
                        </td>

                        <td
                          className="px-6 py-4 font-bold text-center"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            color: member.isAdmin === 1 ? "green" : "red",
                          }}
                        >
                          {member.isAdmin === 1 ? t("admin") : t("member")}
                        </td>

                        {isAdmin ? (
                          <td className="px-6 py-4 text-center">
                            <a
                              className="text-blue-600 font-bold hover:underline cursor-pointer text-center pr-0"
                              onClick={() => removeMemberOnClick(member)}
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {member.userId === currentUserId
                                ? t("exit")
                                : t("remove")}
                            </a>
                          </td>
                        ) : (
                          <td className="px-6 py-4 text-center">
                            <a
                              className={`font-bold text-blue-600 ${member.userId === currentUserId
                                ? "hover:underline"
                                : ""
                                } cursor-pointer text-center pr-0`}
                              onClick={() => {
                                member.userId === currentUserId &&
                                  removeMemberOnClick(member);
                              }}
                              style={{ fontFamily: "Poppins, sans-serif" }}
                            >
                              {member.userId === currentUserId ? (
                                t("exit")
                              ) : (
                                <div className="font-bold text-gray-500">
                                  {t("onlyAdmins")}
                                </div>
                              )}
                            </a>
                          </td>
                        )}

                        {isAdmin && (
                          <td className="px-6 py-4 text-center">
                            <button
                              className={`font-bold hover:underline cursor-pointer text-center ${member.isAdmin === 1
                                ? "text-red-500"
                                : "text-green-500"
                                }`}
                              style={{
                                fontFamily: "Poppins, sans-serif",
                              }}
                              onClick={() => handleAdminToggle(member)}
                            >
                              {member.isAdmin === 1
                                ? t("removeAdmin")
                                : t("makeAdmin")}
                            </button>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-left cursor-pointer">
            <a
              onClick={() => navigateTo("/MyGroups")}
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
          </div>
          <div>
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
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          {isOnlyAdmin &&
                            isAdmin &&
                            currentUserId === memberToBeRemoved ? (
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <h3 className="text-lg leading-6 font-medium text-slate-800">
                                {t("onlyAdminWarning")}
                              </h3>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  {t("onlyAdminWarningInfo")}
                                </p>
                              </div>
                            </div>
                          ) : (
                            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                              <h3 className="text-lg leading-6 font-medium text-slate-800">
                                {t("areyousure")}
                              </h3>
                              <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                  {t("areyousureinfo")}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        {isAdmin && currentUserId !== memberToBeRemoved && (
                          <button
                            onClick={showConfirmationModal.onConfirm}
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            {t("remove")}
                          </button>
                        )}

                        {!isOnlyAdmin &&
                          isAdmin &&
                          currentUserId === memberToBeRemoved && (
                            <button
                              onClick={showConfirmationModal.onConfirm}
                              type="button"
                              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                            >
                              {t("exit")}
                            </button>
                          )}

                        {!isAdmin && currentUserId === memberToBeRemoved && (
                          <button
                            onClick={showConfirmationModal.onConfirm}
                            type="button"
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-800 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                          >
                            {t("exit")}
                          </button>
                        )}

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
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GroupMembers;
