import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage} from "./pages";
import {ThemeProvider} from "@mui/material";
import {MainTheme} from "./ui/theme.ts";

function App() {
    return (
        <ThemeProvider theme={MainTheme}>
            <BrowserRouter>
                <Routes>
                    {/*<Route path="dashboard" element={<Dashboard />}>*/}
                    {/*    <Route index element={<RecentActivity />} />*/}
                    {/*    <Route path="project/:id" element={<Project />} />*/}
                    {/*</Route>*/}
                    <Route path="/" element={<MainPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App;
