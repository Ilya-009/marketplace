import React, {useEffect, useState} from 'react';
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
    ListItemText,
    TextField,
} from '@mui/material';
import {MainPageBox} from "../components";
import Header from "../components/header/header.tsx";
import {useNavigate} from "react-router-dom";
import {useUnit} from "effector-react";
import {$allGoods, $cart, Good, loadGoodById} from "../api";
import {findGoodById} from "../services";

// Компонент страницы оформления заказа
const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const cart = useUnit($cart);
    const allGoods = useUnit($allGoods);

    useEffect(() => {
        cart.forEach(cartItem => loadGoodById({id: cartItem.goodId}));
    }, [cart]);

    const [paymentMethod, setPaymentMethod] = useState<string>('card');
    const [deliveryMethod, setDeliveryMethod] = useState<string>('pickup');
    // const [promoCode, setPromoCode] = useState<string>('');
    const [userData, setUserData] = useState({
        name: '',
        address: '',
        email: '',
    });

    // Стоимость доставки (пример)
    const deliveryCost = deliveryMethod === 'pickup' ? 0 : 500;

    // Итоговая сумма
    const totalProductsCost = cart.reduce((sum, cartItem) => {
        const good = findGoodById(allGoods, cartItem.goodId);
        return sum + cartItem.quantity * (good?.price ?? 0);
    }, 0)
    const totalCost = totalProductsCost + deliveryCost;

    // Обработчик изменения данных пользователя
    const handleUserDataChange = (field: string, value: string) => {
        setUserData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        alert('Заказ оформлен');
        const order = {
            paymentMethod: paymentMethod,
            deliveryMethod: deliveryMethod,
            userData: userData,
            cost: totalProductsCost
        };

        const ordersStr = localStorage.getItem('orders');
        if (ordersStr != null) {
            const orders = JSON.parse(ordersStr);
            const appended = [...orders, order];
            localStorage.setItem('orders', JSON.stringify(appended));
        } else {
            localStorage.setItem('orders', JSON.stringify([order]));
        }

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
                            {cart.map((cartItem) => {
                                const good = findGoodById(allGoods, cartItem.goodId);
                                if (good == null) {
                                    return null;
                                }

                                return (
                                    <ListItem key={good.id}>
                                        <ListItemAvatar>
                                            <Grid item xs={2}>
                                                <img
                                                    src={good.goodImages[0].image}
                                                    alt={good.name}
                                                    style={{width: 50, height: 50, marginRight: 10}}
                                                />
                                            </Grid>
                                        </ListItemAvatar>
                                        <ListItemText primary={good.name} secondary={`${good.price} руб.`} />
                                        <ListItemText primary={`${cartItem.quantity} шт.`} />
                                    </ListItem>
                                );
                            })}
                            {/*{mockProducts.map((product) => (*/}
                            {/*    */}
                            {/*))}*/}
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
                            <Typography variant="h6" sx={{ marginTop: '10px' }}>
                                Итого: {totalCost} руб.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </MainPageBox>
    );
};

export default CheckoutPage;