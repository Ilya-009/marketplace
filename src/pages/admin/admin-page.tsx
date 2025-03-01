import React, {useEffect} from 'react';
import {Box} from '@mui/material';
import Header from "../../components/header/header.tsx";
import {Outlet} from "react-router-dom";
import {loadLoggedUser} from "../../api";
import AdminSidebar from "../../components/admin/admin-sidebar.tsx";

const AdminPage: React.FC = () => {
    useEffect(() => {
        loadLoggedUser();
    }, []);

    return <Box sx={{marginLeft: 10, marginRight: 10}}>
        <Header/>
        <Box sx={{display: 'flex'}}>
            <AdminSidebar/>
            <Outlet/>
        </Box>
    </Box>;
};

export default AdminPage;