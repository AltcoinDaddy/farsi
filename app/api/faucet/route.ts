import { NextRequest, NextResponse } from 'next/server';
import {
    Contract,
    type InterfaceAbi,
    JsonRpcProvider,
    Wallet,
    parseUnits,
} from 'ethers';
import { isAddress } from 'viem';
import MockUSDCABI from '@/lib/abi/MockUSDC.json';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import { flowEVMTestnet } from '@/lib/web3-config';

export const runtime = 'nodejs';

const FAUCET_AMOUNT = parseUnits('1000', 18);
const FAUCET_COOLDOWN_MS = 10 * 60 * 1000;
const faucetClaims = new Map<string, number>();
const mockUsdcAbi = MockUSDCABI as InterfaceAbi;

type FaucetRequestBody = {
    address?: string;
};

type FaucetTokenContract = Contract & {
    owner(): Promise<string>;
    mint(
        address: `0x${string}`,
        amount: bigint
    ): Promise<{ hash: string; wait(): Promise<unknown> }>;
};

function getConfiguredPrivateKey() {
    const rawKey = process.env.FAUCET_PRIVATE_KEY || process.env.PRIVATE_KEY;
    if (!rawKey) return null;

    return rawKey.startsWith('0x') ? rawKey : `0x${rawKey}`;
}

export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as FaucetRequestBody;
        const address = body?.address;

        if (!isAddress(address)) {
            return NextResponse.json(
                { message: 'A valid wallet address is required.' },
                { status: 400 }
            );
        }

        const lastClaimAt = faucetClaims.get(address.toLowerCase());
        if (lastClaimAt && Date.now() - lastClaimAt < FAUCET_COOLDOWN_MS) {
            const remainingMinutes = Math.ceil(
                (FAUCET_COOLDOWN_MS - (Date.now() - lastClaimAt)) / 60000
            );

            return NextResponse.json(
                { message: `This wallet already claimed test funds. Try again in about ${remainingMinutes} minute(s).` },
                { status: 429 }
            );
        }

        const privateKey = getConfiguredPrivateKey();
        if (!privateKey) {
            return NextResponse.json(
                { message: 'The faucet is not configured yet. Add FAUCET_PRIVATE_KEY or PRIVATE_KEY on the server.' },
                { status: 503 }
            );
        }

        const rpcUrl =
            process.env.NEXT_PUBLIC_FLOW_RPC ||
            flowEVMTestnet.rpcUrls.default.http[0];
        const provider = new JsonRpcProvider(rpcUrl, {
            chainId: flowEVMTestnet.id,
            name: flowEVMTestnet.name,
        });
        const wallet = new Wallet(privateKey, provider);
        const tokenContract = new Contract(
            CONTRACT_ADDRESSES.mUSDC,
            mockUsdcAbi,
            wallet
        ) as FaucetTokenContract;

        const owner = await tokenContract.owner();

        if (owner.toLowerCase() !== wallet.address.toLowerCase()) {
            return NextResponse.json(
                { message: 'The configured faucet key does not control the current mUSDC contract.' },
                { status: 503 }
            );
        }

        const tx = await tokenContract.mint(address, FAUCET_AMOUNT);
        await tx.wait();
        faucetClaims.set(address.toLowerCase(), Date.now());

        return NextResponse.json({
            amount: '1000',
            hash: tx.hash,
            message: '1,000 mUSDC has been added to the wallet.',
        });
    } catch (error) {
        console.error('Faucet route failed:', error);
        return NextResponse.json(
            { message: 'The faucet request could not be completed right now.' },
            { status: 500 }
        );
    }
}
