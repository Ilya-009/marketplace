import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";
import {isUserAuthenticatedWithRole} from "../../services";
import {$loggedUser, UserRole} from "./authentication.ts";

export interface Customer {
    id: number;
    firstName: string;
    lastName: string;
    updatedAt: Date;
    userId: number;
    addresses: number[];
    cart: CartItem[];
}
const defaultCustomer: Customer = {
    id: -1,
    firstName: '',
    lastName: '',
    updatedAt: new Date(),
    userId: 0,
    addresses: [],
    cart: []
};

export type CartItem = {
    goodId: number;
    quantity: number;
};

type AddGoodToCartParam = {
    goodId: number;
};

type AddGoodToCartWithCustomerParam = AddGoodToCartParam & {
    customerId: number;
};

type DeleteCartGoodParam = {
    goodId: number;
};
type DeleteCartGoodParamWithCustomer = DeleteCartGoodParam & {
    customerId: number;
};

type UpdateCartQuantityParam = {
    goodId: number;
    quantity: number
};
type UpdateCartQuantityParamWithCustomer = UpdateCartQuantityParam & {
    customerId: number;
};

type LoadCustomerParam = {
    userId: number;
};

export const $customer = createStore<Customer>(defaultCustomer);
export const loadCustomer = createEvent<LoadCustomerParam>();
const loadCustomerFx = createEffect<LoadCustomerParam, Customer, AxiosError>({
    async handler({userId}) {
        return await apiClient.get(`${baseUrl}/customers/byUser/${userId}`).then(({ data }) => data);
    }
});

const loadCartFromLocalStorage = (): CartItem[] => {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : [];
};

const doAddGoodToCart = (cart: CartItem[], newItem: AddGoodToCartParam) => {
    const existingItem = cart.find((item) => item.goodId === newItem.goodId);

    if (existingItem) {
        // Если товар уже есть в корзине, увеличиваем quantity на 1
        return cart.map((item) =>
            item.goodId === newItem.goodId ? { ...item, quantity: item.quantity + 1 } : item,
        );
    }

    // Если товара нет в корзине, добавляем его
    return [...cart, { ...newItem, quantity: 1 }];
};

// Хранилище корзины
export const $cart = createStore<CartItem[]>(loadCartFromLocalStorage());

// События для управления корзиной
export const addToCart = createEvent<AddGoodToCartParam>();
export const removeFromCart = createEvent<DeleteCartGoodParam>();
export const updateQuantity = createEvent<UpdateCartQuantityParam>();

const addGoodToCartFx = createEffect<AddGoodToCartWithCustomerParam, void, AxiosError>({
    async handler(addToCartParam) {
        await apiClient.post(`${baseUrl}/customers/cart`, addToCartParam)
            .then((response) => response.data);
    }
});

const removeGoodFromCartFx = createEffect<DeleteCartGoodParamWithCustomer, void, AxiosError>({
    async handler({goodId, customerId}) {
        await apiClient.delete(`${baseUrl}/customers/${customerId}/cart/${goodId}`)
            .then((response) => response.data);
    }
});

const updateCartItemQuantityFx = createEffect<UpdateCartQuantityParamWithCustomer, void, AxiosError>({
    async handler(param) {
        await apiClient.patch(`${baseUrl}/customers/cart`, param);
    }
});

sample({
    clock: loadCustomer,
    target: loadCustomerFx
});
sample({
    clock: loadCustomerFx.doneData,
    target: $customer
});
sample({
    clock: loadCustomerFx.doneData,
    fn: (customer) => customer.cart,
    target: $cart
});

sample({
    clock: addToCart,
    filter: () => isUserAuthenticatedWithRole($loggedUser.getState(), UserRole.CUSTOMER),
    fn: (addGoodToCartParam) => {
        return {
            ...addGoodToCartParam,
            customerId: $customer.getState().id
        };
    },
    target: addGoodToCartFx
});
sample({
    clock: removeFromCart,
    filter: () => isUserAuthenticatedWithRole($loggedUser.getState(), UserRole.CUSTOMER),
    fn: (request) => {
        return {
            ...request,
            customerId: $customer.getState().id
        };
    },
    target: removeGoodFromCartFx
});
sample({
    clock: updateQuantity,
    filter: () => isUserAuthenticatedWithRole($loggedUser.getState(), UserRole.CUSTOMER),
    fn: (request) => {
        return {
            ...request,
            customerId: $customer.getState().id
        };
    },
    target: updateCartItemQuantityFx
});

// Обработчики для событий
$cart
    .on(removeFromCart, (cart, param) => cart.filter((item) => item.goodId !== param.goodId))
    .on(addToCart, (cart, cartItem) => doAddGoodToCart(cart, cartItem))
    .on(updateQuantity, (cart, { goodId, quantity }) =>
        cart.map((item) => (item.goodId === goodId ? { ...item, quantity } : item)),
    );

$cart.watch((cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
});
