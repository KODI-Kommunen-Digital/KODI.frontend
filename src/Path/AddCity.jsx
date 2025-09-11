import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./bodyContainer.css";
import SideBar from "../Components/SideBar";
import { useTranslation } from "react-i18next";
import "react-quill/dist/quill.snow.css";
import axios from "axios";

import {
  getCityById,
  postCityData,
  updateCityData,
  uploadCityImage,
  deleteCityImage,
} from "../Services/citiesApi";

import FormData from "form-data";
import Alert from "../Components/Alert";
import { UploadSVG } from "../assets/icons/upload";
import { Combobox } from "@headlessui/react";
import PropTypes from "prop-types";
import useValidatedUser from "../hook/useValidatedUser";

const CHARACTER_LIMIT_TITLE = 60;

function AddCity() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useValidatedUser();

  const [cityId, setCityId] = useState(0);
  const [newCity, setNewCity] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [image, setImage] = useState(null);
  const [isAdmin] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState([]);

  const queryCityNameRef = useRef(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [cityInput, setCityInput] = useState({
    name: "",
    image: null,
  });

  const [error, setError] = useState({
    name: "",
  });

  const removeImage = useCallback(() => {
    if (cityId) {
      setMediaToDelete([...mediaToDelete, cityInput.image?.id]);
    }
    setImage(null);
  }, [cityId, cityInput.image?.id, mediaToDelete]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    let valid = true;
    const newError = { ...error };

    // Specific validations
    if (!cityInput.name) {
      newError.name = t("pleaseEntername");
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
          });
          setQuery(city.name);
          if (city.image) {
            setImage(process.env.REACT_APP_BUCKET_HOST + city.image);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [cityId]);

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

  const checkFormValidity = useCallback(() => {
    const requiredFields = [cityInput.name, !error.name];

    return requiredFields.every(Boolean);
  }, [cityInput.name, error.name]);

  useEffect(() => {
    setIsFormValid(checkFormValidity());
  }, [checkFormValidity]);

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

            <Combobox
              value={selectedLocation ? selectedLocation.display_name : query}
              onChange={(place) => {
                if (place && place.display_name) {
                  const name = place.name;
                  setQuery(place.name);
                  setSelectedLocation(place);
                  setCityInput((prev) => ({
                    ...prev,
                    name,
                  }));
                  if (name.length > CHARACTER_LIMIT_TITLE) {
                    setError((prev) => ({
                      ...prev,
                      name: t("characterLimitExceeded", {
                        limit: CHARACTER_LIMIT_TITLE,
                        count: name.length,
                      }),
                    }));
                  }
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
                  setQuery(event.target.value);
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
                        `px-4 py-2 text-gray-900 cursor-pointer ${
                          active ? "bg-gray-100" : ""
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
        </div>
      </div>

      <UploadCityImage
        image={image}
        setImage={setImage}
        removeImage={removeImage}
      />

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
                className="bg-black font-md text-gray-300 shadow-lg p-2 rounded-lg w-full disabled:opacity-60"
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

const UploadCityImage = ({ image, setImage, removeImage }) => {
  const { t } = useTranslation();
  const [localImage, setLocalImage] = useState(null);

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

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setLocalImage(URL.createObjectURL(file));
    }
  }

  function handleRemoveImage() {
    removeImage();
    setLocalImage(null);
  }

  return (
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
                    className="bg-black font-md text-gray-300 shadow-lg p-2 rounded-lg w-full py-2 px-4 mt-2"
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
                    className={`bg-black font-md text-gray-300 shadow-lg p-2 rounded-lg w-full py-2 px-4`}
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
  );
};

UploadCityImage.propTypes = {
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  setImage: PropTypes.func.isRequired,
  removeImage: PropTypes.func.isRequired,
};

export default AddCity;
