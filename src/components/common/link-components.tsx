import styled from "styled-components";
import {Link} from '@mui/material';
import {MainTheme, primaryTextColor} from "../../ui";

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
        color: ${primaryTextColor} !important;
    }
`;

export const SmallMenuLinkActive = styled(Link)`
    color: ${primaryTextColor} !important;
    transition: .5s;
    
    &:hover {
        color: ${MainTheme.palette.text.primary} !important;
    }
`;

export const BackwardLink = styled(SmallMenuLinkActive)`
    display: flex;
    align-content: center;
`;
