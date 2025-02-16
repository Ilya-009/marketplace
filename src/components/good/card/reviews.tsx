import React from 'react';
import { Box, Typography, styled } from '@mui/material';

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
    name: string;
    surname: string;
    date: string;
    rating: number;
    comment: string;
}

const Review: React.FC<ReviewProps> = ({ name, surname, date, rating, comment }) => {
    return (
        <>
            <ReviewHeader>
                <Avatar>{name[0]}{surname[0]}</Avatar>
                <Typography variant="body1">{name} {surname}</Typography>
                <Typography variant="body2">{date}</Typography>
            </ReviewHeader>
            <Typography variant="body1">Rating: {rating}/5</Typography>
            <Typography variant="body1">{comment}</Typography>
        </>
    );
};

export default Review;