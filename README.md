# Farsi - Consumer DeFi on Flow EVM

**Premium finance for everyone.** Farsi is a mobile-first, non-custodial Consumer DeFi application built specifically for the Flow EVM network. Designed for the PL Genesis Hackathon.

## 🚀 Vision
Farsi bridges the gap between traditional banking UX and decentralized finance. We focus on:
1. **Familiar UX**: Designed like an everyday finance app (no "crypto" jargon where possible).
2. **Gas Abstraction**: Powered by Flow EVM's sponsored transaction capabilities.
3. **Consumer Utility**: Buy crypto, earn yield, and save together with friends (Social Pots).

## 🛠 Build Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS.
- **PWA**: `next-pwa` for offline support and native installation.
- **Web3**: Wagmi, viem, RainbowKit.
- **Network**: [Flow EVM Testnet](https://evm-testnet.flowscan.io) (Chain ID: 545).
- **Contracts**: Solidity ^0.8.20 (YieldVault, SharedPotFactory).

## 📦 Installation & Setup

1. **Clone the project & Install dependencies:**
   ```bash
   cd farsi
   npm install
   ```

2. **Environment Variables:**
   Create a `.env.local` file:
   ```env
   NEXT_PUBLIC_WC_PROJECT_ID=your_rainbowkit_project_id
   NEXT_PUBLIC_FLOW_RPC=https://testnet.evm.nodes.onflow.org
   ```

3. **Run Locally:**
   ```bash
   npm run dev
   ```

## 🔗 Adding Flow EVM to your Wallet
- **Network Name**: Flow EVM Testnet
- **RPC URL**: `https://testnet.evm.nodes.onflow.org`
- **Chain ID**: `545`
- **Currency Symbol**: `FLOW`
- **Block Explorer**: `https://evm-testnet.flowscan.io`

## 🏁 User Journey for Hackathon Demo
1. **Connect**: Link your wallet via RainbowKit.
2. **Buy**: Mock flow for card-to-USDC via Ramp snippet.
3. **Earn**: Deposit idle USDC into the `YieldVault` to start earning 4.5% APY.
4. **Social**: Create a "Social Pot" (e.g., "Japan Trip 2026"), set a target, and invite friends to contribute.
5. **Send**: Intuitive peer-to-peer transfers (sponsored by Farsi paymaster).

## 🚩 PWA Instructions
- Open the app in Chrome/Safari on mobile.
- Tap "Add to Home Screen".
- App functions offline and loads instantly with Farsi branding.

---
*Built for the PL Genesis Hackathon — Flow Consumer DeFi Track.*
