'use client';

import React from 'react';

type EthereumProvider = {
    isMiniPay?: boolean;
};

export const MINIPAY_ADD_CASH_URL = 'https://link.minipay.xyz/add_cash?tokens=CUSD';
export const MINIPAY_DISCOVER_URL = 'https://link.minipay.xyz/discover';
export const MINIPAY_QR_URL = 'https://link.minipay.xyz/qr';
export const MINIPAY_INVITE_FRIENDS_URL = 'https://link.minipay.xyz/invite_friends';

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

export function getMiniPayAppUrl() {
    if (typeof window === 'undefined') {
        return process.env.NEXT_PUBLIC_MINIPAY_APP_URL || null;
    }

    const configuredUrl = process.env.NEXT_PUBLIC_MINIPAY_APP_URL;
    if (configuredUrl) {
        return configuredUrl;
    }

    const { origin, hostname, protocol } = window.location;
    const isLocalhost =
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname === '0.0.0.0';

    if (protocol === 'https:' && !isLocalhost) {
        return origin;
    }

    return null;
}

export function createMiniPayBrowseUrl() {
    const appUrl = getMiniPayAppUrl();

    if (!appUrl) {
        return null;
    }

    return `https://link.minipay.xyz/browse?url=${encodeURIComponent(appUrl)}`;
}

export function openMiniPayBrowse() {
    if (typeof window === 'undefined') {
        return false;
    }

    const browseUrl = createMiniPayBrowseUrl();
    if (!browseUrl) {
        return false;
    }

    window.open(browseUrl, '_blank');
    return true;
}

export function openMiniPayDiscover() {
    if (typeof window === 'undefined') {
        return;
    }

    window.open(MINIPAY_DISCOVER_URL, '_blank');
}

export function openMiniPayQr() {
    if (typeof window === 'undefined') {
        return;
    }

    window.open(MINIPAY_QR_URL, '_blank');
}

export function openMiniPayInviteFriends() {
    if (typeof window === 'undefined') {
        return;
    }

    window.open(MINIPAY_INVITE_FRIENDS_URL, '_blank');
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
