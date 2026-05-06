'use client';

import React from 'react';

type EthereumProvider = {
    isMiniPay?: boolean;
};

function getEthereumProvider(): EthereumProvider | undefined {
    if (typeof window === 'undefined') {
        return undefined;
    }

    return (window as Window & { ethereum?: EthereumProvider }).ethereum;
}

export function isMiniPayEnvironment() {
    return getEthereumProvider()?.isMiniPay === true;
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
