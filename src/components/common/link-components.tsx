import styled from "styled-components";
import {Link} from '@mui/material';
import {MainTheme} from "../../ui/theme.ts";

export const SmallLinkActive = styled(Link) `
    color: ${MainTheme.palette.text.primary} !important;
`;

export const SmallLinkPassive = styled(Link)`
    flex-grow: 1;
    color: grey !important;
    transition: .5s;

    &:hover {
        color: ${MainTheme.palette.text.primary} !important;
    }
`;

export const SmallMenuLinkPassive = styled(Link)`
    color: grey !important;
    transition: .5s;

    &:hover {
        color: black !important;
    }
`;

export const SmallMenuLinkActive = styled(Link)`
    color: black !important;
    transition: .5s;
`;