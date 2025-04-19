import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import {styled} from '@mui/material/styles';
import {useMemo, useState} from "react";
import {MenuItem, Select, SelectChangeEvent, TextField} from "@mui/material";
import {countries, organizationTypes} from "../../constants.ts";
import {useUnit} from "effector-react";
import {$categories, $loggedUser, findCategoryById, GoodCategory} from "../../api";
import {getRootCategories} from "../../services";
import {validateSellerRegister} from "../../components";
import {useNavigate} from "react-router-dom";
import {OrganizationType, registerStoreFx} from "../../api";

const Card = styled(MuiCard)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
        maxWidth: '450px',
    },
    boxShadow:
        'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
    ...theme.applyStyles('dark', {
        boxShadow:
            'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
    }),
}));

const SignInContainer = styled(Stack)(({theme}) => ({
    height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
    minHeight: '100%',
    padding: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(4),
    },
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        zIndex: -1,
        inset: 0,
        backgroundImage:
            'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
        backgroundRepeat: 'no-repeat',
        ...theme.applyStyles('dark', {
            backgroundImage:
                'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
        }),
    },
}));

export default function BecomeSellerPage() {
    const categories = useUnit($categories);
    const loggedUser = useUnit($loggedUser);
    const navigate = useNavigate();

    const [country, setCountry] = useState<string>('Россия');
    const [countryError, setCountryError] = useState<boolean>(false);

    const [organizationType, setOrganizationType] = useState<OrganizationType>();
    const [organizationTypeError, setOrganizationTypeError] = useState<boolean>(false);

    const [shopName, setShopName] = useState<string>('');
    const [shopNameError, setShopNameError] = useState<boolean>(false);

    const [productCategory, setProductCategory] = useState<GoodCategory>();
    const [mainProductCategoryError, setMainProductCategoryError] = useState<boolean>(false);

    const rootCategories = useMemo(() => {
        return getRootCategories(categories);
    }, [categories]);

    const handleCountryChange = (event: SelectChangeEvent) => {
        setCountry(event.target.value as string);
    };

    const handleOrganizationTypeChange = (event: SelectChangeEvent) => {
        const orgType = event.target.value as OrganizationType;
        setOrganizationType(orgType);
    };

    const handleProductCategoryChange = (event: SelectChangeEvent) => {
        const category = findCategoryById(rootCategories, parseInt(event.target.value));
        if (category != null) {
            setProductCategory(category);
        }
    };

    const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
        event.preventDefault();

        const newStore = {
            country: country,
            setCountryErr: setCountryError,
            organizationType: organizationType,
            setOrganizationTypeErr: setOrganizationTypeError,
            storeName: shopName,
            setStoreNameErr: setShopNameError,
            mainGoodCategory: productCategory,
            setMainGoodCategoryErr: setMainProductCategoryError
        };
        const validResult = validateSellerRegister(newStore);

        if (validResult) {
            // Отправляем запрос на регистрацию продавца (синхронно)
            // и выполняем редирект на страницу продавца
            registerStoreFx({
                name: shopName,
                country: country,
                organizationType: organizationType as OrganizationType,
                userId: loggedUser.id,
                mainCategoryId: productCategory?.id as number
            })
                .then(() => navigate('/seller/main'));
            return;
        }
    };

    return (
        <>
            <CssBaseline enableColorScheme />
            <SignInContainer direction="column" justifyContent="space-between">
                <Card variant="outlined">
                    <Typography
                        component="h1"
                        variant="h4"
                        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
                    >
                        Пройдите регистрацию
                    </Typography>
                    <Box
                        component="form"
                        noValidate
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '100%',
                            gap: 2,
                        }}
                    >
                        <FormControl>
                            <FormLabel>Страна регистрации</FormLabel>
                            <Select
                                required
                                variant='outlined'
                                value={country}
                                onChange={handleCountryChange}
                                color={countryError ? 'error' : 'primary'}
                                error={countryError}
                                sx={{ marginBottom: '20px' }}
                            >
                                {countries.map((country) => (
                                    <MenuItem key={country} value={country}>{country}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Тип организации</FormLabel>
                            <Select
                                variant='outlined'
                                required
                                value={organizationType}
                                error={organizationTypeError}
                                color={organizationTypeError ? 'error' : 'primary'}
                                onChange={handleOrganizationTypeChange}
                                sx={{ marginBottom: '20px' }}
                            >
                                {[...organizationTypes.entries()].map((entry) => (
                                    <MenuItem key={entry[0]} value={entry[0]}>{entry[1]}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl>
                            <FormLabel>Название магазина</FormLabel>
                            <TextField
                                required
                                variant="outlined"
                                color={shopNameError ? 'error' : 'primary'}
                                error={shopNameError}
                                value={shopName}
                                onChange={(e) => setShopName(e.target.value)}
                                sx={{ marginBottom: '20px' }}
                            />
                        </FormControl>
                        <FormControl>
                            <FormLabel>Основная категория товаров</FormLabel>
                            <Select
                                required
                                variant='outlined'
                                color={mainProductCategoryError ? 'error' : 'primary'}
                                error={mainProductCategoryError}
                                value={productCategory?.id}
                                onChange={handleProductCategoryChange}
                                sx={{ marginBottom: '20px' }}
                            >
                                {rootCategories.map((category) => (
                                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSubmit}
                        >
                            Завершить регистрацию
                        </Button>
                    </Box>
                </Card>
            </SignInContainer>
        </>
    );
}
