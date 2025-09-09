import React, { useState, useEffect } from "react";
import SideBar from "../Components/SideBar";
import {
    getCategory,
    postCatgeoryData,
    deleteCategory,
} from "../Services/CategoryApi";
import { getCityById } from "../Services/citiesApi";
import { useTranslation } from "react-i18next";

const CategorySelector = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [cityId, setCityId] = useState(null);
    const [includeAllSubcategories, setIncludeAllSubcategories] = useState(false);
    const { t } = useTranslation();
    const [showConfirmationModal, setShowConfirmationModal] = useState({
        visible: false,
        categoryId: null,
        onConfirm: null,
        onCancel: null,
    });
    const [errorResponse, setErrorResponse] = useState()
    const fetchCityData = async (id) => {
        try {
            const cityResponse = await getCityById(id);
            const city = cityResponse.data.data;

            if (city.categories && city.categories.length > 0) {
                const preselected = city.categories.map((cat) => ({
                    id: cat.id,
                    name: cat.name,
                    parentCategoryId: cat.parentCategoryId || null,
                    parentCategoryName: cat.parentCategoryName || "",
                    shouldIncludeSubCategories: cat.shouldIncludeSubCategories || false,
                }));
                setSelectedCategories(preselected);
            } else {
                setSelectedCategories([]);
            }
        } catch (error) {
            console.error("Error fetching city data:", error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const cityIdParam = searchParams.get("cityId");

            if (cityIdParam) {
                const parsedCityId = parseInt(cityIdParam);
                setCityId(parsedCityId);
                await fetchCityData(parsedCityId);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await getCategory();
                const apiData = response.data.data;
                setCategories(apiData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();
    }, []);

    const handleCategoryChange = (e) => {
        setSelectedCategory(Number(e.target.value));
        setSelectedSubcategory("");
    };

    const handleSubcategoryChange = (e) => {
        setSelectedSubcategory(Number(e.target.value));
    };

    const handleAddCategory = async () => {
        if (!selectedCategory || !cityId) return;

        const category = categories.find((c) => c.id === selectedCategory);
        if (!category) return;

        try {
            await postCatgeoryData(cityId, {
                categoryId: category.id,
                shouldIncludeSubCategories: includeAllSubcategories,
            });

            await fetchCityData(cityId); // <-- refresh selected categories

            setSelectedCategory("");
            setIncludeAllSubcategories(false);
        } catch (error) {
            console.error("Error posting subcategory:", error);
            const { errorCode } = error.response?.data || {};

            let userMessage;
            if (errorCode === 8003) {
                userMessage = t("cityAlreadyHasCategory");
            } else if (errorCode === 1200) {
                userMessage = t("cityAdminNotAutorized")
            }
            else {
                userMessage = t("changesNotSaved");
            }

            setErrorMessage(userMessage);
            setTimeout(() => setErrorMessage(false), 3000);
        }
    };

    const handleAddSubcategory = async () => {
        if (!selectedSubcategory || !cityId) return;

        const parentCategory = categories.find((c) =>
            c.children?.some((sc) => sc.id === selectedSubcategory)
        );
        if (!parentCategory) return;

        const subcategory = parentCategory.children.find(
            (sc) => sc.id === selectedSubcategory
        );
        if (!subcategory) return;

        try {
            await postCatgeoryData(cityId, {
                categoryId: subcategory.id,
                shouldIncludeSubCategories: false,
            });

            await fetchCityData(cityId); // <-- refresh selected categories

            setSelectedSubcategory("");
        } catch (error) {
            console.error("Error posting subcategory:", error);
            const { errorCode } = error.response?.data || {};

            let userMessage;
            if (errorCode === 8003) {
                userMessage = t("cityAlreadyHasCategory");
            }
            else if (errorCode === 1200) {
                userMessage = t("cityAdminNotAutorized")
            } else {
                userMessage = t("changesNotSaved");
            }

            setErrorMessage(userMessage);
            setTimeout(() => setErrorMessage(false), 5000);
        }
    };
    // function handleFailure(message) {
    //     setErrorMessage(message);
    //     setTimeout(() => {
    //         setErrorMessage('');
    //         setShowConfirmationModal({
    //             visible: false,
    //             categoryId: null,
    //             onConfirm: null,
    //             onCancel: null,
    //         });
    //     }, 2000); // ⏳ slightly longer so user can read
    // }

    const handleRemoveCategory = (id) => {
        setShowConfirmationModal({
            visible: true,
            categoryId: id,
            onConfirm: async () => {
                if (!cityId) return;
                try {
                    await deleteCategory(cityId, { categoryId: id });
                    await fetchCityData(cityId);
                    setShowConfirmationModal({
                        visible: false,
                        categoryId: null,
                        onConfirm: null,
                        onCancel: null,
                    });
                } catch (e) {
                    const status = e?.response?.data?.errorCode;
                    let userMessage;
                    if (status === 1200) {
                        userMessage = t("cityAdminNotAutorized")
                    } else {
                        userMessage = t("changesNotSaved")
                    }
                    setErrorResponse(userMessage);
                    setTimeout(() => {
                        setErrorResponse('');
                        setShowConfirmationModal({
                            visible: false,
                            categoryId: null,
                            onConfirm: null,
                            onCancel: null,
                        });
                    }, 2000);
                }

            },
            onCancel: () => {
                setShowConfirmationModal({
                    visible: false,
                    categoryId: null,
                    onConfirm: null,
                    onCancel: null,
                });
            },
        });
    };
    const getSubcategories = () => {
        if (!selectedCategory) return [];
        const category = categories.find((c) => c.id === selectedCategory);
        return category?.children || [];
    };

    return (
        <section className="bg-gray-900 body-font relative min-h-screen">
            <SideBar />
            <div className="container w-auto px-5 py-2 bg-slate-900">
                <div className="bg-white mt-4 p-6 space-y-10">
                    <h2 className="text-gray-900 text-lg mb-4 font-medium title-font">
                        {t("categorySelection")}
                        <div className="my-4 bg-gray-600 h-[1px]"></div>
                    </h2>

                    {/* Selected Categories */}
                    <div className="mb-6">
                        <h3 className="text-md font-semibold mb-2 text-gray-800">
                            {t("selectedCategories")}
                        </h3>
                        {selectedCategories.length === 0 ? (
                            <p className="text-gray-500">{t("noCategoriesSelected")}</p>
                        ) : (
                            <div className="grid grid-row-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
                                {selectedCategories.map((category) => (
                                    <div key={category.id} className="w-full">
                                        <div className="p-2 flex justify-between items-center bg-blue-200 border border-blue-600 rounded-lg cursor-pointer transition-all hover:bg-blue-300">
                                            <span className="block break-words text-sm font-medium text-blue-600">
                                                {category.name}
                                            </span>
                                            <div className="group relative ml-4">
                                                <a
                                                    className="font-medium text-red-600 px-2 cursor-pointer"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveCategory(category.id);
                                                    }}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        height="1em"
                                                        viewBox="0 0 640 512"
                                                        className="w-6 h-6 fill-current transition-transform duration-300 transform hover:scale-110"
                                                    >
                                                        <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z" />
                                                    </svg>
                                                </a>
                                                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-max bg-black text-white text-sm py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    {t("delete")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
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
                                                        {t("confirmDeleteTitledelete")}
                                                    </h3>
                                                    <div className="mt-2">
                                                        {errorResponse ? <p className="text-sm text-red-500">
                                                            {errorResponse}
                                                        </p> : <p className="text-sm text-gray-500">
                                                            {t("confirmDeleteMessagecategory")}
                                                        </p>}

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
                    </div>

                    {/* Add Category Section */}
                    <div className="mb-6 border rounded-lg p-4 bg-gray-50">
                        <h3 className="text-md font-semibold mb-2 text-gray-800">
                            {t("addCategory")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">{t("selectCategory")}</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={handleAddCategory}
                                disabled={!selectedCategory}
                                className="bg-black font-md text-gray-300 shadow-lg p-2 text-white rounded-lg w-full disabled:opacity-60"
                            >
                                {t("addCategory")}
                            </button>
                        </div>
                        {selectedCategory && (
                            <div className="flex items-center mt-3">
                                <input
                                    type="checkbox"
                                    id="includeAllSubcategories"
                                    checked={includeAllSubcategories}
                                    onChange={(e) => setIncludeAllSubcategories(e.target.checked)}
                                    className="h-4 w-4 text-blue-600 rounded"
                                />
                                <label
                                    htmlFor="includeAllSubcategories"
                                    className="ml-2 text-sm text-gray-700"
                                >
                                    {t("includeAllSubcategories")}
                                </label>
                            </div>
                        )}
                    </div>

                    {/* Add Subcategory Section */}
                    <div className="mb-6 border rounded-lg p-4 bg-gray-50">
                        <h3 className="text-md font-semibold mb-2 text-gray-800">
                            {t("addSubcategory")}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <select
                                value={selectedSubcategory}
                                onChange={handleSubcategoryChange}
                                className="w-full border p-2 rounded"
                            >
                                <option value="">{t("selectSubcategory")}</option>
                                {getSubcategories().length > 0 ? (
                                    getSubcategories().map((subcategory) => (
                                        <option key={subcategory.id} value={subcategory.id}>
                                            {subcategory.name}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>
                                        {t("noSubcategories")}
                                    </option>
                                )}
                            </select>
                            <button
                                onClick={handleAddSubcategory}
                                disabled={!selectedSubcategory}
                                className="bg-black font-md text-gray-300 shadow-lg p-2 text-white rounded-lg w-full disabled:opacity-60"
                            >
                                {t("addSubcategory")}
                            </button>
                        </div>
                    </div>
                    {errorMessage && (
                        <div className="w-full bg-red-200 border text-red-700 px-6 py-3 rounded">
                            {errorMessage}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CategorySelector;
