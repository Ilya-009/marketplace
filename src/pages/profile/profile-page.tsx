import React from 'react';
import {Box} from '@mui/material';
import Header from "../../components/header/header.tsx";
import ProfileSidebar from "../../components/profile/profile-sidebar.tsx";
import {Outlet} from "react-router-dom";

const ProfilePage: React.FC = () => {
    return <Box sx={{marginLeft: 10, marginRight: 10}}>
        <Header/>
        <Box sx={{display: 'flex'}}>
            <ProfileSidebar/>
            <Outlet/>
        </Box>
    </Box>;
};

export default ProfilePage;