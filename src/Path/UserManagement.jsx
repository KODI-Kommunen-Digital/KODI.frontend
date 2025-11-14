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
        { id: "users", label: "Users" },
        { id: "forums", label: "Forums" },
        { id: "channels", label: "Channels" },
    ];

    const [activeTab, setActiveTab] = useState(tabs[0].id);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const [users, setUsers] = useState([]);
    const [notification, setNotification] = useState({ show: false, message: "", type: "" });
    const [forums, setForums] = useState([]);
    const [channels, setChannels] = useState([]);


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


    const getForums = useCallback(async () => {
        try {
            const { data } = await fetchForums(10, 1);
            setForums(data?.data || []);
        }
        catch (error) {
            console.error("Error fetching forums:", error);
        }
    }, []);

    useEffect(() => {
        getForums();
    }, [getForums]);


    const updateForumStatusById = useCallback(async (forumId, approvalStatus) => {
        try {
            await updateForumStatus(forumId, approvalStatus);
            getForums();
            showNotification(t('forum_status_updated'), "success");
        }
        catch (error) {
            console.error("Error updating forum status:", error);
            showNotification(t("forum_status_updated_failed"), "error");
        }
    }, [getForums]);

    const deleteForumById = useCallback(async (forumId) => {
        try {
            await deleteForumsById(forumId);
            getForums();
            showNotification(t("forum_deleted_successfully"), "success");
        }
        catch (error) {
            console.error("Error deleting forum:", error);
            showNotification(t("forum_deleted_failed"), "error");
        }
    }, [getForums]);


    const fetchAllChannels = useCallback(async () => {
        try {
            const { data } = await fetchAllChannel();
            setChannels(data?.data || []);
        }
        catch (error) {
            console.error("Error fetching channels:", error);
        }
    }, []);

    useEffect(() => {
        fetchAllChannels();
    }, [fetchAllChannels]);

    const updateChannelStatusById = useCallback(async (channelId, approvalStatus) => {
        try {
            await updateChannelStatus(channelId, approvalStatus);
            fetchAllChannels();
            showNotification(t('channel_status_updated'), "success");
        }
        catch (error) {
            console.error("Error updating channel status:", error);
            showNotification(t("channel_status_updated_failed"), "error");
        }
    }, [fetchAllChannels]);
    const deleteChannelById = useCallback(async (channelId) => {
        try {
            await deleteChannel(channelId);
            fetchAllChannels();
            showNotification(t("channel_deleted_successfully"), "success");
        }
        catch (error) {
            console.error("Error deleting channel:", error);
            showNotification(t("channel_deleted_failed"), "error");
        }
    })

    const renderModalContent = () => {
        // const accordionMaxHeight = "max-h-96";

        switch (activeTab) {
            case "users":
                return (
                    <div className="space-y-3">
                        <div className="border rounded p-4 bg-gray-50">
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">Username:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.username || "-"}</p>
                            </div>
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">Email:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.email || "-"}</p>
                            </div>
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">Description:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.description || "-"}</p>
                            </div>
                        </div>
                    </div>
                );

            case "forums":
                return (
                    <div className="space-y-3">
                        <div className="border rounded p-4 bg-gray-50">
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">Forum Name:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.name || "-"}</p>
                            </div>
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">Category:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.category || "-"}</p>
                            </div>
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">Description:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.description || "-"}</p>
                            </div>
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">Status:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.isApproved || "-"}</p>
                            </div>
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">City:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.cityName || "-"}</p>
                            </div>
                        </div>
                    </div>
                );

            case "channels":
                return (
                    <div className="space-y-3">
                        <div className="border rounded p-4 bg-gray-50">
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">Channel Name:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.name || "-"}</p>
                            </div>
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">Category:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.categoryName || "-"}</p>
                            </div>
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">Description:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.description || "-"}</p>
                            </div>
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">Status:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.approval_status || "-"}</p>
                            </div>
                            <div className="mb-3">
                                <span className="font-semibold text-gray-700">City:</span>
                                <p className="text-gray-900 mt-1">{selectedRequest?.cityName || "-"}</p>
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const renderModal = () => {
        if (!selectedRequest) return null;

        return (
            <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-white p-6 rounded-2xl max-w-lg w-full relative flex flex-col max-h-[90vh]">
                    <button
                        className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
                        onClick={() => setSelectedRequest(null)}
                    >
                        &times;
                    </button>
                    <div className="flex-shrink-0">
                        <h2 className="text-xl font-bold mb-2">
                            {activeTab === "users"
                                ? selectedRequest.username
                                : activeTab === "forums"
                                    ? selectedRequest.name
                                    : activeTab === "channels"
                                        ? selectedRequest.name
                                        : selectedRequest.title}
                        </h2>
                        {selectedRequest.createdAt && (
                            <p className="text-sm text-gray-500 mb-4">
                                {t("createdAt")}: {selectedRequest.createdAt}
                            </p>
                        )}
                    </div>
                    <div className="overflow-y-auto flex-1 mb-6">{renderModalContent()}</div>
                </div>
            </div>
        );
    };

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
                                    onClick={() => setActiveTab(tab.id)}
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
                                            <th className="border px-4 py-2">
                                                {activeTab === "users"
                                                    ? t("description")
                                                    : activeTab === "forums"
                                                        ? t("description")
                                                        : activeTab === "channels"
                                                            ? t("description")
                                                            : t("description")}
                                            </th>
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
                                                        <td className="border px-4 py-2 text-sm text-gray-500">
                                                            {user.description || "-"}
                                                        </td>
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
                    </div>

                    {/* Modal */}
                    {selectedRequest && renderModal()}

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
