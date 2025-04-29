import {createEffect, createEvent, createStore, sample} from 'effector';
import {AxiosError} from "axios";
import {apiClient, baseUrl} from "../lib";

export interface Property {
    id: number;
    key: string;
    displayName: string;
    settingType: SettingType;
    propertyGroup: PropertyGroup;
    allowedValues?: string[];
    fileName?: string;
    description: string;
    value: string;
    removable: boolean;
}

export enum SettingType {
    BOOLEAN = 'BOOLEAN',
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    SELECT = 'SELECT',
    IMAGE = 'IMAGE',
    DATE = 'DATE',
    COLOR = 'COLOR'
}

export enum PropertyGroup {
    MAIN = 'MAIN',
    UI = 'UI',
    LOGIC = 'LOGIC',
    PAYMENT = 'PAYMENT',
    DELIVERY = 'DELIVERY'
}

type LoadPropertiesParam = void;
type LoadPropertiesResult = Property[];

export const loadProperties = createEvent<LoadPropertiesParam>();
export const $properties = createStore<LoadPropertiesResult>([]);

const loadPropertiesFx = createEffect<LoadPropertiesParam, LoadPropertiesResult, AxiosError>({
    async handler() {
        return await apiClient.get(`${baseUrl}/properties`).then(({ data }) => data);
    }
});

sample({
    clock: loadProperties,
    target: loadPropertiesFx
});

sample({
    clock: loadPropertiesFx.doneData,
    target: $properties
});

