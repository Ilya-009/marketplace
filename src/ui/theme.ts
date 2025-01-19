import {createTheme} from "@mui/material";
import {blue, green} from "@mui/material/colors";

export const hiddenLinkColor = '#000';

export const MainTheme = createTheme({
    palette: {
        primary: {
            main: blue[500],
            contrastText: '#fff'
        },
        secondary: {
            main: green[500],
        },
        text: {
            primary: blue[500],
        }
    },
});