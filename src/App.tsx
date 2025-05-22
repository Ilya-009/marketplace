import {BrowserRouter, Route, Routes} from "react-router-dom";
import {MainPage, PaymentCardForm, ProductCardPage} from "./pages";
import {useCallback, useEffect} from "react";
import SignUp from "./pages/sign-up.tsx";
import SignIn from "./pages/sign-in.tsx";
import {loadProperties, loadCategories, loadLoggedUser, UserRole} from "./api";
import {CategoryPage} from "./pages";
import {NotFoundPage} from "./pages";
import ProfileMainPage from "./pages/profile/profile-main-page.tsx";
import EditProfile from "./pages/profile/personal-info-page.tsx";
import CartPage from "./pages/cart-page.tsx";
import OrdersPage from "./pages/profile/orders-page.tsx";
import SettingsManagementPage from "./pages/admin/properties-page.tsx";
import CheckoutPage from "./pages/checkout.tsx";
import AddressPage from "./pages/profile/profile-address-page.tsx";
import BecomeSellerPage from "./pages/seller/become-seller-page.tsx";
import PageWithSidebar from "./components/common/page-with-header-sidebar.tsx";
import ProfileSidebar from "./components/profile/profile-sidebar.tsx";
import Header from "./components/header/header.tsx";
import SellerMainPage from "./pages/seller/seller-main-page.tsx";
import SellerSidebar from "./components/seller/seller-sidebar.tsx";
import SellerGoodsPage from "./pages/seller/goods/seller-goods-page.tsx";
import SellerOrdersPage from "./pages/seller/seller-orders-page.tsx";
import SellerAnalyticsPage from "./pages/seller/seller-analytics-page.tsx";
import SellerReviewsPage from "./pages/seller/seller-reviews-page.tsx";
import CreateGoodPage from "./pages/seller/goods/seller-good-control-page.tsx";
import StoreEditPage from "./pages/seller/seller-edit-page.tsx";
import CreateSupply from "./components/seller/supplies/create-supply.tsx";
import CategoriesPage from "./pages/admin/categories-page.tsx";
import SellerPage from "./pages/store/store-page.tsx";
import AdminSidebar from "./components/admin/admin-sidebar.tsx";
import {CombinedThemeProvider} from "./ui";
import CssBaseline from "@mui/material/CssBaseline";
import {LanguageProvider} from "./locales/language-context.tsx";
import UsersManagementPage from "./pages/admin/users-page.tsx";
import CategoryRequestsPage from "./pages/admin/category-requests-page.tsx";
import PaymentMethodsPage from "./pages/admin/payment-methods-page.tsx";
import DeliveryMethodsPage from "./pages/admin/delivery-methods-page.tsx";
import GoodRequestsPage from "./pages/admin/good-requests-page.tsx";
import CustomerReviewsPage from "./pages/profile/customer-reviews-page.tsx";
import MiniHeader from "./components/header/mini-header.tsx";
import CustomerReturnsPage from "./pages/profile/customer-returns-page.tsx";
import {Box} from "@mui/material";
import SellerReturnsPage from "./pages/seller/seller-returns-page.tsx";
import ProfitAnalyticsPage from "./pages/admin/profit-analytics-page.tsx";

