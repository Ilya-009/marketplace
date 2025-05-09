import React, {useCallback} from 'react';
import { Box, Typography, styled } from '@mui/material';
import {$customer, loadCustomer, Review} from "../../../api";
import {formatDate} from "../../../services/type-utils.ts";
import {useUnit} from "effector-react";

export const ReviewsContainer = styled(Box)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        alignItems: 'center',
        textAlign: 'center',
    },
}));

const ReviewHeader = styled(Box)({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
});

const Avatar = styled(Box)({
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'gray',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
});

interface ReviewProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewProps> = ({review}) => {
    useCallback(() => loadCustomer({userId: review.customerId}), [review]);
    const customer = useUnit($customer);

    return (
        <Box sx={{ mb: 3 }}>
            {/* Блок с отзывом */}
            <Box>
                <ReviewHeader>
                    <Avatar>{customer?.firstName[0]}{customer?.lastName[0]}</Avatar>
                    <Typography variant="body1">{customer?.firstName} {customer?.lastName[0]}.</Typography>
                    <Typography variant="body2">{formatDate(new Date(review.createdAt))}</Typography>
                </ReviewHeader>
                <Typography variant="body1">Оценка: {review.mark}/5</Typography>
                <Typography variant="body1">{review.text}</Typography>
            </Box>

            {/* Блок с ответом (если есть) */}
            {review.reply && (
                <Box sx={{
                    mt: 2,
                    ml: 4,
                    pl: 2,
                    borderLeft: '2px solid',
                    borderColor: 'divider',
                    backgroundColor: 'action.hover',
                    p: 1,
                    borderRadius: '0 4px 4px 0'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="subtitle2" color="primary">
                            Ответ магазина
                        </Typography>
                        <Typography variant="caption" sx={{ ml: 1, color: 'text.secondary' }}>
                            {formatDate(new Date(review.reply.repliedAt))}
                        </Typography>
                    </Box>
                    <Typography variant="body1">{review.reply.comment}</Typography>
                </Box>
            )}
        </Box>
    );
};

export default ReviewCard;