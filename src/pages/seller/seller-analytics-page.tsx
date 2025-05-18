import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from '@mui/material';

import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {DatePicker} from "@mui/x-date-pickers";
import {CircularLoader, SidebarPageBox} from "../../components";
import {loadStoreAnalyticsFx, StoreAnalytics} from "../../api/models/analytics.ts";
import {useUnit} from "effector-react";
import {$store, MarketplaceType} from "../../api";
import {getMarketplaceType} from "../../services";
import {useLanguage} from "../../locales/language-context.tsx";

const AnalyticsPage: React.FC = () => {
    const store = useUnit($store);
    const {currency} = useLanguage();
    const marketplaceType = getMarketplaceType();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<StoreAnalytics | null>(null);
    const [startDate, setStartDate] = useState<Dayjs | null>(dayjs().subtract(6, 'day'));
    const [endDate, setEndDate] = useState<Dayjs | null>(dayjs());

    useEffect(() => {
        const fetchAnalyticsData = async () => {
            setLoading(true);
            try {
                const result = await loadStoreAnalyticsFx({
                    storeId: store.id,
                    startDate: startDate?.toDate() as Date,
                    endDate: endDate?.toDate() as Date
                })

                setData(result);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalyticsData();
    }, [startDate, endDate]);

    if (loading) {
        return <CircularLoader/>;
    }

    if (!data) {
        return <Typography>Не удалось загрузить данные</Typography>;
    }

    return (
        <SidebarPageBox sx={{width: '90%'}}>
            <Typography variant="h4" gutterBottom>
                Аналитика продаж
            </Typography>

            {/* Выбор диапазона дат */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box mb={3} display="flex" gap={2} flexWrap="wrap">
                    <DatePicker
                        label="Начальная дата"
                        value={startDate}
                        onChange={(newValue) => setStartDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                    <DatePicker
                        label="Конечная дата"
                        value={endDate}
                        onChange={(newValue) => setEndDate(newValue)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Box>
            </LocalizationProvider>

            {/* Карточки с общей статистикой */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Всего продаж
                            </Typography>
                            <Typography variant="h5">
                                {data.summary.totalSales}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Общая выручка
                            </Typography>
                            <Typography variant="h5">
                                {data.summary.totalRevenue.toLocaleString()} {currency}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Средний чек
                            </Typography>
                            <Typography variant="h5">
                                {data.summary.avgOrderValue.toLocaleString()} {currency}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* График продаж по дням */}
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Динамика продаж
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <AreaChart
                        data={data.salesOverTime}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Area type="monotone" dataKey="sales" name="Продажи" stackId="1" stroke="#8884d8" fill="#8884d8" />
                        <Area type="monotone" dataKey="revenue" name={`Выручка (${currency})`} stackId="2" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                </ResponsiveContainer>
            </Paper>

            {/* График топ товаров */}
            <Paper elevation={3} sx={{ p: 2, mb: 4 }}>
                <Typography variant="h6" gutterBottom>
                    Топ {marketplaceType === MarketplaceType.GOODS ? 'товаров' : 'услуг'} по выручке
                </Typography>
                <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                        data={data.topProducts}
                        layout="vertical"
                        margin={{ top: 10, right: 30, left: 100, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" width={150} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="revenue" name={`Выручка (${currency})`} fill="#ffc658" />
                    </BarChart>
                </ResponsiveContainer>
            </Paper>

            {/* Таблица топ товаров / услуг */}
            <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Детализация по {marketplaceType === MarketplaceType.GOODS ? 'товарам' : 'услугам'}
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Товар</TableCell>
                                <TableCell align="right">Продажи</TableCell>
                                <TableCell align="right">Выручка ({currency})</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.topProducts.map((product) => (
                                <TableRow key={product.goodId}>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell align="right">{product.sales}</TableCell>
                                    <TableCell align="right">{product.revenue.toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </SidebarPageBox>
    );
};

export default AnalyticsPage;
