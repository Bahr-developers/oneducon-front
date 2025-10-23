import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// JSON fayllarni to‘g‘ri yuklash (Agar `resolveJsonModule` yoqilgan bo‘lsa)
import enJSON from "../locales/en.json";
import ruJSON from "../locales/ru.json";
import uzJSON from "../locales/uz.json";

const activeLanguage = localStorage.getItem("language") || "uz";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enJSON },
      ru: { translation: ruJSON },
      uz: { translation: uzJSON },
    },
    lng: activeLanguage,
    fallbackLng: "ru",
    interpolation: {
        escapeValue: false, 
    },
  });

  // Tilni o‘zgartirish va localStorage ga saqlash
export const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    localStorage.setItem("language", language);
  };

export default i18n;
