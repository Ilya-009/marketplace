import {createEvent, createStore} from "effector";

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
export const removeFromCart = createEvent<number>(); // Удаление товара по goodId
export const addToCart = createEvent<AddGoodToCartParam>();
export const updateQuantity = createEvent<{ goodId: number; quantity: number }>(); // Изменение количества

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
