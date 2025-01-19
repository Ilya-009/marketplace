import React from 'react';
import styled from 'styled-components';
import {AppBar, Typography, Button, TextField, IconButton, Stack} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {SmallLinkActive, SmallLinkPassive} from "../common";
import LinkWithIcon from "./header-link.tsx";

const Logo = styled(Typography)`
    flex-grow: 1;
    font-weight: bold;
    font-size: 24px;
`;

const SearchField = styled(TextField)`
    margin-left: 20px;
    flex-grow: 2;
`;

const Header: React.FC = () => {
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
                <Logo variant="h6">Логотип</Logo>
                <Button variant="contained" startIcon={<ListAltIcon/>}>
                    Каталог
                </Button>
                <SearchField variant="outlined" color='primary' placeholder="Поиск товаров" size="small" InputProps={{
                    endAdornment: (
                        <IconButton>
                            <SearchIcon/>
                        </IconButton>
                    ),
                }}/>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent='space-around'>
                    <LinkWithIcon icon={<LoginIcon/>} label='Войти' href='#'/>
                    <LinkWithIcon icon={<ListAltIcon/>} label='Заказы' href='#'/>
                    <LinkWithIcon icon={<FavoriteIcon/>} label='Избранное' href='#'/>
                    <LinkWithIcon icon={<ShoppingCartIcon/>} label='Корзина' href='#'/>
                </Stack>
            </Stack>
        </AppBar>
    );
};

export default Header;
