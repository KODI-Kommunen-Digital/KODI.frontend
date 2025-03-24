import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../bodyContainer.css";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import {
  getListingsById,
  postListingsData,
  updateListingsData,
  uploadListingPDF,
  uploadListingImage,
  deleteListingImage,
} from "../../Services/listingsApi";
import { getCities } from "../../Services/citiesApi";
import FormData from "form-data";
import Alert from "../../Components/Alert";
import { getCategory, getListingsSubCategory } from "../../Services/CategoryApi";
import { hiddenCategories } from "../../Constants/hiddenCategories";
import FormImage from "../FormImage";
import { UploadSVG } from "../../assets/icons/upload";
import ServiceAndTime from "../../Components/ServiceAndTime";
import { createAppointments, updateAppointments, getAppointments, getAppointmentServices } from "../../Services/appointmentBookingApi";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css";
import { format } from 'date-fns';
import Delta from "quill-delta";

function UploadListings() {
  const { t } = useTranslation();
  const editor = useRef(null);
  const [listingId, setListingId] = useState(0);
  const [newListing, setNewListing] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [image, setImage] = useState(null);
  const [pdf, setPdf] = useState(null);
  const [localImageOrPdf, setLocalImageOrPdf] = useState(false);
  const [appointmentAdded, setAppointmentAdded] = useState(false);
  const [isAdmin] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  // const isV2Backend = process.env.REACT_APP_V2_BACKEND === "True";
  const [isFormValid, setIsFormValid] = useState(false);
  const [localImages, setLocalImages] = useState([]);
  const MAX_IMAGES = 8;
  const CHARACTER_LIMIT_TITLE = 255;
  const CHARACTER_LIMIT_DESCRIPTION = 65535;

  const navigate = useNavigate();
  const getDefaultEndDate = () => {
    const now = new Date();
    const twoWeeksLater = new Date(now.getTime() + 2 * 7 * 24 * 60 * 60 * 1000); // 2 weeks in milliseconds

    const year = twoWeeksLater.getFullYear();
    const month = String(twoWeeksLater.getMonth() + 1).padStart(2, "0");
    const day = String(twoWeeksLater.getDate()).padStart(2, "0");
    const hours = String(twoWeeksLater.getHours()).padStart(2, "0");
    const minutes = String(twoWeeksLater.getMinutes()).padStart(2, "0");

    // Format: yyyy-MM-ddThh:mm
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

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
    if (file) {
      if (file.type.startsWith("image/")) {
        setImage(e.dataTransfer.files);
        setLocalImageOrPdf(true);
        setListingInput((prev) => ({
          ...prev,
          hasAttachment: true,
        }));
      } else if (file.type === "application/pdf") {
        setPdf(file);
        setListingInput((prev) => ({
          ...prev,
          hasAttachment: true,
        }));
      }
    }
  }

  function handleInputChange(e) {
    e.preventDefault();
    const fileList = e.target.files;
    const MAX_IMAGE_SIZE_MB = 20;
    let hasImage = false;
    let hasPdf = false;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];

      if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
        return t("maxFileSizeAllert");
      }

      if (file.type.startsWith("image/")) {
        hasImage = true;
      } else if (file.type === "application/pdf") {
        hasPdf = true;
      }
    }

    if (hasImage && hasPdf) {
      alert(t("imagePdfAlert"));
      return;
    }

    const filesArray = Array.from(fileList);

    if (hasImage) {
      setLocalImageOrPdf(true);
      setImage(filesArray);
      setListingInput((prev) => ({
        ...prev,
        hasAttachment: false,
      }));
    }

    if (hasPdf) {
      setLocalImageOrPdf(true);
      setPdf(filesArray[0]);
      setListingInput((prev) => ({
        ...prev,
        hasAttachment: true,
      }));
    }
  }

  const handleMultipleInputChange = (event) => {
    const newFiles = Array.from(event.target.files);

    if (image.length > 0) {
      const validImages = newFiles.filter(file => file.type.startsWith("image/"));
      const invalidFiles = newFiles.filter(file => !file.type.startsWith("image/"));

      if (invalidFiles.length > 0) {
        alert(t("imagePdfAlert"));
      } else {
        const totalImages = image.length + validImages.length;

        if (totalImages > 8) {
          alert(t("listingImageNumberAlert", { limit: MAX_IMAGES }));
        } else {
          setLocalImages((prevImages) => [...prevImages, ...validImages]);
          setImage((prevImages) => [...prevImages, ...validImages]);
        }
      }
    } else {
      newFiles.forEach(file => {
        if (file.type === "application/pdf") {
          setLocalImageOrPdf(true);
          setPdf(file);
          setListingInput((prev) => ({
            ...prev,
            hasAttachment: true,
          }));
        } else if (file.type.startsWith("image/")) {
          setLocalImages((prevImages) => [...prevImages, file]);
          setImage((prevImages) => [...prevImages, file]);
        }
      });
    }
  };

  const handleUpdateMultipleInputChange = (e) => {
    const newFiles = Array.from(e.target.files);

    if (image.length > 0) {
      const validImages = newFiles.filter(file => file.type.startsWith("image/"));
      const invalidFiles = newFiles.filter(file => !file.type.startsWith("image/"));

      if (invalidFiles.length > 0) {
        alert(t("imagePdfAlert"));
      } else {
        setLocalImages((prevImages) => [...prevImages, ...validImages]);
        setImage((prevImages) => [...prevImages, ...validImages]);
        setLocalImageOrPdf(true);
      }
    } else {
      newFiles.forEach(file => {
        if (file.type === "application/pdf") {
          setLocalImageOrPdf(true);
          setPdf(file);
          setListingInput((prev) => ({
            ...prev,
            hasAttachment: true,
          }));
        } else if (file.type.startsWith("image/")) {
          setLocalImages((prevImages) => [...prevImages, file]);
          setImage((prevImages) => [...prevImages, file]);
        }
      });
    }
  };

  function handleRemoveImage() {
    if (listingId) {
      setListingInput((prev) => ({
        ...prev,
        removeImage: true,
        logo: null,
      }));
    }
    setImage((prevImages) => {
      const updatedImages = [...prevImages];
      return updatedImages;
    });
  }

  function handleRemovePDF() {
    if (listingId) {
      setListingInput((prev) => ({
        ...prev,
        removePdf: true,
        pdf: null,
      }));
    }
    setPdf(null);
    setListingInput((prev) => ({
      ...prev,
      hasAttachment: false,
    }));
  }

  const [cityIds] = useState(0);
  const [cities, setCities] = useState([]);

  // --- Single City Dropdown State ---
  const [selectedSingleCity, setSelectedSingleCity] = useState(null);
  const [isOpenSingle, setIsOpenSingle] = useState(false);
  const singleDropdownRef = useRef(null);

  // --- Multiple City Dropdown State ---
  const [selectedCities, setSelectedCities] = useState([]);
  const [isOpenMultiple, setIsOpenMultiple] = useState(false);
  const multipleDropdownRef = useRef(null);

  const [listingInput, setListingInput] = useState({
    categoryId: 0,
    subcategoryId: 0,
    cityIds: [],
    statusId: 1,
    title: "",
    place: "",
    address: "",
    phone: "",
    website: "",
    email: "",
    description: "",
    logo: null,
    pdf: null,
    startDate: "",
    endDate: "",
    originalPrice: "",
    zipCode: "",
    discountedPrice: "",
    removeImage: false,
    removePdf: false,
    hasImage: false,
    hasAttachment: false,
  });

  const [error, setError] = useState({
    categoryId: "",
    subcategoryId: "",
    title: "",
    description: "",
    cityIds: "",
    cityAlreadySelected: "",
    startDate: "",
    endDate: "",
  });

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const initialTimeSlot = { startTime: "00:00", endTime: "00:00" };

  const [appointmentInput, setAppointmentInput] = useState({
    title: "",
    description: "",
    startDate: new Date().toISOString().slice(0, 16) + ":00",

    metadata: {
      holidays: [],
      openingDates: daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [initialTimeSlot] }), {}),
      maxBookingPerSlot: 5,
    },
    services: [{
      name: "",
      duration: "",
      // durationUnit: "minutes",
      slotSameAsAppointment: false,
      metadata: {
        holidays: [],
        openingDates: daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [initialTimeSlot] }), {}),
        maxBookingPerSlot: 5,
      },
    }],
  });

  const [appointmentError, setAppointmentError] = useState({
    name: "",
    duration: "",
    endTime: "",
    startTime: "",
    metadata: {
      holidays: "",
      openingDates: "",
      maxBookingPerSlot: "",
    },
  });

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimStartDate = (startDate) => {
      if (startDate.endsWith(".000Z")) {
        return startDate.slice(0, -5);
      }
      return startDate;
    };

    const validateTimeSlots = () => {
      for (let service of appointmentInput.services) {
        const { duration, metadata: { openingDates } } = service;
        const durationInMinutes = parseInt(duration, 10);

        for (let day in openingDates) {
          for (let slot of openingDates[day]) {
            const [startHour, startMinute] = slot.startTime.split(":").map(Number);
            const [endHour, endMinute] = slot.endTime.split(":").map(Number);

            // Skip validation if both startTime and endTime are 00:00
            if (slot.startTime === "00:00" && slot.endTime === "00:00") {
              continue;
            }

            const slotDuration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);

            if (slotDuration < durationInMinutes) {
              return t("slotDurationMismatch", {
                day,
                duration,
                startTime: slot.startTime,
                endTime: slot.endTime
              });
            }
          }
        }
      }
      return null;
    };

    if (appointmentAdded) {
      const errorMessage = validateTimeSlots();
      if (errorMessage) {
        setErrorMessage(errorMessage);
        return;
      }
    }

    let valid = true;
    const newError = { ...error };

    if (!selectedSingleCity) {
      newError.singleCity = t("pleaseSelectCity");
      valid = false;
    }

    for (const key in error) {
      const errorMessage = getErrorMessage(key, listingInput[key]);
      newError[key] = errorMessage;
      if (errorMessage) {
        valid = false;
      }
    }

    setError(newError);

    if (!valid) {
      console.error("Validation failed. Errors: ", newError);
      return;
    }

    if (valid) {
      setUpdating(true);

      try {
        const cityIdsToSubmit = listingInput.cityIds;
        const dataToSubmit = {
          ...listingInput,
          cityIds: cityIdsToSubmit,
        };

        const response = newListing
          ? await postListingsData(dataToSubmit)
          : await updateListingsData(cityIdsToSubmit, dataToSubmit, listingId);

        let currentListingId = [];
        let cityIdsArray = [];
        if (response && response.data && response.data.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          currentListingId = response.data.data.map(item => item.listingId);
          cityIdsArray = response.data.data.map(item => item.cityId);
        } else {
          console.error("Invalid response structure. Response:", response);
          throw new Error("Unable to retrieve listing and city IDs");
        }
        // Filter opening dates for appointmentInput and services before submitting
        const filteredOpeningDates = filterOpeningDates(appointmentInput.metadata.openingDates);
        const filteredServices = appointmentInput.services.map(service => ({
          ...service,
          metadata: {
            ...service.metadata,
            openingDates: filterOpeningDates(service.metadata.openingDates),
          },
        }));

        const filteredAppointmentInput = {
          ...appointmentInput,
          startDate: trimStartDate(appointmentInput.startDate), // Trim .000Z part from startDate
          metadata: {
            ...appointmentInput.metadata,
            openingDates: filteredOpeningDates,
          },
          services: filteredServices,
        };

        if (listingInput.removeImage) {
          if (image.length === 0) {
            await deleteListingImage(cityIds, listingId);
          } else {
            if (!localImageOrPdf) {
              const imageForm = new FormData();
              for (let i = 0; i < image.length; i++) {
                imageForm.append("image", image[i]);
              }

              await uploadListingImage(
                imageForm,
                cityIds,
                response.data.id || listingId
              );
            }
          }
        }

        if (localImageOrPdf) {
          if (image && image.length > 0) {
            const imageArray = Array.from(image);
            const imageForm = new FormData();
            let allPromises = []
            for (let img of imageArray) {
              imageForm.append("image", img);
            }
            if (process.env.REACT_APP_V2_BACKEND === "True") {
              await uploadListingImage(imageForm, null, newListing ? currentListingId[0] : listingId)
            } else {
              for (let index = 0; index < currentListingId.length; index++) {
                allPromises.push(uploadListingImage(imageForm, cityIdsArray[index], currentListingId[index]))
              }
              await Promise.all(allPromises)
            }
          } else if (pdf) {
            const pdfForm = new FormData();
            pdfForm.append("pdf", pdf); // Append the PDF only once

            if (process.env.REACT_APP_V2_BACKEND === "True") {
              await uploadListingPDF(pdfForm, null, newListing ? currentListingId[0] : listingId);
            } else {
              const allPromises = currentListingId.map((listingId, index) =>
                uploadListingPDF(pdfForm, cityIdsArray[index], listingId)
              );
              await Promise.all(allPromises);
            }
          }
        }

        if (!newListing && listingInput.appointmentId) {
          try {
            await updateAppointments(cityIds, listingId, listingInput.appointmentId, filteredAppointmentInput);
          } catch (error) {
            console.error('Error updating appointment:', error);
          }
        } else if (appointmentAdded) {
          const minIterations = Math.min(cityIdsArray.length);
          let allAppointmentPromises = []
          for (let index = 0; index < minIterations; index++) {
            const cityId = cityIdsArray[index];
            const listingId = currentListingId[index];

            try {
              // await createAppointments(cityId, listingId, filteredAppointmentInput);
              allAppointmentPromises.push(createAppointments(cityId, listingId, filteredAppointmentInput))
            } catch (error) {
              console.error('Error posting appointment:', error);
            }
          }


          await Promise.all(allAppointmentPromises);
        }

        isAdmin
          ? setSuccessMessage(t("listingUpdatedAdmin"))
          : newListing
            ? setSuccessMessage(t("listingCreated"))
            : setSuccessMessage(t("listingUpdated"));

        setIsSuccess(true);
        setTimeout(() => {
          setSuccessMessage(false);
          navigate("/Dashboard");
        }, 5000);
      } catch (error) {
        console.error("Error during submission:", error);
        setErrorMessage(t("changesNotSaved"));
        setTimeout(() => setErrorMessage(false), 5000);
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
    navigate('/Dashboard');
  };

  const filterOpeningDates = (openingDates) => {
    return Object.keys(openingDates).reduce((acc, day) => {
      if (openingDates[day].some(slot => slot.startTime !== "00:00" || slot.endTime !== "00:00")) {
        acc[day] = openingDates[day];
      }
      return acc;
    }, {});
  };

  useEffect(() => {
    const fetchData = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      const accessToken =
        window.localStorage.getItem("accessToken") ||
        window.sessionStorage.getItem("accessToken");
      const refreshToken =
        window.localStorage.getItem("refreshToken") ||
        window.sessionStorage.getItem("refreshToken");

      if (!accessToken && !refreshToken) {
        navigateTo("/login");
        return;
      }

      const cityIds = searchParams.get("cityId");
      const listingId = searchParams.get("listingId");

      try {
        // Fetch all required data
        const [citiesResponse, categoriesResponse, subcategoriesResponse] = await Promise.all([
          getCities(),
          getCategory(),
          getListingsSubCategory(),
        ]);

        const citiesData = citiesResponse?.data?.data || [];
        setCities(citiesData);

        const categories = categoriesResponse?.data?.data || [];
        const filteredCategories = categories.filter(
          (category) => !hiddenCategories.includes(category.id)
        );
        setCategories(filteredCategories);

        const subcategories = subcategoriesResponse?.data?.data || [];
        const subcatList = {};
        subcategories.forEach((subCat) => {
          subcatList[subCat.id] = subCat.name;
        });
        setSubCategories(subcatList);

        if (listingId) {
          setListingId(parseInt(listingId));
          setNewListing(false);

          // const listingsResponse = isV2Backend
          //   ? await getListingsById(null, listingId)
          //   : await getListingsById(cityIds, listingId);
          const listingsResponse = await getListingsById(null, listingId);

          const listingData = listingsResponse.data.data;
          const allCities = listingData.allCities || [];

          const [firstCityId, ...otherCityIds] = allCities;
          const singleCityObject = citiesData.find((c) => c.id === firstCityId) || null;
          const multiCityObjects = citiesData.filter((c) => otherCityIds.includes(c.id));
          setSelectedSingleCity(singleCityObject);
          setSelectedCities(multiCityObjects);

          setListingInput({
            ...listingInput,
            cityIds: allCities.length > 0 ? allCities : [listingData.cityId],
            title: listingData.title || "",
            categoryId: listingData.categoryId,
            subcategoryId: listingData.subcategoryId,
            description: listingData.description,
          });
          setDescription(listingData.description);
          setCategoryId(listingData.categoryId);
          setSubcategoryId(listingData.subcategoryId);

          if (listingData.categoryId === 1 && !listingData.expiryDate) {
            setListingInput((prevState) => ({
              ...prevState,
              disableDates: true,
            }));
          }

          // Handle appointments
          if (listingData.appointmentId) {
            // const fetchAppointments = isV2Backend
            //   ? getAppointments(null, listingData.id, listingData.appointmentId)
            //   : getAppointments(cityIds, listingData.id, listingData.appointmentId);

            const fetchAppointments = getAppointments(null, listingData.id, listingData.appointmentId);

            const appointmentResponse = await fetchAppointments;
            const appointmentData = appointmentResponse.data.data;
            appointmentData.metadata = JSON.parse(appointmentData.metadata);

            daysOfWeek.forEach((day) => {
              if (!appointmentData.metadata.openingDates[day]) {
                appointmentData.metadata.openingDates[day] = [{ startTime: "00:00", endTime: "00:00" }];
              }
            });

            setAppointmentInput(appointmentData);

            // const fetchServices = isV2Backend
            //   ? getAppointmentServices(null, listingData.id, listingData.appointmentId)
            //   : getAppointmentServices(cityIds, listingData.id, listingData.appointmentId);

            const fetchServices = getAppointmentServices(null, listingData.id, listingData.appointmentId);

            const servicesResponse = await fetchServices;
            const servicesData = servicesResponse.data.data.map((item) => {
              const metadata = JSON.parse(item.metadata);

              daysOfWeek.forEach((day) => {
                if (!metadata.openingDates[day]) {
                  metadata.openingDates[day] = [{ startTime: "00:00", endTime: "00:00" }];
                }
              });

              return { ...item, metadata };
            });

            setAppointmentInput((prevState) => ({
              ...prevState,
              services: servicesData,
            }));
          }

          // Handle images or PDF
          if (listingData.otherLogos && listingData.otherLogos.length > 0) {
            const sortedLogos = listingData.otherLogos
              .sort(({ imageOrder: a }, { imageOrder: b }) => a - b)
              .map((img) => img.logo);
            setImage(sortedLogos); // Use sorted logos
          } else if (listingData.logo) {
            setImage([listingData.logo]); // Use the primary logo
          } else if (listingData.pdf) {
            setPdf({
              link: process.env.REACT_APP_BUCKET_HOST + listingData.pdf,
              name: listingData.pdf.split("/")[1],
            });
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [listingId]);

  function categoryDescription(category) {
    if (category === "4") {
      return "clubsDescription";
    } else if (category === "10") {
      return "companyPortraitsDescription";
    } else {
      return "";
    }
  }

  useEffect(() => {
    let valid = true;
    for (let property in error) {
      if (error[property]) {
        valid = false;
      }
    }
  }, [error]);

  const onInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "title" && value.length > CHARACTER_LIMIT_TITLE) {
      setError((prev) => ({
        ...prev,
        title: t("characterLimitExceeded", {
          limit: CHARACTER_LIMIT_TITLE,
          count: value.length
        }),
      }));
      return;
    } else if (type === "checkbox") {
      setListingInput((prev) => ({
        ...prev,
        [name]: checked,
        timeless: checked,
        expiryDate: checked ? null : getDefaultEndDate(),
      }));
    } else {
      setListingInput((prev) => ({
        ...prev,
        [name]: value,
      }));

      if (name !== "email") {
        setAppointmentInput((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    }

    validateInput(e);
  };

  const navigateTo = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const [description, setDescription] = useState("");

  useEffect(() => {
    const quill = editor.current?.getEditor();

    if (quill) {
      quill.clipboard.addMatcher("IMG", (node, delta) => {
        const imageUrl = node.getAttribute("src");
        return new Delta().insert(imageUrl || "[Image]");
      });
    }
  }, []);

  const onDescriptionChange = (newContent) => {
    const hasNumberedList = newContent.includes("<ol>");
    const hasBulletList = newContent.includes("<ul>");
    let descriptions = [];
    let listType = "";

    const plainText = newContent.replace(/(<([^>]+)>)/gi, "");
    const characterCount = plainText.length;

    if (characterCount > CHARACTER_LIMIT_DESCRIPTION) {
      setError((prev) => ({
        ...prev,
        description: t("characterLimitExceeded", {
          limit: CHARACTER_LIMIT_DESCRIPTION,
          count: characterCount,
        }),
      }));
      return;
    } else {
      setError((prev) => ({
        ...prev,
        description: "",
      }));
    }

    if (hasNumberedList || hasBulletList) {
      const liRegex = /<li>(.*?)(?=<\/li>|$)/gi;
      const matches = newContent.match(liRegex);
      if (matches) {
        descriptions = matches.map((match) => match.replace(/<\/?li>/gi, ""));
      }

      listType = hasNumberedList ? "ol" : "ul";

      const listHTML = `<${listType}>${descriptions
        .map((item) => `<li>${item}</li>`)
        .join("")}</${listType}>`;

      let leftoverText = newContent
        .replace(/<ol>.*?<\/ol>/gis, "")
        .replace(/<ul>.*?<\/ul>/gis, "")
        .trim();

      leftoverText = leftoverText
        .replace(/<p>/gi, "")
        .replace(/<\/p>/gi, "<br>");

      const finalDescription = leftoverText
        ? `${leftoverText}<br/>${listHTML}`
        : listHTML;

      setListingInput((prev) => ({
        ...prev,
        description: finalDescription,
      }));
    } else {
      setListingInput((prev) => ({
        ...prev,
        description: newContent.replace(/<p>/g, "").replace(/<\/p>/g, "<br>"),
      }));
    }

    setDescription(newContent);
  };

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getErrorMessage = (name, value) => {
    switch (name) {
      case "title":
        if (!value) {
          return t("pleaseEnterTitle");
        } else {
          return "";
        }

      case "categoryId":
        if (!parseInt(value)) {
          return t("pleaseSelectCategory");
        } else {
          return "";
        }

      case "subCategoryId":
        if (categories.find(cat => cat.id === parseInt(listingInput.categoryId))?.noOfSubcategories > 0 && !value) {
          return t("pleaseSelectSubcategory");
        } else {
          return "";
        }

      case "description":
        if (!value) {
          return t("pleaseEnterDescription");
        } else {
          return "";
        }

      case "startDate":
        if (!value && parseInt(listingInput.categoryId) === 3) {
          return t("pleaseEnterStartDate");
        } else if (value) {
          return "";
        }
        return "";

      case "endDate":
        if (listingInput.startDate && new Date(listingInput.startDate) > new Date(value)) {
          return t("endDateBeforeStartDate");
        }
        return "";

      case "expiryDate":
        if (!value && parseInt(listingInput.categoryId) === 1) {
          return t("pleaseEnterExpiryDate");
        }
        if (value && new Date(value) < new Date()) {
          return t("expiryDateInPast");
        }
        return "";

      case "email":
        if (!value) {
          return "";
        } else if (!isValidEmail(value)) {
          return t("pleaseEnterValidEmail");
        } else {
          return "";
        }

      case "name":
        if (!parseInt(value)) {
          return t("pleaseSelectServiceName");
        } else {
          return "";
        }

      case "duration":
        if (!parseInt(value)) {
          return t("pleaseSelectDuration");
        } else {
          return "";
        }

      case "phone":
        const phoneRegex = /^\d+$/;
        if (!value) {
          return ""; // Allow empty phone field
        } else if (!value.match(phoneRegex)) {
          return t("pleaseEnterValidPhoneNumber");
        }
        return "";

      default:
        return "";
    }
  };

  const validateInput = (e) => {
    if (e && e.target) {
      const { name, value } = e.target;
      const errorMessage = getErrorMessage(name, value);
      setError((prevState) => ({
        ...prevState,
        [name]: errorMessage,
      }));

      const inputDate = new Date(value);
      if (name === "startDate" || name === "endDate") {
        const startDate = name === "startDate" ? inputDate : new Date(listingInput.startDate);
        const endDate = name === "endDate" ? inputDate : new Date(listingInput.endDate);

        if (startDate && endDate && startDate > endDate) {
          setError((prevState) => ({
            ...prevState,
            endDate: t("endDateBeforeStartDate"),
          }));
        } else {
          setError((prevState) => ({
            ...prevState,
            endDate: "",
          }));
        }
      }

      if (name === "expiryDate") {
        const expiryDate = new Date(listingInput.expiryDate);
        const now = new Date();

        if (expiryDate && expiryDate < now) {
          setError((prevState) => ({
            ...prevState,
            expiryDate: t("expiryDateInPast"),
          }));
        } else {
          setError((prevState) => ({
            ...prevState,
            expiryDate: "",
          }));
        }
      }
    }
  };

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesResponse = await getCities();
        const citiesData = citiesResponse?.data?.data || [];

        if (!Array.isArray(citiesData) || citiesData.length === 0) {
          console.error("No cities found");
          return;
        }

        setCities(citiesData);
        if (citiesData.length === 1) {
          const cityId = citiesData[0].id;
          const cityName = citiesData[0].name;

          setSelectedCities([{ id: cityId, name: cityName }]);
          setListingInput((prev) => ({
            ...prev,
            cityIds: [cityId],
            villageId: 0,
          }));
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  const [categoryId, setCategoryId] = useState(0);
  const [subcategoryId, setSubcategoryId] = useState(0);

  const handleCategoryChange = async (event) => {
    const selectedCategoryId = parseInt(event.target.value, 10);
    setCategoryId(selectedCategoryId);
    const selectedCategory = categories.find(category => category.id === selectedCategoryId);
    setSubcategoryId(null);
    setListingInput((prevInput) => ({ ...prevInput, categoryId: selectedCategoryId, subcategoryId: 0 }));

    if (selectedCategory && selectedCategory.noOfSubcategories > 0) {
      try {
        const subCats = await getListingsSubCategory(selectedCategoryId);
        const filteredSubCategories = subCats?.data?.data;

        const subcatList = {};
        filteredSubCategories.forEach((subCat) => {
          subcatList[subCat.id] = subCat.name;
        });

        setSubCategories(subcatList);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    } else {
      setSubCategories([]);
    }
    if (selectedCategoryId === 18) {
      setAppointmentAdded(true);
    }
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("categoryId", selectedCategoryId);
    urlParams.delete("subcategoryId");
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  const handleSubcategoryChange = (event) => {
    let subcategoryId = event.target.value;
    setSubcategoryId(subcategoryId);
    setListingInput((prevInput) => ({ ...prevInput, subcategoryId }));
    validateInput(event);
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("subcategoryId", subcategoryId);
    if (subcategoryId === 0) {
      urlParams.delete("subCategoryId");
    }
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };

  function formatDateTime(dateTime) {
    const date = new Date(dateTime.replace("Z", ""));
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const milliseconds = String(date.getMilliseconds()).padStart(3, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  // Filter out any city already in the multi-city selection
  const singleDropdownCities = cities.filter(
    c => !selectedCities.some(mC => mC.id === c.id)
  );

  // Filter out the single-selected city
  const multipleDropdownCities = selectedSingleCity
    ? cities.filter(c => c.id !== selectedSingleCity.id)
    : cities;

  const toggleSingleDropdown = () => {
    setIsOpenSingle(prev => !prev);
  };

  const handleSelectSingleCity = (city) => {
    setSelectedSingleCity(city);
    setError(prev => ({ ...prev, singleCity: "" }));
  };

  const handleRemoveSingleCity = () => {
    setSelectedSingleCity(null);
  };

  const toggleMultipleDropdown = () => {
    setIsOpenMultiple((prev) => !prev);
  };

  const handleSelectCity = (city) => {
    if (!selectedCities.some((selectedCity) => selectedCity.id === city.id)) {
      const updatedCities = [...selectedCities, city];
      setSelectedCities(updatedCities);
      setError(prev => ({ ...prev, cityAlreadySelected: "" }));
    } else {
      setError(prev => ({
        ...prev,
        cityAlreadySelected: t("cityAlreadySelected"),
      }));
    }
  };

  const handleRemoveCity = (cityId) => {
    const updatedCities = selectedCities.filter(city => city.id !== cityId);
    setSelectedCities(updatedCities);
  };

  useEffect(() => {
    const mergedCityIds = [];
    if (selectedSingleCity) {
      mergedCityIds.push(selectedSingleCity.id);
    }
    selectedCities.forEach((city) => {
      if (!mergedCityIds.includes(city.id)) {
        mergedCityIds.push(city.id);
      }
    });

    setListingInput((prev) => ({
      ...prev,
      cityIds: mergedCityIds,
    }));
  }, [selectedSingleCity, selectedCities]);

  // Handle outside clicks to close Single-City dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        singleDropdownRef.current &&
        !singleDropdownRef.current.contains(event.target)
      ) {
        setIsOpenSingle(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle outside clicks to close Multiple-City dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        multipleDropdownRef.current &&
        !multipleDropdownRef.current.contains(event.target)
      ) {
        setIsOpenMultiple(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const isCategorySpecificValid =
      categoryId === 3 ? listingInput.startDate : true;

    const checkFormValidity = () => {
      const requiredFields = [
        listingInput.title,
        listingInput.description,
        categoryId,
        selectedSingleCity,
        !(error.title || error.description || error.categoryId),
        isCategorySpecificValid,
      ];

      return requiredFields.every(Boolean);
    };

    const isValid = checkFormValidity();
    setIsFormValid(isValid);
  }, [listingInput, error, categoryId, selectedCities, selectedSingleCity]);

  return (
    <section className="bg-slate-600 body-font relative">
      <SideBar />

      <div className="container w-auto px-5 py-2 bg-slate-600">
        <div className="bg-white mt-4 p-6 space-y-10">
          <h2
            style={{
              fontFamily: "Poppins, sans-serif",
            }}
            className="text-gray-900 text-lg mb-4 font-medium title-font"
          >
            {t("uploadPost")}
            <div className="my-4 bg-gray-600 h-[1px]"></div>
          </h2>
          <div className="relative mb-0">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-600"
            >
              {t("title")} *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={listingInput.title}
              onChange={onInputChange}
              onBlur={validateInput}
              required
              className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
              placeholder={t("enterTitle")}
            />
            <div className="flex justify-between text-sm mt-1">
              <span
                className={`${listingInput.title.replace(/(<([^>]+)>)/gi, "").length > CHARACTER_LIMIT_TITLE
                  ? "mt-2 text-sm text-red-600"
                  : "mt-2 text-sm text-gray-500"
                  }`}
              >
                {listingInput.title.replace(/(<([^>]+)>)/gi, "").length}/{CHARACTER_LIMIT_TITLE}
              </span>
              {error.title && (
                <span className="mt-2 text-sm text-red-600">
                  {error.title}
                </span>
              )}
            </div>
          </div>

          {/* SINGLE CITY DROPDOWN */}
          <div className="relative mb-4" ref={singleDropdownRef}>
            <label htmlFor="singleCity" className="block text-sm font-medium text-gray-600">
              {t("myCommunity")} *
            </label>
            <div
              className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onClick={toggleSingleDropdown}
            >
              <div className="flex flex-wrap">
                {selectedSingleCity ? (
                  <div className="flex justify-center items-center m-1 font-medium py-1 px-2 rounded-full text-teal-700 bg-teal-100 border border-teal-300">
                    <span>{selectedSingleCity.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveSingleCity();
                      }}
                      className="text-red-600 ml-2"
                    >
                      &times;
                    </button>
                  </div>
                ) : (
                  <span className="bg-transparent outline-none flex-1 cursor-pointer">{t("select")}</span>
                )}
              </div>
            </div>
            {isOpenSingle && (
              <div className="absolute top-full mt-2 w-full bg-white rounded shadow-lg z-10 max-h-40 overflow-y-auto border border-gray-300">
                {singleDropdownCities.map(city => (
                  <div
                    key={city.id}
                    onClick={() => handleSelectSingleCity(city)}
                    className={`cursor-pointer px-3 py-2 hover:bg-teal-100 ${selectedSingleCity?.id === city.id ? "text-teal-700" : "text-gray-700"
                      }`}
                  >
                    {city.name}
                  </div>
                ))}
              </div>
            )}
            {/* Show error ONLY if single city not picked */}
            {error.singleCity && (
              <div className="mt-2 text-sm text-red-600">
                {error.singleCity}
              </div>
            )}
          </div>

          {/* MULTIPLE CITY DROPDOWN */}
          <div className="relative mb-4" ref={multipleDropdownRef}>
            <label htmlFor="multipleCity" className="block text-sm font-medium text-gray-600">
              {process.env.REACT_APP_REGION_NAME === "HIVADA" ? t("cluster") : t("city")}
            </label>
            <div
              className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black  text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onClick={toggleMultipleDropdown}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCity(city.id);
                      }}
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
            {isOpenMultiple && (
              <div className="absolute top-full mt-2 w-full bg-white rounded shadow-lg z-10 max-h-40 overflow-y-auto border border-gray-300">
                {multipleDropdownCities.map(city => (
                  <div
                    key={city.id}
                    onClick={() => handleSelectCity(city)}
                    className={`cursor-pointer px-3 py-2 hover:bg-teal-100 ${selectedCities.some(sC => sC.id === city.id) ? "text-teal-700" : "text-gray-700"
                      }`}
                  >
                    {city.name}
                  </div>
                ))}
              </div>
            )}
            {/* Display only if user tries to select an already selected city */}
            {error.cityAlreadySelected && (
              <div className="mt-2 text-sm text-red-600">
                {error.cityAlreadySelected}
              </div>
            )}
          </div>

          <div className="relative mb-4">
            <label
              htmlFor="dropdown"
              className="block text-sm font-medium text-gray-600"
            >
              {t("category")} *
            </label>
            <select
              type="categoryId"
              id="categoryId"
              name="categoryId"
              value={categoryId || 0}
              onChange={handleCategoryChange}
              required
              // disabled={!newListing}
              className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
            >
              <option className="font-sans" value={0} key={0}>
                {t("chooseOneCategory")}
              </option>
              {categories.map((category) => {
                return (
                  <option className="font-sans" value={category.id} key={category.id}>
                    {t(category.name)} {t(categoryDescription(category.id))}
                  </option>
                );
              })}
            </select>
            <div
              className="mt-2 text-sm text-red-600"
              style={{
                visibility: error.categoryId ? "visible" : "hidden",
              }}
            >
              {error.categoryId}
            </div>
          </div>

          {categoryId == 18 && <ServiceAndTime appointmentInput={appointmentInput} setAppointmentInput={setAppointmentInput}
            appointmentError={appointmentError} setAppointmentError={setAppointmentError} daysOfWeek={daysOfWeek} initialTimeSlot={initialTimeSlot} />}

          {Object.keys(subCategories).length > 0 && (
            <div className="relative mb-0">
              <label htmlFor="subcategoryId" className="block text-sm font-medium text-gray-600">
                {t("subCategory")} *
              </label>
              <select
                id="subcategoryId"
                name="subcategoryId"
                value={subcategoryId || 0}
                onChange={handleSubcategoryChange}
                required
                className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
              >
                <option value={0}>{t("chooseOneSubCategory")}</option>
                {Object.entries(subCategories).map(([id, name]) => (
                  <option key={id} value={id}>
                    {t(name)}
                  </option>
                ))}
              </select>
              {error.subcategoryId && (
                <div className="mt-2 text-sm text-red-600">{error.subcategoryId}</div>
              )}
            </div>
          )}

          {categoryId == 1 && (
            <div className="relative mb-0">
              <div className="items-stretch py-0 grid grid-cols-1 md:grid-cols-1 gap-4">
                {listingInput.disableDates ? (
                  <label
                    htmlFor="dropdown"
                    className="text-gray-600 text-md mb-4 font-medium title-font"
                  >
                    * {t("noExpiryMessage")}
                  </label>
                ) : (
                  <>
                    <div className="relative">
                      <div className="flex absolute inset-y-0 items-center pl-3 pointer-events-none">
                        <svg
                          aria-hidden="true"
                          className="w-5 h-5 text-gray-600 dark:text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          xmlns="http://www.w3.org/2000/svg"
                        ></svg>
                      </div>
                      <label
                        htmlFor="expiryDate"
                        className="block text-sm font-medium text-gray-600"
                      >
                        {t("expiryDate")} *
                      </label>
                      <Flatpickr
                        id="expiryDate"
                        name="expiryDate"
                        value={
                          listingInput.expiryDate
                            ? formatDateTime(listingInput.expiryDate)
                            : getDefaultEndDate()
                        }
                        options={{ enableTime: true, dateFormat: "Y-m-d H:i", time_24hr: true }}
                        onChange={(date) => {
                          const formattedDate = format(date[0], "yyyy-MM-dd'T'HH:mm");
                          setListingInput(prev => ({ ...prev, expiryDate: formattedDate }));
                          validateInput({ target: { name: "expiryDate", value: formattedDate } });
                        }}
                        className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                        placeholder={t("expiryDate")}
                        onBlur={validateInput}
                      />
                      <div
                        className="mt-2 text-sm text-red-600"
                        style={{
                          visibility: error.expiryDate ? "visible" : "hidden",
                        }}
                      >
                        {error.expiryDate}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-2">
                <input
                  type="checkbox"
                  id="disableDates"
                  name="disableDates"
                  checked={listingInput.disableDates}
                  onChange={onInputChange}
                  className="mt-0"
                />
                <label
                  htmlFor="disableDates"
                  className="block text-sm font-medium text-gray-600"
                >
                  {t("disableDates")}
                </label>
              </div>
            </div>
          )}

          {categoryId == 3 && (
            <div className="relative mb-0">
              <div className="items-stretch py-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <div className="flex absolute inset-y-0 items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-600 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    ></svg>
                  </div>
                  <label
                    htmlFor="startDate"
                    className="block text-sm font-medium text-gray-600"
                  >
                    {t("eventStartDate")} *
                  </label>
                  <Flatpickr
                    id="startDate"
                    name="startDate"
                    value={listingInput.startDate}
                    options={{ enableTime: true, dateFormat: "Y-m-d H:i", time_24hr: true }}
                    onChange={(date) => {
                      const formattedDate = format(date[0], "yyyy-MM-dd'T'HH:mm");
                      setListingInput(prev => ({ ...prev, startDate: formattedDate }));
                      validateInput({ target: { name: "startDate", value: formattedDate } });
                    }}
                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                    placeholder={t("eventStartDate")}
                    onBlur={validateInput}
                  />
                  <div
                    className="mt-2 text-sm text-red-600"
                    style={{
                      visibility: error.startDate ? "visible" : "hidden",
                    }}
                  >
                    {error.startDate}
                  </div>
                </div>

                <div className="relative">
                  <div className="flex absolute inset-y-0 items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-600 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    ></svg>
                  </div>
                  <label
                    htmlFor="endDate"
                    className="block text-sm font-medium text-gray-600"
                  >
                    {t("eventEndDate")}
                  </label>
                  <Flatpickr
                    id="endDate"
                    name="endDate"
                    value={listingInput.endDate}
                    options={{ enableTime: true, dateFormat: "Y-m-d H:i", time_24hr: true }}
                    onChange={(date) => {
                      const formattedDate = format(date[0], "yyyy-MM-dd'T'HH:mm");
                      setListingInput(prev => ({ ...prev, endDate: formattedDate }));
                      validateInput({ target: { name: "endDate", value: formattedDate } });
                    }}
                    className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-400 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                    placeholder={t("eventEndDate")}
                    onBlur={validateInput}
                  />
                  <div
                    className="mt-2 text-sm text-red-600"
                    style={{
                      visibility: error.endDate ? "visible" : "hidden",
                    }}
                  >
                    {error.endDate}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="relative mb-4">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-600"
            >
              {process.env.REACT_APP_REGION_NAME === "HIVADA" ? t("stichworte") : t("streetAddress")}
            </label>
            <div>
              <input
                type="text"
                id="address"
                name="address"
                value={listingInput.address}
                onChange={onInputChange}
                onBlur={validateInput}
                className="shadow-md w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                placeholder={t("enterAddress")}
              />
            </div>
          </div>

          {(categoryId == 12 || categoryId == 5) && (
            <div className="relative mb-0 grid grid-cols-2 gap-4">
              <div className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                <label
                  htmlFor="place"
                  className="block text-sm font-medium text-gray-600"
                >
                  {t("originalPrice")}
                </label>
                <input
                  type="text"
                  id="originalPrice"
                  name="originalPrice"
                  value={listingInput.originalPrice}
                  onChange={onInputChange}
                  onBlur={validateInput}
                  required
                  className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                  placeholder="Enter the price of the product"
                />
              </div>
              <div className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                <label
                  htmlFor="place"
                  className="block text-sm font-medium text-gray-600"
                >
                  {t("discountedPrice")}
                </label>
                <input
                  type="text"
                  id="discountedPrice"
                  name="discountedPrice"
                  value={listingInput.discountedPrice}
                  onChange={onInputChange}
                  onBlur={validateInput}
                  required
                  className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                  placeholder="Enter the price of the product"
                />
              </div>
            </div>
          )}

          <div className="relative mb-0">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-600"
            >
              {process.env.REACT_APP_REGION_NAME === "HIVADA" ? t("personen") : t("telephone")}
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={listingInput.phone}
              onChange={onInputChange}
              onBlur={validateInput}
              className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
              placeholder={t("pleaseEnterPhone")}
            />
            <div
              className="mt-2 text-sm text-red-600"
              style={{
                visibility: error.phone ? "visible" : "hidden",
              }}
            >
              {error.phone}
            </div>
          </div>

          <div className="relative mb-0">
            <label
              htmlFor="place"
              className="block text-sm font-medium text-gray-600"
            >
              {t("email")}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={listingInput.email}
              onChange={onInputChange}
              onBlur={validateInput}
              className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
              placeholder={t("emailExample")}
            />
            <div
              className="mt-2 text-sm text-red-600"
              style={{
                visibility: error.email ? "visible" : "hidden",
              }}
            >
              {error.email}
            </div>
          </div>

          <div className="relative mb-0">
            <label
              htmlFor="place"
              className="block text-sm font-medium text-gray-600"
            >
              {process.env.REACT_APP_REGION_NAME === "HIVADA" ? t("veranstaltungsinfos") : t("website")}
            </label>
            <input
              type="text"
              id="website"
              name="website"
              value={listingInput.website}
              onChange={onInputChange}
              onBlur={validateInput}
              className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
              placeholder={t("enter_website")}
            />
          </div>

          <div className="relative mb-4">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-600"
            >
              {t("description")} *
            </label>
            <ReactQuill
              type="text"
              id="description"
              name="description"
              ref={editor}
              value={description}
              onChange={(newContent) => onDescriptionChange(newContent)}
              onBlur={() => {
                const quillInstance = editor.current?.getEditor();
                if (quillInstance) {
                  validateInput({
                    target: {
                      name: "description",
                      value: quillInstance.root.innerHTML.replace(/(<br>|<\/?p>)/gi, ""),
                    },
                  });
                }
              }}
              placeholder={t("writeSomethingHere")}
              readOnly={updating || isSuccess}
              className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-0 px-0 leading-8 transition-colors duration-200 ease-in-out shadow-md"
              style={{
                position: "relative",
                zIndex: 1000,
              }}
            />
            <div className="flex justify-between text-sm mt-1">
              <span
                className={`${description.replace(/(<([^>]+)>)/gi, "").length > CHARACTER_LIMIT_DESCRIPTION
                  ? "mt-2 text-sm text-red-600"
                  : "mt-2 text-sm text-gray-500"
                  }`}
              >
                {description.replace(/(<([^>]+)>)/gi, "").length}/{CHARACTER_LIMIT_DESCRIPTION}
              </span>
              {error.description && (
                <span className="mt-2 text-sm text-red-600">
                  {error.description}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container w-auto px-5 py-2 base-bg-slate-600">
        <div className="bg-white mt-4 p-6 space-y-10">
          <h2 className="text-gray-900 text-lg mb-4 font-medium title-font">
            {t("uploadLogo")}
            <div className="my-4 bg-gray-600 h-[1px]"></div>
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {t("addFileHere")}
            </label>
            <div
              className="mt-2 text-sm text-green-600"
            >
              {t("maxFileSizeAllert")} & {t("imageNumberAlertListings")}
            </div>

            <div
              className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-black px-6 pt-5 pb-6 bg-slate-200`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              {image && image.length > 0 && newListing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormImage
                    updateImageList={setImage}
                    handleRemoveImage={handleRemoveImage}
                    image={image}
                    localImageOrPdf={localImageOrPdf}
                    localImages={localImages}
                  />
                  {image.length < 8 && (
                    <label
                      htmlFor="file-upload"
                      className={`object-cover h-64 w-full m-4 rounded-xl ${image.length < 8 ? "bg-slate-200" : ""
                        }`}
                    >
                      <div className="h-full flex items-center justify-center">
                        <div className="text-8xl text-black">+</div>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*,.pdf"
                        className="sr-only"
                        onChange={handleMultipleInputChange}
                        multiple
                      />
                    </label>
                  )}
                </div>
              ) : image &&
                Array.isArray(image) &&
                image.length === 1 &&
                typeof image[0] === "string" &&
                image[0].includes("admin/") ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormImage
                    updateImageList={setImage}
                    handleRemoveImage={handleRemoveImage}
                    handleInputChange={handleInputChange}
                    image={image}
                    localImageOrPdf={localImageOrPdf}
                    localImages={localImages}
                  />
                  {image.length < 8 && (
                    <label
                      htmlFor="file-upload"
                      className={`object-cover h-64 w-full mb-4 rounded-xl ${image.length < 8 ? "bg-slate-200" : ""
                        }`}
                    >
                      <div className="h-full flex items-center justify-center">
                        <div className="text-8xl text-black">+</div>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*,.pdf"
                        className="sr-only"
                        onChange={handleUpdateMultipleInputChange}
                        multiple
                      />
                    </label>
                  )}
                </div>
              ) : image &&
                Array.isArray(image) &&
                image.length > 0 &&
                !newListing ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormImage
                    updateImageList={setImage}
                    handleRemoveImage={handleRemoveImage}
                    handleInputChange={handleInputChange}
                    image={image}
                    localImageOrPdf={localImageOrPdf}
                    localImages={localImages}
                  />
                  {image.length < 8 && (
                    <label
                      htmlFor="file-upload"
                      className={`object-cover h-64 w-full mb-4 rounded-xl ${image.length < 8 ? "bg-slate-200" : ""
                        }`}
                    >
                      <div className="h-full flex items-center justify-center">
                        <div className="text-8xl text-black">+</div>
                      </div>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*,.pdf"
                        className="sr-only"
                        onChange={handleUpdateMultipleInputChange}
                        multiple
                      />
                    </label>
                  )}
                </div>
              ) : pdf ? (
                <div className="flex flex-col items-center">
                  <p>
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={localImageOrPdf ? URL.createObjectURL(pdf) : pdf.link}
                    >
                      {pdf.name}
                    </a>
                  </p>
                  <button
                    className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded"
                    onClick={handleRemovePDF}
                  >
                    {t("removeFile")}
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <UploadSVG />
                  <p className="mt-1 text-sm text-gray-600">
                    {t("dragAndDropImageOrPDF")}
                  </p>
                  <div className="relative mb-0 mt-8">
                    <label
                      className={`file-upload-btn w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded`}
                    >
                      <span className="button-label">{t("upload")}</span>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*,.pdf"
                        className="sr-only"
                        onChange={handleInputChange}
                        multiple
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>

            <div
              className="mt-2 text-sm text-green-600"
            >
              {t("imagePdfWarning")}
            </div>
          </div>
        </div>
      </div>

      <div className="container w-auto px-5 py-2 bg-slate-600">
        <div className="bg-white mt-4 p-6">
          <div className="py-2 mt-1 px-2">
            <p className="pb-2">
              {process.env.REACT_APP_NAME == "WALDI APP" ? t("byUploadingIConfirmTheTermsOfUseInParticularThatIHaveTheRightsToPublishTheContent") : ""}
            </p>
            <div className="flex gap-2"> {/* Flex container with gap between buttons */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!isFormValid || updating || isSuccess}
                className="w-full bg-black hover:bg-slate-600 text-white font-bold py-2 px-4 rounded disabled:opacity-60"
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

              {!newListing && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  {t("cancel")}
                </button>
              )}
              {newListing && (
                <button
                  type="button"
                  onClick={() => navigate(-1)} // Inline navigation
                  className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  {t("Back")}
                </button>
              )}
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

export default UploadListings;