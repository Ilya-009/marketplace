import {Good} from "../api/models/goods.ts";

export const getGoodRating = (good: Good) => {
    return good.reviews.length ?
        good.reviews.reduce((acc, curr) => acc + curr.mark, 0)
        / good.reviews.length
        : 0;
}