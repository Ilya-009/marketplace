import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export type GoodCategory = {
    id: number;
    name: string;
    childCategories?: Array<GoodCategory>;
};

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
type LoadCategoriesResult = GoodCategory[];

export const loadCategories = createEvent<LoadCategoriesParam>();
export const $categories = createStore<LoadCategoriesResult>([]);

export const loadCategoriesFx = createEffect<LoadCategoriesParam, LoadCategoriesResult, AxiosError>({
    async handler() {
        return apiClient.get(`${baseUrl}/goods/categories`).then(({ data }) => data);
        // return getCategoriesMock();
    }
});

sample({
    clock: loadCategories,
    target: loadCategoriesFx
});

sample({
    clock: loadCategoriesFx.doneData,
    target: $categories
})