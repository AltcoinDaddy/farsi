import { isAddress, parseUnits } from 'viem';

export function getErrorMessage(error: unknown, fallback: string) {
    return error instanceof Error && error.message ? error.message : fallback;
}

export function validateTokenAmount(
    value: string,
    symbol = 'mUSDC',
    decimals = 18
) {
    const trimmed = value.trim();

    if (!trimmed) {
        return { ok: false as const, message: `Enter an amount in ${symbol}.` };
    }

    const numericValue = Number(trimmed);
    if (!Number.isFinite(numericValue) || numericValue <= 0) {
        return { ok: false as const, message: `Enter a valid ${symbol} amount greater than 0.` };
    }

    try {
        const amountWei = parseUnits(trimmed, decimals);
        if (amountWei <= 0n) {
            return { ok: false as const, message: `Enter a valid ${symbol} amount greater than 0.` };
        }

        return {
            ok: true as const,
            amountWei,
            normalized: trimmed,
        };
    } catch {
        return { ok: false as const, message: `Enter a valid ${symbol} amount.` };
    }
}

export function validateRecipientAddress(
    recipient: string,
    sender?: `0x${string}`
) {
    const trimmed = recipient.trim();

    if (!trimmed) {
        return { ok: false as const, message: 'Enter a recipient wallet address.' };
    }

    if (!isAddress(trimmed)) {
        return { ok: false as const, message: 'Enter a valid Flow EVM wallet address.' };
    }

    const normalized = trimmed as `0x${string}`;
    if (sender && normalized.toLowerCase() === sender.toLowerCase()) {
        return { ok: false as const, message: 'Choose a different recipient wallet.' };
    }

    return {
        ok: true as const,
        normalized,
    };
}
