import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    FormControl,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {$supplies, loadSuppliesByStore, SupplyStatus, updateSupplyFx} from "../../../api/models/supply.ts";
import {EditProfileLink, SidebarPageBox} from "../../../components";
import {useUnit} from "effector-react";
import {$store} from "../../../api/models/store.ts";
import {supplyStatuses} from "../../../constants.ts";
import {$allGoods, loadGoodsByIds} from "../../../api";
import ConfirmationDialog from "../../../components/common/confirmation-dialog.tsx";
import {useNavigate} from "react-router-dom";

const SuppliesList: React.FC = () => {
    const store = useUnit($store);
    const supplies = useUnit($supplies);
    const goods = useUnit($allGoods);
    const navigate = useNavigate();

    const [selectedStatus, setSelectedStatus] = useState<SupplyStatus | 'ALL'>('ALL'); // Состояние для выбранного статуса
    const [cancelDialogOpen, setCancelDialogOpen] = useState<boolean>(false);
    const [canceledSupplyId, setCanceledSupplyId] = useState<number | undefined>();

    // Фильтруем поставки по статусу
    const filteredSupplies = selectedStatus === 'ALL'
        ? supplies
        : supplies.filter(supply => supply.status === selectedStatus);

    // Загружаем поставки при монтировании компонента
    useEffect(() => {
        loadSuppliesByStore({storeId: store.id});
    }, [store.id]);
    useEffect(() => {
        const goodIds = [...new Set(supplies
            .flatMap(o => o.supplyGoods)
            .map(og => og.goodId)
        )];
        loadGoodsByIds({ids: goodIds});
    }, [supplies]);

    // Обработчик изменения выбранного статуса
    const handleStatusChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedStatus(event.target.value as SupplyStatus | 'ALL');
    };

    const cancelSupplyBtnHandler = (supplyId: number) => {
        setCancelDialogOpen(true);
        setCanceledSupplyId(supplyId);
    };
    const handleCancelSupply = () => {
        setCancelDialogOpen(false);
        setCanceledSupplyId(undefined);

        // Отправка запроса на отклонение поставки
        const changedSupply = supplies.find(s => s.id === canceledSupplyId);
        if (changedSupply) {
            changedSupply.status = SupplyStatus.CANCELLED;
            updateSupplyFx({updatedSupply: changedSupply}).then(() => {
                navigate('/seller/supplies');
            });
        }

    };
    const handleRejectCancellation = () => {
        setCancelDialogOpen(false);
        setCanceledSupplyId(undefined);
    };

    return (
        <SidebarPageBox sx={{width: '90%'}}>
            <Typography variant="h4" gutterBottom>
                Список поставок
            </Typography>
            <Box display="flex" gap={2} mb={2}>
                <FormControl>
                    <Select value={selectedStatus} onChange={handleStatusChange} variant="outlined">
                        <MenuItem value="ALL">Все</MenuItem>
                        <MenuItem value={SupplyStatus.PENDING}>Ожидает</MenuItem>
                        <MenuItem value={SupplyStatus.COMPLETED}>Завершена</MenuItem>
                        <MenuItem value={SupplyStatus.CANCELLED}>Отменена</MenuItem>
                    </Select>
                </FormControl>
                <Button variant="contained" color="primary" href='/seller/supplies/new'>
                    Создать новую поставку
                </Button>
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Номер поставки</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Товары</TableCell>
                            <TableCell>Дата создания поставки</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredSupplies.map((supply) => (
                            <TableRow key={supply.id}>
                                <TableCell>{supply.id}</TableCell>
                                <TableCell>{supplyStatuses.get(supply.status)}</TableCell>
                                <TableCell>
                                    {supply.supplyGoods.map((supplyGood, index) => {
                                        const good = goods.find(g => g.id === supplyGood.goodId);
                                        return (
                                            <Typography key={index}>
                                                <EditProfileLink href={`/goods/${supplyGood.goodId}`}>{good?.name}</EditProfileLink>,
                                                Количество: {supplyGood.quantity}
                                            </Typography>
                                        );
                                    })}
                                </TableCell>
                                <TableCell>{supply.createdAt}</TableCell>
                                <TableCell>
                                    {supply.status === SupplyStatus.PENDING &&
                                        <Button onClick={() => cancelSupplyBtnHandler(supply.id)} variant="outlined" color="error" size="small">
                                            Отменить поставку
                                        </Button>
                                    }
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <ConfirmationDialog
                open={cancelDialogOpen}
                title='Вы уверены, что хотите отменить поставку?'
                infoMessage='При отмене поставки доставка заказчику может задержаться'
                onReject={handleCancelSupply}
                onCancel={handleRejectCancellation}
            />
        </SidebarPageBox>
    );
};

export default SuppliesList;
