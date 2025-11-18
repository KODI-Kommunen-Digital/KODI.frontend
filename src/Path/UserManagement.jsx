import React, { useCallback, useState, useEffect } from 'react';
import SideBar from '../Components/SideBar';
import { useTranslation } from "react-i18next";
import {
    fetchUsers, updateUsersBlock, unblockUsers, deleteUsers, fetchForums,
    updateForumStatus, deleteForumsById,
    fetchAllChannel,
    updateChannelStatus,
    deleteChannel
} from '../Services/usersApi';
const UserManagement = () => {
    const { t } = useTranslation();

    const tabs = [
        { id: "users", label: t("users") },
        { id: "forums", label: t("forums") },
        { id: "channels", label: t("channels") },
    ];

    const [activeTab, setActiveTab] = useState("users");

    const [users, setUsers] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [forums, setForums] = useState([]);
    const [channels, setChannels] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [channelCurrentPage, setChannelCurrentPage] = useState(1);
    const [channelTotalPages, setChannelTotalPages] = useState(1);

    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;


    const showNotification = (message, type) => {
        setNotification({ show: true, message, type });
        setTimeout(() => {
            setNotification({ show: false, message: "", type: "" });
        }, 3000);
    };

    const getAllUsers = useCallback(async () => {
        try {
            const { data } = await fetchUsers();
            setUsers(data?.data || []);
        }
        catch (error) {
            console.error("Error fetching data:", error);
        }
    }, []);

    const handleBlockUser = useCallback(async (userId) => {
        try {
            await updateUsersBlock(userId);
            getAllUsers();
            showNotification(t("user_blocked_successfully"), "success");

        }
        catch (error) {
            console.error("Error blocking user:", error);
            showNotification(t('Failed_block_user'), "error");
        }
    }, [getAllUsers]);

    const handleUnblockUser = useCallback(async (userId) => {
        try {
            await unblockUsers(userId);
            getAllUsers();
            showNotification(t("user_unblocked_successfully"), "success");
        }
        catch (error) {
            console.error("Error unblocking user:", error);
            showNotification(t('Failed_unblock_user'), "error");
        }
    }, [getAllUsers]);

    const handleDeleteUser = useCallback(async (userId) => {
        try {
            await deleteUsers(userId);
            getAllUsers();
            showNotification(t("user_Deleted_successfully"), "success");
        }
        catch (error) {
            console.error("Error deleting user:", error);
            showNotification(t('Failed_delete_user'), "error");
        }
    }, [getAllUsers]);

    useEffect(() => {
        getAllUsers();
    }, [getAllUsers]);


    const getForums = useCallback(async (page = 1) => {
        try {
            const { data } = await fetchForums(pageSize, page);
            setForums(data?.data || []);
            // Calculate total pages from response
            const total = data?.total;
            setTotalPages(Math.ceil(total / pageSize));
        }
        catch (error) {
            console.error("Error fetching forums:", error);
        }
    }, [pageSize]);

    useEffect(() => {
        getForums(currentPage);
    }, [getForums, currentPage]);


    const updateForumStatusById = useCallback(async (forumId, approvalStatus) => {
        try {
            await updateForumStatus(forumId, approvalStatus);
            getForums(currentPage);
            showNotification(t('forum_status_updated'), "success");
        }
        catch (error) {
            console.error("Error updating forum status:", error);
            showNotification(t("forum_status_updated_failed"), "error");
        }
    }, [getForums, currentPage, t]);

    const deleteForumById = useCallback(async (forumId) => {
        try {
            await deleteForumsById(forumId);
            // After deleting, if we're on a page with only one item, go back to previous page
            if (forums.length === 1 && currentPage > 1) {
                setCurrentPage(prev => prev - 1);
            } else {
                getForums(currentPage);
            }
            showNotification(t("forum_deleted_successfully"), "success");
        }
        catch (error) {
            console.error("Error deleting forum:", error);
            showNotification(t("forum_deleted_failed"), "error");
        }
    }, [getForums, currentPage, forums.length, t]);


    const fetchAllChannels = useCallback(async (pageNo = 1) => {
        try {
            const { data } = await fetchAllChannel(pageNo, pageSize);
            const total = data?.total;
            setChannelTotalPages(Math.ceil(total / pageSize));
            setChannels(data?.data || []);
        }
        catch (error) {
            console.error("Error fetching channels:", error);
        }
    }, [pageSize]);

    useEffect(() => {
        fetchAllChannels(channelCurrentPage);
    }, [fetchAllChannels, channelCurrentPage]);

    const updateChannelStatusById = useCallback(async (channelId, approvalStatus) => {
        try {
            await updateChannelStatus(channelId, approvalStatus);
            fetchAllChannels(channelCurrentPage);
            showNotification(t('channel_status_updated'), "success");
        }
        catch (error) {
            console.error("Error updating channel status:", error);
            showNotification(t("channel_status_updated_failed"), "error");
        }
    }, [fetchAllChannels, channelCurrentPage, t]);
    const deleteChannelById = useCallback(async (channelId) => {
        try {
            await deleteChannel(channelId);
            // After deleting, if we're on a page with only one item, go back to previous page
            if (channels.length === 1 && channelCurrentPage > 1) {
                setChannelCurrentPage(prev => prev - 1);
            } else {
                fetchAllChannels(channelCurrentPage);
            }
            showNotification(t("channel_deleted_successfully"), "success");
        }
        catch (error) {
            console.error("Error deleting channel:", error);
            showNotification(t("channel_deleted_failed"), "error");
        }
    }, [fetchAllChannels, channelCurrentPage, channels.length, t]);


    return (
        <div className="bg-gray-800 body-font relative min-h-screen">
            <SideBar />
            <div className="container w-auto px-5 py-2">
                <div className="max-w-4xl mx-auto p-6">
                    <h2 className="text-2xl font-bold mb-4 text-white">{t("user_management")}</h2>

                    <div className="space-y-4">
                        {/* Tabs */}
                        <div className="flex">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    className={`px-4 py-2 font-medium text-md text-bold transition-all duration-200 ${activeTab === tab.id
                                        ? "border-b-2 border-blue-500 text-blue-600"
                                        : "text-white hover:text-blue-500"
                                        }`}
                                    onClick={() => {
                                        setActiveTab(tab.id);
                                        // Reset to page 1 when switching tabs
                                        setCurrentPage(1);
                                        setChannelCurrentPage(1)
                                    }}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Table */}
                        <div className="p-4 bg-white border border-gray-200 rounded-b-md space-y-4">
                            <div className="overflow-x-auto overflow-y-auto max-h-[600px]">
                                <table className="table-auto w-full text-left border-collapse">
                                    <thead className="sticky top-0 bg-white z-10">
                                        <tr>
                                            <th className="border px-4 py-2">
                                                {activeTab === "users"
                                                    ? t("username")
                                                    : activeTab === "forums"
                                                        ? t("Forum_name")
                                                        : activeTab === "channels"
                                                            ? t("Channel_name")
                                                            : t("title")}
                                            </th>
                                            <th className="border px-4 py-2">
                                                {activeTab === "users"
                                                    ? t("email")
                                                    : activeTab === "forums"
                                                        ? t("category")
                                                        : activeTab === "channels"
                                                            ? t("category")
                                                            : t("email")}
                                            </th>
                                            {/* <th className="border px-4 py-2">
                                                {activeTab === "users"
                                                    ? t("description")
                                                    : activeTab === "forums"
                                                        ? t("description")
                                                        : activeTab === "channels"
                                                            ? t("description")
                                                            : t("description")}
                                            </th> */}
                                            <th className="border px-4 py-2">{t("action")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {activeTab === "users" ? (
                                            users && users.length > 0 ? (
                                                users.map((user) => (
                                                    <tr key={user.id}>
                                                        <td className="border px-4 py-2">{user.username || "-"}</td>
                                                        <td className="border px-4 py-2">{user.email || "-"}</td>
                                                        {/* <td className="border px-4 py-2 text-sm text-gray-500">
                                                            {user.description || "-"}
                                                        </td> */}
                                                        <td className="border px-4 py-2">
                                                            <div className="flex gap-2 items-center justify-center">
                                                                {/* Conditional Block/Unblock Button */}
                                                                {user.blocked === 1 ? (
                                                                    // Show Block Icon when user is blocked
                                                                    <button
                                                                        onClick={() => { handleUnblockUser(user.id) }}
                                                                        className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                                                                        title={t('user_unblock')}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <circle cx="12" cy="12" r="10"></circle>
                                                                            <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
                                                                        </svg>
                                                                    </button>
                                                                ) : (
                                                                    // Show Unblock Icon when user is not blocked
                                                                    <button
                                                                        onClick={() => { handleBlockUser(user.id) }}
                                                                        className="p-1.5 hover:bg-green-100 rounded-full transition-colors"
                                                                        title={t('user_block')}
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                                                                            <path d="m9 12 2 2 4-4"></path>
                                                                        </svg>
                                                                    </button>
                                                                )}

                                                                {/* Delete Button */}
                                                                <button
                                                                    onClick={() => { handleDeleteUser(user.id) }}
                                                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                                                    title={t('Delete_User')}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="text-center text-gray-500 text-sm py-4" colSpan={4}>
                                                        No users found
                                                    </td>
                                                </tr>
                                            )
                                        ) : activeTab === "forums" ? (
                                            forums && forums.length > 0 ? (
                                                forums.map((forum) => (
                                                    <tr key={forum.id}>
                                                        <td className="border px-4 py-2">{forum.forumName || "-"}</td>
                                                        <td className="border px-4 py-2">{forum.categoryName || "-"}</td>
                                                        <td className="border px-4 py-2 text-sm text-gray-500">
                                                            {forum.description || "-"}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <div className="flex gap-2 items-center justify-center">
                                                                {/* Conditional Status Icons */}
                                                                {forum.approval_status === "pending" ? (
                                                                    <>
                                                                        {/* Approve Button - When pending */}
                                                                        <button
                                                                            className="p-1.5 hover:bg-green-100 rounded-full transition-colors"
                                                                            title={t("forum-approved")}
                                                                            onClick={() => { updateForumStatusById(forum.id, "approved") }}

                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                                            </svg>
                                                                        </button>

                                                                        {/* Reject Button - When pending */}
                                                                        <button
                                                                            onClick={() => { updateForumStatusById(forum.id, "rejected") }}
                                                                            className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                                                                            title={t("forum-rejected")}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                                                            </svg>
                                                                        </button>
                                                                    </>
                                                                ) : forum.approval_status === "approved" ? (
                                                                    // Approve Icon - When approved (status indicator)
                                                                    <button
                                                                        className="p-1.5 rounded-full"
                                                                        title={t("forum-approved")}
                                                                        disabled
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                                        </svg>
                                                                    </button>
                                                                ) : forum.approval_status === "rejected" ? (
                                                                    // Reject Icon - When rejected (status indicator)
                                                                    <button
                                                                        className="p-1.5 rounded-full"
                                                                        title={t("forum-rejected")}
                                                                        disabled
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <circle cx="12" cy="12" r="10"></circle>
                                                                            <line x1="15" y1="9" x2="9" y2="15"></line>
                                                                            <line x1="9" y1="9" x2="15" y2="15"></line>
                                                                        </svg>
                                                                    </button>
                                                                ) : null}

                                                                {/* Delete Button - Always visible */}
                                                                <button
                                                                    onClick={() => { deleteForumById(forum.id) }}
                                                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                                                    title={t("Delete_forum")}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="text-center text-gray-500 text-sm py-4" colSpan={4}>
                                                        {t("no_forums_found")}                                                    </td>
                                                </tr>
                                            )
                                        ) : activeTab === "channels" ? (
                                            channels && channels.length > 0 ? (
                                                channels.map((channel) => (
                                                    <tr key={channel.id}>
                                                        <td className="border px-4 py-2">{channel.name || "-"}</td>
                                                        <td className="border px-4 py-2">{channel.categoryName || "-"}</td>
                                                        <td className="border px-4 py-2 text-sm text-gray-500">
                                                            {channel.description || "-"}
                                                        </td>
                                                        <td className="border px-4 py-2">
                                                            <div className="flex gap-2 items-center justify-center">
                                                                {/* Conditional Status Icons */}
                                                                {channel.approval_status === "pending" ? (
                                                                    <>
                                                                        {/* Approve Button - When pending */}
                                                                        <button
                                                                            onClick={() => { updateChannelStatusById(channel.id, "approved") }}
                                                                            className="p-1.5 hover:bg-green-100 rounded-full transition-colors"
                                                                            title={t("channel-approved")}

                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                                            </svg>
                                                                        </button>

                                                                        {/* Reject Button - When pending */}
                                                                        <button
                                                                            onClick={() => { updateChannelStatusById(channel.id, "rejected") }}
                                                                            className="p-1.5 hover:bg-red-100 rounded-full transition-colors"
                                                                            title={t("channel-rejected")}
                                                                        >
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                                <line x1="15" y1="9" x2="9" y2="15"></line>
                                                                                <line x1="9" y1="9" x2="15" y2="15"></line>
                                                                            </svg>
                                                                        </button>
                                                                    </>
                                                                ) : channel.approval_status === "approved" ? (
                                                                    // Approve Icon - When approved (status indicator)
                                                                    <button
                                                                        className="p-1.5 rounded-full"
                                                                        title={t("channel-approved")}
                                                                        disabled
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                                                        </svg>
                                                                    </button>
                                                                ) : channel.approval_status === "rejected" ? (
                                                                    // Reject Icon - When rejected (status indicator)
                                                                    <button
                                                                        className="p-1.5 rounded-full"
                                                                        title={t("channel-rejected")}
                                                                        disabled
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                            <circle cx="12" cy="12" r="10"></circle>
                                                                            <line x1="15" y1="9" x2="9" y2="15"></line>
                                                                            <line x1="9" y1="9" x2="15" y2="15"></line>
                                                                        </svg>
                                                                    </button>
                                                                ) : null}

                                                                {/* Delete Button - Always visible */}
                                                                <button
                                                                    onClick={() => { deleteChannelById(channel.id) }}
                                                                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                                                                    title={t("Delete_channel")}
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td className="text-center text-gray-500 text-sm py-4" colSpan={4}>
                                                        {t("no_channels_found")}
                                                    </td>
                                                </tr>
                                            )
                                        ) : null}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination - Only show for forums tab */}
                        {activeTab === "forums" && forums.length > 0 && (
                            <div className="flex justify-center mt-4 p-4 space-x-2">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                <span className="px-4 py-1 text-sm text-slate-50">
                                    {t("page")} {currentPage} {t("of")} {totalPages}
                                </span>

                                <button
                                    onClick={() =>
                                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                                    }
                                    disabled={currentPage === totalPages}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                        {activeTab === "channels" && channels.length > 0 && (
                            <div className="flex justify-center mt-4 p-4 space-x-2">
                                <button
                                    onClick={() => setChannelCurrentPage((prev) => Math.max(prev - 1, 1))}
                                    disabled={channelCurrentPage === 1}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>

                                <span className="px-4 py-1 text-sm text-slate-50">
                                    {t("page")} {channelCurrentPage} {t("of")} {channelTotalPages}
                                </span>

                                <button
                                    onClick={() =>
                                        setChannelCurrentPage((prev) => Math.min(prev + 1, channelTotalPages))
                                    }
                                    disabled={channelCurrentPage === channelTotalPages}
                                    className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50 flex items-center"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>



                    {/* Notification */}
                    {notification.show && (
                        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all duration-300 z-50 ${notification.type === "success"
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-red-100 text-red-800 border border-red-300"
                            }`}>
                            <div className="flex items-center gap-2">
                                {notification.type === "success" ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                    </svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                    </svg>
                                )}
                                <span className="font-medium">{notification.message}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
