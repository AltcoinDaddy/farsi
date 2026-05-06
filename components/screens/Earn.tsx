'use client';

import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useReadContract } from 'wagmi';
import { useSponsoredWriteContract } from '@/lib/useSponsoredTx';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import YieldVaultABI from '@/lib/abi/YieldVault.json';
import CUSDTokenABI from '@/lib/abi/MockUSDC.json';
import { formatUnits, parseUnits } from 'viem';
import { useRouter } from 'next/navigation';
import { celoSepoliaChain } from '@/lib/web3-config';
import { wagmiConfig } from '@/app/providers';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { toast } from 'sonner';
import { useNotifications } from '@/lib/notification-context';
import { createReceiptUrl } from '@/lib/receipts';
import { useActiveWalletAddress } from '@/lib/active-wallet';
import { getErrorMessage, validateTokenAmount } from '@/lib/transaction-validation';

export default function EarnScreen() {
    const router = useRouter();
    const { address } = useActiveWalletAddress();
    const { writeContractAsync, feeMode } = useSponsoredWriteContract();
    const [isUpdating, setIsUpdating] = React.useState(false);
    const [amount, setAmount] = React.useState('100');
    const { addNotification } = useNotifications();
    const amountValidation = validateTokenAmount(amount);

    // Fetch cUSD balance
    const { data: cUsdBalance, refetch: refetchCUSD } = useReadContract({
        address: CONTRACT_ADDRESSES.cUSD as `0x${string}`,
        abi: CUSDTokenABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // Fetch Vault shares balance
    const { data: vaultBalance, refetch: refetchVault } = useReadContract({
        address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
        abi: YieldVaultABI,
        functionName: 'balanceOf',
        args: address ? [address] : undefined,
        query: { enabled: !!address },
    });

    // Fetch USDC value of shares
    const { data: assetsValue } = useReadContract({
        address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
        abi: YieldVaultABI,
        functionName: 'convertToAssets',
        args: [vaultBalance || 0n],
    });

    // Fetch dynamic APY
    const { data: currentApyBps } = useReadContract({
        address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
        abi: YieldVaultABI,
        functionName: 'getCurrentAPY',
    });

    // Fetch allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: CONTRACT_ADDRESSES.cUSD as `0x${string}`,
        abi: CUSDTokenABI,
        functionName: 'allowance',
        args: address ? [address, CONTRACT_ADDRESSES.YieldVault] : undefined,
        query: { enabled: !!address },
    });
    const cUsdBalanceValue = typeof cUsdBalance === 'bigint' ? cUsdBalance : 0n;
    const vaultBalanceValue = typeof vaultBalance === 'bigint' ? vaultBalance : 0n;
    const assetsValueAmount = typeof assetsValue === 'bigint' ? assetsValue : 0n;
    const currentApy = typeof currentApyBps === 'bigint' ? currentApyBps : 450n;
    const allowanceValue = typeof allowance === 'bigint' ? allowance : 0n;

    const handleFundingHelp = () => {
        addNotification({
            title: 'Funding Needed',
            description: 'Use MiniPay Add Cash to fund your stablecoin balance',
            type: 'info',
            icon: 'payments'
        });
        toast.info('Open Add Cash', {
            description: 'Funding now goes through the MiniPay Add Cash flow.',
        });
        router.push('/buy');
    };

    const handleWithdraw = async () => {
        if (!address || !amount) return;
        if (!amountValidation.ok) {
            toast.error('Invalid amount', {
                description: amountValidation.message,
            });
            return;
        }
        setIsUpdating(true);

        try {
            console.log('Withdrawing from vault...');
            // We use withdraw function to specify exact asset amount to receive
            const withdrawHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
                abi: YieldVaultABI,
                functionName: 'withdraw',
                args: [amountValidation.amountWei, address, address],
                account: address,
                chain: celoSepoliaChain,
            });
            await waitForTransactionReceipt(wagmiConfig, { hash: withdrawHash });
            await Promise.all([refetchVault(), refetchCUSD(), refetchAllowance()]);
            toast.success('Withdrawal complete', {
                description: `${amount} cUSD has been returned to your wallet.`,
            });
            addNotification({
                title: 'Withdrawal Complete',
                description: `Withdrew ${amount} cUSD from your savings vault`,
                type: 'success',
                icon: 'account_balance_wallet'
            });
            router.push(createReceiptUrl(amount, 'Withdrew from Vault', withdrawHash, feeMode));
        } catch (error) {
            console.error('Withdraw failed:', error);
            toast.error('Withdrawal failed', {
                description: getErrorMessage(
                    error,
                    'Insufficient vault balance or transaction rejected.'
                ),
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const formattedCUSD = parseFloat(formatUnits(cUsdBalanceValue, 18)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const formattedVault = parseFloat(formatUnits(assetsValueAmount, 18)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const vaultShares = parseFloat(formatUnits(vaultBalanceValue, 18)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const displayApy = (Number(currentApy) / 100).toFixed(1);

    const handleDeposit = async () => {
        if (!address || !amount) return;
        if (!amountValidation.ok) {
            toast.error('Invalid amount', {
                description: amountValidation.message,
            });
            return;
        }
        setIsUpdating(true);

        try {
            // Step 1: Check and Approve if needed
            if (allowanceValue < amountValidation.amountWei) {
                console.log('Insufficient allowance, approving...');
                const approveHash = await writeContractAsync({
                    address: CONTRACT_ADDRESSES.cUSD as `0x${string}`,
                    abi: CUSDTokenABI,
                    functionName: 'approve',
                    args: [CONTRACT_ADDRESSES.YieldVault, parseUnits('10000', 18)], // Approve a larger amount for better UX
                    account: address,
                    chain: celoSepoliaChain,
                });
                await waitForTransactionReceipt(wagmiConfig, { hash: approveHash });
                await refetchAllowance();
            }

            // Step 2: Deposit
            console.log('Depositing to vault...');
            const depositHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
                abi: YieldVaultABI,
                functionName: 'deposit',
                args: [amountValidation.amountWei, address],
                account: address,
                chain: celoSepoliaChain,
            });
            await waitForTransactionReceipt(wagmiConfig, { hash: depositHash });

            // Final refresh
            await Promise.all([refetchCUSD(), refetchVault()]);
            toast.success('Deposit successful!', {
                description: `Successfully saved ${amount} cUSD in the vault.`,
            });
            addNotification({
                title: 'Deposit Successful',
                description: `Saved ${amount} cUSD in your vault`,
                type: 'success',
                icon: 'savings'
            });
            router.push(createReceiptUrl(amount, 'Saved in Vault', depositHash, feeMode));
        } catch (error) {
            console.error('Deposit flow failed:', error);
            toast.error('Deposit failed', {
                description: getErrorMessage(
                    error,
                    'Please ensure you have enough balance and try again.'
                ),
            });
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white dark:bg-[#1A1D2E] text-neutral-dark min-h-screen flex flex-col p-4 space-y-6">
            <header className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Earn Yield</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Save stablecoins on Celo Sepolia</p>
                </div>
                <div className="w-10 h-10 bg-success-light rounded-full flex items-center justify-center text-success">
                    <span className="material-symbols-outlined">payments</span>
                </div>
            </header>

            {/* Total Balance Card */}
            <div className="bg-success text-white rounded-2xl p-6 shadow-lg shadow-success/20">
                <p className="text-success-light/80 text-xs font-bold uppercase tracking-wider mb-1">Your Vault Value</p>
                <div className="flex items-baseline gap-1">
                    <h2 className="text-4xl font-bold mb-4">${formattedVault}</h2>
                    <span className="text-success-light text-sm mb-4">cUSD</span>
                </div>
                <div className="flex gap-4 border-t border-white/20 pt-4">
                    <div>
                        <p className="text-success-light/60 text-[10px] uppercase font-bold">Estimated APY</p>
                        <p className="font-bold text-sm">{displayApy}%*</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-success-light/60 text-[10px] uppercase font-bold text-right">Shares Balance</p>
                        <p className="font-bold text-sm text-right">{vaultShares} fYV</p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-800">Demo Yield Model</p>
                <p className="mt-1 text-xs font-bold leading-relaxed text-amber-900">
                    This vault uses simulated on-chain yield for testing. The APY shown here is not sourced from a live external lending protocol yet.
                </p>
            </div>

            {/* Amount Input */}
            <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Amount to Save</label>
                    <span className="text-[10px] text-slate-400 font-bold">Wallet: {formattedCUSD} cUSD</span>
                </div>
                <div className="relative group">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-slate-50 dark:bg-[#151825] border-2 border-slate-100 dark:border-[#2D3348] rounded-3xl p-6 text-3xl font-black text-slate-900 dark:text-white focus:border-primary outline-none transition-all pr-24"
                    />
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 font-black text-slate-400">
                        cUSD
                    </div>
                </div>
                <div className="flex gap-2">
                    {['100', '500', '1000'].map((val) => (
                        <button
                            key={val}
                            onClick={() => setAmount(val)}
                            className="bg-slate-50 dark:bg-[#151825] border border-slate-100 dark:border-[#2D3348] px-4 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1E2235] transition-colors"
                        >
                            ${val}
                        </button>
                    ))}
                    <button
                        onClick={handleFundingHelp}
                        disabled={!address}
                        className="ml-auto text-[11px] font-bold text-primary flex items-center gap-1 hover:opacity-70 disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[16px]">water_drop</span>
                        Open Add Cash
                    </button>
                </div>
                <p className="text-[10px] text-slate-400 font-medium px-1">
                    Funding is handled through your Celo wallet. MiniPay Add Cash is the preferred path for real use.
                </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4">
                    <button
                        onClick={handleWithdraw}
                        disabled={isUpdating || !amountValidation.ok || vaultBalanceValue === 0n}
                        className="bg-slate-100 dark:bg-[#1E2235] text-slate-900 dark:text-white py-5 rounded-3xl font-black text-lg hover:bg-slate-200 dark:hover:bg-[#252A3A] transition-all disabled:opacity-50 active:scale-95 border border-transparent dark:border-[#2D3348]"
                    >
                        Withdraw
                    </button>
                    <button
                        onClick={handleDeposit}
                        disabled={isUpdating || !amountValidation.ok}
                        className="bg-primary text-white py-5 rounded-3xl font-black text-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-95"
                    >
                    {isUpdating ? 'Saving...' : 'Deposit'}
                </button>
            </div>

            {/* Strategy Info */}
            <div className="flex-1 pb-12">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Vault Details</h3>
                <div className="bg-slate-50 dark:bg-[#151825] rounded-2xl p-4 space-y-4 border border-slate-100 dark:border-[#2D3348]">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Protocol Standard</span>
                        <span className="font-bold text-slate-900 dark:text-white italic tracking-tight">ERC-4626</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 dark:text-slate-400 font-medium">Risk Profile</span>
                        <span className="font-bold text-success flex items-center gap-1">
                            Minimal Risk
                        </span>
                    </div>
                </div>
                <div className="mt-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        Yield accrues from the demo vault logic in the contract, while deposits remain backed by the underlying stable token held in the vault.
                    </p>
                </div>
            </div>
        </div >
    );
}
