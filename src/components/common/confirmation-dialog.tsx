import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Typography } from '@mui/material';

interface ConfirmationDialogProps {
    open: boolean;
    title: string;
    infoMessage: string;
    onReject: () => void;
    onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({ open, title, infoMessage, onReject, onCancel }) => {
    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography variant="body1">{infoMessage}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onReject} color="primary">Подтвердить</Button>
                <Button onClick={onCancel} color="secondary">Отменить</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ConfirmationDialog;
