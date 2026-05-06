'use client';

import React from 'react';

const CELO_USD_FALLBACK = 0.78;

export function useCeloUsdPrice() {
    const [price, setPrice] = React.useState(CELO_USD_FALLBACK);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        let isMounted = true;

        const fetchPrice = async () => {
            try {
                const response = await fetch(
                    'https://api.coingecko.com/api/v3/simple/price?ids=celo&vs_currencies=usd'
                );
                const data = await response.json();
                const nextPrice = Number(data?.celo?.usd);

                if (isMounted && Number.isFinite(nextPrice) && nextPrice > 0) {
                    setPrice(nextPrice);
                    return;
                }
            } catch (error) {
                console.error('Failed to fetch CELO price:', error);
            }

            if (isMounted) {
                setPrice(CELO_USD_FALLBACK);
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
        celoUsdPrice: price,
        isLoadingCeloPrice: isLoading,
        isFallbackPrice: price === CELO_USD_FALLBACK,
    };
}
