import React, {useEffect, useMemo, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    FormLabel,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Radio,
    RadioGroup, TextField,
    Typography,
} from '@mui/material';
import {MainPageBox} from "../components";
import Header from "../components/header/header.tsx";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useUnit} from "effector-react";
import {
    $addresses,
    $allGoods,
    $cart,
    $customer,
    $deliveryMethods,
    $paymentMethods,
    $properties,
    CartItem,
    createNewOrder,
    CreateNewOrderParam,
    Good,
    loadAddresses,
    loadDeliveryMethods,
    loadGoodsByIds,
    loadPaymentMethods,
    MarketplaceType
} from "../api";
import {findGoodById, getImageProperty, getMarketplaceType} from "../services";

type CartGood = {
    cartItem: CartItem,
    good: Good
};

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const marketplaceType = getMarketplaceType();

    const properties = useUnit($properties);
    const cart = useUnit($cart);
    const allGoods = useUnit($allGoods);
    const customer = useUnit($customer);
    const deliveryMethods = useUnit($deliveryMethods);
    const paymentMethods = useUnit($paymentMethods);
    const customerAddresses = useUnit($addresses);

    const [paymentMethodId, setPaymentMethodId] = useState<number>(1);
    const [deliveryMethodId, setDeliveryMethodId] = useState<number>(1);
    const [selectedAddressId, setSelectedAddressId] = useState<number>(1);
    const [orderComment, setOrderComment] = useState<string>('');

    const selectedGoodIds = useMemo(() =>
        searchParams.get('goodIds')?.split(',')?.map(id => parseInt(id)) ?? cart.map(c => c.goodId),
        [searchParams, cart]);

    useEffect(() => {
        if (marketplaceType === MarketplaceType.GOODS) {
            loadDeliveryMethods();
        }
        loadPaymentMethods();
    }, [marketplaceType]);

    useEffect(() => {
        if (customer.id > 0) {
            loadAddresses({addressIds: customer.addresses});
        }
    }, [customer.addresses, customer.id]);

    useEffect(() => {
        const goodIds = cart.map(cartItem => cartItem.goodId);
        loadGoodsByIds({ids: goodIds});
    }, [cart]);

    const emptyImage = useMemo(() => {
        return getImageProperty(properties, 'no.images.img');
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
    }, [allGoods, cart, selectedGoodIds]);

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
            addressId: selectedAddressId,
            goods: cartGoods.map(cartGood => {
                return {
                    goodId: cartGood.good.id,
                    quantity: cartGood.cartItem.quantity
                }
            }, []),
            comment: orderComment
        };
        createNewOrder(order);
        navigate('/profile/main');
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
                                {paymentMethods
                                    .filter(method => marketplaceType === MarketplaceType.GOODS ? true : method.name !== 'Наличные')
                                    .map((paymentMethod) => (
                                        <FormControlLabel
                                            key={paymentMethod.id}
                                            value={paymentMethod.id}
                                            control={<Radio/>}
                                            label={paymentMethod.name}
                                        />
                                    ))}
                            </RadioGroup>
                        </FormControl>

                        {marketplaceType === MarketplaceType.GOODS && (
                            <>
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

                                {deliveryMethodId !== 2 && (
                                    <FormControl component="fieldset" sx={{ marginBottom: '20px' }}>
                                        <FormLabel component="legend">Адрес доставки</FormLabel>
                                        <RadioGroup
                                            value={selectedAddressId}
                                            onChange={(e) => setSelectedAddressId(parseInt(e.target.value))}
                                        >
                                            {customerAddresses.map(address => (
                                                <FormControlLabel
                                                    key={address.id}
                                                    value={address.id}
                                                    control={<Radio />}
                                                    label={`${address.city}, ${address.street}, ${address.houseNumber}, кв. ${address.flatNumber}`}
                                                />
                                            ))}
                                        </RadioGroup>
                                    </FormControl>
                                )}
                            </>
                        )}

                        {/* Добавлен блок с комментарием к заказу */}
                        <Box sx={{ marginBottom: '20px' }}>
                            <TextField
                                fullWidth
                                label="Комментарий к заказу"
                                placeholder="Укажите дополнительные пожелания или детали"
                                multiline
                                rows={4}
                                value={orderComment}
                                onChange={(e) => setOrderComment(e.target.value)}
                                variant="outlined"
                            />
                        </Box>

                        <Typography variant="h6" gutterBottom>
                            {marketplaceType === MarketplaceType.GOODS ? 'Товары' : 'Услуги'} в заказе
                        </Typography>
                        <List>
                            {cartGoods.map((cartElem) => {
                                return (
                                    <ListItem key={cartElem.good.id}>
                                        <ListItemAvatar>
                                            <Grid item xs={2}>
                                                <img
                                                    src={cartElem.good.goodImages[0]?.image ? `http://localhost:8080/files/images/${cartElem.good.goodImages[0]?.image}` : emptyImage}
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

                {/* Правая часть: Итоговая сумма */}
                <Grid item xs={12} md={4}>
                    <Paper sx={{ padding: '20px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ marginBottom: '20px' }}
                            onClick={handleSubmit}
                        >
                            {marketplaceType === MarketplaceType.GOODS ? 'Оформить заказ' : 'Забронировать'}
                        </Button>

                        <Box sx={{ marginBottom: '20px' }}>
                            {marketplaceType === MarketplaceType.GOODS &&
                                <Typography variant="body1">
                                    Сумма: {totalProductsCost} руб.
                                </Typography>
                            }
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