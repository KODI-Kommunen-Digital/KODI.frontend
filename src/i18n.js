import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./assets/translations/en.json";
import deTranslation from "./assets/translations/de.json";

// the translations
const resources = {
	en: {
		translation: enTranslation,
	},
	de: {
		translation: deTranslation,
	},
};

i18n.use(initReactI18next).init({
	resources,
	lng: process.env.REACT_APP_LANG || "de",
	keySeparator: false,
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
