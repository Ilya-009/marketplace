import {SidebarPageBox} from "../../components";
import React, {useEffect, useState} from 'react';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    Grid,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import {ArrowForward, AttachMoney, Inventory, LocalShipping, ShoppingCart} from '@mui/icons-material';
import {useNavigate} from 'react-router-dom';
import {
    $properties,
    $store,
    Good,
    loadRandomGoodsByStoreIdFx, loadSellerOrdersFx,
    loadSuppliesFx, MarketplaceType,
    Order,
    OrderStatus,
    Supply,
    SupplyStatus
} from "../../api";
import {loadStoreAnalyticsFx, StoreSummary} from "../../api/models/analytics.ts";
import {useUnit} from "effector-react";
import {goodStatuses, orderStatuses, supplyStatuses} from "../../constants.ts";
import {getMarketplaceType, getNumericProperty} from "../../services";

const SellerMainPage: React.FC = () => {
    const store = useUnit($store);
    const properties = useUnit($properties);
    const marketplaceType = getMarketplaceType();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<StoreSummary | null>(null);
    const [goods, setGoods] = useState<Good[]>([]);
    const [supplies, setSupplies] = useState<Supply[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Заглушка для имитации загрузки данных
        const fetchData = async () => {
            try {
                const goodsMaxLength = getNumericProperty(properties, 'block.compilation.max.length');
                const loadedGoods: Good[] = await loadRandomGoodsByStoreIdFx({storeId: store.id, count: goodsMaxLength});
                const loadedSupplies: Supply[] = (await loadSuppliesFx({storeId: store.id}))
                    .filter(supply => supply.status !== SupplyStatus.COMPLETED)
                    .slice(0, 5);
                const loadedOrders: Order[] = await loadSellerOrdersFx({sellerId: store.id});
                const stats = await loadStoreAnalyticsFx({
                    storeId: store.id
                });

                setStats(stats.summary);
                setGoods(loadedGoods);
                setSupplies(loadedSupplies);
                setOrders(loadedOrders);
                setLoading(false);
            } catch (error) {
                console.error('Ошибка загрузки данных:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [store.id]);

    const getGoodById = (goodId: number): Good | undefined => {
        return goods.find(g => g.id === goodId);
    };

    const calculateOrderTotal = (order: Order): number => {
        return order.orderGoods.reduce((total, item) => {
            const good = getGoodById(item.goodId);
            return total + (good?.price || 0) * item.quantity;
        }, 0) + order.deliveryMethod.price;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    return <SidebarPageBox sx={{width: '90%'}}>
        <Typography variant="h4" gutterBottom>
            Панель продавца
        </Typography>

        {/* Статистика */}
        <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center">
                            <AttachMoney fontSize="large" color="primary" />
                            <Box ml={2}>
                                <Typography color="textSecondary">Общая выручка</Typography>
                                <Typography variant="h5">
                                    {stats?.totalRevenue?.toLocaleString() ?? 0} ₽
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center">
                            <ShoppingCart fontSize="large" color="primary" />
                            <Box ml={2}>
                                <Typography color="textSecondary">Всего продаж</Typography>
                                <Typography variant="h5">{stats?.totalSales}</Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
            {marketplaceType === MarketplaceType.GOODS && <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center">
                            <Inventory fontSize="large" color="primary" />
                            <Box ml={2}>
                                <Typography color="textSecondary">Активные поставки</Typography>
                                <Typography variant="h5">
                                    {supplies?.filter(s => s.status !== SupplyStatus.COMPLETED).length ?? 0}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>}
            <Grid item xs={12} sm={6} md={3}>
                <Card>
                    <CardContent>
                        <Box display="flex" alignItems="center">
                            <LocalShipping fontSize="large" color="primary" />
                            <Box ml={2}>
                                <Typography color="textSecondary">Ожидают обработки</Typography>
                                <Typography variant="h5">
                                    {orders?.filter(o => o.status === OrderStatus.CREATED).length ?? 0}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>

        {/* Товары / услуги */}
        <Grid container spacing={3} mb={4}>
            <Grid item xs={12} md={6}>
                <Paper elevation={3} sx={{ p: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Ваши {marketplaceType === MarketplaceType.GOODS ? 'товары' : 'услуги'} </Typography>
                        <Button
                            endIcon={<ArrowForward />}
                            onClick={() => navigate('/seller/goods')}
                        >
                            Все товары
                        </Button>
                    </Box>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Изображение</TableCell>
                                    <TableCell>{marketplaceType === MarketplaceType.GOODS ? 'Товар' : 'Услуга'}</TableCell>
                                    <TableCell align="right">Цена</TableCell>
                                    <TableCell>Статус</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {goods.slice(0, 4).map((good) => (
                                    <TableRow key={good.id} hover>
                                        <TableCell>
                                            <Avatar
                                                src={good.goodImages[0]?.image}
                                                variant="rounded"
                                                sx={{ width: 40, height: 40 }}
                                            />
                                        </TableCell>
                                        <TableCell>{good.name}</TableCell>
                                        <TableCell align="right">{good.price.toLocaleString()} ₽</TableCell>
                                        <TableCell>
                                            <Box
                                                component="span"
                                                sx={{
                                                    p: 0.5,
                                                    borderRadius: 1,
                                                    bgcolor: good.status === 'ACTIVE' ? 'success.light' : 'warning.light',
                                                    color: 'common.white'
                                                }}
                                            >
                                                {goodStatuses.get(good.status)?.label}
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Grid>

            {/* Активные поставки */}
            {marketplaceType === MarketplaceType.GOODS && (
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="h6">Активные поставки</Typography>
                            <Button
                                endIcon={<ArrowForward />}
                                onClick={() => navigate('/seller/supplies')}
                            >
                                Все поставки
                            </Button>
                        </Box>
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Товар</TableCell>
                                        <TableCell align="right">Количество</TableCell>
                                        <TableCell>Статус</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {supplies
                                        .filter(s => s.status === 'PENDING')
                                        .slice(0, 3)
                                        .flatMap(supply =>
                                            supply.supplyGoods.map((item, index) => {
                                                const good = getGoodById(item.goodId);
                                                return (
                                                    <TableRow key={`${supply.id}-${index}`} hover>
                                                        <TableCell>{good?.name}</TableCell>
                                                        <TableCell align="right">{item.quantity}</TableCell>
                                                        <TableCell>
                                                            <Box
                                                                component="span"
                                                                sx={{
                                                                    p: 0.5,
                                                                    borderRadius: 1,
                                                                    bgcolor: 'warning.light',
                                                                    color: 'common.white'
                                                                }}
                                                            >
                                                                {supplyStatuses.get(supply.status)}
                                                            </Box>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })
                                        )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </Grid>
            )}
        </Grid>

        {/* Последние заказы */}
        <Paper elevation={3} sx={{ p: 2 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Необработанные заказы</Typography>
                <Button
                    endIcon={<ArrowForward />}
                    onClick={() => navigate('/seller/orders')}
                >
                    Все заказы
                </Button>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>№ Заказа</TableCell>
                            <TableCell>Дата</TableCell>
                            <TableCell align="right">Сумма</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Способ оплаты</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders
                            ?.filter(o => o.status === OrderStatus.CREATED)
                            ?.slice(0, 5)
                            ?.map((order) => (
                                <TableRow key={order.id} hover>
                                    <TableCell>#{order.id}</TableCell>
                                    <TableCell>
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="right">
                                        {calculateOrderTotal(order).toLocaleString()} ₽
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            component="span"
                                            sx={{
                                                p: 0.5,
                                                borderRadius: 1,
                                                bgcolor: 'warning.light',
                                                color: 'common.white'
                                            }}
                                        >
                                            {orderStatuses?.get(order.status) ?? ''}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{order.paymentMethod.name}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    </SidebarPageBox>
};

export default SellerMainPage;