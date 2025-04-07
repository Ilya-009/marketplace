import React, {useEffect, useState} from 'react';
import {Box, Button, Card, CardMedia, CircularProgress, IconButton, TextField, Typography} from '@mui/material';
import {PhotoCamera} from '@mui/icons-material';
import {useNavigate, useParams} from 'react-router-dom';
import {$store, loadStoreById, Store, updateStoreFx} from "../../api/models/store.ts";
import {useUnit} from "effector-react";

const StoreEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const storeUnit = useUnit($store);
    const [store, setStore] = useState<Store | null>(null);
    const [saving, setSaving] = useState(false);
    const [bannerPreview, setBannerPreview] = useState<string | null>(null);
    const [bannerFile, setBannerFile] = useState<File | null>(null);

    useEffect(() => {
        loadStoreById({storeId: parseInt(id ?? '')});
    }, [id]);

    useEffect(() => {
        if (storeUnit) {
            setStore(storeUnit);

            if (storeUnit.logoImage) {
                setBannerPreview(`http://localhost:8080/files/images/${storeUnit.logoImage}`);
            }
        }
    }, [storeUnit]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStore(prev => prev ? { ...prev, [name]: value } : null);
    };

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBannerFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setBannerPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!store) return;

        setSaving(true);

        try {
            updateStoreFx({
                id: store.id,
                name: store.name,
                description: store.description,
                logoImage: bannerFile as File
            }).then(() => navigate('/seller/main'));
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        navigate(-1);
    };

    if (!store) {
        return <Typography variant="h6">Магазин не найден</Typography>;
    }

    return (
        <Box maxWidth="md" mx="auto" p={3}>
            <Typography variant="h4" gutterBottom>
                Редактирование магазина
            </Typography>

            <Box component="form" onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={3}>
                    <Card sx={{ position: 'relative' }}>
                        <CardMedia
                            component="img"
                            height="200"
                            image={bannerPreview || store.logoImage}
                        />
                        <Box sx={{ position: 'absolute', bottom: 16, right: 16 }}>
                            <input
                                accept="image/*"
                                style={{ display: 'none' }}
                                id="banner-upload"
                                type="file"
                                onChange={handleBannerChange}
                            />
                            <label htmlFor="banner-upload">
                                <IconButton
                                    color="primary"
                                    component="span"
                                    sx={{
                                        backgroundColor: 'background.paper',
                                        '&:hover': {
                                            backgroundColor: 'action.selected'
                                        }
                                    }}
                                >
                                    <PhotoCamera />
                                </IconButton>
                            </label>
                        </Box>
                    </Card>

                    {/* Название магазина */}
                    <TextField
                        label="Название магазина"
                        name="name"
                        value={store.name}
                        onChange={handleInputChange}
                        fullWidth
                        required
                    />

                    {/* Описание магазина */}
                    <TextField
                        label="Описание магазина"
                        name="description"
                        value={store.description}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                    />

                    {/* Кнопки действий */}
                    <Box display="flex" justifyContent="flex-end" gap={2} mt={3}>
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Отменить
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={saving}
                        >
                            {saving ? <CircularProgress size={24} /> : 'Сохранить изменения'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default StoreEditPage;