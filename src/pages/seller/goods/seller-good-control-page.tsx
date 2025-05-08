import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useMatch, useNavigate} from 'react-router-dom';
import {useDropzone} from 'react-dropzone';
import styled from 'styled-components';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Switch,
    TextField,
    Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    $categories,
    $loggedUser,
    changeGoodStatusFx,
    createNewGoodFx,
    DiscountType, DurationUnit,
    Good,
    GoodDiscount,
    GoodStatus,
    loadCategories,
    loadGoodByIdFx, MarketplaceType,
    ModifyGoodType, ServiceSlot,
    updateGoodFx
} from "../../../api";
import {useUnit} from "effector-react";
import {extractIdFromPath, getCategoryPathMapFromArray, getMarketplaceType} from "../../../services";
import {goodStatuses} from "../../../constants.ts";
import AddIcon from "@mui/icons-material/Add";
import CreateCategoryRequestModal from "../../../components/good/create-category-request-modal.tsx";
import ServiceSlotsEditor from "../../../components/seller/goods/service-slots-editor.tsx";

const StyledDropzone = styled.div`
  border: 2px dashed #ccc;
  border-radius: 4px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: border .24s ease-in-out;
  margin-bottom: 16px;

  &:hover {
    border-color: #2196f3;
  }
`;

const ThumbnailContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 16px;
`;

const Thumbnail = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ThumbnailOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.5);
  padding: 4px;
  cursor: pointer;
`;

const DiscountForm = styled(Paper)`
  padding: 16px;
  margin-top: 16px;
`;

type CreateGoodPageProps = {
    isCreate: boolean;
};

const getStatusButtons = (currentStatus: GoodStatus, onClickCallback: (status: GoodStatus) => void) => {
    let shownStatuses: GoodStatus[];
    switch (currentStatus) {
        case GoodStatus.ACTIVE:
            shownStatuses = [GoodStatus.REMOVED_FROM_SELL];
            break;
        case GoodStatus.ON_MODERATION:
        case GoodStatus.BLOCKED:
            shownStatuses = [];
            break;
        case GoodStatus.DRAFT:
            shownStatuses = [GoodStatus.ON_MODERATION];
            break;
        case GoodStatus.ARCHIVED:
            shownStatuses = [GoodStatus.ACTIVE];
            break;
        case GoodStatus.REMOVED_FROM_SELL:
            shownStatuses = [GoodStatus.ACTIVE, GoodStatus.ARCHIVED];
    }

    return shownStatuses.map(status => {
        const statusInfo = goodStatuses.get(status);
        return (
            <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => onClickCallback(status)}
                sx={{mb: 2, backgroundColor: statusInfo?.color, color: '#000'}}
            >{statusInfo?.actionLabel}</Button>
        );
    }, []);
};

