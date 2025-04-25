import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import {Store} from "../../../api";
import {useNavigate} from "react-router-dom";

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
    description: string;
    store: Store;
}

const ProductInfo: React.FC<ProductInfoProps> = ({
                                                     name,
                                                     rating,
                                                     reviewsCount,
                                                     store,
                                                     description,
                                                 }) => {
    const navigate = useNavigate();

    const handleStoreInfoClick = () => {
        navigate(`/store/${store.id}`);
    };

    return (
        <ProductInfoContainer>
            <Typography variant="h4">{name}</Typography>
            {/*<Typography variant="body1">Rating: {rating} ({reviewsCount} отзывов, {questionsCount} вопросов)</Typography>*/}
            <Typography variant="body1">Rating: {rating} ({reviewsCount} отзывов)</Typography>
            <ShopInfo onClick={handleStoreInfoClick}>
                <img src={`http://localhost:8080/files/images/${store.logoImage}`} alt={store.name} width="20" height="20" />
                <Typography variant="body1">{store.name}</Typography>
            </ShopInfo>
            {/*<Typography variant="body1">Цвет: {color}</Typography>*/}
            {/*<Typography variant="body1">Встроенная память: {memoryOptions.join(', ')}</Typography>*/}
            <Typography variant="body1">Описание: {description}</Typography>
            {/*<Typography variant="body1">{specifications}</Typography>*/}
        </ProductInfoContainer>
    );
};

export default ProductInfo;