import React from 'react';
import {Box, List, ListItem, ListItemButton, ListItemText, Typography} from '@mui/material';
import {Link, useLocation} from 'react-router-dom';
import styled from 'styled-components';

const Sidebar = styled(Box)`
    width: 250px;
    //background-color: ${({ theme }) => theme.palette.background.paper};
    background-image: linear-gradient(rgba(255, 255, 255, 0.051), rgba(255, 255, 255, 0.051));
    //border-right: 1px solid #e0e0e0;
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
    {id: 'analytics', label: 'Аналитика и отчеты', path: 'stats'},
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