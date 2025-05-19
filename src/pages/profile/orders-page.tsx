import React, {useState, useEffect, useMemo, useCallback} from 'react';
import {
    Box, Button, Card, CardContent, Grid, Typography, Tabs, Tab,
    Avatar, Link
} from '@mui/material';
import { useUnit } from 'effector-react';
import {useLanguage} from "../../locales/language-context.tsx";
import {
    $allGoods,
    $customer,
    $orders, $properties, createNewReturnRequestFx,
    loadCustomerOrders,
    loadGoodsByIds,
    Order,
    OrderStatus,
    ReturnReason
} from "../../api";
import {getNumericProperty, getStringProperty} from "../../services";
import {ReturnRequestModal} from "../../components/profile";
import {SidebarPageBox} from "../../components";
import {isDateValid} from "../../services/type-utils.ts";

const OrdersPage: React.FC = () => {
    const { currency } = useLanguage();
    const [status, setStatus] = useState<OrderStatus>(OrderStatus.CREATED);
    const [returnModalOpen, setReturnModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const properties = useUnit($properties);
    const customer = useUnit($customer);
    const orders = useUnit($orders);
    const goods = useUnit($allGoods);
    const emptyImage = useMemo(() => getStringProperty(properties, 'no.images.img'), [properties]);
    const returnPeriodDays = getNumericProperty(properties, 'return.max.days.enabled');

    useEffect(() => {
        if (customer?.id !== -1) {
            loadCustomerOrders({ customerId: customer?.id });
        }
    }, [customer?.id]);

    useEffect(() => {
        const goodIds = orders
            .flatMap(order => order.orderGoods)
            .map(orderGood => orderGood.goodId);
        loadGoodsByIds({ ids: goodIds });
    }, [orders]);

    const filteredOrders = useMemo(() =>
            orders.filter((order) => order.status === status),
        [orders, status]
    );

    const isReturnAvailable = useCallback((order: Order) => {
        return isDateValid(order.createdAt, returnPeriodDays);
    }, [returnPeriodDays]);

    const handleSubmitReturn = async (data: {
        goodId: number;
        reason: ReturnReason;
        comment: string;
        images: File[];
    }) => {
        if (!selectedOrder) return;

        const orderGoodId = selectedOrder.orderGoods.find(og => og.goodId === data.goodId)?.id ?? -1;

        try {
            await createNewReturnRequestFx({
                orderGoodId: orderGoodId,
                customerId: customer.id,
                returnReason: data.reason,
                comment: data.comment,
                photos: data.images
            });
            setReturnModalOpen(false);
        } catch (error) {
            console.error('Ошибка при отправке возврата:', error);
        }
    };

    return (
        <SidebarPageBox sx={{ width: '90%' }}>
            <Typography variant="h4" gutterBottom>
                Заказы
            </Typography>

            <Tabs value={status} onChange={(e, newStatus) => setStatus(newStatus)} sx={{ mb: 3 }}>
                <Tab label="Актуальные" value={OrderStatus.CREATED} />
                <Tab label="Завершённые" value={OrderStatus.FINISHED} />
            </Tabs>

            {filteredOrders.map((order) => (
                <Card key={order.id} sx={{ mb: 3 }}>
                    <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={8}>
                                <Typography variant="h6">Заказ от {order.createdAt}</Typography>
                            </Grid>
                            <Grid item xs={4} sx={{ textAlign: 'right' }}>
                                <Typography variant="h6">
                                    {order.orderGoods.reduce((sum, item) => sum + item.quantity * 1000, 0)} {currency}
                                </Typography>
                                {isReturnAvailable(order) && status === OrderStatus.FINISHED && (
                                    <Button
                                        variant="outlined"
                                        onClick={() => {
                                            setSelectedOrder(order);
                                            setReturnModalOpen(true);
                                        }}
                                        sx={{ mt: 1 }}
                                    >
                                        Оформить возврат
                                    </Button>
                                )}
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="body2" color="textSecondary">
                                    Способ оплаты: {order.paymentMethod.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    Способ доставки: {order.deliveryMethod.name}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                    {order.orderGoods.map((orderGood) => {
                                        const good = goods.find(g => g.id === orderGood.goodId);
                                        if (!good) return null;

                                        return (
                                            <Link href={`/goods/${good.id}`} target='_blank' rel='noopener' key={orderGood.id}>
                                                <Avatar
                                                    variant='square'
                                                    sx={{ width: 56, height: 56 }}
                                                    src={`http://localhost:8080/files/images/${good.goodImages[0]?.image ?? emptyImage}`}
                                                    alt={`Product ${orderGood.goodId}`}
                                                />
                                            </Link>
                                        );
                                    })}
                                </Box>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}

            {selectedOrder && (
                <ReturnRequestModal
                    open={returnModalOpen}
                    onClose={() => setReturnModalOpen(false)}
                    onSubmit={handleSubmitReturn}
                    order={selectedOrder}
                    goods={goods.map(g => ({
                        id: g.id,
                        name: g.name,
                        image: g.goodImages[0]?.image
                    }))}
                    emptyImage={emptyImage}
                />
            )}
        </SidebarPageBox>
    );
};

export default OrdersPage;