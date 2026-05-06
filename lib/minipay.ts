'use client';

import React from 'react';

type EthereumProvider = {
    isMiniPay?: boolean;
};

export const MINIPAY_ADD_CASH_URL = 'https://link.minipay.xyz/add_cash?tokens=CUSD';

function getEthereumProvider(): EthereumProvider | undefined {
    if (typeof window === 'undefined') {
        return undefined;
    }

    return (window as Window & { ethereum?: EthereumProvider }).ethereum;
}

export function isMiniPayEnvironment() {
    return getEthereumProvider()?.isMiniPay === true;
}

export function openMiniPayAddCash() {
    if (typeof window === 'undefined') {
        return;
    }

    window.open(MINIPAY_ADD_CASH_URL, '_blank');
}

export function useMiniPay() {
    const [isMiniPay, setIsMiniPay] = React.useState(false);
    const [hasEthereumProvider, setHasEthereumProvider] = React.useState(false);

    React.useEffect(() => {
        setHasEthereumProvider(!!getEthereumProvider());
        setIsMiniPay(isMiniPayEnvironment());
    }, []);

    return {
        isMiniPay,
        hasEthereumProvider,
    };
}
