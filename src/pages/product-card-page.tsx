import ProductCard from "../components/good/card/good-card.tsx";
import {Box} from "@mui/material";
import Header from "../components/header/header.tsx";
import styled from "styled-components";

const CardContainer = styled(Box)(() => ({
    minHeight: '100vh',
    marginTop: '2rem'
}));

export const ProductCardPage = () => {
    return (
        <Box sx={{marginLeft: 10, marginRight: 10}}>
            <Header />
            <CardContainer>
                <ProductCard/>
            </CardContainer>
        </Box>
    )
}