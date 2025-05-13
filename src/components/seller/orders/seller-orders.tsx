import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {
    $allGoods,
    $orders,
    $store,
    changeOrderStatus,
    loadGoodsByIds,
    loadSellerOrders,
    MarketplaceType,
    Order,
    OrderStatus
} from "../../../api";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from "@mui/x-date-pickers";
import {getAvailableStatuses, orderStatuses} from "../../../constants.ts";
import {useUnit} from "effector-react";
import OrderDetailsModal from "./order-details-modal.tsx";
import {getMarketplaceType} from "../../../services";
import {limitString} from "../../../services/type-utils.ts";
import {OrderStatusModal} from "./change-order-status-modal.tsx";

const OrdersList: React.FC = () => {
    const seller = useUnit($store);
    const orders = useUnit($orders);
    const goods = useUnit($allGoods);
    const marketplaceType = getMarketplaceType();

    useEffect(() => {
        if (seller?.id && seller.id > 0) {
            loadSellerOrders({ sellerId: seller.id });
        }
    }, [seller.id]);

    useEffect(() => {
        const idsToLoad = orders
            .flatMap(order => order.orderGoods)
            .map(orderGood => orderGood.goodId);
        loadGoodsByIds({ids: idsToLoad});
    }, [orders]);

    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>(OrderStatus.CREATED);
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [openOrderModal, setOpenOrderModal] = useState<boolean>(false);  // Для открытия модального окна
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);  // Храним выбранный заказ
    const [statusModalOpen, setStatusModalOpen] = useState(false);

    useEffect(() => {
        const filtered = orders.filter((order) => {
            const matchesStatus = selectedStatus === 'ALL' || order.status === selectedStatus;
            const orderDate = new Date(order.createdAt);
            const matchesStartDate = startDate ? orderDate >= startDate : true;
            const matchesEndDate = endDate ? orderDate <= endDate : true;
            return matchesStatus && matchesStartDate && matchesEndDate;
        });
        setFilteredOrders(filtered);
    }, [selectedStatus, startDate, endDate, orders]);

    const handleStatusChange = (event: any) => {
        setSelectedStatus(event.target.value as OrderStatus | 'ALL');
    };

    const handleStartDateChange = (date: Date | null) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date: Date | null) => {
        setEndDate(date);
    };

    const calculateTotalCost = (order: Order): number => {
        return order.orderGoods.reduce((acc, orderGood) => {
            const good = goods.find(g => g.id === orderGood.goodId);
            return good ? acc + orderGood.quantity * good.price : acc;
        }, 0);
    };

    const handleOpenOrderModal = (order: Order) => {
        setSelectedOrder(order);
        setOpenOrderModal(true);
    };

    // Открытие модального окна
    const handleOpenStatusModal = (order: Order) => {
        setSelectedOrder(order);
        setStatusModalOpen(true);
    };

    // Подтверждение изменения статуса
    const handleStatusChangeConfirm = (newStatus: OrderStatus) => {
        if (selectedOrder) {
            changeOrderStatus({
                id: selectedOrder.id,
                status: newStatus
            });
            // console.log(selectedOrder);
        }
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Список заказов
            </Typography>
            <Box display="flex" gap={2} mb={2}>
                <FormControl>
                    <Select value={selectedStatus} onChange={handleStatusChange} variant='outlined'>
                        <MenuItem value="ALL">Все</MenuItem>
                        {[...orderStatuses.entries()].map(entry => (
                            <MenuItem key={entry[0]} value={entry[0]}>{entry[1]}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Начальная дата"
                        value={startDate}
                        onChange={handleStartDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                    <DatePicker
                        label="Конечная дата"
                        value={endDate}
                        onChange={handleEndDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер заказа</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>{marketplaceType === MarketplaceType.GOODS ? 'Товары' : 'Услуги'}</TableCell>
                            <TableCell>Общая стоимость</TableCell>
                            <TableCell>Дата оформления</TableCell>
                            <TableCell>Комментарий к заказу</TableCell>
                            <TableCell>Действия</TableCell> {/* Новый столбец */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{orderStatuses.get(order.status)}</TableCell>
                                <TableCell>
                                    {order.orderGoods.map((orderGood) => {
                                        const good = goods.find(g => g.id === orderGood.goodId);
                                        return <Typography key={orderGood.id}>{good?.name}</Typography>
                                    })}
                                </TableCell>
                                <TableCell>{calculateTotalCost(order)}</TableCell>
                                <TableCell>{order.createdAt}</TableCell>
                                <TableCell>{order.comment != null ? limitString(order.comment as string) : null}</TableCell>
                                <TableCell>
                                    <Button onClick={() => handleOpenOrderModal(order)} variant="contained" color="primary" size="small" style={{ marginRight: 8 }}>
                                        Детали
                                    </Button>
                                    {getAvailableStatuses(order.status, marketplaceType).length > 0 && (
                                        <Button
                                            onClick={() => handleOpenStatusModal(order)}
                                            variant="outlined"
                                            color="secondary"
                                            size="small"
                                        >
                                            Изменить статус
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {openOrderModal && selectedOrder && (
                <OrderDetailsModal
                    order={selectedOrder}
                    goods={goods}
                    onClose={() => setOpenOrderModal(false)}
                />
            )}

            {/* Модальное окно изменения статуса */}
            {selectedOrder && (
                <OrderStatusModal
                    open={statusModalOpen}
                    order={selectedOrder}
                    currentStatus={selectedOrder.status}
                    onClose={() => setStatusModalOpen(false)}
                    onConfirm={handleStatusChangeConfirm}
                    marketplaceType={marketplaceType}
                />
            )}
        </Box>
    );
};

export default OrdersList;