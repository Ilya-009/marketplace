import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Checkbox,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import {$allGoods, loadGoodById} from "../../../api";
import {$orders, loadSellerOrders, Order, OrderStatus} from "../../../api/models/orders.ts";
import {SidebarPageBox} from "../../common";
import {useUnit} from "effector-react";
import {$store} from "../../../api/models/store.ts";
import {createSupplyFx, SupplyGood} from "../../../api/models/supply.ts";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, {Dayjs} from 'dayjs';

type SelectedGood = SupplyGood & {
    selected: boolean;
}

const CreateSupply: React.FC = () => {
    const store = useUnit($store);
    const orders = useUnit($orders);
    const goods = useUnit($allGoods);

    const [selectedGoods, setSelectedGoods] = useState<SelectedGood[]>([]); // Выбранные товары для поставки
    const [deliveryDate, setDeliveryDate] = useState<Dayjs | null>(dayjs()); // Дата поставки
    const navigate = useNavigate();

    useEffect(() => {
        loadSellerOrders({sellerId: store.id});
    }, [store.id]);

    useEffect(() => {
        if (orders.length) {
            new Set(orders
                .flatMap(o => o.orderGoods)
                .map(og => og.goodId)
            ).forEach(goodId => loadGoodById({id: goodId}));
        }
    }, [orders]);

    // Функция для подсчета товаров, которые нужно поставить
    const calculateGoodsForSupply = (orders: Order[]): SelectedGood[] => {
        const goodsMap: { [key: number]: SelectedGood } = {};

        orders
            .filter(order => order.status === OrderStatus.CREATED)
            .forEach(order => {
                order.orderGoods.forEach(orderGood => {
                    if (goodsMap[orderGood.goodId]) {
                        goodsMap[orderGood.goodId].quantity += orderGood.quantity;
                    } else {
                        goodsMap[orderGood.goodId] = {
                            goodId: orderGood.goodId,
                            quantity: orderGood.quantity,
                            selected: false,
                        };
                    }
                });
            });

        return Object.values(goodsMap);
    };

    useEffect(() => {
        // Заполняем список товаров, которые можно выбрать для поставки
        setSelectedGoods(calculateGoodsForSupply(orders));
    }, [orders]);

    // Обработчик выбора товара
    const handleSelectGood = (goodId: number) => {
        setSelectedGoods(prevSelectedGoods =>
            prevSelectedGoods.map(good =>
                good.goodId === goodId ? { ...good, selected: !good.selected } : good
            )
        );
    };

    // Обработчик изменения даты поставки
    const handleDateChange = (value: Dayjs | null) => {
        setDeliveryDate(value);
    };

    // Обработчик создания поставки
    const handleCreateSupply = () => {
        const goodsToSupply = selectedGoods.filter(good => good.selected);

        if (goodsToSupply.length === 0) {
            alert('Выберите хотя бы один товар для поставки');
            return;
        }

        // Логика для создания поставки, можно передать данные на сервер
        createSupplyFx({
            storeId: store.id,
            supplyGoods: goodsToSupply,
            createdAt: deliveryDate?.toDate() as Date
        }).then(() => {
            // Редирект на список поставок
            navigate('/seller/supplies');
        })
    };

    const handleCancel = () => {
        navigate('/seller/supplies');
    };

    return (
        <SidebarPageBox sx={{width: '90%'}}>
            <Typography variant="h4" gutterBottom>
                Создание новой поставки
            </Typography>

            <Grid container spacing={2} mb={2}>
                <Grid item xs={12} md={6}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Дата поставки"
                            value={deliveryDate}
                            defaultValue={dayjs(new Date())}
                            onChange={handleDateChange}
                            renderInput={(params) => <TextField {...params} fullWidth />}
                        />
                    </LocalizationProvider>
                </Grid>
            </Grid>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Выбрать</TableCell>
                            <TableCell>Товар</TableCell>
                            <TableCell>Количество</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {selectedGoods.map(good => (
                            <TableRow key={good.goodId}>
                                <TableCell>
                                    <Checkbox
                                        checked={good.selected}
                                        onChange={() => handleSelectGood(good.goodId)}
                                    />
                                </TableCell>
                                <TableCell>{goods.find(g => g.id === good.goodId)?.name}</TableCell>
                                <TableCell>{good.quantity}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={handleCreateSupply}>
                    Создать поставку
                </Button>
                <Button variant="contained" color='warning' sx={{marginLeft: '20px'}} onClick={handleCancel}>
                    Отмена
                </Button>
            </Box>
        </SidebarPageBox>
    );
};

export default CreateSupply;
