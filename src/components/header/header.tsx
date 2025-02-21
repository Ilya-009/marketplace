import React, {useState} from 'react';
import styled from 'styled-components';
import {AppBar, Button, TextField, IconButton, Stack, Box, Link} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {SmallLinkActive, SmallLinkPassive} from "../common";
import LinkWithIcon from "./header-link.tsx";
import {useUnit} from "effector-react";
import {$properties} from "../../api";
import {getProperty} from "../../services";
import CategoryCatalog from "../catalog/catalog.tsx";
import {primaryTextColor} from "../../ui";
import {isUserAuthenticated} from "../../services/authentication.ts";
import {AccountBox} from "@mui/icons-material";

const SearchField = styled(TextField)`
    margin-left: 20px;
    flex-grow: 2;
`;

const Header: React.FC = () => {
    const properties = useUnit($properties);
    const logoImageSrc = getProperty(properties, 'logo.image');

    const [open, setOpen] = useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <AppBar position="static" sx={{padding: 2, borderRadius: '0 0 10px 10px'}} color='transparent'>
            <Stack direction="row" spacing={1} padding='0 .5rem' alignItems="center" justifyContent='space-between'>
                <SmallLinkActive>
                    Вологда. Уточнить адрес
                </SmallLinkActive>

                <Stack direction="row" spacing={1} alignItems="center" justifyContent='space-between'>
                    <SmallLinkPassive>Стать продавцом</SmallLinkPassive>
                    <SmallLinkPassive>Помощь</SmallLinkPassive>
                </Stack>
            </Stack>

            <Stack direction="row" sx={{paddingTop: '1rem'}} spacing={1} alignItems="center" justifyContent='space-around'>
                <Link href='/'>
                    <Box
                        component="img"
                        sx={{
                            height: 44,
                            width: 200,
                        }}
                        alt="Лого"
                        src={logoImageSrc}
                    />
                </Link>

                <Button variant="contained" startIcon={<ListAltIcon/>} onClick={handleClickOpen}>
                    Каталог
                </Button>
                <SearchField variant="outlined" sx={{ input: { color: primaryTextColor } }} placeholder="Поиск товаров" size="small" InputProps={{
                    endAdornment: (
                        <IconButton>
                            <SearchIcon/>
                        </IconButton>
                    ),
                }}/>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent='space-around'>
                    {isUserAuthenticated()
                        ? <LinkWithIcon icon={<AccountBox/>} label='Профиль' href='/profile/main'/>
                        : <LinkWithIcon icon={<LoginIcon/>} label='Войти' href='/signIn'/>
                    }
                    <LinkWithIcon icon={<FavoriteIcon/>} label='Избранное' href='#'/>
                    <LinkWithIcon icon={<ShoppingCartIcon/>} label='Корзина' href='/cart'/>
                </Stack>
            </Stack>

            <CategoryCatalog isOpen={open} handleClose={handleClose}/>
        </AppBar>
    );
};

export default Header;
