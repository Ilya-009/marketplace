import {Box, styled} from '@mui/material';
import Gallery from "./gallery.tsx";
import ProductInfo from "./good-info.tsx";
import PriceDelivery from "./delivery.tsx";
import {ReviewsContainer} from "./reviews.tsx";
import ReviewCard from "./reviews.tsx";
import {Good} from "../../../api/models/goods.ts";
import {getGoodRating} from "../../../services";

const ProductCardContainer = styled(Box)(() => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    padding: '20px',
}));

const MainContent = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    [theme.breakpoints.up('md')]: {
        flexDirection: 'row',
    },
}));

const GallerySection = styled(Box)(({theme}) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
        width: '40%',
    },
}));

const InfoSection = styled(Box)(({theme}) => ({
    width: '100%',
    [theme.breakpoints.up('md')]: {
        width: '60%',
    },
}));

type ProductCardProps = {
    good: Good;
};

const ProductCard = ({good}: ProductCardProps) => {
    const deliveryMethods = ['Pickup', 'Post', 'Courier'];
    // TODO заменить способы доставки с сервера (+ сделать кастомизируемыми)

    return <ProductCardContainer>
        <MainContent>
            <GallerySection>
                <Gallery images={good.goodImages}/>
            </GallerySection>
            <InfoSection>
                <ProductInfo
                    name={good.name}
                    rating={getGoodRating(good)}
                    reviewsCount={good.reviews?.length ?? 0}
                    shopName="Xiaomi"
                    shopIcon="shop-icon.jpg"
                    color="зеленый"
                    memoryOptions={['256 ГБ', '128 ГБ']}
                    description={good.description}
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
            {good.reviews?.map((review, index) => (
                <ReviewCard key={index} review={review} />
            )) ?? ''}
        </ReviewsContainer>
    </ProductCardContainer>;
};

export default ProductCard;