import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";

export type GoodCategory = {
    id: number;
    name: string;
    image: string;
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

// MOCK API
const getCategoriesMock: () => GoodCategory[] = () => {
    return [
        {
            id: 1,
            name: 'Электроника',
            image: '',
            childCategories: [
                {
                    id: 2,
                    name: 'Телефоны',
                    image: '',
                    childCategories: [
                        {
                            id: 12,
                            name: 'Смартфоны',
                            image: ''
                        },
                        {
                            id: 13,
                            name: 'Кнопочные телефоны',
                            image: ''
                        }
                    ]
                },
                {
                    id: 3,
                    name: 'Ноутбуки',
                    image: ''
                },
                {
                    id: 4,
                    name: 'Планшеты',
                    image: ''
                },
                {
                    id: 14,
                    name: 'Наушники',
                    image: ''
                },
                {
                    id: 15,
                    name: 'Карты',
                    image: ''
                }
            ]
        },
        {
            id: 5,
            name: 'Одежда',
            image: '',
            childCategories: [
                {
                    id: 5,
                    name: 'Мужская одежда',
                    image: ''
                },
                {
                    id: 6,
                    name: 'Женская одежда',
                    image: ''
                },
                {
                    id: 7,
                    name: 'Детская одежда',
                    image: ''
                }
            ]
        },
        {
            id: 8,
            name: 'Дом и сад',
            image: '',
            childCategories: [
                {
                    id: 9,
                    name: 'Мебель',
                    image: ''
                },
                {
                    id: 10,
                    name: 'Декор',
                    image: ''
                },
                {
                    id: 11,
                    name: 'Садовые инструменты',
                    image: ''
                }
            ]
        },
    ];
};
// MOCK API

type LoadCategoriesParam = void;
type LoadCategoriesResult = GoodCategory[];

export const loadCategories = createEvent<LoadCategoriesParam>();
export const $categories = createStore<LoadCategoriesResult>([]);

export const loadCategoriesFx = createEffect<LoadCategoriesParam, LoadCategoriesResult, AxiosError>({
    async handler() {
        return getCategoriesMock();
        // return await apiClient.get(`/api/properties/getAll`).then(({ data }) => data.data);
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