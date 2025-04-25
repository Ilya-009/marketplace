import {createEffect, createEvent, createStore, sample} from "effector";
import {Good} from "./goods.ts";
import {GoodCategory} from "./categories.ts";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export type BriefStats = {
    goodsAverageRating: number;
    goodsSoldCount: number;
};

export type StoreUnsecure = {
    id: number;
    name: string;
    description: string;
    logoImage: string;
    storeGoods: Good[];
    categories: GoodCategory[];
    briefStats: BriefStats;
};
const defaultStoreUnsecure: StoreUnsecure = {
    id: -1,
    name: '',
    description: '',
    logoImage: '',
    storeGoods: [],
    categories: [],
    briefStats: {
        goodsAverageRating: 5.0,
        goodsSoldCount: 0
    }
};

type LoadStoreUnsecureByIdParam = {
    storeId: number;
};

export const loadStoreUnsecure = createEvent<LoadStoreUnsecureByIdParam>();

export const $storeUnsecure = createStore<StoreUnsecure>(defaultStoreUnsecure);

export const loadStoreUnsecureFx = createEffect<LoadStoreUnsecureByIdParam, StoreUnsecure, AxiosError>({
    async handler({storeId}) {
        return await apiClient.get(`${baseUrl}/stores/info/${storeId}`).then(({ data }) => data);
    }
});

sample({
    clock: loadStoreUnsecure,
    target: loadStoreUnsecureFx
});

sample({
    clock: loadStoreUnsecureFx.doneData,
    target: $storeUnsecure
});
