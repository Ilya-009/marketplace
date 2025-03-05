import React, {useEffect, useMemo, useState} from 'react';
import {Avatar, Box, Card, CardContent, Grid, Tab, Tabs, Typography} from '@mui/material';
import {$orders, loadCustomerOrders, OrderStatus} from '../api/models/orders';
import {useUnit} from "effector-react";
import {$allGoods, $customer, $properties, loadGoodById} from "../api";
import {getProperty} from "../services";

const OrdersPage: React.FC = () => {
    const [status, setStatus] = useState<OrderStatus>(OrderStatus.CREATED);
    const properties = useUnit($properties);
    const customer = useUnit($customer);
    const orders = useUnit($orders);
    const goods = useUnit($allGoods);

    useEffect(() => {
        if (customer?.id !== -1) {
            loadCustomerOrders({customerId: customer?.id});
        }
    }, [customer?.id]);

    useEffect(() => {
        orders
            .flatMap(order => order.orderGoods)
            .map(orderGood => orderGood.goodId)
            .forEach((goodId) => loadGoodById({id: goodId}));
    }, [orders]);

    const emptyImage = useMemo(() => {
        return getProperty(properties, 'no.images.img');
    }, [properties]);

    // Фильтрация заказов по статусу
    const filteredOrders = useMemo(() =>
            orders.filter((order) => order.status === status),
        [orders, status]);

    // Обработчик изменения статуса
    const handleStatusChange = (event: React.SyntheticEvent, newStatus: OrderStatus) => {
        setStatus(newStatus);
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Заказы
            </Typography>

            {/* Табы для выбора статуса заказов */}
            <Tabs value={status} onChange={handleStatusChange} sx={{ marginBottom: 3 }}>
                <Tab label="Актуальные" value={OrderStatus.CREATED} />
                <Tab label="Завершённые" value={OrderStatus.FINISHED} />
            </Tabs>

            {/* Список заказов */}
            {filteredOrders.map((order) => (
                <Card key={order.id} sx={{ marginBottom: 3 }}>
                    <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                            {/* Заголовок и сумма заказа */}
                            <Grid item xs={8}>
                                <Typography variant="h6">Заказ от {order.createdAt}</Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                <Typography variant="h6">
                                    {/* Предположим, что сумма заказа рассчитывается как-то иначе */}
                                    {order.orderGoods.reduce((sum, item) => sum + item.quantity * 1000, 0)} ₽
                                </Typography>
                            </Grid>

                            {/* Информация о доставке */}
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary">
                                    Способ оплаты: {order.paymentMethod.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Способ доставки: {order.deliveryMethod.name}
                                </Typography>
                            </Grid>

                            {/* Миниатюры товаров */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
                                    {order.orderGoods.map((orderGood) => {
                                        const good = goods.find(g => g.id === orderGood.goodId);
                                        if (!good) {
                                            return '';
                                        }

                                        return <Avatar key={orderGood.id} src={good.goodImages[0]?.image ?? emptyImage} alt={`Product ${orderGood.goodId}`} />;
                                    })}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default OrdersPage;