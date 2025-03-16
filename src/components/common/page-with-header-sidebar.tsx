import React, {ReactElement, useEffect} from "react";
import {MainPageBox} from "./box-components.tsx";
import {Box} from "@mui/material";
import {Outlet} from "react-router-dom";

type PageProps = {
    header: ReactElement;
    sidebar: ReactElement;
    initFunction?: () => void;
};

const PageWithSidebar: React.FC<PageProps> = ({header, sidebar, initFunction}: PageProps) => {
    useEffect(() => {
        if (initFunction) {
            initFunction();
        }
    }, [initFunction]);

    return <MainPageBox>
        {header}
        <Box sx={{display: 'flex'}}>
            {sidebar}
            <Outlet/>
        </Box>
    </MainPageBox>;
};

export default PageWithSidebar;