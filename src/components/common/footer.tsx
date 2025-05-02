import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';
import {useLanguage} from "../../locales/language-context.tsx";

const StyledFooter = styled(Box)`
  background-color: #1976d2;
  color: white;
  padding: 10px;
  text-align: center;
`;

const Footer: React.FC = () => {
    const {t} = useLanguage();
    return (
        <StyledFooter>
            <Typography variant="body1">{t('footer.bannerText')}</Typography>
        </StyledFooter>
    );
};

export default Footer;
