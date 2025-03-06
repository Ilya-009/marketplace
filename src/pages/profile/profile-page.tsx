import React from 'react';
import {Box} from '@mui/material';
import Header from "../../components/header/header.tsx";
import ProfileSidebar from "../../components/profile/profile-sidebar.tsx";
import {Outlet} from "react-router-dom";
import {MainPageBox} from "../../components";

const ProfilePage: React.FC = () => {
    return <MainPageBox>
        <Header/>
        <Box sx={{display: 'flex'}}>
            <ProfileSidebar/>
            <Outlet/>
        </Box>
    </MainPageBox>;
};

export default ProfilePage;