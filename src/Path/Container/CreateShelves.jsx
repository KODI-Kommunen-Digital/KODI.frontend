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
import { createShelf, getOwnerShops, getProductsForShelf, getUserRoleContainer } from "../../Services/containerApi";

function CreateShelves() {
    const { t } = useTranslation();
    const editor = useRef(null);
    const [updating, setUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [productLoading, setProductLoading] = useState(false);

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

    const [input, setInput] = useState({
        shopId: 0,
        cityId: 0,
        productId: 0,
        title: "",
        description: "",
    });

    const [error, setError] = useState({
        title: "",
        description: "",
        shopId: "",
        cityId: "",
        productId: "",
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
                const { cityId, ...inputWithoutCityIdShopId } = input;
                await createShelf(cityId, shopId, inputWithoutCityIdShopId);

                const successMessage = isAdmin ? t("shelfUpdatedAdmin") : t("shelfCreated");
                setSuccessMessage(successMessage);
                setErrorMessage(false);
                setIsSuccess(true);

                setTimeout(() => {
                    setSuccessMessage(false);
                    navigate("/OwnerScreen");
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

    useEffect(() => {
        getProfile().then((response) => {
            setIsAdmin(response.data.data.roleId === 1);
        });
        getCities().then((citiesResponse) => {
            setCities(citiesResponse.data.data);
        });

        document.title =
            process.env.REACT_APP_REGION_NAME + " " + t("addNewProductTitle");
    }, []);

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
                } else if (value.length > 25) {
                    return t("titleTooLong");
                } else {
                    return "";
                }

            case "shopId":
                if (!value) {
                    return t("pleaseSelectShop");
                } else {
                    return "";
                }

            case "cityId":
                if (!parseInt(value)) {
                    return t("pleaseSelectCity");
                } else {
                    return "";
                }

            case "productId":
                if (isNaN(value)) {
                    return t("pleaseEnterValidNumber");
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

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("cityId", cityId);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
        setLoading(true);
        try {
            const response = await getOwnerShops({ cityId });
            setShops(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching shops:", error);
        } finally {
            setLoading(false);
        }
    }

    const [shopId, setShopId] = useState(0);
    const [shops, setShops] = useState([]);
    const handleShopChange = async (event) => {
        const shopId = event.target.value;
        setShopId(shopId);
        setInput((prevInput) => ({ ...prevInput, shopId }));
        validateInput(event);

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("shopId", shopId);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
        setProductLoading(true);
        try {
            const response = await getProductsForShelf(shopId);
            setProducts(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching shops:", error);
        } finally {
            setProductLoading(false);
        }
    };

    const [productId, setProductId] = useState(0);
    const [products, setProducts] = useState([]);
    const handleProductChange = async (event) => {
        const productId = event.target.value;
        setProductId(productId);
        setInput((prevInput) => ({ ...prevInput, productId }));
        validateInput(event);

        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("productId", productId);
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, "", newUrl);
    };

    return (
        <section className="bg-gray-900 body-font relative h-screen">
            <SideBar />

            <div className="container w-auto px-5 py-2 bg-gray-800">
                <div className="bg-white mt-4 p-6 space-y-10">
                    <h2
                        style={{
                            fontFamily: "Poppins, sans-serif",
                        }}
                        className="text-gray-900 text-lg mb-4 font-medium title-font"
                    >
                        {t("addNewShelfTitle")}
                        <div className="my-4 bg-gray-600 h-[1px]"></div>
                    </h2>
                    <div className="relative mb-4">
                        <label
                            htmlFor="title"
                            className="block text-sm font-medium text-gray-600"
                        >
                            {t("shelfName")} *
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
                            {loading ? (
                                <div className="flex justify-center my-4">
                                    <span className="text-gray-600">{t("loading")}</span>
                                </div>
                            ) : shops.length !== 0 ? (
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
                            {productLoading ? (
                                <div className="flex justify-center my-4">
                                    <span className="text-gray-600">{t("loading")}</span>
                                </div>
                            ) : products.length !== 0 ? (
                                <div className="relative mb-4">
                                    <label
                                        htmlFor="title"
                                        className="block text-sm font-medium text-gray-600"
                                    >
                                        {t("product")}
                                    </label>
                                    <select
                                        type="text"
                                        id="productId"
                                        name="productId"
                                        value={productId || 0}
                                        onChange={handleProductChange}
                                        autoComplete="country-name"
                                        className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md disabled:bg-gray-400"
                                    >
                                        <option value={0}>{t("select")}</option>
                                        {products.map((product) => (
                                            <option key={Number(product.id)} value={Number(product.id)}>
                                                {product.title}
                                            </option>
                                        ))}
                                    </select>
                                    <div
                                        className="h-[24px] text-red-600"
                                        style={{
                                            visibility: error.productId && productId ? "visible" : "hidden",
                                        }}
                                    >
                                        {error.productId}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex inline-flex justify-between bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded  "
                                    role="alert">
                                    <span className="block sm:inline">
                                        <strong className="font-bold">{t("noProductAvailableForThisShop")}</strong>
                                    </span>
                                </div>
                            )}
                        </>
                    )}

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

export default CreateShelves;