import React, {useEffect, useMemo, useState} from 'react';
import {
    Box, Button,
    IconButton,
    InputAdornment,
    MenuItem,
    Pagination,
    Paper,
    Select,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {$properties, $storeGoods, DiscountType, Good, GoodStatus, loadGoodsByStoreId} from "../../api";
import {useUnit} from "effector-react";
import {$store} from "../../api/models/store.ts";
import {goodStatuses} from "../../constants.ts";
import {getProperty} from "../../services";
import {EditProfileLink} from "../common";
import {useNavigate} from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";

const SellerGoods: React.FC = () => {
    const store = useUnit($store);
    const goods = useUnit($storeGoods);
    const properties = useUnit($properties);
    const navigate = useNavigate();

    const [filteredGoods, setFilteredGoods] = useState<Good[]>([]);
    const [selectedStatus, setSelectedStatus] = useState<GoodStatus | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const emptyImage = useMemo(() => {
        return getProperty(properties, 'no.images.img');
    }, [properties]);

    useEffect(() => {
        if (store?.id && store?.id > 0) {
            loadGoodsByStoreId({storeId: store.id});
        }
    }, [store?.id]);

    useEffect(() => {
        setFilteredGoods(goods);
    }, [goods]);

    useEffect(() => {
        const filtered = goods.filter((good) => {
            const matchesStatus = selectedStatus === 'ALL' || good.status === selectedStatus;
            const matchesSearch = good.name.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesStatus && matchesSearch;
        });
        setFilteredGoods(filtered);
        setPage(1); // Сброс пагинации при изменении фильтров
    }, [selectedStatus, searchQuery, goods]);

    const handleStatusChange = (event: React.SyntheticEvent, newValue: GoodStatus | 'ALL') => {
        setSelectedStatus(newValue);
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
    };

    const handleItemsPerPageChange = (event: any) => {
        setItemsPerPage(event.target.value as number);
        setPage(1);
    };

    const handleCreateNewGood = () => {
        navigate('/seller/goods/new');
    };

    const paginatedGoods = filteredGoods.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Товары и цены
            </Typography>
            <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={handleCreateNewGood}
            >
                Добавить товар
            </Button>
            <Tabs value={selectedStatus} onChange={handleStatusChange}>
                <Tab label="Все" value="ALL" />
                {[...goodStatuses.entries()].map(entry => (
                    <Tab key={entry[0]} label={entry[1]} value={entry[0]} />
                ))}
            </Tabs>
            <TextField
                variant="outlined"
                sx={{ input: { color: 'text.primary' }, width: '100%', my: 2 }}
                placeholder="Поиск товаров"
                size="small"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <IconButton>
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    ),
                }}
            />
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Фото</TableCell>
                            <TableCell>Название</TableCell>
                            <TableCell>Статус</TableCell>
                            <TableCell>Цена до скидки</TableCell>
                            <TableCell>Цена</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedGoods.map((good) => (
                            <TableRow key={good.id}>
                                <TableCell>{good.id}</TableCell>
                                <TableCell>
                                    <img src={`http://localhost:8080/files/images/${good.goodImages[0]?.image ?? emptyImage}`}
                                         alt={good.name}
                                         width="50"
                                         height="50" />
                                </TableCell>
                                <TableCell>
                                    <EditProfileLink href={`/seller/goods/${good.id}`}>
                                        {good.name}
                                    </EditProfileLink>
                                </TableCell>
                                <TableCell>{goodStatuses.get(good.status)}</TableCell>
                                <TableCell>{good.discount ? good.price : '-'}</TableCell>
                                <TableCell>
                                    {good.discount
                                        ? good.discount.discountType === DiscountType.PERCENTAGE
                                            ? good.price * (1 - good.discount.discountValue / 100)
                                            : good.price - good.discount.discountValue
                                        : good.price}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                <Pagination
                    count={Math.ceil(filteredGoods.length / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                />
                <Select
                    value={itemsPerPage}
                    onChange={handleItemsPerPageChange}
                    variant='outlined'>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                </Select>
            </Box>
        </Box>
    );
};

export default SellerGoods;