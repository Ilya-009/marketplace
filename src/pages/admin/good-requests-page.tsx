import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Link,
    Menu,
    MenuItem,
    Paper,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import {MoreVert as MoreVertIcon} from '@mui/icons-material';
import {
    $allGoods,
    getGoodRequestsFx,
    GoodRequest,
    GoodRequestStatus,
    loadGoodsByIds,
    MarketplaceType,
    updateGoodRequestFx,
} from "../../api";
import {SidebarPageBox} from "../../components";
import {getMarketplaceType} from "../../services";
import {useUnit} from "effector-react";
import {formatDateTime} from "../../services/type-utils.ts";

const GoodRequestsPage: React.FC = () => {
    const [requests, setRequests] = useState<GoodRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedRequest, setSelectedRequest] = useState<GoodRequest | null>(null);
    const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const marketplaceType = getMarketplaceType();
    const unhandledGoods = useUnit($allGoods);

    const fetchRequests = async () => {
        try {
            setLoading(true);
            const response = await getGoodRequestsFx();
            const requests = response.filter(rq => rq.status === GoodRequestStatus.UNHANDLED);
            const goodIds = requests.map(rq => rq.goodId);
            loadGoodsByIds({ids: goodIds});
            setRequests(requests);
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

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, request: GoodRequest) => {
        setAnchorEl(event.currentTarget);
        setSelectedRequest(request);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedRequest(null);
    };

    const handleRejectClick = () => {
        setRejectionDialogOpen(true);
        setAnchorEl(null);
    };

    const handleRejectionDialogClose = () => {
        setRejectionDialogOpen(false);
        setRejectionReason('');
        setSelectedRequest(null);
    };

    const updateStatus = async (newStatus: GoodRequestStatus, reason?: string) => {
        if (!selectedRequest) return;

        try {
            setLoading(true);
            await updateGoodRequestFx({
                id: selectedRequest.id,
                status: newStatus,
                comment: reason
            })

            const updatedRequest = {
                ...selectedRequest,
                status: newStatus,
                rejectionReason: reason
            };

            setRequests(requests.map(req =>
                req.id === selectedRequest.id ? updatedRequest : req
            ));

            showSnackbar(
                newStatus === GoodRequestStatus.APPROVED
                    ? 'Заявка одобрена'
                    : 'Заявка отклонена',
                'success'
            );
        } catch (err) {
            showSnackbar('Ошибка при обновлении статуса', 'error');
        } finally {
            setLoading(false);
            handleRejectionDialogClose();
        }
    };

    return (
        <SidebarPageBox sx={{width: '90%'}}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Запросы на создание и изменение товаров</Typography>
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
                                <TableCell>{marketplaceType === MarketplaceType.GOODS ? 'Товар' : 'Услуга'}</TableCell>
                                <TableCell>Дата создания</TableCell>
                                <TableCell>Действия</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.map((request) => {
                                const good = unhandledGoods.find(g => g.id === request.goodId);
                                return (
                                    <TableRow key={request.id}>
                                        <TableCell>{request.id}</TableCell>
                                        <TableCell>
                                            <Link href={'/goods/' + request.goodId} target='_blank' rel='noopener'>
                                                {good?.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{formatDateTime(new Date(request.createdAt))}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={(e) => handleMenuOpen(e, request)}
                                                disabled={loading}
                                            >
                                                <MoreVertIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
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
                <MenuItem onClick={() => {
                    updateStatus(GoodRequestStatus.APPROVED);
                    handleMenuClose();
                }}>
                    Одобрить
                </MenuItem>
                <MenuItem onClick={handleRejectClick}>
                    Отклонить
                </MenuItem>
            </Menu>

            {/* Диалог отклонения с указанием причины */}
            <Dialog
                open={rejectionDialogOpen}
                onClose={handleRejectionDialogClose}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Отклонить заявку</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Укажите причину отклонения заявки:
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Причина отклонения"
                        type="text"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={4}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleRejectionDialogClose}>Отмена</Button>
                    <Button
                        onClick={() => updateStatus(GoodRequestStatus.REJECTED, rejectionReason)}
                        color="error"
                        disabled={!rejectionReason.trim()}
                    >
                        Отклонить
                    </Button>
                </DialogActions>
            </Dialog>

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

export default GoodRequestsPage;