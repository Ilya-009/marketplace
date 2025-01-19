import React from 'react';
import { Box, Typography } from '@mui/material';
import styled from 'styled-components';

const StyledFooter = styled(Box)`
  background-color: #1976d2;
  color: white;
  padding: 10px;
  text-align: center;
`;

const Footer: React.FC = () => {
    return (
        <StyledFooter>
            <Typography variant="body1">© 2023 Marketplace. All Rights Reserved.</Typography>
        </StyledFooter>
    );
};

export default Footer;
