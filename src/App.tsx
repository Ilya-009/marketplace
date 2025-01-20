import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage} from "./pages";
import {ThemeProvider} from "@mui/material";
import {MainTheme} from "./ui/theme.ts";
import {useEffect} from "react";
import {loadProperties} from "./api";
import SignUp from "./pages/sign-up.tsx";
import SignIn from "./pages/sign-in.tsx";

function App() {
    useEffect(() => {
        loadProperties();
    }, []);

    return (
        <ThemeProvider theme={MainTheme}>
            <BrowserRouter>
                <Routes>
                    {/*<Route path="dashboard" element={<Dashboard />}>*/}
                    {/*    <Route index element={<RecentActivity />} />*/}
                    {/*    <Route path="project/:id" element={<Project />} />*/}
                    {/*</Route>*/}
                    <Route path="/signUp" element={<SignUp />} />
                    <Route path="/signIn" element={<SignIn />} />
                    <Route path="/" element={<MainPage />} />

                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App;
