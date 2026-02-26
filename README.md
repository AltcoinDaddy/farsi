# 🇮🇷 Farsi - Premium Consumer DeFi on Flow EVM

**Simple. Social. Yield-Bearing.**  
Farsi is a mobile-first, non-custodial finance application designed to bring the power of Decentralized Finance (DeFi) to everyday users through the high-performance [Flow EVM](https://flow.com/evm) network.

Built for the **PL Genesis Hackathon**, Farsi reimagines how users interact with their money—removing crypto complexity while retaining the security of self-custody.

---

## 📸 Overview
<div align="center">
  <img src="screenshots/dashboard.png" width="24%" alt="Dashboard" />
  <img src="screenshots/earn.png" width="24%" alt="Earn" />
  <img src="screenshots/social.png" width="24%" alt="Social" />
  <img src="screenshots/onboarding.png" width="24%" alt="Onboarding" />
</div>

---

## ✨ Core Features

### 💰 Farsi Earn (Yield Vault)
Turn idle assets into productive ones. Farsi utilizes an **ERC-4626 standard Yield Vault** allowing users to deposit `mUSDC` and earn automated yields.
- **Real-time Stats**: Track your vault shares and current asset valuation.
- **Instant Liquidity**: Deposit and withdraw anytime with low fees.

### 🤝 Social Pots (Joint Savings)
Save for life's big goals with friends. Social Pots allow group contributions to a shared smart contract.
- **Goal Tracking**: Set a target amount and track progress collectively.
- **Creator Controlled**: Only the pot creator can withdraw funds once the target is met.
- **Transparent**: All contributions are tracked on-chain for the group to see.

### ⛽ Gas Abstraction & Premium UX
Farsi is designed for mass adoption:
- **Sponsored Transactions**: No need for users to worry about gas fees (Powered by Flow's native gas abstraction).
- **Mobile First**: Fully optimized Progressive Web App (PWA) with "Add to Home Screen" support.
- **Non-Custodial**: Powered by **Privy / RainbowKit** for secure, social-login supported wallet management.

---

## 🛠 Tech Stack

### Frontend & Web3
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Wallet Interaction**: [Wagmi](https://wagmi.sh/), [viem](https://viem.sh/), [RainbowKit](https://www.rainbowkit.com/)
- **Auth**: [Privy](https://privy.io/) (Social Login Support)
- **PWA**: `next-pwa` for native mobile feel.

### Smart Contracts (Solidity)
- **Standard**: ERC-20 (MockUSDC), ERC-4626 (YieldVault)
- **Factory Pattern**: SharedPotFactory for deploying individual group savings contracts.
- **Tools**: Hardhat, OpenZeppelin.

---

## 📍 Deployment Details (Flow EVM Testnet)

Farsi is live on the Flow EVM Testnet (Chain ID: `545`).

| Contract | Address |
| :--- | :--- |
| **Mock mUSDC** | `0x63F28bF688e38429E4123503cdba1A9237aAe8B9` |
| **Yield Vault** | `0x8DF0868e0f0c00C73e2315C74D6CFaD42Db4bBD2` |
| **SharedPotFactory** | `0x77326e1532e97f9022D15a5D1d186e196c853abC` |

---

## 🚀 Getting Started

### 1. Installation
```bash
git clone https://github.com/AltcoinDaddy/farsi.git
cd farsi
npm install
```

### 2. Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_WC_PROJECT_ID=your_rainbowkit_project_id
NEXT_PUBLIC_FLOW_RPC=https://testnet.evm.nodes.onflow.org
PRIVATE_KEY=your_private_key_for_deployments
```

### 3. Local Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🏁 Hackathon Journey
If you are testing the app for the hackathon:
1.  **Fund your wallet**: Use the "Get 1000" faucet button on the **Earn** screen to get test `mUSDC`.
2.  **Deposit**: Put some `mUSDC` into the vault.
3.  **Start a Pot**: Go to the **Social** screen and create a new pot.
4.  **Contribute**: Add funds to any active pot.

---

*Built for the **PL Genesis Hackathon** — Flow Consumer DeFi Track.*
