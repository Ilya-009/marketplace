import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Box,
    Typography,
    TextField,
    Card,
    CardContent,
    Grid,
    IconButton,
    Divider, Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import {$cart, removeFromCart, updateQuantity} from "../api";
import {useUnit} from "effector-react/effector-react.mjs";
import Header from "../components/header/header.tsx";
import {$allGoods, loadGoodById} from "../api";
import {ConfirmModal} from "../components/common/confirm-modal.tsx";

const CartPage: React.FC = () => {
    const cart = useUnit($cart);
    const allGoods = useUnit($allGoods);
    const navigate = useNavigate();
    const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(false);
    const [confirmModalPayload, setConfirmModalPayload] = useState<any>();

    useEffect(() => {
        cart.forEach(cartItem => loadGoodById({id: cartItem.goodId}));
    }, [cart]);

    // Функция для получения данных товара по goodId
    const getGoodById = (goodId: number) => allGoods.find((good) => good.id === goodId);

    // Обработчик изменения количества
    const handleQuantityChange = (goodId: number, quantity: number) => {
        if (quantity < 1) return; // Минимальное количество — 1
        updateQuantity({goodId, quantity});
    };

    // Обработчик удаления товара
    const handleRemoveProduct = (goodId: number) => {
        setConfirmModalPayload(goodId);
        setConfirmModalOpen(true);
        // removeFromCart(goodId);
    };

    // Обработчик перехода на страницу товара
    const handleNavigateToGood = (goodId: number) => {
        navigate(`/goods/${goodId}`);
    };

    return <Box sx={{marginLeft: 10, marginRight: 10}}>
        <Header/>
        <Typography variant="h4" gutterBottom>
            Корзина
        </Typography>

        {!cart.length
            ? <Typography variant="h5">
                Корзина пуста
            </Typography>
            : ''}
        {!!cart.length && (
            <>
                <Card>
                    <CardContent>
                        {cart.map((item) => {
                            const good = getGoodById(item.goodId);
                            if (!good) return null;

                            const discountedPrice = good.discount ? good.price - good.discount.discountValue : good.price;

                            return (
                                <React.Fragment key={item.goodId}>
                                    <Grid container alignItems="center" spacing={2} sx={{marginBottom: 2}}>
                                        {/* Чекбокс и фото */}
                                        <Grid item xs={2}>
                                            <img
                                                src={good.goodImages[0].image}
                                                alt={good.name}
                                                style={{width: 100, height: 100, marginLeft: 10}}
                                            />
                                        </Grid>

                                        <Grid item xs={3}>
                                            <Typography
                                                variant="body1"
                                                sx={{cursor: 'pointer', '&:hover': {textDecoration: 'underline'}}}
                                                onClick={() => handleNavigateToGood(good.id)}
                                            >
                                                {good.name}
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={3}>
                                            <Typography variant="body1"
                                                        sx={{textDecoration: 'line-through', color: 'gray'}}>
                                                {good.price} ₽
                                            </Typography>
                                            <Typography variant="body1" sx={{fontWeight: 'bold'}}>
                                                {discountedPrice} ₽
                                            </Typography>
                                        </Grid>

                                        <Grid item xs={3}>
                                            <Box sx={{display: 'flex', alignItems: 'center'}}>
                                                <IconButton
                                                    onClick={() => handleQuantityChange(item.goodId, item.quantity - 1)}
                                                >
                                                    <RemoveIcon/>
                                                </IconButton>
                                                <TextField
                                                    value={item.quantity}
                                                    onChange={(e) =>
                                                        handleQuantityChange(item.goodId, parseInt(e.target.value, 10))
                                                    }
                                                    type="number"
                                                    inputProps={{min: 1}}
                                                    sx={{width: 60, textAlign: 'center'}}
                                                />
                                                <IconButton
                                                    onClick={() => handleQuantityChange(item.goodId, item.quantity + 1)}>
                                                    <AddIcon/>
                                                </IconButton>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={1}>
                                            <IconButton onClick={() => handleRemoveProduct(item.goodId)}
                                                        color="error">
                                                <DeleteIcon/>
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                    <Divider sx={{marginBottom: 2}}/>
                                </React.Fragment>
                            );
                        })}
                    </CardContent>
                </Card>
                <Box sx={{marginTop: 3, textAlign: 'right'}}>
                    <Typography variant="h6">
                        Итого:{' '}
                        {cart.reduce((sum, item) => {
                            const good = getGoodById(item.goodId);
                            if (!good) return sum;
                            const discountedPrice = good.discount ? good.price - good.discount.discountValue : good.price;
                            return sum + discountedPrice * item.quantity;
                        }, 0)}{' '}
                        ₽
                    </Typography>
                    <Button variant="contained" color="primary" sx={{marginTop: 2}}>
                        Оформить заказ
                    </Button>
                </Box>
            </>
        )}

        <ConfirmModal
            isOpen={confirmModalOpen}
            title='Удалить товар?'
            content='Вы точно хотите удалить выбранный товар? Отменить данное действие будет невозможно.'
            cancelBtnText='Отмена'
            submitBtnText='Удалить'
            onCancel={() => setConfirmModalOpen(false)}
            onSubmit={(goodId) => {
                removeFromCart({goodId: goodId});
                setConfirmModalOpen(false);
            }}
            payload={confirmModalPayload}
        />
    </Box>;
};

export default CartPage;