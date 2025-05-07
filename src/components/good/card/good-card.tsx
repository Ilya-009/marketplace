import {Box, styled} from '@mui/material';
import Gallery from "./gallery.tsx";
import ProductInfo from "./good-info.tsx";
import PriceDelivery from "./delivery.tsx";
import ReviewCard, {ReviewsContainer} from "./reviews.tsx";
import {addToCart, DeliveryMethod, Good, MarketplaceType, Store} from "../../../api";
import {calculatePriceBeforeDiscount, getGoodRating, getMarketplaceType} from "../../../services";

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
    deliveryMethods: DeliveryMethod[];
    store: Store;
};

const ProductCard = ({good, deliveryMethods, store}: ProductCardProps) => {
    const onAddToCartBtnClick = () => {
        addToCart({goodId: good.id});
    };

    const marketplaceType = getMarketplaceType();

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
                    store={store}
                    description={good.description}
                />
                {marketplaceType === MarketplaceType.GOODS ?
                    <PriceDelivery
                        price={good.price}
                        oldPrice={good.discount ? calculatePriceBeforeDiscount(good.price, good.discount) : undefined}
                        deliveryMethods={deliveryMethods}
                        addToCart={onAddToCartBtnClick}
                    />
                    : <PriceDelivery
                        price={good.price}
                        oldPrice={good.discount ? calculatePriceBeforeDiscount(good.price, good.discount) : undefined}
                        deliveryMethods={[]}
                        addToCart={onAddToCartBtnClick}
                        isService={true}
                        serviceSlots={good.serviceSlots}
                        duration={good.duration}
                        durationUnit={good.durationUnit}
                    />}
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