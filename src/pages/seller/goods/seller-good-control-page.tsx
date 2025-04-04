import React, {useState, useCallback, useEffect, useMemo} from 'react';
import {useMatch, useNavigate} from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import styled from 'styled-components';
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    FormControl,
    Grid,
    InputAdornment,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
    Paper,
    Switch,
    FormControlLabel
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
    $categories,
    $loggedUser,
    createNewGoodFx,
    ModifyGoodType,
    DiscountType,
    GoodDiscount,
    loadCategories,
    loadGoodByIdFx, Good
} from "../../../api";
import {useUnit} from "effector-react";
import {extractIdFromPath, getCategoryPathMapFromArray} from "../../../services";

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

const CreateGoodPage: React.FC<CreateGoodPageProps> = ({isCreate}: CreateGoodPageProps) => {
    const match = useMatch('/seller/goods/:id');
    const goodId = extractIdFromPath(match);
    const navigate = useNavigate();
    const categoriesStore = useUnit($categories);
    const loggedUser = useUnit($loggedUser);
    const categories = useMemo(() => getCategoryPathMapFromArray(categoriesStore),
        [categoriesStore]);

    const [good, setGood] = useState<ModifyGoodType>({
        name: '',
        description: '',
        price: 0,
        categoryId: -1
    });
    const [images, setImages] = useState<{image: string; file: File}[]>([]);
    const [hasDiscount, setHasDiscount] = useState(false);
    const [discount, setDiscount] = useState<GoodDiscount>({
        discountType: DiscountType.PERCENTAGE,
        discountValue: 0
    });

    useEffect(() => {
        loadCategories();
    }, []);

    useEffect(() => {
        if (!isCreate) {
            loadGoodByIdFx({id: goodId as number}).then(response => {
                const good = response as Good;
                const modifyGoodType: ModifyGoodType = {
                    name: good.name,
                    description: good.description,
                    price: good.price,
                    status: good.status,
                    categoryId: good.categoryId
                };
                setGood(modifyGoodType);
            });
        }
    }, [goodId, isCreate]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const newImages = acceptedFiles.map(file => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            return {
                image: null,
                file
            };
        });

        setImages(prev => [...prev, ...newImages]);

        // Update images with data URLs when loaded
        acceptedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = () => {
                setImages(prev => {
                    const updated = [...prev];
                    const imgIndex = prev.length - acceptedFiles.length + index;
                    updated[imgIndex].image = reader.result;
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

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGood(prev => ({ ...prev, [name]: value }));
    };

    const handleCategoryChange = (e: any) => {
        setGood(prev => ({ ...prev, categoryId: e.target.value }));
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        createNewGoodFx({
            name: good.name,
            description: good.description,
            price: good.price,
            status: good.status,
            categoryId: good.categoryId,
            userId: loggedUser.id,
            images: images.map(img => img.file),
            discount: hasDiscount ? discount : undefined
        }).then((response) => {
            // После успешного сохранения можно перенаправить на страницу товаров
            if (response) {
                navigate('/seller/goods');
            }
        });
    };

    const calculateFinalPrice = () => {
        const price = parseFloat(good.price) || 0;
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
                <Typography variant="h4">Создание нового товара</Typography>
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
                                        label="Название товара"
                                        name="name"
                                        value={good.name}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Описание товара"
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
                                            {[...categories.entries()].map(category => (
                                                <MenuItem key={category[0]} value={category[0]}>
                                                    {category[1]}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>Фотографии товара</Typography>
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

                            {images.length > 0 && (
                                <>
                                    <Typography variant="subtitle2">Загруженные изображения:</Typography>
                                    <ThumbnailContainer>
                                        {images.map((img, index) => (
                                            <Thumbnail key={index}>
                                                {img.image && (
                                                    <ThumbnailImage
                                                        src={img.image.toString()}
                                                        alt={`Preview ${index}`}
                                                    />
                                                )}
                                                <ThumbnailOverlay onClick={() => removeImage(index)}>
                                                    <DeleteIcon fontSize="small" color="error" />
                                                </ThumbnailOverlay>
                                            </Thumbnail>
                                        ))}
                                    </ThumbnailContainer>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={4}>
                    {/*<Card>*/}
                    {/*    <CardContent>*/}
                    {/*        <Typography variant="h6" gutterBottom>Статус товара</Typography>*/}
                    {/*        <FormControl fullWidth>*/}
                    {/*            <InputLabel id="status-label">Статус</InputLabel>*/}
                    {/*            <Select*/}
                    {/*                labelId="status-label"*/}
                    {/*                label="Статус"*/}
                    {/*                value={good.status}*/}
                    {/*                onChange={(e) => setGood(prev => ({ ...prev, status: e.target.value }))}*/}
                    {/*            >*/}
                    {/*                <MenuItem value="ON_SALE">В продаже</MenuItem>*/}
                    {/*                <MenuItem value="READY_FOR_SELL">Готов к продаже</MenuItem>*/}
                    {/*            </Select>*/}
                    {/*        </FormControl>*/}
                    {/*    </CardContent>*/}
                    {/*</Card>*/}

                    <Card>
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
                    {isCreate && <Box mt={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            size="large"
                            startIcon={<SaveIcon />}
                            type="submit"
                        >
                            Создать товар
                        </Button>
                    </Box>}
                    {!isCreate && <Box mt={3}>
                        <Button
                            fullWidth
                            variant="contained"
                            color='error'
                            size="large"
                            startIcon={<DeleteIcon />}
                        >
                            Снять с продажи
                        </Button>
                    </Box>}
                </Grid>
            </Grid>
        </Box>
    );
};

export default CreateGoodPage;