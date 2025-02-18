import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import {Review} from "../../../api/models/reviews.ts";
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
    return (
        <>
            <ReviewHeader>
                <Avatar>{review.creatorName[0]}{review.creatorSurname[0]}</Avatar>
                <Typography variant="body1">{review.creatorName} {review.creatorSurname}</Typography>
                <Typography variant="body2">{formatDate(review.creationTime)}</Typography>
            </ReviewHeader>
            <Typography variant="body1">Оценка: {review.mark}/5</Typography>
            <Typography variant="body1">{review.text}</Typography>
        </>
    );
};

export default ReviewCard;