import {Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography} from '@mui/material';

type ConfirmModalProps = {
    title: string;
    content: string;
    cancelBtnText: string;
    submitBtnText: string;
    payload?: any;

    isOpen: boolean;
    onCancel: (payload: any | undefined) => void;
    onSubmit: (payload: any | undefined) => void;
};

export const ConfirmModal = ({
        title, content, cancelBtnText, submitBtnText, payload,
        isOpen, onCancel, onSubmit
    }: ConfirmModalProps) => {
    return (
        <Dialog open={isOpen} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Typography>{content}</Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onCancel(payload)}>{cancelBtnText}</Button>
                <Button onClick={() => onSubmit(payload)} color="error">{submitBtnText}</Button>
            </DialogActions>
        </Dialog>
    );
};