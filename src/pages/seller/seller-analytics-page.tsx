import React, { useState } from 'react';
import {Tabs, Tab} from '@mui/material';
import {MainAnalyticsTab} from "../../components/seller/analytics";
import CompareAnalyticsTab from "../../components/seller/analytics/compare-analytics-tab.tsx";
import {SidebarPageBox} from "../../components";

const AnalyticsPage: React.FC = () => {
    const [tab, setTab] = useState(0);

    return (
        <SidebarPageBox sx={{ width: '90%' }}>
            <Tabs value={tab} onChange={(_, val) => setTab(val)} sx={{ mb: 4 }}>
                <Tab label="Аналитика" />
                <Tab label="Сравнение периодов" />
            </Tabs>

            {tab === 0 && <MainAnalyticsTab />}
            {tab === 1 && <CompareAnalyticsTab />}
        </SidebarPageBox>
    );
};

export default AnalyticsPage;
