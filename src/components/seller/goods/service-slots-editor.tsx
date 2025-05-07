import React, { useState } from 'react';
import {
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemText,
    TextField,
    Typography
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import {ServiceSlot} from "../../../api";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {formatDate} from "../../../services/type-utils.ts";
import dayjs from "dayjs";

interface ServiceSlotsEditorProps {
    slots: ServiceSlot[];
    onSlotsChange: (slots: ServiceSlot[]) => void;
}

const ServiceSlotsEditor: React.FC<ServiceSlotsEditorProps> = ({ slots, onSlotsChange }) => {
    const [showSlotModal, setShowSlotModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [selectedStartTime, setSelectedStartTime] = useState<string>('09:00');
    const [selectedEndTime, setSelectedEndTime] = useState<string>('10:00');

    const handleAddSlot = () => {
        if (!selectedDate) return;

        const startDateTime = new Date(selectedDate);
        const [startHours, startMinutes] = selectedStartTime.split(':').map(Number);
        startDateTime.setHours(startHours, startMinutes);

        const endDateTime = new Date(selectedDate);
        const [endHours, endMinutes] = selectedEndTime.split(':').map(Number);
        endDateTime.setHours(endHours, endMinutes);

        const newSlot: ServiceSlot = {
            startDateTime,
            endDateTime,
            isBooked: false
        };

        onSlotsChange([...slots, newSlot]);
        setShowSlotModal(false);
    };

    const removeSlot = (index: number) => {
        onSlotsChange(slots.filter((_, i) => i !== index));
    };

    return (
        <>
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Доступные слоты</Typography>
                    <Button
                        variant="outlined"
                        onClick={() => setShowSlotModal(true)}
                        startIcon={<AddIcon />}
                    >
                        Добавить слот
                    </Button>

                    {slots.length > 0 && (
                        <List sx={{ mt: 2 }}>
                            {slots.map((slot, index) => (
                                <ListItem key={index} secondaryAction={
                                    <IconButton edge="end" onClick={() => removeSlot(index)}>
                                        <DeleteIcon />
                                    </IconButton>
                                }>
                                    <ListItemText
                                        primary={`${formatDate(new Date(slot.startDateTime))} - ${formatDate(new Date(slot.endDateTime))}`}
                                        secondary={slot.isBooked ? 'Забронирован' : 'Свободен'}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>

            <Dialog open={showSlotModal} onClose={() => setShowSlotModal(false)}>
                <DialogTitle>Добавить временной слот</DialogTitle>
                <DialogContent>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Дата"
                            value={dayjs(selectedDate)}
                            onChange={(newValue) => setSelectedDate(newValue)}
                            renderInput={(params) => <TextField {...params} fullWidth sx={{ mt: 2 }} />}
                        />
                    </LocalizationProvider>
                    <TextField
                        label="Время начала"
                        type="time"
                        value={selectedStartTime}
                        onChange={(e) => setSelectedStartTime(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                    <TextField
                        label="Время окончания"
                        type="time"
                        value={selectedEndTime}
                        onChange={(e) => setSelectedEndTime(e.target.value)}
                        fullWidth
                        sx={{ mt: 2 }}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            step: 300, // 5 min
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowSlotModal(false)}>Отмена</Button>
                    <Button onClick={handleAddSlot} variant="contained">Добавить</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ServiceSlotsEditor;