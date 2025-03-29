import React, {useEffect, useState} from 'react';
import {
    Box,
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
import {Link} from 'react-router-dom';
import {$orders, loadSellerOrders, Order, OrderStatus} from "../../api/models/orders.ts";
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from "@mui/x-date-pickers";
import {orderStatuses} from "../../constants.ts";
import {$store} from "../../api/models/store.ts";
import {useUnit} from "effector-react";
import {$allGoods, loadGoodById} from "../../api";

const OrdersList: React.FC = () => {
    const seller = useUnit($store);
    const orders = useUnit($orders);
    const goods = useUnit($allGoods);

    useEffect(() => {
        if (seller?.id && seller.id > 0) {
            loadSellerOrders({sellerId: seller.id});
        }
    }, [seller.id]);

    useEffect(() => {
        orders
            .flatMap(order => order.orderGoods)
            .map(orderGood => orderGood.goodId)
            .forEach((goodId) => loadGoodById({id: goodId}));
    }, [orders]);

    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'ALL'>('ALL');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

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
                        renderInput={(params) => <TextField {...params} fullWidth/>}
                    />
                    <DatePicker
                        label="Конечная дата"
                        value={endDate}
                        onChange={handleEndDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth/>}
                    />
                </LocalizationProvider>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер заказа</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Товары</TableCell>
                            <TableCell>Общая стоимость</TableCell>
                            <TableCell>Дата оформления</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>
                                    <Link to={`/orders/${order.id}`}>{order.id}</Link>
                                </TableCell>
                                <TableCell>{orderStatuses.get(order.status)}</TableCell>
                                <TableCell>
                                    {order.orderGoods.map((orderGood) => {
                                        const good = goods.find(g => g.id === orderGood.goodId);
                                        return <Typography>{good?.name}</Typography>
                                    })}
                                    {/*{order.orderGoods.map((og) => og.goodId).join(', ')}*/}
                                </TableCell>
                                <TableCell>{calculateTotalCost(order)}</TableCell>
                                <TableCell>{order.createdAt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default OrdersList;