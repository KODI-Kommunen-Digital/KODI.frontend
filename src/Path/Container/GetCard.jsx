import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../bodyContainer.css";
import SideBar from "../../Components/SideBar";
import { useTranslation } from "react-i18next";
import "react-quill/dist/quill.snow.css";
import Alert from "../../Components/Alert";
import { associateCard } from "../../Services/containerApi";

function GetCard() {
    const { t } = useTranslation();
    const [updating, setUpdating] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [isSuccess, setIsSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const navigateTo = (path) => {
        if (path) {
            navigate(path);
        }
    };

    const [input, setInput] = useState({
        cardNumber: "",
        pinCode: "",
    });

    const [error, setError] = useState({
        cardNumber: "",
        pinCode: "",
    });

    useEffect(() => {
        const accessToken =
            window.localStorage.getItem("accessToken") ||
            window.sessionStorage.getItem("accessToken");
        const refreshToken =
            window.localStorage.getItem("refreshToken") ||
            window.sessionStorage.getItem("refreshToken");
        if (!accessToken && !refreshToken) {
            window.location.href = "/login";
        }
    }, []);

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
                const { cardNumber, ...dataToSubmit } = input;
                await associateCard(cardNumber, dataToSubmit);

                const successMessage = t("cardUpdated");
                setSuccessMessage(successMessage);
                setErrorMessage(false);
                setIsSuccess(true);

                setTimeout(() => {
                    setSuccessMessage(false);
                    navigate("/CustomerScreen");
                }, 5000);
            } catch (error) {
                // Check if error code is 5002 and show the appropriate message
                if (error.response && error.response.data && error.response.data.errorCode === 5002) {
                    setErrorMessage(t("alreadyLinked"));
                } else {
                    setErrorMessage(t("changesNotSaved"));
                }
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

    const getErrorMessage = (name, value) => {
        switch (name) {

            case "cardNumber":
                if (!value) {
                    return t("pleaseAddCard");
                } else if (isNaN(value)) {
                    return t("pleaseEnterValidNumber");
                } else {
                    return "";
                }

            case "pinCode":
                if (!value) {
                    return t("pleaseAddPinNumber");
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

    return (
        <section className="bg-gray-900 body-font relative min-h-screen">
            <SideBar />

            <div className="container w-auto px-5 py-2 bg-gray-900">
                <div className="bg-white mt-4 p-6 space-y-10">
                    <div>
                        <div className="flex justify-between items-center">
                            <h2
                                style={{
                                    fontFamily: "Poppins, sans-serif",
                                }}
                                className="text-gray-900 text-lg font-medium title-font"
                            >
                                {t("linkYourCard")}
                            </h2>

                            <div className="text-xs font-medium text-center float-left cursor-pointer">
                                <a
                                    onClick={() => navigateTo("/CustomerScreen")}
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
                            </div>
                        </div>
                        <div className="my-4 bg-gray-600 h-[1px]"></div>
                    </div>

                    <div className="relative mb-4">
                        <label
                            htmlFor="cardNumber"
                            className="block text-sm font-medium text-gray-600"
                        >
                            {t("cardNumber")} *
                        </label>
                        <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={input.cardNumber}
                            onChange={onInputChange}
                            onBlur={validateInput}
                            required
                            className="overflow-y:scroll w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                            placeholder={t("enterCardNumber")}
                        />
                        <div
                            className="mt-2 text-sm text-red-600"
                            style={{
                                visibility: error.cardNumber ? "visible" : "hidden",
                            }}
                        >
                            {error.cardNumber}
                        </div>
                    </div>

                    <div className="relative mb-4">
                        <label
                            htmlFor="pinCode"
                            className="block text-sm font-medium text-gray-600"
                        >
                            {t("PINNumber")} *
                        </label>
                        <input
                            type="text"
                            id="pinCode"
                            name="pinCode"
                            value={input.pinCode}
                            onChange={onInputChange}
                            onBlur={validateInput}
                            required
                            className="w-full bg-white rounded border border-gray-300 focus:border-black focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out shadow-md"
                            placeholder={t("pleaseEnterPINNumber")}
                        />
                        <div
                            className="mt-2 text-sm text-red-600"
                            style={{
                                visibility: error.pinCode ? "visible" : "hidden",
                            }}
                        >
                            {error.pinCode}
                        </div>
                    </div>
                </div>
            </div>

            <div className="container w-auto px-5 py-2 bg-gray-900">
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

export default GetCard;