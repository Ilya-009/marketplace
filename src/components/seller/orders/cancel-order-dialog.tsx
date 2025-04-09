import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

interface ConfirmationDialogProps {
    open: boolean;
    onReject: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, onReject, onCancel }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>Вы уверены, что хотите отменить заказ?</DialogTitle>
            <DialogContent>
                <Typography variant="body1">
                    При отмене заказа будут начислены штрафные баллы и появляется риск снижения рейтинга магазина.
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onReject} color="primary">Подтвердить</Button>
                <Button onClick={onCancel} color="secondary">Отменить</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
