import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';
import {Good, MarketplaceType, Order} from "../../../api";
import {orderStatuses} from "../../../constants.ts";
import {getMarketplaceType} from "../../../services";

interface OrderDetailsModalProps {
    order: Order;
    goods: Good[];
    onClose: () => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order, goods, onClose }) => {
    const marketplaceType = getMarketplaceType();

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>Детали заказа #{order.id}</DialogTitle>
            <DialogContent>
                <Typography variant="body1">Дата создания: {order.createdAt}</Typography>
                <Typography variant="body1">Статус: {orderStatuses.get(order.status)}</Typography>
                <Typography variant="body1">Комментарий к заказу: {order.comment}</Typography>

                <TableContainer component={Paper} style={{ marginTop: 16 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Название {marketplaceType === MarketplaceType.GOODS ? 'товара' : 'услуги'} </TableCell>
                                <TableCell>Количество</TableCell>
                                <TableCell>Цена</TableCell>
                                <TableCell>Стоимость</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {order.orderGoods.map((orderGood) => {
                                const relatedGood = goods.find(g => g.id === orderGood.goodId);
                                if (relatedGood) {
                                    return (
                                        <TableRow key={orderGood.id}>
                                            <TableCell>{relatedGood.name}</TableCell>
                                            <TableCell>{orderGood.quantity}</TableCell>
                                            <TableCell>{relatedGood.price}</TableCell>
                                            <TableCell>{orderGood.quantity * relatedGood.price}</TableCell>
                                        </TableRow>
                                    );
                                }
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">Закрыть</Button>
            </DialogActions>
        </Dialog>
    );
};

export default OrderDetailsModal;
