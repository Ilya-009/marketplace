import React from 'react';
import {Avatar, Box, List, ListItem, ListItemButton, ListItemText, Typography} from '@mui/material';
import {Link, useLocation} from 'react-router-dom';
import styled from 'styled-components';
import {EditProfileLink} from "../common";
import {$customer, logOut, MarketplaceType} from "../../api";
import {useUnit} from "effector-react";
import {useLanguage} from "../../locales/language-context.tsx";
import {getMarketplaceType} from "../../services";

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

const UserAvatar = styled(Avatar)`
    width: 80px;
    height: 80px;
    margin-bottom: 10px;
`;

const UserName = styled(Typography)`
    font-weight: 600;
    font-size: 18px;
`;

const ProfileSidebar: React.FC = () => {
    const location = useLocation();
    const customer = useUnit($customer);
    const marketplaceType = getMarketplaceType();
    const {t} = useLanguage();

    const sections = [
        {id: 'main', label: t('customer.profile.tabs.personalData'), path: 'main'},
        {id: 'my-cart', label: t('customer.profile.tabs.myCart'), path: '/cart'},
        {id: 'my-orders', label: t('customer.profile.tabs.myOrders'), path: 'orders'},
        {id: 'address', label: t('customer.profile.tabs.myAddresses'), path: 'address'},
        {id: 'reviews', label: t('customer.profile.tabs.myReviews'), path: 'reviews'},
    ];

    if (marketplaceType === MarketplaceType.GOODS) {
        sections.push({id: 'my-returns', label: t('customer.profile.tabs.myReturns'), path: 'returns'});
    }

    return <>
        <Sidebar>
            <UserInfo>
                <UserAvatar alt="User Avatar" src="/path/to/avatar.jpg"/>
                <UserName>{customer.firstName} {customer.lastName}</UserName>
                <EditProfileLink component={Link} to="/profile/personalInfo">
                    {t('customer.profile.edit')}
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
                        <ListItemText primary={t('customer.profile.exit')}/>
                    </ListItemButton>
                </ListItem>
            </List>
        </Sidebar>
    </>;
};

export default ProfileSidebar;