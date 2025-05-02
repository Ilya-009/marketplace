import styled from "styled-components";
import {Link as MuiLink, Link} from '@mui/material';

export const SmallLinkActive = styled(Link) `
    color: ${({ theme }) => theme.palette.text.primary} !important;
`;

export const SmallLinkPassive = styled(Link)`
    flex-grow: 1;
    color: grey !important;
    transition: .5s;

    &:hover {
        color: ${({ theme }) => theme.palette.text.primary} !important;
    }
`;

export const SmallMenuLinkPassive = styled(Link)`
    color: grey !important;
    transition: .5s;

    &:hover {
        color: ${({ theme }) => theme.palette.text.primary} !important;
    }
`;

export const SmallMenuLinkActive = styled(Link)`
    color: ${({ theme }) => theme.palette.text.primary} !important;
    transition: .5s;
    
    &:hover {
        color: ${({ theme }) => theme.palette.text.primary} !important;
    }
`;

export const BackwardLink = styled(SmallMenuLinkActive)`
    display: flex;
    align-content: center;
`;

export const EditProfileLink = styled(MuiLink)`
    font-size: 14px;
    color: #1976d2;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;