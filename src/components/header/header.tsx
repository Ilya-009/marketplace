import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import { AppBar, Button, TextField, IconButton, Stack, Box, Link } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { SmallLinkActive, SmallLinkPassive } from "../common";
import LinkWithIcon from "./header-link.tsx";
import { useUnit } from "effector-react";
import {$allGoods, $properties, $searchResults, executeSearch, Good} from "../../api";
import { getProperty } from "../../services";
import CategoryCatalog from "../catalog/catalog.tsx";
import { primaryTextColor } from "../../ui";
import { isUserAuthenticated } from "../../services";
import { AccountBox } from "@mui/icons-material";
import {SearchResultsDropdown} from "../catalog/search-dropdown.tsx";

const SearchField = styled(TextField)`
    margin-left: 20px;
    flex-grow: 2;
`;

const Header: React.FC = () => {
    const properties = useUnit($properties);
    // const allGoods = useUnit($allGoods);
    const searchResults = useUnit($searchResults);
    const logoImageSrc = getProperty(properties, 'logo.image');

    const [open, setOpen] = useState(false);
    // const [searchQuery, setSearchQuery] = useState('');
    // const [searchResults, setSearchResults] = useState<Good[]>([]);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // const handleSearch = (query: string, goods: Good[]) => {
    //     if (!query) {
    //         setSearchResults([]);
    //         return;
    //     }
    //
    //     const filteredGoods = goods.filter(good =>
    //         good.name.toLowerCase().includes(query.toLowerCase())
    //     );
    //
    //     setSearchResults(filteredGoods);
    // };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        executeSearch(query);
        // setSearchQuery(query);
        // handleSearch(query, allGoods);
    };

    return (
        <AppBar position="static" sx={{ padding: 2, borderRadius: '0 0 10px 10px', marginBottom: '2rem' }} color='transparent'>
            <Stack direction="row" spacing={1} padding='0 .5rem' alignItems="center" justifyContent='space-between'>
                <SmallLinkActive>
                    Вологда. Уточнить адрес
                </SmallLinkActive>

                <Stack direction="row" spacing={1} alignItems="center" justifyContent='space-between'>
                    <SmallLinkPassive>Стать продавцом</SmallLinkPassive>
                    <SmallLinkPassive>Помощь</SmallLinkPassive>
                </Stack>
            </Stack>

            <Stack direction="row" sx={{ paddingTop: '1rem' }} spacing={1} alignItems="center" justifyContent='space-around'>
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

                <Button variant="contained" startIcon={<ListAltIcon />} onClick={handleClickOpen}>
                    Каталог
                </Button>
                <Box sx={{ position: 'relative', flexGrow: 2 }}>
                    <SearchField
                        variant="outlined"
                        sx={{ input: { color: primaryTextColor }, width: '100%' }}
                        placeholder="Поиск товаров"
                        size="small"
                        // value={searchQuery}
                        onChange={handleSearchChange}
                        InputProps={{
                            endAdornment: (
                                <IconButton>
                                    <SearchIcon />
                                </IconButton>
                            ),
                        }}
                    />
                    {searchResults.length > 0 && <SearchResultsDropdown results={searchResults} />}
                </Box>
                <Stack direction="row" spacing={2} alignItems="center" justifyContent='space-around'>
                    {isUserAuthenticated()
                        ? <LinkWithIcon icon={<AccountBox />} label='Профиль' href='/profile/main' />
                        : <LinkWithIcon icon={<LoginIcon />} label='Войти' href='/signIn' />
                    }
                    <LinkWithIcon icon={<FavoriteIcon />} label='Избранное' href='#' />
                    <LinkWithIcon icon={<ShoppingCartIcon />} label='Корзина' href='/cart' />
                </Stack>
            </Stack>

            <CategoryCatalog isOpen={open} handleClose={handleClose} />
        </AppBar>
    );
};

export default Header;