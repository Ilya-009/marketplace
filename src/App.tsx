import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage, ProductCardPage} from "./pages";
import {ThemeProvider} from "@mui/material";
import {MainTheme} from "./ui";
import {useEffect} from "react";
import SignUp from "./pages/sign-up.tsx";
import SignIn from "./pages/sign-in.tsx";
import {loadProperties, loadCategories, loadLoggedUser, UserRole} from "./api";
import {CategoryPage} from "./pages";
import {NotFoundPage} from "./pages";
import ProfileMainPage from "./pages/profile/profile-main-page.tsx";
import EditProfile from "./pages/profile/personal-info-page.tsx";
import CartPage from "./pages/cart-page.tsx";
import OrdersPage from "./pages/orders-page.tsx";
import SettingsManagementPage from "./pages/admin/properties-page.tsx";
import CheckoutPage from "./pages/checkout.tsx";
import AddressPage from "./pages/profile/profile-address-page.tsx";
import BecomeSellerPage from "./pages/seller/become-seller-page.tsx";
import PageWithSidebar from "./components/common/page-with-header-sidebar.tsx";
import ProfileSidebar from "./components/profile/profile-sidebar.tsx";
import Header from "./components/header/header.tsx";
import SellerHeader from "./components/header/seller-header.tsx";
import SellerMainPage from "./pages/seller/seller-main-page.tsx";
import SellerSidebar from "./components/seller/seller-sidebar.tsx";
import SellerGoodsPage from "./pages/seller/goods/seller-goods-page.tsx";
import SellerOrdersPage from "./pages/seller/seller-orders-page.tsx";
import SellerAnalyticsPage from "./pages/seller/seller-analytics-page.tsx";
import SellerReviewsPage from "./pages/seller/seller-reviews-page.tsx";
import CreateGoodPage from "./pages/seller/goods/seller-good-control-page.tsx";
import StoreEditPage from "./pages/seller/seller-edit-page.tsx";
import SuppliesList from "./pages/seller/supplies/supplies-page.tsx";
import CreateSupply from "./components/seller/supplies/create-supply.tsx";
import CategoriesPage from "./pages/admin/categories-page.tsx";
import SellerPage from "./pages/store/store-page.tsx";
import AdminSidebar from "./components/admin/admin-sidebar.tsx";

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
                    <Route path="cart" element={<CartPage />} />
                    <Route path="checkout" element={<CheckoutPage/>} />
                    <Route path="/become-seller" element={<BecomeSellerPage/>} />
                    <Route path="/store/:id" element={<SellerPage/>} />

                    <Route path="/seller" element={
                        <PageWithSidebar header={<SellerHeader/>}
                                         sidebar={<SellerSidebar/>}
                                         requiredRoles={[UserRole.SELLER]}/>
                    }>
                        <Route path="main" element={<SellerMainPage/>} />
                        <Route path="edit" element={<StoreEditPage/>} />
                        <Route path="goods/new" element={<CreateGoodPage isCreate/>} />
                        <Route path="goods/:id" element={<CreateGoodPage isCreate={false} />} />
                        <Route path="goods" element={<SellerGoodsPage/>} />
                        <Route path="supplies" element={<SuppliesList/>} />
                        <Route path="supplies/new" element={<CreateSupply/>} />
                        <Route path="orders" element={<SellerOrdersPage/>} />
                        <Route path="analytics" element={<SellerAnalyticsPage/>} />
                        <Route path="reviews" element={<SellerReviewsPage/>} />
                    </Route>

                    <Route path="/profile" element={
                        <PageWithSidebar
                            header={<Header/>}
                            sidebar={<ProfileSidebar/>}
                            requiredRoles={[UserRole.CUSTOMER]}
                        />
                    }>
                        <Route path="main" element={<ProfileMainPage />} />
                        <Route path="personalInfo" element={<EditProfile />} />
                        <Route path="orders" element={<OrdersPage />} />
                        <Route path="address" element={<AddressPage />} />
                    </Route>
                    <Route path="/admin" element={
                        <PageWithSidebar header={<Header/>}
                                         sidebar={<AdminSidebar/>}
                                         requiredRoles={[UserRole.ADMIN]}
                                         initFunction={() => loadLoggedUser()} />
                    }>
                        <Route path="properties" element={<SettingsManagementPage />} />
                        <Route path="categories" element={<CategoriesPage />} />
                        {/*<Route path="stats" element={} />*/}
                    </Route>
                    <Route path="/" element={<MainPage />} />
                    <Route path="/404" element={<NotFoundPage />} />
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App;
