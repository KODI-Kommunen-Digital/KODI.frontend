import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./bodyContainer.css";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import { role } from "../Constants/role";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

import { getProfile } from "../Services/usersApi";
import {
    getCities,
    getCityById,
    postCityData,
    updateCityData,
    uploadCityImage,
    deleteCityImage,
    uploadImageLogo,
} from "../Services/citiesApi";

import FormData from "form-data";
import Alert from "../Components/Alert";
import { UploadSVG } from "../assets/icons/upload";
import { Combobox } from "@headlessui/react";

function AddCity() {
    const { t } = useTranslation();
    // const editor = useRef(null);
    const [cityId, setCityId] = useState(0);
    const [newCity, setNewCity] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [image, setImage] = useState(null);
    const [localImage, setLocalImage] = useState(null);
    const [isAdmin] = useState(false);
    const CHARACTER_LIMIT_TITLE = 60;

    const [successMessage, setSuccessMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isFormValid, setIsFormValid] = useState(false);
    const navigate = useNavigate();
    const [mediaToDelete, setMediaToDelete] = useState([]);
    const [, setUserRole] = useState(role.User);
    const [cities, setCities] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    const [lightImage, setLightImage] = useState(null);
    const [localLightImage, setLocalLightImage] = useState(null);
    const [darkImage, setDarkImage] = useState(null);
    const [localDarkImage, setLocalDarkImage] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const queryCityNameRef = useRef(null);
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);

    const [cityInput, setCityInput] = useState({
        name: "",
        parentCity: null,
        latitude: "",
        longitude: "",
        appConfig: {
            text: "",
            primaryColor: "#3498db",
            secondaryColor: "#2ecc71",
        },
        image: null,
        darkLogo: null,
        lightLogo: null,
    });

    const [error, setError] = useState({
        name: "",
        parentCity: "",
        latitude: "",
        longitude: "",
        appConfig: {
            text: "",
            primaryColor: "",
            secondaryColor: "",
        },
    });

    useEffect(() => {
        const accessToken =
            window.localStorage.getItem("accessToken") ||
            window.sessionStorage.getItem("accessToken");
        const refreshToken =
            window.localStorage.getItem("refreshToken") ||
            window.sessionStorage.getItem("refreshToken");

        if (!accessToken && !refreshToken) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const profileResponse = await getProfile();
                setUserRole(profileResponse.data.data.roleId);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    function handleDragEnter(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    function handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setLocalImage(URL.createObjectURL(file));
        }
    }
    function handleDropLightLogo(e) {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setLightImage(file);
            setLocalLightImage(URL.createObjectURL(file));
        }
    }
    function handleDropDarkLogo(e) {
        e.preventDefault();
        e.stopPropagation();
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith("image/")) {
            setDarkImage(file);
            setLocalDarkImage(URL.createObjectURL(file));
        }
    }

    function handleImageChange(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setImage(file);
            setLocalImage(URL.createObjectURL(file));
        }
    }
    function handleLightImageChange(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setLightImage(file);
            setLocalLightImage(URL.createObjectURL(file));
        }
    }
    function handleDarkImageChange(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith("image/")) {
            setDarkImage(file);
            setLocalDarkImage(URL.createObjectURL(file));
        }
    }

    function handleRemoveImage() {
        if (cityId) {
            setMediaToDelete([...mediaToDelete, cityInput.image?.id]);
        }
        setImage(null);
        setLocalImage(null);
    }

    function handleRemoveLightImage() {
        setLightImage(null);
        setLocalLightImage(null);
    }

    function handleRemoveDarkImage() {
        setDarkImage(null);
        setLocalDarkImage(null);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let valid = true;
        const newError = { ...error };

        // Validate all fields
        for (const key in cityInput) {
            if (
                key !== "image" &&
                key !== "parentCity" &&
                key !== "darkLogo" &&
                key !== "lightLogo"
            ) {
                if (!cityInput[key] && cityInput[key] !== 0) {
                    newError[key] = t("fieldRequired");
                    valid = false;
                }
            }
        }

        // Specific validations
        if (!cityInput.name) {
            newError.name = t("pleaseEntername");
            valid = false;
        }

        if (cityInput.latitude && isNaN(cityInput.latitude)) {
            newError.latitude = t("invalidLatitude");
            valid = false;
        }

        if (cityInput.longitude && isNaN(cityInput.longitude)) {
            newError.longitude = t("invalidLongitude");
            valid = false;
        }
        if (
            cityInput.appConfig.text &&
            cityInput.appConfig.text.length > CHARACTER_LIMIT_TITLE
        ) {
            newError.appConfig = {
                text: t("characterLimitExceeded", {
                    limit: CHARACTER_LIMIT_TITLE,
                    count: cityInput.appConfig.text.length,
                }),
            };
            valid = false;
        }
        if (
            cityInput.appConfig.primaryColor &&
            !/^#([0-9A-F]{3}){1,2}$/i.test(cityInput.appConfig.primaryColor)
        ) {
            newError.appConfig = {
                ...newError.appConfig,
                primaryColor: t("invalidHexColor"),
            };
            valid = false;
        }
        if (
            cityInput.appConfig.secondaryColor &&
            !/^#([0-9A-F]{3}){1,2}$/i.test(cityInput.appConfig.secondaryColor)
        ) {
            newError.appConfig = {
                ...newError.appConfig,
                secondaryColor: t("invalidHexColor"),
            };
            valid = false;
        }
        setError(newError);

        if (!valid) {
            console.error("Validation failed. Errors: ", newError);
            return;
        }

        if (valid) {
            setUpdating(true);

            try {
                const dataToSubmit = {
                    ...cityInput,
                    parentCityId: cityInput.parentCity?.id || null, // Send just the ID
                };

                const response = newCity
                    ? await postCityData(dataToSubmit)
                    : await updateCityData(cityId, dataToSubmit);

                const currentCityId = response?.data?.data?.id || cityId;

                // Handle image deletion if needed
                if (mediaToDelete.length > 0) {
                    await deleteCityImage(cityId, mediaToDelete);
                    setMediaToDelete([]);
                }

                if (image) {
                    // Check if image is a File object (new upload) vs string (existing URL)
                    if (typeof image === "object") {
                        const imageForm = new FormData();
                        imageForm.append("image", image);
                        await uploadCityImage(imageForm, currentCityId || cityId);
                    }
                    // If image is a string (existing URL), no need to upload again
                }
                if (lightImage) {
                    if (typeof lightImage === "object") {
                        console.log("Uploading light image:", lightImage);
                        const lightImageForm = new FormData();
                        lightImageForm.append("logo", lightImage);
                        await uploadImageLogo(
                            lightImageForm,
                            currentCityId || cityId,
                            "light"
                        );
                    }
                }
                if (darkImage) {
                    if (typeof darkImage === "object") {
                        console.log("Uploading dark image:", darkImage);
                        const darkImageForm = new FormData();
                        darkImageForm.append("logo", darkImage);
                        await uploadImageLogo(
                            darkImageForm,
                            currentCityId || cityId,
                            "dark"
                        );
                    }
                }
                isAdmin
                    ? setSuccessMessage(t("cityUpdatedAdmin"))
                    : newCity
                        ? setSuccessMessage(t("cityCreated"))
                        : setSuccessMessage(t("cityUpdated"));

                setIsSuccess(true);
                setTimeout(() => {
                    setSuccessMessage(false);
                    navigate("/AllCities");
                }, 5000);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    const message = error.response?.data?.message || t("changesNotSaved");
                    setErrorMessage(message);
                } else {
                    setErrorMessage(t("changesNotSaved"));
                    setTimeout(() => setErrorMessage(false), 5000);
                }
            } finally {
                setUpdating(false);
            }
        } else {
            setErrorMessage(t("invalidData"));
            setSuccessMessage(false);
            setTimeout(() => setErrorMessage(false), 5000);
        }
    };

    const handleCancel = () => {
        setMediaToDelete([]);
        navigate("/AllCities");
    };

    // In the fetchData useEffect where you get city by ID:
    useEffect(() => {
        const fetchData = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const cityId = searchParams.get("cityId");

            try {
                if (cityId) {
                    setCityId(parseInt(cityId));
                    setNewCity(false);

                    const cityResponse = await getCityById(cityId);
                    const city = cityResponse.data.data;

                    setCityInput({
                        name: city.name,
                        parentCity: city.parentCity, // This is the full parent city object
                        latitude: city.latitude,
                        longitude: city.longitude,
                        image: city.image,
                        appConfig: {
                            text: city.appConfig?.text || "",
                            primaryColor: city.appConfig?.primaryColor || "",
                            secondaryColor: city.appConfig?.secondaryColor || "",
                        },
                        darkLogo: city.darkLogo,
                        lightLogo: city.lightLogo,
                    });

                    // If there's a parent city, set it in selectedCities
                    if (city.parentCity) {
                        setSelectedCities([city.parentCity]);
                    }
                    if (city.darkLogo) {
                        setDarkImage(city.darkLogo);
                    }
                    if (city.lightLogo) {
                        setLightImage(city.lightLogo);
                    }
                    if (city.image) {
                        setImage(city.image);
                    }
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [cityId]);

    const onInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "name" && value.length > CHARACTER_LIMIT_TITLE) {
            setError((prev) => ({
                ...prev,
                name: t("characterLimitExceeded", {
                    limit: CHARACTER_LIMIT_TITLE,
                    count: value.length,
                }),
            }));
            return;
        }
        if (
            name &&
            name[0] === "a" &&
            name[1] === "p" &&
            name[2] === "p" &&
            name[3] === "C" &&
            name[4] === "o" &&
            name[5] === "n" &&
            name[6] === "f"
        ) {
            // Handle appConfig fields separately
            setCityInput((prev) => ({
                ...prev,
                appConfig: {
                    ...prev.appConfig,
                    [name.split(".")[1]]: value, // Update the specific appConfig field
                },
            }));
            return;
        }
        setCityInput((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Clear error when user starts typing
        setError((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    useEffect(() => {
        const fetchCities = async () => {
            try {
                const citiesResponse = await getCities();
                const citiesData = citiesResponse?.data?.data || [];
                const sortedCities = citiesData.sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                setCities(sortedCities);
            } catch (error) {
                console.error("Error fetching cities:", error);
            }
        };

        fetchCities();
    }, []);

    useEffect(() => {
        if (query.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
                );
                const data = await response.json();

                if (Array.isArray(data) && data.length > 0) {
                    const validSuggestions = data.filter(
                        (place) => place.lat && place.lon
                    );
                    setSuggestions(validSuggestions);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [query]);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelectCity = (city) => {
        if (selectedCities.some((selectedCity) => selectedCity.id === city.id)) {
            setError((prev) => ({
                ...prev,
                cityAlreadySelected: t("cityAlreadySelected"),
            }));
            setTimeout(
                () =>
                    setError((prev) => ({
                        ...prev,
                        cityAlreadySelected: "",
                    })),
                1000
            );
            return;
        }

        setSelectedCities([city]);
        setCityInput((prev) => ({
            ...prev,
            parentCity: city, // Store the full city object
        }));
        setError((prev) => ({
            ...prev,
            parentCity: "",
        }));
    };

    const handleRemoveCity = () => {
        setSelectedCities([]);
        setCityInput((prev) => ({
            ...prev,
            parentCity: null,
        }));
    };
    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    // useEffect(() => {
    //   const checkFormValidity = () => {
    //     const requiredFields = [
    //       cityInput.name,
    //       cityInput.latitude !== "",
    //       cityInput.longitude !== "",
    //       cityInput.appConfig.text !== "",
    //       cityInput.appConfig.primaryColor !== "",
    //       cityInput.appConfig.secondaryColor !== "",
    //       !error.name,
    //       !error.latitude,
    //       !error.longitude
    //     ];

    //     return requiredFields.every(Boolean);
    //   };

    //   setIsFormValid(checkFormValidity());
    // }, [cityInput, error]);
    useEffect(() => {
        setIsFormValid(checkFormValidity());
    }, [cityInput, error]);

    const checkFormValidity = () => {
        const requiredFields = [
            cityInput.name,
            cityInput.latitude !== "",
            cityInput.longitude !== "",
            cityInput.appConfig.text !== "",
            cityInput.appConfig.primaryColor !== "",
            cityInput.appConfig.secondaryColor !== "",
            !error.name,
            !error.latitude,
            !error.longitude,
            !error.appConfig?.primaryColor,
            !error.appConfig?.secondaryColor,
        ];

        return requiredFields.every(Boolean);
    };
    // const isValidHexColor = (hex) => {
    //     return /^#([0-9a-f]{3}){1,2}$/i.test(hex);
    // };

    // const isDisallowedColor = (hex) => {
    //     if (!hex || !isValidHexColor(hex)) return true;

    //     const fullHex =
    //         hex.length === 4
    //             ? "#" + [...hex.slice(1)].map((c) => c + c).join("")
    //             : hex.toLowerCase();

    //     const r = parseInt(fullHex.substr(1, 2), 16);
    //     const g = parseInt(fullHex.substr(3, 2), 16);
    //     const b = parseInt(fullHex.substr(5, 2), 16);

    //     const brightness = (299 * r + 587 * g + 114 * b) / 1000;

    //     const max = Math.max(r, g, b);
    //     const min = Math.min(r, g, b);
    //     const saturation = max === 0 ? 0 : (max - min) / max;

    //     const isGray = r === g && g === b;
    //     const isTooLight = brightness > 180;
    //     const isTooDark = brightness < 65;
    //     const isTooGrayish = saturation < 0.15 && brightness > 150;

    //     return isGray || isTooLight || isTooDark || isTooGrayish;
    // };

    return (
        <section className="bg-gray-900 body-font relative min-h-screen">
            <SideBar />

            <div className="container w-auto px-5 py-2 bg-slate-900">
                <div className="bg-white mt-4 p-6 space-y-10">
                    <h2
                        style={{
                            fontFamily:
                                "'Space Grotesk', Helvetica, Arial, Lucida, sans-serif",
                        }}
                        className="text-gray-900 text-lg mb-4 font-medium title-font"
                    >
                        {newCity ? t("Createcity") : t("updateCity")}
                        <div className="my-4 bg-gray-600 h-[1px]"></div>
                    </h2>

                    <div className="relative mb-0">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-900"
                        >
                            {t("city name")} <span className="text-red-500">*</span>
                        </label>
                        {/* <input
              type="text"
              id="name"
              name="name"
              value={cityInput.name}
              onChange={onInputChange}
              required
              className="overflow-y:scroll border p-3 bg-white text-gray-800 border-gray-700 shadow-md placeholder:text-base duration-300 border-gray-300 rounded-lg w-full"
              placeholder={t("entercityname")}
            /> */}

                        <Combobox
                            value={selectedLocation ? selectedLocation.display_name : query}
                            onChange={(place) => {
                                if (place && place.display_name) {
                                    setQuery(place.name);
                                    setSelectedLocation(place);
                                    setCityInput((prev) => ({
                                        ...prev,
                                        longitude: place.lon,
                                        latitude: place.lat,
                                    }));
                                } else {
                                    console.error("Invalid place object:", place);
                                }
                            }}
                        >
                            <Combobox.Input
                                id="name"
                                name="name"
                                value={query}
                                // onChange={onInputChange}
                                required
                                className="overflow-y:scroll border p-3 bg-white text-gray-800 border-gray-700 shadow-md placeholder:text-base duration-300 rounded-lg w-full mb-1"
                                placeholder={t("entercityname")}
                                onChange={(event) => {
                                    setQuery(event.target.value)
                                    onInputChange(event)
                                }}
                            // className="w-full border border-gray-300 rounded-md p-3 mb-4 text-gray-700"
                            />
                            {suggestions.length > 0 && (
                                <Combobox.Options
                                    ref={queryCityNameRef}
                                    className="max-h-60 overflow-y-auto border border-gray-300 rounded-md mb-4 mx-0"
                                >
                                    {suggestions.map((place) => (
                                        <Combobox.Option
                                            key={place.place_id}
                                            value={place}
                                            className={({ active }) =>
                                                `px-4 py-2 text-gray-900 cursor-pointer ${active ? "bg-gray-100" : ""
                                                }`
                                            }
                                        >
                                            {place.display_name}
                                        </Combobox.Option>
                                    ))}
                                </Combobox.Options>
                            )}

                        </Combobox>

                        <div className="flex justify-between text-sm mt-1">
                            <span>
                                {cityInput.name.replace(/(<([^>]+)>)/gi, "").length}/
                                {CHARACTER_LIMIT_TITLE}
                            </span>
                            {error.name && (
                                <span className="mt-2 text-sm text-red-600">{error.name}</span>
                            )}
                        </div>
                    </div>

                    <div className="relative mb-4" ref={dropdownRef}>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-900"
                        >
                            {t("parnetcity")}
                        </label>
                        <div
                            className="overflow-y:scroll border p-3 bg-white text-gray-800 border-gray-700 shadow-md placeholder:text-base duration-300 border-gray-300 rounded-lg w-full disabled:bg-gray-400 appearance-none"
                            onClick={toggleDropdown}
                        >
                            <div className="flex flex-wrap">
                                {selectedCities.map((city) => (
                                    <div
                                        key={city.id}
                                        className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-teal-700 bg-teal-100 border border-teal-300"
                                    >
                                        <span>{city.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveCity()}
                                            className="text-red-600 ml-2"
                                        >
                                            &times;
                                        </button>
                                    </div>
                                ))}
                                <input
                                    type="text"
                                    placeholder={selectedCities.length === 0 ? t("select") : ""}
                                    className="bg-transparent outline-none flex-1 cursor-pointer"
                                    readOnly
                                />
                            </div>
                        </div>
                        {isOpen && (
                            <div className="absolute top-full mt-2 w-full bg-white rounded shadow-lg z-10 max-h-40 overflow-y-auto border border-gray-700">
                                {cities.map((city) => (
                                    <div
                                        key={city.id}
                                        onClick={() => handleSelectCity(city)}
                                        className={`cursor-pointer px-3 py-2 bg-gray-100 hover:bg-teal-100 ${selectedCities.some(
                                            (selectedCity) => selectedCity.id === city.id
                                        )
                                            ? "text-teal-700"
                                            : "text-gray-800"
                                            }`}
                                    >
                                        {city.name}
                                    </div>
                                ))}
                            </div>
                        )}
                        {error.parentCity && (
                            <div className="mt-2 text-sm text-red-600">
                                {error.parentCity}
                            </div>
                        )}
                    </div>

                    <div className="relative mb-0">
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label
                                    htmlFor="latitude"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    {t("Latitude")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="latitude"
                                    name="latitude"
                                    value={cityInput.latitude}
                                    onChange={onInputChange}
                                    className="border p-3 bg-white text-gray-800 border-gray-700 shadow-md placeholder:text-base duration-300 border-gray-300 rounded-lg w-full"
                                    placeholder={t("enter_latitude")}
                                    disabled
                                />
                                {error.latitude && (
                                    <div className="mt-2 text-sm text-red-600">
                                        {error.latitude}
                                    </div>
                                )}
                            </div>

                            <div className="w-full">
                                <label
                                    htmlFor="longitude"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    {t("Longitude")} <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="longitude"
                                    name="longitude"
                                    value={cityInput.longitude}
                                    onChange={onInputChange}
                                    className="border p-3 bg-white text-gray-800 border-gray-700 shadow-md placeholder:text-base duration-300 border-gray-300 rounded-lg w-full"
                                    placeholder={t("enter_longitude")}
                                    disabled
                                />
                                {error.longitude && (
                                    <div className="mt-2 text-sm text-red-600">
                                        {error.longitude}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="relative mb-0">
                        <div className="flex gap-4">
                            <div className="w-full">
                                <label
                                    htmlFor="primarycolor"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    {t("PrimaryColor")} <span className="text-red-500">*</span>
                                </label>
                                <span className="border rounded-md p-2">
                                    <input
                                        type="color"
                                        id="primarycolor"
                                        name="appConfig.primaryColor"
                                        value={cityInput.appConfig.primaryColor}
                                        onChange={(e) => {
                                            onInputChange(e);
                                            // const hexColor = e.target.value;
                                            // if (!isValidHexColor(hexColor)) {
                                            //   setError((prev) => ({
                                            //     ...prev,
                                            //     appConfig: {
                                            //       ...prev.appConfig,
                                            //       primaryColor: t("invalidHexColor"),
                                            //     },
                                            //   }));
                                            // } else if (isDisallowedColor(hexColor)) {
                                            //   setError((prev) => ({
                                            //     ...prev,
                                            //     appConfig: {
                                            //       ...prev.appConfig,
                                            //       primaryColor: t("disallowedColor"),
                                            //     },
                                            //   }));
                                            // } else {
                                            //   onInputChange(e);
                                            //   setError((prev) => ({
                                            //     ...prev,
                                            //     appConfig: {
                                            //       ...prev.appConfig,
                                            //       primaryColor: "",
                                            //     },
                                            //   }));
                                            // }
                                        }}
                                        className="cursor-pointer"
                                    />
                                    {cityInput.appConfig.primaryColor}
                                </span>
                                {error.appConfig.primaryColor && (
                                    <div className="mt-2 text-sm text-red-600">
                                        {error.appConfig.primaryColor}
                                    </div>
                                )}
                            </div>

                            <div className="w-full">
                                <label
                                    htmlFor="secondarycolor"
                                    className="block text-sm font-medium text-gray-900"
                                >
                                    {t("SecondaryColor")} <span className="text-red-500">*</span>
                                </label>
                                <span className="border rounded-md p-1">
                                    <input
                                        type="color"
                                        id="secondarycolor"
                                        name="appConfig.secondaryColor"
                                        value={cityInput.appConfig.secondaryColor}
                                        onChange={(e) => {
                                            onInputChange(e);
                                            // const hexColor = e.target.value;
                                            // if (!isValidHexColor(hexColor)) {
                                            //   setError((prev) => ({
                                            //     ...prev,
                                            //     appConfig: {
                                            //       ...prev.appConfig,
                                            //       secondaryColor: t("invalidHexColor"),
                                            //     },
                                            //   }));
                                            // } else if (isDisallowedColor(hexColor)) {
                                            //   setError((prev) => ({
                                            //     ...prev,
                                            //     appConfig: {
                                            //       ...prev.appConfig,
                                            //       secondaryColor: t("disallowedColor"),
                                            //     },
                                            //   }));
                                            // } else {
                                            //   onInputChange(e);
                                            //   setError((prev) => ({
                                            //     ...prev,
                                            //     appConfig: {
                                            //       ...prev.appConfig,
                                            //       secondaryColor: "",
                                            //     },
                                            //   }));
                                            // }
                                        }}
                                        className="cursor-pointer"
                                    />
                                    {cityInput.appConfig.secondaryColor}
                                </span>
                                {error.appConfig.secondaryColor && (
                                    <div className="mt-2 text-sm text-red-600">
                                        {error.appConfig.secondaryColor}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-900"
                        >
                            {t("Headertext")} <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="appConfig.text"
                            value={cityInput.appConfig.text}
                            onChange={onInputChange}
                            required
                            className="overflow-y:scroll border p-3 bg-white text-gray-800 border-gray-700 shadow-md placeholder:text-base duration-300 border-gray-300 rounded-lg w-full"
                            placeholder={t("enterheadertext")}
                        />
                        {error.appConfig.text && (
                            <div className="mt-2 text-sm text-red-600">
                                {error.appConfig.text}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="container w-auto px-5 py-2 base-bg-slate-900">
                <div className="bg-white mt-4 p-6 space-y-10">
                    <h2 className="text-gray-900 text-lg mb-4 font-medium title-font">
                        {t("uploadimage")}
                        <div className="my-4 bg-gray-600 h-[1px]"></div>
                    </h2>

                    <div className="flex justify-center">
                        <div
                            className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-black px-6 pt-5 pb-6 bg-slate-200`}
                            onDrop={handleDropLightLogo}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                        >
                            <p>{t("uploaddarklogo")}</p>
                            {lightImage ? (
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <img
                                            src={
                                                localLightImage ||
                                                (typeof lightImage === "object"
                                                    ? URL.createObjectURL(lightImage)
                                                    : lightImage)
                                            }
                                            alt="City preview"
                                            className="h-64 w-full object-cover rounded-xl"
                                        />

                                        <button
                                            className="bg-black font-md text-gray-300 shadow-lg p-2 text-white rounded-lg w-full py-2 px-4 mt-2"
                                            onClick={handleRemoveLightImage}
                                        >
                                            {t("removeFile")}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <UploadSVG />
                                    <p className="mt-1 text-sm text-gray-900">
                                        {t("dragAndDropImage")}
                                    </p>
                                    <div className="relative mb-0 mt-8">
                                        <label
                                            className={`bg-black font-md text-gray-300 shadow-lg p-2 text-white rounded-lg w-full py-2 px-4`}
                                        >
                                            <span className="button-label">{t("upload")}</span>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleLightImageChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div
                            className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-black px-6 pt-5 pb-6 bg-slate-200`}
                            onDrop={handleDropDarkLogo}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                        >
                            <p>{t("uploadlightlogo")}</p>
                            {darkImage ? (
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <img
                                            src={
                                                localDarkImage ||
                                                (typeof darkImage === "object"
                                                    ? URL.createObjectURL(darkImage)
                                                    : darkImage)
                                            }
                                            alt="City preview"
                                            className="h-64 w-full object-cover rounded-xl"
                                        />

                                        <button
                                            className="bg-black font-md text-gray-300 shadow-lg p-2 text-white rounded-lg w-full py-2 px-4 mt-2"
                                            onClick={handleRemoveDarkImage}
                                        >
                                            {t("removeFile")}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <UploadSVG />
                                    <p className="mt-1 text-sm text-gray-900">
                                        {t("dragAndDropImage")}
                                    </p>
                                    <div className="relative mb-0 mt-8">
                                        <label
                                            className={`bg-black font-md text-gray-300 shadow-lg p-2 text-white rounded-lg w-full py-2 px-4`}
                                        >
                                            <span className="button-label">{t("upload")}</span>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleDarkImageChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container w-auto px-5 py-2 base-bg-slate-900">
                <div className="bg-white mt-4 p-6 space-y-10">
                    <h2 className="text-gray-900 text-lg mb-4 font-medium title-font">
                        {t("uploadimage")}
                        <div className="my-4 bg-gray-600 h-[1px]"></div>
                    </h2>
                    <div>
                        <div
                            className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-black px-6 pt-5 pb-6 bg-slate-200`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                        >
                            {image ? (
                                <div className="flex flex-col items-center">
                                    <div className="relative">
                                        <img
                                            src={
                                                localImage ||
                                                (typeof image === "object"
                                                    ? URL.createObjectURL(image)
                                                    : image)
                                            }
                                            alt="City preview"
                                            className="h-64 w-full object-cover rounded-xl"
                                        />

                                        <button
                                            className="bg-black font-md text-gray-300 shadow-lg p-2 text-white rounded-lg w-full py-2 px-4 mt-2"
                                            onClick={handleRemoveImage}
                                        >
                                            {t("removeFile")}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center">
                                    <UploadSVG />
                                    <p className="mt-1 text-sm text-gray-900">
                                        {t("dragAndDropImage")}
                                    </p>
                                    <div className="relative mb-0 mt-8">
                                        <label
                                            className={`bg-black font-md text-gray-300 shadow-lg p-2 text-white rounded-lg w-full py-2 px-4`}
                                        >
                                            <span className="button-label">{t("upload")}</span>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={handleImageChange}
                                            />
                                        </label>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <div className="container w-auto px-5 py-2 bg-slate-900">
                <div className="bg-white mt-4 p-6">
                    <div className="py-2 mt-1 px-2">
                        <div className="flex gap-2">
                            {!newCity && (
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="w-full bg-gray-500 font-md shadow-lg p-2 text-white rounded-lg"
                                >
                                    {t("cancel")}
                                </button>
                            )}
                            {newCity && (
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="w-full bg-gray-500 font-md  shadow-lg p-2 text-white rounded-lg"
                                >
                                    {t("Back")}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={handleSubmit}
                                disabled={!isFormValid || updating || isSuccess}
                                className="bg-black font-md text-gray-300 shadow-lg p-2 text-white rounded-lg w-full disabled:opacity-60"
                            >
                                {t("saveChanges")}
                                {updating && (
                                    <svg
                                        aria-hidden="true"
                                        className="inline w-5 h-5 ml-2 text-gray-200 animate-spin dark:text-gray-900 fill-gray-600 dark:fill-gray-300"
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
                    </div>
                    <div className="py-2 mt-1 px-2">
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

export default AddCity;
