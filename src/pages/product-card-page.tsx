import ProductCard from "../components/good/card/good-card.tsx";
import {Box} from "@mui/material";
import Header from "../components/header/header.tsx";
import styled from "styled-components";
import {useMatch, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    $deliveryMethods,
    defaultStore, Good,
    loadDeliveryMethods,
    loadGoodByIdFx, loadLoadGoodReviewsFx,
    loadStoreByStoreIdFx, Review, Store
} from "../api";
import {extractIdFromPath} from "../services";
import {useUnit} from "effector-react";
import {MainPageBox} from "../components";
import Footer from "../components/common/footer.tsx";

const CardContainer = styled(Box)(() => ({
    minHeight: '100vh',
    marginTop: '2rem'
}));

export const ProductCardPage = () => {
    const match = useMatch('/goods/:id');
    const navigate = useNavigate();
    const goodId = extractIdFromPath(match);

    useEffect(() => {
        if (goodId == null) {
            navigate('/404');
        }
    }, [goodId, navigate]);

    const deliveryMethods = useUnit($deliveryMethods);

    const [good, setGood] = useState<Good>();
    const [store, setStore] = useState<Store>(defaultStore);
    const [reviews, setReviews] = useState<Review[]>([]);

    // Загружаем товар по ID при изменении match
    useEffect(() => {
        loadGoodByIdFx({ id: goodId as number }).then(res => {
            if (res !== undefined) {
                setGood(res);

                loadStoreByStoreIdFx({storeId: res.storeId}).then(store => {
                    setStore(store);
                });

                loadLoadGoodReviewsFx({goodId: goodId as number}).then(r => {
                    setReviews(r);
                });
            }
        });
    }, [goodId, match]);

    useEffect(() => {
        loadDeliveryMethods();
    }, []);

    if (!good) {
        return null;
    }

    return (
        <MainPageBox>
            <Header />
            <CardContainer>
                <ProductCard good={good} reviews={reviews} deliveryMethods={deliveryMethods} store={store}/>
            </CardContainer>
            <Footer />
        </MainPageBox>
    );
};