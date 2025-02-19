import {Good} from "../api/models/goods.ts";

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