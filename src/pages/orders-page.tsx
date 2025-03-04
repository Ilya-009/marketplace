import React, { useState } from 'react';
import { Box, Typography, Tabs, Tab, Card, CardContent, Grid, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Order } from '../api/models/orders';

const OrdersPage: React.FC = () => {
    const [status, setStatus] = useState<'active' | 'completed'>('active');
    const navigate = useNavigate();

    // Пример данных заказов
    const orders: Order[] = [
        {
            id: 1,
            createdAt: new Date('2023-10-01'),
            status: 'active',
            customerId: 123,
            orderGoods: [
                { id: 1, quantity: 2, goodId: 101 },
                { id: 2, quantity: 1, goodId: 102 }
            ],
            paymentMethod: { id: 1, name: 'Credit Card' },
            deliveryMethod: { id: 1, name: 'Courier' }
        },
        {
            id: 2,
            createdAt: new Date('2023-09-25'),
            status: 'completed',
            customerId: 123,
            orderGoods: [
                { id: 3, quantity: 3, goodId: 103 }
            ],
            paymentMethod: { id: 2, name: 'PayPal' },
            deliveryMethod: { id: 2, name: 'Post' }
        }
    ];

    // Фильтрация заказов по статусу
    const filteredOrders = orders.filter((order) => order.status === status);

    // Обработчик изменения статуса
    const handleStatusChange = (event: React.SyntheticEvent, newStatus: 'active' | 'completed') => {
        setStatus(newStatus);
    };

    // Обработчик перехода на страницу заказа
    const handleOrderClick = (orderId: number) => {
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
                                <Typography variant="h6">Заказ от {order.createdAt.toLocaleDateString()}</Typography>
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
                                    {order.orderGoods.map((product) => (
                                        <Avatar key={product.id} src={`https://example.com/images/${product.goodId}.jpg`} alt={`Product ${product.goodId}`} />
                                    ))}
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