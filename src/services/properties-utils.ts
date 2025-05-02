import {$properties, MarketplaceType} from "../api";
import {getSelectProperty} from "./properties-service.ts";

export const getMarketplaceType = (): MarketplaceType => {
    const properties = $properties.getState();
    const marketplaceType = getSelectProperty(properties, 'marketplace.type');
    if (marketplaceType === 'Товары') {
        return MarketplaceType.GOODS;
    }

    return MarketplaceType.SERVICES;
};