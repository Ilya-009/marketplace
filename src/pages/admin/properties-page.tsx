import React, { useState, useEffect } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Select,
    MenuItem,
    TextField,
    IconButton,
    Typography,
    Button,
    Box,
    Alert,
    TableSortLabel,
    InputAdornment, TableContainer, SelectChangeEvent
} from '@mui/material';
import {
    Edit as EditIcon,
    Save as SaveIcon,
    Delete as DeleteIcon,
    Add as AddIcon,
    Search as SearchIcon, Cancel
} from '@mui/icons-material';
import { SidebarPageBox } from "../../components";
import {
    createPropertyFx,
    deleteProperty,
    loadPropertiesFx,
    Property,
    PropertyGroup,
    SettingType,
    updatePropertyFx
} from "../../api";
import styled from "styled-components";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import {propertyGroups, propertyTypes} from "../../constants.ts";
import {renderEditControl, renderValueDisplay} from "../../components";

const StyledTableContainer = styled(TableContainer)({
    marginTop: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
});

const SettingsManagementPage: React.FC = () => {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
    const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
    const [newPropertyDialogOpen, setNewPropertyDialogOpen] = useState<boolean>(false);
    const [newProperty, setNewProperty] = useState<Omit<Property, 'id'>>({
        key: '',
        displayName: '',
        settingType: SettingType.STRING,
        propertyGroup: PropertyGroup.MAIN,
        description: '',
        value: '',
        removable: true
    });

    // Новые состояния для фильтрации и сортировки
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [selectedType, setSelectedType] = useState<SettingType | 'ALL'>('ALL');
    const [selectedGroup, setSelectedGroup] = useState<PropertyGroup | 'ALL'>('ALL');
    const [orderBy, setOrderBy] = useState<keyof Property>('key');
    const [order, setOrder] = useState<'asc' | 'desc'>('asc');

    // Загрузка настроек
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const response = await loadPropertiesFx();
                setProperties(response);
                setLoading(false);
            } catch (err) {
                setError('Не удалось загрузить настройки');
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
        setItemsPerPage(Number(event.target.value));
        setCurrentPage(1);
    };

    // Обработчики пагинации
    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    // Обработчики редактирования
    const handleEdit = (id: number) => {
        setEditingId(id);
    };

    const handleSave = async (property: Property) => {
        try {
            const response = await updatePropertyFx({id: property.id, value: property.value});

            setProperties(prev => prev.map(p =>
                p.id === property.id ? response : p
            ));
            setEditingId(null);
        } catch (err) {
            setError('Не удалось сохранить настройку');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
    };

    const handleValueChange = (id: number, value: string) => {
        setProperties(prev => prev.map(p =>
            p.id === id ? { ...p, value } : p
        ));
    };

    // Обработчики удаления
    const handleDeleteClick = (property: Property) => {
        setPropertyToDelete(property);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!propertyToDelete) return;

        try {
            setProperties(prev => prev.filter(p => p.id !== propertyToDelete.id));
            setDeleteDialogOpen(false);
            deleteProperty({id: propertyToDelete.id});
        } catch (err) {
            setError('Не удалось удалить настройку');
        }
    };

    // Обработчики создания новой настройки
    const handleCreateProperty = async () => {
        try {
            setLoading(true);
            // TODO: Реализовать функционал создания настроек с типом IMAGE
            const createdProperty = await createPropertyFx(newProperty);
            setLoading(false);

            setProperties(prev => [...prev, createdProperty]);
            setNewPropertyDialogOpen(false);
            setNewProperty({
                key: '',
                displayName: '',
                settingType: SettingType.STRING,
                propertyGroup: PropertyGroup.MAIN,
                description: '',
                value: '',
                removable: true
            });
        } catch (err) {
            setError('Не удалось создать настройку');
        }
    };

    // Вычисление индексов для пагинации
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    if (loading) return <div>Загрузка...</div>;
    if (error) return <Alert severity="error">{error}</Alert>;

    // Функция для сортировки
    const stableSort = (array: Property[], comparator: (a: Property, b: Property) => number) => {
        const stabilizedThis = array.map((el, index) => [el, index] as [Property, number]);
        stabilizedThis.sort((a, b) => {
            const order = comparator(a[0], b[0]);
            if (order !== 0) return order;
            return a[1] - b[1];
        });
        return stabilizedThis.map((el) => el[0]);
    };

    const getComparator = (order: 'asc' | 'desc', orderBy: keyof Property): (a: Property, b: Property) => number => {
        return order === 'desc'
            ? (a, b) => descendingComparator(a, b, orderBy)
            : (a, b) => -descendingComparator(a, b, orderBy);
    };

    const descendingComparator = (a: Property, b: Property, orderBy: keyof Property) => {
        if (b[orderBy] < a[orderBy]) {
            return -1;
        }
        if (b[orderBy] > a[orderBy]) {
            return 1;
        }
        return 0;
    };

    // Функция для создания обработчика сортировки
    const createSortHandler = (property: keyof Property) => () => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    // Функция фильтрации
    const filteredProperties = properties.filter(property => {
        const matchesSearch =
            property.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.displayName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesType = selectedType === 'ALL' || property.settingType === selectedType;
        const matchesGroup = selectedGroup === 'ALL' || property.propertyGroup === selectedGroup;

        return matchesSearch && matchesType && matchesGroup;
    });

    // Применяем сортировку
    const sortedProperties = stableSort(filteredProperties, getComparator(order, orderBy));

    // Обновляем пагинацию для отфильтрованных данных
    const currentItems = sortedProperties.slice(indexOfFirstItem, indexOfLastItem);

    // Обработчик изменения типа при создании
    const handleNewPropertyTypeChange = (type: SettingType) => {
        const defaultValue = propertyTypes.get(type)?.defaultValue ?? '';

        setNewProperty(prev => ({
            ...prev,
            settingType: type,
            value: defaultValue,
            allowedValues: type === SettingType.SELECT ? ['вариант1', 'вариант2'] : undefined
        }));
    };

    // Форма создания новой настройки
    const renderNewPropertyForm = () => {
        return (
            <Dialog
                open={newPropertyDialogOpen}
                onClose={() => setNewPropertyDialogOpen(false)}
                fullWidth
                maxWidth="sm"
            >
                <DialogTitle>Создание новой настройки</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} mt={2}>
                        <TextField
                            label="Ключ"
                            value={newProperty.key}
                            onChange={(e) => setNewProperty(prev => ({...prev, key: e.target.value}))}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Отображаемое имя"
                            value={newProperty.displayName}
                            onChange={(e) => setNewProperty(prev => ({...prev, displayName: e.target.value}))}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Описание"
                            value={newProperty.description}
                            onChange={(e) => setNewProperty(prev => ({...prev, description: e.target.value}))}
                            fullWidth
                            multiline
                            rows={3}
                        />
                        <Select
                            label="Тип настройки"
                            value={newProperty.settingType}
                            onChange={(e) => handleNewPropertyTypeChange(e.target.value as SettingType)}
                            fullWidth
                        >
                            {Object.values(SettingType).map(type => (
                                <MenuItem key={type} value={type}>{type}</MenuItem>
                            ))}
                        </Select>

                        {newProperty.settingType === SettingType.SELECT && (
                            <TextField
                                label="Допустимые значения (через запятую)"
                                value={newProperty.allowedValues?.join(',') || ''}
                                onChange={(e) => setNewProperty(prev => ({
                                    ...prev,
                                    allowedValues: e.target.value.split(',').map(v => v.trim())
                                }))}
                                fullWidth
                            />
                        )}

                        <Select
                            label="Группа"
                            value={newProperty.propertyGroup}
                            onChange={(e) => setNewProperty(prev => ({
                                ...prev,
                                propertyGroup: e.target.value as PropertyGroup
                            }))}
                            fullWidth
                        >
                            {Object.values(PropertyGroup).map(group => (
                                <MenuItem key={group} value={group}>{group}</MenuItem>
                            ))}
                        </Select>

                        {renderEditControl(
                            {...newProperty, id: 0}, // временный id для совместимости
                            (value) => setNewProperty(prev => ({...prev, value}))
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNewPropertyDialogOpen(false)}>Отмена</Button>
                    <Button
                        onClick={handleCreateProperty}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={!newProperty.key || !newProperty.value || !newProperty.displayName}
                    >
                        Создать
                    </Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <SidebarPageBox sx={{ width: '90%' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h4" gutterBottom>
                    Управление настройками
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setNewPropertyDialogOpen(true)}
                >
                    Добавить настройку
                </Button>
            </Box>

            <Select
                variant='outlined'
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                sx={{ marginBottom: '20px' }}
            >
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
            </Select>

            {/* Панель фильтрации и поиска */}
            <Box display="flex" gap={2} mb={3} flexWrap="wrap">
                <TextField
                    variant="outlined"
                    placeholder="Поиск по ключу или названию..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ minWidth: 300, flexGrow: 1 }}
                />

                <Select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value as SettingType | 'ALL')}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="ALL">Все типы</MenuItem>
                    {Object.values(SettingType).map(type => (
                        <MenuItem key={type} value={type}>{propertyTypes.get(type)?.name}</MenuItem>
                    ))}
                </Select>

                <Select
                    value={selectedGroup}
                    onChange={(e) => setSelectedGroup(e.target.value as PropertyGroup | 'ALL')}
                    displayEmpty
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="ALL">Все группы</MenuItem>
                    {Object.values(PropertyGroup).map(group => (
                        <MenuItem key={group} value={group}>{propertyGroups.get(group)}</MenuItem>
                    ))}
                </Select>
            </Box>

            {/* Таблица с возможностью сортировки */}
            <StyledTableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sortDirection={orderBy === 'key' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'key'}
                                    direction={orderBy === 'key' ? order : 'asc'}
                                    onClick={createSortHandler('key')}
                                >
                                    Ключ
                                </TableSortLabel>
                            </TableCell>
                            <TableCell sortDirection={orderBy === 'displayName' ? order : false}>
                                <TableSortLabel
                                    active={orderBy === 'displayName'}
                                    direction={orderBy === 'displayName' ? order : 'asc'}
                                    onClick={createSortHandler('displayName')}
                                >
                                    Отображаемое имя
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'settingType'}
                                    direction={orderBy === 'settingType' ? order : 'asc'}
                                    onClick={createSortHandler('settingType')}
                                >
                                    Тип
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>
                                <TableSortLabel
                                    active={orderBy === 'propertyGroup'}
                                    direction={orderBy === 'propertyGroup' ? order : 'asc'}
                                    onClick={createSortHandler('propertyGroup')}
                                >
                                    Группа
                                </TableSortLabel>
                            </TableCell>
                            <TableCell>Значение</TableCell>
                            <TableCell>Действия</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map((property) => (
                            <TableRow key={property.id}>
                                <TableCell>{property.key}</TableCell>
                                <TableCell>{property.displayName}</TableCell>
                                <TableCell>{propertyTypes.get(property.settingType)?.name}</TableCell>
                                <TableCell>{propertyGroups.get(property.propertyGroup)}</TableCell>
                                <TableCell>
                                    {editingId === property.id ? (
                                        renderEditControl(property, (value) => handleValueChange(property.id, value))
                                    ) : (
                                        renderValueDisplay(property)
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingId === property.id ? (
                                        <>
                                            <IconButton onClick={() => handleSave(property)}>
                                                <SaveIcon />
                                            </IconButton>
                                            <IconButton onClick={handleCancel}>
                                                <Cancel />
                                            </IconButton>
                                        </>
                                    ) : (
                                        <IconButton onClick={() => handleEdit(property.id)}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {property.removable && (
                                        <IconButton
                                            onClick={() => handleDeleteClick(property)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>

            <Pagination
                count={Math.ceil(sortedProperties.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />

            {/* Диалог удаления */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    Вы уверены, что хотите удалить настройку "{propertyToDelete?.key}"?
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Отмена</Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        color="error"
                        startIcon={<DeleteIcon />}
                    >
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Диалог создания новой настройки */}
            {renderNewPropertyForm()}
        </SidebarPageBox>
    );
};

export default SettingsManagementPage;