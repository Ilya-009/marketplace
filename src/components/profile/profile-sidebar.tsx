import React, {useEffect} from 'react';
import {Box, List, ListItem, ListItemButton, ListItemText, Avatar, Typography} from '@mui/material';
import {Link, useLocation} from 'react-router-dom';
import styled from 'styled-components';
import {EditProfileLink} from "../common";
import {$customer, $loggedUser, defaultUserInfo, loadCustomer, logOut} from "../../api";
import {useUnit} from "effector-react";

const Sidebar = styled(Box)`
    width: 250px;
    background-color: #f5f5f5;
    border-right: 1px solid #e0e0e0;
    border-radius: 12px;
    margin: 16px;
    padding: 16px;
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
`;

const Content = styled(Box)`
    padding: 20px;
`;

const UserInfo = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const UserAvatar = styled(Avatar)`
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
`;

const UserName = styled(Typography)`
    font-weight: 600;
    font-size: 18px;
`;

const sections = [
    {id: 'main', label: 'Мои данные', path: 'main'},
    // {id: 'payment-methods', label: 'Способы оплаты', path: 'payment-methods'},
    {id: 'my-cart', label: 'Моя корзина', path: '/cart'},
    {id: 'my-orders', label: 'Мои заказы', path: 'orders'},
    {id: 'purchased-items', label: 'Купленные товары', path: 'purchased-items'},
    {id: 'my-reviews', label: 'Мои отзывы', path: 'my-reviews'},
];

const ProfileSidebar: React.FC = () => {
    const location = useLocation();
    const user = useUnit($loggedUser);
    const customer = useUnit($customer);

    useEffect(() => {
        if (user !== defaultUserInfo) {
            loadCustomer({userId: user.id});
        }
    }, [user, user.id]);

    return <>
        <Sidebar>
            <UserInfo>
                <UserAvatar alt="User Avatar" src="/path/to/avatar.jpg"/>
                <UserName>{customer.firstName} {customer.lastName}</UserName>
                <EditProfileLink component={Link} to="personalInfo">
                    Редактировать профиль
                </EditProfileLink>
            </UserInfo>

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

                <ListItem key='logout' disablePadding>
                    <ListItemButton component={Link} onClick={() => logOut()}>
                        <ListItemText primary='Выйти из аккаунта'/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Sidebar>
        <Content>
            {sections.map(section => (
                <EditProfileLink key={section.id} component={Link} to={section.path}/>
            ))}
        </Content>
    </>;
};

export default ProfileSidebar;