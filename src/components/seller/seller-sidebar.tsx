import React, {useEffect} from 'react';
import {Box, List, ListItem, ListItemButton, ListItemText, Avatar, Typography} from '@mui/material';
import {Link, useLocation, useNavigate} from 'react-router-dom';
import styled from 'styled-components';
import {EditProfileLink} from "../common";
import {$loggedUser} from "../../api";
import {useUnit} from "effector-react";
import {$store, loadStoreByUser} from "../../api/models/store.ts";
import StoreIcon from '@mui/icons-material/Store';

const Sidebar = styled(Box)`
    width: 250px;
    background-color: #f5f5f5;
    border-right: 1px solid #e0e0e0;
    border-radius: 12px;
    margin: 16px;
    padding: 16px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const StoreInfo = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const StoreName = styled(Typography)`
    font-weight: 600;
    font-size: 18px;
`;

const sections = [
    {id: 'main', label: 'Главная', path: 'main'},
    {id: 'goods-prices', label: 'Товары и цены', path: 'goods'},
    {id: 'supplies', label: 'Поставки', path: 'supplies'},
    {id: 'orders', label: 'Заказы', path: 'orders'},
    {id: 'analytics', label: 'Аналитика', path: 'analytics'},
    {id: 'reviews', label: 'Отзывы', path: 'reviews'},
];

const SellerSidebar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const user = useUnit($loggedUser);
    const store = useUnit($store);

    useEffect(() => {
        loadStoreByUser({userId: user?.id});
    }, [user?.id]);

    return <>
        <Sidebar>
            <StoreInfo>
                <StoreIcon fontSize='large'/>
                <StoreName>{store.name}</StoreName>
                <EditProfileLink component={Link} to="edit">
                    Редактировать магазин
                </EditProfileLink>
            </StoreInfo>

            {/* Список разделов */}
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

                <ListItem key='logout' disablePadding onClick={() => navigate('/profile/main')}>
                    <ListItemButton component={Link}>
                        <ListItemText primary='Войти как покупатель'/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Sidebar>
    </>;
};

export default SellerSidebar;