function App() {
    useEffect(() => {
        loadLoggedUser();
        loadProperties();
        loadCategories();
    }, []);
    const getLoggedUserFn = useCallback(() => loadLoggedUser(), []);

    return (
        <CombinedThemeProvider>
            <LanguageProvider>
                <CssBaseline/>
                <BrowserRouter>
                    <Routes>
                        <Route path="/signUp" element={<SignUp/>}/>
                        <Route path="/signIn" element={<SignIn/>}/>
                        <Route path="/catalog/:id" element={<CategoryPage/>}/>
                        <Route path="/goods/:id" element={<ProductCardPage/>}/>
                        <Route path="cart" element={<CartPage/>}/>
                        <Route path="checkout" element={<CheckoutPage/>}/>
                        <Route path="/become-seller" element={<BecomeSellerPage/>}/>
                        <Route path="/store/:id" element={<SellerPage/>}/>

                        <Route path="/seller" element={
                            <PageWithSidebar header={<MiniHeader/>}
                                             sidebar={<SellerSidebar/>}
                                             requiredRoles={[UserRole.SELLER]}/>
                        }>
                            <Route path="main" element={<SellerMainPage/>}/>
                            <Route path="edit" element={<StoreEditPage/>}/>
                            <Route path="goods/new" element={<CreateGoodPage isCreate/>}/>
                            <Route path="goods/:id" element={<CreateGoodPage isCreate={false}/>}/>
                            <Route path="goods" element={<SellerGoodsPage/>}/>
                            {/*<Route path="supplies" element={<SuppliesList/>}/>*/}
                            <Route path="supplies/new" element={<CreateSupply/>}/>
                            <Route path="orders" element={<SellerOrdersPage/>}/>
                            <Route path="returns" element={<SellerReturnsPage/>}/>
                            <Route path="analytics" element={<SellerAnalyticsPage/>}/>
                            <Route path="reviews" element={<SellerReviewsPage/>}/>
                        </Route>

                        <Route path="/profile" element={
                            <PageWithSidebar
                                header={<Header/>}
                                sidebar={<ProfileSidebar/>}
                                requiredRoles={[UserRole.CUSTOMER]}
                            />
                        }>
                            <Route path="main" element={<ProfileMainPage/>}/>
                            <Route path="personalInfo" element={<EditProfile/>}/>
                            <Route path="orders" element={<OrdersPage/>}/>
                            <Route path="returns" element={<CustomerReturnsPage/>}/>
                            <Route path="address" element={<AddressPage/>}/>
                            <Route path="reviews" element={<CustomerReviewsPage/>}/>
                        </Route>
                        <Route path="/admin" element={
                            <PageWithSidebar header={<MiniHeader/>}
                                             sidebar={<AdminSidebar isMasterAdmin={false} />}
                                             requiredRoles={[UserRole.ADMIN]}
                                             initFunction={getLoggedUserFn}
                            />
                        }>
                            <Route path="categories" element={<CategoriesPage/>}/>
                            <Route path="categoryRequests" element={<CategoryRequestsPage/>}/>
                            <Route path="goodRequests" element={<GoodRequestsPage/>}/>
                            <Route path="users" element={<UsersManagementPage isMasterAdmin={false}/>} />
                        </Route>
                        <Route path="/masterAdmin" element={
                            <PageWithSidebar header={<MiniHeader/>}
                                             sidebar={<AdminSidebar isMasterAdmin={true} />}
                                             requiredRoles={[UserRole.ROLE_MASTER_ADMIN]}
                                             initFunction={getLoggedUserFn}
                            />
                        }>
                            <Route path="properties" element={<SettingsManagementPage/>}/>
                            <Route path="categories" element={<CategoriesPage/>}/>
                            <Route path="categoryRequests" element={<CategoryRequestsPage/>}/>
                            <Route path="goodRequests" element={<GoodRequestsPage/>}/>
                            <Route path="paymentMethods" element={<PaymentMethodsPage/>}/>
                            <Route path="deliveryMethods" element={<DeliveryMethodsPage/>}/>
                            <Route path="profit" element={<ProfitAnalyticsPage/>}/>
                            <Route path="users" element={<UsersManagementPage isMasterAdmin={true}/>} />
                        </Route>
                        <Route path="/payment" element={
                            <PageWithSidebar header={<Header/>}
                                             sidebar={<Box/>}
                                             requiredRoles={[UserRole.CUSTOMER]}
                            />
                        }>
                            <Route path="credit-card" element={<PaymentCardForm/>} />
                        </Route>
                        <Route path="/" element={<MainPage/>}/>
                        <Route path="/404" element={<NotFoundPage/>}/>
                        <Route path="/403" element={<NotFoundPage/>}/>
                        <Route path="*" element={<NotFoundPage/>}/>
                    </Routes>
                </BrowserRouter>
            </LanguageProvider>
        </CombinedThemeProvider>
    )
}

export default App;
