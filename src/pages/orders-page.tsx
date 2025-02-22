import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, Grid, Avatar, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {orders} from "../api/models/orders.ts";

const OrdersPage: React.FC = () => {
    const [status, setStatus] = useState<'active' | 'completed'>('active');
    const navigate = useNavigate();

    // Фильтрация заказов по статусу
    const filteredOrders = orders.filter((order) => order.status === status);

    // Обработчик изменения статуса
    const handleStatusChange = (event: React.SyntheticEvent, newStatus: 'active' | 'completed') => {
        setStatus(newStatus);
    };

    // Обработчик перехода на страницу заказа
    const handleOrderClick = (orderId: string) => {
        navigate(`/orders/${orderId}`); // Заглушка для перехода на страницу заказа
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Заказы
            </Typography>

            {/* Табы для выбора статуса заказов */}
            <Tabs value={status} onChange={handleStatusChange} sx={{ marginBottom: 3 }}>
                <Tab label="Актуальные" value="active" />
                <Tab label="Завершённые" value="completed" />
            </Tabs>

            {/* Список заказов */}
            {filteredOrders.map((order) => (
                <Card key={order.id} sx={{ marginBottom: 3 }} onClick={() => handleOrderClick(order.id)}>
                    <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                            {/* Заголовок и сумма заказа */}
                            <Grid item xs={8}>
                                <Typography variant="h6">Заказ от {order.date}</Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                <Typography variant="h6">{order.totalAmount} ₽</Typography>
                            </Grid>

                            {/* Информация о доставке */}
                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary">
                                    {order.deliveryInfo}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Дата доставки: {order.deliveryDate}
                                </Typography>
                            </Grid>

                            {/* Миниатюры товаров */}
                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 1, marginTop: 2 }}>
                                    {order.products.map((product) => (
                                        <Avatar key={product.id} src={product.image} alt={product.name} />
                                    ))}
                                </Box>
                            </Grid>

                            {/* Кнопки для оценки */}
                            <Grid item xs={12} sx={{ display: 'flex', gap: 2, marginTop: 2 }}>
                                <Button variant="outlined">Оценить заказ</Button>
                                <Button variant="outlined">Оценить товар</Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
        </Box>
    );
};

export default OrdersPage;