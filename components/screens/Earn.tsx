'use client';

import React from 'react';
import { usePrivy } from '@/lib/mock-privy';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { CONTRACT_ADDRESSES } from '@/lib/contracts';
import YieldVaultABI from '@/lib/abi/YieldVault.json';
import MockUSDCABI from '@/lib/abi/MockUSDC.json';
import { formatUnits, parseUnits } from 'viem';
import { useRouter } from 'next/navigation';
import { flowEVMTestnet, config } from '@/lib/web3-config';
import { waitForTransactionReceipt } from 'wagmi/actions';

export default function EarnScreen() {
    const router = useRouter();
    const { user } = usePrivy();
    const { writeContractAsync } = useWriteContract();
    const [isUpdating, setIsUpdating] = React.useState(false);

    // Fetch mUSDC balance
    const { data: usdcBalance, refetch: refetchUSDC } = useReadContract({
        address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'balanceOf',
        args: [user?.wallet?.address],
    });

    // Fetch Vault shares balance
    const { data: vaultBalance, refetch: refetchVault } = useReadContract({
        address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
        abi: YieldVaultABI,
        functionName: 'balanceOf',
        args: [user?.wallet?.address],
    });

    // Fetch USDC value of shares
    const { data: assetsValue } = useReadContract({
        address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
        abi: YieldVaultABI,
        functionName: 'convertToAssets',
        args: [vaultBalance || 0n],
    });

    // Fetch allowance
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
        abi: MockUSDCABI,
        functionName: 'allowance',
        args: [user?.wallet?.address, CONTRACT_ADDRESSES.YieldVault],
    });

    const handleFaucet = async () => {
        if (!user?.wallet?.address) return;
        setIsUpdating(true);

        const walletAddress = user.wallet.address as `0x${string}`;
        try {
            console.log('Minting 1000 mUSDC...');
            const mintHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                abi: MockUSDCABI,
                functionName: 'mint',
                args: [walletAddress, parseUnits('1000', 18)],
                account: walletAddress,
                chain: flowEVMTestnet,
            });
            await waitForTransactionReceipt(config, { hash: mintHash });
            await refetchUSDC();
            console.log('Minted successful!');
        } catch (error) {
            console.error('Faucet failed:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleWithdraw = async () => {
        if (!user?.wallet?.address || !vaultBalance || (vaultBalance as bigint) === 0n) return;
        setIsUpdating(true);

        const walletAddress = user.wallet.address as `0x${string}`;
        try {
            console.log('Withdrawing from vault...');
            const withdrawHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
                abi: YieldVaultABI,
                functionName: 'redeem',
                args: [vaultBalance, walletAddress, walletAddress],
                account: walletAddress,
                chain: flowEVMTestnet,
            });
            await waitForTransactionReceipt(config, { hash: withdrawHash });
            await Promise.all([refetchVault(), refetchUSDC(), refetchAllowance()]);
            console.log('Withdrawal successful!');
        } catch (error) {
            console.error('Withdraw failed:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    const formattedUSDC = usdcBalance ? parseFloat(formatUnits(usdcBalance as bigint, 18)).toFixed(2) : '0.00';
    const formattedVault = assetsValue ? parseFloat(formatUnits(assetsValue as bigint, 18)).toFixed(2) : '0.00';
    const vaultShares = vaultBalance ? parseFloat(formatUnits(vaultBalance as bigint, 18)).toFixed(2) : '0.00';

    const handleDeposit = async () => {
        if (!user?.wallet?.address) return;
        setIsUpdating(true);

        const walletAddress = user.wallet.address as `0x${string}`;
        const depositAmount = parseUnits('1', 18); // Demo amount: $1

        try {
            // Step 1: Check and Approve if needed
            const currentAllowance = (allowance as bigint) || 0n;
            if (currentAllowance < depositAmount) {
                console.log('Insufficient allowance, approving...');
                const approveHash = await writeContractAsync({
                    address: CONTRACT_ADDRESSES.mUSDC as `0x${string}`,
                    abi: MockUSDCABI,
                    functionName: 'approve',
                    args: [CONTRACT_ADDRESSES.YieldVault, parseUnits('100', 18)], // Approve $100 for convenience
                    account: walletAddress,
                    chain: flowEVMTestnet,
                });
                await waitForTransactionReceipt(config, { hash: approveHash });
                await refetchAllowance();
            }

            // Step 2: Deposit
            console.log('Depositing to vault...');
            const depositHash = await writeContractAsync({
                address: CONTRACT_ADDRESSES.YieldVault as `0x${string}`,
                abi: YieldVaultABI,
                functionName: 'deposit',
                args: [depositAmount, walletAddress],
                account: walletAddress,
                chain: flowEVMTestnet,
            });
            await waitForTransactionReceipt(config, { hash: depositHash });

            // Final refresh
            await Promise.all([refetchUSDC(), refetchVault()]);
            console.log('Deposit successful!');
        } catch (error) {
            console.error('Deposit flow failed:', error);
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <div className="bg-white text-neutral-dark min-h-screen flex flex-col p-4 space-y-6">
            <header className="flex justify-between items-center mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-dark">Earn Yield</h1>
                    <p className="text-sm text-neutral-muted">Put your assets to work</p>
                </div>
                <div className="w-10 h-10 bg-success-light rounded-full flex items-center justify-center text-success">
                    <span className="material-symbols-outlined">payments</span>
                </div>
            </header>

            {/* Total Balance Card */}
            <div className="bg-success text-white rounded-2xl p-6 shadow-lg shadow-success/20">
                <p className="text-success-light/80 text-xs font-bold uppercase tracking-wider mb-1">Total Yield Balance</p>
                <div className="flex items-baseline gap-1">
                    <h2 className="text-4xl font-bold mb-4">${formattedVault}</h2>
                    <span className="text-success-light text-sm mb-4">mUSDC</span>
                </div>
                <div className="flex gap-4 border-t border-white/20 pt-4">
                    <div>
                        <p className="text-success-light/60 text-[10px] uppercase font-bold">APY</p>
                        <p className="font-bold">4.5%*</p>
                    </div>
                    <div>
                        <p className="text-success-light/60 text-[10px] uppercase font-bold">Vault Shares</p>
                        <p className="font-bold">{vaultShares} fYV</p>
                    </div>
                </div>
            </div>

            {/* Available Assets */}
            <div>
                <h3 className="text-sm font-bold text-neutral-muted mb-4 uppercase tracking-wider">Available to Deposit</h3>
                <div className="bg-white rounded-xl p-4 border border-gray-100 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-background-light rounded-full flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined">monetization_on</span>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-neutral-dark">Mock USDC</p>
                            <div className="flex items-center gap-2">
                                <p className="text-xs text-neutral-muted">Wallet: {formattedUSDC} mUSDC</p>
                                <button
                                    onClick={handleFaucet}
                                    disabled={isUpdating}
                                    className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded font-bold hover:bg-primary/20 disabled:opacity-50"
                                >
                                    Get 1000
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleWithdraw}
                            disabled={isUpdating || !vaultBalance || (vaultBalance as bigint) === 0n}
                            className="bg-neutral-light text-neutral-dark px-4 py-2 rounded-lg font-bold text-sm hover:bg-neutral-light/80 transition-colors disabled:opacity-50"
                        >
                            Withdraw
                        </button>
                        <button
                            onClick={handleDeposit}
                            disabled={isUpdating}
                            className="bg-primary text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            Deposit
                        </button>
                    </div>
                </div>
            </div>

            {/* Strategy Info */}
            <div className="flex-1">
                <h3 className="text-sm font-bold text-neutral-muted mb-4 uppercase tracking-wider">Strategy Info</h3>
                <div className="bg-background-light rounded-xl p-4 space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-muted">Protocol</span>
                        <span className="font-bold text-neutral-dark">Farsi Vault (ERC-4626)</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-muted">Network</span>
                        <span className="font-bold text-neutral-dark">Flow EVM Testnet</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-neutral-muted">Safety Score</span>
                        <span className="font-bold text-success flex items-center gap-1">
                            <span className="material-symbols-outlined text-xs material-symbols-filled">verified_user</span>
                            9.8/10
                        </span>
                    </div>
                </div>
            </div>

            <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                <p className="text-xs text-neutral-muted leading-relaxed">
                    Yield is generated through the YieldVault smart contract. Deposits are secure and can be withdrawn at any time.
                </p>
            </div>
        </div >
    );
}
