import React, {ReactElement, useEffect, useMemo, useState} from "react";
import {MainPageBox} from "./box-components.tsx";
import {Box, Drawer, IconButton, useMediaQuery, useTheme} from "@mui/material";
import {Outlet, useNavigate} from "react-router-dom";
import {useUnit} from "effector-react";
import {$isUserLoading, $loggedUser, UserRole} from "../../api";
import {isUserAuthenticated, isUserAuthenticatedWithRole} from "../../services";
import {CircularLoader} from "./loader.tsx";
import Footer from "./footer";
import {MenuOpen} from "@mui/icons-material";

type PageProps = {
    header: ReactElement;
    sidebar: ReactElement;
    requiredRoles?: UserRole[];
    initFunction?: () => void;
};

const PageWithSidebar: React.FC<PageProps> = ({header, sidebar, requiredRoles, initFunction}: PageProps) => {
    const [loggedUser, isUserLoading] = useUnit([$loggedUser, $isUserLoading]);
    const navigate = useNavigate();
    const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const hasAccess = useMemo(() => {
        if (isUserLoading) return true;
        return !requiredRoles?.length || requiredRoles?.some(role => isUserAuthenticatedWithRole(loggedUser, role));
    }, [isUserLoading, loggedUser, requiredRoles]);

    useEffect(() => {
        if (initFunction) {
            initFunction();
        }
    }, [initFunction]);

    useEffect(() => {
        if (!isUserAuthenticated()) {
            navigate('/signIn');
        } else {
            if (!isUserLoading && !hasAccess) {
                navigate('/403');
            }
        }
    }, [hasAccess, isUserLoading, navigate]);

    const toggleMobileSidebar = () => {
        setMobileSidebarOpen(!isMobileSidebarOpen);
    };

    if (isUserLoading) {
        return <CircularLoader/>;
    }

    return hasAccess && (
        <Box sx={isMobile ? {marginLeft: '15px', marginRight: '15px'} : {marginLeft: '80px', marginRight: '80px'}}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {header}
            </Box>

            {isMobile && (
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={toggleMobileSidebar}
                    sx={{ mr: 2 }}
                >
                    <MenuOpen />
                </IconButton>
            )}

            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                minHeight: 'calc(100vh - 120px)'
            }}>
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={isMobileSidebarOpen}
                        onClose={toggleMobileSidebar}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            display: { xs: 'block', md: 'none' },
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                width: 280
                            },
                        }}
                    >
                        {sidebar}
                    </Drawer>
                ) : (
                    <Box sx={{
                        width: { md: 240 },
                        flexShrink: { md: 0 }
                    }}>
                        {sidebar}
                    </Box>
                )}

                {/* Основное содержимое */}
                <Box
                    component="main"
                    sx={{
                        flexGrow: 1,
                        padding: 3,
                        paddingRight: 0,
                        width: { xs: '100%', md: `calc(100% - 240px)` }
                    }}
                >
                    <Outlet/>
                </Box>
            </Box>

            <Footer sx={{ mt: 'auto' }} />
        </Box>
    );
};

export default PageWithSidebar;