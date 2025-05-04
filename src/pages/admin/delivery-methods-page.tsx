import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Box,
    Typography,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import {
    createDeliveryMethodFx,
    deleteDeliveryMethodFx,
    DeliveryMethod,
    loadDeliveryMethodsFx,
    updateDeliveryMethodFx
} from "../../api";
import {SidebarPageBox} from "../../components";

const DeliveryMethodsPage: React.FC = () => {
    const [methods, setMethods] = useState<DeliveryMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [currentMethod, setCurrentMethod] = useState<Partial<DeliveryMethod>>({});
    const [isEditing, setIsEditing] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Загрузка данных
    useEffect(() => {
        fetchMethods();
    }, []);

    const fetchMethods = async () => {
        try {
            setLoading(true);
            const data = await loadDeliveryMethodsFx();
            setMethods(data);
        } catch (error) {
            showSnackbar('Ошибка загрузки способов доставки', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenAddDialog = () => {
        setCurrentMethod({
            name: '',
            price: 0,
            minOrderSum: 0
        });
        setIsEditing(false);
        setOpenDialog(true);
    };

    const handleOpenEditDialog = (method: DeliveryMethod) => {
        setCurrentMethod({ ...method });
        setIsEditing(true);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCurrentMethod(prev => ({
            ...prev,
            [name]: name === 'name' ? value : Number(value)
        }));
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            if (isEditing) {
                await updateDeliveryMethodFx(currentMethod as DeliveryMethod);
            } else {
                await createDeliveryMethodFx({
                    name: currentMethod.name as string,
                    price: currentMethod.price as number,
                    minOrderSum: currentMethod.minOrderSum as number
                });
            }

            showSnackbar(
                isEditing
                    ? 'Способ доставки обновлен'
                    : 'Способ доставки добавлен',
                'success'
            );
            fetchMethods();
            handleCloseDialog();
        } catch (error) {
            showSnackbar('Ошибка при сохранении', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            setLoading(true);
            await deleteDeliveryMethodFx({id: id});

            showSnackbar('Способ доставки удален', 'success');
            fetchMethods();
        } catch (error) {
            showSnackbar('Ошибка при удалении', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <SidebarPageBox sx={{width: '90%'}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Способы доставки</Typography>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={handleOpenAddDialog}
                >
                    Добавить способ
                </Button>
            </Box>

            {loading && methods.length === 0 ? (
                <CircularProgress />
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Название</TableCell>
                                <TableCell align="right">Стоимость</TableCell>
                                <TableCell align="right">Мин. сумма заказа</TableCell>
                                <TableCell align="center">Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {methods.map((method) => (
                                <TableRow key={method.id}>
                                    <TableCell>{method.name}</TableCell>
                                    <TableCell align="right">{method.price} ₽</TableCell>
                                    <TableCell align="right">{method.minOrderSum} ₽</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleOpenEditDialog(method)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => handleDelete(method.id)}
                                            color="error"
                                        >
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Диалог добавления/редактирования */}
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>
                    {isEditing ? 'Редактирование способа доставки' : 'Добавление способа доставки'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            label="Название"
                            name="name"
                            value={currentMethod.name || ''}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Стоимость доставки (₽)"
                            name="price"
                            type="number"
                            value={currentMethod.price || 0}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Минимальная сумма заказа (₽)"
                            name="minOrderSum"
                            type="number"
                            value={currentMethod.minOrderSum || 0}
                            onChange={handleInputChange}
                            fullWidth
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Отмена</Button>
                    <Button
                        onClick={handleSubmit}
                        variant="contained"
                        disabled={loading || !currentMethod.name}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Сохранить'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Уведомления */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={handleCloseSnackbar}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SidebarPageBox>
    );
};

export default DeliveryMethodsPage;