import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    Grid,
    InputAdornment,
    IconButton
} from '@mui/material';
import { CreditCard, Visibility, VisibilityOff } from '@mui/icons-material';

export interface CardData {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
    cardHolder: string;
}

export const PaymentCardForm: React.FC = () => {
    const [cardData, setCardData] = useState<CardData>({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardHolder: ''
    });
    const [showCvv, setShowCvv] = useState(false);
    const [errors, setErrors] = useState<Partial<CardData>>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCardData(prev => ({ ...prev, [name]: value }));

        // Очистка ошибки при изменении поля
        if (errors[name as keyof CardData]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = matches && matches[0] || '';
        const parts = [];

        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }

        return parts.length ? parts.join(' ') : value;
    };

    const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatCardNumber(e.target.value);
        setCardData(prev => ({
            ...prev,
            cardNumber: formattedValue
        }));
    };

    const formatExpiryDate = (value: string) => {
        const v = value.replace(/[^0-9]/g, '');
        if (v.length >= 3) {
            return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
        }
        return value;
    };

    const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedValue = formatExpiryDate(e.target.value);
        setCardData(prev => ({
            ...prev,
            expiryDate: formattedValue
        }));
    };

    const validate = (): boolean => {
        const newErrors: Partial<CardData> = {};

        if (!cardData.cardNumber || cardData.cardNumber.replace(/\s/g, '').length !== 16) {
            newErrors.cardNumber = 'Введите 16-значный номер карты';
        }

        if (!cardData.expiryDate || !/^(0[1-9]|1[0-2])\/?([0-9]{2})$/.test(cardData.expiryDate)) {
            newErrors.expiryDate = 'Введите срок действия в формате MM/YY';
        }

        if (!cardData.cvv || !/^[0-9]{3,4}$/.test(cardData.cvv)) {
            newErrors.cvv = 'Введите 3 или 4 цифры';
        }

        if (!cardData.cardHolder) {
            newErrors.cardHolder = 'Введите имя владельца карты';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (validate()) {
            // onPaymentSubmit(cardData);
            console.log("submit payment")
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 500, mx: 'auto' }}>
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCard sx={{ mr: 1 }} /> Данные банковской карты
            </Typography>

            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Номер карты"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleCardNumberChange}
                        error={!!errors.cardNumber}
                        helperText={errors.cardNumber}
                        placeholder="0000 0000 0000 0000"
                        inputProps={{ maxLength: 19 }}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="Срок действия"
                        name="expiryDate"
                        value={cardData.expiryDate}
                        onChange={handleExpiryDateChange}
                        error={!!errors.expiryDate}
                        helperText={errors.expiryDate}
                        placeholder="MM/YY"
                        inputProps={{ maxLength: 5 }}
                    />
                </Grid>

                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="CVV/CVC"
                        name="cvv"
                        type={showCvv ? "text" : "password"}
                        value={cardData.cvv}
                        onChange={handleChange}
                        error={!!errors.cvv}
                        helperText={errors.cvv}
                        inputProps={{ maxLength: 3 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowCvv(!showCvv)}
                                        edge="end"
                                    >
                                        {showCvv ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </Grid>

                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Имя владельца карты"
                        name="cardHolder"
                        value={cardData.cardHolder}
                        onChange={handleChange}
                        error={!!errors.cardHolder}
                        helperText={errors.cardHolder}
                    />
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Button
                        variant="outlined"
                        color="error"
                        // onClick={}
                        sx={{ width: '48%' }}
                    >
                        Отменить
                    </Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        sx={{ width: '48%' }}
                    >
                        Оплатить
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};