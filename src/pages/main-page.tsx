import React, {useEffect, useMemo} from 'react';
import Header from '../components/header/header.tsx';
import {MainPageBox, PageRoundedContainer} from "../components";
import {Grid2, Typography} from "@mui/material";
import ProductCard from "../components/good/ProductCard.tsx";
import {useUnit} from "effector-react";
import {$allGoods, $recommendedGoods, loadGoodsWithDiscounts, loadRecommendedGoods} from "../api";
import Footer from "../components/common/footer.tsx";

export const MainPage: React.FC = () => {
    const goods = useUnit($allGoods);
    const recommendedGoods = useUnit($recommendedGoods);
    const goodsWithDiscount = useMemo(() => goods.filter(g => g.discount), [goods]);

    useEffect(() => {
        loadGoodsWithDiscounts();
        loadRecommendedGoods();
    }, []);

    return (
        <MainPageBox>
            <Header />
            <PageRoundedContainer>
                <Typography variant='h6'>Товары со скидкой</Typography>
                <Grid2 container spacing={3}>
                    {goodsWithDiscount.map((product) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                            <ProductCard good={product} />
                        </Grid2>
                    ))}
                </Grid2>
            </PageRoundedContainer>

            <PageRoundedContainer>
                <Typography variant='h6'>Рекомендации</Typography>
                <Grid2 container spacing={3}>
                    {recommendedGoods.map((product) => (
                        <Grid2 size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={product.id}>
                            <ProductCard good={product} />
                        </Grid2>
                    ))}
                </Grid2>
            </PageRoundedContainer>
            {/*<Banner />*/}
            {/*<Container>*/}
            {/*    <Grid container spacing={2}>*/}
            {/*        {products.map(product => (*/}
            {/*            <Grid item xs={12} sm={6} md={4} key={product.id}>*/}
            {/*                <ProductCard title={product.title} image={product.image} price={product.price} />*/}
            {/*            </Grid>*/}
            {/*        ))}*/}
            {/*    </Grid>*/}
            {/*</Container>*/}
            <Footer />
        </MainPageBox>
    );
};
