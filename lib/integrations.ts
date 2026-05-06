/**
 * Farsi integration snippets
 * These are illustrative demo stubs, not production integrations.
 */

export const Integrations = {
    /**
     * Ramp widget example for preview builds.
     */
    rampWidget: `
        new RampInstantSDK({
            hostAppName: 'Farsi DeFi',
            hostLogoUrl: 'https://farsi-app.xyz/logo.png',
            swapAsset: 'FLOW_USDC',
            userAddress: userAddress,
            url: 'https://app.ramp.network',
        }).show();
    `,

    /**
     * Conceptual sponsorship example.
     * This is a placeholder until a real paymaster path is wired in.
     */
    sponsoredTx: `
        // Flow EVM Sponsorship Implementation (Conceptual Stub)
        async function sendSponsoredTransaction(request) {
            const sponsoredRequest = await paymasterClient.sponsorTransaction({
                request,
                paymasterAddress: '0x...FLOW_PAYMASTER'
            });
            return walletClient.sendTransaction(sponsoredRequest);
        }
    `,

    /**
     * Shared Pot Contribution Transaction
     */
    potContribution: `
        const { writeContract } = useWriteContract();
        
        const handleContribute = (potAddress, amount) => {
            writeContract({
                address: potAddress,
                abi: SHARED_POT_ABI,
                functionName: 'contribute',
                value: parseEther(amount.toString()),
            });
        };
    `
};