const CreateGoodPage: React.FC<CreateGoodPageProps> = ({ isCreate }: CreateGoodPageProps) => {
    const match = useMatch('/seller/goods/:id');
    const goodId = extractIdFromPath(match);
    const navigate = useNavigate();
    const marketplaceType = getMarketplaceType();

    const categoriesStore = useUnit($categories);
    const loggedUser = useUnit($loggedUser);
    const categories = useMemo(() => getCategoryPathMapFromArray(categoriesStore),
        [categoriesStore]);

    const [good, setGood] = useState<ModifyGoodType>({
        name: '',
        description: '',
        price: 0,
        categoryId: -1,
        isService: marketplaceType === MarketplaceType.SERVICES,
        duration: 1,
        durationUnit: DurationUnit.HOURS,
        isOnline: false,
        serviceSlots: []
    });
    const [images, setImages] = useState<{ image: string; file?: File }[]>([]);
    const [existingImages, setExistingImages] = useState<string[]>([]);
    const [hasDiscount, setHasDiscount] = useState(false);
    const [discount, setDiscount] = useState<GoodDiscount>({
        discountType: DiscountType.PERCENTAGE,
        discountValue: 0
    });
    const [categoryCreationRequestModalOpen, setCategoryCreationRequestModalOpen] = useState(false);

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (!isCreate && goodId) {
            loadGoodByIdFx({ id: goodId }).then(response => {
                const good = response as Good;
                const modifyGoodType: ModifyGoodType = {
                    name: good.name,
                    description: good.description,
                    price: good.price,
                    status: good.status,
                    categoryId: good.categoryId,
                    isService: good.isService,
                    duration: good.duration,
                    durationUnit: good.durationUnit,
                    isOnline: good.isOnline,
                    serviceSlots: good.serviceSlots || []
                };
                setGood(modifyGoodType);

                if (good.goodImages && good.goodImages.length > 0) {
                    setExistingImages(good.goodImages.map(img => `http://localhost:8080/files/images/${img.image}`));
                }

                if (good.discount) {
                    setHasDiscount(true);
                    setDiscount({
                        discountType: good.discount.discountType,
                        discountValue: good.discount.discountValue
                    });
                }
            });
        }
    }, [goodId, isCreate]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newImages = acceptedFiles.map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return {
                image: '',
                file
            };
        });

        setImages(prev => [...prev, ...newImages]);

        acceptedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                setImages(prev => {
                    const updated = [...prev];
                    const imgIndex = prev.length - acceptedFiles.length + index;
                    updated[imgIndex].image = reader.result as string;
                    return updated;
                });
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png']
        },
        multiple: true
    });

    const removeImage = (index: number, isExisting: boolean) => {
        if (isExisting) {
            setExistingImages(prev => prev.filter((_, i) => i !== index));
        } else {
            setImages(prev => prev.filter((_, i) => i !== index));
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGood(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
    };

    const handleCategoryChange = (e: any) => {
        setGood(prev => ({ ...prev, categoryId: parseInt(e.target.value) }));
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setDiscount(prev => ({
            ...prev,
            [name]: name === 'discountValue' ? parseFloat(value) || 0 : value
        }));
    };

    const handleDiscountTypeChange = (e: any) => {
        setDiscount(prev => ({
            ...prev,
            discountType: e.target.value
        }));
    };

    const handleDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGood(prev => ({ ...prev, duration: parseInt(e.target.value) || 1 }));
    };

    const handleDurationUnitChange = (e: any) => {
        setGood(prev => ({ ...prev, durationUnit: e.target.value }));
    };

    const handleIsOnlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGood(prev => ({ ...prev, isOnline: e.target.checked }));
    };

    const handleServiceSlotsChange = (slots: ServiceSlot[]) => {
        setGood(prev => ({ ...prev, serviceSlots: slots }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const formData = {
            name: good.name,
            description: good.description,
            price: good.price,
            status: good.status,
            categoryId: good.categoryId,
            userId: loggedUser.id,
            images: images.map(img => img.file as File),
            discount: hasDiscount ? discount : undefined,
            isService: marketplaceType === MarketplaceType.SERVICES,
            duration: good.duration,
            durationUnit: good.durationUnit,
            isOnline: good.isOnline,
            serviceSlots: good.serviceSlots
        };

        if (isCreate) {
            await createNewGoodFx(formData);
        } else if (goodId) {
            await updateGoodFx({ id: goodId, ...formData });
        }
    };

    const handleStatusChanged = async (targetStatus: GoodStatus) => {
        if (goodId) {
            await changeGoodStatusFx({
                id: goodId,
                status: targetStatus
            }).then(() => navigate('/seller/goods'));
            window.location.reload();
        }
    };

    const calculateFinalPrice = () => {
        const price = good.price || 0;
        if (!hasDiscount) return price;

        if (discount.discountType === DiscountType.PERCENTAGE) {
            return price * (1 - discount.discountValue / 100);
        } else {
            return Math.max(0, price - discount.discountValue);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4">
                    {(isCreate
                            ? 'Создание нового '
                            : 'Редактирование ')
                        + (marketplaceType === MarketplaceType.GOODS ? 'товара' : 'услуги')
                    }
                </Typography>
                <Button
                    variant="outlined"
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate('/seller/goods')}
                >
                    Назад к списку
                </Button>
            </Box>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Основная информация</Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label={marketplaceType === MarketplaceType.GOODS ? 'Название товара' : 'Название услуги'}
                                        name="name"
                                        value={good.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label={marketplaceType === MarketplaceType.GOODS ? 'Описание товара' : 'Описание услуги'}
                                        name="description"
                                        value={good.description}
                                        onChange={handleInputChange}
                                        multiline
                                        rows={4}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Цена"
                                        name="price"
                                        type="number"
                                        value={good.price}
                                        onChange={handleInputChange}
                                        InputProps={{
                                            endAdornment: <InputAdornment position="end">₽</InputAdornment>,
                                            inputProps: { min: 0 }
                                        }}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel id="category-label">Категория</InputLabel>
                                        <Select
                                            labelId="category-label"
                                            label="Категория"
                                            value={good.categoryId}
                                            onChange={handleCategoryChange}
                                            required
                                        >
                                            <MenuItem value={-1} disabled>Выберите категорию</MenuItem>
                                            {[...categories.entries()].map(category => (
                                                <MenuItem key={category[0]} value={category[0]}>
                                                    {category[1]}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {marketplaceType === MarketplaceType.SERVICES && (
                                    <>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                fullWidth
                                                label="Длительность выполнения"
                                                name="duration"
                                                type="number"
                                                value={good.duration}
                                                onChange={handleDurationChange}
                                                InputProps={{
                                                    inputProps: { min: 1 }
                                                }}
                                                required
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <FormControl fullWidth>
                                                <InputLabel>Единица измерения</InputLabel>
                                                <Select
                                                    value={good.durationUnit}
                                                    onChange={handleDurationUnitChange}
                                                    label="Единица измерения"
                                                    required
                                                >
                                                    <MenuItem value={DurationUnit.MINUTES}>Минуты</MenuItem>
                                                    <MenuItem value={DurationUnit.HOURS}>Часы</MenuItem>
                                                    <MenuItem value={DurationUnit.DAYS}>Дни</MenuItem>
                                                    <MenuItem value={DurationUnit.MONTHS}>Месяцы</MenuItem>
                                                    <MenuItem value={DurationUnit.YEARS}>Годы</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        checked={good.isOnline}
                                                        onChange={handleIsOnlineChange}
                                                    />
                                                }
                                                label="Онлайн услуга"
                                            />
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Фотографии {marketplaceType === MarketplaceType.GOODS ? 'товара' : 'услуги'}
                            </Typography>
                            <StyledDropzone {...getRootProps()}>
                                <input {...getInputProps()} />
                                <CloudUploadIcon fontSize="large" />
                                <Typography>
                                    {isDragActive ?
                                        'Перетащите изображения сюда' :
                                        'Перетащите изображения или нажмите для выбора файлов'}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                    Поддерживаются форматы JPG, PNG. Максимальный размер файла 5MB.
                                </Typography>
                            </StyledDropzone>

                            {(existingImages.length > 0 || images.length > 0) && (
                                <>
                                    <Typography variant="subtitle2">Изображения товара:</Typography>
                                    <ThumbnailContainer>
                                        {existingImages.map((img, index) => (
                                            <Thumbnail key={`existing-${index}`}>
                                                <ThumbnailImage
                                                    src={img}
                                                    alt={`Existing ${index}`}
                                                />
                                                <ThumbnailOverlay onClick={() => removeImage(index, true)}>
                                                    <DeleteIcon fontSize="small" color="error" />
                                                </ThumbnailOverlay>
                                            </Thumbnail>
                                        ))}
                                        {images.map((img, index) => (
                                            <Thumbnail key={`new-${index}`}>
                                                {img.image && (
                                                    <ThumbnailImage
                                                        src={img.image}
                                                        alt={`Preview ${index}`}
                                                    />
                                                )}
                                                <ThumbnailOverlay onClick={() => removeImage(index, false)}>
                                                    <DeleteIcon fontSize="small" color="error" />
                                                </ThumbnailOverlay>
                                            </Thumbnail>
                                        ))}
                                    </ThumbnailContainer>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {marketplaceType === MarketplaceType.SERVICES && (
                        <ServiceSlotsEditor
                            slots={good.serviceSlots || []}
                            onSlotsChange={handleServiceSlotsChange}
                        />
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6">Скидка</Typography>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={hasDiscount}
                                            onChange={(e) => setHasDiscount(e.target.checked)}
                                        />
                                    }
                                    label={hasDiscount ? 'Скидка активна' : 'Добавить скидку'}
                                />
                            </Box>

                            {hasDiscount && (
                                <DiscountForm elevation={0}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <FormControl fullWidth>
                                                <InputLabel>Тип скидки</InputLabel>
                                                <Select
                                                    value={discount.discountType}
                                                    onChange={handleDiscountTypeChange}
                                                    label="Тип скидки"
                                                >
                                                    <MenuItem value={DiscountType.PERCENTAGE}>Процентная</MenuItem>
                                                    <MenuItem value={DiscountType.AMOUNT}>Фиксированная</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                fullWidth
                                                label={
                                                    discount.discountType === DiscountType.PERCENTAGE ?
                                                        'Процент скидки' : 'Сумма скидки'
                                                }
                                                name="discountValue"
                                                type="number"
                                                value={discount.discountValue}
                                                onChange={handleDiscountChange}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            {discount.discountType === DiscountType.PERCENTAGE ? '%' : '₽'}
                                                        </InputAdornment>
                                                    ),
                                                    inputProps: {
                                                        min: 0,
                                                        max: discount.discountType === DiscountType.PERCENTAGE ? 100 : undefined
                                                    }
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Divider sx={{ my: 1 }} />
                                            <Typography variant="subtitle1">Итоговая цена:</Typography>
                                            <Typography variant="h5" color="primary">
                                                {calculateFinalPrice().toFixed(2)} ₽
                                            </Typography>
                                            {hasDiscount && (
                                                <Typography variant="caption" color="textSecondary">
                                                    {discount.discountType === DiscountType.PERCENTAGE ?
                                                        `${discount.discountValue}% скидка` :
                                                        `${discount.discountValue} ₽ скидка`}
                                                </Typography>
                                            )}
                                        </Grid>
                                    </Grid>
                                </DiscountForm>
                            )}
                        </CardContent>
                    </Card>

                    <Box mt={3}>
                        {isCreate ? (
                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                startIcon={<SaveIcon />}
                                type="submit"
                            >
                                Создать {marketplaceType === MarketplaceType.GOODS ? 'товар' : 'услугу'}
                            </Button>
                        ) : (
                            <>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    type="submit"
                                    sx={{ mb: 2 }}
                                >
                                    Сохранить изменения
                                </Button>
                                {getStatusButtons(good?.status ?? GoodStatus.DRAFT, handleStatusChanged)}
                            </>
                        )}
                        <Typography variant="h6" mt={3}>Нет нужной категории? </Typography>
                        <Button
                            fullWidth
                            variant='outlined'
                            size="large"
                            startIcon={<AddIcon />}
                            onClick={() => setCategoryCreationRequestModalOpen(true)}
                        >
                            Оформить заявку на добавление категории
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <CreateCategoryRequestModal
                open={categoryCreationRequestModalOpen}
                onClose={() => setCategoryCreationRequestModalOpen(false)}
            />
        </Box>
    );
};

export default CreateGoodPage;