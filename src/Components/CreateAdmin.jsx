import React, { useEffect, useState } from "react";
import { createCityAdmin } from "../Services/SuperAdminApi";
import { getCities } from "../Services/citiesApi";
import Select from "react-tailwindcss-select";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";

const EMAIL_REGEXP =
    /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const CreateAdmin = ({ onSuccess }) => {
    const [email, setEmail] = useState("");
    const [cities, setCities] = useState([]);
    const [citiesList, setCitiesList] = useState([]);
    const [errors, setErrors] = useState({});
    const { t } = useTranslation();
    const handleChange = (e) => {
        setEmail(e.target.value.trim());
    };

    const validate = () => {
        const newErrors = {};
        if (!email.trim) newErrors.email = t("pleaseEnterEmailAddress");
        if (!EMAIL_REGEXP.test(email)) newErrors.email = t("pleaseEnterValidEmail");
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        try {
            await createCityAdmin({ email, citiesIds: cities.map((c) => c.value) });
            onSuccess();
        } catch (e) {
            setErrors({ message: e?.response?.data?.message });
        }
    };

    useEffect(() => {
        getCities().then((citiesResponse) => {
            setCitiesList(
                citiesResponse.data.data?.map((cities) => ({
                    value: cities.id,
                    label: cities.name,
                }))
            );
        });
    }, []);

    const handleCitiesChange = (value) => {
        setCities(value);
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-center">
                {t("Createcity")} Admin
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 p-4">
                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        className="w-full mt-1 px-4 py-2 border rounded-xl focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {errors.email && (
                        <p className="text-sm text-red-500">{errors.email}</p>
                    )}
                </div>
                <div className="max-w-sm mt-6 mb-4">
                    <label htmlFor="countries" className="block font-medium">
                        {t("selectCity")}
                    </label>
                    <Select
                        primaryColor={"indigo"}
                        value={cities}
                        isMultiple
                        onChange={handleCitiesChange}
                        options={citiesList}
                        classNames={{
                            menu: "max-h-40 overflow-y-auto", // LIMIT dropdown height to ~12rem
                            list: "space-y-1", // optional: spacing between options
                            option: "py-1 px-2", // compact option height
                        }}
                    />
                </div>
                {errors.message && (
                    <p className="text-sm text-red-500 text-center">{errors.message}</p>
                )}
                <button
                    type="submit"
                    disabled={!email}
                    className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition"
                >
                    {t("create")} Admin
                </button>
            </form>
        </div>
    );
};

CreateAdmin.propTypes = {
    onSuccess: PropTypes.func.isRequired,
};
export default CreateAdmin;
