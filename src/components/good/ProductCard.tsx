import {useState} from 'react';
import {Box, Card, CardContent, Chip, IconButton, Rating, Typography} from '@mui/material';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import {styled} from '@mui/material/styles';
import {DiscountType, Good, GoodDiscount} from "../../api";
import {getGoodRating} from "../../services";
import {useNavigate} from "react-router-dom";

const StyledCard = styled(Card)(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-4px)',
    }
}));

const ImageContainer = styled(Box)({
    position: 'relative',
    paddingTop: '100%',
    '& img': {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain'
    }
});

const FavoriteButton = styled(IconButton)({
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1
});

interface ProductCardProps {
    good: Good;
}

const getDiscountLabelText = (discount: GoodDiscount): string => {
    const out = `-${discount.discountValue}`;
    if (discount.discountType === DiscountType.PERCENTAGE) {
        return out + '%';
    }
    return out;
};

const ProductCard = ({ good }: ProductCardProps) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const rating = getGoodRating(good);
    const navigate = useNavigate();

    const onGoodCardClick = () => {
        navigate(`/goods/${good.id}`);
    };

    return (
        <StyledCard elevation={1} onClick={onGoodCardClick}>
            <FavoriteButton
                onClick={() => setIsFavorite(!isFavorite)}
                sx={{ color: isFavorite ? 'error.main' : 'grey.400' }}
            >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </FavoriteButton>

            <ImageContainer>
                {good.goodImages.length !== 0
                    ? <img src={`http://localhost:8080/files/images/${good.goodImages[0]?.image}`} alt={good.name} loading="lazy"/>
                    : <img src='http://localhost:8080/files/images/no-photo.jpg' alt={good.name} loading="lazy"/>
                }

            </ImageContainer>
            <CardContent sx={{ flexGrow: 1, p: 2 }}>
                <Box sx={{ mb: 1 }}>
                    {good.discount && (
                        <Chip
                            label={getDiscountLabelText(good.discount)}
                            size="small"
                            sx={{
                                bgcolor: 'error.light',
                                color: 'error.contrastText',
                                ml: 0,
                                mb: 1
                            }}
                        />
                    )}
                </Box>
                <Typography variant="h6" component="div" sx={{ fontWeight: 500 }}>
                    {good.price} ₽
                </Typography>
                <Typography
                    variant="body2"
                    // color="text.secondary"
                    sx={{
                        mb: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {good.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={rating} precision={0.1} readOnly size="small" />
                    {(good?.reviews?.length > 0) &&
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        {rating} ({good.reviews?.length})
                    </Typography>}
                </Box>
            </CardContent>
        </StyledCard>
    );
};
export default ProductCard;
//    const images = [
//         'https://ir.ozone.ru/s3/multimedia-1-4/wc350/7155132256.jpg',
//         'https://ir.ozone.ru/s3/multimedia-1-c/wc1000/7154751816.jpg',
//         'https://ir.ozone.ru/s3/multimedia-1-1/wc1000/7146538057.jpg',
//     ];