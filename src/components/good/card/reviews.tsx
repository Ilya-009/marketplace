import React from 'react';
import {Box, Typography, styled, Avatar, Rating} from '@mui/material';
import {Review} from "../../../api";
import {formatDate} from "../../../services/type-utils.ts";

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

interface ReviewProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewProps> = ({review}) => {
    return (
        <Box sx={{ mb: 3 }}>
            {/* Блок с отзывом */}
            <Box>
                <ReviewHeader>
                    <Avatar
                        variant="rounded"
                        sx={{ width: 40, height: 40, mr: 1 }}/>
                    <Typography variant="body2">{formatDate(new Date(review.createdAt))}</Typography>
                </ReviewHeader>
                <Rating
                    value={review.mark}
                    readOnly
                    precision={1}
                    sx={{ mr: 1, mt: 1}}
                />
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