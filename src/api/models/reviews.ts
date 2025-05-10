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

export interface PendingReview {
    goodId: number,
    name: string;
}

type LoadGoodReviews = {
    goodId: number;
};
type LoadGoodsReviews = {
    goodIds: number[];
};
type LoadCustomerReviews = {
    customerId: number;
};
type LoadStorePendingReviews = {
    storeId: number;
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

export const loadCustomerReviewsFx = createEffect<LoadCustomerReviews, Review[], AxiosError>({
    async handler({customerId}) {
        return await apiClient.get(`${baseUrl}/reviews/byCustomer/${customerId}`).then(({ data }) => data);
    }
});

export const loadPendingCustomerReviewsFx = createEffect<LoadCustomerReviews, PendingReview[], AxiosError>({
    async handler({customerId}) {
        return await apiClient.get(`${baseUrl}/reviews/pending/${customerId}`).then(({ data }) => data);
    }
});

export const loadPendingStoreReviewsFx = createEffect<LoadStorePendingReviews, Review[], AxiosError>({
    async handler({storeId}) {
        return await apiClient.get(`${baseUrl}/reviews/pendingOfStore/${storeId}`).then(({ data }) => data);
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