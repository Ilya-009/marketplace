import React from 'react';
import { Box, Button, Typography, styled } from '@mui/material';

const PriceDeliveryContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        alignItems: 'center',
        textAlign: 'center',
    },
}));

const Price = styled(Typography)({
    fontSize: '24px',
    fontWeight: 'bold',
});

const OldPrice = styled(Typography)({
    fontSize: '18px',
    textDecoration: 'line-through',
    color: 'gray',
});

const DeliveryInfo = styled(Typography)({
    fontSize: '14px',
    color: 'gray',
});

const ButtonsContainer = styled(Box)({
    display: 'flex',
    gap: '10px',
});

interface PriceDeliveryProps {
    price: number;
    oldPrice?: number;
    deliveryMethods: string[];
}

const PriceDelivery: React.FC<PriceDeliveryProps> = ({
                                                         price,
                                                         oldPrice,
                                                         deliveryMethods,
                                                     }) => {
    return (
        <PriceDeliveryContainer>
            <Price>{price} ₽</Price>
            {oldPrice && <OldPrice>{oldPrice} ₽</OldPrice>}
            <ButtonsContainer>
                <Button variant="contained">Добавить в корзину</Button>
                <Button variant="outlined">Купить в один клик</Button>
            </ButtonsContainer>
            <DeliveryInfo>Способы доставки: {deliveryMethods.join(', ')}</DeliveryInfo>
        </PriceDeliveryContainer>
    );
};

export default PriceDelivery;