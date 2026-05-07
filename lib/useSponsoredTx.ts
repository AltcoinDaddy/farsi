import { useWriteContract } from 'wagmi';
import { getSponsorshipState } from './aa-config';
import { toast } from 'sonner';

/**
 * Transaction write wrapper
 *
 * Uses the standard wallet write path by default and only surfaces
 * alternate transaction routing when the current environment has it configured.
 */
export function useSponsoredWriteContract() {
    const { writeContractAsync, ...rest } = useWriteContract();
    const sponsorship = getSponsorshipState();

    const writeSponsoredAsync = async (args: Parameters<typeof writeContractAsync>[0]) => {
        if (!sponsorship.isConfigured) {
            return await writeContractAsync(args);
        }

        try {
            toast('Using configured transaction route...', {
                description:
                    'This write uses the current environment configuration for transaction routing.',
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
