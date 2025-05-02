import styled from "styled-components";
import {TextField} from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";

export const StyledSearchField = styled(TextField)`
    & .MuiInputBase-input {
        color: ${({ theme }) => theme.palette.text.primary};
    }
`;

export const StyledFormControlLabel = styled(FormControlLabel)`
    color: ${({ theme }) => theme.palette.text.primary} !important;
`;