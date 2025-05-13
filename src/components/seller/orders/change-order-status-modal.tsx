import React from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from '@mui/material';
import {MarketplaceType, Order, OrderStatus} from "../../../api";
import {getAvailableStatuses, orderStatuses} from "../../../constants.ts";

interface OrderStatusModalProps {
    open: boolean;
    order: Order | null;
    currentStatus: OrderStatus;
    onClose: () => void;
    onConfirm: (newStatus: OrderStatus) => void;
    marketplaceType: MarketplaceType;
}

export const OrderStatusModal: React.FC<OrderStatusModalProps> = ({
                                                                      open,
                                                                      order,
                                                                      currentStatus,
                                                                      onClose,
                                                                      onConfirm,
                                                                      marketplaceType
                                                                  }) => {
    const [selectedStatus, setSelectedStatus] = React.useState<OrderStatus>(currentStatus);
    const [rejectConfirmOpen, setRejectConfirmOpen] = React.useState(false);

    React.useEffect(() => {
        setSelectedStatus(currentStatus);
    }, [currentStatus]);

    const handleStatusChange = (event: SelectChangeEvent<OrderStatus>) => {
        setSelectedStatus(event.target.value as OrderStatus);
    };

    const handleConfirm = () => {
        if (selectedStatus === OrderStatus.REJECTED) {
            setRejectConfirmOpen(true);
        } else {
            onConfirm(selectedStatus);
            onClose();
        }
    };

    const handleRejectConfirm = () => {
        onConfirm(OrderStatus.REJECTED);
        onClose();
        setRejectConfirmOpen(false);
    };

    const availableStatuses = getAvailableStatuses(currentStatus, marketplaceType);

    return (
        <>
            <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    Изменение статуса заказа #{order?.id}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, mb: 3 }}>
                        <Typography gutterBottom>
                            Текущий статус: <strong>{orderStatuses.get(currentStatus)}</strong>
                        </Typography>
                    </Box>

                    <FormControl fullWidth>
                        <InputLabel>Новый статус</InputLabel>
                        <Select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            label="Новый статус"
                        >
                            {availableStatuses.map(status => (
                                <MenuItem
                                    key={status}
                                    value={status}
                                >
                                    {orderStatuses.get(status)}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} color="error">
                        Отмена
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        color="primary"
                        disabled={!selectedStatus || selectedStatus === currentStatus}
                    >
                        Подтвердить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог подтверждения для отклонения заказа */}
            <Dialog
                open={rejectConfirmOpen}
                onClose={() => setRejectConfirmOpen(false)}
            >
                <DialogTitle>Подтверждение отклонения заказа</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите отклонить заказ #{order?.id}?
                        Это действие может повлиять на ваш рейтинг.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectConfirmOpen(false)}>
                        Отмена
                    </Button>
                    <Button
                        onClick={handleRejectConfirm}
                        color="error"
                        variant="contained"
                    >
                        Отклонить заказ
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};