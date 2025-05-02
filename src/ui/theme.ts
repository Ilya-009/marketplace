import {createTheme} from "@mui/material";
import {blue, green} from "@mui/material/colors";

export const defaultTheme = createTheme({
    palette: {
        primary: {
            main: blue[500],
            contrastText: '#fff'
        },
        secondary: {
            main: green[500],
        },
        text: {
            primary: '#000',
        }
    },
});