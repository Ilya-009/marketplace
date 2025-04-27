import React, {ReactElement, useEffect, useMemo} from "react";
import {MainPageBox} from "./box-components.tsx";
import {Box} from "@mui/material";
import {Outlet, useNavigate} from "react-router-dom";
import {useUnit} from "effector-react";
import {$isUserLoading, $loggedUser, UserRole} from "../../api";
import {isUserAuthenticatedWithRole} from "../../services";
import {CircularLoader} from "./loader.tsx";

type PageProps = {
    header: ReactElement;
    sidebar: ReactElement;
    requiredRoles?: UserRole[];
    initFunction?: () => void;
};

const PageWithSidebar: React.FC<PageProps> = ({header, sidebar, requiredRoles, initFunction}: PageProps) => {
    const [loggedUser, isUserLoading] = useUnit([$loggedUser, $isUserLoading]);
    const navigate = useNavigate();

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
        // Выполняем редирект только после загрузки данных
        if (!isUserLoading && !hasAccess) {
            navigate('/404');
        }
    }, [hasAccess, isUserLoading, navigate]);

    // Показываем лоадер или ничего, пока данные загружаются
    if (isUserLoading) {
        return <CircularLoader/>;
    }

    return hasAccess && <MainPageBox>
        {header}
        <Box sx={{display: 'flex'}}>
            {sidebar}
            <Outlet/>
        </Box>
    </MainPageBox>;
};

export default PageWithSidebar;