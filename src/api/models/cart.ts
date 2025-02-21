import {createEffect, createEvent, createStore, sample} from "effector";
import {AxiosError} from "axios";

export interface CartItem {
    goodId: number;
    storeId: number;
    categoryId: number;
    quantity: number;
}

type AddGoodToCartParam = {
    goodId: number;
    categoryId: number;
    storeId: number;
};

type UpdateCartQuantityParam = { goodId: number; quantity: number };

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
export const removeFromCart = createEvent<number>(); // Удаление товара по goodId
export const updateQuantity = createEvent<UpdateCartQuantityParam>(); // Изменение количества

const addGoodToCartFx = createEffect<AddGoodToCartParam, void, AxiosError>({
    async handler(addToCartParam) {
        // TODO: Отправлять POST запрос на создание записи
    }
});

const removeGoodFromCartFx = createEffect<number, void, AxiosError>({
    async handler(goodId) {
        // TODO: Отправлять DELETE запрос на удаление записи

    }
});

const updateCartItemQuantityFx = createEffect<UpdateCartQuantityParam, void, AxiosError>({
    async handler({goodId, quantity}) {
        // TODO: Отправлять PATCH запрос на удаление записи
    }
});

sample({
    clock: addToCart,
    target: addGoodToCartFx
});
sample({
    clock: removeFromCart,
    target: removeGoodFromCartFx
});
sample({
    clock: updateQuantity,
    target: updateCartItemQuantityFx
});

// Обработчики для событий
$cart
    .on(removeFromCart, (cart, goodId) => cart.filter((item) => item.goodId !== goodId))
    .on(addToCart, (cart, cartItem) => doAddGoodToCart(cart, cartItem))
    .on(updateQuantity, (cart, { goodId, quantity }) =>
        cart.map((item) => (item.goodId === goodId ? { ...item, quantity } : item)),
    );

$cart.watch((cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
});
