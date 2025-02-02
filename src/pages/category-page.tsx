import React, {useState} from "react";
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
import {$categories, GoodCategory} from "../api";
import styled from "styled-components";
import FilterSidebar from "../components/good/filter-sidebar.tsx";
import {mockProducts, SortOption} from "../api/models/goods.ts";
import ProductCard from "../components/good/ProductCard.tsx";

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

    const categoryId = match?.params?.id != null ? parseInt(match?.params?.id) : null;
    const selectedCategory = findCategoryById(categories, categoryId);

    const [sortBy, setSortBy] = useState<SortOption>('popular');
    const handleSortChange = (event: SelectChangeEvent<SortOption>) => {
        setSortBy(event.target.value as SortOption);
    };

    return (
        <Box sx={{marginLeft: 10, marginRight: 10}}>
            <Header />
            <MainContainer>
                <FilterSidebar goodCategory={selectedCategory} />

                <ContentContainer>
                    <Container maxWidth="xl">
                        <CustomHeader>
                            <Typography variant="h5" component="h1">
                                {selectedCategory?.name} ({mockProducts.length} товаров)
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
                            {mockProducts.map((product) => (
                                <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                                    <ProductCard good={product} />
                                </Grid2>
                            ))}
                        </Grid2>
                    </Container>
                </ContentContainer>
            </MainContainer>
        </Box>
    );
};

const findCategoryById = (categories: Array<GoodCategory>, id: number | null) => {
    return categories.flatMap(category => [category, ...category.childCategories ?? []])
        .find(category => category.id === id) as GoodCategory;
};