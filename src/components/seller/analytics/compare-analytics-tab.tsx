import {useUnit} from "effector-react";
import {useLanguage} from "../../../locales/language-context.tsx";
import {$store} from "../../../api";
import React, {useState} from "react";
import dayjs, {Dayjs} from "dayjs";
import {loadStoreAnalyticsFx, StoreAnalytics} from "../../../api/models/analytics.ts";
import {Box, Button, Card, CardContent, Grid, Typography} from "@mui/material";
import {CircularLoader} from "../../common";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers";

const CompareAnalyticsTab: React.FC = () => {
    const store = useUnit($store);
    const { currency } = useLanguage();

    const [period1Start, setPeriod1Start] = useState<Dayjs | null>(dayjs().subtract(14, 'day'));
    const [period1End, setPeriod1End] = useState<Dayjs | null>(dayjs().subtract(7, 'day'));
    const [period2Start, setPeriod2Start] = useState<Dayjs | null>(dayjs().subtract(6, 'day'));
    const [period2End, setPeriod2End] = useState<Dayjs | null>(dayjs());

    const [loading, setLoading] = useState(false);
    const [data1, setData1] = useState<StoreAnalytics | null>(null);
    const [data2, setData2] = useState<StoreAnalytics | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            const [res1, res2] = await Promise.all([
                loadStoreAnalyticsFx({
                    storeId: store.id,
                    startDate: period1Start?.toDate() as Date,
                    endDate: period1End?.toDate() as Date,
                }),
                loadStoreAnalyticsFx({
                    storeId: store.id,
                    startDate: period2Start?.toDate() as Date,
                    endDate: period2End?.toDate() as Date,
                }),
            ]);
            setData1(res1);
            setData2(res2);
        } catch (error) {
            console.error('Ошибка при сравнении периодов', error);
        } finally {
            setLoading(false);
        }
    };

    const calcDiff = (val1: number, val2: number) => {
        const diff = val2 - val1;
        const percent = val1 === 0 ? 0 : ((val2 - val1) / val1) * 100;
        return { diff, percent };
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>
                Сравнение двух периодов
            </Typography>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box mb={3} display="flex" gap={4} flexWrap="wrap">
                    <Box>
                        <Typography>Период 1</Typography>
                        <DatePicker label="Начало" value={period1Start} onChange={setPeriod1Start} />
                        <DatePicker label="Конец" value={period1End} onChange={setPeriod1End} />
                    </Box>
                    <Box>
                        <Typography>Период 2</Typography>
                        <DatePicker label="Начало" value={period2Start} onChange={setPeriod2Start} />
                        <DatePicker label="Конец" value={period2End} onChange={setPeriod2End} />
                    </Box>
                    <Button
                        variant="contained"
                        onClick={loadData}
                        sx={{ alignSelf: 'flex-end', height: 56 }}
                    >
                        Сравнить
                    </Button>
                </Box>
            </LocalizationProvider>

            {loading && <CircularLoader />}

            {data1 && data2 && (
                <Grid container spacing={3}>
                    {[
                        {
                            label: 'Всего продаж',
                            val1: data1.summary.totalSales,
                            val2: data2.summary.totalSales,
                        },
                        {
                            label: `Общая выручка (${currency})`,
                            val1: data1.summary.totalRevenue,
                            val2: data2.summary.totalRevenue,
                        },
                        {
                            label: `Средний чек (${currency})`,
                            val1: data1.summary.avgOrderValue,
                            val2: data2.summary.avgOrderValue,
                        },
                    ].map(({ label, val1, val2 }) => {
                        const { diff, percent } = calcDiff(val1, val2);
                        const sign = diff >= 0 ? '+' : '-';
                        const color = diff >= 0 ? 'green' : 'red';
                        return (
                            <Grid item xs={12} md={4} key={label}>
                                <Card>
                                    <CardContent>
                                        <Typography color="textSecondary" gutterBottom>{label}</Typography>
                                        <Typography variant="h6">Период 1: {val1.toLocaleString()}</Typography>
                                        <Typography variant="h6">Период 2: {val2.toLocaleString()}</Typography>
                                        <Typography sx={{ color }}>
                                            {`${sign}${Math.abs(diff).toLocaleString()} (${sign}${Math.abs(percent).toFixed(1)}%)`}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </>
    );
};

export default CompareAnalyticsTab;
