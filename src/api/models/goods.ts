import {Review} from "./reviews.ts";

export interface Good {
    id: number;
    name: string;
    description: string;
    price: number;
    storeId: number;
    categoryId: number;
    images: Array<GoodImage>;
    reviews: Array<Review>;
    discount?: GoodDiscount;
    options?: Array<GoodOption>;

    // reviews: Array<Review>;
    // originalPrice?: number;
    // image: string;
    // delivery: string;
    // isOriginal?: boolean;
}

export interface GoodDiscount {
    id: number;
    discountType: DiscountType;
    discountValue: number;
}

export interface GoodOption {
    id: number;
    name: string;
    description: string;
    price: number;
    goodImage: GoodImage;
    discount?: GoodDiscount;
}

export interface GoodImage {
    id: number;
    image: string;
}

export type SortOption = 'popular' | 'newest' | 'priceAsc' | 'priceDesc' | 'ratingHigh' | 'discountHigh';
export type DiscountType = 'percentage' | 'amount';

export const mockProducts: Good[] = [
    {
        id: 1,
        name: 'Товар 1',
        description: 'Товар 1',
        price: 3000,
        storeId: 1,
        categoryId: 2,
        reviews: [
            {
                id: 1,
                mark: 4.0,
                text: '',
                creationTime: new Date()
            },
            {
                id: 2,
                mark: 3.0,
                text: '',
                creationTime: new Date()
            },
        ],
        images: [
            {
                id: 1,
                image: 'https://ir.ozone.ru/s3/multimedia-1-4/wc350/7155132256.jpg'
            }
        ]
    },
    {
        id: 2,
        name: 'Товар 2',
        description: 'Товар 2',
        price: 6000,
        storeId: 1,
        categoryId: 2,
        reviews: [
            {
                id: 3,
                mark: 5,
                text: '',
                creationTime: new Date()
            },
            {
                id: 4,
                mark: 4,
                text: '',
                creationTime: new Date()
            },
        ],
        images: [
            {
                id: 2,
                image: 'https://ir.ozone.ru/s3/multimedia-1-c/wc1000/7154751816.jpg'
            }
        ]
    },
    {
        id: 3,
        name: 'Товар 3',
        description: 'Товар 3',
        price: 1000,
        storeId: 1,
        categoryId: 2,
        reviews: [
            {
                id: 5,
                mark: 3,
                text: '',
                creationTime: new Date()
            },
            {
                id: 6,
                mark: 2,
                text: '',
                creationTime: new Date()
            },
        ],
        images: [{
            id: 3,
            image: 'https://ir.ozone.ru/s3/multimedia-1-1/wc1000/7146538057.jpg'
        }]
    },
    {
        id: 4,
        name: 'Товар 4',
        description: 'Товар 4',
        price: 6000,
        storeId: 1,
        categoryId: 2,
        reviews: [],
        images: [{
            id: 4,
            image: 'https://ir.ozone.ru/s3/multimedia-1-7/wc1000/7141227763.jpg'
        }]
    },
];