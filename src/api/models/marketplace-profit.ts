import {createEffect, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export interface MarketplaceProfit {
    id: number;
    orderId: number;
    orderTotal: number;
    marketplaceFeeRate: number;
    marketplaceProfit: number;
    createdAt: string;
}

type LoadMarketplaceProfitData = {
    startDate: string;
    endDate: string;
};

export const $profitData = createStore<MarketplaceProfit[]>([]);

export const loadMarketplaceProfitFx = createEffect<LoadMarketplaceProfitData, MarketplaceProfit[], AxiosError>({
    async handler(param) {
        return await apiClient.get(`${baseUrl}/profit`, {
            params: { start: param.startDate, end: param.endDate }
        }).then(({ data }) => data);
    }
});

sample({
    clock: loadMarketplaceProfitFx.doneData,
    target: $profitData
});