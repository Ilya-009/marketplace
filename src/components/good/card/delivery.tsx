import React, {useMemo} from 'react';
import {Box, Button, Typography, styled} from '@mui/material';
import {DeliveryMethod} from "../../../api";
import {useNavigate} from "react-router-dom";

const PriceDeliveryContainer = styled(Box)(({theme}) => ({
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
    deliveryMethods: DeliveryMethod[];
    addToCart: () => void;
}

const PriceDelivery: React.FC<PriceDeliveryProps> = ({
                                                         price,
                                                         oldPrice,
                                                         deliveryMethods,
                                                         addToCart
                                                     }) => {
    const navigate = useNavigate();

    const deliveryMethodsStr = useMemo(() =>
            deliveryMethods.map(d => d.name).join(', ')
        , [deliveryMethods]);

    const handleBuyOneClick = () => {
        addToCart();
        navigate('/checkout');
    };

    return <PriceDeliveryContainer>
        <Box sx={{display: 'flex'}}>
            <Price>{price} ₽</Price>
            {oldPrice && <OldPrice>{oldPrice} ₽</OldPrice>}
        </Box>
        <ButtonsContainer>
            <Button variant="contained" onClick={addToCart}>Добавить в корзину</Button>
            <Button variant="outlined" onClick={handleBuyOneClick}>Купить в один клик</Button>
        </ButtonsContainer>
        <DeliveryInfo>Способы доставки: {deliveryMethodsStr}</DeliveryInfo>
    </PriceDeliveryContainer>;
};

export default PriceDelivery;