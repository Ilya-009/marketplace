import React from 'react';
import {SidebarPageBox} from "../../../components";
import SellerGoods from "../../../components/seller/seller-goods.tsx";

const SellerGoodsPage: React.FC = () => {
    return <SidebarPageBox sx={{width: '90%'}}>
        <SellerGoods/>
    </SidebarPageBox>
};

export default SellerGoodsPage;