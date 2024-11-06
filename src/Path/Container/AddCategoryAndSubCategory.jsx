import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../bodyContainer.css";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import Alert from "../../Components/Alert";
import { getOwnerCategory, getOwnerSubCategory, getOwnerShops, addCategory, addSubCategory, getUserRoleContainer } from "../../Services/containerApi";

function AddCategoryAndSubCategory() {
    const { t } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);
    const [categoryId, setCategoryId] = useState(0);
    const [subcategoryId, setSubcategoryId] = useState(0);
    const [errorMessage, setErrorMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [updating, setUpdating] = useState(false);
    const [storeId, setStoreId] = useState(0);
    const [stores, setStores] = useState([]);
    const navigate = useNavigate();

    const [isOwner, setIsOwner] = useState(null);
    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const roleResponse = await getUserRoleContainer();
                let roles = roleResponse.data.data;
                roles = roles.map(Number);
                if (roles.includes(101)) {
                    setIsOwner(true);
                } else {
                    setIsOwner(false);
                }
            } catch (error) {
                console.error("Error fetching user roles:", error);
                navigate("/Error");
            }
        };

        fetchUserRole();
    }, [navigate]);

    useEffect(() => {
        if (isOwner === false) {
            navigate("/Error");
        }
    }, [isOwner, navigate]);

    const fetchStores = useCallback(() => {
        getOwnerShops().then((response) => {
            const fetchedStores = response.data.data;
            setStores(fetchedStores);
        });
    }, []);

    useEffect(() => {
        fetchStores();
    }, [fetchStores]);

    useEffect(() => {
        if (storeId) {
            const fetchCategories = async () => {
                try {
                    const response = await getOwnerCategory();
                    setCategories(response.data.data || []);
                } catch (error) {
                    setErrorMessage(t("categoryFetchError"));
                }
            };
            fetchCategories();
        }
    }, [storeId, t]);

    const handleShopChange = (event) => {
        const storeId = event.target.value;
        setStoreId(storeId);
        setCategoryId(0);
        setSubCategories([]);
        setSubcategoryId(0);
    };

    const handleCategoryChange = async (event) => {
        const categoryId = event.target.value;
        setCategoryId(categoryId);
        setSubCategories([]);
        setSubcategoryId(0);

        if (categoryId !== 0) {
            try {
                const response = await getOwnerSubCategory(categoryId);
                setSubCategories(response.data.data || []);
            } catch (error) {
                setErrorMessage(t("subcategoryFetchError"));
            }
        }
    };

    const handleSubcategoryChange = (event) => {
        const subcategoryId = event.target.value;
        setSubcategoryId(subcategoryId);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (storeId && categoryId && subcategoryId) {
            setUpdating(true);
            try {
                await addCategory(parseInt(storeId), parseInt(categoryId)); // First API call for adding category

                await addSubCategory(parseInt(storeId), parseInt(subcategoryId)); // Second API call for adding subcategory

                const successMessage = t("categoryUpdated");
                setSuccessMessage(successMessage);
                setIsSuccess(true);
                setErrorMessage("");
                setTimeout(() => {
                    setSuccessMessage("");
                    navigate("/OwnerScreen");
                }, 5000);
            } catch (error) {
                if (error.response && error.response.data && error.response.data.errorCode === 2004) {
                    setErrorMessage(t("categoryAlreadyAddedError")); // Show specific error message
                } else {
                    setErrorMessage(t("changesNotSaved")); // Show generic error message
                }
                setSuccessMessage("");
                setTimeout(() => setErrorMessage(""), 5000);
            } finally {
                setUpdating(false);
            }
        } else {
            setErrorMessage(t("invalidData"));
            setSuccessMessage("");
            setTimeout(() => setErrorMessage(""), 5000);
        }
    };

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto px-5 py-2 bg-gray-800">
                <div className="bg-white mt-4 p-6 space-y-10">
                    <h2 className="text-gray-900 text-lg mb-4 font-medium title-font">
                        {t("addCategoryAndSubCategory")}
                        <div className="my-4 bg-gray-600 h-[1px]"></div>
                    </h2>

                    {/* Shop dropdown */}
                    <div className="relative mb-4">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-600"
                        >
                            {t("shop")} *
                        </label>
                        <select
                            id="storeId"
                            name="storeId"
                            value={storeId}
                            onChange={handleShopChange}
                            className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                        >
                            <option value={0}>{t("select")}</option>
                            {stores.map((shop) => (
                                <option key={shop.id} value={shop.id}>
                                    {shop.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Category dropdown, visible only when a shop is selected */}
                    {storeId !== 0 && (
                        <>
                            {categories.length !== 0 ? (
                                <div className="relative mb-4">
                                    <label htmlFor="categoryId" className="block text-sm font-medium text-gray-600">
                                        {t("category")} *
                                    </label>
                                    <select
                                        id="categoryId"
                                        name="categoryId"
                                        value={categoryId}
                                        onChange={handleCategoryChange}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                                    >
                                        <option value={0}>{t("chooseOneCategory")}</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="flex inline-flex justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded  "
                                    role="alert">
                                    <span className="block sm:inline">
                                        <strong className="font-bold">{t("noCategoriesAvailableForThisShop")}</strong>
                                    </span>
                                </div>
                            )}
                        </>
                    )}

                    {/* Subcategory dropdown, visible only when a category is selected */}
                    {categoryId !== 0 && (
                        <>
                            {subCategories.length !== 0 ? (
                                <div className="relative mb-4">
                                    <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-600">
                                        {t("subCategory")} *
                                    </label>
                                    <select
                                        id="subcategoryId"
                                        name="subcategoryId"
                                        value={subcategoryId}
                                        onChange={handleSubcategoryChange}
                                        className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                                    >
                                        <option value={0}>{t("chooseOneSubCategory")}</option>
                                        {subCategories.map((subCat) => (
                                            <option key={subCat.id} value={subCat.id}>
                                                {subCat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            ) : (
                                <div className="flex inline-flex justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded"
                                    role="alert">
                                    <span className="block sm:inline">
                                        <strong className="font-bold">{t("noSubCategoriesAvailableForThisCategory")}</strong>
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Submit button */}
            <div className="container w-auto px-5 py-2 bg-gray-800">
                <div className="bg-white mt-4 p-6">
                    <div className="py-2 mt-1 px-2">
                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={updating || isSuccess}
                            className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
                        >
                            {t("saveChanges")}
                            {updating && (
                                <svg
                                    aria-hidden="true"
                                    className="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-600 fill-gray-600 dark:fill-gray-300"
                                    viewBox="0 0 100 101"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"
                                    />
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"
                                    />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div>
                        {successMessage && (
                            <Alert type={"success"} message={successMessage} />
                        )}
                        {errorMessage && <Alert type={"danger"} message={errorMessage} />}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AddCategoryAndSubCategory;