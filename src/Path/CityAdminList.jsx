import React, { useEffect, useState } from "react";
import CreateAdmin from "../Components/CreateAdmin";
import SideBar from "../Components/SideBar";
import { role } from "../Constants/role";
// import { fetchCreatedAdmins } from "../Services/SuperAdminApi";
import { useTranslation } from "react-i18next";
import { fetchCreatedAdmins } from "../Services/SuperAdminApi";

const CreatedAdminsList = () => {
    const [admins, setAdmins] = useState([]);
    const { t } = useTranslation();
    const [showModal, setShowModal] = useState(false);

    const fetchCreatedUserList = async () => {
        try {
            const res = await fetchCreatedAdmins();
            if (res.data) {
                setAdmins(res?.data?.data);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleAddAdmin = () => {
        setShowModal(false);
        fetchCreatedUserList();
    };

    useEffect(() => {
        fetchCreatedUserList();
    }, []);
    return (
        <div className="bg-gray-800 body-font relative min-h-screen">
            <SideBar />
            <div className="container w-auto px-5 py-2">
                <div className="max-w-5xl mx-auto p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-white">Admin {t("list")}</h1>
                        <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
                            onClick={() => setShowModal(true)}
                        >
                            + {t("Createcity")} Admin
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-xl shadow">
                        <table className="min-w-full bg-white">
                            <thead className="bg-gray-100 text-left">
                                <tr>
                                    <th key="email" className="py-3 px-4">
                                        Email
                                    </th>
                                    <th key="role" className="py-3 px-4">
                                        {t("role")}
                                    </th>
                                    <th key="createdAt" className="py-3 px-4">
                                        {t("createdAt")}
                                    </th>
                                    <th key="onboarded" className="py-3 px-4">
                                        {t("onboarded")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins?.length === 0 && (
                                    <tr className="border-t hover:bg-gray-50 text-center">
                                        <td colSpan={4} className="py-4 px-6 text-gray-500">
                                            No Admin Created
                                        </td>
                                    </tr>
                                )}
                                {admins?.map((admin) => (
                                    <tr key={admin.email} className="border-t hover:bg-gray-50">
                                        <td className="py-3 px-4">{admin.email}</td>
                                        <td className="py-3 px-4">
                                            {(() => {
                                                const roleKey = Object.keys(role).find(
                                                    (key) => role[key] === admin.roleId
                                                );
                                                return roleKey === "TerminalAdmin"
                                                    ? "City Admin"
                                                    : roleKey;
                                            })()}
                                        </td>
                                        <td className="py-3 px-4 capitalize">
                                            {new Intl.DateTimeFormat("de-DE", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            }).format(Date.parse(admin.createdAt))}
                                        </td>
                                        <td className="py-3 px-4">
                                            <label className="inline-flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={admin.onBoarded}
                                                    // onChange={() => toggleActiveStatus(admin.id)}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition duration-300 relative">
                                                    <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 transform peer-checked:translate-x-5" />
                                                </div>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white rounded-2xl p-6 max-w-md w-full relative">
                                <button
                                    className="absolute top-2 right-3 text-gray-500 hover:text-black text-2xl"
                                    onClick={() => setShowModal(false)}
                                >
                                    &times;
                                </button>
                                <CreateAdmin onSuccess={handleAddAdmin} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CreatedAdminsList;
