import React, { useState, useEffect } from "react";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "../../index.css";
import { getForumMembers } from "../../Services/forumsApi";
import GROUPIMAGE from "../../assets/GroupImage.avif";
import { useNavigate } from "react-router-dom";
import ForumNavbar from "../../Components/ForumNavbar";

const GroupMembers = () => {
    const { t } = useTranslation();
    const [members, setMembers] = useState([]);
    const [cityId, setCityId] = useState(0);
    const [forumId, setForumId] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        document.title = "Heidi - Forum Members";
        const cityUsers =
            JSON.parse(window.localStorage.getItem("cityUsers") ||
                window.sessionStorage.getItem("cityUsers"));
        const cityIdParam = parseInt(urlParams.get("cityId"));
        const forumIdParam = parseInt(urlParams.get("forumId"));
        const cityUserId = cityUsers.find(cu => cu.cityId === cityIdParam)?.cityUserId;
        getForumMembers(cityIdParam, forumIdParam).then((response) => {
            setMembers(response.data.data);
            setIsAdmin(response.data.data.find(m => m.cityUserId === cityUserId)?.isAdmin)
            setCityId(cityIdParam);
            setForumId(forumIdParam);
        }).catch(() => navigateTo("/Error"));
    }, []);

    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    return (
        <section className="bg-slate-600 body-font relative h-screen">
            <SideBar />
            {isAdmin && <ForumNavbar cityId={cityId} forumId={forumId} />}
            <div className="container w-auto px-0 lg:px-5 py-2 bg-slate-600 min-h-screen flex flex-col">
                <div className="h-full">
                    <div className="bg-white mt-10 p-0 space-y-10 overflow-x-auto">
                        <table className="w-full text-sm text-left lg:mt-[2rem] mt-[2rem] text-gray-500 dark:text-gray-400 p-6 space-y-10 rounded-lg">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-50 dark:text-gray-700">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-6 sm:px-6 py-3"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                            width: "33.3%",
                                        }}
                                    >
                                        {t("members")}
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 sm:px-6 py-3 text-center"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                            width: "33.3%",
                                        }}
                                    >
                                        {t("date_of_joining")}
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 sm:px-6 py-3 text-center hidden lg:table-cell"
                                        style={{
                                            fontFamily: "Poppins, sans-serif",
                                            width: "16.67%",
                                        }}
                                    >
                                        {t("admin")}
                                    </th>

                                    <th
                                        scope="col"
                                        className="px-6 py-3 text-center"
                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                    >
                                        {t("action")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {members.map((member, index) => {
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
                                                    className="w-10 h-10 rounded-full hidden sm:table-cell"
                                                    src={
                                                        member.logo
                                                            ? process.env.REACT_APP_BUCKET_HOST + member.logo
                                                            : GROUPIMAGE
                                                    }
                                                    alt="avatar"
                                                />
                                                <div className="pl-0 sm:pl-3 overflow-hidden max-w-[20rem] sm:max-w-[10rem]">
                                                    <div
                                                        className="font-normal text-gray-500 truncate"
                                                        style={{ fontFamily: "Poppins, sans-serif" }}
                                                    >
                                                        {member.username}
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
                                                className="px-6 py-4 hidden lg:table-cell text-center"
                                                style={{
                                                    fontFamily: "Poppins, sans-serif",
                                                    color: member.isAdmin === 1 ? "green" : "red",
                                                }}
                                            >
                                                {member.isAdmin === 1 ? "You are admin" : "Member"}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                <a
                                                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline cursor-pointer text-center"
                                                    style={{ fontFamily: "Poppins, sans-serif" }}
                                                >
                                                    {t("remove")}
                                                </a>
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

export default GroupMembers;
