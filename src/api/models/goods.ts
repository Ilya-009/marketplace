import {Review} from "./reviews.ts";
import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";
import {GoodCategory} from "./categories.ts";

export interface Good {
    id: number;
    name: string;
    description: string;
    price: number;
    status: GoodStatus;
    storeId: number;
    categoryId: number;
    goodImages: Array<GoodImage>;
    reviews: Array<Review>;
    discount?: GoodDiscount;
}
export enum GoodStatus {
    ON_SALE = 'ON_SALE',
    READY_FOR_SELL = 'READY_FOR_SELL',
    REMOVED_FROM_SELL = 'REMOVED_FROM_SELL'
}

export interface GoodDiscount {
    id: number;
    discountType: DiscountType;
    discountValue: number;
}

export interface GoodImage {
    id: number;
    image: string;
}

export enum SearchResultType {
    GOOD = 'GOOD',
    CATEGORY = 'CATEGORY',
    REQUEST = 'REQUEST'
}
export interface SearchResult {
    type: SearchResultType;
    data: Good | GoodCategory
}

export type SortOption = 'popular' | 'newest' | 'priceAsc' | 'priceDesc' | 'ratingHigh' | 'discountHigh';
export enum DiscountType {
    PERCENTAGE = 'PERCENTAGE',
    AMOUNT = 'AMOUNT'
}

type LoadAllGoodsByCategoryParam = {
    categoryId: number;
};
type LoadGoodsByCategoryResult = Good[];
export const loadGoodsByCategory = createEvent<LoadAllGoodsByCategoryParam>();

type LoadGoodByIdParam = {id: number};
export const loadGoodById = createEvent<LoadGoodByIdParam>();
export const $allGoods = createStore<Array<Good>>([]);

export const executeSearch = createEvent<string>();
export const $searchResults = createStore<SearchResult[]>([]);

export const $goodsByCategory = createStore<LoadGoodsByCategoryResult>([]);

type LoadGoodsByStoreIdParam = {storeId: number};
export const loadGoodsByStoreId = createEvent<LoadGoodsByStoreIdParam>();
export const $storeGoods = createStore<Array<Good>>([]);

const loadGoodsByCategoryFx = createEffect<LoadAllGoodsByCategoryParam, LoadGoodsByCategoryResult, AxiosError>({
    async handler({categoryId}) {
        return await apiClient.get(`${baseUrl}/goods/byCategory?categoryId=${categoryId}`).then(({ data }) => data);
    }
});

const loadGoodByIdFx = createEffect<LoadGoodByIdParam, Good | undefined, AxiosError>({
    async handler({id}) {
        return await apiClient.get(`${baseUrl}/goods/${id}`).then(({ data }) => data);
    }
});

const executeSearchFx = createEffect<string, SearchResult[], AxiosError>({
    async handler(searchText) {
        return await apiClient.get(`${baseUrl}/goods/search?text=${searchText}`).then(({ data }) => data);
    }
});

const loadGoodsByStoreIdFx = createEffect<LoadGoodsByStoreIdParam, Good[], AxiosError>({
    async handler({storeId}) {
        return await apiClient.get(`${baseUrl}/goods/byStore?storeId=${storeId}`).then(({ data }) => data);
    }
});

sample({
    clock: loadGoodsByCategory,
    target: loadGoodsByCategoryFx
});
sample({
    clock: loadGoodsByCategoryFx.doneData,
    target: $goodsByCategory
});

sample({
    clock: loadGoodById,
    filter: (param) => {
        return !$allGoods.getState().some(g => g.id === param.id);
    },
    target: loadGoodByIdFx
});

sample({
    clock: executeSearch,
    target: executeSearchFx
});
sample({
    clock: executeSearchFx.doneData,
    target: $searchResults
});

sample({
    clock: loadGoodsByStoreId,
    target: loadGoodsByStoreIdFx
});
sample({
    clock: loadGoodsByStoreIdFx.doneData,
    target: $storeGoods
});

$allGoods.on(loadGoodByIdFx.doneData, (goods, good) => {
    if (good == null) {
        return goods;
    }

    return [...goods, good];
});
