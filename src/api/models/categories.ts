import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export type GoodCategory = {
    id: number;
    name: string;
    status: CategoryStatus;
    childCategories?: Array<GoodCategory>;
    params?: GoodCategoryParam[];
};

export type GoodCategoryParam = {
    id: number;
    name: string;
    type: CategoryParamType;
    options?: string[];
};

export enum CategoryStatus {
    ACTIVE = 'ACTIVE',
    ARCHIVED = 'ARCHIVED'
}

export enum CategoryParamType {
    SELECT = 'SELECT',
    CHECKBOX = 'CHECKBOX'
}

export type GoodCategoryChange = GoodCategory & {
    changeType: GoodCategoryChangeType;
    deleteChildCategories?: boolean;
};
export enum GoodCategoryChangeType {
    UPDATE = 'UPDATE',
    DELETE = 'DELETE',
    CREATE = 'CREATE'
}

export function findParentCategory(
    categories: Array<GoodCategory>,
    targetId: number,
    parent: GoodCategory | null = null
): GoodCategory | null {
    // Проходим по всем категориям
    for (const category of categories) {
        // Если текущая категория - искомая, возвращаем её родителя
        if (category.id === targetId) {
            return parent;
        }

        // Если у текущей категории есть дочерние, рекурсивно ищем в них
        if (category.childCategories) {
            const result = findParentCategory(category.childCategories, targetId, category);
            if (result) {
                return result;
            }
        }
    }

    // Если ничего не найдено, возвращаем null
    return null;
}

export function findCategoryById(
    categories: Array<GoodCategory>,
    targetId: number
): GoodCategory | null {
    // Проходим по всем категориям
    for (const category of categories) {
        // Если текущая категория - искомая, возвращаем её
        if (category.id === targetId) {
            return category;
        }

        // Если у текущей категории есть дочерние, рекурсивно ищем в них
        if (category.childCategories) {
            const result = findCategoryById(category.childCategories, targetId);
            if (result) {
                return result;
            }
        }
    }

    // Если ничего не найдено, возвращаем null
    return null;
}

type LoadCategoriesParam = void;
type LoadCategoriesByStoreIdParam = {storeId: number};
type LoadCategoriesResult = GoodCategory[];

export const loadCategories = createEvent<LoadCategoriesParam>();
export const saveCategories = createEvent<GoodCategoryChange[]>();
export const $categories = createStore<LoadCategoriesResult>([]);

export const loadCategoriesFx = createEffect<LoadCategoriesParam, LoadCategoriesResult, AxiosError>({
    async handler() {
        return apiClient.get(`${baseUrl}/goods/categories`).then(({ data }) => data);
    }
});

export const loadCategoriesByStoreIdFx = createEffect<LoadCategoriesByStoreIdParam, LoadCategoriesResult, AxiosError>({
    async handler({storeId}) {
        return apiClient.get(`${baseUrl}/goods/categories/bySeller/${storeId}`).then(({ data }) => data);
    }
});

export const saveCategoriesFx = createEffect<GoodCategoryChange[], void, AxiosError>({
    async handler(param) {
        await apiClient.put(`${baseUrl}/goods/categories`, param);
    }
});

sample({
    clock: [loadCategories, saveCategoriesFx.done],
    target: loadCategoriesFx
});

sample({
    clock: saveCategories,
    target: saveCategoriesFx
});

sample({
    clock: [loadCategoriesFx.doneData, loadCategoriesByStoreIdFx.doneData],
    target: $categories
});