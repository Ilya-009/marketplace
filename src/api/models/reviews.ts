import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export interface Review {
    id: number;
    goodId: number;
    customerId: number;
    mark: number;
    text: string;
    createdAt: Date;
    reply?: ReviewReply;
}

export interface ReviewReply {
    id: number;
    comment: string;
    storeId: number;
    repliedAt: Date;
}

type LoadGoodReviews = {
    goodId: number;
};
type LoadGoodsReviews = {
    goodIds: number[];
};

export const loadReviewsByGoodId = createEvent<LoadGoodReviews>();
export const loadReviewsByGoodIds = createEvent<LoadGoodsReviews>();

export const $goodReviews = createStore<Review[]>([]);

export const loadLoadGoodReviewsFx = createEffect<LoadGoodReviews, Review[], AxiosError>({
    async handler({goodId}) {
        return await apiClient.get(`${baseUrl}/reviews/byGood/${goodId}`).then(({ data }) => data);
    }
});
export const loadLoadGoodsReviewsFx = createEffect<LoadGoodsReviews, Review[], AxiosError>({
    async handler({goodIds}) {
        const idsStr = goodIds.join(',');
        return await apiClient.get(`${baseUrl}/reviews/byGoods/${idsStr}`).then(({ data }) => data);
    }
});

sample({
    clock: loadReviewsByGoodId,
    target: loadLoadGoodReviewsFx
});
sample({
    clock: loadReviewsByGoodIds,
    filter: (param) => !!param.goodIds.length,
    target: loadLoadGoodsReviewsFx
});
sample({
    clock: [loadLoadGoodReviewsFx.doneData, loadLoadGoodsReviewsFx.doneData],
    target: $goodReviews
});