import React, { useState, useEffect } from 'react';
import {
    Box,
    Tab,
    Tabs,
    Typography,
    Card,
    CardContent,
    Rating,
    CircularProgress,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField, IconButton, Avatar, Link
} from '@mui/material';
import {
    FormatListBulleted as ReviewsIcon,
    StarBorder as PendingReviewsIcon,
    Store as StoreIcon,
    Close as CloseIcon
} from '@mui/icons-material';
import {SidebarPageBox} from "../components";
import {
    $allGoods,
    $customer,
    loadCustomerReviewsFx,
    loadGoodsByIds,
    loadPendingCustomerReviewsFx,
    PendingReview,
    Review
} from "../api";
import {useUnit} from "effector-react";
import {formatDate} from "../services/type-utils.ts";

const CustomerReviewsPage: React.FC = () => {
    const customer = useUnit($customer);
    const goods = useUnit($allGoods);

    const [activeTab, setActiveTab] = useState(0);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
    const [loading, setLoading] = useState(true);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const [currentReview, setCurrentReview] = useState<{goodId: number, goodName: string} | null>(null);
    const [rating, setRating] = useState<number | null>(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        // Загрузка данных (заглушки)
        const loadData = async () => {
            setLoading(true);

            if (customer.id > 0) {
                const customerReviews = await loadCustomerReviewsFx({customerId: customer.id});
                setReviews(customerReviews);

                const pendingReviews = await loadPendingCustomerReviewsFx({customerId: customer.id});
                setPendingReviews(pendingReviews);

                const goodIds = [...new Set<number>([
                    ...customerReviews.map(r => r.goodId),
                    ...pendingReviews.map(r => r.goodId)
                ])];
                loadGoodsByIds({ids: goodIds});
            }

            setLoading(false);
        };

        loadData();
    }, [customer]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleOpenReviewModal = (goodId: number, goodName: string) => {
        setCurrentReview({ goodId, goodName });
        setOpenReviewModal(true);
    };

    const handleCloseReviewModal = () => {
        setOpenReviewModal(false);
        setRating(0);
        setReviewText('');
        setCurrentReview(null);
    };

    const handleSubmitReview = async () => {
        if (!currentReview || rating === null || rating === 0) return;

        setSubmitting(true);

        try {
            // Здесь должен быть запрос к API для отправки отзыва
            console.log('Отправка отзыва:', {
                goodId: currentReview.goodId,
                rating,
                text: reviewText
            });

            const newReview: Review = {
                id: reviews.length + 1,
                goodId: currentReview.goodId,
                mark: rating,
                text: reviewText,
                createdAt: new Date(),
                customerId: customer.id
            };

            setReviews([newReview, ...reviews]);
            setPendingReviews(pendingReviews.filter(item => item.goodId !== currentReview.goodId));

            handleCloseReviewModal();
        } catch (error) {
            console.error('Ошибка при отправке отзыва:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SidebarPageBox sx={{width: '90%'}}>
            <Typography variant="h4" gutterBottom>
                Мои отзывы
            </Typography>

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab
                    icon={<PendingReviewsIcon />}
                    iconPosition="start"
                    label="Ожидают оценки"
                />
                <Tab
                    icon={<ReviewsIcon />}
                    iconPosition="start"
                    label="Написанные отзывы"
                />
            </Tabs>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {activeTab === 0 && (
                        <Box>
                            {pendingReviews.length === 0 ? (
                                <Typography variant="body1" color="text.secondary">
                                    Нет товаров, ожидающих оценки
                                </Typography>
                            ) : (
                                pendingReviews.map((item) => {
                                    const good = goods.find(g => g.id === item.goodId);

                                    return (
                                        <Card key={item.goodId} sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar
                                                        src={`http://localhost:8080/files/images/${good?.goodImages[0]?.image}`}
                                                        sx={{ width: 76, height: 76, mr: 2 }}
                                                    >
                                                        {item.name[0]}
                                                    </Avatar>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        <Link href={`/goods/${item.goodId}`} target='_blank' rel='noopener'>
                                                            <Typography variant="h6">{item.name}</Typography>
                                                        </Link>
                                                    </Box>
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => handleOpenReviewModal(item.goodId, item.name)}
                                                    >
                                                        Оценить
                                                    </Button>
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </Box>
                    )}

                    {activeTab === 1 && (
                        <Box>
                            {reviews.length === 0 ? (
                                <Typography variant="body1" color="text.secondary">
                                    У вас пока нет написанных отзывов
                                </Typography>
                            ) : (
                                reviews.map((review) => {
                                    const good = goods.find(g => g.id === review.goodId);
                                    console.log(goods);

                                    return (
                                        <Card key={review.id} sx={{ mb: 3 }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Avatar
                                                        variant='square'
                                                        src={`http://localhost:8080/files/images/${good?.goodImages[0].image}`}
                                                        sx={{ width: 76, height: 76, mr: 2 }}
                                                    >
                                                        {good?.name}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="h6">{good?.name}</Typography>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Rating
                                                                value={review.mark}
                                                                readOnly
                                                                precision={0.5}
                                                                sx={{ mr: 1 }}
                                                            />
                                                            <Typography variant="body2">
                                                                {formatDate(new Date(review.createdAt))}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </Box>

                                                <Typography variant="body1" sx={{ mb: 2 }}>
                                                    {review.text}
                                                </Typography>

                                                {review.reply && (
                                                    <Box sx={{
                                                        mt: 2,
                                                        pl: 2,
                                                        ml: 2,
                                                        borderLeft: '2px solid',
                                                        borderColor: 'divider',
                                                        backgroundColor: 'action.hover',
                                                        borderRadius: '0 4px 4px 0',
                                                        p: 1.5
                                                    }}>
                                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                                            <StoreIcon color="primary" sx={{ mr: 1, fontSize: 20 }} />
                                                            <Typography variant="subtitle2" color="primary">
                                                                Ответ магазина
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                                                                {formatDate(new Date(review.reply.repliedAt))}
                                                            </Typography>
                                                        </Box>
                                                        <Typography variant="body1">
                                                            {review.reply.comment}
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )}
                        </Box>
                    )}
                </>
            )}

            {/* Модальное окно для оценки товара */}
            <Dialog
                open={openReviewModal}
                onClose={handleCloseReviewModal}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            Оценить товар: {currentReview?.goodName}
                        </Typography>
                        <IconButton onClick={handleCloseReviewModal}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mt: 2, mb: 3 }}>
                        <Typography gutterBottom>Ваша оценка:</Typography>
                        <Rating
                            value={rating}
                            onChange={(event, newValue) => {
                                setRating(newValue);
                            }}
                            precision={1}
                            size="large"
                        />
                    </Box>

                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Ваш отзыв"
                        placeholder="Расскажите о вашем опыте использования товара..."
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={handleCloseReviewModal}
                        color="inherit"
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSubmitReview}
                        variant="contained"
                        disabled={!rating || rating === 0 || submitting}
                    >
                        {submitting ? (
                            <CircularProgress size={24} />
                        ) : 'Отправить отзыв'}
                    </Button>
                </DialogActions>
            </Dialog>
        </SidebarPageBox>
    );
};

export default CustomerReviewsPage;