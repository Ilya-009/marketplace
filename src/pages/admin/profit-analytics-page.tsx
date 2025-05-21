import React, {useEffect, useMemo, useState} from 'react';
import { useUnit } from 'effector-react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    TableFooter,
    IconButton, Card, CardContent,
} from '@mui/material';
import {$profitData, loadMarketplaceProfitFx} from "../../api";
import {ArrowBack, ArrowForward, ListAlt, MonetizationOn} from "@mui/icons-material";

const PAGE_SIZE = 10;

const ProfitAnalyticsPage: React.FC = () => {
    const profits = useUnit($profitData);
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());
    const [page, setPage] = useState(0);

    useEffect(() => {
        if (startDate && endDate) {
            loadMarketplaceProfitFx({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            });
        }
    }, [endDate, startDate]);

    useEffect(() => {
        setPage(0); // сброс страницы при загрузке новых данных
    }, [profits]);

    const paginatedData = useMemo(() => {
        const start = page * PAGE_SIZE;
        return profits.slice(start, start + PAGE_SIZE);
    }, [profits, page]);

    const totalProfit = useMemo(
        () => profits.reduce((sum, p) => sum + Number(p.marketplaceProfit), 0),
        [profits]
    );

    return (
        <Box sx={{ width: '90%', mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                Прибыль маркетплейса
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box mb={3} display="flex" gap={2} alignItems="center">
                    <DatePicker label="C" value={startDate} onChange={setStartDate} />
                    <DatePicker label="По" value={endDate} onChange={setEndDate} />
                </Box>
            </LocalizationProvider>

            {/* Сводка */}
            <Box mb={4}>
                <Box display="flex" flexWrap="wrap" gap={2}>
                    <Card sx={{ minWidth: 220, flex: '1 1 220px', bgcolor: '#e3f2fd' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <ListAlt color="primary" />
                                <Typography variant="subtitle2" color="textSecondary">
                                    Всего заказов
                                </Typography>
                            </Box>
                            <Typography variant="h5">{profits.length}</Typography>
                        </CardContent>
                    </Card>

                    <Card sx={{ minWidth: 220, flex: '1 1 220px', bgcolor: '#f1f8e9' }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" gap={1} mb={1}>
                                <MonetizationOn color="success" />
                                <Typography variant="subtitle2" color="textSecondary">
                                    Общая прибыль
                                </Typography>
                            </Box>
                            <Typography variant="h5">{totalProfit.toLocaleString()} ₽</Typography>
                        </CardContent>
                    </Card>
                </Box>
            </Box>

            {/* Таблица с пагинацией */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID заказа</TableCell>
                            <TableCell>Сумма заказа</TableCell>
                            <TableCell>Комиссия</TableCell>
                            <TableCell>Прибыль</TableCell>
                            <TableCell>Дата</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((profit) => (
                            <TableRow key={profit.id}>
                                <TableCell>{profit.orderId}</TableCell>
                                <TableCell>{profit.orderTotal.toLocaleString()}</TableCell>
                                <TableCell>{profit.marketplaceFeeRate.toLocaleString()}</TableCell>
                                <TableCell>{profit.marketplaceProfit.toLocaleString()}</TableCell>
                                <TableCell>{new Date(profit.createdAt).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" px={2}>
                                    <Typography>
                                        Страница {page + 1} из {Math.ceil(profits.length / PAGE_SIZE)}
                                    </Typography>
                                    <Box>
                                        <IconButton
                                            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
                                            disabled={page === 0}
                                        >
                                            <ArrowBack />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => setPage((prev) =>
                                                prev + 1 < Math.ceil(profits.length / PAGE_SIZE) ? prev + 1 : prev
                                            )}
                                            disabled={page + 1 >= Math.ceil(profits.length / PAGE_SIZE)}
                                        >
                                            <ArrowForward />
                                        </IconButton>
                                    </Box>
                                </Box>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default ProfitAnalyticsPage;