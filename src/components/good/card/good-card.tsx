import React from 'react';
import { Box, styled } from '@mui/material';
import Gallery from "./gallery.tsx";
import ProductInfo from "./good-info.tsx";
import PriceDelivery from "./delivery.tsx";
import {ReviewsContainer} from "./reviews.tsx";
import Review from "./reviews.tsx";

const ProductCardContainer = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    padding: '20px',
}));

const MainContent = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
    },
}));

const GallerySection = styled(Box)(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
        width: '40%',
    },
}));

const InfoSection = styled(Box)(({ theme }) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
        width: '60%',
    },
}));

const ProductCard: React.FC = () => {
   const images = [
        'https://ir.ozone.ru/s3/multimedia-1-4/wc350/7155132256.jpg',
        'https://ir.ozone.ru/s3/multimedia-1-c/wc1000/7154751816.jpg',
        'https://ir.ozone.ru/s3/multimedia-1-1/wc1000/7146538057.jpg',
    ];

    const deliveryMethods = ['Pickup', 'Post', 'Courier'];

    const reviews = [
        {
            name: 'John',
            surname: 'Doe',
            date: '16 February 2025',
            rating: 4,
            comment: 'Great product!',
        },
        // Add more reviews here
    ];

    return (
        <ProductCardContainer>
            <MainContent>
                <GallerySection>
                    <Gallery images={images} />
                </GallerySection>
                <InfoSection>
                    <ProductInfo
                        name="Xiaomi Смартфон Redmi I4C"
                        rating={4.9}
                        reviewsCount={2375}
                        questionsCount={324}
                        shopName="Xiaomi"
                        shopIcon="shop-icon.jpg"
                        color="зеленый"
                        memoryOptions={['256 ГБ', '128 ГБ']}
                        description="О товаре"
                        specifications="Тип: Смартфон, Диагональ экрана: 6.88 дюймов, Емкость аккумулятора: 5000 мАч, Процессор: Hello Gell Ultra, Основной материал корпуса: Пластик, Стекло"
                    />
                    <PriceDelivery
                        price={10743}
                        oldPrice={11076}
                        deliveryMethods={deliveryMethods}
                    />
                </InfoSection>
            </MainContent>
            <ReviewsContainer>
                {reviews.map((review, index) => (
                    <Review key={index} {...review} />
                ))}
            </ReviewsContainer>
        </ProductCardContainer>
    );
};

export default ProductCard;