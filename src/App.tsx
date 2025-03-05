import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage, ProductCardPage} from "./pages";
import {ThemeProvider} from "@mui/material";
import {MainTheme} from "./ui";
import {useEffect} from "react";
import SignUp from "./pages/sign-up.tsx";
import SignIn from "./pages/sign-in.tsx";
import {loadProperties, loadCategories, loadLoggedUser} from "./api";
import {CategoryPage} from "./pages";
import {NotFoundPage} from "./pages";
import ProfilePage from "./pages/profile/profile-page.tsx";
import ProfileMainPage from "./pages/profile/profile-main-page.tsx";
import EditProfile from "./pages/profile/personal-info-page.tsx";
import CartPage from "./pages/cart-page.tsx";
import OrdersPage from "./pages/orders-page.tsx";
import AdminPage from "./pages/admin/admin-page.tsx";
import SettingsManagementPage from "./pages/admin/properties-page.tsx";
import CheckoutPage from "./pages/checkout.tsx";
import AddressPage from "./pages/profile/profile-address-page.tsx";

function App() {
    useEffect(() => {
        loadLoggedUser();
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
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage/>} />
                    <Route path="/profile" element={<ProfilePage />}>
                        <Route path="main" element={<ProfileMainPage />} />
                        <Route path="personalInfo" element={<EditProfile />} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="address" element={<AddressPage />} />
                    </Route>
                    <Route path="/admin" element={<AdminPage />}>
                        <Route path="properties" element={<SettingsManagementPage />} />
                        {/*<Route path="stats" element={} />*/}
                    </Route>
                    <Route path="/" element={<MainPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App;
