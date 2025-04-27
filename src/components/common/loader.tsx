import {CircularProgress} from "@mui/material";
import {SidebarPageBox} from "./box-components.tsx";

export const CircularLoader = () => {
    return <SidebarPageBox sx={{width: '90%'}} display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <CircularProgress />
    </SidebarPageBox>;
};