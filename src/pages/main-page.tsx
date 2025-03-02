import React from 'react';
import Header from '../components/header/header.tsx';
import {MainPageBox} from "../components";

export const MainPage: React.FC = () => {
    return (
        <MainPageBox>
            <Header />
            {/*<Banner />*/}
            {/*<Container>*/}
            {/*    <Filter />*/}
            {/*    <Grid container spacing={2}>*/}
            {/*        {products.map(product => (*/}
            {/*            <Grid item xs={12} sm={6} md={4} key={product.id}>*/}
            {/*                <ProductCard title={product.title} image={product.image} price={product.price} />*/}
            {/*            </Grid>*/}
            {/*        ))}*/}
            {/*    </Grid>*/}
            {/*</Container>*/}
            {/*<Footer />*/}
        </MainPageBox>
    );
};
