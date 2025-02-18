import ProductCard from "../components/good/card/good-card.tsx";
import {Box} from "@mui/material";
import Header from "../components/header/header.tsx";
import styled from "styled-components";
import {useMatch, useNavigate} from "react-router-dom";
import {useEffect, useMemo} from "react";
import {$allGoods, loadGoodById} from "../api/models/goods.ts";
import {extractIdFromPath, findGoodById} from "../services";
import {useUnit} from "effector-react";

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
    }, []);

    const goods = useUnit($allGoods);

    // Загружаем товар по ID при изменении match
    useEffect(() => {
        loadGoodById({ id: goodId as number });
    }, [match]);

    // Ищем товар в списке goods
    const good = useMemo(() => {
        const foundGood = findGoodById(goods, goodId as number);
        // Если товар не найден, выполняем редирект на /404
        if (!foundGood) {
            navigate('/404');
            return null;
        }
        return foundGood;
    }, [goods, goodId, navigate]);

    // Если good равен null (например, после редиректа), не рендерим компонент
    if (!good) {
        return null;
    }

    return (
        <Box sx={{ marginLeft: 10, marginRight: 10 }}>
            <Header />
            <CardContainer>
                <ProductCard good={good} />
            </CardContainer>
        </Box>
    );
};