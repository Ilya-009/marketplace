import {createEffect} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export interface ReturnRequest {
    id: number;
    orderGoodId: number;
    customerId: number;
    storeId: number;
    returnStatus: ReturnStatus;
    returnReason: ReturnReason;
    comment: string;
    sellerComment: string;
    requestDate: Date;
    resolutionDate: Date;
}

export enum ReturnStatus {
    REQUESTED = 'REQUESTED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
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

type CreateNewReturnParam = {
    orderGoodId: number;
    customerId: number;
    returnReason: ReturnReason;
    comment: string;
    photos: File[];
};

export const loadCustomerReturnsFx = createEffect<LoadCustomerReturnsParam, ReturnRequest[], AxiosError>({
    async handler({customerId}) {
        return await apiClient.get(`${baseUrl}/returns/customer/${customerId}`).then(({ data }) => data);
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