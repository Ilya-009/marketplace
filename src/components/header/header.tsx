import React, {useState} from 'react';
import styled from 'styled-components';
import {AppBar, Box, Button, IconButton, Link, Stack} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ListAltIcon from '@mui/icons-material/ListAlt';
import {SmallLinkActive, SmallLinkPassive, StyledSearchField} from "../common";
import LinkWithIcon from "./header-link.tsx";
import {useUnit} from "effector-react";
import {$loggedUser, $properties, $searchResults, executeSearch, MarketplaceType, UserRole} from "../../api";
import {getImageProperty, getMarketplaceType, isUserAuthenticated, isUserAuthenticatedWithRole} from "../../services";
import CategoryCatalog from "../catalog/catalog.tsx";
import {AccountBox} from "@mui/icons-material";
import StoreIcon from '@mui/icons-material/Store';
import {SearchResultsDropdown} from "../catalog/search-dropdown.tsx";
import LanguageSwitcher from "../common/language-change-select.tsx";
import {useLanguage} from "../../locales/language-context.tsx";

const SearchField = styled(StyledSearchField)`
    margin-left: 20px;
    flex-grow: 2;
`;

const Header: React.FC = () => {
    const properties = useUnit($properties);
    const searchResults = useUnit($searchResults);
    const loggedUser = useUnit($loggedUser);
    const logoImageSrc = getImageProperty(properties, 'logo.image');
    const marketplaceType = getMarketplaceType();
    const {t} = useLanguage();

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        executeSearch(query);
    };

    return (
        <AppBar position="static" sx={{ padding: 2, borderRadius: '0 0 10px 10px', marginBottom: '2rem' }} color='transparent'>
            <Stack direction="row" spacing={1} padding='0 .5rem' alignItems="center" justifyContent='space-between'>
                <SmallLinkActive>
                    Вологда. Уточнить адрес
                </SmallLinkActive>

                <Stack direction="row" spacing={1} alignItems="center" justifyContent='space-between'>
                    {(isUserAuthenticated() && !isUserAuthenticatedWithRole(loggedUser, UserRole.SELLER)) && (
                        <SmallLinkPassive href='/become-seller'>{t('main.header.becomeSeller')}</SmallLinkPassive>
                    )}
                    <LanguageSwitcher/>
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
                    {t('main.header.catalog')}
                </Button>
                <Box sx={{ position: 'relative', flexGrow: 2 }}>
                    <SearchField
                        variant="outlined"
                        sx={{ width: '100%' }}
                        placeholder={marketplaceType === MarketplaceType.GOODS ? t('main.header.search.goods') : t('main.header.search.services')}
                        size="small"
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
                        ? <LinkWithIcon icon={<AccountBox />} label={t('main.header.links.profile')} href='/profile/main' />
                        : <LinkWithIcon icon={<LoginIcon />} label={t('main.header.links.login')} href='/signIn' />
                    }
                    {isUserAuthenticatedWithRole(loggedUser, UserRole.SELLER) && (
                        <LinkWithIcon icon={<StoreIcon />} label={t('main.header.links.myStore')} href='/seller/main' />
                    )}
                    {marketplaceType === MarketplaceType.GOODS && (
                        <LinkWithIcon icon={<ShoppingCartIcon />} label={t('main.header.links.cart')} href='/cart' />
                    )}
                </Stack>
            </Stack>

            <CategoryCatalog isOpen={open} handleClose={handleClose} />
        </AppBar>
    );
};

export default Header;