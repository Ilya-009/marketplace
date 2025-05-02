import { useEffect, useState } from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import {loadPropertiesByKeysFx} from "../api";
import {defaultTheme} from "./theme.ts";
import {getColorProperty} from "../services";

const uiKeys = [
    'theme.primary.main',
    'theme.primary.contrastText',
    'theme.secondary.main',
    'theme.text.primary'
];

export const useThemeSettings = (): Theme => {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    useEffect(() => {
        const fetchThemeSettings = async () => {
            try {
                const response = await loadPropertiesByKeysFx({keys: uiKeys});

                const primaryColorMain = getColorProperty(response, 'theme.primary.main');
                const primaryContrastTextColor = getColorProperty(response, 'theme.primary.contrastText');
                const secondaryColorMain = getColorProperty(response, 'theme.secondary.main');
                const themePrimaryText = getColorProperty(response, 'theme.text.primary');

                const newTheme = createTheme({
                    palette: {
                        primary: {
                            main: primaryColorMain ?? '#1976d2',
                            contrastText: primaryContrastTextColor ?? '#fff'
                        },
                        secondary: {
                            main: secondaryColorMain ?? '#9c27b0'
                        },
                        text: {
                            primary: themePrimaryText ?? '#000'
                        }
                    }
                });

                setTheme(newTheme);
            } catch (error) {
                console.error('Failed to load theme settings:', error);
                // Возвращаем дефолтную тему если не удалось загрузить настройки
                setTheme(defaultTheme);
            }
        };

        fetchThemeSettings();
    }, []);

    return theme as Theme;
};