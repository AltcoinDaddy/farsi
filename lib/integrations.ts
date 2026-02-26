/**
 * Farsi Integration Snippets
 * For PL Genesis Hackathon Preview
 */

export const Integrations = {
    /**
     * Ramp Network Widget Embed
     * Configured for Flow EVM
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
     * Flow EVM Paymaster Sponsored Tx Logic
     * Uses Flow's native gas abstraction features
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
