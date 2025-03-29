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
}

export enum OrderStatus {
    CREATED = 'CREATED',
    DELIVERED = 'DELIVERED',
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
}

export interface DeliveryMethod {
    id: number;
    price: number;
    name: string;
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
};

export const $orders = createStore<Order[]>([]);
export const $paymentMethods = createStore<PaymentMethod[]>([]);
export const $deliveryMethods = createStore<DeliveryMethod[]>([]);

export const loadCustomerOrders = createEvent<LoadCustomerOrdersParam>();
export const createNewOrder = createEvent<CreateNewOrderParam>();
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
const loadSellerOrdersFx = createEffect<LoadSellerOrdersParam, Order[], AxiosError>({
    async handler({sellerId}) {
        if (sellerId) {
            return await apiClient.get(`${baseUrl}/stores/orders?storeId=${sellerId}`).then(({ data }) => data);
        }
    }
});
const createNewOrderFx = createEffect<CreateNewOrderParam, void, AxiosError>({
    async handler(order) {
        await apiClient.post(`${baseUrl}/orders`, order);
    }
});
const loadPaymentMethodsFx = createEffect<void, PaymentMethod[], AxiosError>({
    async handler() {
        return await apiClient.get(`${baseUrl}/orders/paymentMethods`).then(({ data }) => data);
    }
});
const loadDeliveryMethodsFx = createEffect<void, DeliveryMethod[], AxiosError>({
    async handler() {
        return await apiClient.get(`${baseUrl}/orders/deliveryMethods`).then(({ data }) => data);
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