import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import SideBar from "../Components/SideBar";
import { getCityById } from "../Services/citiesApi";
import { fetchUsers } from "../Services/usersApi";
import { getAdmins, postAdminData, deleteAdmin } from "../Services/AdminApi";
import Alert from "../Components/Alert";
import { useTranslation } from "react-i18next";

function CityAdmins() {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const [cityId, setCityId] = useState(null);
    const [city, setCity] = useState(null);
    const [admins, setAdmins] = useState([]);
    const [filteredAdmins, setFilteredAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [newAdmin, setNewAdmin] = useState({
        userId: "",
        name: "",
        username: "",
        email: "",
    });

    const [showConfirmationModal, setShowConfirmationModal] = useState({
        visible: false,
        userId: null,
        onConfirm: null,
        onCancel: null,
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [dropdownInput, setDropdownInput] = useState("");

    const filteredUsers = users.filter((user) =>
        (user.name || user.username || "")
            .toLowerCase()
            .includes(dropdownInput.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchAdmins = async (id, search = "", page = 1) => {
        try {
            setLoading(true);
            const response = await getAdmins(id, search, page, pageSize);
            const adminsData = response.data?.data || [];
            const total = response.data?.count;
            setAdmins(adminsData);
            setFilteredAdmins(adminsData);
            setTotalPages(Math.ceil(total / pageSize));
        } catch (err) {
            setError(t("failedtoloadadmins"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (cityId) {
            fetchAdmins(cityId, searchTerm, currentPage);
        }
    }, [searchTerm, currentPage, cityId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                const id = searchParams.get("cityId");
                if (!id) {
                    navigate("/AllCities");
                    return;
                }

                setCityId(id);
                const cityResponse = await getCityById(id);
                setCity(cityResponse.data?.data || null);

                await fetchAdmins(id);

                const usersResponse = await fetchUsers();
                setUsers(usersResponse.data?.data || []);
            } catch (err) {
                setError(t("failedtoloadata"));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location.search, navigate]);

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
                navigate("/AllCities");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success, navigate]);

    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => setError(null), 1000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    useEffect(() => {
        if (searchTerm === "") {
            setFilteredAdmins(admins);
        } else {
            const filtered = admins.filter((admin) =>
                (admin.name || admin.username || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
            setFilteredAdmins(filtered);
        }
    }, [searchTerm, admins]);

    const handleUserSelect = (selectedOption) => {
        if (selectedOption) {
            const userId = selectedOption.value;
            const selectedUser = users.find((user) => user.id === userId);

            if (selectedUser) {
                setNewAdmin({
                    userId: selectedUser.id,
                    name: selectedUser.name || selectedUser.username || "",
                    username: selectedUser.username || "",
                    email: selectedUser.email || "",
                });
            }
        } else {
            setNewAdmin({
                userId: "",
                name: "",
                username: "",
                email: "",
            });
            setDropdownInput("");
        }
    };

    const handleAddAdmin = async () => {
        if (!newAdmin.userId) {
            setError(t("pleaseselectuser"));
            return;
        }

        try {
            setLoading(true);
            await postAdminData(cityId, {
                userId: newAdmin.userId,
                username: newAdmin.username,
                email: newAdmin.email,
            });
            await fetchAdmins(cityId);
            setNewAdmin({ userId: "", name: "", username: "", email: "" });
            setSuccess(t("adminaddedsuccessfully"));
        } catch (err) {
            setError(err.response?.data?.message || t("failedtoaddadmin"));
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAdmin = (userId) => {
        setShowConfirmationModal({
            visible: true,
            userId: userId,
            onConfirm: async () => {
                try {
                    setLoading(true);
                    await deleteAdmin(cityId, userId);
                    await fetchAdmins(cityId);

                    setSuccess(t("admindeletedsuccessfully"));
                } catch (err) {
                    setError(err.response?.data?.message || t("failedtodeleteadmin"));
                    console.error("Error deleting admin:", err);
                } finally {
                    setLoading(false);
                    setShowConfirmationModal({
                        visible: false,
                        userId: null,
                        onConfirm: null,
                        onCancel: null,
                    });
                }
            },
            onCancel: () => {
                setShowConfirmationModal({
                    visible: false,
                    userId: null,
                    onConfirm: null,
                    onCancel: null,
                });
            },
        });
    };

    const renderAdminList = () => {
        if (filteredAdmins.length === 0) {
            return (
                <div className="border rounded-lg p-4 mb-4 bg-gray-50 text-center">
                    <p className="text-gray-500 italic">
                        {searchTerm ? t("noMatchingAdmins") : t("noAdmins")}
                    </p>
                </div>
            );
        }

        return (
            <div className="overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-center">
                                {t("name")}
                            </th>
                            <th scope="col" className="px-6 py-4 text-center">
                                {t("username")}
                            </th>
                            <th scope="col" className="px-6 py-4 text-center">
                                {t("email")}
                            </th>
                            <th scope="col" className="px-6 py-4 text-center text-right">
                                {t("actions")}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAdmins
                            .map((admin) => ({
                                id: admin.id,
                                userId: admin.userId || admin.id,
                                name: admin.name || admin.username,
                                username: admin.username,
                                email: admin.email,
                            }))
                            .map((admin) => (
                                <tr
                                    key={admin.id}
                                    className="bg-white border-b hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 text-center font-medium text-gray-900 whitespace-nowrap">
                                        {admin.name}
                                    </td>
                                    <td className="px-6 py-4 text-center">{admin.username}</td>
                                    <td className="px-6 py-4 text-center">{admin.email}</td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex justify-end space-x-3">
                                            <button
                                                onClick={() => handleDeleteAdmin(admin.userId)}
                                                className="font-medium text-red-600 hover:text-red-800"
                                                title="Delete admin"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="1em"
                                                    viewBox="0 0 640 512"
                                                    className="w-6 h-6 fill-current transition-transform duration-300 transform hover:scale-110"
                                                >
                                                    <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>

                                    {showConfirmationModal.visible && (
                                        <div className="fixed z-50 inset-0 flex items-center justify-center overflow-y-auto">
                                            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                                <div
                                                    className="fixed inset-0 transition-opacity"
                                                    aria-hidden="true"
                                                >
                                                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
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
                                                                <h3 className="text-lg leading-6 font-medium text-slate-800">
                                                                    {t("confirmDeleteTitle")}
                                                                </h3>
                                                                <div className="mt-2">
                                                                    <p className="text-sm text-gray-500">
                                                                        {t("confirmDeleteMessageadmin")}
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
                                </tr>
                            ))}
                    </tbody>
                </table>

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

                    <span className="px-4 py-1 text-sm text-gray-700">
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
            </div>
        );
    };

    if (loading && !city) {
        return (
            <section className="bg-gray-900 body-font relative min-h-screen">
                <SideBar />
                <div className="container w-auto px-5 py-2 bg-slate-900">
                    <div className="bg-white mt-4 p-6">
                        <p>{t("loading")}</p>
                    </div>
                </div>
            </section>
        );
    }

    if (!city) {
        return (
            <section className="bg-gray-900 body-font relative min-h-screen">
                <SideBar />
                <div className="container w-auto px-5 py-2 bg-slate-900">
                    <div className="bg-white mt-4 p-6">
                        <p>{t("cityNotFound")}</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="bg-gray-900 body-font relative min-h-screen">
            <SideBar />

            <div className="container w-auto px-5 py-2 bg-slate-900">
                <div className="bg-white mt-4 p-6 space-y-6">
                    <h1 className="text-2xl font-bold text-gray-900">
                        {t("cityadmintitle")}
                    </h1>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">{t("cityInfo")}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {" "}
                                    {t("cityName")}
                                </label>
                                <input
                                    type="text"
                                    value={city.name || ""}
                                    readOnly
                                    className="mt-1 border p-3 bg-white text-gray-800 border-gray-700 shadow-md placeholder:text-base duration-300 border-gray-300 rounded-lg w-full"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Moved Add Admin section up */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="text-lg font-medium mb-3">{t("addNewAdmin")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t("user")}
                                </label>
                                <div>
                                    <div className="relative mb-4" ref={dropdownRef}>
                                        <input
                                            type="text"
                                            value={dropdownInput}
                                            onChange={(e) => {
                                                setDropdownInput(e.target.value);
                                                setIsDropdownOpen(true);
                                            }}
                                            onFocus={() => setIsDropdownOpen(true)}
                                            placeholder={t("placeholderuserselect")}
                                            className="mt-1 border p-3 bg-white text-gray-800 border-gray-700 shadow-md placeholder:text-base duration-300 border-gray-300 rounded-lg w-full"
                                        />
                                        {newAdmin.name && (
                                            <div
                                                className="absolute right-3 top-3 cursor-pointer text-red-600"
                                                onClick={() => {
                                                    handleUserSelect(null);
                                                    setDropdownInput("");
                                                }}
                                            >
                                                &times;
                                            </div>
                                        )}

                                        {isDropdownOpen && (
                                            <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto border border-gray-700">
                                                {filteredUsers.length === 0 ? (
                                                    <div className="px-3 py-2 text-gray-500 italic">
                                                        {t("noUserFound")}
                                                    </div>
                                                ) : (
                                                    filteredUsers.map((user) => (
                                                        <div
                                                            key={user.id}
                                                            onClick={() => {
                                                                handleUserSelect({ value: user.id });
                                                                setDropdownInput(
                                                                    user.name || user.username || ""
                                                                );
                                                                setIsDropdownOpen(false);
                                                            }}
                                                            className="cursor-pointer px-3 py-2 bg-gray-100 hover:bg-teal-100 text-gray-800"
                                                        >
                                                            {user.name || user.username}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t("username")}
                                </label>
                                <input
                                    type="text"
                                    value={newAdmin.username}
                                    readOnly
                                    className=" mt-1 border p-3 bg-white text-gray-800 border-gray-700 shadow-md placeholder:text-base duration-300 border-gray-300 rounded-lg w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t("email")}
                                </label>
                                <input
                                    type="email"
                                    value={newAdmin.email}
                                    readOnly
                                    className="mt-1 border p-3 bg-white text-gray-800 border-gray-700 shadow-md placeholder:text-base duration-300 border-gray-300 rounded-lg w-full"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleAddAdmin}
                                disabled={!newAdmin.userId}
                                className="bg-black font-md text-gray-300 shadow-lg p-2 text-white rounded-lg w-full disabled:opacity-60"
                            >
                                {t("saveAdmin")}
                            </button>
                        </div>
                    </div>

                    {/* Moved Admin Details section down */}
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                            <h2 className="text-xl font-semibold">{t("adminDetails")}</h2>
                            <div className="relative w-full md:w-64">
                                {/* Search Icon (left side inside input) */}
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-400"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M11 4a7 7 0 100 14 7 7 0 000-14zM21 21l-4.35-4.35"
                                        />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder={t("searchbyname")}
                                    value={searchTerm}
                                    onChange={(e) => {
                                        setSearchTerm(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                    className="pl-10 pr-10 border p-3 bg-white text-gray-800 border-gray-700 shadow-md placeholder:text-base duration-300 border-gray-300 rounded-lg w-full"
                                />

                                {searchTerm && (
                                    <button
                                        onClick={() => setSearchTerm("")}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        <svg
                                            className="h-5 w-5 text-gray-400"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>

                        {renderAdminList()}
                    </div>

                    {error && (
                        <div className="mt-4">
                            <Alert
                                type="danger"
                                message={error}
                                onClose={() => setError(null)}
                            />
                        </div>
                    )}
                    {success && (
                        <div className="mt-4">
                            <Alert
                                type="success"
                                message={success}
                                onClose={() => setSuccess(null)}
                            />
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

export default CityAdmins;