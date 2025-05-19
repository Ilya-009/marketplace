import React, {useEffect, useState} from 'react';
import {
    Alert,
    Box,
    Button,
    Checkbox,
    Collapse,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    FormControlLabel,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Snackbar,
    TextField,
    Typography,
} from '@mui/material';
import {
    Add as AddIcon,
    Close as CloseIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    UnfoldMore,
} from '@mui/icons-material';
import styled from 'styled-components';
import {SidebarPageBox} from "../../components";
import SaveIcon from "@mui/icons-material/Save";
import {
    CategoryParamType, CategoryStatus,
    GoodCategory,
    GoodCategoryChange,
    GoodCategoryChangeType,
    GoodCategoryParam,
    loadCategoriesFx, saveCategories
} from "../../api";
import {findCategoryById} from "../../services";

const changedCategories: GoodCategoryChange[] = [];

const CategoryManagement: React.FC = () => {
    const [categories, setCategories] = useState<GoodCategory[]>([]);
    const [expandedIds, setExpandedIds] = useState<number[]>([1]);
    const [selectedCategory, setSelectedCategory] = useState<GoodCategory | null>(null);
    const [editingCategory, setEditingCategory] = useState<GoodCategory | null>(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteWithChildren, setDeleteWithChildren] = useState(false);
    const [filterDialogOpen, setFilterDialogOpen] = useState(false);
    const [currentFilters, setCurrentFilters] = useState<GoodCategoryParam[]>([]);
    const [newFilter, setNewFilter] = useState<Omit<GoodCategoryParam, 'id'>>({
        name: '',
        type: CategoryParamType.SELECT
    });
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
    const [createRoot, setCreateRoot] = useState<boolean>(false);


    useEffect(() => {
        loadCategoriesFx().then(res => setCategories(res));
    }, []);

    const toggleExpand = (id: number) => {
        setExpandedIds(prev =>
            prev.includes(id)
                ? prev.filter(i => i !== id)
                : [...prev, id]
        );
    };

    const handleSelect = (category: GoodCategory) => {
        setSelectedCategory(category);
        setEditingCategory(null);
        setNewCategoryName('');
        setParentCategoryId(null);
    };

    const handleAddNew = (parentId: number | null = null) => {
        setParentCategoryId(parentId);
        setEditingCategory(null);
        setNewCategoryName('');
        setCreateRoot(parentId == null);
    };

    const handleEdit = (category: GoodCategory) => {
        setEditingCategory(category);
        setNewCategoryName(category.name);
        setParentCategoryId(null);
    };

    const handleDeleteClick = (category: GoodCategory) => {
        setSelectedCategory(category);
        setDeleteDialogOpen(true);
    };

    function addCreatedCategory(category: GoodCategory) {
        const changed: GoodCategoryChange = {...category, changeType: GoodCategoryChangeType.CREATE};
        changedCategories.push(changed);
    }

    function addChangedCategory(categories: GoodCategory[], id: number, changeType: GoodCategoryChangeType) {
        const updatedCategory = findCategoryById(categories, id);
        if (updatedCategory !== undefined) {
            const changed: GoodCategoryChange = {...updatedCategory, changeType: changeType};

            if (changed.changeType === GoodCategoryChangeType.DELETE) {
                changed.deleteChildCategories = deleteWithChildren;
            }

            changedCategories.push(changed);
        }
    }

    const handleDeleteConfirm = () => {
        if (!selectedCategory) return;

        const deleteCategory = (cats: GoodCategory[], id: number, withChildren: boolean): GoodCategory[] => {
            return cats.reduce<GoodCategory[]>((acc, cat) => {
                if (cat.id === id) {
                    if (withChildren) {
                        return acc; // Skip this category and all children
                    }
                    // Keep children but remove the category itself
                    return [...acc, ...(cat.childCategories || [])];
                }

                const updatedCat = {
                    ...cat,
                    childCategories: cat.childCategories ? deleteCategory(cat.childCategories, id, withChildren) : undefined
                };
                return [...acc, updatedCat];
            }, []);
        };

        addChangedCategory(categories, selectedCategory.id, GoodCategoryChangeType.DELETE);
        const updatedCategories = deleteCategory(categories, selectedCategory.id, deleteWithChildren);

        setCategories(updatedCategories);
        setDeleteDialogOpen(false);
        setSelectedCategory(null);
        showSnackbar('Категория удалена', 'success');
    };

    const handleSave = () => {
        if (!newCategoryName.trim()) {
            showSnackbar('Название категории не может быть пустым', 'error');
            return;
        }

        setCreateRoot(false);

        if (editingCategory) {
            // Edit existing category
            const updateCategory = (cats: GoodCategory[]): GoodCategory[] => {
                return cats.map(cat => {
                    if (cat.id === editingCategory.id) {
                        return { ...cat, name: newCategoryName };
                    }
                    if (cat.childCategories) {
                        return { ...cat, childCategories: updateCategory(cat.childCategories) };
                    }
                    return cat;
                });
            };

            const updatedCategories = updateCategory(categories);
            addChangedCategory(updatedCategories, editingCategory.id, GoodCategoryChangeType.UPDATE);
            setCategories(updatedCategories);
            showSnackbar('Категория обновлена', 'success');
        } else {
            // Add new category
            const newCategory: GoodCategory = {
                id: -1,
                name: newCategoryName,
                status: CategoryStatus.ACTIVE,
                childCategories: []
            };

            if (parentCategoryId === null) {
                // Add to root
                setCategories([...categories, newCategory]);

                // Помечаем категорию на добавление
                addCreatedCategory(newCategory);
            } else {
                findCategoryById(categories, parentCategoryId)?.childCategories?.push(newCategory);

                // Помечаем родительскую категорию на изменение т.к. в нее добавлен
                addChangedCategory(categories, parentCategoryId, GoodCategoryChangeType.UPDATE);
            }

            showSnackbar('Категория добавлена', 'success');
        }

        setEditingCategory(null);
        setNewCategoryName('');
        setParentCategoryId(null);
    };

    const findAllIds = (cats: GoodCategory[]): number[] => {
        return cats.reduce<number[]>((acc, cat) => {
            acc.push(cat.id);
            if (cat.childCategories) {
                acc.push(...findAllIds(cat.childCategories));
            }
            return acc;
        }, []);
    };

    const handleOpenFilterDialog = (category: GoodCategory) => {
        setSelectedCategory(category);
        setCurrentFilters(category.params || []);
        setFilterDialogOpen(true);
    };

    const handleAddFilter = () => {
        if (!newFilter.name.trim()) {
            showSnackbar('Название фильтра не может быть пустым', 'error');
            return;
        }

        const newFilterWithId: GoodCategoryParam = {
            ...newFilter,
            id: Math.max(0, ...currentFilters.map(f => f.id)) + 1
        };

        setCurrentFilters([...currentFilters, newFilterWithId]);
        setNewFilter({ name: '', type: CategoryParamType.SELECT });
    };

    const handleRemoveFilter = (id: number) => {
        setCurrentFilters(currentFilters.filter(f => f.id !== id));
    };

    const handleSaveFilters = () => {
        if (!selectedCategory) return;

        const updateCategoryWithFilters = (cats: GoodCategory[]): GoodCategory[] => {
            return cats.map(cat => {
                if (cat.id === selectedCategory.id) {
                    return { ...cat, params: currentFilters };
                }
                if (cat.childCategories) {
                    return { ...cat, childCategories: updateCategoryWithFilters(cat.childCategories) };
                }
                return cat;
            });
        };

        const updated = updateCategoryWithFilters(categories);
        addChangedCategory(updated, selectedCategory.id, GoodCategoryChangeType.UPDATE);
        setCategories(updated);
        setFilterDialogOpen(false);
        showSnackbar('Фильтры сохранены', 'success');
    };

    const showSnackbar = (message: string, severity: 'success' | 'error') => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSaveChanges = async () => {
        try {
            saveCategories(changedCategories);
            showSnackbar('Изменения успешно сохранены', 'success');
        } catch (error) {
            showSnackbar('Ошибка при сохранении изменений', 'error');
        }
    };

    const renderCategory = (category: GoodCategory, depth = 0) => {
        const hasChildren = category.childCategories && category.childCategories.length > 0;
        const isExpanded = expandedIds.includes(category.id);

        return (
            <React.Fragment key={category.id}>
                <ListItem
                    button
                    onClick={() => handleSelect(category)}
                    style={{
                        paddingLeft: `${16 + depth * 16}px`,
                        backgroundColor: selectedCategory?.id === category.id ? '#f0f0f0' : 'inherit'
                    }}
                >
                    {hasChildren ? (
                        <IconButton
                            size="small"
                            onClick={(e) => {
                                e.stopPropagation();
                                toggleExpand(category.id);
                            }}
                        >
                            <UnfoldMore/>
                        </IconButton>
                    ) : (
                        <Box width={40} display="inline-block" />
                    )}
                    <ListItemText primary={category.name} />
                </ListItem>

                {/* Вот это ключевое исправление: */}
                {hasChildren && (
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {category.childCategories!.map(child => renderCategory(child, depth + 1))}
                        </List>
                    </Collapse>
                )}
            </React.Fragment>
        );
    };

    return (
        <SidebarPageBox sx={{width: '90%'}}>
            <Header>
                <Typography variant="h4">Управление категориями</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<AddIcon />}
                    onClick={() => handleAddNew()}
                >
                    Добавить категорию
                </Button>
                <Button
                    variant="contained"
                    color="success"
                        onClick={handleSaveChanges}
                    style={{ marginTop: '16px' }}
                    startIcon={<SaveIcon />}
                >
                    Сохранить изменения
                </Button>
            </Header>

            <Content>
                <TreeSection>
                    <Paper elevation={3} style={{ padding: '8px' }}>
                        <List>
                            {categories.map(category => renderCategory(category))}
                        </List>
                    </Paper>
                </TreeSection>

                <EditSection>
                    <Paper elevation={3} style={{ padding: '20px' }}>
                        {editingCategory || parentCategoryId !== null || createRoot ? (
                            <>
                                <Typography variant="h6">
                                    {editingCategory ? 'Редактировать категорию' : 'Добавить новую категорию'}
                                </Typography>
                                <TextField
                                    fullWidth
                                    label="Название категории"
                                    value={newCategoryName}
                                    onChange={e => setNewCategoryName(e.target.value)}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSave}
                                    style={{ marginTop: '16px' }}
                                >
                                    Сохранить
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={() => {
                                        setEditingCategory(null);
                                        setParentCategoryId(null);
                                        setCreateRoot(false);
                                    }}
                                    style={{ marginTop: '16px', marginLeft: '16px' }}
                                >
                                    Отмена
                                </Button>
                            </>
                        ) : selectedCategory ? (
                            <>
                                <Typography variant="h6">{selectedCategory.name}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    ID: {selectedCategory.id}
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    startIcon={<EditIcon />}
                                    onClick={() => handleEdit(selectedCategory)}
                                    style={{ marginTop: '16px' }}
                                >
                                    Редактировать
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    startIcon={<DeleteIcon />}
                                    onClick={() => handleDeleteClick(selectedCategory)}
                                    style={{ marginTop: '16px', marginLeft: '16px' }}
                                >
                                    Удалить
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<AddIcon />}
                                    onClick={() => handleAddNew(selectedCategory.id)}
                                    style={{ marginTop: '16px', marginLeft: '16px' }}
                                >
                                    Добавить подкатегорию
                                </Button>
                                {/*<Button*/}
                                {/*    variant="outlined"*/}
                                {/*    onClick={() => handleOpenFilterDialog(selectedCategory)}*/}
                                {/*    style={{ marginTop: '16px', marginLeft: '16px' }}*/}
                                {/*>*/}
                                {/*    Управление фильтрами*/}
                                {/*</Button>*/}
                            </>
                        ) : (
                            <Typography variant="body1">Выберите категорию или создайте новую</Typography>
                        )}
                    </Paper>
                </EditSection>
            </Content>

            {/* Delete confirmation dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>Подтверждение удаления</DialogTitle>
                <DialogContent>
                    <Typography>
                        Вы уверены, что хотите удалить категорию "{selectedCategory?.name}"?
                    </Typography>
                    {selectedCategory?.childCategories?.length ? (
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={deleteWithChildren}
                                    onChange={e => setDeleteWithChildren(e.target.checked)}
                                    color="primary"
                                />
                            }
                            label="Удалить все дочерние категории"
                            style={{ marginTop: '16px' }}
                        />
                    ) : null}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleDeleteConfirm} color="secondary">
                        Удалить
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Filter management dialog */}
            <Dialog
                open={filterDialogOpen}
                onClose={() => setFilterDialogOpen(false)}
                fullWidth
                maxWidth="md"
            >
                <DialogTitle>
                    Управление фильтрами для "{selectedCategory?.name}"
                    <IconButton
                        style={{ position: 'absolute', right: '8px', top: '8px' }}
                        onClick={() => setFilterDialogOpen(false)}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <FilterForm>
                        <Typography variant="h6">Добавить новый фильтр</Typography>
                        <TextField
                            fullWidth
                            label="Название фильтра"
                            value={newFilter.name}
                            onChange={e => setNewFilter({ ...newFilter, name: e.target.value })}
                            margin="normal"
                            variant="outlined"
                        />
                        <TextField
                            select
                            fullWidth
                            label="Тип фильтра"
                            value={newFilter.type}
                            onChange={e => setNewFilter({
                                ...newFilter,
                                type: e.target.value as CategoryParamType
                            })}
                            margin="normal"
                            variant="outlined"
                            SelectProps={{
                                native: true,
                            }}
                        >
                            <option value="text">Текст</option>
                            <option value="number">Число</option>
                            <option value="select">Выпадающий список</option>
                            <option value="checkbox">Чекбокс</option>
                        </TextField>
                        {newFilter.type === CategoryParamType.SELECT && (
                            <TextField
                                fullWidth
                                label="Варианты выбора (через запятую)"
                                placeholder="Например: Красный, Синий, Зеленый"
                                value={newFilter.options?.join(', ') || ''}
                                onChange={e => setNewFilter({
                                    ...newFilter,
                                    options: e.target.value.split(',').map(opt => opt.trim())
                                })}
                                margin="normal"
                                variant="outlined"
                            />
                        )}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleAddFilter}
                            style={{ marginTop: '16px' }}
                        >
                            Добавить фильтр
                        </Button>
                    </FilterForm>

                    <Divider style={{ margin: '24px 0' }} />

                    <Typography variant="h6">Текущие фильтры</Typography>
                    {currentFilters.length === 0 ? (
                        <Typography variant="body2" color="textSecondary">
                            Нет добавленных фильтров
                        </Typography>
                    ) : (
                        <FiltersList>
                            {currentFilters.map(filter => (
                                <FilterItem key={filter.id}>
                                    <FilterInfo>
                                        <Typography><strong>{filter.name}</strong></Typography>
                                        <Typography variant="body2">
                                            Тип: {getFilterTypeName(filter.type)}
                                            {filter.options && ` • Варианты: ${filter.options.join(', ')}`}
                                        </Typography>
                                    </FilterInfo>
                                    <IconButton
                                        size="small"
                                        onClick={() => handleRemoveFilter(filter.id)}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </FilterItem>
                            ))}
                        </FiltersList>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setFilterDialogOpen(false)} color="primary">
                        Отмена
                    </Button>
                    <Button onClick={handleSaveFilters} color="primary" variant="contained">
                        Сохранить
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity={snackbarSeverity}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </SidebarPageBox>
    );
};

const getFilterTypeName = (type: CategoryParamType): string => {
    switch (type) {
        case CategoryParamType.SELECT: return 'Выпадающий список';
        case CategoryParamType.CHECKBOX: return 'Чекбокс';
        default: return type;
    }
};

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
`;

const Content = styled.div`
    display: flex;
    gap: 24px;
`;

const TreeSection = styled.div`
    flex: 1;
    max-width: 500px;
`;

const EditSection = styled.div`
    flex: 2;
`;

const FilterForm = styled.div`
    margin-bottom: 24px;
`;

const FiltersList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const FilterItem = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background-color: #f5f5f5;
    border-radius: 4px;
`;

const FilterInfo = styled.div`
    flex: 1;
`;

export default CategoryManagement;