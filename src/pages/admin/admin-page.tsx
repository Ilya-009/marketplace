import React, {useEffect} from 'react';
import {Box} from '@mui/material';
import Header from "../../components/header/header.tsx";
import {Outlet} from "react-router-dom";
import {loadLoggedUser} from "../../api";
import AdminSidebar from "../../components/admin/admin-sidebar.tsx";
import {MainPageBox} from "../../components";

const AdminPage: React.FC = () => {
    useEffect(() => {
        loadLoggedUser();
    }, []);

    return <MainPageBox>
        <Header/>
        <Box sx={{display: 'flex'}}>
            <AdminSidebar/>
            <Outlet/>
        </Box>
    </MainPageBox>;
};

export default AdminPage;