export const mockSettings: Property[] = [
    {
        id: 1,
        key: 'ui.theme.color',
        displayName: 'Цветовая тема',
        settingType: SettingType.COLOR,
        propertyGroup: PropertyGroup.UI,
        description: 'Основной цвет интерфейса',
        value: '#3f51b5',
        removable: false
    },
    {
        id: 2,
        key: 'app.language',
        displayName: 'Язык приложения',
        settingType: SettingType.SELECT,
        propertyGroup: PropertyGroup.MAIN,
        allowedValues: ['ru', 'en', 'es', 'fr'],
        description: 'Язык интерфейса приложения',
        value: 'ru',
        removable: false
    },
    {
        id: 3,
        key: 'store.logo',
        displayName: 'Логотип магазина',
        settingType: SettingType.IMAGE,
        propertyGroup: PropertyGroup.UI,
        fileName: 'logo.png',
        description: 'Основной логотип в шапке сайта',
        value: 'https://cdn-icons-png.flaticon.com/256/5332/5332306.png',
        removable: true
    },
    {
        id: 4,
        key: 'payment.default.method',
        displayName: 'Метод оплаты по умолчанию',
        settingType: SettingType.SELECT,
        propertyGroup: PropertyGroup.PAYMENT,
        allowedValues: ['card', 'paypal', 'invoice'],
        description: 'Метод оплаты, предлагаемый по умолчанию',
        value: 'card',
        removable: true
    },
    {
        id: 5,
        key: 'notifications.enabled',
        displayName: 'Включить уведомления',
        settingType: SettingType.BOOLEAN,
        propertyGroup: PropertyGroup.MAIN,
        description: 'Глобальное включение/отключение уведомлений',
        value: 'true',
        removable: false
    },
    {
        id: 6,
        key: 'delivery.free.threshold',
        displayName: 'Порог бесплатной доставки',
        settingType: SettingType.NUMBER,
        propertyGroup: PropertyGroup.DELIVERY,
        description: 'Сумма заказа для бесплатной доставки',
        value: '5000',
        removable: true
    },
    {
        id: 7,
        key: 'ui.font.size',
        displayName: 'Размер шрифта',
        settingType: SettingType.NUMBER,
        propertyGroup: PropertyGroup.UI,
        description: 'Базовый размер шрифта в пикселях',
        value: '16',
        removable: true
    },
    {
        id: 8,
        key: 'app.timezone',
        displayName: 'Часовой пояс',
        settingType: SettingType.SELECT,
        propertyGroup: PropertyGroup.MAIN,
        allowedValues: ['UTC+3', 'UTC+5', 'UTC+7'],
        description: 'Часовой пояс системы',
        value: 'UTC+3',
        removable: false
    },
    {
        id: 9,
        key: 'payment.test.mode',
        displayName: 'Тестовый режим оплаты',
        settingType: SettingType.BOOLEAN,
        propertyGroup: PropertyGroup.PAYMENT,
        description: 'Включение тестового режима платежей',
        value: 'false',
        removable: true
    },
    {
        id: 10,
        key: 'delivery.default.provider',
        displayName: 'Служба доставки по умолчанию',
        settingType: SettingType.SELECT,
        propertyGroup: PropertyGroup.DELIVERY,
        allowedValues: ['courier', 'pickup', 'post'],
        description: 'Служба доставки, выбираемая по умолчанию',
        value: 'courier',
        removable: true
    },
    {
        id: 11,
        key: 'ui.dark.mode',
        displayName: 'Темный режим',
        settingType: SettingType.BOOLEAN,
        propertyGroup: PropertyGroup.UI,
        description: 'Включение темной темы интерфейса',
        value: 'false',
        removable: true
    },
    {
        id: 12,
        key: 'app.maintenance.mode',
        displayName: 'Режим технического обслуживания',
        settingType: SettingType.BOOLEAN,
        propertyGroup: PropertyGroup.MAIN,
        description: 'Включение режима техобслуживания',
        value: 'false',
        removable: false
    },
    {
        id: 13,
        key: 'store.contact.email',
        displayName: 'Контактный email',
        settingType: SettingType.STRING,
        propertyGroup: PropertyGroup.MAIN,
        description: 'Email для связи с магазином',
        value: 'contact@example.com',
        removable: true
    },
    {
        id: 14,
        key: 'product.reviews.enabled',
        displayName: 'Отзывы о товарах',
        settingType: SettingType.BOOLEAN,
        propertyGroup: PropertyGroup.LOGIC,
        description: 'Включение функционала отзывов',
        value: 'true',
        removable: true
    },
    {
        id: 15,
        key: 'ui.banner.image',
        displayName: 'Баннер на главной',
        settingType: SettingType.IMAGE,
        propertyGroup: PropertyGroup.UI,
        fileName: 'banner.jpg',
        description: 'Главный баннер на странице',
        value: 'https://storage.example.com/banner.jpg',
        removable: true
    },
    {
        id: 16,
        key: 'order.expiry.days',
        displayName: 'Срок действия заказа (дней)',
        settingType: SettingType.NUMBER,
        propertyGroup: PropertyGroup.LOGIC,
        description: 'Количество дней до автоматической отмены неоплаченного заказа',
        value: '7',
        removable: true
    },
    {
        id: 17,
        key: 'store.working.hours',
        displayName: 'Часы работы',
        settingType: SettingType.STRING,
        propertyGroup: PropertyGroup.MAIN,
        description: 'Часы работы магазина',
        value: '09:00-18:00',
        removable: true
    },
    {
        id: 18,
        key: 'search.suggestions.count',
        displayName: 'Количество подсказок поиска',
        settingType: SettingType.NUMBER,
        propertyGroup: PropertyGroup.LOGIC,
        description: 'Количество отображаемых подсказок при поиске',
        value: '5',
        removable: true
    },
    {
        id: 19,
        key: 'product.items.per.page',
        displayName: 'Товаров на странице',
        settingType: SettingType.NUMBER,
        propertyGroup: PropertyGroup.LOGIC,
        description: 'Количество товаров на одной странице каталога',
        value: '20',
        removable: true
    },
    {
        id: 20,
        key: 'newsletter.subscription.default',
        displayName: 'Подписка на рассылку по умолчанию',
        settingType: SettingType.BOOLEAN,
        propertyGroup: PropertyGroup.MAIN,
        description: 'Статус подписки на рассылку по умолчанию для новых пользователей',
        value: 'true',
        removable: true
    }
];