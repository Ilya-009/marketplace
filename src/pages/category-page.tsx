import React, {ChangeEventHandler, useEffect, useMemo, useState} from "react";
import {
    Box,
    Container,
    FormControl,
    Grid2,
    MenuItem,
    Select,
    SelectChangeEvent,
    Typography
} from "@mui/material";
import Header from "../components/header/header.tsx";
import {useMatch} from "react-router-dom";
import {useUnit} from "effector-react";
import {$categories, findCategoryById} from "../api";
import styled from "styled-components";
import FilterSidebar from "../components/good/filter-sidebar.tsx";
import {$goodsByCategory, Good, loadGoodsByCategory, SortOption} from "../api";
import ProductCard from "../components/good/ProductCard.tsx";
import {extractIdFromPath, getGoodRating} from "../services";
import {MainPageBox} from "../components";

const MainContainer = styled(Box)(() => ({
    display: 'flex',
    minHeight: '100vh',
    marginTop: '2rem'
}));
const ContentContainer = styled(Box)(() => ({
    flexGrow: 1,
    padding: '.3rem'
}));
const CustomHeader = styled(Box)(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '.3rem'
}));

export const CategoryPage: React.FC = () => {
    const categories = useUnit($categories);

    const match = useMatch('/catalog/:id');
    const categoryId = extractIdFromPath(match);
    const selectedCategory = findCategoryById(categories, categoryId as number);

    const [sortBy, setSortBy] = useState<SortOption>('popular');
    const goods = useUnit($goodsByCategory);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(0);
    const [useHighRating, setUseHighRating] = useState(false);

    useEffect(() => {
        if (categoryId != null) {
            loadGoodsByCategory({categoryId: categoryId});
        }
    }, [categoryId]);

    useEffect(() => {
        setMinPrice(getMinPrice(goods));
        setMaxPrice(getMaxPrice(goods));
    }, [goods]);

    const filteredGoods = useMemo(() => {
        if (minPrice === 0 && maxPrice === 0) {
            return goods;
        }

        const filteredByPrice = goods.filter(good => good.price >= minPrice && good.price <= maxPrice);

        if (useHighRating) {
            return filteredByPrice.filter(good => getGoodRating(good) >= 4.5);
        }

        return goods.filter(good => good.price >= minPrice && good.price <= maxPrice);
    }, [goods, minPrice, maxPrice, useHighRating]);

    const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
        setSortBy(event.target.value as SortOption);
    };

    const handleMinPriceChange = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setMinPrice(Number(event.target.value));
    };
    const handleMaxPriceChange = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setMaxPrice(Number(event.target.value));
    };
    const handleHighRatingCheckChange = (checked: boolean) => {
        setUseHighRating(checked);
    };

    return (
        <MainPageBox>
            <Header />
            <MainContainer>
                <FilterSidebar goodCategory={selectedCategory}
                               priceRange={{startRange: minPrice, endRange: maxPrice}}
                               handleMinPriceChange={handleMinPriceChange}
                               handleMaxPriceChange={handleMaxPriceChange}
                               handleHighRatingCheckChange={handleHighRatingCheckChange}
                />

                <ContentContainer>
                    <Container maxWidth="xl">
                        <CustomHeader>
                            <Typography variant="h5" component="h1">
                                {selectedCategory?.name} ({filteredGoods.length} товаров)
                            </Typography>
                            <FormControl sx={{ minWidth: 200 }}>
                                <Select
                                    value={sortBy}
                                    onChange={handleSortChange}>
                                    <MenuItem value="popular">Популярные</MenuItem>
                                    <MenuItem value="newest">Новинки</MenuItem>
                                    <MenuItem value="priceAsc">Цена: Дешевле</MenuItem>
                                    <MenuItem value="priceDesc">Цена: Дороже</MenuItem>
                                    <MenuItem value="ratingHigh">С большим рейтингом</MenuItem>
                                    <MenuItem value="discountHigh">С большими скидками</MenuItem>
                                </Select>
                            </FormControl>
                        </CustomHeader>

                        <Grid2 container spacing={3}>
                            {filteredGoods.map((product) => (
                                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                                    <ProductCard good={product} />
                                </Grid2>
                            ))}
                        </Grid2>
                    </Container>
                </ContentContainer>
            </MainContainer>
        </MainPageBox>
    );
};

const getMinPrice = (goods: Good[]) => {
    if (!goods.length) {
        return 0;
    }

    return goods.reduce((min, curr) => curr.price < min ? curr.price : min, 100000);
}

const getMaxPrice = (goods: Good[]) => {
    if (!goods.length) {
        return 0;
    }

    return goods.reduce((max, curr) => curr.price > max ? curr.price : max, 0);
}