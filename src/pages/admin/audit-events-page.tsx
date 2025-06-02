import {
    Alert,
    Box,
    Chip,
    CircularProgress,
    MenuItem,
    Paper,
    Select,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useUnit } from 'effector-react';
import {$auditEvents, AuditEventType, loadAuditEvents} from "../../api";

const typeLabels: Record<AuditEventType, string> = {
    [AuditEventType.INFO]: 'Информация',
    [AuditEventType.SECURITY]: 'Безопасность',
    [AuditEventType.GENERAL]: 'Общее',
};

const typeColors: Record<AuditEventType, 'default' | 'primary' | 'warning'> = {
    [AuditEventType.INFO]: 'default',
    [AuditEventType.SECURITY]: 'warning',
    [AuditEventType.GENERAL]: 'primary',
};

export const AuditEventsPage = () => {
    const events = useUnit($auditEvents);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState('');
    const [selectedType, setSelectedType] = useState<AuditEventType | 'ALL'>('ALL');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                setLoading(true);
                loadAuditEvents();
            } catch {
                setError('Ошибка при загрузке событий аудита');
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = events.filter(event => {
        const matchesSearch =
            event.name.toLowerCase().includes(search.toLowerCase()) ||
            event.value.toLowerCase().includes(search.toLowerCase());

        const matchesType =
            selectedType === 'ALL' || event.eventType === selectedType;

        return matchesSearch && matchesType;
    });

    return (
        <Box sx={{ width: '90%', mx: 'auto' }}>
            <Typography variant="h4" gutterBottom>
                События аудита
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
                <TextField
                    label="Поиск"
                    fullWidth
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
                <Select
                    fullWidth
                    value={selectedType}
                    onChange={e => setSelectedType(e.target.value as AuditEventType | 'ALL')}
                >
                    <MenuItem value="ALL">Все типы</MenuItem>
                    {Object.values(AuditEventType).map(type => (
                        <MenuItem key={type} value={type}>
                            {typeLabels[type]}
                        </MenuItem>
                    ))}
                </Select>
            </Stack>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Название</TableCell>
                                <TableCell>Тип</TableCell>
                                <TableCell>Дата</TableCell>
                                <TableCell>Значение</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEvents.map(event => (
                                <TableRow key={event.id}>
                                    <TableCell>{event.id}</TableCell>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={typeLabels[event.eventType]}
                                            color={typeColors[event.eventType]}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(event.issuedAt).toLocaleString('ru-RU')}
                                    </TableCell>
                                    <TableCell>{event.value}</TableCell>
                                </TableRow>
                            ))}
                            {filteredEvents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Нет совпадающих событий
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};
