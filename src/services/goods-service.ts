import {DiscountType, Good, GoodCategory, GoodDiscount} from "../api";

export const getGoodRating = (good: Good) => {
    if (!good.reviews?.length) {
        return 0;
    }

    return good.reviews.length ?
        good.reviews.reduce((acc, curr) => acc + curr.mark, 0)
        / good.reviews.length
        : 0;
};

export const findGoodById = (goods: Good[], id: number) => {
    return goods.find(good => good.id === id);
};

export const getRootCategories = (categories: GoodCategory[]) => {
    return categories.map(category => {
        return {...category, childCategories: []};
    })
};

export const findCategoryById = (categories: GoodCategory | GoodCategory[], id: number): GoodCategory | undefined => {
    // Если передан массив категорий, ищем в каждом элементе
    if (Array.isArray(categories)) {
        for (const category of categories) {
            const found = findCategoryById(category, id);
            if (found) return found;
        }
        return undefined;
    }

    // Если текущая категория имеет искомый id, возвращаем её
    if (categories.id === id) {
        return categories;
    }

    // Рекурсивно ищем в дочерних категориях
    if (categories.childCategories) {
        for (const childCategory of categories.childCategories) {
            const found = findCategoryById(childCategory, id);
            if (found) return found;
        }
    }

    return undefined;
};

export const calculatePriceBeforeDiscount = (finalPrice: number, discount: GoodDiscount) => {
    const origin = discount.discountType === DiscountType.PERCENTAGE
        ? finalPrice / (1 - discount.discountValue / 100)
        : finalPrice + discount.discountValue;

    return parseFloat(origin.toFixed(0));
};

export const getMaxGoodPrice = (goods: Good[]) => {
    if (!goods.length) {
        return 0;
    }

    return goods.reduce((max, curr) => curr.price > max ? curr.price : max, 0);
};
export const getMinGoodPrice = (goods: Good[]) => {
    if (!goods.length) {
        return 0;
    }

    return goods.reduce((min, curr) => curr.price < min ? curr.price : min, 100000);
};

function getCategoryPathMap(
    category: GoodCategory,
    parentPath: string = "",
    pathMap: Map<number, string> = new Map()
): Map<number, string> {
    const currentPath = parentPath ? `${parentPath} - ${category.name}` : category.name;

    if (!category.childCategories || category.childCategories.length === 0) {
        // Это лист — добавляем в Map
        pathMap.set(category.id, currentPath);
        return pathMap;
    }

    // Рекурсивно обрабатываем дочерние категории
    for (const child of category.childCategories) {
        getCategoryPathMap(child, currentPath, pathMap);
    }

    return pathMap;
}

// Вариант для массива категорий
export function getCategoryPathMapFromArray(categories: GoodCategory[]): Map<number, string> {
    const pathMap = new Map<number, string>();
    for (const category of categories) {
        getCategoryPathMap(category, "", pathMap);
    }
    return pathMap;
}