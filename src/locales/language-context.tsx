import React, {createContext, useState, useContext, useEffect} from 'react';
import en from "./en.ts";
import ru from "./ru.ts";
import fr from "./fr.ts";
import {currencies} from "../constants.ts";

const translations = { en, ru, fr };

type Language = 'en' | 'ru' | 'fr';

type LanguageContextType = {
    language: Language;
    currency: string;
    setLanguage: (lang: Language) => void;
    t: (path: string) => string;
};

const LanguageContext = createContext<LanguageContextType>({
    language: 'ru',
    currency: currencies.get('ru') as string,
    setLanguage: () => {},
    t: () => ''
});

export const LanguageProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [language, setLanguage] = useState<Language>(localStorage.getItem('language') as Language ?? 'ru');
    const [currency, setCurrency] = useState<string>('₽');

    useEffect(() => {
        if (language) {
            localStorage.setItem('language', language);
            setCurrency(currencies.get(language) as string);
        }
    }, [language]);

    const t = (path: string) => {
        const parts = path.split('.');
        let result: unknown = translations[language];

        for (const part of parts) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            result = result[part];
            if (result === undefined) return path;
        }

        return result || path;
    };

    return (
        <LanguageContext.Provider value={{ language, currency, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);