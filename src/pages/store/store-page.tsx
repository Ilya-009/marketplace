import React, {useState, useEffect, ChangeEventHandler} from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    Avatar, Container, Grid2, CardMedia
} from '@mui/material';
import {useMatch} from 'react-router-dom';
import {
    $storeGoods,
    Good,
    GoodCategory,
    loadCategoriesByStoreIdFx,
    loadGoodsByStoreIdFx,
    $storeUnsecure,
    loadStoreUnsecure,
    loadGoodsByCategoryFx, MarketplaceType, loadReviewsByGoodIds, $goodReviews
} from "../../api";
import {extractIdFromPath, getMarketplaceType, getMaxGoodPrice} from "../../services";
import {useUnit} from "effector-react";
import {MainPageBox} from "../../components";
import Header from "../../components/header/header.tsx";
import styled from "styled-components";
import SellerFilterSidebar from "../../components/seller/view/seller-page-sidebar.tsx";
import ProductCard from "../../components/good/ProductCard.tsx";
import Footer from "../../components/common/footer.tsx";

const MainContainer = styled(Box)(() => ({
    display: 'flex',
    minHeight: '100vh',
    marginTop: '2rem'
}));
const ContentContainer = styled(Box)(() => ({
    flexGrow: 1,
    padding: '.3rem'
}));

const SellerPage: React.FC = () => {
    const match = useMatch('/store/:id');
    const storeId = extractIdFromPath(match);
    const marketplaceType = getMarketplaceType();

    const [priceRange, setPriceRange] = useState({
        startRange: 0,
        endRange: 10000
    });
    const [highRatingOnly, setHighRatingOnly] = useState(false);
    const [filteredGoods, setFilteredGoods] = useState<Good[]>([]);
    const [sellerCategories, setSellerCategories] = useState<GoodCategory[]>([]);

    const store = useUnit($storeUnsecure);
    const allStoreGoods = useUnit($storeGoods);
    const goodsReviews = useUnit($goodReviews);

    useEffect(() => {
        if (storeId) {
            loadStoreUnsecure({storeId: storeId as number});
            loadGoodsByStoreIdFx({storeId: storeId as number}).then(goods => setFilteredGoods(goods));
            loadCategoriesByStoreIdFx({storeId: storeId as number})
                .then(storeCategories => setSellerCategories(storeCategories));
        }
    }, [storeId]);

    useEffect(() => {
        const max = getMaxGoodPrice(allStoreGoods);
        setPriceRange({startRange: priceRange.startRange, endRange: max});

        const goodIds = allStoreGoods.map(good => good.id);
        loadReviewsByGoodIds({goodIds: goodIds});
    }, [allStoreGoods]);

    // Применение фильтров
    useEffect(() => {
        const filtered = allStoreGoods.filter(good => {
            // Фильтр по цене
            const priceMatch = good.price >= priceRange.startRange &&
                good.price <= priceRange.endRange;

            // Фильтр по рейтингу
            const goodReviews = goodsReviews.filter(review => review.goodId === good.id);
            const ratingMatch = !highRatingOnly ||
                (!!goodReviews.length &&
                    goodReviews.reduce((acc, r) => acc + r.mark, 0) / goodReviews.length >= 4);

            return priceMatch && ratingMatch;
        });

        setFilteredGoods(filtered);
    }, [priceRange, highRatingOnly]);

    const handleMinPriceChange = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setPriceRange(prev => ({
            ...prev,
            startRange: Math.max(0, Number(event.target.value))
        }));
    };

    const handleMaxPriceChange = (event: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement>) => {
        setPriceRange(prev => ({
            ...prev,
            endRange: Math.max(prev.startRange + 1, Number(event.target.value))
        }));
    };

    const handleHighRatingChange = (checked: boolean) => {
        setHighRatingOnly(checked);
    };

    const handleCategoryClicked = (category: GoodCategory) => {
        // Фильтрация товаров по выбранной категории
        loadGoodsByCategoryFx({categoryId: category.id})
            .then(goods => setFilteredGoods(goods));
    };

    return (
        <MainPageBox>
            <Header/>
            <MainContainer>
                <SellerFilterSidebar
                    categories={sellerCategories}
                    handleMinPriceChange={handleMinPriceChange}
                    handleMaxPriceChange={handleMaxPriceChange}
                    handleHighRatingCheckChange={handleHighRatingChange}
                    priceRange={priceRange}
                    handleCategoryClicked={handleCategoryClicked}
                />

                <ContentContainer>
                    <Container maxWidth="xl">
                        <Paper elevation={3} sx={{p: 3, mb: 3}}>
                            <Grid spacing={3}>
                                <Grid item xs={12} md={4}>
                                    <Box display="flex" justifyContent="center" mb={2}>
                                        <CardMedia
                                            component="img"
                                            height="200"
                                            image={`http://localhost:8080/files/images/${store.logoImage}`}
                                            sx={{ objectFit: "contain" }}
                                        />
                                    </Box>
                                </Grid>
                                <Grid item xs={12} md={8}>
                                    <Typography variant="h4" gutterBottom>
                                        {store.name}
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {store.description}
                                    </Typography>

                                    <Box display="flex" gap={3} mt={2}>
                                        <Chip
                                            avatar={<Avatar>{store.briefStats.goodsAverageRating?.toFixed(1)}</Avatar>}
                                            label="Рейтинг магазина"
                                            variant="outlined"
                                        />
                                        <Chip
                                            avatar={<Avatar>{filteredGoods.length}</Avatar>}
                                            label={(marketplaceType === MarketplaceType.GOODS ? 'Товаров' : 'Услуг') + 'в магазине'}
                                            variant="outlined"
                                        />
                                        <Chip
                                            avatar={<Avatar>{store.briefStats.goodsSoldCount}</Avatar>}
                                            label="Всего заказов"
                                            variant="outlined"
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Grid2 container spacing={3}>
                            {filteredGoods.map((product) => (
                                <Grid2 size={{xs: 12, sm: 6, md: 4, lg: 3}} key={product.id}>
                                    <ProductCard good={product}/>
                                </Grid2>
                            ))}
                        </Grid2>
                    </Container>
                </ContentContainer>
            </MainContainer>
            <Footer />
        </MainPageBox>
    );
};

export default SellerPage;