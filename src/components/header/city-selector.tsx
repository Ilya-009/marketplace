import React, { useState, useEffect } from 'react';
import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    List,
    ListItem,
    ListItemText,
    IconButton,
    InputAdornment,
    CircularProgress,
    Typography,
    Box
} from '@mui/material';
import {
    Search as SearchIcon,
    Close as CloseIcon,
    LocationOn as LocationIcon
} from '@mui/icons-material';

interface City {
    id: number;
    name: string;
    region?: string;
    country: string;
}

const CitySelector: React.FC = () => {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [cities, setCities] = useState<City[]>([]);
    const [selectedCity, setSelectedCity] = useState<City | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Загрузка городов по запросу (заглушка)
    useEffect(() => {
        if (!searchQuery.trim()) {
            setCities([]);
            return;
        }

        const fetchCities = async () => {
            setLoading(true);
            setError('');
            try {
                // Здесь должен быть реальный API-запрос
                // Например: const response = await api.getCities(searchQuery);

                // Заглушка с имитацией задержки
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockCities: City[] = [
                    { id: 1, name: 'Москва', region: 'Московская область', country: 'Россия' },
                    { id: 2, name: 'Санкт-Петербург', region: 'Ленинградская область', country: 'Россия' },
                    { id: 3, name: 'Новосибирск', country: 'Россия' },
                    { id: 4, name: 'Екатеринбург', country: 'Россия' },
                    { id: 5, name: 'Казань', country: 'Россия' },
                ].filter(city =>
                    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (city.region && city.region.toLowerCase().includes(searchQuery.toLowerCase()))
                );

                setCities(mockCities);
            } catch (err) {
                setError('Не удалось загрузить список городов');
            } finally {
                setLoading(false);
            }
        };

        const debounceTimer = setTimeout(fetchCities, 300);
        return () => clearTimeout(debounceTimer);
    }, [searchQuery]);

    const handleOpen = () => {
        setOpen(true);
        setSearchQuery('');
        setCities([]);
        setError('');
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleCitySelect = (city: City) => {
        setSelectedCity(city);
        setOpen(false);
    };

    const handleClearSelection = () => {
        setSelectedCity(null);
    };

    return (
        <Box>
            {/* Кнопка выбора города */}
            {selectedCity ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 1 }}>
                        {selectedCity.name}
                        {selectedCity.region && `, ${selectedCity.region}`}
                    </Typography>
                    <IconButton size="small" onClick={handleClearSelection}>
                        <CloseIcon fontSize="small" />
                    </IconButton>
                </Box>
            ) : (
                <Button
                    variant="outlined"
                    startIcon={<LocationIcon />}
                    onClick={handleOpen}
                    sx={{ minWidth: 200 }}
                >
                    Выберите город
                </Button>
            )}

            {/* Модальное окно выбора города */}
            <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">Выберите город</Typography>
                        <IconButton onClick={handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    <TextField
                        fullWidth
                        autoFocus
                        variant="outlined"
                        placeholder="Начните вводить название города..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ mb: 2 }}
                    />

                    {loading && (
                        <Box display="flex" justifyContent="center" p={2}>
                            <CircularProgress size={24} />
                        </Box>
                    )}

                    {error && (
                        <Typography color="error" sx={{ p: 2 }}>
                            {error}
                        </Typography>
                    )}

                    {!loading && !error && cities.length === 0 && searchQuery && (
                        <Typography color="text.secondary" sx={{ p: 2 }}>
                            Городов не найдено
                        </Typography>
                    )}

                    {!loading && !error && cities.length > 0 && (
                        <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                            {cities.map((city) => (
                                <ListItem
                                    key={city.id}
                                    button
                                    onClick={() => handleCitySelect(city)}
                                    sx={{
                                        '&:hover': { backgroundColor: 'action.hover' },
                                        borderRadius: 1
                                    }}
                                >
                                    <ListItemText
                                        primary={city.name}
                                        secondary={`${city.region ? `${city.region}, ` : ''}${city.country}`}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button onClick={handleClose}>Отмена</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default CitySelector;