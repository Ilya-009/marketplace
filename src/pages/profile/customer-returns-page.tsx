import React, {useEffect, useMemo, useState} from "react";
import {SidebarPageBox} from "../../components";
import {useUnit} from "effector-react";
import {$customer, $returns, cancelReturn, loadCustomerReturns, ReturnReason, ReturnStatus} from "../../api";
import {
    Box, Button,
    FormControl,
    InputLabel, Link,
    MenuItem,
    Paper,
    Select,
    Table, TableBody, TableCell,
    TableContainer,
    TableHead, TableRow,
    Typography
} from "@mui/material";
import {returnReasons, returnStatuses} from "../../constants.ts";
import {ConfirmModal} from "../../components/common/confirm-modal.tsx";

const CustomerReturnsPage: React.FC = () => {
    const customer = useUnit($customer); // текущий покупатель
    const returns = useUnit($returns); // все возвраты
    const [selectedStatus, setSelectedStatus] = useState<ReturnStatus | 'ALL'>('ALL');
    const [selectedReason, setSelectedReason] = useState<ReturnReason | 'ALL'>('ALL');
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [cancelPayload, setCancelPayload] = useState<number | null>(null); // ID возврата

    useEffect(() => {
        if (customer?.id) {
            loadCustomerReturns({ customerId: customer.id });
        }
    }, [customer]);

    const filteredReturns = useMemo(() => {
        return returns.filter((r) => {
            const matchStatus = selectedStatus === 'ALL' || r.returnStatus === selectedStatus;
            const matchReason = selectedReason === 'ALL' || r.returnReason === selectedReason;
            return matchStatus && matchReason;
        });
    }, [returns, selectedStatus, selectedReason]);

    const handleOpenConfirmModal = (returnId: number) => {
        setCancelPayload(returnId);
        setConfirmModalOpen(true);
    };

    const handleCancelConfirm = () => {
        setConfirmModalOpen(false);
        setCancelPayload(null);
    };

    const handleCancelSubmit = (returnId: number) => {
        cancelReturn({returnId: returnId});
        setConfirmModalOpen(false);
        setCancelPayload(null);
    };

    return (
        <SidebarPageBox sx={{ width: '90%' }}>
            <Typography variant="h4" gutterBottom>
                Мои возвраты
            </Typography>

            <Box display="flex" gap={2} mb={2}>
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Статус</InputLabel>
                    <Select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as ReturnStatus | 'ALL')}
                    >
                        <MenuItem value="ALL">Все</MenuItem>
                        {[...returnStatuses.entries()].map(([value, label]) => (
                            <MenuItem key={value} value={value}>
                                {label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Причина</InputLabel>
                    <Select
                        value={selectedReason}
                        onChange={(e) => setSelectedReason(e.target.value as ReturnReason | 'ALL')}
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
                            <TableCell>ID</TableCell>
                            <TableCell>Товар</TableCell>
                            <TableCell>Дата запроса</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Причина</TableCell>
                            <TableCell>Комментарий</TableCell>
                            <TableCell>Комментарий продавца</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredReturns.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.id}</TableCell>
                                <TableCell>
                                    <Link href={'/goods/' + r.goodId} target='_blank' rel='noopener'>
                                        {r.goodName}
                                    </Link>
                                </TableCell>
                                <TableCell>{new Date(r.requestDate).toLocaleDateString()}</TableCell>
                                <TableCell>{returnStatuses.get(r.returnStatus)}</TableCell>
                                <TableCell>{returnReasons.get(r.returnReason)}</TableCell>
                                <TableCell>{r.comment || '-'}</TableCell>
                                <TableCell>{r.sellerComment || '—'}</TableCell>
                                <TableCell>
                                    {r.returnStatus === ReturnStatus.REQUESTED && (
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleOpenConfirmModal(r.id)}
                                        >
                                            Отменить
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ConfirmModal
                isOpen={confirmModalOpen}
                title="Отменить возврат"
                content="Вы уверены, что хотите отменить запрос на возврат?"
                cancelBtnText="Отмена"
                submitBtnText="Подтвердить"
                payload={cancelPayload}
                onCancel={handleCancelConfirm}
                onSubmit={(payload) => payload && handleCancelSubmit(payload)}
            />
        </SidebarPageBox>
    );
};

export default CustomerReturnsPage;