import React from 'react';
import { Box, Typography, styled } from '@mui/material';

const ProductInfoContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        alignItems: 'center',
        textAlign: 'center',
    },
}));

const ShopInfo = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    cursor: 'pointer',
});

interface ProductInfoProps {
    name: string;
    rating: number;
    reviewsCount: number;
    questionsCount: number;
    shopName: string;
    shopIcon: string;
    color: string;
    memoryOptions: string[];
    description: string;
    specifications: string;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
                                                     name,
                                                     rating,
                                                     reviewsCount,
                                                     questionsCount,
                                                     shopName,
                                                     shopIcon,
                                                     color,
                                                     memoryOptions,
                                                     description,
                                                     specifications,
                                                 }) => {
    return (
        <ProductInfoContainer>
            <Typography variant="h4">{name}</Typography>
            <Typography variant="body1">Rating: {rating} ({reviewsCount} отзывов, {questionsCount} вопросов)</Typography>
            <ShopInfo>
                <img src={shopIcon} alt={shopName} width="20" height="20" />
                <Typography variant="body1">{shopName}</Typography>
            </ShopInfo>
            <Typography variant="body1">Цвет: {color}</Typography>
            <Typography variant="body1">Встроенная память: {memoryOptions.join(', ')}</Typography>
            <Typography variant="body1">{description}</Typography>
            <Typography variant="body1">{specifications}</Typography>
        </ProductInfoContainer>
    );
};

export default ProductInfo;