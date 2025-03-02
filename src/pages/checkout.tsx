import React, { useState } from 'react';
import {
    Box,
    Typography,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    Button,
    Grid,
    Paper,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText, TextField,
} from '@mui/material';
import {MainPageBox} from "../components";
import Header from "../components/header/header.tsx";
import {useNavigate} from "react-router-dom";

// Моковые данные для товаров в заказе
const mockProducts = [
    { id: 1, name: 'Товар 1', price: 1000, image: 'https://via.placeholder.com/50' },
    { id: 2, name: 'Товар 2', price: 2000, image: 'https://via.placeholder.com/50' },
];

// Компонент страницы оформления заказа
const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState<string>('card');
    const [deliveryMethod, setDeliveryMethod] = useState<string>('pickup');
    // const [promoCode, setPromoCode] = useState<string>('');
    const [discount, setDiscount] = useState<number>(0);
    const [userData, setUserData] = useState({
        name: '',
        address: '',
        email: '',
    });

    // Стоимость доставки (пример)
    const deliveryCost = deliveryMethod === 'pickup' ? 0 : 500;

    // Итоговая сумма
    const totalProductsCost = mockProducts.reduce((sum, product) => sum + product.price, 0);
    const totalCost = totalProductsCost + deliveryCost - discount;

    // Обработчик применения промокода
    // const handleApplyPromoCode = () => {
    //     // Пример логики применения промокода
    //     if (promoCode === 'DISCOUNT10') {
    //         setDiscount(totalProductsCost * 0.1); // Скидка 10%
    //     } else {
    //         setDiscount(0);
    //         alert('Промокод недействителен');
    //     }
    // };

    // Обработчик изменения данных пользователя
    const handleUserDataChange = (field: string, value: string) => {
        setUserData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        alert('Заказ оформлен');
        navigate('/');
    };

    return (
        <MainPageBox>
            <Header/>
            <Typography variant="h4" gutterBottom>
                Оформление заказа
            </Typography>

            <Grid container spacing={4}>
                {/* Левая часть: Форма заполнения данных */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ padding: '20px' }}>
                        <FormControl component="fieldset" sx={{ marginBottom: '20px' }}>
                            <FormLabel component="legend">Способ оплаты</FormLabel>
                            <RadioGroup
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                            >
                                <FormControlLabel value="card" control={<Radio />} label="Банковская карта" />
                                <FormControlLabel
                                    value="cash"
                                    control={<Radio />}
                                    label="Наличными при получении"
                                />
                            </RadioGroup>
                        </FormControl>

                        <FormControl component="fieldset" sx={{ marginBottom: '20px' }}>
                            <FormLabel component="legend">Способ доставки</FormLabel>
                            <RadioGroup
                                value={deliveryMethod}
                                onChange={(e) => setDeliveryMethod(e.target.value)}
                            >
                                <FormControlLabel value="pickup" control={<Radio />} label="Самовывоз" />
                                <FormControlLabel value="cdek" control={<Radio />} label="СДЭК" />
                                <FormControlLabel value="courier" control={<Radio />} label="Курьер" />
                            </RadioGroup>
                        </FormControl>

                        {/* Форма данных пользователя */}
                        <Typography variant="h6" gutterBottom>
                            Данные пользователя
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '2rem' }}>
                            <TextField
                                label="Имя"
                                value={userData.name}
                                onChange={(e) => handleUserDataChange('name', e.target.value)}
                                fullWidth
                            />
                            {deliveryMethod !== 'pickup' && (
                                <TextField
                                    label="Адрес доставки"
                                    value={userData.address}
                                    onChange={(e) => handleUserDataChange('address', e.target.value)}
                                    fullWidth
                                />
                            )}
                            <TextField
                                label="Email"
                                value={userData.email}
                                onChange={(e) => handleUserDataChange('email', e.target.value)}
                                fullWidth
                            />
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            Товары в заказе
                        </Typography>
                        <List>
                            {mockProducts.map((product) => (
                                <ListItem key={product.id}>
                                    <ListItemAvatar>
                                        <Avatar src={product.image} alt={product.name} />
                                    </ListItemAvatar>
                                    <ListItemText primary={product.name} secondary={`${product.price} руб.`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>

                {/* Правая часть: Итоговая сумма и промокод */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ padding: '20px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginBottom: '20px' }}
                            onClick={handleSubmit}
                        >
                            Оформить заказ
                        </Button>

                        <Box sx={{ marginBottom: '20px' }}>
                            <Typography variant="body1">
                                Сумма за товары: {totalProductsCost} руб.
                            </Typography>
                            {deliveryCost > 0 && (
                                <Typography variant="body1">
                                    Стоимость доставки: {deliveryCost} руб.
                                </Typography>
                            )}
                            {discount > 0 && (
                                <Typography variant="body1" color="error">
                                    Скидка: {discount} руб.
                                </Typography>
                            )}
                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                Итого: {totalCost} руб.
                            </Typography>
                        </Box>

                        {/*<Divider sx={{ marginBottom: '20px' }} />*/}

                        {/*<Typography variant="h6" gutterBottom>*/}
                        {/*    Применить промокод*/}
                        {/*</Typography>*/}
                        {/*<Box sx={{ display: 'flex', gap: '10px' }}>*/}
                        {/*    <TextField*/}
                        {/*        value={promoCode}*/}
                        {/*        onChange={(e) => setPromoCode(e.target.value)}*/}
                        {/*        placeholder="Введите промокод"*/}
                        {/*        fullWidth*/}
                        {/*    />*/}
                        {/*    <Button variant="outlined" onClick={handleApplyPromoCode}>*/}
                        {/*        Применить*/}
                        {/*    </Button>*/}
                        {/*</Box>*/}
                    </Paper>
                </Grid>
            </Grid>
        </MainPageBox>
    );
};

export default CheckoutPage;