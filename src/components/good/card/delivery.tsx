import React, {useEffect, useMemo, useState} from 'react';
import {Box, Button, Chip,  Grid, styled, Typography} from '@mui/material';
import {DeliveryMethod, DurationUnit, MarketplaceType, ServiceSlot} from "../../../api";
import {useNavigate} from "react-router-dom";
import {getMarketplaceType} from "../../../services";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker} from "@mui/x-date-pickers";
import DialogActions from "@mui/material/DialogActions";
import dayjs, { Dayjs } from 'dayjs';

const PriceDeliveryContainer = styled(Box)(({theme}) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    [theme.breakpoints.down('sm')]: {
        alignItems: 'center',
        textAlign: 'center',
    },
}));

const Price = styled(Typography)({
    fontSize: '24px',
    fontWeight: 'bold',
});

const OldPrice = styled(Typography)({
    fontSize: '18px',
    textDecoration: 'line-through',
    color: 'gray',
});

const DeliveryInfo = styled(Typography)({
    fontSize: '14px',
    color: 'gray',
});

const ButtonsContainer = styled(Box)({
    display: 'flex',
    gap: '10px',
});

interface ServiceSlotSelectionModalProps {
    open: boolean;
    onClose: () => void;
    onSelect: (slot: ServiceSlot) => void;
    slots: ServiceSlot[];
    durationUnit: DurationUnit;
}
const ServiceSlotSelectionModal: React.FC<ServiceSlotSelectionModalProps> = ({
                                                                                 open,
                                                                                 onClose,
                                                                                 onSelect,
                                                                                 slots,
                                                                             }) => {
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
    const [availableSlots, setAvailableSlots] = useState<ServiceSlot[]>([]);

    useEffect(() => {
        if (selectedDate) {
            // Фильтруем слоты по выбранной дате
            const filtered = slots.filter(slot => {
                const slotDate = new Date(slot.startDateTime);
                return (
                    slotDate.getDate() === selectedDate.toDate().getDate() &&
                    slotDate.getMonth() === selectedDate.toDate().getMonth() &&
                    slotDate.getFullYear() === selectedDate.toDate().getFullYear() &&
                    !slot.isBooked
                );
            });
            setAvailableSlots(filtered);
        }
    }, [selectedDate, slots]);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>Выберите дату и время</DialogTitle>
            <DialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        label="Дата"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        disablePast
                        format="DD.MM.YYYY"
                        sx={{ width: '100%', mt: 3, mb: 3 }}
                    />
                </LocalizationProvider>

                <Typography variant="subtitle1" gutterBottom>
                    Доступные временные слоты:
                </Typography>

                {availableSlots.length === 0 ? (
                    <Typography variant="body2" color="textSecondary">
                        Нет доступных слотов на выбранную дату
                    </Typography>
                ) : (
                    <Grid container={true} spacing={2}>
                        {availableSlots.map(slot => {
                            const start = new Date(slot.startDateTime);
                            const end = new Date(slot.endDateTime);

                            return (
                                <Grid item xs={6} sm={4} key={slot.id}>
                                    <Chip
                                        label={`${start.getHours()}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours()}:${end.getMinutes().toString().padStart(2, '0')}`}
                                        onClick={() => onSelect(slot)}
                                        color="primary"
                                        variant="outlined"
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                            );
                        })}
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Отмена</Button>
            </DialogActions>
        </Dialog>
    );
};

interface PriceDeliveryProps {
    price: number;
    oldPrice?: number;
    deliveryMethods: DeliveryMethod[];
    addToCart: () => void;
    isService?: boolean;
    serviceSlots?: ServiceSlot[];
    duration?: number;
    durationUnit?: DurationUnit;
}
const PriceDelivery: React.FC<PriceDeliveryProps> = ({
                                                         price,
                                                         oldPrice,
                                                         deliveryMethods,
                                                         addToCart,
                                                         isService,
                                                         serviceSlots = [],
                                                         duration,
                                                         durationUnit = DurationUnit.HOURS
                                                     }) => {
    const navigate = useNavigate();
    const marketplaceType = getMarketplaceType();
    const [slotModalOpen, setSlotModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<ServiceSlot | null>(null);

    const deliveryMethodsStr = useMemo(() =>
            deliveryMethods.map(d => d.name).join(', '),
        [deliveryMethods]
    );

    const handleBuyOneClick = () => {
        addToCart();
        navigate('/checkout');
    };

    const handleSlotSelect = (slot: ServiceSlot) => {
        setSelectedSlot(slot);
        setSlotModalOpen(false);
        // Здесь можно добавить логику для добавления слота в заказ
    };

    return (
        <PriceDeliveryContainer>
            <Box sx={{ display: 'flex' }}>
                <Price>{price} ₽</Price>
                {oldPrice && <OldPrice>{oldPrice} ₽</OldPrice>}
            </Box>

            {isService && selectedSlot && (
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        Выбрано: {new Date(selectedSlot.startDateTime).toLocaleString('ru-RU')} -{' '}
                        {new Date(selectedSlot.endDateTime).toLocaleString('ru-RU')}
                    </Typography>
                </Box>
            )}

            <ButtonsContainer>
                {marketplaceType === MarketplaceType.GOODS ? (
                    <>
                        <Button variant="contained" onClick={addToCart}>
                            Добавить в корзину
                        </Button>
                        <Button variant="outlined" onClick={handleBuyOneClick}>
                            Купить в один клик
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="contained"
                            onClick={() => setSlotModalOpen(true)}
                        >
                            {selectedSlot ? 'Изменить время' : 'Выбрать дату и время'}
                        </Button>
                        {selectedSlot && (
                            <Button variant="contained" color="success" onClick={handleBuyOneClick}>
                                Забронировать
                            </Button>
                        )}
                    </>
                )}
            </ButtonsContainer>

            {isService && duration && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Продолжительность: {duration} {formatDurationUnit(durationUnit)}
                </Typography>
            )}

            {marketplaceType === MarketplaceType.GOODS && (
                <DeliveryInfo>Способы доставки: {deliveryMethodsStr}</DeliveryInfo>
            )}

            <ServiceSlotSelectionModal
                open={slotModalOpen}
                onClose={() => setSlotModalOpen(false)}
                onSelect={handleSlotSelect}
                slots={serviceSlots}
                durationUnit={durationUnit}
            />
        </PriceDeliveryContainer>
    );
};

// Вспомогательная функция для форматирования единиц измерения
const formatDurationUnit = (unit: DurationUnit) => {
    switch (unit) {
        case DurationUnit.MINUTES: return 'минут';
        case DurationUnit.HOURS: return 'часов';
        case DurationUnit.DAYS: return 'дней';
        case DurationUnit.MONTHS: return 'месяцев';
        case DurationUnit.YEARS: return 'лет';
        default: return '';
    }
};

export default PriceDelivery;