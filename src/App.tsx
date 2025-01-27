import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage} from "./pages";
import {ThemeProvider} from "@mui/material";
import {MainTheme} from "./ui/theme.ts";
import {useEffect} from "react";
import {loadProperties} from "./api";
import SignUp from "./pages/sign-up.tsx";
import SignIn from "./pages/sign-in.tsx";
import {loadCategories} from "./api";

function App() {
    useEffect(() => {
        loadProperties();
        loadCategories();
    }, []);

    return (
        <ThemeProvider theme={MainTheme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/signUp" element={<SignUp />} />
                    <Route path="/signIn" element={<SignIn />} />
                    <Route path="/" element={<MainPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App;
