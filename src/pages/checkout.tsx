import React, {useEffect, useMemo, useState} from 'react';
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
} from '@mui/material';
import { MainPageBox } from "../components";
import Header from "../components/header/header.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import { useUnit } from "effector-react";
import {$allGoods, $cart, $customer, $properties, CartItem, Good, loadGoodById} from "../api";
import {findGoodById, getProperty} from "../services";
import {
    $deliveryMethods,
    $paymentMethods, createNewOrder,
    CreateNewOrderParam,
    loadDeliveryMethods,
    loadPaymentMethods
} from '../api/models/orders';

type CartGood = {
    cartItem: CartItem,
    good: Good
};

// Компонент страницы оформления заказа
const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const selectedGoodIds = searchParams.get('goodIds')?.split(',')?.map(id => parseInt(id)) ?? [];

    const properties = useUnit($properties);
    const cart = useUnit($cart);
    const allGoods = useUnit($allGoods);
    const customer = useUnit($customer);
    const deliveryMethods = useUnit($deliveryMethods);
    const paymentMethods = useUnit($paymentMethods);

    useEffect(() => {
        loadDeliveryMethods();
        loadPaymentMethods();
    }, []);

    useEffect(() => {
        cart.forEach(cartItem => loadGoodById({ id: cartItem.goodId }));
    }, [cart]);

    const [paymentMethodId, setPaymentMethodId] = useState<number>(1);
    const [deliveryMethodId, setDeliveryMethodId] = useState<number>(1);

    const emptyImage = useMemo(() => {
        return getProperty(properties, 'no.images.img');
    }, [properties]);

    const cartGoods: CartGood[] = useMemo(() => {
        return cart.reduce((elems, cartItem) => {
            const good = findGoodById(allGoods, cartItem.goodId);

            if (good == null || !selectedGoodIds.includes(good.id)) {
                return elems;
            }

            const newItem: CartGood = {
                cartItem: cartItem,
                good: good
            };

            return [...elems, newItem];
        }, []);
    }, [allGoods, cart]);

    const deliveryCost = useMemo(() => {
        return deliveryMethods.find(m => m.id === deliveryMethodId)?.price ?? 0;
    }, [deliveryMethodId, deliveryMethods]);

    const totalProductsCost = useMemo(() => {
        return cartGoods.reduce((sum, cartItem) => {
            return sum + cartItem.cartItem.quantity * (cartItem.good?.price ?? 0);
        }, 0);
    }, [cartGoods])

    const totalCost = useMemo(() => {
        return totalProductsCost + deliveryCost;
    }, [deliveryCost, totalProductsCost]);

    const handleSubmit = () => {
        const order: CreateNewOrderParam = {
            customerId: customer?.id,
            deliveryMethodId: deliveryMethodId,
            paymentMethodId: paymentMethodId,
            addressId: 1,
            goods: cartGoods.map(cartGood => {
                return {
                    goodId: cartGood.good.id,
                    quantity: cartGood.cartItem.quantity
                }
            }, [])
        };
        createNewOrder(order);
        navigate('/');
    };

    return (
        <MainPageBox>
            <Header />
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
                                value={paymentMethodId}
                                onChange={(e) => setPaymentMethodId(parseInt(e.target.value))}
                            >
                                {paymentMethods.map((paymentMethod) => (
                                    <FormControlLabel
                                        key={paymentMethod.id}
                                        value={paymentMethod.id}
                                        control={<Radio/>}
                                        label={paymentMethod.name}
                                    />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        <FormControl component="fieldset" sx={{ marginBottom: '20px' }}>
                            <FormLabel component="legend">Способ доставки</FormLabel>
                            <RadioGroup
                                value={deliveryMethodId}
                                onChange={(e) => setDeliveryMethodId(parseInt(e.target.value))}
                            >
                                {deliveryMethods.map(deliveryMethod => (
                                    <FormControlLabel key={deliveryMethod.id} value={deliveryMethod.id} control={<Radio />} label={deliveryMethod.name} />
                                ))}
                            </RadioGroup>
                        </FormControl>

                        <Typography variant="h6" gutterBottom>
                            Товары в заказе
                        </Typography>
                        <List>
                            {cartGoods.map((cartElem) => {
                                return (
                                    <ListItem key={cartElem.good.id}>
                                        <ListItemAvatar>
                                            <Grid item xs={2}>
                                                <img
                                                    src={cartElem.good.goodImages[0]?.image ?? emptyImage}
                                                    alt={cartElem.good.name}
                                                    style={{ width: 50, height: 50, marginRight: 10 }}
                                                />
                                            </Grid>
                                        </ListItemAvatar>
                                        <ListItemText primary={cartElem.good.name} secondary={`${cartElem.good.price} руб.`} />
                                        <ListItemText primary={`${cartElem.cartItem.quantity} шт.`} />
                                    </ListItem>
                                );
                            })}
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