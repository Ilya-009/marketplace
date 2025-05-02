import { useEffect, useState } from 'react';
import { createTheme, Theme } from '@mui/material/styles';
import {loadPropertiesByKeysFx} from "../api";
import {defaultTheme} from "./theme.ts";
import {getColorProperty, getSelectProperty} from "../services";

const uiKeys = [
    'theme.ui.mode',
    'theme.light.primary.main',
    'theme.light.primary.contrastText',
    'theme.light.secondary.main',
    'theme.light.text.primary',
    'theme.dark.primary.main',
    'theme.dark.primary.contrastText',
    'theme.dark.secondary.main',
    'theme.dark.text.primary',
    'theme.light.background',
    'theme.dark.background'
];

export const useThemeSettings = (): Theme => {
    const [theme, setTheme] = useState<Theme>(defaultTheme);

    useEffect(() => {
        const fetchThemeSettings = async () => {
            try {
                const response = await loadPropertiesByKeysFx({keys: uiKeys});
                const mode = getSelectProperty(response, 'theme.ui.mode');

                if (mode === 'Светлая') {
                    const primaryLightColorMain = getColorProperty(response, 'theme.light.primary.main');
                    const primaryLightContrastTextColor = getColorProperty(response, 'theme.light.primary.contrastText');
                    const secondaryLightColorMain = getColorProperty(response, 'theme.light.secondary.main');
                    const themeLightPrimaryText = getColorProperty(response, 'theme.light.text.primary');
                    const themeLightBackground = getColorProperty(response, 'theme.light.background');

                    const lightTheme = createTheme({
                        palette: {
                            primary: {
                                main: primaryLightColorMain ?? '#1976d2',
                                contrastText: primaryLightContrastTextColor ?? '#fff'
                            },
                            secondary: {
                                main: secondaryLightColorMain ?? '#9c27b0',
                            },
                            text: {
                                primary: themeLightPrimaryText ?? '#000'
                            },
                            mode: "light",
                            background: {
                                default: themeLightBackground ?? '#fff'
                            }
                        },
                    });

                    setTheme(lightTheme);
                } else {
                    const primaryDarkColorMain = getColorProperty(response, 'theme.dark.primary.main');
                    const primaryDarkContrastTextColor = getColorProperty(response, 'theme.dark.primary.contrastText');
                    const secondaryDarkColorMain = getColorProperty(response, 'theme.dark.secondary.main');
                    const themeDarkPrimaryText = getColorProperty(response, 'theme.dark.text.primary');
                    const themeDarkBackground = getColorProperty(response, 'theme.dark.background');

                    const lightTheme = createTheme({
                        palette: {
                            primary: {
                                main: primaryDarkColorMain ?? '#1976d2',
                                contrastText: primaryDarkContrastTextColor ?? '#fff'
                            },
                            secondary: {
                                main: secondaryDarkColorMain ?? '#9c27b0',
                            },
                            text: {
                                primary: themeDarkPrimaryText ?? '#000'
                            },
                            mode: "dark",
                            background: {
                                default: themeDarkBackground ?? '#121212',
                            }
                        },
                    });

                    setTheme(lightTheme);
                }
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