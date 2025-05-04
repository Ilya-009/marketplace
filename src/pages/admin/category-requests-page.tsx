import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Typography,
    Box,
    Chip,
    Menu,
    MenuItem,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { MoreVert as MoreVertIcon } from '@mui/icons-material';
import {CategoryRequest, CategoryRequestStatus, getCategoryRequestFx, updateCategoryRequestFx} from "../../api";
import CreateCategoryRequestModal from "../../components/good/create-category-request-modal.tsx";
import {SidebarPageBox} from "../../components";

const statusColors = {
    [CategoryRequestStatus.NEW]: 'default',
    [CategoryRequestStatus.IN_PROGRESS]: 'primary',
    [CategoryRequestStatus.FINISHED]: 'success',
    [CategoryRequestStatus.DENIED]: 'error'
};

const statusLabels = {
    [CategoryRequestStatus.NEW]: 'Новая',
    [CategoryRequestStatus.IN_PROGRESS]: 'В работе',
    [CategoryRequestStatus.FINISHED]: 'Завершена',
    [CategoryRequestStatus.DENIED]: 'Отклонена'
};

const CategoryRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<CategoryRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [modalOpen, setModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRequest, setSelectedRequest] = useState<CategoryRequest | null>(null);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await getCategoryRequestFx();
            setRequests(response);
        } catch (err) {
            setError('Не удалось загрузить заявки');
            showSnackbar('Ошибка при загрузке заявок', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, request: CategoryRequest) => {
        setAnchorEl(event.currentTarget);
        setSelectedRequest(request);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRequest(null);
    };

    const updateStatus = async (newStatus: CategoryRequestStatus) => {
        if (!selectedRequest) return;

        try {
            setLoading(true);
            const response = await updateCategoryRequestFx({id: selectedRequest.id, status: newStatus});

            setRequests(requests.map(req =>
                req.id === selectedRequest.id ? response : req
            ));
            showSnackbar('Статус заявки обновлен', 'success');
        } catch (err) {
            showSnackbar('Ошибка при обновлении статуса', 'error');
        } finally {
            setLoading(false);
            handleMenuClose();
        }
    };

    const handleCreateSuccess = (newRequest: CategoryRequest) => {
        setRequests([newRequest, ...requests]);
        showSnackbar('Заявка успешно создана', 'success');
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('ru-RU');
    };

    return (
        <SidebarPageBox sx={{width: '90%'}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Заявки на категории</Typography>
            </Box>

            {loading && requests.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Название категории</TableCell>
                                <TableCell>Причина</TableCell>
                                <TableCell>Статус</TableCell>
                                <TableCell>Дата создания</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((request) => (
                                <TableRow key={request.id}>
                                    <TableCell>{request.id}</TableCell>
                                    <TableCell>{request.categoryName}</TableCell>
                                    <TableCell>{request.reason}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={statusLabels[request.status]}
                                            color={statusColors[request.status]}
                                        />
                                    </TableCell>
                                    <TableCell>{formatDate(request.createdAt.toString())}</TableCell>
                                    <TableCell>
                                        <IconButton
                                            onClick={(e) => handleMenuOpen(e, request)}
                                            disabled={loading}
                                        >
                                            <MoreVertIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Меню изменения статуса */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem
                    onClick={() => updateStatus(CategoryRequestStatus.IN_PROGRESS)}
                    disabled={selectedRequest?.status !== CategoryRequestStatus.NEW}
                >
                    Перевести в работу
                </MenuItem>
                <MenuItem
                    onClick={() => updateStatus(CategoryRequestStatus.FINISHED)}
                    disabled={selectedRequest?.status === CategoryRequestStatus.FINISHED}
                >
                    Завершить
                </MenuItem>
                <MenuItem
                    onClick={() => updateStatus(CategoryRequestStatus.DENIED)}
                    disabled={selectedRequest?.status === CategoryRequestStatus.DENIED}
                >
                    Отклонить
                </MenuItem>
            </Menu>

            {/* Модальное окно создания заявки */}
            <CreateCategoryRequestModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onSuccess={handleCreateSuccess}
            />

            {/* Уведомления */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </SidebarPageBox>
    );
};

export default CategoryRequestsPage;