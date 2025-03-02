import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Pagination,
    Select,
    MenuItem,
    TextField,
    IconButton,
    SelectChangeEvent, Typography
} from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon } from '@mui/icons-material';
import styled from '@emotion/styled';
import {SidebarPageBox} from "../../components";

// Тип для настройки
interface Setting {
    key: string;
    description: string;
    value: string;
}

// Моковые данные для примера
const mockSettings: Setting[] = [
    { key: 'theme', description: 'Цветовая тема', value: 'light' },
    { key: 'language', description: 'Язык интерфейса', value: 'ru' },
    { key: 'currency', description: 'Основная валюта', value: 'USD' },
    { key: 'notifications', description: 'Уведомления', value: 'enabled' },
    { key: 'welcome_message', description: 'Приветственное сообщение', value: 'Добро пожаловать!' },
    // Добавьте больше настроек по необходимости
];

// Стилизованный контейнер для таблицы
const StyledTableContainer = styled(TableContainer)({
    marginTop: '20px',
    borderRadius: '8px',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)'
});

const SettingsManagementPage: React.FC = () => {
    const [settings, setSettings] = useState<Setting[]>(mockSettings);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage, setItemsPerPage] = useState<number>(20);

    // Обработчик изменения количества элементов на странице
    const handleItemsPerPageChange = (event: SelectChangeEvent<number>) => {
        setItemsPerPage(event.target.value as number);
        setCurrentPage(1); // Сброс на первую страницу
    };

    // Обработчик изменения страницы
    const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

    // Обработчик начала редактирования
    const handleEdit = (key: string) => {
        setEditingKey(key);
    };

    // Обработчик сохранения изменений
    const handleSave = (key: string, newValue: string) => {
        setSettings(prevSettings =>
            prevSettings.map(setting =>
                setting.key === key ? { ...setting, value: newValue } : setting
            )
        );
        setEditingKey(null);
    };

    // Обработчик изменения значения
    const handleValueChange = (key: string, value: string) => {
        setSettings(prevSettings =>
            prevSettings.map(setting =>
                setting.key === key ? { ...setting, value } : setting
            )
        );
    };

    // Вычисление индексов для пагинации
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = settings.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <SidebarPageBox sx={{width: '90%'}}>
            <Typography variant="h4" gutterBottom>
                Управление настройками
            </Typography>

            <Select
                variant='outlined'
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                sx={{ marginBottom: '20px' }}

            >
                <MenuItem selected value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
            </Select>

            <StyledTableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Ключ</TableCell>
                            <TableCell>Описание</TableCell>
                            <TableCell>Значение</TableCell>
                            <TableCell>Действие</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {currentItems.map((setting) => (
                            <TableRow key={setting.key}>
                                <TableCell>{setting.key}</TableCell>
                                <TableCell>{setting.description}</TableCell>
                                <TableCell>
                                    {editingKey === setting.key ? (
                                        <TextField
                                            value={setting.value}
                                            onChange={(e) => handleValueChange(setting.key, e.target.value)}
                                            size="small"
                                        />
                                    ) : (
                                        setting.value
                                    )}
                                </TableCell>
                                <TableCell>
                                    {editingKey === setting.key ? (
                                        <IconButton onClick={() => handleSave(setting.key, setting.value)}>
                                            <SaveIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton onClick={() => handleEdit(setting.key)}>
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </StyledTableContainer>

            <Pagination
                count={Math.ceil(settings.length / itemsPerPage)}
                page={currentPage}
                onChange={handlePageChange}
                sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}
            />
        </SidebarPageBox>
    );
};

export default SettingsManagementPage;