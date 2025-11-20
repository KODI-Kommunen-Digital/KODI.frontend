import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import SideBar from "../Components/SideBar";
import { getCityByCityAdmins, createCityUsersPermissions, getCityUsersPermissions, updateCityUserPermissions, deleteCityUsers, getModeratorProfile } from "../Services/citiesApi";
import { fetchUsers, getUserId } from "../Services/usersApi";
import Alert from "../Components/Alert";
import { useTranslation } from "react-i18next";
import CityDropDown from "../Components/CityDropDown";

function CreateUsers() {
    const { t } = useTranslation();
    const [cities, setCities] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [filteredAdmins, setFilteredAdmins] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const cityAdminUserId = getUserId();

    const [newAdmin, setNewAdmin] = useState({
        userId: "",
        name: "",
        username: "",
        email: "",
        permissions: [] // Will store array of selected permissions
    });

    const [showConfirmationModal, setShowConfirmationModal] = useState({
        visible: false,
        userId: null,
        onConfirm: null,
        onCancel: null,
    });
    // Edit modal states

    const [showEditModal, setShowEditModal] = useState({
        visible: false,
        userId: null,
        adminData: null,
        onConfirm: null,
        onCancel: null,
    });
    // Edit modal states
    const [editSelectedNewsEvent, setEditSelectedNewsEvent] = useState([]);
    // Edit modal states   

    const [isEditNewsEventDropdownOpen, setIsEditNewsEventDropdownOpen] = useState(false);
    const editNewsEventDropdownRef = useRef(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const [dropdownInput, setDropdownInput] = useState("");

    // City dropdown states
    const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
    // City dropdown input state
    const [cityDropdownInput, setCityDropdownInput] = useState("");
    // set selected city for dropdown
    const [selectedCityForDropdown, setSelectedCityForDropdown] = useState([]);
    const cityDropdownRef = useRef(null);
    // Edit modal-specific city dropdown states (distinct naming)
    const [isEditCityDropdownOpen, setIsEditCityDropdownOpen] = useState(false);
    const [editCityDropdownInput, setEditCityDropdownInput] = useState("");
    const [editSelectedCityForDropdown, setEditSelectedCityForDropdown] = useState([]);
    const editCityDropdownRef = useRef(null);
    // News/Event dropdown states
    const [isNewsEventDropdownOpen, setIsNewsEventDropdownOpen] = useState(false);
    // News/Event dropdown ref
    const [selectedNewsEvent, setSelectedNewsEvent] = useState(null);
    const newsEventDropdownRef = useRef(null);


    // Permission options array
    const permissionOptions = [
        {
            key: 'create_news',
            value: 'create_news',
            label: t('News'),
            icon: (
                <svg className="w-4 h-4 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                    <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                </svg>
            )
        },
        {
            key: 'create_event',
            value: 'create_event',
            label: t('Events'),
            icon: (
                <svg className="w-4 h-4 mr-2 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
            )
        }
    ];

    const filteredUsers = useMemo(() => {
        return users?.filter((user) =>
            (user.name || user.username || "")
                .toLowerCase()
                .includes(dropdownInput.toLowerCase())
        );
    }, [dropdownInput, users]);


    const filteredCities = useMemo(() => {
        return cities?.filter((city) => {
            // If no input or dropdown just opened, show all cities
            if (!cityDropdownInput || cityDropdownInput === "") {
                return true;
            }
            // If user is typing/searching, filter by input
            return (city.name || "")
                .toLowerCase()
                .includes(cityDropdownInput.toLowerCase());
        });
    }, [cities, cityDropdownInput]);

    const editFilteredCities = useMemo(() => {
        return cities?.filter((city) => {
            if (!editCityDropdownInput || editCityDropdownInput === "") {
                return true;
            }
            return (city.name || "").toLowerCase().includes(editCityDropdownInput.toLowerCase());
        });
    }, [cities, editCityDropdownInput]);

    const cityUserPermisssions = useCallback(async (cityAdminUserId) => {

        const value = await getModeratorProfile(cityAdminUserId);
        return value;
    }, [])

    useEffect(() => {
        cityUserPermisssions(cityAdminUserId)
    }, [cityAdminUserId])
    // dropdown outside click handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
            if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target)) {
                setIsCityDropdownOpen(false);
            }
            if (newsEventDropdownRef.current && !newsEventDropdownRef.current.contains(event.target)) {
                setIsNewsEventDropdownOpen(false);
            }
            if (editNewsEventDropdownRef.current && !editNewsEventDropdownRef.current.contains(event.target)) {
                setIsEditNewsEventDropdownOpen(false);
            }
            if (editCityDropdownRef.current && !editCityDropdownRef.current.contains(event.target)) {
                setIsEditCityDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);


    const getCityUsers = useCallback(async (searchTerm = "", page = 1, pageSize = 5) => {
        try {
            setLoading(true);
            const response = await getCityUsersPermissions(searchTerm, page, pageSize);
            const adminsData = response?.data?.data || [];
            const total = response?.data?.count;

            setAdmins(adminsData);
            setFilteredAdmins(adminsData);

            setTotalPages(Math.ceil(total / pageSize));
        } catch (err) {
            setError(t("failedtoloadusers"));
        } finally {
            setLoading(false);
        }
    }, [getCityUsersPermissions, pageSize, t]); // dependencies

    useEffect(() => {
        // if (cityId) {
        getCityUsers(searchTerm, currentPage, pageSize);
        // }
    }, [searchTerm, currentPage, pageSize]);

    useEffect(() => {
        const fetchData = async () => {
            try {

                const cityResponse1 = await getCityByCityAdmins(cityAdminUserId);
                if (cityResponse1?.data.status === "success") {
                    if (cityResponse1?.data?.data.length === 1) {
                        setCities([cityResponse1?.data?.data[0]] || []);
                        setSelectedCityForDropdown([cityResponse1?.data?.data[0]]);

                    } else {
                        setCities(cityResponse1?.data?.data || []);
                    }
                }
                await getCityUsers();

                const usersResponse = await fetchUsers();
                setUsers(usersResponse.data?.data || []);
            } catch (err) {
                setError(t("failedtoloadata"));
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [cityAdminUserId]);


    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setSuccess(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

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
            const filtered = admins?.filter((admin) =>
                (admin.name || admin.username || "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
            );
            setFilteredAdmins(filtered);
        }
    }, [searchTerm, admins]);


    const handleUserSelect = useCallback((selectedOption) => {
        if (selectedOption) {
            const userId = selectedOption.value;
            const selectedUser = users?.find((user) => user.id === userId);

            if (selectedUser) {
                setNewAdmin({
                    userId: selectedUser.id,
                    name: selectedUser.name || selectedUser.username || "",
                    username: selectedUser.username || "",
                    email: selectedUser.email || "",
                    permissions: selectedUser.Permission || [] // Set user's existing permissions
                });

                // Auto-fill the dropdown based on user's permissions
                setSelectedNewsEvent(selectedUser.Permission || []);
            }
        } else {
            setNewAdmin({
                userId: "",
                name: "",
                username: "",
                email: "",
                permissions: [],
            });
            setSelectedNewsEvent(null); // Reset dropdown selection
            setDropdownInput("");
        }
    }, [users]);

    // remove city from dropdown handler  

    const handleCitySelect = useCallback((selectedCity) => {
        if (selectedCity) {
            const currentCities = [...selectedCityForDropdown];
            let updatedCities;

            // Toggle city - if already selected, remove it; if not selected, add it
            const cityExists = currentCities.find(city => city.id === selectedCity.id);
            if (cityExists) {
                updatedCities = currentCities.filter(city => city.id !== selectedCity.id);
            } else {
                updatedCities = [...currentCities, selectedCity];
            }

            setSelectedCityForDropdown(updatedCities);
            setCityDropdownInput(""); // Clear search input after selection
            // setIsCityDropdownOpen(false); // Close dropdown after selection

        } else {
            setSelectedCityForDropdown([]);
            setCityDropdownInput("");
            setNewAdmin({
                userId: "",
                name: "",
                username: "",
                email: "",
                permissions: [],
            });
            setSelectedNewsEvent(null); // Reset dropdown selection
            setDropdownInput("");
        }
    }, [selectedCityForDropdown]);

    const handleEditCitySelect = useCallback((selectedCity) => {
        if (selectedCity) {
            const currentCities = [...editSelectedCityForDropdown];
            let updatedCities;

            const cityExists = currentCities.find(city => city.id === selectedCity.id);
            if (cityExists) {
                updatedCities = currentCities.filter(city => city.id !== selectedCity.id);
            } else {
                updatedCities = [...currentCities, selectedCity];
            }

            setEditSelectedCityForDropdown(updatedCities);
            setEditCityDropdownInput("");
        } else {
            setEditSelectedCityForDropdown([]);
            setEditCityDropdownInput("");
        }
    }, [editSelectedCityForDropdown]);

    // News Event dropdown select handler

    const handleNewsEventSelect = useCallback((option) => {
        const currentPermissions = Array.isArray(selectedNewsEvent) ? selectedNewsEvent : [];
        let updatedPermissions;
        // Toggle permission - if already selected, remove it; if not selected, add it
        if (currentPermissions.includes(option.key)) {
            updatedPermissions = currentPermissions.filter(perm => perm !== option.key);
        } else {
            updatedPermissions = [...currentPermissions, option.key];
        }

        setSelectedNewsEvent(updatedPermissions);
        // Don't close dropdown for multi-select - user can select multiple
        // setIsNewsEventDropdownOpen(false);

        // Update newAdmin state with selected permissions
        setNewAdmin(prev => ({
            ...prev,
            permissions: updatedPermissions
        }));
    }, [selectedNewsEvent]);


    // for submit data 
    const handleAddAdmin = async () => {
        if (!newAdmin.userId) {
            setError(t("pleaseselectuser"));
            return;
        }

        try {
            setLoading(true);
            await createCityUsersPermissions({
                userId: newAdmin.userId,
                permissions: newAdmin.permissions, // Send the permissions array
                cities: selectedCityForDropdown?.map(city => city.id) || []
            });
            await getCityUsers();
            setNewAdmin({ userId: "", name: "", username: "", email: "", permissions: [] });
            if (selectedCityForDropdown?.length > 1) {
                setSelectedCityForDropdown([])
            } setSelectedNewsEvent(null); // Reset dropdown selection
            setSuccess(t("userPermissionsUpdated"));
        } catch (err) {
            if (err?.response?.data?.message === "Request failed with status code 500") {
                setError(t("userPermissionsError"));

            }
            else if (err?.response?.data?.message === "Error: User is already a moderator, admin, or city admin") {
                setError(t("userAlreadyAdmin"));
            }
            else {
                setError(err.message || t("failedtoaddPermission"));
            }

        } finally {
            setLoading(false);
            setNewAdmin({ userId: "", name: "", username: "", email: "", permissions: [] });
            if (selectedCityForDropdown?.length > 1) {
                setSelectedCityForDropdown([])
            }
            setCurrentPage(1);
            setSelectedNewsEvent(null)
            setDropdownInput("");
        }
    };


    const handleDeleteAdmin = (userId) => {
        setShowConfirmationModal({
            visible: true,
            userId: userId,
            onConfirm: async () => {
                try {
                    setLoading(true);
                    await deleteCityUsers(userId);

                    await getCityUsers();

                    setSuccess(t("userdeletedsuccessfully"));
                } catch (err) {
                    setError(err.response?.data?.message || t("failedtodeleteuser"));
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

    const handleEditNewsEventSelect = (option) => {
        const currentPermissions = Array.isArray(editSelectedNewsEvent) ? editSelectedNewsEvent : [];
        let updatedPermissions;

        // Toggle permission - if already selected, remove it; if not selected, add it
        if (currentPermissions.includes(option.key)) {
            updatedPermissions = currentPermissions.filter(perm => perm !== option.key);
        } else {
            updatedPermissions = [...currentPermissions, option.key];
        }

        setEditSelectedNewsEvent(updatedPermissions);
    };

    const handleEditUsers = (admin) => {
        // Set current admin's permissions in the edit dropdown
        setEditSelectedNewsEvent(admin?.permissions || []);
        setEditSelectedCityForDropdown(admin?.cities || [])
        setShowEditModal({
            visible: true,
            userId: admin.userId,
            adminData: admin,
            onConfirm: null,
            onCancel: () => {
                setShowEditModal({
                    visible: false,
                    userId: null,
                    adminData: null,
                    onConfirm: null,
                    onCancel: null,
                });
                setEditSelectedNewsEvent(null);
            },
        });
    }

    const handleEditConfirm = async () => {
        try {
            setLoading(true);
            const userId = showEditModal.userId || showEditModal.adminData?.userId;
            await updateCityUserPermissions({
                userId,
                permissions: editSelectedNewsEvent || [],
                cities: (editSelectedCityForDropdown || []).map((c) => c.id ?? c),
            });
            setShowEditModal({
                visible: false,
                userId: null,
                adminData: null,
                onConfirm: null,
                onCancel: null,
            });
            setCurrentPage(1);
            setSearchTerm("");
            await getCityUsers();

            setSuccess(t("user_updated_successfully") || "User updated successfully");
        } catch (err) {
            setError(err.response?.data?.message || t("failedtoupdateuser") || "Failed to update User");
        } finally {
            setLoading(false);
        }
    };

    const renderAdminList = () => {
        if (filteredAdmins.length === 0) {
            return (
                <div className="border rounded-lg p-4 mb-4 bg-gray-50 text-center">
                    <p className="text-gray-500 italic">
                        {searchTerm ? t("noMatchingUsers") : t("noUsers")}
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
                            <th scope="col" className="px-6 py-4 text-right">
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
                                permissions: admin.permissions,
                                cities: admin.cities,
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

                                            <a
                                                className={`font-medium text-green-600 px-2 cursor-pointer`}
                                                style={{ fontFamily: "Poppins, sans-serif" }}
                                                onClick={() => handleEditUsers(admin)}
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="1em"
                                                    viewBox="0 0 640 512"
                                                    className="w-6 h-6 fill-current transition-transform duration-300 transform hover:scale-110"
                                                >
                                                    <path d="M362.7 19.3L314.3 67.7 444.3 197.7l48.4-48.4c25-25 25-65.5 0-90.5L453.3 19.3c-25-25-65.5-25-90.5 0zm-71 71L58.6 323.5c-10.4 10.4-18 23.3-22.2 37.4L1 481.2C-1.5 489.7 .8 498.8 7 505s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L421.7 220.3 291.7 90.3z" />
                                                </svg>
                                            </a>

                                            <button
                                                onClick={() => handleDeleteAdmin(admin.userId)}
                                                className="font-medium text-red-600 hover:text-red-800"
                                                title="Delete User"
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

    if (loading && !cities) {
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

    if (!cities) {
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
                        {t("city_staf_management")}
                    </h1>
                    <h2 className="text-xl font-semibold mb-2">{t("cityInfo")}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <CityDropDown
                            cities={cities}
                            selectedCityForDropdown={selectedCityForDropdown}
                            handleCitySelect={handleCitySelect}
                            isCityDropdownOpen={isCityDropdownOpen}
                            setIsCityDropdownOpen={setIsCityDropdownOpen}
                            cityDropdownRef={cityDropdownRef}
                            setCityDropdownInput={setCityDropdownInput}
                            t={t}
                            filteredCities={filteredCities}
                        />
                    </div>


                    {/* Moved Add Admin section up */}
                    <div className="border rounded-lg p-4 bg-gray-50">
                        <h3 className="text-lg font-medium mb-3">{t("user_permissions")}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t("user")}
                                </label>
                                <div className="relative mb-4" ref={dropdownRef}>
                                    <div
                                        className="mt-1 border p-3 pr-10 bg-white text-gray-800 border-gray-300 shadow-md duration-300 rounded-lg w-full cursor-pointer min-h-[48px] flex flex-wrap items-center gap-2 relative"
                                        onClick={() => setIsDropdownOpen(true)}
                                    >
                                        {newAdmin.name ? (
                                            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-300">
                                                {newAdmin.name}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleUserSelect(null);
                                                        setDropdownInput("");
                                                    }}
                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ) : (
                                            <input
                                                type="text"
                                                value={dropdownInput}
                                                onChange={(e) => {
                                                    setDropdownInput(e.target.value);
                                                    setIsDropdownOpen(true);
                                                }}
                                                onFocus={() => setIsDropdownOpen(true)}
                                                placeholder={t("placeholderuserselect")}
                                                name="userSearchCityAdmin"
                                                id="userSearchCityAdmin"
                                                className="flex-1 bg-transparent outline-none placeholder:text-base"
                                            />
                                        )}
                                        <svg className={`w-5 h-5 transition-transform absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {isDropdownOpen && (
                                        <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto border border-gray-700">
                                            {filteredUsers?.length === 0 ? (
                                                <div className="px-3 py-2 text-gray-500 italic">
                                                    {t("noUserFound")}
                                                </div>
                                            ) : (
                                                filteredUsers?.map((user) => (
                                                    <div
                                                        key={user.id}
                                                        onClick={() => {
                                                            handleUserSelect({ value: user.id });
                                                            setDropdownInput(
                                                                user.name || user.username || ""
                                                            );
                                                            setIsDropdownOpen(false);
                                                        }}
                                                        className={`cursor-pointer px-3 py-2 border-b border-gray-200 ${newAdmin.userId === user.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                                                    >
                                                        {user.name || user.username}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )}
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
                                    placeholder={t("username")}
                                    className=" mt-1 border p-3 bg-white text-gray-800 border-gray-300 shadow-md placeholder:text-base duration-300 rounded-lg w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t("email")}
                                </label>
                                <input
                                    type="email"
                                    value={newAdmin.email}
                                    placeholder={t("email")}
                                    readOnly
                                    className="mt-1 border p-3 bg-white text-gray-800 border-gray-300 shadow-md placeholder:text-base duration-300 rounded-lg w-full"
                                />
                            </div>
                        </div>

                        {/* News/Event Selection Dropdown */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    {t("Permission")}
                                </label>
                                <div className="relative" ref={newsEventDropdownRef}>
                                    <div
                                        onClick={() => setIsNewsEventDropdownOpen(!isNewsEventDropdownOpen)}
                                        className="mt-1 border p-3 bg-white text-gray-800 border-gray-300 shadow-md rounded-lg w-full cursor-pointer min-h-[48px] flex items-center justify-between gap-2"
                                    >
                                        <div className="flex flex-wrap items-center gap-2 flex-1">
                                            {selectedNewsEvent?.length > 0 ? (
                                                selectedNewsEvent.map(permKey => {
                                                    const permission = permissionOptions.find(opt => opt.key === permKey);
                                                    return permission && (
                                                        <span key={permKey} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-300">
                                                            {permission.label}
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleNewsEventSelect(permission);
                                                                }}
                                                                className="ml-2 text-blue-600 hover:text-blue-800"
                                                            >
                                                                ×
                                                            </button>
                                                        </span>
                                                    );
                                                })
                                            ) : (
                                                <span className="text-gray-500">{t("selectOption")}</span>
                                            )}
                                        </div>
                                        <svg className={`w-5 h-5 transition-transform flex-shrink-0 ${isNewsEventDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </div>

                                    {isNewsEventDropdownOpen && (
                                        <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg z-20 border border-gray-300">
                                            {permissionOptions.map((option) => (
                                                <div
                                                    key={option.key}
                                                    onClick={() => handleNewsEventSelect(option)}
                                                    className={`cursor-pointer px-3 py-2 hover:bg-blue-100 border-b last:border-b-0 border-gray-200 flex items-center ${selectedNewsEvent?.includes(option.key) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                                                >
                                                    <div className="flex items-center">
                                                        {option.icon}
                                                        {option.label}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={handleAddAdmin}
                                disabled={!newAdmin.userId || !newAdmin?.permissions?.length || !selectedCityForDropdown?.length}
                                className="bg-black font-md shadow-lg p-2 text-white rounded-lg w-full disabled:opacity-60"
                            >
                                {t("saveAdmin")}
                            </button>
                        </div>
                    </div>

                    {/* Moved Admin Details section down */}
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                            <h2 className="text-xl font-semibold">{t("userDetails")}</h2>
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
                                    className="pl-10 pr-10 border p-3 bg-white text-gray-800 border-gray-300 shadow-md placeholder:text-base duration-300 rounded-lg w-full"
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

                    {/* Edit Admin Modal */}
                    {showEditModal.visible && (
                        <div className="fixed z-50 inset-0 flex items-center justify-center overflow-y-auto bg-black/20 backdrop-blur-sm !mt-0">
                            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                                <h2 className="text-xl font-bold mb-4">{t("editUser")}</h2>

                                {/* Admin Info */}
                                <div className="mb-4">
                                    <label className="block font-medium text-gray-700">
                                        {t("name")}
                                    </label>
                                    <div className="w-full mt-1 border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-800">
                                        {showEditModal.adminData?.name}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block font-medium text-gray-700">
                                        {t("email")}
                                    </label>
                                    <div className="w-full mt-1 border border-gray-300 rounded px-3 py-2 bg-gray-50 text-gray-800">
                                        {showEditModal.adminData?.email}
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <CityDropDown
                                        cities={cities}
                                        selectedCityForDropdown={editSelectedCityForDropdown}
                                        handleCitySelect={handleEditCitySelect}
                                        isCityDropdownOpen={isEditCityDropdownOpen}
                                        setIsCityDropdownOpen={setIsEditCityDropdownOpen}
                                        cityDropdownRef={editCityDropdownRef}
                                        setCityDropdownInput={setEditCityDropdownInput}
                                        t={t}
                                        filteredCities={editFilteredCities}
                                        isModal={true}
                                    />
                                </div>
                                {/* Permissions Selection */}
                                <div className="mb-4">
                                    <label className="block font-medium text-gray-700">
                                        {t("Permission")}
                                    </label>
                                    <div className="relative" ref={editNewsEventDropdownRef}>
                                        <div
                                            onClick={() => setIsEditNewsEventDropdownOpen(!isEditNewsEventDropdownOpen)}
                                            className="w-full mt-1 border border-gray-300 rounded px-3 py-2 cursor-pointer min-h-[48px] flex items-center justify-between gap-2"
                                        >
                                            <div className="flex flex-wrap items-center gap-2 flex-1">
                                                {editSelectedNewsEvent?.length > 0 ? (
                                                    editSelectedNewsEvent.map(permKey => {
                                                        const permission = permissionOptions.find(opt => opt.key === permKey);
                                                        return permission && (
                                                            <span key={permKey} className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full border border-blue-300">
                                                                {permission.label}
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEditNewsEventSelect(permission);
                                                                    }}
                                                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                                                >
                                                                    ×
                                                                </button>
                                                            </span>
                                                        );
                                                    })
                                                ) : (
                                                    <span className="text-gray-500">{t("selectOption")}</span>
                                                )}
                                            </div>
                                            <svg className={`w-5 h-5 transition-transform flex-shrink-0 ${isEditNewsEventDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>

                                        {isEditNewsEventDropdownOpen && (
                                            <div className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg z-30 border border-gray-300 max-h-40 overflow-y-auto">
                                                {permissionOptions.map((option) => (
                                                    <div
                                                        key={option.key}
                                                        onClick={() => handleEditNewsEventSelect(option)}
                                                        className={`cursor-pointer px-3 py-2 hover:bg-blue-100 border-b last:border-b-0 border-gray-200 flex items-center ${editSelectedNewsEvent?.includes(option.key) ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}
                                                    >
                                                        <div className="flex items-center">
                                                            {option.icon}
                                                            {option.label}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6 space-x-3">
                                    <button
                                        onClick={showEditModal.onCancel}
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-100 sm:mt-0 sm:w-auto sm:text-sm"
                                    >
                                        {t("cancel")}
                                    </button>
                                    <button

                                        disabled={!editSelectedCityForDropdown?.length || !editSelectedNewsEvent?.length}
                                        onClick={handleEditConfirm}
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2
                                         bg-blue-800 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm
                                         disabled:opacity-60
                                         "
                                    >
                                        {t("save")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section >
    );
}

export default CreateUsers;
