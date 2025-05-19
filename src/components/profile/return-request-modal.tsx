import React, { useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, FormControl, InputLabel, Select, MenuItem,
    TextField, Card, CardContent, Avatar, Typography, Box, Chip
} from '@mui/material';
import {Order, ReturnReason} from "../../api";

interface ReturnRequestModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: {
        goodId: number;
        reason: ReturnReason;
        comment: string;
        images: File[];
    }) => void;
    order: Order;
    goods: { id: number; name: string; image?: string }[];
    emptyImage: string;
}

export const ReturnRequestModal: React.FC<ReturnRequestModalProps> = ({
                                                                          open,
                                                                          onClose,
                                                                          onSubmit,
                                                                          order,
                                                                          goods,
                                                                          emptyImage
                                                                      }) => {
    const [selectedGoodId, setSelectedGoodId] = useState<number | null>(null);
    const [returnReason, setReturnReason] = useState<ReturnReason | ''>('');
    const [returnComment, setReturnComment] = useState('');
    const [returnImages, setReturnImages] = useState<File[]>([]);

    const handleGoodSelect = (goodId: number) => {
        setSelectedGoodId(goodId);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setReturnImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = () => {
        if (!selectedGoodId || !returnReason) return;

        onSubmit({
            goodId: selectedGoodId,
            reason: returnReason,
            comment: returnComment,
            images: returnImages
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Оформление возврата</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    {/* Шаг 1: Выбор товара */}
                    <Typography variant="h6" gutterBottom>Выберите товар для возврата</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        {order.orderGoods.map((orderGood) => {
                            const good = goods.find(g => g.id === orderGood.goodId);
                            if (!good) return null;

                            return (
                                <Card
                                    key={orderGood.id}
                                    onClick={() => handleGoodSelect(orderGood.goodId)}
                                    sx={{
                                        cursor: 'pointer',
                                        border: selectedGoodId === orderGood.goodId ? '2px solid #1976d2' : '1px solid #e0e0e0',
                                        width: '200px'
                                    }}
                                >
                                    <CardContent sx={{ textAlign: 'center' }}>
                                        <Avatar
                                            variant='square'
                                            sx={{ width: 80, height: 80, margin: '0 auto' }}
                                            src={`http://localhost:8080/files/images/${good.image ?? emptyImage}`}
                                        />
                                        <Typography sx={{ mt: 1 }}>{good.name}</Typography>
                                        <Typography color="text.secondary">
                                            Количество: {orderGood.quantity}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </Box>

                    {/* Шаг 2: Причина возврата */}
                    {selectedGoodId && (
                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" gutterBottom>Причина возврата</Typography>
                            <FormControl fullWidth>
                                <InputLabel>Причина</InputLabel>
                                <Select
                                    value={returnReason}
                                    onChange={(e) => setReturnReason(e.target.value as ReturnReason)}
                                    label="Причина"
                                >
                                    <MenuItem value={ReturnReason.DEFECT}>Брак</MenuItem>
                                    <MenuItem value={ReturnReason.WRONG_ITEM}>Не тот товар</MenuItem>
                                    <MenuItem value={ReturnReason.CHANGE_MIND}>Хочу вернуть, не понравился</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                    )}

                    {/* Шаг 3: Дополнительная информация */}
                    {returnReason && (
                        <>
                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" gutterBottom>Комментарий</Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    value={returnComment}
                                    onChange={(e) => setReturnComment(e.target.value)}
                                    placeholder="Опишите проблему подробнее..."
                                />
                            </Box>

                            <Box sx={{ mt: 4 }}>
                                <Typography variant="h6" gutterBottom>Фотографии товара</Typography>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                />
                                <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
                                    {returnImages.map((file, index) => (
                                        <Chip
                                            key={index}
                                            label={file.name}
                                            onDelete={() => setReturnImages(prev => prev.filter((_, i) => i !== index))}
                                        />
                                    ))}
                                </Box>
                            </Box>
                        </>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!selectedGoodId || !returnReason}
                    variant="contained"
                >
                    Отправить заявку
                </Button>
            </DialogActions>
        </Dialog>
    );
};