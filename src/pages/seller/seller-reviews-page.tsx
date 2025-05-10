import React, {useEffect, useState} from 'react';
import {SidebarPageBox} from "../../components";
import {$allGoods, $store, loadGoodsByIds, loadPendingStoreReviewsFx, Review} from "../../api";
import {
    Alert, Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    Rating,
    TextField,
    Typography
} from "@mui/material";
import {Close, DoneAll, Reply} from "@mui/icons-material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {useUnit} from "effector-react";
import {formatDate} from "../../services/type-utils.ts";

const SellerReviewsPage: React.FC = () => {
    const store = useUnit($store);
    const goods = useUnit($allGoods);

    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openReplyModal, setOpenReplyModal] = useState(false);
    const [currentReview, setCurrentReview] = useState<Review | null>(null);
    const [replyText, setReplyText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        // Загрузка отзывов без ответов (заглушка)
        const loadReviews = async () => {
            setLoading(true);
            try {
                // Здесь должен быть реальный запрос к API
                if (store.id > 0) {
                    const storeReviews = await loadPendingStoreReviewsFx({storeId: store.id});
                    const goodIds = storeReviews.map(r => r.goodId);
                    loadGoodsByIds({ids: goodIds});
                    setReviews(storeReviews);
                }
            } catch (err) {
                setError('Не удалось загрузить отзывы');
            } finally {
                setLoading(false);
            }
        };

        loadReviews();
    }, [store]);

    const handleOpenReplyModal = (review: Review) => {
        setCurrentReview(review);
        setOpenReplyModal(true);
    };

    const handleCloseReplyModal = () => {
        setOpenReplyModal(false);
        setReplyText('');
        setCurrentReview(null);
    };

    const handleSubmitReply = async () => {
        if (!currentReview || !replyText.trim()) return;

        setSubmitting(true);

        try {
            // Здесь должен быть запрос к API для отправки ответа
            console.log('Отправка ответа на отзыв:', {
                reviewId: currentReview.id,
                replyText
            });

            // Имитация успешной отправки
            setReviews(reviews.filter(r => r.id !== currentReview.id));
            setSuccessMessage('Ответ успешно отправлен');
            setTimeout(() => setSuccessMessage(''), 3000);
            handleCloseReplyModal();
        } catch (error) {
            setError('Ошибка при отправке ответа');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSkipReview = async (reviewId: number) => {
        try {
            // Здесь должен быть запрос к API для отметки отзыва как обработанного без ответа
            console.log('Пропуск отзыва:', reviewId);

            // Имитация успешной обработки
            setReviews(reviews.filter(r => r.id !== reviewId));
            setSuccessMessage('Отзыв отмечен как обработанный');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setError('Ошибка при обработке отзыва');
        }
    };

    return <SidebarPageBox sx={{width: '90%'}}>
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Отзывы на мои товары
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {reviews.length} отзывов требуют ответа
            </Typography>

            {successMessage && (
                <Alert severity="success" sx={{ mb: 3 }}>
                    {successMessage}
                </Alert>
            )}

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : reviews.length === 0 ? (
                <Alert severity="info">
                    Нет отзывов, требующих ответа
                </Alert>
            ) : (
                <Box>
                    {reviews.map((review) => (
                        <Card key={review.id} sx={{ mb: 3 }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <Avatar sx={{ mr: 2 }}/>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(new Date(review.createdAt))}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Chip
                                        label="Требует ответа"
                                        color="warning"
                                        size="small"
                                    />
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body1" sx={{ mr: 1 }}>Товар:</Typography>
                                    <Typography variant="body1" fontWeight="bold">
                                        {/*{review.goodName}*/}
                                    </Typography>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Rating
                                        value={review.mark}
                                        readOnly
                                        precision={0.5}
                                        sx={{ mr: 1 }}
                                    />
                                    <Typography variant="body2">
                                        {review.mark}/5
                                    </Typography>
                                </Box>

                                <Typography variant="body1" sx={{ mb: 3 }}>
                                    {review.text}
                                </Typography>

                                <Divider sx={{ mb: 2 }} />

                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        startIcon={<DoneAll />}
                                        onClick={() => handleSkipReview(review.id)}
                                    >
                                        Пропустить
                                    </Button>
                                    <Button
                                        variant="contained"
                                        startIcon={<Reply />}
                                        onClick={() => handleOpenReplyModal(review)}
                                    >
                                        Ответить
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            )}

            {/* Модальное окно для ответа на отзыв */}
            <Dialog
                open={openReplyModal}
                onClose={handleCloseReplyModal}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">
                            Ответ на отзыв о товаре: {goods.find(g => g.id === currentReview?.goodId)?.name}
                        </Typography>
                        <IconButton onClick={handleCloseReplyModal}>
                            <Close />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <Rating
                                value={currentReview?.mark}
                                readOnly
                                sx={{ mr: 1 }}
                            />
                            <Typography variant="body2">
                                {formatDate(new Date(currentReview?.createdAt))}
                            </Typography>
                        </Box>
                        <Typography variant="body1" sx={{ p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
                            {currentReview?.text}
                        </Typography>
                    </Box>

                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Ваш ответ"
                        placeholder="Напишите ответ на отзыв покупателя..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        variant="outlined"
                    />
                </DialogContent>

                <DialogActions sx={{ p: 3 }}>
                    <Button
                        onClick={handleCloseReplyModal}
                        color="inherit"
                    >
                        Отмена
                    </Button>
                    <Button
                        onClick={handleSubmitReply}
                        variant="contained"
                        disabled={!replyText.trim() || submitting}
                        startIcon={<Reply />}
                    >
                        {submitting ? (
                            <CircularProgress size={24} />
                        ) : 'Отправить ответ'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    </SidebarPageBox>
};

export default SellerReviewsPage;