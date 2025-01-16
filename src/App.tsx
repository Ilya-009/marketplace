import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage} from "./pages/MainPage.tsx";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/*<Route path="dashboard" element={<Dashboard />}>*/}
                {/*    <Route index element={<RecentActivity />} />*/}
                {/*    <Route path="project/:id" element={<Project />} />*/}
                {/*</Route>*/}
                <Route path="/" element={<MainPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;
