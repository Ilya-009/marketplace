import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage, ProductCardPage} from "./pages";
import {ThemeProvider} from "@mui/material";
import {MainTheme} from "./ui";
import {useEffect} from "react";
import {loadProperties} from "./api";
import SignUp from "./pages/sign-up.tsx";
import SignIn from "./pages/sign-in.tsx";
import {loadCategories} from "./api";
import {CategoryPage} from "./pages/category-page.tsx";
import {NotFoundPage} from "./pages/not-found.tsx";

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
                    <Route path="/catalog/:id" element={<CategoryPage />} />
                    <Route path="/goods/:id" element={<ProductCardPage />} />
                    <Route path="/" element={<MainPage />} />
                    <Route path="/404" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App;
