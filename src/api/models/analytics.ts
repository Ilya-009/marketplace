import {createEffect, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";
import {formatDate} from "../../services/type-utils.ts";

export interface SalesData {
    date: string;
    sales: number;
    revenue: number;
}

export interface ProductPerformance {
    goodId: number;
    name: string;
    sales: number;
    revenue: number;
}

export interface StoreAnalytics {
    salesOverTime: SalesData[];
    topProducts: ProductPerformance[];
    summary: StoreSummary;
}

export interface StoreSummary {
    totalSales: number;
    totalRevenue: number;
    avgOrderValue: number;
}

const defaultStoreAnalytics: StoreAnalytics = {
    salesOverTime: [],
    topProducts: [],
    summary: {
        totalSales: 0,
        totalRevenue: 0,
        avgOrderValue: 0
    }
};

type LoadStoreAnalyticsParam = {
    storeId: number;
    startDate?: Date;
    endDate?: Date;
};

export const $storeAnalytics = createStore<StoreAnalytics>(defaultStoreAnalytics);

export const loadStoreAnalyticsFx = createEffect<LoadStoreAnalyticsParam, StoreAnalytics, AxiosError>({
    async handler({storeId, startDate, endDate}) {
        let url;

        if (startDate && endDate) {
            const startDateStr = formatDate(startDate);
            const endDateStr = formatDate(endDate);
            url = `${baseUrl}/analytics/store?storeId=${storeId}&startDate=${startDateStr}&endDate=${endDateStr}`;
        }else {
            url = `${baseUrl}/analytics/store?storeId=${storeId}`;
        }

        return await apiClient.get(url).then(({ data }) => data);
    }
});

sample({
    clock: loadStoreAnalyticsFx.doneData,
    target: $storeAnalytics
});