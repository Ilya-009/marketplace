import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    Typography,
    Box,
    CircularProgress,
    Snackbar,
    Alert,
    TextField
} from '@mui/material';
import {loadPaymentMethodsFx, PaymentMethod, updatePaymentMethodsFx} from "../../api";
import {SidebarPageBox} from "../../components";

const PaymentMethodsPage: React.FC = () => {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    // Загрузка способов оплаты
    useEffect(() => {
        const fetchPaymentMethods = async () => {
            try {
                setLoading(true);
                // Здесь должен быть реальный запрос к API
                // const response = await fetch(API_URL);
                const data = await loadPaymentMethodsFx();
                setPaymentMethods(data);
            } catch (error) {
                showSnackbar('Ошибка при загрузке способов оплаты', 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchPaymentMethods();
    }, []);

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleNameChange = (id: number, newName: string) => {
        setPaymentMethods(paymentMethods.map(method =>
            method.id === id ? { ...method, name: newName } : method
        ));
    };

    const handleActiveChange = (id: number, isActive: boolean) => {
        // Проверяем, что остается хотя бы один активный способ
        const activeMethods = paymentMethods.filter(m => m.isActive).length;
        if (activeMethods <= 1 && !isActive) {
            showSnackbar('Должен оставаться хотя бы один активный способ оплаты', 'error');
            return;
        }

        setPaymentMethods(paymentMethods.map(method =>
            method.id === id ? { ...method, isActive } : method
        ));
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            await updatePaymentMethodsFx(paymentMethods);

            showSnackbar('Изменения успешно сохранены', 'success');
        } catch (error) {
            showSnackbar('Ошибка при сохранении изменений', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <SidebarPageBox sx={{width: '90%'}}>
            <Typography variant="h4" gutterBottom>
                Управление способами оплаты
            </Typography>
            <Typography variant="body1" paragraph>
                Измените название или активность способов оплаты. Должен оставаться хотя бы один активный способ.
            </Typography>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Название</TableCell>
                            <TableCell align="center">Активен</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paymentMethods.map((method) => (
                            <TableRow key={method.id}>
                                <TableCell>
                                    <TextField
                                        value={method.name}
                                        onChange={(e) => handleNameChange(method.id, e.target.value)}
                                        fullWidth
                                        variant="standard"
                                    />
                                </TableCell>
                                <TableCell align="center">
                                    <Checkbox
                                        checked={method.isActive}
                                        onChange={(e) => handleActiveChange(method.id, e.target.checked)}
                                        color="primary"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                variant="contained"
                color="primary"
                onClick={handleSave}
                disabled={saving}
                startIcon={saving ? <CircularProgress size={20} /> : null}
            >
                {saving ? 'Сохранение...' : 'Сохранить изменения'}
            </Button>

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

export default PaymentMethodsPage;