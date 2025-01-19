// src/App.tsx
import React from 'react';
import {Box, Container, Grid} from '@mui/material';
import Header from '../components/header/header.tsx';
import ProductCard from '../components/product-card.tsx';
import Banner from '../components/banner.tsx';
import Filter from '../components/filter.tsx';
import Footer from '../components/common/footer.tsx';

export const MainPage: React.FC = () => {
    const products = [
        { id: 1, title: 'Product 1', image: 'https://via.placeholder.com/150', price: 29.99 },
        { id: 2, title: 'Product 2', image: 'https://via.placeholder.com/150', price: 19.99 },
        { id: 3, title: 'Product 3', image: 'https://via.placeholder.com/150', price: 39.99 },
        { id: 4, title: 'Product 4', image: 'https://via.placeholder.com/150', price: 49.99 },
        { id: 5, title: 'Product 5', image: 'https://via.placeholder.com/150', price: 59.99 },
        { id: 6, title: 'Product 6', image: 'https://via.placeholder.com/150', price: 89.99 },
    ];

    return (
        <Box sx={{marginLeft: 10, marginRight: 10}}>
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
        </Box>
    );
};
