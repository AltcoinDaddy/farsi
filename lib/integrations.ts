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
            swapAsset: 'CUSD_USDC',
            userAddress: userAddress,
            url: 'https://app.ramp.network',
        }).show();
    `,

    /**
     * Conceptual sponsorship example.
     * This is a placeholder until a real paymaster path is wired in.
     */
    sponsoredTx: `
        // Celo sponsorship implementation (conceptual stub)
        async function sendSponsoredTransaction(request) {
            const sponsoredRequest = await paymasterClient.sponsorTransaction({
                request,
                paymasterAddress: '0x...CELO_PAYMASTER'
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
