'use client';

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n/config';

export function useLanguage() {
    const { i18n } = useTranslation();

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        if (typeof window !== 'undefined') {
            localStorage.setItem('preferred_language', lng);
        }
    };

    useEffect(() => {
        // Load saved language preference
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('preferred_language');
            if (saved && ['ka', 'en', 'ru'].includes(saved)) {
                i18n.changeLanguage(saved);
            } else {
                // Detect browser language
                const browserLang = navigator.language.split('-')[0];
                if (['ka', 'en', 'ru'].includes(browserLang)) {
                    i18n.changeLanguage(browserLang);
                }
            }
        }
    }, [i18n]);

    return { currentLanguage: i18n.language, changeLanguage };
}
