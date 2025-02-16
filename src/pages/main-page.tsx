import React from 'react';
import {Box} from '@mui/material';
import Header from '../components/header/header.tsx';

export const MainPage: React.FC = () => {
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
