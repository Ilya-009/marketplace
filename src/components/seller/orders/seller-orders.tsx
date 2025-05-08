import React, {useEffect, useState} from 'react';
import {
    Box, Button,
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
import {$orders, loadSellerOrders, MarketplaceType, Order, OrderStatus} from "../../../api";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from "@mui/x-date-pickers";
import {orderStatuses} from "../../../constants.ts";
import {$store} from "../../../api";
import {useUnit} from "effector-react";
import {$allGoods, loadGoodsByIds} from "../../../api";
import OrderDetailsModal from "./order-details-modal.tsx";
import ConfirmationDialog from "../../common/confirmation-dialog.tsx";
import {getMarketplaceType} from "../../../services";
import {limitString} from "../../../services/type-utils.ts";

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
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [openOrderModal, setOpenOrderModal] = useState<boolean>(false);  // Для открытия модального окна
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);  // Храним выбранный заказ
    const [openConfirmationDialog, setOpenConfirmationDialog] = useState<boolean>(false); // Окно подтверждения
    const [orderToReject, setOrderToReject] = useState<Order | null>(null); // Заказ для отклонения

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

    const handleOpenConfirmationDialog = (order: Order) => {
        setOrderToReject(order);
        setOpenConfirmationDialog(true);
    };

    const handleRejectOrder = () => {
        if (orderToReject) {
            // Логика для отклонения заказа
            console.log(`Заказ ${orderToReject.id} отклонен`);
            setOpenConfirmationDialog(false);
            setOrderToReject(null);
        }
    };

    const handleCancelConfirmation = () => {
        setOpenConfirmationDialog(false);
        setOrderToReject(null);
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
                                    <Button onClick={() => handleOpenConfirmationDialog(order)} variant="outlined" color="error" size="small">
                                        Отклонить
                                    </Button>
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

            {openConfirmationDialog && orderToReject && (
                <ConfirmationDialog
                    open={openConfirmationDialog}
                    title='Вы уверены, что хотите отменить заказ?'
                    infoMessage='При отмене заказа будут начислены штрафные баллы и появляется риск снижения рейтинга магазина.'
                    onReject={handleRejectOrder}
                    onCancel={handleCancelConfirmation}
                />
            )}
        </Box>
    );
};

export default OrdersList;