import React, {useState, useEffect, useMemo} from "react";
import {
    Button,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Typography, Link
} from "@mui/material";
import {$store, loadSellerReturnsFx, ReturnReason, ReturnRequest, ReturnStatus} from "../../api";
import {returnReasons, returnStatuses} from "../../constants.ts";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {SidebarPageBox} from "../../components";
import {useUnit} from "effector-react";

const SellerReturnsPage: React.FC = () => {
    const store = useUnit($store);

    const [returns, setReturns] = useState<ReturnRequest[]>([]); // Массив всех возвратов
    const [selectedStatus, setSelectedStatus] = useState<ReturnStatus | 'ALL'>('ALL');
    const [selectedReason, setSelectedReason] = useState<ReturnReason | 'ALL'>('ALL');
    const [selectedReturn, setSelectedReturn] = useState<ReturnRequest | null>(null); // Выбранный возврат для обработки
    const [comment, setComment] = useState<string>(''); // Комментарий продавца
    const [isModalOpen, setIsModalOpen] = useState(false); // Статус открытия модального окна
    const [actionType, setActionType] = useState<'approve' | 'reject'>('approve'); // Тип действия (одобрить или отклонить)

    // Эмуляция получения данных с сервера
    useEffect(() => {
        loadSellerReturnsFx({sellerId: store.id}).then((returns => setReturns(returns)));
    }, [store.id]);

    const handleOpenModal = (returnRequest: ReturnRequest, action: 'approve' | 'reject') => {
        setSelectedReturn(returnRequest);
        setActionType(action);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedReturn(null);
        setComment('');
    };

    const handleStatusChange = (status: ReturnStatus) => {
        setSelectedStatus(status);
    };

    const handleReasonChange = (reason: ReturnReason) => {
        setSelectedReason(reason);
    };

    const handleApprove = () => {
        if (selectedReturn) {
            // Логика для отправки решения на сервер (API) — одобрение
            console.log(`Решение: APPROVED для возврата с ID ${selectedReturn.id} и комментарием: ${comment}`);
            setIsModalOpen(false); // Закрытие модального окна
            setSelectedReturn(null);
            setComment('');
        }
    };

    const handleReject = () => {
        if (selectedReturn) {
            // Логика для отправки решения на сервер (API) — отклонение
            console.log(`Решение: REJECTED для возврата с ID ${selectedReturn.id} и комментарием: ${comment}`);
            setIsModalOpen(false); // Закрытие модального окна
            setSelectedReturn(null);
            setComment('');
        }
    };

    const filteredReturns = useMemo(() => {
        return returns.filter((r) => {
            const matchStatus = selectedStatus === 'ALL' || r.returnStatus === selectedStatus;
            const matchReason = selectedReason === 'ALL' || r.returnReason === selectedReason;
            return matchStatus && matchReason;
        });
    }, [returns, selectedStatus, selectedReason]);

    return (
        <SidebarPageBox sx={{ width: '90%' }}>
            <Typography variant="h4" gutterBottom>
                Возвраты товаров
            </Typography>

            <Box display="flex" gap={2} mb={2}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Статус</InputLabel>
                    <Select
                        value={selectedStatus}
                        label="Статус"
                        onChange={(e) => handleStatusChange(e.target.value as ReturnStatus)}
                    >
                        <MenuItem value="ALL">Все</MenuItem>
                        {[...returnStatuses.entries()].map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 250 }}>
                    <InputLabel>Причина</InputLabel>
                    <Select
                        value={selectedReason}
                        label="Причина"
                        onChange={(e) => handleReasonChange(e.target.value as ReturnReason)}
                    >
                        <MenuItem value="ALL">Все</MenuItem>
                        {[...returnReasons.entries()].map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Фото пользователя</TableCell>
                            <TableCell>Товар</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Причина</TableCell>
                            <TableCell>Комментарий покупателя</TableCell>
                            <TableCell>Комментарий продавца</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReturns.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>
                                    {r.photoUrls && r.photoUrls.map((url, index) => (
                                        <img key={index}
                                             src={`http://localhost:8080/files/images/${url}`}
                                             alt={`Фото ${index}`}
                                             height={150} />
                                    ))}
                                </TableCell>
                                <TableCell>
                                    <Link href={'/goods/' + r.goodId} target='_blank' rel='noopener'>
                                        {r.goodName}
                                    </Link>
                                </TableCell>
                                <TableCell>{returnStatuses.get(r.returnStatus)}</TableCell>
                                <TableCell>{returnReasons.get(r.returnReason)}</TableCell>
                                <TableCell>{r.comment}</TableCell>
                                <TableCell>{r.sellerComment || '-'}</TableCell>
                                <TableCell>
                                    {r.returnStatus === ReturnStatus.REQUESTED && (
                                        <>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={() => handleOpenModal(r, 'approve')}
                                                style={{ marginRight: 8 }}
                                            >
                                                Одобрить
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                color="error"
                                                onClick={() => handleOpenModal(r, 'reject')}
                                            >
                                                Отклонить
                                            </Button>
                                        </>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Модальное окно для ввода комментария и подтверждения действия */}
            <Dialog open={isModalOpen} onClose={handleCloseModal}>
                <DialogTitle>
                    {actionType === 'approve' ? 'Одобрить возврат' : 'Отклонить возврат'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        label="Комментарий продавца"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        fullWidth
                        multiline
                        rows={4}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal}>Отмена</Button>
                    <Button
                        onClick={actionType === 'approve' ? handleApprove : handleReject}
                        color="primary"
                    >
                        Подтвердить
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarPageBox>
    );
};

export default SellerReturnsPage;
