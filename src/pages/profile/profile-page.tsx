import React, {useEffect} from 'react';
import {Box} from '@mui/material';
import Header from "../../components/header/header.tsx";
import ProfileSidebar from "../../components/profile/profile-sidebar.tsx";
import {Outlet} from "react-router-dom";
import {loadLoggedUser} from "../../api";

const ProfilePage: React.FC = () => {
    useEffect(() => {
        loadLoggedUser();
    }, []);

    return <Box sx={{marginLeft: 10, marginRight: 10}}>
        <Header/>
        <Box sx={{display: 'flex'}}>
            <ProfileSidebar/>
            <Outlet/>
        </Box>
    </Box>;
};

export default ProfilePage;