export interface Order {
    id: string;
    date: string;
    status: 'active' | 'completed';
    totalAmount: number;
    deliveryInfo: string;
    deliveryDate: string;
    products: Array<{
        id: number;
        name: string;
        image: string;
        price: number;
    }>;
}

// Моковые данные для заказов
export const orders: Order[] = [
    {
        id: '0189819059-0003',
        date: '1 февраля',
        status: 'completed',
        totalAmount: 353,
        deliveryInfo: 'Доставка в пункт выдачи',
        deliveryDate: '8 февраля в 16:06',
        products: [
            {
                id: 1,
                name: 'Товар 1',
                image: 'https://via.placeholder.com/50',
                price: 1200,
            },
            {
                id: 2,
                name: 'Товар 2',
                image: 'https://via.placeholder.com/50',
                price: 800,
            },
        ],
    },
    {
        id: '0189819059-0002',
        date: '8 января',
        status: 'completed',
        totalAmount: 285,
        deliveryInfo: 'Доставка в пункт выдачи',
        deliveryDate: '10 января в 14:31',
        products: [
            {
                id: 3,
                name: 'Товар 3',
                image: 'https://via.placeholder.com/50',
                price: 1500,
            },
        ],
    },
];