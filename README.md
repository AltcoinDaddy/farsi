# 🇮🇷 Farsi: Financial Empowerment for New Frontiers

Farsi is a premium mobile-first Decentralized Finance (DeFi) application built on **Flow EVM**. It simplifies complex blockchain interactions into a natural, high-fidelity experience, enabling users to save, earn, and spend their digital assets effortlessly.

## 🚀 Live Features

Farsi has successfully transitioned from a prototype to a **fully functional application** integrated with the Flow EVM Testnet:

- **💳 Live Wallet**: Real-time balance fetching for mUSDC and FLOW directly from the blockchain.
- **📈 Dynamic Earn**: Specify exact amounts to deposit into or withdraw from yield-generating vaults.
- **👥 Social Pots**: Create custom savings goals with friends, set specific targets, and track progress on-chain.
- **💸 P2P Transfers**: Send mUSDC to any address with real-time transaction confirmation.
- **🛍️ Integrated Spend**: Purchase category-based gift cards (Shopping, Travel, Lifestyle) directly with mUSDC.
- **⚡ Ramp Onramp**: A seamless, high-fidelity gateway to move from fiat to crypto within seconds.

## 🛠️ Tech Stack

- **Blockchain**: Flow EVM (Testnet)
- **Account Abstraction**: ZeroDev & Privy (Smart Wallets for seamless UX)
- **Frontend**: Next.js 14, Tailwind CSS, Wagmi, Viem
- **Smart Contracts**: Solidity (Yield Vaults, Shared Pots, Mock USDC)

## 📦 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-repo/farsi.git
    cd farsi
    ```
2.  **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```
3.  **Configure environment**:
    Create a `.env.local` file with your project IDs:
    ```env
    NEXT_PUBLIC_WC_PROJECT_ID=...
    NEXT_PUBLIC_PRIVY_APP_ID=...
    NEXT_PUBLIC_ZERODEV_PROJECT_ID=...
    NEXT_PUBLIC_FLOW_RPC=...
    ```
4.  **Run locally**:
    ```bash
    npm run dev
    ```

## 📸 Overview

<div align="center">
  <img src="public/screenshots/dashboard.png" width="32%" alt="Dashboard" />
  <img src="public/screenshots/earn.png" width="32%" alt="Earn" />
  <img src="public/screenshots/social.png" width="32%" alt="Social" />
</div>

<div align="center">
  <img src="public/screenshots/buy.png" width="32%" alt="Buy Crypto" />
  <img src="public/screenshots/receipt.png" width="32%" alt="Receipt" />
  <img src="public/screenshots/receipt-share.png" width="32%" alt="Share Receipt" />
</div>

---
*Built for the Flow Hacker House 2024.*

---

## ✨ What counts?

### 💰 **Farsi Earn: Set it and Forget it**
Don't let your money sit idle. Slip your `mUSDC` into our Earn vault and watch it grow. It uses the industry-standard ERC-4626 vault protocol, so you get the best security and instant access to your funds whenever you need them. No lock-ups, no catch.

### 🤝 **Social Pots: Bigger Goals, Together**
Saving for a group gift? Planning the ultimate road trip? Social Pots let you and your friends pool funds together in a transparent, on-chain way. 
- **Stay on Track**: Set a goal and see exactly how close the group is to hitting it.
- **Creator Rules**: Only the pot creator can pull the trigger on a withdrawal once the target is reached, keeping things organized and safe.

### ⛽ **Magic Behind the Scenes**
- **No More "Gas"**: Thanks to Flow EVM's sponsored transactions, the fees are on us. You just click and go.
- **Always With You**: Farsi is a Progressive Web App (PWA). Just "Add to Home Screen" and it's there whenever you need it, even if your connection is spotty.
- **Log in your way**: No complicated setup. Use your social logins through Privy and you're in.

---

## 🛠 What's under the hood?

We use the best tech in the game to keep things fast, secure, and beautiful.
- **Frontend**: Next.js 14 & Tailwind CSS (for that premium feel).
- **Web3 Tools**: Wagmi & RainbowKit (making wallet connections a breeze).
- **Smart Contracts**: Solidity (Standard-setting ERC-20 & ERC-4626).
- **Network**: Flow EVM Testnet (Chain ID: 545).

---

## 📍 Where we're live (Testnet)

| Asset / Contract | Address |
| :--- | :--- |
| **Mock mUSDC** | `0x63F28bF688e38429E4123503cdba1A9237aAe8B9` |
| **Yield Vault** | `0x8DF0868e0f0c00C73e2315C74D6CFaD42Db4bBD2` |
| **SharedPotFactory** | `0x77326e1532e97f9022D15a5D1d186e196c853abC` |

---

## 🚀 Jump In

### 1. Set it up
```bash
git clone https://github.com/AltcoinDaddy/farsi.git
cd farsi
npm install
```

### 2. Configure
Toss your keys into a `.env.local` file:
```env
NEXT_PUBLIC_WC_PROJECT_ID=your_rainbowkit_project_id
NEXT_PUBLIC_FLOW_RPC=https://testnet.evm.nodes.onflow.org
PRIVATE_KEY=your_private_key
```

### 3. Go Live
```bash
npm run dev
```

---

## 🏁 How to Demo
If you're checking us out for the **PL Genesis Hackathon**:
1.  **Get funded**: Head to the **Earn** screen and tap the "Get 1000" button for your test funds.
2.  **Grow it**: Deposit some of that into the vault.
3.  **Start a movement**: Create a Social Pot and see how easy it is to save with the group.

---
