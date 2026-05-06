import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
    return NextResponse.json(
        {
            message:
                'Mock token minting is retired. Fund your wallet with Celo Sepolia stablecoins or use MiniPay Add Cash.',
        },
        { status: 410 }
    );
}
