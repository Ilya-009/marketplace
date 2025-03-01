import {Review} from "./reviews.ts";
import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export interface Good {
    id: number;
    name: string;
    description: string;
    price: number;
    storeId: number;
    categoryId: number;
    goodImages: Array<GoodImage>;
    reviews: Array<Review>;
    discount?: GoodDiscount;
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

export type SortOption = 'popular' | 'newest' | 'priceAsc' | 'priceDesc' | 'ratingHigh' | 'discountHigh';
export type DiscountType = 'percentage' | 'amount';

type LoadAllGoodsByCategoryParam = {
    categoryId: number;
};
type LoadGoodsByCategoryResult = Good[];
export const loadGoodsByCategory = createEvent<LoadAllGoodsByCategoryParam>();

type LoadGoodByIdParam = {id: number};
export const loadGoodById = createEvent<LoadGoodByIdParam>();
export const $allGoods = createStore<Array<Good>>([]);

export const $goodsByCategory = createStore<LoadGoodsByCategoryResult>([]);

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
    target: loadGoodByIdFx
});

$allGoods.on(loadGoodByIdFx.doneData, (goods, good) => {
    if (good == null) {
        return goods;
    }

    const hasInStore = goods.some(g => g.id === good.id);
    if (hasInStore) {
        return goods;
    }

    return [...goods, good];
});
