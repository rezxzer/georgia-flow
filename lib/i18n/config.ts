import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    ka: {
        translation: {
            home: 'მთავარი',
            map: 'რუკა',
            events: 'ივენთები',
            profile: 'პროფილი',
            login: 'შესვლა',
            signup: 'რეგისტრაცია',
            // Add more translations as needed
        },
    },
    en: {
        translation: {
            home: 'Home',
            map: 'Map',
            events: 'Events',
            profile: 'Profile',
            login: 'Login',
            signup: 'Sign Up',
        },
    },
    ru: {
        translation: {
            home: 'Главная',
            map: 'Карта',
            events: 'События',
            profile: 'Профиль',
            login: 'Вход',
            signup: 'Регистрация',
        },
    },
};

i18next
    .use(initReactI18next)
    .init({
        resources,
        lng: 'ka', // default language
        fallbackLng: 'ka',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18next;
