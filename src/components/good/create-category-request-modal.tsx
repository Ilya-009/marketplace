import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    CircularProgress
} from '@mui/material';
import {
    CategoryRequest,
    createNewCategoryRequestFx,
    CreateNewCategoryRequestParam
} from "../../api";

interface CreateCategoryRequestModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: (newRequest: CategoryRequest) => void;
}

const CreateCategoryRequestModal: React.FC<CreateCategoryRequestModalProps> = ({open, onClose, onSuccess}) => {
    const [requestData, setRequestData] = useState<CreateNewCategoryRequestParam>({
        categoryName: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setRequestData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async () => {
        if (!requestData.categoryName.trim() || !requestData.reason.trim()) {
            setError('Все поля обязательны для заполнения');
            return;
        }

        try {
            setLoading(true);
            setError('');

            const request = await createNewCategoryRequestFx(requestData);

            if (onSuccess) {
                onSuccess(request);
            }

            handleClose();
        } catch (err) {
            setError('Ошибка при создании заявки. Попробуйте позже.');
            console.error('Error creating category requestData:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setRequestData({
            categoryName: '',
            reason: ''
        });
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Создание заявки на новую категорию</DialogTitle>
            <DialogContent>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                    <TextField
                        label="Название категории"
                        name="categoryName"
                        value={requestData.categoryName}
                        onChange={handleChange}
                        fullWidth
                        required
                    />
                    <TextField
                        label="Причина создания"
                        name="reason"
                        value={requestData.reason}
                        onChange={handleChange}
                        fullWidth
                        required
                        multiline
                        rows={4}
                    />

                    {error && (
                        <Typography color="error" variant="body2">
                            {error}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={loading}>
                    Отмена
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                >
                    {loading ? 'Отправка...' : 'Создать заявку'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreateCategoryRequestModal;