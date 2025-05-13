import React from 'react';
import { AppBar, Box, Link, Stack } from '@mui/material';
import { useUnit } from "effector-react";
import { $properties } from "../../api";
import {getImageProperty} from "../../services";
import LanguageSwitcher from "../common/language-change-select.tsx";

const MiniHeader: React.FC = () => {
    const properties = useUnit($properties);
    const logoImageSrc = getImageProperty(properties, 'logo.image');

    return (
        <AppBar position="static" sx={{ padding: 2, borderRadius: '0 0 10px 10px', marginBottom: '2rem' }} color='transparent'>
            <Stack direction="column" spacing={2}>
                <Stack direction="row" sx={{ paddingTop: '1rem' }} spacing={1} alignItems="center" justifyContent='space-between'>
                    <Link href='/'>
                        <Box
                            component="img"
                            sx={{
                                maxHeight: 44,
                                maxWidth: 200
                            }}
                            alt="Лого"
                            src={logoImageSrc}
                        />
                    </Link>
                    <LanguageSwitcher/>
                </Stack>
            </Stack>
        </AppBar>
    );
};

export default MiniHeader;