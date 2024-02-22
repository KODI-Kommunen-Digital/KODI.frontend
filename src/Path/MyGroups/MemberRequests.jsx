import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import DialogueBox from "../../Components/DialogueBox";
import { useTranslation } from "react-i18next";
import "../../index.css";
import {
  getForumMemberRequests,
  acceptForumMemberRequests,
} from "../../Services/forumsApi";
import PROFILEPICTURE from "../../assets/ProfilePicture.png";
import { useNavigate } from "react-router-dom";
import ForumNavbar from "../../Components/ForumNavbar";

const MemberRequests = () => {
  const { t } = useTranslation();
  const [memberRequests, setRequests] = useState([]);
  const [cityId, setCityId] = useState(0);
  const [forumId, setForumId] = useState(0);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    document.title = t("forumReq");
    const cityIdParam = parseInt(urlParams.get("cityId"));
    const forumIdParam = parseInt(urlParams.get("forumId"));
    getForumMemberRequests(cityIdParam, forumIdParam, { statusId: 1 })
      .then((response) => {
        setRequests(response.data.data);
        console.log(response.data.data);
        setCityId(cityIdParam);
        setForumId(forumIdParam);
      })
      .catch(() => navigateTo("/Error"));
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async (member) => {
    setIsLoading(true);

    try {
      const payload = { accept: true };
      await acceptForumMemberRequests(
        cityId,
        forumId,
        member.requestId,
        payload
      );
      setRequests((prevRequests) =>
        prevRequests.filter((request) => request.requestId !== member.requestId)
      );
    } catch (error) {
      console.error("Error accepting member request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <section className="bg-slate-600 body-font relative h-screen">
      <SideBar />
      <ForumNavbar cityId={cityId} forumId={forumId} />
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
                      width: "33.3%",
                    }}
                  >
                    {t("requests")}
                  </th>

                  <th
                    scope="col"
                    className="px-6 sm:px-6 py-3 text-center"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      width: "33.3%",
                    }}
                  >
                    {t("dateOfRequest")}
                  </th>

                  <th
                    scope="col"
                    className="px-6 py-3 text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("accept")}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center"
                    style={{ fontFamily: "Poppins, sans-serif" }}
                  >
                    {t("remove")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {memberRequests &&
                  memberRequests.map((member, index) => {
                    return (
                      <tr
                        key={index}
                        className="bg-white border-b dark:bg-white dark:border-white hover:bg-gray-50 dark:hover:bg-gray-50"
                      >
                        <th
                          scope="row"
                          className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white cursor-pointer"
                        >
                          <img
                            className="w-10 h-10 object-cover rounded-full hidden sm:table-cell"
                            src={
                              member.image
                                ? process.env.REACT_APP_BUCKET_HOST +
                                  member.image
                                : PROFILEPICTURE
                            }
                            alt="avatar"
                          />
                          <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
                            <div
                              className="font-normal text-gray-500 truncate"
                              style={{ fontFamily: "Poppins, sans-serif" }}
                              onClick={() =>
                                navigateTo(`/ViewProfile/${member.username}`)
                              }
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
                          {new Date(member.createdAt).toLocaleString("de")}
                        </td>

                        <td className="px-6 py-4 text-center">
                          <a
                            className={`font-medium ${
                              isLoading
                                ? "text-gray-400 cursor-not-allowed"
                                : "text-blue-600 hover:underline cursor-pointer"
                            } px-2 dark:text-blue-500`}
                            style={{ fontFamily: "Poppins, sans-serif" }}
                            onClick={() => handleAccept(member)}
                          >
                            {t("accept")}
                          </a>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <DialogueBox
                            member={member}
                            setRequests={setRequests}
                          />
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          <div className="bottom-5 right-5 mt-5 px-1 py-2 text-xs font-medium text-center float-left cursor-pointer">
            <button
              type="button"
              className="inline-block rounded-xl bg-black px-3 pb-2 pt-2 text-xs font-medium uppercase leading-normal text-neutral-50 shadow-[0_4px_9px_-4px_rgba(51,45,45,0.7)] transition duration-150 ease-in-out hover:bg-neutral-800 hover:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:bg-neutral-800 focus:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] focus:outline-none focus:ring-0 active:bg-neutral-900 active:shadow-[0_8px_9px_-4px_rgba(51,45,45,0.2),0_4px_18px_0_rgba(51,45,45,0.1)] dark:bg-neutral-900 dark:shadow-[0_4px_9px_-4px_#030202] dark:hover:bg-neutral-900 dark:hover:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:focus:bg-neutral-900 dark:focus:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)] dark:active:bg-neutral-900 dark:active:shadow-[0_8px_9px_-4px_rgba(3,2,2,0.3),0_4px_18px_0_rgba(3,2,2,0.2)]"
              style={{ fontFamily: "Poppins, sans-serif" }}
              onClick={() => navigateTo("/MyGroups")}
            >
              {t("backToMyGroups")}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MemberRequests;
