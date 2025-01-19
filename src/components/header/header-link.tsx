import React from 'react';
import {Link, Typography} from '@mui/material';
import styled from 'styled-components';
import {MainTheme} from "../../ui/theme.ts";

const StyledLink = styled(Link)`
    display: flex;
    flex-direction: column;
    align-items: center;
    transition: .5s ease-in-out;

    &:hover {
        color: ${MainTheme.palette.primary.main};
    }
`;

interface LinkWithIconProps {
    icon: React.ReactNode;
    label: string;
    href: string;
}

const LinkWithIcon: React.FC<LinkWithIconProps> = ({icon, label, href}) => {
    return (
        <StyledLink href={href} color='#000'>
            {icon}
            <Typography variant="caption" style={{marginTop: 4}}>
                {label}
            </Typography>
        </StyledLink>
    );
};

export default LinkWithIcon;
