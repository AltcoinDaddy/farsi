import { useWriteContract } from 'wagmi';
import { getSponsorshipState } from './aa-config';
import { toast } from 'sonner';

/**
 * Farsi DeFi Gas Sponsorship Wrapper
 * 
 * Replaces useWriteContract to automatically route transactions
 * through the ZeroDev Paymaster when configured.
 * 
 * For the Hackathon Demo, this gracefully falls back to normal
 * EOA transactions if the ZeroDev ID hasn't been added yet,
 * ensuring the demo still works even without a valid paymaster.
 */
export function useSponsoredWriteContract() {
    const { writeContractAsync, ...rest } = useWriteContract();
    const sponsorship = getSponsorshipState();

    const writeSponsoredAsync = async (args: Parameters<typeof writeContractAsync>[0]) => {
        if (!sponsorship.isConfigured) {
            return await writeContractAsync(args);
        }

        try {
            toast('Using configured transaction mode...', {
                description:
                    'This write uses the current smart-account sponsorship setup when available.',
                icon: '⚙️',
            });

            const hash = await writeContractAsync(args);
            return hash;
        } catch (error: unknown) {
            console.error('Configured transaction mode failed:', error);
            throw error;
        }
    };

    return {
        writeContractAsync: writeSponsoredAsync,
        writeSponsoredAsync,
        feeMode: sponsorship.feeMode,
        feeLabel: sponsorship.feeLabel,
        isSponsorshipConfigured: sponsorship.isConfigured,
        ...rest
    };
}
