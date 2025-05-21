import React from 'react';
import {Box, List, ListItem, ListItemButton, ListItemText, Typography} from '@mui/material';
import {Link, useLocation} from 'react-router-dom';
import styled from 'styled-components';

const Sidebar = styled(Box)`
    width: 250px;
    background-image: linear-gradient(rgba(255, 255, 255, 0.051), rgba(255, 255, 255, 0.051));
    border-radius: 12px;
    margin: 16px;
    padding: 16px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const sections = [
    {id: 'properties', label: 'Настройки', path: 'properties'},
    {id: 'categories', label: 'Категории', path: 'categories'},
    {id: 'categoryRequests', label: 'Запросы на добавление категорий', path: 'categoryRequests'},
    {id: 'goodRequests', label: 'Запросы на создание и изменение товаров', path: 'goodRequests'},
    {id: 'paymentMethods', label: 'Способы оплаты', path: 'paymentMethods'},
    {id: 'deliveryMethods', label: 'Способы доставки', path: 'deliveryMethods'},
    {id: 'profit', label: 'Прибыль маркетплейса', path: 'profit'},
    {id: 'users', label: 'Пользователи и роли', path: 'users'}
];

const AdminSidebar: React.FC = () => {
    const location = useLocation();

    return <>
        <Sidebar>
            <UserInfo>
                <Typography>Админ - панель</Typography>
            </UserInfo>

            <List>
                {sections.map((section) => (
                    <ListItem key={section.id} disablePadding>
                        <ListItemButton
                            component={Link}
                            to={section.path}
                            selected={location.pathname.endsWith(section.path)}
                        >
                            <ListItemText primary={section.label}/>
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Sidebar>
    </>;
};

export default AdminSidebar;