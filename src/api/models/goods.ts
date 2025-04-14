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
    DRAFT = 'DRAFT',
    ON_MODERATION = 'ON_MODERATION',
    ACTIVE = 'ACTIVE',
    REMOVED_FROM_SELL = 'REMOVED_FROM_SELL',
    ARCHIVED = 'ARCHIVED',
    BLOCKED = 'BLOCKED'
}

export interface GoodDiscount {
    id?: number;
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
type LoadGoodsByIdsParam = {ids: number[]};
export const loadGoodById = createEvent<LoadGoodByIdParam>();
export const loadGoodsByIds = createEvent<LoadGoodsByIdsParam>();
export const $allGoods = createStore<Array<Good>>([]);

export const executeSearch = createEvent<string>();
export const $searchResults = createStore<SearchResult[]>([]);

export const $goodsByCategory = createStore<LoadGoodsByCategoryResult>([]);

type LoadGoodsByStoreIdParam = {storeId: number};
type LoadRandomGoodsByStoreIdParam = {storeId: number, count: number};
export const loadGoodsByStoreId = createEvent<LoadGoodsByStoreIdParam>();
export const $storeGoods = createStore<Array<Good>>([]);

export type ModifyGoodType = {
    name: string;
    description: string;
    price: number;
    status?: GoodStatus;
    categoryId: number;
};
export type CreateNewGoodParam = ModifyGoodType & {
    userId: number;
    images: File[];
    discount?: GoodDiscount;
};
export type UpdateGoodParam = ModifyGoodType & {
    id: number;
    userId: number;
    images: File[];
    discount?: GoodDiscount;
};
export type ChangeGoodStatusParam = {
    id: number;
    status: GoodStatus;
};

const loadGoodsByCategoryFx = createEffect<LoadAllGoodsByCategoryParam, LoadGoodsByCategoryResult, AxiosError>({
    async handler({categoryId}) {
        return await apiClient.get(`${baseUrl}/goods/byCategory?categoryId=${categoryId}`).then(({ data }) => data);
    }
});

export const loadGoodByIdFx = createEffect<LoadGoodByIdParam, Good | undefined, AxiosError>({
    async handler({id}) {
        return await apiClient.get(`${baseUrl}/goods/${id}`).then(({ data }) => data);
    }
});

export const loadGoodsByIdsFx = createEffect<LoadGoodsByIdsParam, Good[], AxiosError>({
    async handler({ids}) {
        const notExistingIds = ids.filter(id => !$allGoods.getState().some(g => g.id === id));
        const idsStr = notExistingIds.join(',');
        return await apiClient.get(`${baseUrl}/goods/by-ids?ids=${idsStr}`).then(({ data }) => data);
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

export const loadRandomGoodsByStoreIdFx = createEffect<LoadRandomGoodsByStoreIdParam, Good[], AxiosError>({
    async handler({storeId, count}) {
        if (storeId > 0 && count > 0) {
            return await apiClient.get(`${baseUrl}/goods/byStore/random?storeId=${storeId}&count=${count}`).then(({ data }) => data);
        }

        return [];
    }
});

export const createNewGoodFx = createEffect<CreateNewGoodParam, boolean, AxiosError>({
    async handler(param) {
        const formData = new FormData();
        formData.append('name', param.name);
        formData.append('description', param.description);
        formData.append('price', param.price?.toString());
        formData.append('userId', param.userId?.toString());
        formData.append('categoryId', param.categoryId?.toString());

        if (param.discount) {
            formData.append('discount', JSON.stringify(param.discount));
        }

        param.images.forEach(file => {
            formData.append('images', file);
        });

        const response = await apiClient.post(`${baseUrl}/goods`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
});

export const updateGoodFx = createEffect<UpdateGoodParam, boolean, AxiosError>({
    async handler(param) {
        const formData = new FormData();
        formData.append('name', param.name);
        formData.append('description', param.description);
        formData.append('price', param.price?.toString());
        formData.append('userId', param.userId?.toString());
        formData.append('categoryId', param.categoryId?.toString());

        if (param.discount) {
            formData.append('discount', JSON.stringify(param.discount));
        }

        param.images.forEach(file => {
            formData.append('images', file);
        });

        const response = await apiClient.post(`${baseUrl}/goods`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    }
});

export const changeGoodStatusFx = createEffect<ChangeGoodStatusParam, void, AxiosError>({
    async handler(param) {
        const payload = {
            status: param.status
        };
        await apiClient.patch(`${baseUrl}/goods/${param.id}`, payload);
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
    clock: loadGoodsByIds,
    filter: (param: LoadGoodsByIdsParam) => {
        const filtered = param.ids
            .filter(id => !$allGoods.getState().some(g => g.id === id));
        return filtered.length !== 0;
    },
    target: loadGoodsByIdsFx
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
    clock: [loadGoodsByStoreIdFx.doneData, loadRandomGoodsByStoreIdFx.doneData],
    target: $storeGoods
});

$allGoods.on(loadGoodByIdFx.doneData, (goods, good) => {
    if (good == null) {
        return goods;
    }

    return [...goods, good];
});

$allGoods.on(loadGoodsByIdsFx.doneData, (goods, addedGoods) => {
    return [...goods, ...addedGoods];
});
