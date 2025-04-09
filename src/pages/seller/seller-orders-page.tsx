import React from 'react';
import {SidebarPageBox} from "../../components";
import OrdersList from "../../components/seller/orders/seller-orders.tsx";

const SellerOrdersPage: React.FC = () => {
    return <SidebarPageBox sx={{width: '90%'}}>
        <OrdersList />
    </SidebarPageBox>
};

export default SellerOrdersPage;