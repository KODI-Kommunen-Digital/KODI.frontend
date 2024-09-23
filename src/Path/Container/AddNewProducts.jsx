import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../bodyContainer.css";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { getProfile } from "../../Services/usersApi";
import { getCities } from "../../Services/citiesApi";
import Alert from "../../Components/Alert";
import FormImage from "../FormImage";
import { UploadSVG } from "../../assets/icons/upload";
import { createNewProduct, getSellerShops, uploadImage, deleteImage, getCategory, getSubCategory } from "../../Services/containerApi";

function AddNewProducts() {
    const { t } = useTranslation();
    const editor = useRef(null);
    const [updating, setUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [image, setImage] = useState(null);
    // const [pdf, setPdf] = useState(null);
    const [localImageOrPdf, setLocalImageOrPdf] = useState(false);
    const [productId, setProductId] = useState(0);
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState([]);

    const [input, setInput] = useState({
        shopId: 0,
        cityId: 0,
        categoryId: 0,
        subCategoryId: 0,
        title: "",
        description: "",
        price: "",
        tax: "",
        inventory: "",
        minCount: "",
        barCodeNum: "",
        // removeImage: false,
        // // hasAttachment: false,
    });

    const [error, setError] = useState({
        categoryId: "",
        subCategoryId: "",
        title: "",
        description: "",
        shopId: "",
        cityId: "",
        price: "",
        tax: "",
        inventory: "",
        minCount: "",
        barCodeNum: "",
    });

    const handleSubmit = async (event) => {
        event.preventDefault();
        let valid = true;

        const newError = { ...error };

        for (const key in error) {
            const errorMessage = getErrorMessage(key, input[key]);
            newError[key] = errorMessage;
            if (errorMessage) {
                valid = false;
            }
        }

        setError(newError);

        if (valid) {
            setUpdating(true);

            try {
                const { cityId, shopId, ...inputWithoutCityIdShopId } = input;

                const createProductResponse = await createNewProduct(cityId, shopId, inputWithoutCityIdShopId);

                const newProductId = parseInt(createProductResponse.data.data.id);

                if (input.removeImage && image.length === 0) {
                    await deleteImage(cityId, shopId, newProductId);
                } else if (image && image.length > 0) {
                    const imageForm = new FormData();
                    for (let i = 0; i < image.length; i++) {
                        imageForm.append("image", image[i]);
                    }

                    await uploadImage(imageForm, cityId, shopId, newProductId);
                }

                const successMessage = isAdmin ? t("sellerUpdatedAdmin") : t("sellerUpdated");
                setSuccessMessage(successMessage);
                setErrorMessage(false);
                setIsSuccess(true);

                setTimeout(() => {
                    setSuccessMessage(false);
                    navigate("/Dashboard");
                }, 5000);

            } catch (error) {
                setErrorMessage(t("changesNotSaved"));
                setSuccessMessage(false);
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

    const [cityId, setCityId] = useState(0);
    const [cities, setCities] = useState([]);
    async function onCityChange(e) {
        const cityId = e.target.value;
        setCityId(cityId);
        setInput((prev) => ({
            ...prev,
            cityId: cityId,
        }));
        validateInput(e);

        // const urlParams = new URLSearchParams(window.location.search);
        // urlParams.set("cityId", cityId);
        // const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        // window.history.replaceState({}, "", newUrl);

        try {
            const response = await getSellerShops();
            setShops(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching shops:", error);
        }
    }

    const [shopId, setShopId] = useState(0);
    const [shops, setShops] = useState([]);
    const handleShopChange = async (event) => {
        const shopId = event.target.value;
        setShopId(shopId);
        setInput((prevInput) => ({ ...prevInput, shopId }));
        validateInput(event);

        // const urlParams = new URLSearchParams(window.location.search);
        // urlParams.set("shopId", shopId);
        // const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        // window.history.replaceState({}, "", newUrl);
    };

    useEffect(() => {
        // const searchParams = new URLSearchParams(window.location.search);
        // const cityIds = searchParams.get("cityId");
        // const shopIds = searchParams.get("shopId");
        getProfile().then((response) => {
            setIsAdmin(response.data.data.roleId === 1);
        });
        getCities().then((citiesResponse) => {
            setCities(citiesResponse.data.data);
        });

        if (productId && cityId) {
            setProductId(parseInt(productId));
        }

        if (cityId && shopId) {
            getCategory(cityId, shopId).then((response) => {
                const categories = response?.data?.data || [];
                setCategories(categories);
            });
        }
        document.title =
            process.env.REACT_APP_REGION_NAME + " " + t("addNewProductTitle");
    }, [productId, cityId, shopId]);

    const [categoryId, setCategoryId] = useState(0);
    const [subCategoryId, setSubcategoryId] = useState(0);

    const handleCategoryChange = async (event) => {
        const categoryId = event.target.value;
        setCategoryId(categoryId);

        if (categoryId) {
            try {
                const subCats = await getSubCategory(cityId, shopId, categoryId);

                if (subCats?.data?.data?.length > 0) {
                    const subcatList = subCats.data.data.reduce((acc, subCat) => {
                        acc[subCat.id] = subCat.name;
                        return acc;
                    }, {});

                    setSubCategories(subcatList);
                    console.log("subcatList: ", JSON.stringify(subcatList)); // Log the correct object
                } else {
                    setSubCategories([]);
                }
            } catch (error) {
                console.error("Error fetching subcategories: ", error);
                setSubCategories({});
            }
        } else {
            setSubCategories({});
        }
    };

    const handleSubcategoryChange = (event) => {
        const subCategoryId = event.target.value;
        setSubcategoryId(subCategoryId);
        setInput((prevInput) => ({ ...prevInput, subCategoryId }));
        validateInput(event);
    };

    const [description, setDescription] = useState("");
    const onDescriptionChange = (newContent) => {
        const hasNumberedList = newContent.includes("<ol>");
        const hasBulletList = newContent.includes("<ul>");
        let descriptions = [];
        let listType = "";
        if (hasNumberedList) {
            const regex = /<li>(.*?)(?=<\/li>|$)/gi;
            const matches = newContent.match(regex);
            descriptions = matches.map((match) => match.replace(/<\/?li>/gi, ""));
            descriptions = descriptions.map(
                (description, index) => `${index + 1}. ${description}`
            );
            listType = "ol";
        } else if (hasBulletList) {
            const regex = /<li>(.*?)(?=<\/li>|$)/gi;
            const matches = newContent.match(regex);
            descriptions = matches.map((match) => match.replace(/<\/?li>/gi, ""));
            descriptions = descriptions.map((description) => `- ${description}`);
            listType = "ul";
        } else {
            // No list tags found, treat the input as plain text
            setInput((prev) => ({
                ...prev,
                description: newContent.replace(/(<br>|<\/?p>)/gi, ""), // Remove <br> and <p> tags
            }));
            setDescription(newContent);
            return;
        }
        const listHTML = `<${listType}>${descriptions
            .map((description) => `<li>${description}</li>`)
            .join("")}</${listType}>`;
        setInput((prev) => ({
            ...prev,
            description: listHTML,
        }));
        setDescription(newContent);
    };

    const getErrorMessage = (name, value) => {
        switch (name) {
            case "title":
                if (!value) {
                    return t("pleaseEnterTitle");
                } else {
                    return "";
                }

            case "shopId":
                if (!value) {
                    return t("pleaseSelectShop");
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
                if (!value) {
                    return t("pleaseSelectSubcategory");
                } else {
                    return "";
                }

            case "cityId":
                if (!parseInt(value)) {
                    return t("pleaseSelectCity");
                } else {
                    return "";
                }

            case "description":
                if (!value) {
                    return t("pleaseEnterDescription");
                } else if (value.length > 65535) {
                    return t("characterLimitReacehd");
                } else {
                    return "";
                }

            case "price":
                if (!value) {
                    return t("pleaseEnterPrice");
                } else if (isNaN(value)) {
                    return t("pleaseEnterValidNumber");
                } else {
                    return "";
                }

            case "tax":
                if (!value) {
                    return t("pleaseEnterTax");
                } else if (isNaN(value)) {
                    return t("pleaseEnterValidNumber");
                } else {
                    return "";
                }

            case "inventory":
                if (!value) {
                    return t("pleaseEnterInventory");
                } else if (isNaN(value)) {
                    return t("pleaseEnterValidNumber");
                } else {
                    return "";
                }

            case "minCount":
                if (!value) {
                    return t("pleaseEnterMinCount");
                } else if (isNaN(value)) {
                    return t("pleaseEnterValidNumber");
                } else {
                    return "";
                }

            case "barCodeNum":
                if (!value) {
                    return t("pleaseEnterMinCount");
                } else if (isNaN(value)) {
                    return t("pleaseEnterValidNumber");
                } else {
                    return "";
                }

            default:
                return "";
        }
    };

    const onInputChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({
            ...prev,
            [name]: value,
        }));
        validateInput(e);
    };

    const validateInput = (e) => {
        const { name, value } = e.target;
        const errorMessage = getErrorMessage(name, value);
        setError((prevState) => {
            return { ...prevState, [name]: errorMessage };
        });
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
                setInput((prev) => ({
                    ...prev,
                    // hasAttachment: true,
                }));
            }
            // else if (file.type === "application/pdf") {
            //     setPdf(file);
            //     setInput((prev) => ({
            //         ...prev,
            //         // hasAttachment: true,
            //     }));
            // }
        }
    }

    function handleInputChange(e) {
        e.preventDefault();
        const files = e.target.files;
        const MAX_IMAGE_SIZE_MB = 20;
        let hasImage = false;
        let hasPdf = false;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];

            if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                alert(`Maximum file size is ${MAX_IMAGE_SIZE_MB} MB`);
                return;
            }

            if (file.type.startsWith("image/")) {
                hasImage = true;
            }
            else if (file.type === "application/pdf") {
                hasPdf = true;
            }
        }

        if (hasPdf
        ) {
            alert(t("PdfAlert"));
            return;
        }

        if (hasImage) {
            setLocalImageOrPdf(true);
            setImage(files);
            setInput((prev) => ({
                ...prev,
                // hasAttachment: false,
            }));
        }

        // if (hasPdf) {
        //     setLocalImageOrPdf(true);
        //     setPdf(files[0]); // Assuming only one PDF file is allowed
        //     setInput((prev) => ({
        //         ...prev,
        //         // hasAttachment: true,
        //     }));
        // }
    }

    const [localImages, setLocalImages] = useState([]);
    const handleMultipleInputChange = (event) => {
        const newFiles = Array.from(event.target.files);

        // Filter for only valid images
        const validImages = newFiles.filter(file => file.type.startsWith("image/"));
        const invalidFiles = newFiles.filter(file => !file.type.startsWith("image/"));

        // If there are invalid files (e.g., not images or PDFs), show an alert
        if (invalidFiles.length > 0) {
            alert(t("imagePdfAlert"));
            return;
        }

        // Check the total number of images after adding the new files
        const totalImages = image.length + validImages.length;

        if (totalImages > 3) {
            alert(t("imageNumberAlert"));
        } else {
            // If valid images are under the limit, update the state
            setLocalImages((prevImages) => [...prevImages, ...validImages]);
            setImage((prevImages) => [...prevImages, ...validImages]);
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
            }
        }
        // else {
        //     newFiles.forEach(file => {
        //         if (file.type === "application/pdf") {
        //             setLocalImageOrPdf(true);
        //             setPdf(file);
        //             setInput((prev) => ({
        //                 ...prev,
        //                 // hasAttachment: true,
        //             }));
        //         } else if (file.type.startsWith("image/")) {
        //             setLocalImages((prevImages) => [...prevImages, file]);
        //             setImage((prevImages) => [...prevImages, file]);
        //         }
        //     });
        // }
    };

    function handleRemoveImage() {
        if (shopId) {
            setInput((prev) => ({
                ...prev,
                // removeImage: true,
                // logo: null,
            }));
        }
        setImage((prevImages) => {
            const updatedImages = [...prevImages];
            return updatedImages;
        });
    }

    // function handleRemovePDF() {
    //     if (shopId) {
    //         setInput((prev) => ({
    //             ...prev,
    //             removePdf: true,
    //             pdf: null,
    //         }));
    //     }
    //     setPdf(null);
    //     setInput((prev) => ({
    //         ...prev,
    //         // hasAttachment: false,
    //     }));
    // }

    return (
        <section className="bg-gray-800 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto px-5 py-2 bg-gray-800">
                <div className="bg-white mt-4 p-6 space-y-10">
                    <h2
                        style={{
                            fontFamily: "Poppins, sans-serif",
                        }}
                        className="text-gray-900 text-lg mb-4 font-medium title-font"
                    >
                        {t("addNewProductTitle")}
                        <div className="my-4 bg-gray-600 h-[1px]"></div>
                    </h2>
                    <div className="relative mb-4">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-600"
                        >
                            {t("productName")} *
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={input.title}
                            onChange={onInputChange}
                            onBlur={validateInput}
                            required
                            className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                            placeholder={t("enterTitle")}
                        />
                        <div
                            className="h-[24px] text-red-600"
                            style={{
                                visibility: error.title ? "visible" : "hidden",
                            }}
                        >
                            {error.title}
                        </div>
                    </div>

                    <div className="relative mb-4">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-600"
                        >
                            {process.env.REACT_APP_REGION_NAME === "HIVADA" ? t("cluster") : t("city")} *
                        </label>
                        <select
                            type="text"
                            id="cityId"
                            name="cityId"
                            value={cityId || 0}
                            onChange={onCityChange}
                            autoComplete="country-name"
                            className="overflow-y-scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
                        >
                            <option value={0}>{t("select")}</option>
                            {cities.map((city) => (
                                <option key={Number(city.id)} value={Number(city.id)}>
                                    {city.name}
                                </option>
                            ))}
                        </select>
                        <div
                            className="h-[24px] text-red-600"
                            style={{
                                visibility: error.cityId ? "visible" : "hidden",
                            }}
                        >
                            {error.cityId}
                        </div>
                    </div>

                    {cityId !== 0 && (
                        <>
                            {shops.length > 0 ? (
                                <div className="relative mb-4">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-600"
                                    >
                                        {t("shop")} *
                                    </label>
                                    <select
                                        type="text"
                                        id="shopId"
                                        name="shopId"
                                        value={shopId || 0}
                                        onChange={handleShopChange}
                                        autoComplete="country-name"
                                        className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
                                    >
                                        <option value={0}>{t("select")}</option>
                                        {shops.map((shop) => (
                                            <option key={Number(shop.id)} value={Number(shop.id)}>
                                                {shop.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div
                                        className="h-[24px] text-red-600"
                                        style={{
                                            visibility: error.shopId ? "visible" : "hidden",
                                        }}
                                    >
                                        {error.shopId}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex inline-flex justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded  "
                                    role="alert">
                                    <span className="block sm:inline">
                                        <strong className="font-bold">{t("noShopsAvailableForThisCity")}</strong>
                                    </span>
                                </div>
                            )}
                        </>
                    )}

                    {shopId !== 0 && (
                        <>
                            {categories.length > 0 ? (
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
                                        className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
                                    >
                                        <option className="font-sans" value={0} key={0}>
                                            {t("chooseOneCategory")}
                                        </option>
                                        {categories.map((category) => {
                                            return (
                                                <option className="font-sans" value={category.id} key={category.id}>
                                                    {t(category.name)}
                                                </option>
                                            );
                                        })}
                                    </select>
                                    <div
                                        className="h-[24px] text-red-600"
                                        style={{
                                            visibility: error.categoryId ? "visible" : "hidden",
                                        }}
                                    >
                                        {error.categoryId}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex inline-flex justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded  "
                                    role="alert">
                                    <span className="block sm:inline">
                                        <strong className="font-bold">{t("noCategoriesAvailableForThisCity")}</strong>
                                    </span>
                                </div>
                            )}
                        </>
                    )}

                    {categoryId !== 0 && (
                        <>
                            {subCategories && Object.keys(subCategories).length > 0 ? (
                                <div className="relative mb-0">
                                    <label htmlFor="subCategoryId" className="block text-sm font-medium text-gray-600">
                                        {t("subCategory")} *
                                    </label>
                                    <select
                                        type="subCategoryId"
                                        id="subCategoryId"
                                        name="subCategoryId"
                                        value={subCategoryId || 0}
                                        onChange={handleSubcategoryChange}
                                        onBlur={validateInput}
                                        required
                                        className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
                                    >
                                        <option className="font-sans" value={0} key={0}>
                                            {t("chooseOneSubCategory")}
                                        </option>
                                        {Object.keys(subCategories).map((key) => (
                                            <option className="font-sans" value={key} key={key}>
                                                {t(subCategories[key])}
                                            </option>
                                        ))}
                                    </select>
                                    <div
                                        className="h-[24px] text-red-600"
                                        style={{ visibility: error.subCategoryId ? "visible" : "hidden" }}
                                    >
                                        {error.selectedSubCategory}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex inline-flex justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded" role="alert">
                                    <span className="block sm:inline">
                                        <strong className="font-bold">{t("noSubCategoriesAvailableForThisCity")}</strong>
                                    </span>
                                </div>
                            )}
                        </>
                    )}

                    <div className="relative mb-4 grid grid-cols-2 gap-4">
                        <div className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                            <label
                                htmlFor="place"
                                className="block text-sm font-medium text-gray-600"
                            >
                                {t("originalPrice")} *
                            </label>
                            <input
                                type="text"
                                id="price"
                                name="price"
                                value={input.price}
                                onChange={onInputChange}
                                onBlur={validateInput}
                                required
                                className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                                placeholder={t("pleaseEnterOriginalPrice")}
                            />
                            <div
                                className="h-[24px] text-red-600"
                                style={{
                                    visibility: error.price ? "visible" : "hidden",
                                }}
                            >
                                {error.price}
                            </div>
                        </div>
                        <div className="col-span-6 sm:col-span-1 mt-1 px-0 mr-2">
                            <label
                                htmlFor="place"
                                className="block text-sm font-medium text-gray-600"
                            >
                                {t("tax")} *
                            </label>
                            <input
                                type="text"
                                id="tax"
                                name="tax"
                                value={input.tax}
                                onChange={onInputChange}
                                onBlur={validateInput}
                                required
                                className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                                placeholder={t("pleaseEnterTaxPrice")}
                            />
                            <div
                                className="h-[24px] text-red-600"
                                style={{
                                    visibility: error.tax ? "visible" : "hidden",
                                }}
                            >
                                {error.tax}
                            </div>
                        </div>
                    </div>

                    <div className="relative mb-4 grid grid-cols-2 gap-4">
                        <div className="relative mb-4">
                            <label
                                htmlFor="place"
                                className="block text-sm font-medium text-gray-600"
                            >
                                {t("minCount")} *
                            </label>
                            <input
                                type="text"
                                id="minCount"
                                name="minCount"
                                value={input.minCount}
                                onChange={onInputChange}
                                onBlur={validateInput}
                                required
                                className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                                placeholder={t("pleaseEnterFastSellingAlert")}
                            />
                            <div
                                className="h-[24px] text-red-600"
                                style={{
                                    visibility: error.minCount ? "visible" : "hidden",
                                }}
                            >
                                {error.minCount}
                            </div>
                        </div>
                        <div className="relative mb-4">
                            <label
                                htmlFor="place"
                                className="block text-sm font-medium text-gray-600"
                            >
                                {t("barCodeNum")}
                            </label>
                            <input
                                type="text"
                                id="barCodeNum"
                                name="barCodeNum"
                                value={input.barCodeNum}
                                onChange={onInputChange}
                                onBlur={validateInput}
                                className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                                placeholder={t("pleaseEnterBarcode")}
                            />
                            <div
                                className="h-[24px] text-red-600"
                                style={{
                                    visibility: error.barCodeNum ? "visible" : "hidden",
                                }}
                            >
                                {error.barCodeNum}
                            </div>
                        </div>
                    </div>

                    <div className="relative mb-4">
                        <label
                            htmlFor="place"
                            className="block text-sm font-medium text-gray-600"
                        >
                            {t("inventory")} *
                        </label>
                        <input
                            type="text"
                            id="inventory"
                            name="inventory"
                            value={input.inventory}
                            onChange={onInputChange}
                            onBlur={validateInput}
                            required
                            className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                            placeholder={t("pleaseEnterTotalNumber")}
                        />
                        <div
                            className="h-[24px] text-red-600"
                            style={{
                                visibility: error.inventory ? "visible" : "hidden",
                            }}
                        >
                            {error.inventory}
                        </div>
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
                            onBlur={(range, source, editor) => {
                                validateInput({
                                    target: {
                                        name: "description",
                                        value: editor.getHTML().replace(/(<br>|<\/?p>)/gi, ""),
                                    },
                                });
                            }}
                            placeholder={t("writeSomethingHere")}
                            className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-0 px-0 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                        />
                        <div
                            className="h-[24px] text-red-600"
                            style={{
                                visibility: error.description ? "visible" : "hidden",
                            }}
                        >
                            {error.description}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container w-auto px-5 py-2 bg-gray-800">
                <div className="bg-white mt-4 p-6 space-y-10">
                    <h2 className="text-gray-900 text-lg mb-4 font-medium title-font">
                        {t("uploadProductImage")}
                        <div className="my-4 bg-gray-600 h-[1px]"></div>
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            {t("addImageHere")}
                        </label>
                        <div
                            className="h-[24px] text-red-600"
                        >
                            {t("maxFileSizeAllert")} & {t("imageNumberAlertContainer")}
                        </div>

                        <div
                            className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-black px-6 pt-5 pb-6 bg-slate-200`}
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragEnter={handleDragEnter}
                            onDragLeave={handleDragLeave}
                        >
                            {image && image.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <FormImage
                                        updateImageList={setImage}
                                        handleRemoveImage={handleRemoveImage}
                                        image={image}
                                        localImageOrPdf={localImageOrPdf}
                                        localImages={localImages}
                                    />
                                    {image.length < 3 && (
                                        <label
                                            htmlFor="file-upload"
                                            className={`object-cover h-64 w-full m-4 rounded-xl ${image.length < 3 ? "bg-slate-200" : ""
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
                                <div>
                                    <FormImage
                                        updateImageList={setImage}
                                        handleRemoveImage={handleRemoveImage}
                                        handleInputChange={handleInputChange}
                                        image={image}
                                        localImageOrPdf={localImageOrPdf}
                                        localImages={localImages}
                                    />
                                    {image.length < 3 && (
                                        <label
                                            htmlFor="file-upload"
                                            className={`object-cover h-64 w-full mb-4 rounded-xl ${image.length < 3 ? "bg-slate-200" : ""
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
                                image.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <FormImage
                                        updateImageList={setImage}
                                        handleRemoveImage={handleRemoveImage}
                                        handleInputChange={handleInputChange}
                                        image={image}
                                        localImageOrPdf={localImageOrPdf}
                                        localImages={localImages}
                                    />
                                    {image.length < 3 && (
                                        <label
                                            htmlFor="file-upload"
                                            className={`object-cover h-64 w-full mb-4 rounded-xl ${image.length < 3 ? "bg-slate-200" : ""
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
                                // ) : pdf ? (
                                //     <div className="flex flex-col items-center">
                                //         <p>
                                //             <a
                                //                 target="_blank"
                                //                 rel="noreferrer"
                                //                 href={localImageOrPdf ? URL.createObjectURL(pdf) : pdf.link}
                                //             >
                                //                 {pdf.name}
                                //             </a>
                                //         </p>
                                //         <button
                                //             className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded"
                                //             onClick={handleRemovePDF}
                                //         >
                                //             {t("removeFile")}
                                //         </button>
                                //     </div>
                            ) : (
                                <div className="text-center">
                                    <UploadSVG />
                                    <p className="mt-1 text-sm text-gray-600">
                                        {t("dragAndDropImage")}
                                    </p>
                                    <div className="relative mb-0 mt-8">
                                        <label
                                            className={`file-upload-btn w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded`}
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
                            className="h-[24px] text-red-600"
                        >
                            {t("imageWarning")}
                        </div>
                    </div>
                </div>
            </div>

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

export default AddNewProducts;