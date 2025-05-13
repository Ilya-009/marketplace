import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export interface Order {
    id: number;
    createdAt: string;
    status: OrderStatus;
    customerId: number;
    orderGoods: Array<OrderGood>;
    paymentMethod: PaymentMethod;
    deliveryMethod: DeliveryMethod;
    comment?: string;
}

export enum OrderStatus {
    CREATED = 'CREATED',
    PAID = 'PAID',
    PROCESSING = 'PROCESSING',
    DELIVERED = 'DELIVERED',
    DELIVERING = 'DELIVERING',
    REJECTED = 'REJECTED',
    FINISHED = 'FINISHED'
}

export interface OrderGood {
    id: number;
    quantity: number;
    goodId: number;
}

export interface PaymentMethod {
    id: number;
    name: string;
    isActive: boolean;
}

export interface DeliveryMethod {
    id: number;
    name: string;
    price: number;
    minOrderSum: number;
}

type LoadCustomerOrdersParam = {
    customerId: number;
};
type LoadSellerOrdersParam = {
    sellerId: number;
};
export type CreateNewOrderParam = {
    customerId: number;
    addressId?: number;
    deliveryMethodId: number;
    paymentMethodId: number;
    goods: Array<{
        goodId: number;
        quantity: number;
    }>;
    comment: string;
};

type UpdatePaymentMethodParam = {
    id: number;
    name: string;
    isActive: boolean;
}[];

type CreateDeliveryMethodParam = {
    name: string;
    price: number;
    minOrderSum: number;
};

type DeleteDeliveryMethodParam = {
    id: number;
};

type ChangeOrderParamParam = {
    id: number;
    status: OrderStatus;
};

export const $orders = createStore<Order[]>([]);
export const $paymentMethods = createStore<PaymentMethod[]>([]);
export const $deliveryMethods = createStore<DeliveryMethod[]>([]);

export const loadCustomerOrders = createEvent<LoadCustomerOrdersParam>();
export const createNewOrder = createEvent<CreateNewOrderParam>();
export const changeOrderStatus = createEvent<ChangeOrderParamParam>();
export const loadPaymentMethods = createEvent();
export const loadDeliveryMethods = createEvent();
export const loadSellerOrders = createEvent<LoadSellerOrdersParam>();

const loadCustomerOrdersFx = createEffect<LoadCustomerOrdersParam, Order[], AxiosError>({
    async handler({customerId}) {
        if (customerId) {
            return await apiClient.get(`${baseUrl}/orders/byCustomer/${customerId}`).then(({ data }) => data);
        }
    }
});
export const loadSellerOrdersFx = createEffect<LoadSellerOrdersParam, Order[], AxiosError>({
    async handler({sellerId}) {
        if (sellerId > 0) {
            return await apiClient.get(`${baseUrl}/orders/byStore/${sellerId}`).then(({ data }) => data);
        }
        return [];
    }
});
const createNewOrderFx = createEffect<CreateNewOrderParam, void, AxiosError>({
    async handler(order) {
        await apiClient.post(`${baseUrl}/orders`, order);
    }
});

export const changeOrderStatusFx = createEffect<ChangeOrderParamParam, void, AxiosError>({
    async handler(param) {
        console.log(param);
        await apiClient.patch(`${baseUrl}/orders/${param.id}`, param.status, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(({ data }) => data);
    }
});

export const loadPaymentMethodsFx = createEffect<void, PaymentMethod[], AxiosError>({
    async handler() {
        return await apiClient.get(`${baseUrl}/orders/paymentMethods`).then(({ data }) => data);
    }
});

export const updatePaymentMethodsFx = createEffect<UpdatePaymentMethodParam, void, AxiosError>({
    async handler(param) {
        return await apiClient.put(`${baseUrl}/orders/paymentMethods`, param).then(({ data }) => data);
    }
});

export const loadDeliveryMethodsFx = createEffect<void, DeliveryMethod[], AxiosError>({
    async handler() {
        return await apiClient.get(`${baseUrl}/orders/deliveryMethods`).then(({ data }) => data);
    }
});

export const createDeliveryMethodFx = createEffect<CreateDeliveryMethodParam, DeliveryMethod, AxiosError>({
    async handler(param) {
        return await apiClient.post(`${baseUrl}/orders/deliveryMethods`, param).then(({ data }) => data);
    }
});

export const updateDeliveryMethodFx = createEffect<DeliveryMethod, DeliveryMethod, AxiosError>({
    async handler(param) {
        const data = {
            name: param.name,
            price: param.price,
            minOrderSum: param.minOrderSum
        };
        return await apiClient.put(`${baseUrl}/orders/deliveryMethods/${param.id}`, data).then(({ data }) => data);
    }
});

export const deleteDeliveryMethodFx = createEffect<DeleteDeliveryMethodParam, void, AxiosError>({
    async handler({id}) {
        return await apiClient.delete(`${baseUrl}/orders/deliveryMethods/${id}`).then(({ data }) => data);
    }
});

sample({
    clock: loadCustomerOrders,
    target: loadCustomerOrdersFx
});
sample({
    clock: [loadCustomerOrdersFx.doneData, loadSellerOrdersFx.doneData],
    target: $orders
});

sample({
    clock: createNewOrder,
    target: createNewOrderFx
});

sample({
    clock: loadPaymentMethods,
    target: loadPaymentMethodsFx
});
sample({
    clock: loadPaymentMethodsFx.doneData,
    target: $paymentMethods
});

sample({
    clock: loadDeliveryMethods,
    target: loadDeliveryMethodsFx
});
sample({
    clock: loadDeliveryMethodsFx.doneData,
    target: $deliveryMethods
});

sample({
    clock: loadSellerOrders,
    target: loadSellerOrdersFx
});

sample({
    clock: changeOrderStatus,
    target: changeOrderStatusFx
});