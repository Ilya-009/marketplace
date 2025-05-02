import React from 'react';
import { ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';
import {useThemeSettings} from "./useThemeSettings.ts";

export const CombinedThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const theme = useThemeSettings();

    if (!theme) {
        return <div>Загрузка темы...</div>;
    }

    return (
        <MUIThemeProvider theme={theme}>
            <StyledThemeProvider theme={theme}>
                {children}
            </StyledThemeProvider>
        </MUIThemeProvider>
    );
};