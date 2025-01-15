import React, { useState, useEffect, useCallback } from "react";
import SideBar from "../../Components/SideBar";
import { useNavigate } from "react-router-dom";
import {
  getCategory,
  getSubCategory,
  deleteSubCategory,
  getOwnerShops,
  getUserRoleContainer,
} from "../../Services/containerApi";
import { useTranslation } from "react-i18next";

function ViewCategories() {
  window.scrollTo(0, 0);
  const { t } = useTranslation();
  const [storeId, setStoreId] = useState();
  const [cityId, setCityId] = useState();
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [showNoSubCategoriesMessage, setShowNoSubCategoriesMessage] =
    useState(false);

  const navigate = useNavigate();
  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const [isOwner, setIsOwner] = useState(null);
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const accessToken =
          window.localStorage.getItem("accessToken") ||
          window.sessionStorage.getItem("accessToken");
        const refreshToken =
          window.localStorage.getItem("refreshToken") ||
          window.sessionStorage.getItem("refreshToken");

        if (!accessToken && !refreshToken) {
          navigate("/login");
          return;
        }

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

  const fetchCategories = useCallback((cityId, storeId) => {
    if (cityId && storeId) {
      getCategory(cityId, storeId).then((response) => {
        setCategories(response.data.data);
      });
    }
  }, []);

  useEffect(() => {
    if (storeId) {
      const selectedStore = stores.find(
        (store) => store.id === parseInt(storeId)
      );
      const cityId = selectedStore.cityId;
      setCityId(cityId);
      if (selectedStore) {
        fetchCategories(cityId, storeId);
      }
    }
  }, [fetchCategories, cityId, storeId]);

  const handleCategoryClick = async (categoryId) => {
    if (activeCategoryId === categoryId) {
      setActiveCategoryId(null);
      setSubCategories({});
    } else {
      setActiveCategoryId(categoryId);

      try {
        const subCats = await getSubCategory(cityId, storeId, categoryId);
        const subcatList = {};

        if (subCats?.data?.data?.length > 0) {
          subCats.data.data.forEach((subCat) => {
            subcatList[subCat.id] = subCat.name;
          });
          setSubCategories(subcatList);
        } else {
          // Show the "no subcategories" message for 3 seconds
          setSubCategories({});
          setShowNoSubCategoriesMessage(true);
          setTimeout(() => {
            setShowNoSubCategoriesMessage(false);
          }, 3000);
        }
        console.log("subCategories: ", subcatList);
      } catch (error) {
        console.error("Error fetching subcategories: ", error);
        setSubCategories({});
      }
    }
  };

  const fetchStores = useCallback(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const urlStoreId = urlParams.get("storeId");

    getOwnerShops().then((response) => {
      const fetchedStores = response.data.data;
      setStores(fetchedStores);

      if (urlStoreId) {
        const storeIdNumber = parseInt(urlStoreId, 10);
        const selectedStore = fetchedStores.find(
          (store) => store.id === storeIdNumber
        );

        if (selectedStore) {
          setStoreId(storeIdNumber);
          fetchCategories(selectedStore.cityId, storeIdNumber, 1);
        }
      }
    });
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  const handleStoreChange = async (event) => {
    const storeId = event.target.value;
    const selectedStore = stores.find(
      (store) => store.id === parseInt(storeId)
    );

    if (selectedStore) {
      const cityId = selectedStore.cityId;
      setStoreId(storeId);

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("storeId", storeId);
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, "", newUrl);
      fetchCategories(cityId, storeId);
    }
  };

  const handleStoreClick = (storeId) => {
    const selectedStore = stores.find(
      (store) => store.id === parseInt(storeId)
    );

    if (selectedStore) {
      const cityId = selectedStore.cityId;
      setStoreId(storeId);

      const urlParams = new URLSearchParams(window.location.search);
      urlParams.set("storeId", storeId);
      const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
      window.history.replaceState({}, "", newUrl);
      fetchCategories(cityId, storeId);
    }
  };

  const handleDeleteSubCategory = async (storeId, subCategoryId) => {
    try {
      await deleteSubCategory(storeId, subCategoryId);
      setSubCategories((prev) => {
        const newSubCategories = { ...prev };
        delete newSubCategories[subCategoryId];
        return newSubCategories;
      });
      console.log(`Subcategory ${subCategoryId} deleted successfully`);
    } catch (error) {
      console.error("Error deleting subcategory:", error);
    }
  };

  return (
    <section className="bg-gray-900 body-font relative h-full">
      <SideBar />

      <div className="container flex justify-center px-5 py-2 gap-2 w-full md:w-auto fixed lg:w-auto relative">
        <a
          onClick={() => {
            navigateTo("/OwnerScreen/AddCategoryAndSubCategory");
          }}
          className="relative inline-flex items-center justify-center px-12 py-4 overflow-hidden font-mono font-medium tracking-tighter text-white bg-black rounded-full group transition-all duration-500 ease-out w-full max-w-xs"
        >
          <span className="absolute w-0 h-0 transition-all duration-200 ease-out bg-green-500 rounded-full group-hover:w-full group-hover:h-full"></span>
          <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-gray-700"></span>
          <span className="relative">{t("add")}</span>
        </a>
      </div>

      <div className="container w-auto px-0 lg:px-5 py-2 bg-gray-900 min-h-screen flex flex-col">
        <div className="h-full">
          {storeId && categories && categories.length > 0 ? (
            <>
              <div className="flex justify-center px-5 py-2 gap-2 w-full md:w-auto fixed lg:w-auto relative">
                <div className="col-span-6 sm:col-span-1 mt-1 mb-1 px-0 mr-0 w-full md:w-80">
                  <select
                    id="stores"
                    name="stores"
                    autoComplete="stores"
                    onChange={handleStoreChange}
                    value={storeId || 0}
                    className="bg-white h-10 px-5 pr-10 rounded-full text-sm focus:outline-none w-full text-gray-600"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                    }}
                  >
                    <option className="font-sans" value={0} key={0}>
                      {t("select", {
                        regionName: process.env.REACT_APP_REGION_NAME,
                      })}
                    </option>
                    {stores.map((store) => (
                      <option
                        className="font-sans"
                        value={store.id}
                        key={store.id}
                      >
                        {store.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col items-center mt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 w-full">
                  {categories.map((category) => (
                    <div key={category.id} className="w-full">
                      {/* Category Card */}
                      <div
                        className={`p-4 text-center rounded-lg cursor-pointer transition-all ${
                          activeCategoryId === category.id
                            ? "bg-gray-300"
                            : "bg-gray-200 hover:bg-gray-300"
                        }`}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.name}
                      </div>

                      {/* Subcategories Section - only show if this category is active */}
                      {activeCategoryId === category.id &&
                        Object.keys(subCategories).length > 0 && (
                          <div className="transition-max-height duration-500 ease-in-out overflow-hidden mt-2">
                            <ul className="list-none p-0">
                              {Object.entries(subCategories).map(
                                ([subCatId, subCatName]) => (
                                  <li
                                    key={subCatId}
                                    className="relative bg-gray-100 p-4 my-2 rounded-md flex flex-col justify-between text-center min-h-[120px]"
                                  >
                                    <span>{subCatName}</span>

                                    {/* Delete Button */}
                                    <button
                                      className="absolute bottom-0 left-0 right-0 p-2 bg-red-100 border border-red-400 text-red-700 rounded-b-md focus:outline-none font-bold"
                                      onClick={() =>
                                        handleDeleteSubCategory(
                                          category.id,
                                          parseInt(subCatId, 10)
                                        )
                                      }
                                    >
                                      {t("delete")}
                                    </button>
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}
                    </div>
                  ))}
                </div>

                {showNoSubCategoriesMessage && (
                  <div className="mt-4 bg-yellow-200 border border-yellow-800 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-50">
                    <span>{t("noSubCategoriesAvailableForThisCategory")}</span>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="bg-gray-500 mt-0 min-h-[30rem] px-5 py-2 flex flex-col justify-center items-center">
              <div className="flex justify-center px-5 py-2 gap-2 w-full">
                <div className="w-full">
                  {stores.length < 5 ? (
                    <div className="flex justify-center gap-2 ">
                      {stores.map((store) => (
                        <div key={store.id} className="w-full max-w-xs">
                          <div
                            className={`p-4 text-center  border-2 border-black rounded-full cursor-pointer transition-all ${
                              storeId === store.id
                                ? "bg-gray-300"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                            onClick={() => handleStoreClick(store.id)}
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {store.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 w-full">
                      {stores.map((store) => (
                        <div key={store.id} className="w-full">
                          <div
                            className={`p-4 text-center  border-2 border-black rounded-full cursor-pointer transition-all ${
                              storeId === store.id
                                ? "bg-gray-300"
                                : "bg-gray-200 hover:bg-gray-300"
                            }`}
                            onClick={() => handleStoreClick(store.id)}
                            style={{ fontFamily: "Poppins, sans-serif" }}
                          >
                            {store.id}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {storeId && categories.length === 0 && (
                <div className="text-center mt-6">
                  <p className="text-gray-800">{t("noDataForStore")}</p>
                  <p className="text-gray-800">{t("selectAnotherStore")}</p>
                </div>
              )}

              <center className="mt-6">
                <a
                  onClick={() => navigateTo("/OwnerScreen/StoreDetails")}
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
              </center>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ViewCategories;
