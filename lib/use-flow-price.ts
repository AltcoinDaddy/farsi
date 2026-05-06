'use client';

import React from 'react';

const FLOW_USD_FALLBACK = 0.65;

export function useFlowUsdPrice() {
    const [price, setPrice] = React.useState(FLOW_USD_FALLBACK);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;

        const fetchPrice = async () => {
            try {
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=flow&vs_currencies=usd'
                );
                const data = await response.json();
                const nextPrice = Number(data?.flow?.usd);

                if (isMounted && Number.isFinite(nextPrice) && nextPrice > 0) {
                    setPrice(nextPrice);
                    return;
                }
            } catch (error) {
                console.error('Failed to fetch FLOW price:', error);
            }

            if (isMounted) {
                setPrice(FLOW_USD_FALLBACK);
            }
        };

        fetchPrice().finally(() => {
            if (isMounted) {
                setIsLoading(false);
            }
        });

        return () => {
            isMounted = false;
        };
    }, []);

    return {
        flowUsdPrice: price,
        isLoadingFlowPrice: isLoading,
        isFallbackPrice: price === FLOW_USD_FALLBACK,
    };
}
