import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export interface ReturnRequest {
    id: number;
    goodName: string;
    goodId: number;
    returnStatus: ReturnStatus;
    returnReason: ReturnReason;
    comment: string;
    sellerComment: string;
    requestDate: Date;
    resolutionDate: Date;
    photoUrls: string[]
}

export enum ReturnStatus {
    REQUESTED = 'REQUESTED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
    COMPLETED = 'COMPLETED'
}

export enum ReturnReason {
    DEFECT = 'DEFECT',
    WRONG_ITEM = 'WRONG_ITEM',
    CHANGE_MIND = 'CHANGE_MIND'
}

type LoadCustomerReturnsParam = {
    customerId: number;
};

type LoadSellerReturnsParam = {
    sellerId: number;
};

type CreateNewReturnParam = {
    orderGoodId: number;
    customerId: number;
    returnReason: ReturnReason;
    comment: string;
    photos: File[];
};

type CancelReturnParam = {
    returnId: number;
};

export const loadCustomerReturns = createEvent<LoadCustomerReturnsParam>();
export const cancelReturn = createEvent<CancelReturnParam>();
export const $returns = createStore<ReturnRequest[]>([]);

export const loadCustomerReturnsFx = createEffect<LoadCustomerReturnsParam, ReturnRequest[], AxiosError>({
    async handler({customerId}) {
        return await apiClient.get(`${baseUrl}/returns/customer/${customerId}`).then(({ data }) => data);
    }
});

export const loadSellerReturnsFx = createEffect<LoadSellerReturnsParam, ReturnRequest[], AxiosError>({
    async handler({sellerId}) {
        return await apiClient.get(`${baseUrl}/returns/seller/${sellerId}`).then(({ data }) => data);
    }
});

export const cancelReturnFx = createEffect<CancelReturnParam, void, AxiosError>({
    async handler({returnId}) {
        await apiClient.delete(`${baseUrl}/returns/customer/${returnId}`);
    }
});

export const createNewReturnRequestFx = createEffect<CreateNewReturnParam, void, AxiosError>({
    async handler(returnParam) {
        const formData = new FormData();
        formData.append('orderGoodId', returnParam.orderGoodId.toString());
        formData.append('customerId', returnParam.customerId.toString());
        formData.append('returnReason', returnParam.returnReason);
        formData.append('comment', returnParam.comment);

        returnParam.photos.forEach((file) => {
            formData.append('photos', file);
        });

        return await apiClient.post(`${baseUrl}/returns/customer`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }
});

sample({
    clock: loadCustomerReturns,
    target: loadCustomerReturnsFx
});
sample({
    clock: loadCustomerReturnsFx.doneData,
    target: $returns
});

sample({
    clock: cancelReturn,
    target: cancelReturnFx
})